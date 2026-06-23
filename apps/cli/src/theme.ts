// Lightweight, dependency-free terminal styling.
// Honors NO_COLOR, FORCE_COLOR, and TTY detection so output stays clean when
// piped or redirected.

function colorEnabled(): boolean {
  if (process.env.NO_COLOR !== undefined) return false;
  if (process.env.FORCE_COLOR !== undefined && process.env.FORCE_COLOR !== "0") return true;
  return Boolean(process.stdout.isTTY);
}

const ENABLED = colorEnabled();

function wrap(open: number, close: number) {
  return (text: string | number) => (ENABLED ? `[${open}m${text}[${close}m` : String(text));
}

export const style = {
  enabled: ENABLED,
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  italic: wrap(3, 23),
  underline: wrap(4, 24),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39),
  gray: wrap(90, 39),
};

export const glyph = {
  success: ENABLED ? style.green("✔") : "OK",
  error: ENABLED ? style.red("✖") : "x",
  warn: ENABLED ? style.yellow("⚠") : "!",
  info: ENABLED ? style.blue("ℹ") : "i",
  bullet: ENABLED ? style.dim("•") : "-",
  arrow: ENABLED ? style.dim("→") : "->",
};

// Visible width that ignores ANSI escape sequences.
export function displayWidth(value: string): number {
  // eslint-disable-next-line no-control-regex
  return value.replace(/\[[0-9;]*m/g, "").length;
}

export function padEndVisible(value: string, width: number): string {
  const gap = width - displayWidth(value);
  return gap > 0 ? value + " ".repeat(gap) : value;
}
