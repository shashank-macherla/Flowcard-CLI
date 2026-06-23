import type { FlowcardClientContext } from "./context.js";
import type { CloudStorageConnection, CloudStorageFile } from "./methods.js";

export type RequestOptions = {
  auth?: boolean;
  timeoutMs?: number;
  /** Max retry attempts for transient failures. Defaults to 2 for idempotent
   * methods (GET/HEAD), 0 otherwise. Set explicitly to retry mutations. */
  retries?: number;
  /** Base backoff in ms (doubled each attempt, with jitter). Default 250. */
  retryBaseMs?: number;
};

// HTTP statuses worth retrying — transient server/load conditions only.
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);
const IDEMPOTENT = new Set(["GET", "HEAD", "OPTIONS"]);

function getAuthToken(ctx: FlowcardClientContext) {
  return ctx.session?.token ?? ctx.config.token ?? null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Resolve how many attempts to make. A method is retried only if it is
// idempotent, unless the caller opts in by passing `retries` explicitly.
function resolveRetries(method: string, options: RequestOptions, ctx: FlowcardClientContext): number {
  if (ctx.config.retries === 0) return 0; // global opt-out (e.g. --no-retry)
  if (typeof options.retries === "number") return Math.max(0, options.retries);
  if (typeof ctx.config.retries === "number") {
    return IDEMPOTENT.has(method) ? ctx.config.retries : 0;
  }
  return IDEMPOTENT.has(method) ? 2 : 0;
}

// Backoff for the given attempt (0-indexed). Honors a Retry-After header when
// present, otherwise exponential backoff with full jitter.
function backoffMs(attempt: number, baseMs: number, retryAfter?: string | null): number {
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return Math.min(seconds * 1000, 30_000);
    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, Math.min(date - Date.now(), 30_000));
  }
  const exp = baseMs * 2 ** attempt;
  return Math.round(exp / 2 + Math.random() * (exp / 2)); // full jitter
}

export function buildUrl(ctx: FlowcardClientContext, path: string) {
  const base = ctx.config.apiUrl.replace(/\/$/, "");
  return `${base}${path}`;
}

async function getErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? `Flowcard API ${response.status}`;
  } catch {
    return `Flowcard API ${response.status}`;
  }
}

export async function request<T>(
  ctx: FlowcardClientContext,
  path: string,
  init: RequestInit = {},
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const token = options.auth === false ? null : getAuthToken(ctx);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = (init.method ?? "GET").toUpperCase();
  const maxRetries = resolveRetries(method, options, ctx);
  const baseMs = options.retryBaseMs ?? 250;

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(buildUrl(ctx, path), {
        ...init,
        headers,
        signal: AbortSignal.timeout(options.timeoutMs ?? 30000),
      });
    } catch (error) {
      // Network/timeout error — retry if attempts remain.
      lastError = error;
      if (attempt < maxRetries) {
        await sleep(backoffMs(attempt, baseMs));
        continue;
      }
      throw error;
    }

    if (!response.ok) {
      if (RETRYABLE_STATUS.has(response.status) && attempt < maxRetries) {
        await sleep(backoffMs(attempt, baseMs, response.headers.get("retry-after")));
        continue;
      }
      const message = await getErrorMessage(response);
      throw Object.assign(new Error(message), { status: response.status });
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  // Unreachable in practice; satisfies the type checker.
  throw lastError ?? new Error("Flowcard API request failed");
}

export async function uploadRawCloudStorageBlob(
  ctx: FlowcardClientContext,
  path: string,
  blob: Blob,
  mimeType: string,
  timeoutMs?: number,
): Promise<{
  ok: true;
  file: CloudStorageFile;
  connection: CloudStorageConnection;
}> {
  const headers = new Headers();
  headers.set("Content-Type", mimeType || "application/octet-stream");
  const token = getAuthToken(ctx);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(ctx, path), {
    method: "POST",
    headers,
    body: blob,
    ...(timeoutMs ? { signal: AbortSignal.timeout(timeoutMs) } : {}),
  });

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw Object.assign(new Error(message), { status: response.status });
  }

  return (await response.json()) as { ok: true; file: CloudStorageFile; connection: CloudStorageConnection };
}

export function withQuery(path: string, params: Record<string, string | number | boolean | null | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === "") return;
    searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}
