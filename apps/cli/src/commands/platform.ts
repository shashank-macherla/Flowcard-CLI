import type { Command } from "commander";
import { getConfigPath, getDefaultConfigDir } from "@flowcard/api-client";
import type { CliContext } from "../context.js";
import { parseJsonFlag, readJsonInput } from "../context.js";
import { promptSecret, promptText } from "../prompt.js";
import { withAction } from "./helpers.js";

export function registerAuthCommands(program: Command, getContext: () => Promise<CliContext>) {
  const auth = program.command("auth").description("Authentication and session");

  auth
    .command("config")
    .description("Show auth provider configuration")
    .action(withAction(getContext, async (ctx) => ctx.client.api.fetchAuthConfig()));

  auth
    .command("signup")
    .description("Create a new account")
    .option("--name <name>", "Full name (prompted if omitted)")
    .option("--email <email>", "Account email (prompted if omitted)")
    .option("--password <password>", "Account password (prompted securely if omitted)")
    .action(
      withAction(getContext, async (ctx, opts: { name?: string; email?: string; password?: string }) => {
        const name = opts.name ?? (await promptText("Name"));
        const email = opts.email ?? (await promptText("Email"));
        const password = opts.password ?? (await promptSecret("Password"));
        const session = await ctx.client.api.signUp({ name, email, password });
        await ctx.client.setSession(session);
        return session;
      }),
    );

  auth
    .command("login")
    .description("Sign in and save session")
    .option("--email <email>", "Account email (prompted if omitted)")
    .option("--password <password>", "Account password (prompted securely if omitted)")
    .option("--otp <code>", "Two-factor code")
    .action(
      withAction(getContext, async (ctx, opts: { email?: string; password?: string; otp?: string }) => {
        const email = opts.email ?? (await promptText("Email"));
        const password = opts.password ?? (await promptSecret("Password"));
        const session = await ctx.client.api.signIn({ email, password, otp: opts.otp });
        await ctx.client.setSession(session);
        return session;
      }),
    );

  auth
    .command("logout")
    .description("Sign out and clear saved session")
    .action(
      withAction(getContext, async (ctx) => {
        await ctx.client.api.signOut();
        await ctx.client.setSession(null);
        return { ok: true };
      }),
    );

  auth
    .command("me")
    .description("Show current user")
    .action(withAction(getContext, async (ctx) => ctx.client.api.fetchCurrentUser()));

  auth
    .command("password-forgot")
    .description("Request password reset email")
    .requiredOption("--email <email>")
    .action(withAction(getContext, async (ctx, opts: { email: string }) => ctx.client.api.requestPasswordReset({ email: opts.email })));

  auth
    .command("password-reset")
    .description("Reset password with token")
    .requiredOption("--token <token>")
    .requiredOption("--password <password>")
    .action(
      withAction(getContext, async (ctx, opts: { token: string; password: string }) =>
        ctx.client.api.resetPassword({ token: opts.token, newPassword: opts.password }),
      ),
    );
}

export function registerConfigCommands(program: Command, getContext: () => Promise<CliContext>) {
  const config = program.command("config").description("CLI configuration");

  config
    .command("path")
    .description("Show config directory and files")
    .action(
      withAction(getContext, async () => ({
        configDir: getDefaultConfigDir(),
        configPath: getConfigPath(),
      })),
    );

  config
    .command("show")
    .description("Show saved CLI configuration")
    .action(withAction(getContext, async (ctx) => ctx.client.getConfig()));

  config
    .command("set")
    .description("Update CLI configuration")
    .option("--api-url <url>")
    .option("--token <token>")
    .option("--workspace <id>")
    .option("--network <id>")
    .option("--output <format>", "json|pretty|table")
    .action(
      withAction(getContext, async (ctx, opts: { apiUrl?: string; token?: string; workspace?: string; network?: string; output?: string }) => {
        return ctx.client.updateConfig({
          apiUrl: opts.apiUrl,
          token: opts.token,
          workspaceId: opts.workspace,
          networkId: opts.network,
          defaultOutput: opts.output as "json" | "pretty" | "table" | undefined,
        });
      }),
    );
}

export function registerHealthCommands(program: Command, getContext: () => Promise<CliContext>) {
  program
    .command("health")
    .description("API liveness check")
    .action(async () => {
      const ctx = await getContext();
      const config = await ctx.client.getConfig();
      const response = await fetch(`${config.apiUrl}/health`);
      const body = await response.json();
      console.log(JSON.stringify({ status: response.status, body }, null, 2));
    });

  program
    .command("ready")
    .description("API readiness check")
    .action(withAction(getContext, async (ctx) => ctx.client.api.fetchRuntimeReadiness()));

  program
    .command("version")
    .description("Show CLI version")
    .action(withAction(getContext, async () => ({ name: "@flowcard/cli", version: "1.0.0" })));
}
