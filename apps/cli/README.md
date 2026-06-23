# Flowcard CLI

`flowcard` — full command-line access to the Flowcard API: workspaces, networks,
channels (with live terminal chat), tasks, docs, SQL, services, storage, email,
and enterprise/admin operations.

## Install (from GitHub — free, no npm registry needed)

The CLI is distributed straight from this Git repository. Teammates do **not**
need a published npm package.

One-line install:

```bash
curl -fsSL https://raw.githubusercontent.com/shashank-macherla/Flowcard-CLI/main/scripts/install-cli.sh | bash
```

Or from a clone:

```bash
git clone https://github.com/shashank-macherla/Flowcard-CLI.git
cd Flowcard-CLI
bash scripts/install-cli.sh
```

The installer clones (or updates) the repo, runs `npm install`, builds
`shared → api-client → cli`, and links the `flowcard` command globally. If
`flowcard` is not on your PATH afterward, add your global npm bin directory
(`npm prefix -g` + `/bin`) to PATH.

Requirements: Node.js 20+, npm, git.

## Update

Re-run the installer; it fast-forwards the clone and rebuilds:

```bash
bash scripts/install-cli.sh
```

## Configure

```bash
flowcard config set --api-url https://flowcard.clankite.in
flowcard auth login --email you@example.com --password ******
```

Session and config live in `~/.flowcard/`. Global flags: `--api-url`, `--token`,
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

In `channel chat`, type to send; `/reply -<msgCode> <text>` to quote-reply;
`/refresh`, `/help`, `/quit`.

Run `flowcard help-all` to list every command group, or
`flowcard <group> --help` for subcommands.
