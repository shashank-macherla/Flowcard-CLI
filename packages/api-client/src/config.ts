import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { FlowcardConfig } from "./context.js";

export type FlowcardConfigFile = {
  apiUrl?: string;
  token?: string;
  workspaceId?: string;
  networkId?: string;
  defaultOutput?: "json" | "table" | "pretty";
  retries?: number;
};

export function getDefaultConfigDir() {
  return process.env.FLOWCARD_CONFIG_DIR ?? join(homedir(), ".flowcard");
}

export function getConfigPath(configDir = getDefaultConfigDir()) {
  return join(configDir, "config.json");
}

export function getSessionPath(configDir = getDefaultConfigDir()) {
  return join(configDir, "session.json");
}

export async function loadConfigFile(configDir = getDefaultConfigDir()): Promise<FlowcardConfigFile> {
  try {
    const raw = await readFile(getConfigPath(configDir), "utf8");
    return JSON.parse(raw) as FlowcardConfigFile;
  } catch {
    return {};
  }
}

export async function saveConfigFile(config: FlowcardConfigFile, configDir = getDefaultConfigDir()) {
  await mkdir(configDir, { recursive: true });
  await writeFile(getConfigPath(configDir), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

export async function resolveFlowcardConfig(overrides: Partial<FlowcardConfigFile> = {}): Promise<FlowcardConfig> {
  const configDir = getDefaultConfigDir();
  const file = await loadConfigFile(configDir);
  const apiUrl = (
    overrides.apiUrl ??
    process.env.FLOWCARD_API_URL ??
    process.env.VITE_FLOWCARD_API_URL ??
    file.apiUrl ??
    "http://127.0.0.1:8787"
  ).replace(/\/$/, "");

  return {
    apiUrl,
    token: overrides.token ?? process.env.FLOWCARD_API_TOKEN ?? process.env.VITE_FLOWCARD_API_TOKEN ?? file.token,
    workspaceId: overrides.workspaceId ?? process.env.FLOWCARD_WORKSPACE_ID ?? file.workspaceId,
    networkId: overrides.networkId ?? process.env.FLOWCARD_NETWORK_ID ?? file.networkId,
    configDir,
    sessionPath: getSessionPath(configDir),
    defaultOutput: overrides.defaultOutput ?? file.defaultOutput ?? "pretty",
    retries: overrides.retries ?? parseRetriesEnv(process.env.FLOWCARD_RETRIES) ?? file.retries,
  };
}

function parseRetriesEnv(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

export async function updateConfigFile(patch: FlowcardConfigFile, configDir = getDefaultConfigDir()) {
  const current = await loadConfigFile(configDir);
  await saveConfigFile({ ...current, ...patch }, configDir);
}

export async function ensureConfigDir(configDir = getDefaultConfigDir()) {
  await mkdir(configDir, { recursive: true });
  await mkdir(dirname(getConfigPath(configDir)), { recursive: true });
}
