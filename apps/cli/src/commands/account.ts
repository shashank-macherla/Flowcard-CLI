import type { Command } from "commander";
import type { CliContext } from "../context.js";
import { parseJsonFlag, readJsonInput, requireWorkspaceId } from "../context.js";
import { withAction } from "./helpers.js";

export function registerAccountCommands(program: Command, getContext: () => Promise<CliContext>) {
  const account = program.command("account").description("Account security and email");

  account.command("security").action(withAction(getContext, async (ctx) => ctx.client.api.fetchAccountSecurity()));

  account
    .command("password")
    .description("Change account password")
    .requiredOption("--current <password>")
    .requiredOption("--next <password>")
    .action(
      withAction(getContext, async (ctx, opts: { current: string; next: string }) =>
        ctx.client.api.changeAccountPassword({ currentPassword: opts.current, newPassword: opts.next }),
      ),
    );

  const tfa = account.command("2fa").description("Two-factor authentication");
  tfa.command("setup").action(withAction(getContext, async (ctx) => ctx.client.api.setupTwoFactor()));
  tfa
    .command("enable")
    .requiredOption("--code <otp>")
    .action(withAction(getContext, async (ctx, opts: { code: string }) => ctx.client.api.enableTwoFactor({ code: opts.code })));
  tfa
    .command("disable")
    .requiredOption("--password <password>")
    .option("--code <otp>")
    .action(
      withAction(getContext, async (ctx, opts: { password: string; code?: string }) =>
        ctx.client.api.disableTwoFactor({ password: opts.password, code: opts.code }),
      ),
    );

  const email = account.command("email").description("Linked email mailbox");
  email.command("status").action(withAction(getContext, async (ctx) => ctx.client.api.fetchEmailMailbox()));
  email
    .command("link")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, opts: { data?: string; file?: string }) => {
        const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return ctx.client.api.linkEmailAccountApi(body as never);
      }),
    );
  email
    .command("sync")
    .option("--limit <n>")
    .action(withAction(getContext, async (ctx, opts: { limit?: string }) => ctx.client.api.syncEmailMailboxApi({ limit: opts.limit ? Number(opts.limit) : undefined })));
  email.command("disconnect").action(withAction(getContext, async (ctx) => ctx.client.api.disconnectEmailAccountApi()));
  email
    .command("send")
    .option("--data <json>")
    .option("--file <path>")
    .action(
      withAction(getContext, async (ctx, opts: { data?: string; file?: string }) => {
        const body = opts.file ? await readJsonInput(opts.file) : parseJsonFlag(opts.data);
        return ctx.client.api.sendEmailMessageApi(body as never);
      }),
    );
}

export function registerChatCommands(program: Command, getContext: () => Promise<CliContext>) {
  const chat = program.command("chat").description("Direct messages and users");

  chat
    .command("users")
    .description("Search Flowcard users")
    .option("--q <query>")
    .action(withAction(getContext, async (ctx, opts: { q?: string }) => ctx.client.api.searchFlowcardUsers(opts.q ?? "")));

  const dm = chat.command("dm").description("Direct messages");
  dm.command("list").action(withAction(getContext, async (ctx) => ctx.client.api.listDirectMessageConversations()));
  dm
    .command("start")
    .requiredOption("--user-id <id>")
    .action(withAction(getContext, async (ctx, opts: { userId: string }) => ctx.client.api.startDirectMessage(opts.userId)));
  dm
    .command("get")
    .argument("<conversationId>")
    .action(withAction(getContext, async (ctx, conversationId: string) => ctx.client.api.fetchDirectMessageConversation(conversationId)));
  dm
    .command("send")
    .argument("<conversationId>")
    .requiredOption("--body <text>")
    .action(
      withAction(getContext, async (ctx, conversationId: string, opts: { body: string }) =>
        ctx.client.api.sendDirectMessage(conversationId, opts.body),
      ),
    );
}

export function registerStorageCommands(program: Command, getContext: () => Promise<CliContext>) {
  const storage = program.command("storage").description("Cloud storage");

  storage
    .command("workspace-status")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => ctx.client.api.fetchCloudStorageStatus(requireWorkspaceId(ctx, workspaceId))));

  storage.command("account-status").action(withAction(getContext, async (ctx) => ctx.client.api.fetchUserCloudStorageStatus()));

  storage
    .command("workspace-files")
    .argument("[workspaceId]")
    .option("--path <path>")
    .action(
      withAction(getContext, async (ctx, workspaceId: string | undefined, opts: { path?: string }) =>
        ctx.client.api.listCloudStorageFiles(requireWorkspaceId(ctx, workspaceId), opts.path ?? ""),
      ),
    );

  storage
    .command("workspace-test")
    .argument("[workspaceId]")
    .action(withAction(getContext, async (ctx, workspaceId?: string) => ctx.client.api.testCloudStorageApi(requireWorkspaceId(ctx, workspaceId))));

  storage.command("account-test").action(withAction(getContext, async (ctx) => ctx.client.api.testUserCloudStorageApi()));
}

export function registerLegacyCommands(program: Command, getContext: () => Promise<CliContext>) {
  const legacy = program.command("legacy").description("Legacy snapshot API");

  legacy.command("snapshot").action(withAction(getContext, async (ctx) => ctx.client.api.fetchSnapshot()));
  legacy
    .command("message-create")
    .option("--data <json>")
    .action(withAction(getContext, async (ctx, opts: { data?: string }) => ctx.client.api.createMessage(parseJsonFlag(opts.data) as never)));
  legacy
    .command("channel-create")
    .option("--data <json>")
    .action(withAction(getContext, async (ctx, opts: { data?: string }) => ctx.client.api.createChannel(parseJsonFlag(opts.data) as never)));
  legacy
    .command("page-create")
    .option("--data <json>")
    .action(withAction(getContext, async (ctx, opts: { data?: string }) => ctx.client.api.createPage(parseJsonFlag(opts.data) as never)));
  legacy
    .command("record-create")
    .option("--data <json>")
    .action(withAction(getContext, async (ctx, opts: { data?: string }) => ctx.client.api.createRecord(parseJsonFlag(opts.data) as never)));
  legacy
    .command("code-file-create")
    .option("--data <json>")
    .action(withAction(getContext, async (ctx, opts: { data?: string }) => ctx.client.api.createCodeFile(parseJsonFlag(opts.data) as never)));
}

export function registerRawCommand(program: Command, getContext: () => Promise<CliContext>) {
  program
    .command("raw")
    .description("Call any API path directly")
    .argument("<method>", "HTTP method")
    .argument("<path>", "API path e.g. /api/workspaces")
    .option("--data <json>", "JSON request body")
    .option("--file <path>", "JSON body file")
    .option("--no-auth", "Skip authentication")
    .action(
      withAction(getContext, async (ctx, method: string, path: string, opts: { data?: string; file?: string; auth?: boolean }) => {
        const { request } = await import("@flowcard/api-client");
        const context = await ctx.client.getContext();
        const body = opts.file ? await readJsonInput(opts.file) : opts.data ? JSON.parse(opts.data) : undefined;
        return request(context, path, {
          method: method.toUpperCase(),
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        }, { auth: opts.auth !== false });
      }),
    );
}
