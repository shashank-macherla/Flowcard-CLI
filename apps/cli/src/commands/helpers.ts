import type { Command } from "commander";
import type { CliContext, GlobalCliOptions } from "../context.js";
import { runCommand } from "../output.js";

export type CommandRegistrar = (program: Command, getContext: () => Promise<CliContext>) => void;

export function outputFormat(options: GlobalCliOptions) {
  return options.output ?? "pretty";
}

export function withAction(
  getContext: () => Promise<CliContext>,
  handler: (ctx: CliContext, ...args: any[]) => Promise<unknown>,
) {
  return async (...args: unknown[]) => {
    const ctx = await getContext();
    await runCommand(() => handler(ctx, ...args), outputFormat(ctx.options));
  };
}

export function addCrudResource(
  parent: Command,
  getContext: () => Promise<CliContext>,
  config: {
    name: string;
    description: string;
    list: (ctx: CliContext, scopeId: string) => Promise<unknown>;
    get?: (ctx: CliContext, scopeId: string, id: string) => Promise<unknown>;
    create?: (ctx: CliContext, scopeId: string, body: Record<string, unknown>) => Promise<unknown>;
    update?: (ctx: CliContext, scopeId: string, id: string, body: Record<string, unknown>) => Promise<unknown>;
    delete?: (ctx: CliContext, scopeId: string, id: string) => Promise<unknown>;
    scopeArgName?: string;
  },
) {
  const group = parent.command(config.name).description(config.description);
  group
    .command("list")
    .description(`List ${config.name}`)
    .argument("[scopeId]", `Scope id (${config.scopeArgName ?? "scope"})`)
    .action(withAction(getContext, async (ctx, scopeId: string) => config.list(ctx, scopeId)));

  if (config.create) {
    group
      .command("create")
      .description(`Create ${config.name.slice(0, -1) || config.name}`)
      .argument("[scopeId]", "Scope id")
      .option("--data <json>", "JSON body")
      .option("--file <path>", "JSON file (- for stdin)")
      .action(
        withAction(getContext, async (ctx, scopeId: string, opts: { data?: string; file?: string }) => {
          const { readJsonInput, parseJsonFlag } = await import("../context.js");
          const body = opts.file ? ((await readJsonInput(opts.file)) as Record<string, unknown>) : parseJsonFlag(opts.data);
          return config.create!(ctx, scopeId, body);
        }),
      );
  }

  if (config.update) {
    group
      .command("update")
      .description(`Update ${config.name.slice(0, -1) || config.name}`)
      .argument("<id>", "Resource id")
      .argument("[scopeId]", "Scope id")
      .option("--data <json>", "JSON body")
      .option("--file <path>", "JSON file")
      .action(
        withAction(getContext, async (ctx, id: string, scopeId: string, opts: { data?: string; file?: string }) => {
          const { readJsonInput, parseJsonFlag } = await import("../context.js");
          const body = opts.file ? ((await readJsonInput(opts.file)) as Record<string, unknown>) : parseJsonFlag(opts.data);
          return config.update!(ctx, scopeId, id, body);
        }),
      );
  }

  if (config.delete) {
    group
      .command("delete")
      .description(`Delete ${config.name.slice(0, -1) || config.name}`)
      .argument("<id>", "Resource id")
      .argument("[scopeId]", "Scope id")
      .action(withAction(getContext, async (ctx, id: string, scopeId: string) => config.delete!(ctx, scopeId, id)));
  }
}
