export const SITE_ORIGIN = "https://monolithproject.com";

export const BASE_PUBLIC_SITEMAP_ENTRIES = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "/tickets", priority: "0.9", changefreq: "daily" },
  { path: "/schedule", priority: "0.9", changefreq: "daily" },
  { path: "/chasing-sunsets", priority: "0.8", changefreq: "daily" },
  { path: "/story", priority: "0.8", changefreq: "daily" },
  { path: "/radio", priority: "0.8", changefreq: "daily" },
  { path: "/chasing-sunsets-facts", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-01-benchek", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-02-ewerseen", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-03-terranova", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-04-radian", priority: "0.8", changefreq: "weekly" },
  { path: "/lineup", priority: "0.8", changefreq: "weekly" },
  { path: "/about", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/faq", priority: "0.7", changefreq: "weekly" },
  { path: "/partners", priority: "0.6", changefreq: "monthly" },
  { path: "/booking", priority: "0.6", changefreq: "monthly" },
  { path: "/newsletter", priority: "0.7", changefreq: "weekly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" },
  { path: "/artists/haai", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/lazare", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/chus", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/autograf", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/deron", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/juany-bravo", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/sabry", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/summers-uk", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/chris-idh", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/benchek", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/terranova", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/ewerseen", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/radian", priority: "0.8", changefreq: "weekly" },
];

function normalizeSitemapPath(path = "") {
  if (!path || path === "/") return "";
  if (!path.startsWith("/")) return `/${path}`;
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function buildEventSitemapEntries(events = []) {
  return events
    .filter((event) => event && event.status !== "past" && (event.slug || event.id))
    .map((event) => ({
      path: `/events/${event.slug || event.id}`,
      priority: event.status === "on-sale" ? "0.9" : "0.7",
      changefreq: event.status === "on-sale" ? "daily" : "weekly",
    }));
}

export function mergeSitemapEntries(entries = []) {
  const merged = [...BASE_PUBLIC_SITEMAP_ENTRIES, ...entries];
  const seen = new Set();

  return merged.filter((entry) => {
    const normalizedPath = normalizeSitemapPath(entry.path);
    if (seen.has(normalizedPath)) return false;
    seen.add(normalizedPath);
    entry.path = normalizedPath;
    return true;
  });
}

export const PUBLIC_SITEMAP_ENTRIES = mergeSitemapEntries();

export function buildSitemapXml(entries = PUBLIC_SITEMAP_ENTRIES) {
  const body = entries
    .map((entry) => {
      const priority = entry.priority ?? "0.8";
      const changefreq = entry.changefreq ?? "weekly";

      return `  <url>
    <loc>${SITE_ORIGIN}${entry.path}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
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
