#!/usr/bin/env node
// Build the website for one environment.
//
//   node scripts/build.mjs --env development --out _site
//   node scripts/build.mjs --env production  --out _site --root path/to/checkout
//
// What it does:
//   1. Copies site/ (the files visitors get) into the output folder.
//   2. Stamps the version, commit and environment into index.html.
//   3. Adds environment-specific extras:
//        development -> "noindex" so Google ignores it, plus a DEV ribbon
//        production  -> robots.txt that hides /dev/ from search engines
//   4. Writes build-info.json so you can check what is live at /build-info.json
//
// No npm packages needed: plain Node.js, so it runs the same on your laptop and in GitHub Actions.

import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, resolve } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, a, i, all) => {
    if (a.startsWith("--")) pairs.push([a.slice(2), all[i + 1]]);
    return pairs;
  }, [])
);

const ENVS = ["development", "production"];
const env = args.env;
if (!ENVS.includes(env)) {
  console.error(`--env must be one of: ${ENVS.join(", ")}`);
  process.exit(1);
}
const root = resolve(args.root || ".");
const src = join(root, "site");
const out = resolve(args.out || "_site");

const version = readFileSync(join(root, "VERSION"), "utf8").trim();
let commit = (process.env.GITHUB_SHA || "").slice(0, 7);
if (!commit) {
  try { commit = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim(); }
  catch { commit = "local"; }
}
const buildId = `${version}-${commit}`;
const builtAt = new Date().toISOString();

// 1. Fresh copy of site/
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(src, out, { recursive: true });

// 2 + 3. Stamp index.html
const head = {
  development: `<meta name="robots" content="noindex, nofollow">`,
  production: process.env.SITE_URL ? `<link rel="canonical" href="${process.env.SITE_URL.replace(/\/?$/, "/")}">` : "",
}[env];

const ribbon = env === "development"
  ? `<div style="position:fixed;left:12px;top:calc(76px + env(safe-area-inset-top,0px));z-index:40;background:#d9480f;color:#fff;font:600 12px/1 system-ui,sans-serif;padding:7px 10px;border-radius:99px;box-shadow:0 6px 16px -8px #0008;pointer-events:none">DEV v${version} (${commit})</div>`
  : "";

const indexPath = join(out, "index.html");
let html = readFileSync(indexPath, "utf8")
  .replaceAll("__VERSION__", version)
  .replaceAll("__BUILD_ID__", buildId)
  .replace("<!-- build:head -->", head)
  .replace("<!-- build:body -->", ribbon);
writeFileSync(indexPath, html);

if (env === "production") {
  writeFileSync(join(out, "robots.txt"), "User-agent: *\nDisallow: /dev/\n");
}

// 4. What is deployed, readable at /build-info.json
writeFileSync(join(out, "build-info.json"), JSON.stringify({ version, env, commit, builtAt }, null, 2) + "\n");

console.log(`Built ${env} v${version} (${commit}) -> ${out}`);
