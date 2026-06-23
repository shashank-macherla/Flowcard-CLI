#!/usr/bin/env node
import { Command } from "commander";
import { createCliContext, type GlobalCliOptions } from "./context.js";
import { printCommandOverview, registerAllCommands } from "./commands/index.js";
import { renderBanner } from "./banner.js";

const CLI_VERSION = "1.0.0";

const globalOptions: GlobalCliOptions = {};

const program = new Command();

program
  .name("flowcard")
  .description("Flowcard CLI — workspace, networks, code, SQL, services, and more")
  .version(CLI_VERSION)
  .option("--api-url <url>", "Flowcard API base URL", process.env.FLOWCARD_API_URL)
  .option("--token <token>", "Bearer token or service token", process.env.FLOWCARD_API_TOKEN)
  .option("--workspace <id>", "Default workspace id", process.env.FLOWCARD_WORKSPACE_ID)
  .option("--network <id>", "Default network id", process.env.FLOWCARD_NETWORK_ID)
  .option("--output <format>", "Output format: json, pretty, table", process.env.FLOWCARD_OUTPUT ?? "pretty")
  .option("--retries <n>", "Retry attempts for transient failures (idempotent requests)")
  .option("--no-retry", "Disable automatic retries")
  .option("-q, --quiet", "Suppress non-essential output")
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.opts();
    globalOptions.apiUrl = opts.apiUrl;
    globalOptions.token = opts.token;
    globalOptions.workspace = opts.workspace;
    globalOptions.network = opts.network;
    globalOptions.output = opts.output;
    globalOptions.quiet = opts.quiet;
    // Commander sets opts.retry === false when --no-retry is passed.
    if (opts.retry === false) globalOptions.retries = 0;
    else if (opts.retries !== undefined) globalOptions.retries = Number(opts.retries);
  });

let contextPromise: ReturnType<typeof createCliContext> | null = null;
const getContext = () => {
  if (!contextPromise) contextPromise = createCliContext(globalOptions);
  return contextPromise;
};

registerAllCommands(program, getContext);

program
  .command("help-all")
  .description("List all top-level command groups")
  .action(() => printCommandOverview(program));

program
  .command("banner")
  .description("Show the Flowcard CLI banner")
  .action(async () => {
    let apiUrl: string | undefined;
    let user: string | undefined;
    try {
      const ctx = await createCliContext(globalOptions);
      const context = await ctx.client.getContext();
      apiUrl = context.config.apiUrl;
      user = context.session?.user?.name ?? context.session?.user?.email;
    } catch {
      // Banner is best-effort; show it without status if config can't load.
    }
    process.stdout.write(`${renderBanner({ version: CLI_VERSION, apiUrl, user })}\n`);
  });

if (process.argv.length <= 2) {
  // No command: show the branded startup screen, then the command overview.
  // Suppressed when output is piped (not a TTY) or JSON is requested, so
  // scripted use stays clean.
  const wantsBanner = process.stdout.isTTY && process.env.FLOWCARD_OUTPUT !== "json" && !process.env.NO_BANNER;
  if (wantsBanner) {
    process.stdout.write(`${renderBanner({ version: CLI_VERSION })}\n`);
  }
  printCommandOverview(program);
} else {
  program.parse(process.argv);
}
