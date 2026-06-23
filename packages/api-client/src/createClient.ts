import type { FlowcardClientContext } from "./context.js";
import { resolveFlowcardConfig, type FlowcardConfigFile } from "./config.js";
import { clearSession, loadSession, saveSession } from "./session.js";
import * as methods from "./methods.js";
import type { AuthSession } from "./methods.js";

export type FlowcardApi = Record<string, (...args: any[]) => Promise<any>>;

export type FlowcardClient = {
  api: FlowcardApi;
  getContext: () => Promise<FlowcardClientContext>;
  refreshContext: () => Promise<FlowcardClientContext>;
  setSession: (session: AuthSession | null) => Promise<void>;
  getConfig: () => Promise<import("./context.js").FlowcardConfig>;
  updateConfig: (patch: FlowcardConfigFile) => Promise<import("./context.js").FlowcardConfig>;
};

export function createFlowcardClient(overrides: Partial<FlowcardConfigFile> = {}): FlowcardClient {
  let context: FlowcardClientContext | null = null;

  const getContext = async () => {
    if (context) return context;
    const config = await resolveFlowcardConfig(overrides);
    const session = await loadSession(config.sessionPath);
    context = {
      config,
      session,
      setSession(nextSession) {
        this.session = nextSession;
        if (context) context.session = nextSession;
      },
    };
    return context;
  };

  const api = new Proxy({} as FlowcardApi, {
    get(_target, property) {
      if (typeof property !== "string") return undefined;
      return async (...args: unknown[]) => {
        const ctx = await getContext();
        const fn = (methods as Record<string, unknown>)[property];
        if (typeof fn !== "function") {
          throw new Error(`Unknown Flowcard API method: ${property}`);
        }
        return (fn as (context: FlowcardClientContext, ...rest: unknown[]) => unknown)(ctx, ...args);
      };
    },
  });

  return {
    api,
    getContext,
    async refreshContext() {
      context = null;
      return getContext();
    },
    async setSession(session: AuthSession | null) {
      const ctx = await getContext();
      ctx.setSession(session);
      if (session) {
        await saveSession(ctx.config.sessionPath, session);
      } else {
        await clearSession(ctx.config.sessionPath);
      }
    },
    async getConfig() {
      return (await getContext()).config;
    },
    async updateConfig(patch: FlowcardConfigFile) {
      const ctx = await getContext();
      const { updateConfigFile } = await import("./config.js");
      await updateConfigFile(patch, ctx.config.configDir);
      ctx.config = await resolveFlowcardConfig({ ...patch, apiUrl: patch.apiUrl ?? ctx.config.apiUrl });
      context = ctx;
      return ctx.config;
    },
  };
}

export async function createFlowcardClientSync(overrides: Partial<FlowcardConfigFile> = {}) {
  const client = createFlowcardClient(overrides);
  await client.getContext();
  return client;
}
