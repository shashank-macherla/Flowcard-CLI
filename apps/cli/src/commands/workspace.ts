import type { Command } from "commander";
import type { NetworkResourceKind } from "@flowcard/api-client";
import { requireNetworkId, requireWorkspaceId, type CliContext } from "../context.js";
import { parseJsonFlag, readJsonInput } from "../context.js";
import { addCrudResource, withAction } from "./helpers.js";

const networkResourceKinds: NetworkResourceKind[] = [
  "channels",
  "documents",
  "projects",
  "boards",
  "tasks",
  "storage",
  "services",
];

export function registerWorkspaceCommands(program: Command, getContext: () => Promise<CliContext>) {
  const workspace = program.command("workspace").alias("ws").description("Workspace operations");

  workspace
    .command("list")
    .description("List workspaces")
    .action(withAction(getContext, async (ctx) => ctx.client.api.listWorkspaces()));

  workspace
    .command("create")
    .description("Create workspace")
    .requiredOption("--name <name>")
    .action(withAction(getContext, async (ctx, opts: { name: string }) => ctx.client.api.createWorkspace({ name: opts.name })));

  workspace
    .command("join")
    .description("Join workspace by invite code")
    .requiredOption("--code <inviteCode>")
    .action(withAction(getContext, async (ctx, opts: { code: string }) => ctx.client.api.joinWorkspace({ inviteCode: opts.code })));

  workspace
    .command("get")
    .description("Get workspace details")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => {
      const id = requireWorkspaceId(ctx, workspaceId);
      return ctx.client.api.fetchWorkspaceState(id);
    }));

  workspace
    .command("update")
    .description("Update workspace settings")
    .argument("[workspaceId]")
    .option("--name <name>")
    .option("--data <json>")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { name?: string; data?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        const body = opts.data ? parseJsonFlag(opts.data) : { name: opts.name };
        return ctx.client.api.updateWorkspaceDetails(id, body);
      }),
    );

  workspace
    .command("search")
    .description("Search workspace resources")
    .argument("[workspaceId]")
    .option("--q <query>")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { q?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        return ctx.client.api.searchWorkspace(id, { q: opts.q ?? "" });
      }),
    );

  workspace
    .command("activity")
    .description("Workspace activity feed")
    .argument("[workspaceId]")
    .option("--limit <n>")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { limit?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        return ctx.client.api.fetchWorkspaceActivity(id, { limit: opts.limit ? Number(opts.limit) : undefined });
      }),
    );

  workspace
    .command("invitation")
    .description("Workspace invite code")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => {
      const id = requireWorkspaceId(ctx, workspaceId);
      return ctx.client.api.fetchWorkspaceInvitation(id);
    }));

  workspace
    .command("invite-rotate")
    .description("Rotate workspace invite code")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => {
      const id = requireWorkspaceId(ctx, workspaceId);
      return ctx.client.api.rotateWorkspaceInviteCode(id);
    }));

  workspace
    .command("state-get")
    .description("Get workspace state blob")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => {
      const id = requireWorkspaceId(ctx, workspaceId);
      return ctx.client.api.fetchWorkspaceState(id);
    }));

  workspace
    .command("state-set")
    .description("Save workspace state blob")
    .argument("[workspaceId]")
    .option("--file <path>", "JSON state file (- for stdin)")
    .option("--data <json>")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { file?: string; data?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        const state = opts.file ? await readJsonInput(opts.file) : JSON.parse(opts.data ?? "{}");
        return ctx.client.api.saveWorkspaceState(id, state);
      }),
    );

  const members = workspace.command("members").description("Workspace members");
  members
    .command("list")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => {
      const id = requireWorkspaceId(ctx, workspaceId);
      return ctx.client.api.listWorkspaceMembers(id);
    }));
  members
    .command("update-role")
    .argument("<userId>")
    .argument("[workspaceId]")
    .option("--roles <roles>", "Comma-separated roles")
    .action(
      withAction(getContext, async (ctx, userId: string, workspaceId: string | undefined, opts: { roles?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        const roles = (opts.roles ?? "member").split(",").map((role) => role.trim());
        return ctx.client.api.updateWorkspaceMemberRole(id, userId, roles);
      }),
    );
  members
    .command("remove")
    .argument("<userId>")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, userId: string, workspaceId?: string) => {
      const id = requireWorkspaceId(ctx, workspaceId);
      return ctx.client.api.removeWorkspaceMember(id, userId);
    }));

  const roles = workspace.command("roles").description("Workspace RBAC roles");
  roles.command("list").argument("[workspaceId]").action(withAction(getContext, async (ctx, workspaceId?: string) => {
    const id = requireWorkspaceId(ctx, workspaceId);
    return ctx.client.api.fetchWorkspaceRoleSettings(id);
  }));
  roles
    .command("permissions-set")
    .argument("<role>")
    .argument("[workspaceId]")
    .option("--file <path>")
    .option("--data <json>")
    .action(
      withAction(getContext, async (ctx, role: string, workspaceId: string | undefined, opts: { file?: string; data?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        const permissions = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return ctx.client.api.updateWorkspaceRolePermissions(id, role, permissions as never);
      }),
    );

  const networks = workspace.command("networks").description("Workspace networks");
  networks
    .command("list")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => {
      const id = requireWorkspaceId(ctx, workspaceId);
      return ctx.client.api.listWorkspaceNetworks(id);
    }));
  networks
    .command("create")
    .argument("[workspaceId]")
    .requiredOption("--name <name>")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { name: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        return ctx.client.api.createWorkspaceNetwork(id, { name: opts.name });
      }),
    );

  addCrudResource(workspace, getContext, {
    name: "tasks",
    description: "Workspace tasks",
    list: async (ctx, workspaceId) => ctx.client.api.listWorkspaceTasks(requireWorkspaceId(ctx, workspaceId)),
    create: async (ctx, workspaceId, body) => ctx.client.api.createWorkspaceTask(requireWorkspaceId(ctx, workspaceId), body),
    update: async (ctx, workspaceId, id, body) => ctx.client.api.updateWorkspaceTask(requireWorkspaceId(ctx, workspaceId), id, body),
    delete: async (ctx, workspaceId, id) => ctx.client.api.deleteWorkspaceTask(requireWorkspaceId(ctx, workspaceId), id),
  });

  addCrudResource(workspace, getContext, {
    name: "bugs",
    description: "Workspace bugs",
    list: async (ctx, workspaceId) => ctx.client.api.listWorkspaceBugs(requireWorkspaceId(ctx, workspaceId)),
    create: async (ctx, workspaceId, body) => ctx.client.api.createWorkspaceBug(requireWorkspaceId(ctx, workspaceId), body),
    update: async (ctx, workspaceId, id, body) => ctx.client.api.updateWorkspaceBug(requireWorkspaceId(ctx, workspaceId), id, body),
    delete: async (ctx, workspaceId, id) => ctx.client.api.deleteWorkspaceBug(requireWorkspaceId(ctx, workspaceId), id),
  });

  addCrudResource(workspace, getContext, {
    name: "customers",
    description: "Workspace customers",
    list: async (ctx, workspaceId) => ctx.client.api.listWorkspaceCustomers(requireWorkspaceId(ctx, workspaceId)),
    create: async (ctx, workspaceId, body) => ctx.client.api.createWorkspaceCustomer(requireWorkspaceId(ctx, workspaceId), body),
    update: async (ctx, workspaceId, id, body) => ctx.client.api.updateWorkspaceCustomer(requireWorkspaceId(ctx, workspaceId), id, body),
    delete: async (ctx, workspaceId, id) => ctx.client.api.deleteWorkspaceCustomer(requireWorkspaceId(ctx, workspaceId), id),
  });

  addCrudResource(workspace, getContext, {
    name: "documents",
    description: "Workspace documents",
    list: async (ctx, workspaceId) => ctx.client.api.listWorkspaceDocuments(requireWorkspaceId(ctx, workspaceId)),
    create: async (ctx, workspaceId, body) => ctx.client.api.createWorkspaceDocument(requireWorkspaceId(ctx, workspaceId), body),
    update: async (ctx, workspaceId, id, body) => ctx.client.api.updateWorkspaceDocument(requireWorkspaceId(ctx, workspaceId), id, body),
    delete: async (ctx, workspaceId, id) => ctx.client.api.deleteWorkspaceDocument(requireWorkspaceId(ctx, workspaceId), id),
  });

  addCrudResource(workspace, getContext, {
    name: "channels",
    description: "Workspace channels",
    list: async (ctx, workspaceId) => ctx.client.api.listWorkspaceChannels(requireWorkspaceId(ctx, workspaceId)),
    create: async (ctx, workspaceId, body) => ctx.client.api.createWorkspaceChannelRecord(requireWorkspaceId(ctx, workspaceId), body),
    update: async (ctx, workspaceId, id, body) => ctx.client.api.updateWorkspaceChannelRecord(requireWorkspaceId(ctx, workspaceId), id, body),
    delete: async (ctx, workspaceId, id) => ctx.client.api.deleteWorkspaceChannelRecord(requireWorkspaceId(ctx, workspaceId), id),
  });

  addCrudResource(workspace, getContext, {
    name: "code-files",
    description: "Workspace code files",
    list: async (ctx, workspaceId) => ctx.client.api.listWorkspaceCodeFiles(requireWorkspaceId(ctx, workspaceId)),
    create: async (ctx, workspaceId, body) => ctx.client.api.createWorkspaceCodeFileRecord(requireWorkspaceId(ctx, workspaceId), body),
    update: async (ctx, workspaceId, id, body) => ctx.client.api.updateWorkspaceCodeFileRecord(requireWorkspaceId(ctx, workspaceId), id, body),
    delete: async (ctx, workspaceId, id) => ctx.client.api.deleteWorkspaceCodeFileRecord(requireWorkspaceId(ctx, workspaceId), id),
  });

  workspace
    .command("sql-query")
    .description("Run workspace SQL query")
    .argument("[workspaceId]")
    .option("--query <sql>", "SQL query")
    .option("--file <path>", "SQL file")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { query?: string; file?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        let query = opts.query ?? "";
        if (opts.file) {
          const { readFile } = await import("node:fs/promises");
          query = await readFile(opts.file, "utf8");
        }
        if (!query.trim()) throw new Error("--query or --file is required");
        return ctx.client.api.executeWorkspaceSqlQuery(id, { query });
      }),
    );

  workspace
    .command("git-fetch")
    .description("Import git repository into workspace code")
    .argument("[workspaceId]")
    .requiredOption("--url <url>")
    .option("--branch <branch>")
    .option("--token <token>")
    .option("--path-prefix <prefix>")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { url: string; branch?: string; token?: string; pathPrefix?: string }) => {
        const id = requireWorkspaceId(ctx, workspaceId);
        return ctx.client.api.fetchGitRepository(id, {
          url: opts.url,
          branch: opts.branch,
          accessToken: opts.token,
          pathPrefix: opts.pathPrefix,
        });
      }),
    );
}

export function registerNetworkCommands(program: Command, getContext: () => Promise<CliContext>) {
  const network = program.command("network").alias("net").description("Network operations");

  network
    .command("get")
    .description("Network dashboard")
    .argument("[networkId]")
    .action(withAction(getContext, async (ctx, networkId?: string) => ctx.client.api.fetchNetwork(requireNetworkId(ctx, networkId))));

  network
    .command("update")
    .argument("[networkId]")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: { data?: string; file?: string }) => {
        const id = requireNetworkId(ctx, networkId);
        const body = opts.file ? ((await readJsonInput(opts.file)) as Record<string, unknown>) : parseJsonFlag(opts.data);
        return ctx.client.api.updateNetwork(id, body);
      }),
    );

  network
    .command("archive")
    .argument("[networkId]")
    .action(withAction(getContext, async (ctx, networkId?: string) => ctx.client.api.archiveNetwork(requireNetworkId(ctx, networkId))));

  network
    .command("search")
    .argument("[networkId]")
    .option("--q <query>")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: { q?: string }) =>
        ctx.client.api.searchNetwork(requireNetworkId(ctx, networkId), { q: opts.q ?? "" }),
      ),
    );

  const codeSpaces = network.command("code-spaces").description("Network code workspaces");
  codeSpaces
    .command("list")
    .argument("[networkId]")
    .option("--archived", "List archived only")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: { archived?: boolean }) =>
        ctx.client.api.listNetworkCodeSpaces(requireNetworkId(ctx, networkId), { archived: opts.archived ? "only" : undefined }),
      ),
    );
  codeSpaces
    .command("create")
    .argument("[networkId]")
    .requiredOption("--name <name>")
    .option("--data <json>")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: { name: string; data?: string }) => {
        const id = requireNetworkId(ctx, networkId);
        const body = { name: opts.name, ...parseJsonFlag(opts.data) };
        return ctx.client.api.createNetworkCodeSpace(id, body);
      }),
    );
  codeSpaces
    .command("update")
    .argument("<codeSpaceId>")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, codeSpaceId: string, opts: { data?: string; file?: string }) => {
        const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return ctx.client.api.updateNetworkCodeSpace(codeSpaceId, body as Record<string, unknown>);
      }),
    );
  codeSpaces
    .command("delete")
    .argument("<codeSpaceId>")
    .description("Archive code workspace")
    .action(withAction(getContext, async (ctx, codeSpaceId: string) => ctx.client.api.deleteNetworkCodeSpace(codeSpaceId)));
  codeSpaces
    .command("restore")
    .argument("<codeSpaceId>")
    .action(withAction(getContext, async (ctx, codeSpaceId: string) => ctx.client.api.restoreNetworkCodeSpace(codeSpaceId)));

  network
    .command("sql-query")
    .argument("[networkId]")
    .option("--query <sql>")
    .option("--file <path>")
    .option("--code-space-id <id>")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: { query?: string; file?: string; codeSpaceId?: string }) => {
        const id = requireNetworkId(ctx, networkId);
        let query = opts.query ?? "";
        if (opts.file) {
          const { readFile } = await import("node:fs/promises");
          query = await readFile(opts.file, "utf8");
        }
        return ctx.client.api.executeNetworkSqlQuery(id, { query, codeSpaceId: opts.codeSpaceId });
      }),
    );

  for (const kind of networkResourceKinds) {
    const group = network.command(kind).description(`Network ${kind}`);
    group
      .command("list")
      .argument("[networkId]")
      .option("--archived", "Archived only")
      .option("--q <query>")
      .action(
        withAction(getContext, async (ctx, networkId: string | undefined, opts: { archived?: boolean; q?: string }) =>
          ctx.client.api.listNetworkResources(requireNetworkId(ctx, networkId), kind, {
            archived: opts.archived ? "only" : undefined,
            q: opts.q,
          }),
        ),
      );
    group
      .command("create")
      .argument("[networkId]")
      .option("--data <json>")
      .option("--file <path>")
      .action(
        withAction(getContext, async (ctx, networkId: string | undefined, opts: { data?: string; file?: string }) => {
          const id = requireNetworkId(ctx, networkId);
          const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
          return ctx.client.api.createNetworkResource(id, kind, body as Record<string, unknown>);
        }),
      );
    group
      .command("update")
      .argument("<resourceId>")
      .argument("[networkId]")
      .option("--data <json>")
      .option("--file <path>")
      .action(
        withAction(getContext, async (ctx, resourceId: string, networkId: string | undefined, opts: { data?: string; file?: string }) => {
          const id = requireNetworkId(ctx, networkId);
          const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
          return ctx.client.api.updateNetworkResource(id, kind, resourceId, body as Record<string, unknown>);
        }),
      );
    group
      .command("archive")
      .argument("<resourceId>")
      .argument("[networkId]")
      .action(
        withAction(getContext, async (ctx, resourceId: string, networkId?: string) =>
          ctx.client.api.archiveNetworkResource(requireNetworkId(ctx, networkId), kind, resourceId),
        ),
      );
    group
      .command("restore")
      .argument("<resourceId>")
      .argument("[networkId]")
      .action(
        withAction(getContext, async (ctx, resourceId: string, networkId?: string) =>
          ctx.client.api.restoreNetworkResource(requireNetworkId(ctx, networkId), kind, resourceId),
        ),
      );
  }
}
