import type { AuthSession } from "./methods.js";

export type FlowcardConfig = {
  apiUrl: string;
  token?: string;
  workspaceId?: string;
  networkId?: string;
  configDir: string;
  sessionPath: string;
  defaultOutput: "json" | "table" | "pretty";
  /** Default retry budget for transient failures. 0 disables retries entirely. */
  retries?: number;
};

export type FlowcardClientContext = {
  config: FlowcardConfig;
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
};
