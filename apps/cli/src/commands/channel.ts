import { createInterface } from "node:readline";
import type { Command } from "commander";
import type { CliContext } from "../context.js";
import { withAction } from "./helpers.js";
import { glyph, style } from "../theme.js";

type Channel = { id: string; name: string; topic?: string; code?: string };
type Message = { id: string; channelId: string; author?: string; body: string; time?: string };

// Short, human-typable code for a message (used by /reply -<code>).
function msgCode(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toLowerCase();
}

function findChannel(channels: Channel[], ref: string): Channel | undefined {
  const needle = ref.trim();
  const lower = needle.toLowerCase();
  return (
    channels.find((c) => c.code && c.code.toLowerCase() === lower) ??
    channels.find((c) => c.id === needle) ??
    channels.find((c) => c.name?.toLowerCase() === lower.replace(/^#/, ""))
  );
}

function formatMessage(message: Message): string {
  const code = style.dim(`[${msgCode(message.id)}]`);
  const author = style.bold(style.cyan(message.author || "unknown"));
  const time = message.time ? style.dim(message.time) : "";
  return `${code} ${author} ${time}\n    ${message.body}`;
}

async function loadState(ctx: CliContext, channelRef: string) {
  const snapshot = (await ctx.client.api.fetchSnapshot()) as { channels: Channel[]; messages: Message[] };
  const channel = findChannel(snapshot.channels ?? [], channelRef);
  if (!channel) {
    throw Object.assign(new Error(`No channel found for "${channelRef}". Try \`flowcard channel list\`.`), { status: 404 });
  }
  const messages = (snapshot.messages ?? []).filter((m) => m.channelId === channel.id);
  return { channel, messages };
}

export function registerChannelCommands(program: Command, getContext: () => Promise<CliContext>) {
  const channel = program.command("channel").description("Workspace channels and live chat");

  // List channels with their shareable codes.
  channel
    .command("list")
    .description("List channels and their codes")
    .action(
      withAction(getContext, async (ctx) => {
        const snapshot = (await ctx.client.api.fetchSnapshot()) as { channels: Channel[] };
        return (snapshot.channels ?? []).map((c) => ({ code: c.code ?? "—", name: c.name, topic: c.topic, id: c.id }));
      }),
    );

  // Fetch a single message by its short code (non-interactive).
  channel
    .command("message")
    .description("Fetch a single message by its code")
    .argument("<messageCode>", "Short message code shown in chat, e.g. a1b2c3")
    .action(
      withAction(getContext, async (ctx, messageCode: string) => {
        const snapshot = (await ctx.client.api.fetchSnapshot()) as { messages: Message[] };
        const needle = messageCode.trim().toLowerCase();
        const match = (snapshot.messages ?? []).find((m) => msgCode(m.id) === needle || m.id === messageCode);
        if (!match) {
          throw Object.assign(new Error(`No message found for code "${messageCode}".`), { status: 404 });
        }
        return match;
      }),
    );

  // Read a channel's conversation once (non-interactive).
  channel
    .command("read")
    .description("Print a channel's recent messages and exit")
    .argument("<channelCode>", "Channel code (or id / #name)")
    .option("--limit <n>", "Max messages to show", "50")
    .action(
      withAction(getContext, async (ctx, channelCode: string, opts: { limit?: string }) => {
        const { channel: ch, messages } = await loadState(ctx, channelCode);
        const limit = Math.max(1, Number(opts.limit) || 50);
        const recent = messages.slice(-limit);
        return {
          channel: { code: ch.code, name: ch.name, topic: ch.topic },
          messages: recent.map((m) => ({ code: msgCode(m.id), author: m.author, time: m.time, body: m.body })),
        };
      }),
    );

  // Interactive chat: start a live conversation in the terminal.
  channel
    .command("chat")
    .description("Open an interactive chat session for a channel")
    .argument("<channelCode>", "Channel code (or id / #name)")
    .option("--poll <seconds>", "Refresh interval for new messages", "3")
    .action(
      withAction(getContext, async (ctx, channelCode: string, opts: { poll?: string }) => {
        await runChat(ctx, channelCode, Math.max(1, Number(opts.poll) || 3));
        return undefined;
      }),
    );
}

async function runChat(ctx: CliContext, channelRef: string, pollSeconds: number) {
  const { channel, messages } = await loadState(ctx, channelRef);

  // Banner + history.
  process.stdout.write(
    `\n${glyph.info} ${style.bold(`#${channel.name}`)} ${style.dim(channel.code ? `(${channel.code})` : "")}\n` +
      `${style.dim(channel.topic || "")}\n` +
      `${style.dim("Type a message and press Enter. Commands: /reply -<code> <text>, /refresh, /help, /quit")}\n\n`,
  );
  for (const message of messages) process.stdout.write(`${formatMessage(message)}\n`);

  const seen = new Set(messages.map((m) => m.id));

  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: style.dim("› ") });
  let closed = false;
  const prompt = (preserveCursor?: boolean) => {
    if (!closed) rl.prompt(preserveCursor);
  };

  // Poll for new messages from other participants.
  const poll = setInterval(async () => {
    try {
      const fresh = (await ctx.client.api.fetchSnapshot()) as { messages: Message[] };
      const incoming = (fresh.messages ?? []).filter((m) => m.channelId === channel.id && !seen.has(m.id));
      if (incoming.length) {
        process.stdout.write("\n");
        for (const message of incoming) {
          seen.add(message.id);
          process.stdout.write(`${formatMessage(message)}\n`);
        }
        prompt(true);
      }
    } catch {
      // Transient poll failure — ignore; next tick retries.
    }
  }, pollSeconds * 1000);

  const send = async (body: string, replyToCode?: string) => {
    let text = body;
    if (replyToCode) {
      const quoted = findQuoted(messages, replyToCode);
      text = quoted
        ? `↳ re ${replyToCode} (${quoted.author || "unknown"}: "${truncate(quoted.body, 40)}"): ${body}`
        : `↳ re ${replyToCode}: ${body}`;
    }
    try {
      const created = (await ctx.client.api.createMessage({ channelId: channel.id, body: text })) as Message;
      if (created?.id) {
        seen.add(created.id);
        messages.push(created);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      process.stdout.write(`${glyph.error} ${style.red("Send failed")}: ${message}\n`);
    }
  };

  return new Promise<void>((resolve) => {
    rl.prompt();
    rl.on("line", async (line) => {
      const input = line.trim();
      if (!input) return prompt();

      if (input === "/quit" || input === "/exit") {
        rl.close();
        return;
      }
      if (input === "/help") {
        process.stdout.write(
          `${style.dim("Commands:")}\n` +
            `  ${style.bold("/reply -<code> <text>")}  quote-reply to a message\n` +
            `  ${style.bold("/refresh")}               re-pull the conversation\n` +
            `  ${style.bold("/quit")}                  leave the chat\n`,
        );
        return prompt();
      }
      if (input === "/refresh") {
        try {
          const fresh = (await ctx.client.api.fetchSnapshot()) as { messages: Message[] };
          const all = (fresh.messages ?? []).filter((m) => m.channelId === channel.id);
          for (const message of all) {
            if (!seen.has(message.id)) {
              seen.add(message.id);
              process.stdout.write(`${formatMessage(message)}\n`);
            }
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          process.stdout.write(`${glyph.error} ${style.red("Refresh failed")}: ${message}\n`);
        }
        return prompt();
      }

      const reply = input.match(/^\/reply\s+-(\S+)\s+([\s\S]+)$/);
      if (reply) {
        await send(reply[2], reply[1].toLowerCase());
        return prompt();
      }
      if (input.startsWith("/")) {
        process.stdout.write(`${glyph.warn} ${style.yellow("Unknown command")}. Try /help.\n`);
        return prompt();
      }

      await send(input);
      prompt();
    });
    rl.on("close", () => {
      closed = true;
      clearInterval(poll);
      process.stdout.write(`\n${glyph.success} ${style.dim("Left the chat.")}\n`);
      resolve();
    });
  });
}

function findQuoted(messages: Message[], code: string): Message | undefined {
  return messages.find((m) => msgCode(m.id) === code);
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}
