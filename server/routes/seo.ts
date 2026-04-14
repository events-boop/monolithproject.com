import { Router } from "express";
import { PUBLIC_SITEMAP_ENTRIES, buildRobotsTxt, buildSitemapXml } from "../../shared/seo/public-seo.js";
import { upcomingEvents } from "../data/public-site-data";

const router = Router();

function buildDynamicSitemapEntries() {
  const seen = new Set<string>();
  const eventEntries = upcomingEvents
    .filter((event) => event.status !== "past" && (event.slug || event.id))
    .map((event) => ({
      path: `/events/${event.slug || event.id}`,
      priority: event.status === "on-sale" ? "0.9" : "0.7",
      changefreq: event.status === "on-sale" ? "daily" : "weekly",
    }));

  return [...PUBLIC_SITEMAP_ENTRIES, ...eventEntries].filter((entry) => {
    const path = entry.path || "";
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
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
