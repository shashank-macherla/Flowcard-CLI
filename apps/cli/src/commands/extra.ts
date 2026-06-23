import type { Command } from "commander";
import { parseJsonFlag, readJsonInput, requireNetworkId, requireWorkspaceId, type CliContext } from "../context.js";
import { withAction } from "./helpers.js";

type JsonOpts = { data?: string; file?: string };

// Resolve a free-form JSON body from --data or --file (- for stdin).
async function resolveBody(opts: JsonOpts): Promise<Record<string, unknown>> {
  if (opts.file) return (await readJsonInput(opts.file)) as Record<string, unknown>;
  return parseJsonFlag(opts.data);
}

// ---------------------------------------------------------------------------
// Workspace automations
// ---------------------------------------------------------------------------
export function registerAutomationCommands(program: Command, getContext: () => Promise<CliContext>) {
  const automation = program.command("automation").description("Workspace automations");

  automation
    .command("list")
    .description("List automations")
    .argument("[workspaceId]")
    .action(
      withAction(getContext, async (ctx, workspaceId?: string) =>
        ctx.client.api.listWorkspaceAutomations(requireWorkspaceId(ctx, workspaceId)),
      ),
    );

  automation
    .command("create")
    .description("Create an automation")
    .argument("[workspaceId]")
    .option("--data <json>", "JSON body")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.createWorkspaceAutomation(requireWorkspaceId(ctx, workspaceId), await resolveBody(opts)),
      ),
    );

  automation
    .command("update")
    .description("Update an automation")
    .argument("<automationId>")
    .argument("[workspaceId]")
    .option("--data <json>", "JSON body")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, automationId: string, workspaceId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.updateWorkspaceAutomation(requireWorkspaceId(ctx, workspaceId), automationId, await resolveBody(opts)),
      ),
    );

  automation
    .command("delete")
    .description("Delete an automation")
    .argument("<automationId>")
    .argument("[workspaceId]")
    .action(
      withAction(getContext, async (ctx, automationId: string, workspaceId?: string) =>
        ctx.client.api.deleteWorkspaceAutomation(requireWorkspaceId(ctx, workspaceId), automationId),
      ),
    );
}

// ---------------------------------------------------------------------------
// Network roles, members, subnetworks, welcome card
// ---------------------------------------------------------------------------
export function registerNetworkAdminCommands(program: Command, getContext: () => Promise<CliContext>) {
  const network = program.command("network-admin").description("Network roles, members, and subnetworks");

  // Roles
  const role = network.command("role").description("Network roles");
  role
    .command("list")
    .argument("[networkId]")
    .action(
      withAction(getContext, async (ctx, networkId?: string) =>
        ctx.client.api.listNetworkRoles(requireNetworkId(ctx, networkId)),
      ),
    );
  role
    .command("create")
    .argument("[networkId]")
    .option("--data <json>", "JSON body { name, description?, permissions }")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.createNetworkRole(requireNetworkId(ctx, networkId), await resolveBody(opts)),
      ),
    );
  role
    .command("update")
    .argument("<roleId>")
    .argument("[networkId]")
    .option("--data <json>", "JSON body")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, roleId: string, networkId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.updateNetworkRole(requireNetworkId(ctx, networkId), roleId, await resolveBody(opts)),
      ),
    );
  role
    .command("delete")
    .argument("<roleId>")
    .argument("[networkId]")
    .action(
      withAction(getContext, async (ctx, roleId: string, networkId?: string) =>
        ctx.client.api.deleteNetworkRole(requireNetworkId(ctx, networkId), roleId),
      ),
    );

  // Members
  const member = network.command("member").description("Network members");
  member
    .command("list")
    .argument("[networkId]")
    .action(
      withAction(getContext, async (ctx, networkId?: string) =>
        ctx.client.api.listNetworkMembers(requireNetworkId(ctx, networkId)),
      ),
    );
  member
    .command("add")
    .argument("[networkId]")
    .option("--user <userId>")
    .option("--email <email>")
    .option("--role-id <roleId>")
    .option("--role-name <roleName>")
    .option("--data <json>", "JSON body (overrides flags)")
    .action(
      withAction(
        getContext,
        async (
          ctx,
          networkId: string | undefined,
          opts: { user?: string; email?: string; roleId?: string; roleName?: string; data?: string },
        ) => {
          const body = opts.data
            ? parseJsonFlag(opts.data)
            : { userId: opts.user, email: opts.email, roleId: opts.roleId, roleName: opts.roleName };
          return ctx.client.api.addNetworkMember(requireNetworkId(ctx, networkId), body);
        },
      ),
    );
  member
    .command("update")
    .argument("<memberId>")
    .argument("[networkId]")
    .option("--role-id <roleId>")
    .option("--role-name <roleName>")
    .option("--data <json>", "JSON body (overrides flags)")
    .action(
      withAction(
        getContext,
        async (
          ctx,
          memberId: string,
          networkId: string | undefined,
          opts: { roleId?: string; roleName?: string; data?: string },
        ) => {
          const body = opts.data ? parseJsonFlag(opts.data) : { roleId: opts.roleId, roleName: opts.roleName };
          return ctx.client.api.updateNetworkMember(requireNetworkId(ctx, networkId), memberId, body);
        },
      ),
    );
  member
    .command("remove")
    .argument("<memberId>")
    .argument("[networkId]")
    .action(
      withAction(getContext, async (ctx, memberId: string, networkId?: string) =>
        ctx.client.api.removeNetworkMember(requireNetworkId(ctx, networkId), memberId),
      ),
    );

  // Subnetworks
  const subnetwork = network.command("subnetwork").description("Subnetworks");
  subnetwork
    .command("list")
    .argument("[networkId]")
    .action(
      withAction(getContext, async (ctx, networkId?: string) =>
        ctx.client.api.listSubnetworks(requireNetworkId(ctx, networkId)),
      ),
    );
  subnetwork
    .command("create")
    .argument("[networkId]")
    .option("--name <name>")
    .option("--data <json>", "JSON body (overrides --name)")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: { name?: string } & JsonOpts) => {
        const body = opts.data || opts.file ? await resolveBody(opts) : { name: opts.name };
        return ctx.client.api.createSubnetwork(requireNetworkId(ctx, networkId), body as { name: string });
      }),
    );

  // Cross-network fetch (data access) requests
  const fetchRequest = network.command("fetch-request").description("Cross-network data fetch requests");
  fetchRequest
    .command("create")
    .description("Create a fetch request")
    .argument("[networkId]")
    .option("--data <json>", "JSON body { service, serviceId?, reason?, accessLevel?, dataScopes?, durationDays? }")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.createNetworkFetchRequest(requireNetworkId(ctx, networkId), await resolveBody(opts)),
      ),
    );
  fetchRequest
    .command("resolve")
    .description("Approve or reject a fetch request")
    .argument("<requestId>")
    .argument("<status>", "approved | rejected")
    .argument("[networkId]")
    .option("--data <json>", "JSON body { permission?, accessLevel?, dataScopes? }")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(
        getContext,
        async (ctx, requestId: string, status: string, networkId: string | undefined, opts: JsonOpts) =>
          ctx.client.api.resolveNetworkFetchRequest(
            requireNetworkId(ctx, networkId),
            requestId,
            status as "approved" | "rejected",
            await resolveBody(opts),
          ),
      ),
    );

  // Welcome card
  const welcome = network.command("welcome").description("Network welcome card");
  welcome
    .command("get")
    .argument("[networkId]")
    .action(
      withAction(getContext, async (ctx, networkId?: string) =>
        ctx.client.api.fetchNetworkWelcomeCard(requireNetworkId(ctx, networkId)),
      ),
    );
  welcome
    .command("update")
    .argument("[networkId]")
    .option("--data <json>", "JSON body")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, networkId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.updateNetworkWelcomeCard(requireNetworkId(ctx, networkId), await resolveBody(opts)),
      ),
    );
}

// ---------------------------------------------------------------------------
// Workspace access control (resource ACLs, welcome card)
// ---------------------------------------------------------------------------
export function registerAccessCommands(program: Command, getContext: () => Promise<CliContext>) {
  const access = program.command("access").description("Workspace access control");

  const acl = access.command("acl").description("Resource ACL grants");
  acl
    .command("grant")
    .description("Grant a resource ACL")
    .argument("[workspaceId]")
    .requiredOption("--resource-type <type>")
    .requiredOption("--resource-id <id>")
    .requiredOption("--subject-type <user|role>")
    .requiredOption("--subject-id <id>")
    .requiredOption("--access-level <view|edit|manage>")
    .option("--note <note>")
    .action(
      withAction(
        getContext,
        async (
          ctx,
          workspaceId: string | undefined,
          opts: {
            resourceType: string;
            resourceId: string;
            subjectType: "user" | "role";
            subjectId: string;
            accessLevel: "view" | "edit" | "manage";
            note?: string;
          },
        ) =>
          ctx.client.api.grantResourceAcl(requireWorkspaceId(ctx, workspaceId), {
            resourceType: opts.resourceType,
            resourceId: opts.resourceId,
            subjectType: opts.subjectType,
            subjectId: opts.subjectId,
            accessLevel: opts.accessLevel,
            note: opts.note,
          }),
      ),
    );
  acl
    .command("revoke")
    .description("Revoke a resource ACL")
    .argument("<aclId>")
    .argument("[workspaceId]")
    .action(
      withAction(getContext, async (ctx, aclId: string, workspaceId?: string) =>
        ctx.client.api.revokeResourceAcl(requireWorkspaceId(ctx, workspaceId), aclId),
      ),
    );

  const welcome = access.command("welcome").description("Workspace welcome card");
  welcome
    .command("get")
    .argument("[workspaceId]")
    .action(
      withAction(getContext, async (ctx, workspaceId?: string) =>
        ctx.client.api.fetchWorkspaceWelcomeCard(requireWorkspaceId(ctx, workspaceId)),
      ),
    );
  welcome
    .command("update")
    .argument("[workspaceId]")
    .option("--data <json>", "JSON body")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.updateWorkspaceWelcomeCard(requireWorkspaceId(ctx, workspaceId), await resolveBody(opts)),
      ),
    );

  // Workspace custom roles
  const role = access.command("role").description("Workspace custom roles");
  role
    .command("create")
    .description("Create a custom role")
    .argument("[workspaceId]")
    .option("--data <json>", "JSON body { name, basedOn?, permissions? }")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.createWorkspaceCustomRole(requireWorkspaceId(ctx, workspaceId), await resolveBody(opts)),
      ),
    );
  role
    .command("update")
    .description("Update a custom role")
    .argument("<role>")
    .argument("[workspaceId]")
    .option("--data <json>", "JSON body")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, role: string, workspaceId: string | undefined, opts: JsonOpts) =>
        ctx.client.api.updateWorkspaceCustomRole(requireWorkspaceId(ctx, workspaceId), role, await resolveBody(opts)),
      ),
    );
  role
    .command("delete")
    .description("Delete a custom role")
    .argument("<role>")
    .argument("[workspaceId]")
    .action(
      withAction(getContext, async (ctx, role: string, workspaceId?: string) =>
        ctx.client.api.deleteWorkspaceCustomRole(requireWorkspaceId(ctx, workspaceId), role),
      ),
    );
  role
    .command("reset-permissions")
    .description("Reset a role's permissions to defaults")
    .argument("<role>")
    .argument("[workspaceId]")
    .action(
      withAction(getContext, async (ctx, role: string, workspaceId?: string) =>
        ctx.client.api.resetWorkspaceRolePermissions(requireWorkspaceId(ctx, workspaceId), role),
      ),
    );

  access
    .command("storage-disconnect")
    .description("Disconnect workspace cloud storage")
    .argument("[workspaceId]")
    .action(
      withAction(getContext, async (ctx, workspaceId?: string) =>
        ctx.client.api.disconnectCloudStorageApi(requireWorkspaceId(ctx, workspaceId)),
      ),
    );
}

// ---------------------------------------------------------------------------
// Direct record patches (code files, pages, database records) + email + signals
// ---------------------------------------------------------------------------
export function registerRecordCommands(program: Command, getContext: () => Promise<CliContext>) {
  const record = program.command("record").description("Patch code files, pages, and data records");

  record
    .command("patch-code-file")
    .description("Patch a code file by id")
    .argument("<id>")
    .option("--data <json>", "JSON patch")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, id: string, opts: JsonOpts) =>
        ctx.client.api.patchCodeFile(id, await resolveBody(opts)),
      ),
    );

  record
    .command("patch-page")
    .description("Patch a page by id")
    .argument("<id>")
    .option("--data <json>", "JSON patch")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, id: string, opts: JsonOpts) =>
        ctx.client.api.patchPage(id, await resolveBody(opts)),
      ),
    );

  record
    .command("patch-record")
    .description("Patch a database record by id")
    .argument("<id>")
    .option("--data <json>", "JSON patch")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, id: string, opts: JsonOpts) =>
        ctx.client.api.patchRecord(id, await resolveBody(opts)),
      ),
    );
}

export function registerEmailRecordCommands(parent: Command, getContext: () => Promise<CliContext>) {
  // Extends the existing `account email` surface with message edit/delete.
  parent
    .command("message-update")
    .description("Update an email message (folder/read/starred/subject/body)")
    .argument("<messageId>")
    .option("--data <json>", "JSON patch")
    .option("--file <path>", "JSON file (- for stdin)")
    .action(
      withAction(getContext, async (ctx, messageId: string, opts: JsonOpts) =>
        ctx.client.api.updateEmailMessageApi(messageId, await resolveBody(opts)),
      ),
    );
  parent
    .command("message-delete")
    .description("Delete an email message")
    .argument("<messageId>")
    .action(
      withAction(getContext, async (ctx, messageId: string) =>
        ctx.client.api.deleteEmailMessageApi(messageId),
      ),
    );
}

export function registerSignalCommands(parent: Command, getContext: () => Promise<CliContext>) {
  // Extends the existing `chat` surface with WebRTC signaling.
  const signal = parent.command("signal").description("Direct message call signaling");
  signal
    .command("list")
    .description("Fetch signals for a conversation")
    .argument("<conversationId>")
    .option("--since <iso>")
    .action(
      withAction(getContext, async (ctx, conversationId: string, opts: { since?: string }) =>
        ctx.client.api.fetchDirectMessageSignals(conversationId, opts.since ?? ""),
      ),
    );
  signal
    .command("send")
    .description("Send a signal to a conversation")
    .argument("<conversationId>")
    .requiredOption("--kind <kind>")
    .option("--payload <json>", "JSON payload", "{}")
    .action(
      withAction(getContext, async (ctx, conversationId: string, opts: { kind: string; payload: string }) =>
        ctx.client.api.sendDirectMessageSignal(conversationId, {
          kind: opts.kind as never,
          payload: parseJsonFlag(opts.payload),
        }),
      ),
    );

  // Workspace channel call signaling.
  const channel = signal.command("channel").description("Workspace channel call signaling");
  channel
    .command("list")
    .description("Fetch channel call signals")
    .argument("<conversationId>")
    .argument("[workspaceId]")
    .option("--since <iso>")
    .action(
      withAction(getContext, async (ctx, conversationId: string, workspaceId: string | undefined, opts: { since?: string }) =>
        ctx.client.api.fetchChannelCallSignals(requireWorkspaceId(ctx, workspaceId), conversationId, opts.since ?? ""),
      ),
    );
  channel
    .command("send")
    .description("Send a channel call signal")
    .argument("<conversationId>")
    .argument("[workspaceId]")
    .requiredOption("--kind <kind>")
    .option("--payload <json>", "JSON payload", "{}")
    .action(
      withAction(
        getContext,
        async (ctx, conversationId: string, workspaceId: string | undefined, opts: { kind: string; payload: string }) =>
          ctx.client.api.sendChannelCallSignal(requireWorkspaceId(ctx, workspaceId), conversationId, {
            kind: opts.kind as never,
            payload: parseJsonFlag(opts.payload),
          }),
      ),
    );
}
