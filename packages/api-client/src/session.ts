import { readFile, writeFile, unlink } from "node:fs/promises";
import type { AuthSession } from "./methods.js";
import { ensureConfigDir } from "./config.js";

export async function loadSession(sessionPath: string): Promise<AuthSession | null> {
  try {
    const raw = await readFile(sessionPath, "utf8");
    const session = JSON.parse(raw) as AuthSession;
    if (!session.token || !session.user || Date.parse(session.expiresAt) <= Date.now()) {
      await clearSession(sessionPath);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function saveSession(sessionPath: string, session: AuthSession) {
  await ensureConfigDir();
  await writeFile(sessionPath, `${JSON.stringify(session, null, 2)}\n`, "utf8");
}

export async function clearSession(sessionPath: string) {
  try {
    await unlink(sessionPath);
  } catch {
    // ignore missing session file
  }
}
