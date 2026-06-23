import { createInterface } from "node:readline";
import { style } from "./theme.js";

// Interactive prompts for the CLI. Used when credentials aren't supplied as
// flags, so secrets never have to appear in shell history.

export async function promptText(label: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = await new Promise<string>((resolve) => {
      rl.question(`${style.dim("?")} ${label}: `, resolve);
    });
    return answer.trim();
  } finally {
    rl.close();
  }
}

// Read a line without echoing keystrokes (for passwords). Falls back to a plain
// prompt when stdin is not an interactive TTY (e.g. piped input).
export async function promptSecret(label: string): Promise<string> {
  const input = process.stdin;
  if (!input.isTTY) {
    // Non-interactive: read a single line from stdin as-is.
    return promptText(label);
  }

  process.stdout.write(`${style.dim("?")} ${label}: `);
  input.setRawMode(true);
  input.resume();

  return new Promise<string>((resolve, reject) => {
    let value = "";
    const cleanup = () => {
      input.setRawMode(false);
      input.pause();
      input.removeListener("data", onData);
    };
    const onData = (chunk: Buffer) => {
      const byte = chunk[0];
      // Enter (CR or LF) — submit.
      if (byte === 0x0d || byte === 0x0a) {
        cleanup();
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      // Ctrl-C — cancel.
      if (byte === 0x03) {
        cleanup();
        process.stdout.write("\n");
        reject(new Error("Cancelled"));
        return;
      }
      // Ctrl-D — submit what we have.
      if (byte === 0x04) {
        cleanup();
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      // Backspace / Delete.
      if (byte === 0x7f || byte === 0x08) {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }
      // Echo printable input as `*`; ignore remaining control characters.
      if (byte !== undefined && byte >= 0x20) {
        value += chunk.toString("utf8");
        process.stdout.write("*");
      }
    };
    input.on("data", onData);
  });
}
