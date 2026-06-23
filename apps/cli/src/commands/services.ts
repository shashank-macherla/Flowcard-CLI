import type { Command } from "commander";
import type { CliContext } from "../context.js";
import { parseJsonFlag, readJsonInput, requireNetworkId, requireWorkspaceId } from "../context.js";
import { withAction } from "./helpers.js";

// Shared GET/POST helpers that honor the nice error formatter (status-tagged
// throws) instead of leaking raw error JSON.
async function svcGet(ctx: CliContext, path: string) {
  const config = await ctx.client.getConfig();
  const response = await fetch(`${config.apiUrl}${path}`, { headers: await authHeaders(ctx) });
  return parseResponse(response);
}

async function svcSend(ctx: CliContext, method: string, path: string, body: unknown) {
  const config = await ctx.client.getConfig();
  const response = await fetch(`${config.apiUrl}${path}`, {
    method,
    headers: { ...(await authHeaders(ctx)), "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  return parseResponse(response);
}

async function parseResponse(response: Response) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "error" in payload
        ? ((payload as { error?: { message?: string } }).error?.message ?? JSON.stringify(payload))
        : undefined) ?? `Services API ${response.status}`;
    throw Object.assign(new Error(message), { status: response.status });
  }
  return payload;
}

function wsQuery(ctx: CliContext, workspaceId?: string) {
  return `?workspaceId=${encodeURIComponent(requireWorkspaceId(ctx, workspaceId))}`;
}

export function registerServicesCommands(program: Command, getContext: () => Promise<CliContext>) {
  const services = program.command("services").description("Services App (/api/v1/services)");

  services
    .command("context")
    .description("Services context for a workspace")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => svcGet(ctx, `/api/v1/services/context${wsQuery(ctx, workspaceId)}`)));

  services
    .command("catalog")
    .description("Service catalog for a workspace")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => svcGet(ctx, `/api/v1/services/catalog${wsQuery(ctx, workspaceId)}`)));

  services
    .command("kinds")
    .description("Available service kinds")
    .action(withAction(getContext, async (ctx) => svcGet(ctx, "/api/v1/services/kinds")));

  services
    .command("fetch-requests")
    .description("Workspace service fetch requests")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => svcGet(ctx, `/api/v1/services/fetch-requests${wsQuery(ctx, workspaceId)}`)));

  services
    .command("list")
    .description("List services in a network")
    .argument("[networkId]")
    .action(withAction(getContext, async (ctx, networkId?: string) => svcGet(ctx, `/api/v1/services/networks/${encodeURIComponent(requireNetworkId(ctx, networkId))}`)));

  services
    .command("members")
    .description("List service members in a network")
    .argument("[networkId]")
    .action(withAction(getContext, async (ctx, networkId?: string) => svcGet(ctx, `/api/v1/services/networks/${encodeURIComponent(requireNetworkId(ctx, networkId))}/members`)));

  services
    .command("get")
    .description("Get a service by id")
    .argument("<serviceId>")
    .action(withAction(getContext, async (ctx, serviceId: string) => svcGet(ctx, `/api/v1/services/${encodeURIComponent(serviceId)}`)));

  services
    .command("create")
    .description("Create a service in a network")
    .argument("[networkId]")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: { data?: string; file?: string }) => {
        const id = requireNetworkId(ctx, networkId);
        const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return svcSend(ctx, "POST", `/api/v1/services/networks/${encodeURIComponent(id)}`, body);
      }),
    );

  services
    .command("update")
    .description("Update a service in a network")
    .argument("<serviceId>")
    .argument("[networkId]")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, serviceId: string, networkId: string | undefined, opts: { data?: string; file?: string }) => {
        const id = requireNetworkId(ctx, networkId);
        const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return svcSend(ctx, "PATCH", `/api/v1/services/networks/${encodeURIComponent(id)}/${encodeURIComponent(serviceId)}`, body);
      }),
    );

  services
    .command("probe")
    .description("Probe a service endpoint")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, opts: { data?: string; file?: string }) => {
        const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return svcSend(ctx, "POST", "/api/v1/services/probe", body);
      }),
    );

  services
    .command("fetch-spec")
    .description("Fetch a service specification")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, opts: { data?: string; file?: string }) => {
        const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return svcSend(ctx, "POST", "/api/v1/services/fetch-spec", body);
      }),
    );
}

async function authHeaders(ctx: CliContext): Promise<Record<string, string>> {
  const context = await ctx.client.getContext();
  const token = context.session?.token ?? context.config.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function registerEnterpriseCommands(program: Command, getContext: () => Promise<CliContext>) {
  const enterprise = program.command("enterprise").description("Enterprise admin endpoints");

  enterprise.command("readiness").action(withAction(getContext, async (ctx) => enterpriseFetch(ctx, "/api/enterprise/readiness")));
  enterprise.command("config").action(withAction(getContext, async (ctx) => enterpriseFetch(ctx, "/api/enterprise/config")));
  enterprise.command("migrations").action(withAction(getContext, async (ctx) => enterpriseFetch(ctx, "/api/enterprise/migrations")));
  enterprise
    .command("search-reindex")
    .description("Reindex enterprise search")
    .action(withAction(getContext, async (ctx) => enterprisePost(ctx, "/api/enterprise/search/reindex", {})));
}

export function registerAdminCommands(program: Command, getContext: () => Promise<CliContext>) {
  const admin = program.command("admin").description("Admin operations");

  admin.command("backups-list").action(withAction(getContext, async (ctx) => enterpriseFetch(ctx, "/api/admin/backups")));
  admin.command("backups-create").action(withAction(getContext, async (ctx) => enterprisePost(ctx, "/api/admin/backups", {})));
}

async function enterpriseFetch(ctx: CliContext, path: string) {
  const config = await ctx.client.getConfig();
  const response = await fetch(`${config.apiUrl}${path}`, { headers: await authHeaders(ctx) });
  if (!response.ok) throw new Error(`Enterprise API ${response.status}`);
  return response.json();
}

async function enterprisePost(ctx: CliContext, path: string, body: unknown) {
  const config = await ctx.client.getConfig();
  const response = await fetch(`${config.apiUrl}${path}`, {
    method: "POST",
    headers: { ...(await authHeaders(ctx)), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Enterprise API ${response.status}`);
  return response.json();
}
