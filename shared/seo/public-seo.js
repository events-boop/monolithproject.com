export const SITE_ORIGIN = "https://monolithproject.com";

export const PUBLIC_SITEMAP_ENTRIES = [
  { path: "", priority: "1.0" },
  { path: "/tickets" },
  { path: "/chasing-sunsets" },
  { path: "/story" },
  { path: "/radio" },
  { path: "/chasing-sunsets-facts" },
  { path: "/radio/ep-01-benchek" },
  { path: "/radio/ep-02-ewerseen" },
  { path: "/radio/ep-03-terranova" },
  { path: "/radio/ep-04-radian" },
  { path: "/lineup" },
  { path: "/schedule" },
  { path: "/about" },
  { path: "/contact" },
  { path: "/faq" },
  { path: "/partners" },
  { path: "/booking" },
  { path: "/newsletter" },
  { path: "/terms" },
  { path: "/privacy" },
  { path: "/cookies" },
  { path: "/artists/haai" },
  { path: "/artists/lazare" },
  { path: "/artists/chus" },
  { path: "/artists/autograf" },
  { path: "/artists/deron" },
  { path: "/artists/juany-bravo" },
  { path: "/artists/sabry" },
  { path: "/artists/summers-uk" },
  { path: "/artists/chris-idh" },
  { path: "/artists/benchek" },
  { path: "/artists/terranova" },
  { path: "/artists/ewerseen" },
  { path: "/artists/radian" },
];

export function buildSitemapXml(entries = PUBLIC_SITEMAP_ENTRIES) {
  const body = entries
    .map((entry) => {
      const priority = entry.priority ?? "0.8";
      const changefreq = entry.changefreq ?? "weekly";

      return `  <url>
    <loc>${SITE_ORIGIN}${entry.path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
}
