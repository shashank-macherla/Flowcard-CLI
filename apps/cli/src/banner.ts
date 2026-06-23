import { glyph, style } from "./theme.js";

// The Flowcard mark is four vertical rounded bars of ascending-then-descending
// height (F·L·O·W), a "flow"/equalizer motif. This ASCII banner mirrors that
// exact silhouette: bar 3 (O) is tallest, bar 1 (F) shortest — matching the SVG
// heights 68 / 120 / 197 / 90. Monochrome-friendly; renders in any terminal.
const MARK = [
  "                  ▟██▙        ",
  "           ▟██▙   ████        ",
  "           ████   ████  ▟██▙  ",
  "   ▟██▙    ████   ████  ████  ",
  "   ████    ████   ████  ████  ",
  "   ████    ████   ████  ████  ",
  "   ████    ████   ████  ████  ",
  "   █F█▌    █L█▌   █O█▌  █W█▌  ",
  "   ▜██▛    ▜██▛   ▜██▛  ▜██▛  ",
];

// Wordmark — clean geometric block capitals for FLOWCARD.
const WORDMARK = [
  "█▀▀ █   █▀█ █   █ █▀▀ █▀█ █▀█ █▀▄",
  "█▀▀ █   █ █ █ █ █ █   █▀█ █▀▄ █ █",
  "▀   ▀▀▀ ▀▀▀ ▀▀▀▀▀ ▀▀▀ ▀ ▀ ▀ ▀ ▀▀ ",
];

export type BannerOptions = {
  version?: string;
  tagline?: string;
  apiUrl?: string;
  user?: string;
};

function rule(width = 56): string {
  return style.dim("─".repeat(width));
}

export function renderBanner(options: BannerOptions = {}): string {
  const { version = "0.1.0", tagline = "The workspace operating system", apiUrl, user } = options;

  const lines: string[] = [""];
  for (const row of MARK) lines.push(`  ${style.bold(row)}`);
  lines.push("");
  for (const row of WORDMARK) lines.push(`  ${style.bold(row)}`);
  lines.push("");
  lines.push(`  ${style.bold("Flowcard CLI")} ${style.dim(`v${version}`)}`);
  lines.push(`  ${style.dim(tagline)}`);
  lines.push("");
  lines.push(`  ${rule()}`);

  // Optional status footer (connection / signed-in user), CLI-tool style.
  const status: string[] = [];
  if (apiUrl) status.push(`${glyph.arrow} ${style.dim("API")}  ${apiUrl}`);
  status.push(
    user ? `${glyph.success} ${style.dim("Signed in as")} ${style.bold(user)}` : `${glyph.info} ${style.dim("Not signed in — run")} ${style.bold("flowcard auth login")}`,
  );
  for (const item of status) lines.push(`  ${item}`);
  lines.push("");

  return lines.join("\n");
}

// Compact one-line wordmark for help headers etc.
export function bannerTagline(version = "0.1.0"): string {
  return `${style.bold("Flowcard CLI")} ${style.dim(`v${version}`)} ${glyph.bullet} ${style.dim("workspace operating system")}`;
}
