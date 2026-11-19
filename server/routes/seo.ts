import { Router } from "express";
import {
  buildEventSitemapEntries,
  mergeSitemapEntries,
  buildRobotsTxt,
  buildSitemapXml,
} from "../../shared/seo/public-seo.js";
import { upcomingEvents } from "../data/public-site-data";
import { PUBLIC_HISTORY_SITEMAP_ENTRIES } from "../../shared/seo/history";

const router = Router();

function buildDynamicSitemapEntries() {
  return mergeSitemapEntries([
    ...buildEventSitemapEntries(upcomingEvents),
    ...PUBLIC_HISTORY_SITEMAP_ENTRIES,
  ]);
}

router.get("/sitemap.xml", (_req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(buildSitemapXml(buildDynamicSitemapEntries()));
});

router.get("/robots.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(buildRobotsTxt());
});

export default router;
