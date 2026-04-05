import { Router } from "express";
import { buildRobotsTxt, buildSitemapXml } from "../../shared/seo/public-seo.js";

const router = Router();

router.get("/sitemap.xml", (_req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(buildSitemapXml());
});

router.get("/robots.txt", (_req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(buildRobotsTxt());
});

export default router;
