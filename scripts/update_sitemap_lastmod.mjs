/**
 * update_sitemap_lastmod.mjs
 * Stamps today's ISO date into every <lastmod> tag in the sitemap.
 * Run automatically before every build via netlify.toml.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sitemapPath = path.join(rootDir, "client", "public", "sitemap.xml");

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const original = await fs.readFile(sitemapPath, "utf8");
const updated = original.replace(/<lastmod>[^<]+<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

await fs.writeFile(sitemapPath, updated, "utf8");

console.log(`✅ sitemap.xml lastmod updated to ${today}`);
