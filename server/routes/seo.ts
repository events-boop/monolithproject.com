import { Router } from "express";

const router = Router();

router.get("/sitemap.xml", (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  const domain = "https://monolithproject.com";
  const routes = [
    "",
    "/tickets",
    "/about",
    "/togetherness",
    "/chasing-sunsets",
    "/radio",
    "/story",
    "/booking",
    "/lineup",
    "/schedule",
    "/newsletter",
    "/contact",
    "/faq",
    "/partners",
    "/vip"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${domain}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
  </url>`).join("\\n")}
</urlset>`;

  res.send(sitemap);
});

router.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(`User-agent: *
Allow: /

Sitemap: https://monolithproject.com/sitemap.xml
`);
});

export default router;
