import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);
const portArg = args.find((a) => a.startsWith("--port="));
const port = Number(portArg?.split("=")[1] ?? process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("Usage: node scripts/serve.mjs [--port=<1-65535>] [--open]");
  process.exit(1);
}
const open = args.includes("--open");

// Only these top-level dirs are served; everything else (.git, scripts, .env, ...) is 404.
const allowed = new Set(["demo", "dist", "assets", "fonts"]);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path === "/") {
      res.writeHead(302, { Location: "/demo/" }).end();
      return;
    }
    const file = resolve(root, "." + path);
    const rel = relative(root, file);
    if (rel.startsWith("..") || isAbsolute(rel) || !allowed.has(rel.split(sep)[0])) {
      res.writeHead(404).end("Not found");
      return;
    }
    let target = file;
    if ((await stat(target)).isDirectory()) target = join(target, "index.html");
    const body = await readFile(target);
    res.writeHead(200, {
      "Content-Type": types[extname(target)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  const url = `http://localhost:${port}/demo/`;
  console.log(`Serving ${url}`);
  if (open) exec(`${process.platform === "darwin" ? "open" : "xdg-open"} ${url}`);
});
