import { readFile } from "node:fs/promises";
import { createFlowcardClient, type FlowcardClient } from "@flowcard/api-client";

export type OutputFormat = "json" | "pretty" | "table";

export type GlobalCliOptions = {
  apiUrl?: string;
  token?: string;
  workspace?: string;
  network?: string;
  output?: OutputFormat;
  quiet?: boolean;
  retries?: number;
};

export type CliContext = {
  client: FlowcardClient;
  options: GlobalCliOptions;
};

export async function createCliContext(options: GlobalCliOptions): Promise<CliContext> {
  const client = createFlowcardClient({
    apiUrl: options.apiUrl,
    token: options.token,
    workspaceId: options.workspace,
    networkId: options.network,
    defaultOutput: options.output ?? "pretty",
    ...(options.retries !== undefined ? { retries: options.retries } : {}),
  });
  await client.getContext();
  return { client, options };
}

export async function readJsonInput(path?: string): Promise<unknown> {
  if (!path || path === "-") {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    return raw ? JSON.parse(raw) : {};
  }
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}

export function requireWorkspaceId(ctx: CliContext, workspaceId?: string) {
  const id = workspaceId ?? ctx.options.workspace ?? "";
  if (!id) {
    throw new Error("Workspace id is required. Pass <workspaceId> or set --workspace / FLOWCARD_WORKSPACE_ID.");
  }
  return id;
}

export function requireNetworkId(ctx: CliContext, networkId?: string) {
  const id = networkId ?? ctx.options.network ?? "";
  if (!id) {
    throw new Error("Network id is required. Pass <networkId> or set --network / FLOWCARD_NETWORK_ID.");
  }
  return id;
}

export function parseKeyValuePairs(pairs: string[] = []) {
  const result: Record<string, string> = {};
  for (const pair of pairs) {
    const index = pair.indexOf("=");
    if (index === -1) {
      result[pair] = "true";
      continue;
    }
    result[pair.slice(0, index)] = pair.slice(index + 1);
  }
  return result;
}

export function parseJsonFlag(value?: string) {
  if (!value) return {};
  return JSON.parse(value) as Record<string, unknown>;
}
