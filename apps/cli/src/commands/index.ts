import type { Command } from "commander";
import type { CliContext } from "../context.js";
import { registerAccountCommands, registerChatCommands, registerLegacyCommands, registerRawCommand, registerStorageCommands } from "./account.js";
import { registerAuthCommands, registerConfigCommands, registerHealthCommands } from "./platform.js";
import { registerAdminCommands, registerEnterpriseCommands, registerServicesCommands } from "./services.js";
import { registerNetworkCommands, registerWorkspaceCommands } from "./workspace.js";
import {
  registerAccessCommands,
  registerAutomationCommands,
  registerEmailRecordCommands,
  registerNetworkAdminCommands,
  registerRecordCommands,
  registerSignalCommands,
} from "./extra.js";
import { registerChannelCommands } from "./channel.js";

// Find a registered top-level command group by name (for extending existing groups).
function findGroup(program: Command, name: string): Command {
  const group = program.commands.find((command) => command.name() === name);
  if (!group) throw new Error(`Internal CLI error: command group "${name}" not registered`);
  return group;
}

export function registerAllCommands(program: Command, getContext: () => Promise<CliContext>) {
  registerAuthCommands(program, getContext);
  registerConfigCommands(program, getContext);
  registerHealthCommands(program, getContext);
  registerWorkspaceCommands(program, getContext);
  registerNetworkCommands(program, getContext);
  registerServicesCommands(program, getContext);
  registerAccountCommands(program, getContext);
  registerChatCommands(program, getContext);
  registerStorageCommands(program, getContext);
  registerEnterpriseCommands(program, getContext);
  registerAdminCommands(program, getContext);
  registerLegacyCommands(program, getContext);
  registerRawCommand(program, getContext);

  // Gap-closing command groups.
  registerAutomationCommands(program, getContext);
  registerNetworkAdminCommands(program, getContext);
  registerAccessCommands(program, getContext);
  registerRecordCommands(program, getContext);
  registerChannelCommands(program, getContext);

  // Extend existing groups with edit/delete and signaling commands.
  const account = findGroup(program, "account");
  const email = account.commands.find((command) => command.name() === "email");
  if (email) registerEmailRecordCommands(email, getContext);
  registerSignalCommands(findGroup(program, "chat"), getContext);
}

export function printCommandOverview(program: Command) {
  console.log("Flowcard CLI — full access to the Flowcard API.");
  console.log("");
  console.log("Top-level command groups:");
  for (const command of program.commands) {
    console.log(`  ${command.name().padEnd(14)} ${command.description()}`);
  }
  console.log("");
  console.log("Use `flowcard <command> --help` for subcommands.");
}
