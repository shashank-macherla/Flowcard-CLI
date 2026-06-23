#!/usr/bin/env bash
#
# Flowcard CLI installer — clone (or update), build, and link the `flowcard`
# command. Distributes entirely from GitHub; no npm registry / paid package
# publishing required.
#
# Quick install (from anywhere):
#   curl -fsSL https://raw.githubusercontent.com/shashank-macherla/Flowcard-CLI/main/scripts/install-cli.sh | bash
#
# Or, from an existing clone:
#   bash scripts/install-cli.sh
#
# Environment overrides:
#   FLOWCARD_REPO    Git URL to clone (default: the GitHub repo below)
#   FLOWCARD_REF     Branch/tag/commit to install (default: main)
#   FLOWCARD_DIR     Where to clone (default: ~/.flowcard-cli/src)

set -euo pipefail

REPO="${FLOWCARD_REPO:-https://github.com/shashank-macherla/Flowcard-CLI.git}"
REF="${FLOWCARD_REF:-main}"
SRC_DIR="${FLOWCARD_DIR:-$HOME/.flowcard-cli/src}"

info() { printf '\033[34mℹ\033[39m %s\n' "$1"; }
ok()   { printf '\033[32m✔\033[39m %s\n' "$1"; }
die()  { printf '\033[31m✖\033[39m %s\n' "$1" >&2; exit 1; }

command -v node >/dev/null 2>&1 || die "Node.js is required. Install Node 20+ first."
command -v npm  >/dev/null 2>&1 || die "npm is required (ships with Node.js)."
command -v git  >/dev/null 2>&1 || die "git is required."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  die "Node 20+ required (found $(node -v)). The CLI relies on node:sqlite-era APIs and modern fetch."
fi

# Clone or update.
if [ -d "$SRC_DIR/.git" ]; then
  info "Updating existing clone at $SRC_DIR"
  git -C "$SRC_DIR" fetch --depth 1 origin "$REF"
  git -C "$SRC_DIR" checkout -q "$REF"
  git -C "$SRC_DIR" reset --hard -q "origin/$REF" 2>/dev/null || git -C "$SRC_DIR" reset --hard -q "$REF"
else
  info "Cloning $REPO ($REF)"
  mkdir -p "$(dirname "$SRC_DIR")"
  git clone --depth 1 --branch "$REF" "$REPO" "$SRC_DIR" 2>/dev/null \
    || git clone "$REPO" "$SRC_DIR"
fi

cd "$SRC_DIR"

info "Installing dependencies"
npm install --no-audit --no-fund

info "Building the CLI (shared → api-client → cli)"
npm run build:cli

info "Linking the \`flowcard\` command globally"
npm link -w @flowcard/cli

if command -v flowcard >/dev/null 2>&1; then
  ok "Installed. Try: flowcard --help"
  flowcard --version || true
else
  ok "Built and linked."
  cat <<'EOF'

The `flowcard` command is not on your PATH yet. npm linked it into your global
prefix; add that prefix's bin directory to PATH. Find it with:

  npm prefix -g        # then add "<that>/bin" to your PATH

Or run the CLI directly:

  node "$HOME/.flowcard-cli/src/apps/cli/bin/flowcard.js" --help
EOF
fi
