import type { OutputFormat } from "./context.js";
import { renderHuman } from "./render.js";
import { glyph, style } from "./theme.js";

export function printResult(value: unknown, format: OutputFormat = "pretty") {
  if (format === "json") {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }
  if (format === "table" && Array.isArray(value)) {
    console.table(value);
    return;
  }
  if (format === "pretty") {
    if (value == null) {
      console.log(`${glyph.success} ${style.dim("Done")}`);
      return;
    }
    console.log(renderHuman(value));
    return;
  }
  console.log(value);
}

export function printError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const status =
    error instanceof Error && "status" in error
      ? (error as Error & { status?: number }).status
      : undefined;
  const label = status ? style.red(`Error ${status}`) : style.red("Error");
  console.error(`${glyph.error} ${label}${style.dim(":")} ${message}`);
  if (status === 401 || status === 403) {
    console.error(style.dim("  Hint: run `flowcard auth login` or pass --token."));
  }
}

export async function runCommand(action: () => Promise<unknown>, format: OutputFormat = "pretty") {
  try {
    const result = await action();
    if (result !== undefined) printResult(result, format);
  } catch (error) {
    printError(error);
    process.exitCode = 1;
  }
}
