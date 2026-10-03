// WCAG contrast check for every theme in src/themes (6-digit hex tokens only).
import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const dir = resolve(dirname(fileURLToPath(import.meta.url)), "../src/themes");

const checks = [
  ["fg", "bg", 4.5, "text"],
  ["muted", "bg", 4.5, "muted text"],
  ["fg", "surface", 4.5, "text on surface"],
  ["muted", "surface", 4.5, "muted on surface"],
  ["accent", "bg", 3, "accent on bg (UI)"],
  ["accent", "surface", 3, "accent on surface (UI)"],
  ["on-accent", "accent", 4.5, "text on accent"],
  ["footer-fg", "footer-bg", 4.5, "footer text"],
  ["footer-accent", "footer-bg", 3, "footer accent (UI)"],
];

const channel = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failures = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".css") && !/^(index|derived|_)/.test(f))) {
  const css = readFileSync(resolve(dir, file), "utf8");
  const tokens = Object.fromEntries(
    [...css.matchAll(/--se-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map(([, k, v]) => [k, v]),
  );
  for (const [fg, bg, min, label] of checks) {
    if (!tokens[fg] || !tokens[bg]) {
      console.log(`SKIP  ${file} ${label}: missing --se-${tokens[fg] ? bg : fg}`);
      continue;
    }
    const r = ratio(tokens[fg], tokens[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(`${ok ? "ok   " : "FAIL "} ${file.padEnd(11)} ${label.padEnd(20)} ${r.toFixed(2)} (min ${min})`);
  }
}

if (failures) {
  console.error(`\n${failures} contrast check(s) failed`);
  process.exit(1);
}
