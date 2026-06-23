import { displayWidth, glyph, padEndVisible, style } from "./theme.js";

type Json = unknown;

const MAX_CELL = 48;

// Field names whose values are secrets and must never be printed to a human
// terminal (scrollback, screen-shares, logs). Matched case-insensitively as a
// substring of the key. `--output json` stays faithful for scripting; this only
// affects the rendered human view.
const SECRET_KEY = /password|secret|token|salt|hash|apikey|api_key|privatekey|private_key|credential/i;

function isSecretKey(key: string): boolean {
  return SECRET_KEY.test(key);
}

const REDACTED = style.dim("•••••• ") + style.italic(style.dim("(hidden)"));

function isPlainObject(value: Json): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatScalar(value: Json): string {
  if (value === null || value === undefined) return style.dim("—");
  if (typeof value === "boolean") return value ? style.green("yes") : style.dim("no");
  if (typeof value === "number") return style.cyan(String(value));
  if (typeof value === "string") {
    if (value === "") return style.dim('""');
    return value;
  }
  return String(value);
}

function truncate(value: string, max = MAX_CELL): string {
  if (displayWidth(value) <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1))}${style.dim("…")}`;
}

// Render a single object as an aligned key/value detail block.
function renderDetail(record: Record<string, Json>, indent = ""): string {
  const keys = Object.keys(record);
  if (keys.length === 0) return `${indent}${style.dim("(empty)")}`;
  const labelWidth = Math.max(...keys.map((key) => key.length));
  const lines: string[] = [];
  for (const key of keys) {
    const value = record[key];
    const label = style.dim(padEndVisible(key, labelWidth));
    if (isSecretKey(key) && value != null && value !== "") {
      lines.push(`${indent}${label}  ${REDACTED}`);
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${indent}${label}  ${style.dim("[]")}`);
      } else if (value.every((item) => !isPlainObject(item) && !Array.isArray(item))) {
        lines.push(`${indent}${label}  ${value.map((item) => formatScalar(item)).join(style.dim(", "))}`);
      } else {
        lines.push(`${indent}${label}  ${style.dim(`[${value.length} items]`)}`);
        lines.push(renderList(value, `${indent}  `));
      }
    } else if (isPlainObject(value)) {
      lines.push(`${indent}${label}`);
      lines.push(renderDetail(value, `${indent}  `));
    } else {
      lines.push(`${indent}${label}  ${formatScalar(value)}`);
    }
  }
  return lines.join("\n");
}

// Render an array of objects as a bordered table. Falls back to a bullet list
// for arrays of scalars.
function renderList(items: Json[], indent = ""): string {
  if (items.length === 0) return `${indent}${style.dim("(none)")}`;
  if (!items.every((item) => isPlainObject(item))) {
    return items.map((item) => `${indent}${glyph.bullet} ${formatScalar(item)}`).join("\n");
  }
  const rows = items as Record<string, Json>[];
  // Column order: union of keys, prioritizing common identity/label fields.
  const priority = ["id", "name", "title", "label", "email", "status", "state", "role", "kind", "type"];
  const seen = new Set<string>();
  const columns: string[] = [];
  for (const key of priority) {
    if (rows.some((row) => key in row)) {
      columns.push(key);
      seen.add(key);
    }
  }
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }
  const limited = columns.slice(0, 6);

  const cell = (col: string, value: Json): string => {
    if (isSecretKey(col) && value != null && value !== "") return REDACTED;
    if (Array.isArray(value)) return style.dim(`[${value.length}]`);
    if (isPlainObject(value)) return style.dim("{…}");
    return truncate(formatScalar(value));
  };

  const widths = limited.map((col) =>
    Math.max(displayWidth(col), ...rows.map((row) => displayWidth(cell(col, row[col])))),
  );

  const sep = (left: string, mid: string, right: string) =>
    indent + style.dim(left + widths.map((w) => "─".repeat(w + 2)).join(mid) + right);

  const header =
    indent +
    style.dim("│ ") +
    limited.map((col, i) => style.bold(padEndVisible(col, widths[i]))).join(style.dim(" │ ")) +
    style.dim(" │");

  const body = rows.map((row) => {
    return (
      indent +
      style.dim("│ ") +
      limited.map((col, i) => padEndVisible(cell(col, row[col]), widths[i])).join(style.dim(" │ ")) +
      style.dim(" │")
    );
  });

  return [sep("┌", "┬", "┐"), header, sep("├", "┼", "┤"), ...body, sep("└", "┴", "┘")].join("\n");
}

// Unwrap common API envelopes ({ workspace: {...} }, { tasks: [...] }) so the
// most interesting payload becomes the focal point of the rendered output.
function focus(value: Json): { heading?: string; payload: Json; rest?: Record<string, Json> } {
  if (!isPlainObject(value)) return { payload: value };
  const keys = Object.keys(value);

  // { ok: true } style acknowledgements.
  if (keys.length <= 2 && "ok" in value) return { payload: value };

  // A single array property is the headline (e.g. { tasks: [...] }).
  const arrayKeys = keys.filter((key) => Array.isArray(value[key]));
  if (arrayKeys.length === 1 && keys.length <= 3) {
    const key = arrayKeys[0];
    const rest = Object.fromEntries(keys.filter((k) => k !== key).map((k) => [k, value[k]]));
    return { heading: key, payload: value[key], rest: Object.keys(rest).length ? rest : undefined };
  }

  return { payload: value };
}

function summarize(value: Json): string | null {
  if (Array.isArray(value)) {
    const noun = value.length === 1 ? "result" : "results";
    return style.dim(`${value.length} ${noun}`);
  }
  if (isPlainObject(value) && "ok" in value && value.ok === true) {
    return `${glyph.success} ${style.dim("Done")}`;
  }
  return null;
}

export function renderHuman(value: Json): string {
  // Bare acknowledgements render as a single success line, not a detail table.
  if (isPlainObject(value) && "ok" in value && value.ok === true && Object.keys(value).length === 1) {
    return `${glyph.success} ${style.dim("Done")}`;
  }

  const { heading, payload, rest } = focus(value);
  const blocks: string[] = [];

  if (Array.isArray(payload)) {
    const title = heading ? style.bold(heading) : null;
    const count = `${payload.length}`;
    blocks.push(`${title ?? style.bold("results")} ${style.dim(`(${count})`)}`);
    blocks.push(renderList(payload));
    if (rest) blocks.push(renderDetail(rest));
  } else if (isPlainObject(payload)) {
    blocks.push(renderDetail(payload));
  } else {
    blocks.push(formatScalar(payload));
  }

  const footer = summarize(payload);
  if (footer && !Array.isArray(payload)) blocks.unshift(footer + "\n");

  return blocks.join("\n\n");
}
