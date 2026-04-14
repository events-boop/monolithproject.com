import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  buildEventSitemapEntries,
  buildRobotsTxt,
  buildSitemapXml,
  mergeSitemapEntries,
} from "../shared/seo/public-seo.js";
import { upcomingEvents } from "../server/data/public-site-data.ts";

const sitemapPath = resolve("client/public/sitemap.xml");
const robotsPath = resolve("client/public/robots.txt");

mkdirSync(dirname(sitemapPath), { recursive: true });

const sitemapEntries = mergeSitemapEntries(buildEventSitemapEntries(upcomingEvents));

writeFileSync(sitemapPath, buildSitemapXml(sitemapEntries), "utf8");
writeFileSync(robotsPath, buildRobotsTxt(), "utf8");
