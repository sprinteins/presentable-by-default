// Publish to npm: node scripts/publish.mjs [patch|minor|major|<x.y.z>] [--dry-run] [--tag=<tag>] [--otp=<code>]
// Steps: npm login check, build + contrast check, optional version bump, pack preview, publish.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith("--"));
const bump = args.find((a) => !a.startsWith("--"));
const dryRun = flags.includes("--dry-run");
const tag = flags.find((a) => a.startsWith("--tag="));
const otp = flags.find((a) => a.startsWith("--otp="));

function run(cmd, cmdArgs, { allowFail = false } = {}) {
  console.log(`\n> ${cmd} ${cmdArgs.join(" ")}`);
  const r = spawnSync(cmd, cmdArgs, { stdio: "inherit" });
  if (r.status !== 0 && !allowFail) {
    console.error(`\nFailed: ${cmd} ${cmdArgs.join(" ")}`);
    process.exit(r.status ?? 1);
  }
  return r.status === 0;
}

const pkg = () => JSON.parse(readFileSync("package.json", "utf8"));

if (pkg().private) {
  console.error('package.json has "private": true. Remove it to publish.');
  process.exit(1);
}

if (!dryRun && !run("npm", ["whoami"], { allowFail: true })) {
  console.error("\nNot logged in. Run: npm login");
  process.exit(1);
}

run("npm", ["run", "check"]);

if (bump) {
  if (dryRun) {
    console.log(`\nDry run: skipping version bump (${bump}).`);
  } else {
    run("npm", ["version", bump, "--no-git-tag-version"]);
  }
}

const { name, version } = pkg();
console.log(`\nPublishing ${name}@${version}${dryRun ? " (dry run)" : ""}`);

const publishArgs = ["publish", "--access", "public"];
if (tag) publishArgs.push(tag);
if (otp) publishArgs.push(otp);
if (dryRun) publishArgs.push("--dry-run");
run("npm", publishArgs);

if (!dryRun) console.log(`\nDone: https://www.npmjs.com/package/${name}`);
