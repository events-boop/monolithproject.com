import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildRobotsTxt, buildSitemapXml } from "../shared/seo/public-seo.js";

const sitemapPath = resolve("client/public/sitemap.xml");
const robotsPath = resolve("client/public/robots.txt");

mkdirSync(dirname(sitemapPath), { recursive: true });

writeFileSync(sitemapPath, buildSitemapXml(), "utf8");
writeFileSync(robotsPath, buildRobotsTxt(), "utf8");
