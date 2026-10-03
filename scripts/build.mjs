// Concatenates src/*.css (resolving @import) into dist/. No dependencies.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function inline(file, seen = new Set()) {
  if (seen.has(file)) throw new Error(`Circular import: ${file}`);
  seen.add(file);
  const css = readFileSync(file, "utf8");
  return css.replace(/^@import\s+["']([^"']+)["'];?\s*$/gm, (_, rel) =>
    inline(resolve(dirname(file), rel), new Set(seen)).trimEnd(),
  );
}

mkdirSync(resolve(root, "dist"), { recursive: true });

for (const [entry, out] of [
  ["src/sprinteins.css", "dist/sprinteins.css"],
  ["src/fonts.css", "dist/sprinteins-fonts.css"],
]) {
  const css = inline(resolve(root, entry));
  writeFileSync(resolve(root, out), `${css.trimEnd()}\n`);
  console.log(`${out} (${(css.length / 1024).toFixed(1)} KB)`);
}
