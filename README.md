# Flowcard CLI

`flowcard` — full command-line access to the Flowcard API: workspaces, networks,
channels (with live terminal chat), tasks, docs, SQL, services, storage, email,
and enterprise/admin operations.

This repository is the standalone CLI. It talks to a running Flowcard API over
HTTP and does not contain the server. Distributed straight from GitHub — no npm
registry or paid package publishing required.

## Install

One-line:

```bash
curl -fsSL https://raw.githubusercontent.com/shashank-macherla/Flowcard-CLI/main/scripts/install-cli.sh | bash
```

From a clone:

```bash
git clone https://github.com/shashank-macherla/Flowcard-CLI.git
cd Flowcard-CLI
bash scripts/install-cli.sh
```

The installer runs `npm install`, builds `shared → api-client → cli`, and links
the `flowcard` command globally. Requirements: **Node.js 20+**, npm, git.

If `flowcard` isn't on your PATH afterward, add your global npm bin directory
(`npm prefix -g` + `/bin`) to PATH, or run it directly:

```bash
node "$HOME/.flowcard-cli/src/apps/cli/bin/flowcard.js" --help
```

## Update

Re-run the installer; it fast-forwards the clone and rebuilds.

## Configure

```bash
flowcard config set --api-url https://flowcard.clankite.in
flowcard auth login --email you@example.com --password ******
```

Config and session live in `~/.flowcard/`. Global flags: `--api-url`, `--token`,
`--workspace`, `--network`, `--output json|pretty|table`, `--retries <n>`,
`--no-retry`.

## Examples

```bash
flowcard health
flowcard workspace list
flowcard workspace sql-query <workspaceId> --query "select * from tasks"
flowcard network sql-query <networkId> --query "show tables"
flowcard services context <workspaceId>
flowcard channel list
flowcard channel chat CHAN-XXXXXX          # interactive terminal chat
flowcard channel message <messageCode>     # fetch a single message
```

Run `flowcard help-all` for every command group, or `flowcard <group> --help`.

## Develop

```bash
npm install
npm run build:cli
npm run check:cli
node apps/cli/bin/flowcard.js --help
```

## Layout

```
apps/cli              Commander CLI (the flowcard binary)
packages/api-client   HTTP client, config, session, transport (with retries)
packages/shared       Shared types and helpers
scripts/install-cli.sh GitHub one-line installer
```
