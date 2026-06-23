#!/usr/bin/env node
import { Command } from "commander";
import { createCliContext, type GlobalCliOptions } from "./context.js";
import { printCommandOverview, registerAllCommands } from "./commands/index.js";

const globalOptions: GlobalCliOptions = {};

const program = new Command();

program
  .name("flowcard")
  .description("Flowcard CLI — workspace, networks, code, SQL, services, and more")
  .version("0.1.0")
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

if (process.argv.length <= 2) {
  printCommandOverview(program);
} else {
  program.parse(process.argv);
}
