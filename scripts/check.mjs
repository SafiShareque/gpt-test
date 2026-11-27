#!/usr/bin/env node
// Quality checks that run on every pull request (the "CI" part of CI/CD).
//
//   node scripts/check.mjs
//
// Fails (exit code 1) on problems that would break the live site:
//   - VERSION is not a valid version number like 1.2.3
//   - a file referenced by the page (image, CSS, JS) does not exist
//   - a product photo listed in site.js is missing
//   - an image is too heavy for phones, or has a double extension like .jpg.png
//   - a phone link is not in +91 format
//   - the JavaScript has a syntax error
// Warns (does not fail) about placeholders still waiting for real values.
//
// Messages use GitHub's "::error" / "::warning" format so they show up
// directly on the pull request.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const SITE = "site";
const MAX_IMAGE_KB = 400;
let errors = 0, warnings = 0;
const error = (file, msg) => { errors++; console.log(`::error file=${file}::${msg}`); };
const warn = (file, msg) => { warnings++; console.log(`::warning file=${file}::${msg}`); };
const ok = (msg) => console.log(`ok  ${msg}`);

// VERSION
const version = readFileSync("VERSION", "utf8").trim();
if (/^\d+\.\d+\.\d+$/.test(version)) ok(`VERSION ${version}`);
else error("VERSION", `"${version}" is not a version like 1.2.3`);

// Files referenced by the page
const html = readFileSync(join(SITE, "index.html"), "utf8");
const css = readFileSync(join(SITE, "assets/css/site.css"), "utf8");
const js = readFileSync(join(SITE, "assets/js/site.js"), "utf8");
const local = (u) => u && !/^(https?:|tel:|mailto:|data:|#|\/\/)/.test(u);
const refs = [
  ...[...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map((m) => ["site/index.html", m[1]]),
  ...[...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => ["site/assets/css/site.css", m[1]]),
];
let checked = 0;
for (const [file, ref] of refs) {
  if (!local(ref)) continue;
  const path = join(SITE, ref.split(/[?#]/)[0]);
  checked++;
  if (!existsSync(path)) error(file, `references ${ref} but ${path} does not exist`);
}
ok(`${checked} local file references`);

// Product photos named in site.js
const productImages = [...js.matchAll(/img:"([^"]+)"/g)].map((m) => m[1]);
for (const name of productImages) {
  const path = join(SITE, "images", `${name}.jpg`);
  if (!existsSync(path)) error("site/assets/js/site.js", `product photo ${path} is missing`);
}
ok(`${productImages.length} product photos`);

// Images: format, name and weight
for (const name of readdirSync(join(SITE, "images"))) {
  const path = join(SITE, "images", name);
  const kb = Math.round(statSync(path).size / 1024);
  if (/\.(jpe?g|png|webp|svg|gif)\.(jpe?g|png|webp)$/i.test(name)) error(path, `double extension in "${name}", rename it to one extension`);
  else if (!/\.(jpe?g|png|webp|svg|avif)$/i.test(name)) warn(path, `"${name}" is not a web image format`);
  if (kb > MAX_IMAGE_KB) error(path, `${kb} KB is over the ${MAX_IMAGE_KB} KB budget, resize or compress it`);
}
ok("image names and sizes");

// Phone links
for (const m of html.matchAll(/href="tel:([^"]+)"/g)) {
  if (!/^\+91\d{10}$/.test(m[1])) error("site/index.html", `phone link tel:${m[1]} should look like tel:+919518935481`);
}
ok("phone links");

// JavaScript syntax
try { execFileSync(process.execPath, ["--check", join(SITE, "assets/js/site.js")], { stdio: "pipe" }); ok("JavaScript syntax"); }
catch (e) { error("site/assets/js/site.js", e.stderr.toString().split("\n").slice(0, 4).join(" ")); }

// Placeholders still to fill in (warning only)
const placeholders = { "wa.me/91XXXXXXXXXX": "WhatsApp link", "YOUR_HANDLE": "Instagram link" };
for (const [needle, label] of Object.entries(placeholders)) {
  const n = html.split(needle).length - 1;
  if (n) warn("site/index.html", `${label} is still a placeholder (${n} place${n > 1 ? "s" : ""})`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
