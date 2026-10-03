// WCAG contrast check for every theme in src/themes (6-digit hex tokens only),
// plus theme consistency: auto.css == dark.css, theme list in sync with the demo.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = resolve(root, "src/themes");

// Mirrors body > footer in src/layout.css
const FOOTER_ON_ACCENT = "#000003";
const FOOTER_MUTED_MIX = 0.72;

const checks = [
  ["fg", "bg", 4.5, "text"],
  ["muted", "bg", 4.5, "muted text"],
  ["fg", "surface", 4.5, "text on surface"],
  ["muted", "surface", 4.5, "muted on surface"],
  ["accent", "bg", 3, "accent on bg (UI)"],
  ["accent", "surface", 3, "accent on surface (UI)"],
  ["on-accent", "accent", 4.5, "text on accent"],
  ["footer-fg", "footer-bg", 4.5, "footer text"],
  ["footer-muted", "footer-bg", 4.5, "footer muted text"],
  ["footer-accent", "footer-bg", 3, "footer accent (UI)"],
  ["footer-on-accent", "footer-accent", 4.5, "text on footer accent"],
];

const channel = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const mix = (a, b, weight) => {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(a.slice(i, i + 2), 16) * weight + parseInt(b.slice(i, i + 2), 16) * (1 - weight);
    return Math.round(v).toString(16).padStart(2, "0");
  });
  return `#${c.join("")}`;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const readTokens = (file) =>
  Object.fromEntries(
    [...readFileSync(resolve(dir, file), "utf8").matchAll(/--se-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map(([, k, v]) => [k, v]),
  );

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`FAIL  ${msg}`);
};

const themeFiles = readdirSync(dir).filter((f) => f.endsWith(".css") && !/^(index|derived|_)/.test(f));
for (const file of themeFiles) {
  const tokens = readTokens(file);
  if (tokens["footer-fg"] && tokens["footer-bg"]) {
    tokens["footer-on-accent"] = FOOTER_ON_ACCENT;
    tokens["footer-muted"] = mix(tokens["footer-fg"], tokens["footer-bg"], FOOTER_MUTED_MIX);
  }
  for (const [fg, bg, min, label] of checks) {
    if (!tokens[fg] || !tokens[bg]) {
      fail(`${file} ${label}: missing --se-${tokens[fg] ? bg : fg}`);
      continue;
    }
    const r = ratio(tokens[fg], tokens[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(`${ok ? "ok   " : "FAIL "} ${file.padEnd(15)} ${label.padEnd(22)} ${r.toFixed(2)} (min ${min})`);
  }
}

// auto.css must carry the same tokens as dark.css
const dark = readTokens("dark.css");
const auto = readTokens("auto.css");
for (const key of new Set([...Object.keys(dark), ...Object.keys(auto)])) {
  if (dark[key] !== auto[key]) fail(`auto.css --se-${key} (${auto[key]}) != dark.css (${dark[key]})`);
}

// Theme list: src/themes/index.css is the source of truth
const sorted = (list) => [...list].sort().join(",");
const imported = [...readFileSync(resolve(dir, "index.css"), "utf8").matchAll(/@import\s+"\.\/(\w+)\.css"/g)]
  .map(([, n]) => n)
  .filter((n) => n !== "derived");
const demoOptions = [...readFileSync(resolve(root, "demo/index.html"), "utf8").matchAll(/<option value="(\w+)"/g)].map(([, n]) => n);
const demoThemes = JSON.parse(
  readFileSync(resolve(root, "demo/theme.js"), "utf8").match(/THEMES = (\[[^\]]*\])/)[1],
);
if (sorted(demoOptions) !== sorted(imported)) fail(`demo/index.html <option>s [${demoOptions}] != index.css [${imported}]`);
if (sorted(demoThemes) !== sorted(imported)) fail(`demo/theme.js THEMES [${demoThemes}] != index.css [${imported}]`);

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
