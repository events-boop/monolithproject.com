export const SITE_ORIGIN = "https://monolithproject.com";

export const BASE_PUBLIC_SITEMAP_ENTRIES = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "/tickets", priority: "0.9", changefreq: "daily" },
  { path: "/schedule", priority: "0.9", changefreq: "daily" },
  { path: "/chasing-sunsets", priority: "0.8", changefreq: "daily" },
  { path: "/sunsets", priority: "0.85", changefreq: "daily" },
  { path: "/sunsets-fm", priority: "0.8", changefreq: "weekly" },
  { path: "/untold-story", priority: "0.8", changefreq: "daily" },
  { path: "/radio", priority: "0.8", changefreq: "daily" },
  { path: "/open-network", priority: "0.7", changefreq: "weekly" },
  { path: "/chasing-sunsets-facts", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-01-benchek", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-02-ewerseen", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-03-terranova", priority: "0.8", changefreq: "weekly" },
  { path: "/radio/ep-04-radian", priority: "0.8", changefreq: "weekly" },
  {
    path: "/radio/ep-004-benchek-part-2",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    path: "/radio/ch-02-radian-no-sleep",
    priority: "0.8",
    changefreq: "weekly",
  },
  { path: "/lineup", priority: "0.8", changefreq: "weekly" },
  { path: "/about", priority: "0.7", changefreq: "weekly" },
  { path: "/monolith", priority: "0.85", changefreq: "weekly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/faq", priority: "0.7", changefreq: "weekly" },
  { path: "/partners", priority: "0.6", changefreq: "monthly" },
  { path: "/booking", priority: "0.6", changefreq: "monthly" },
  { path: "/newsletter", priority: "0.7", changefreq: "weekly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/cookies", priority: "0.3", changefreq: "yearly" },
  // Artist profiles — keep in sync with the live roster in
  // client/src/data/artists.ts (ARTIST_ENTRIES). Every roster id renders a
  // /artists/:id page; ids not in the roster render "Profile Not Found".
  { path: "/artists/kiko-franco", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/ape-drums", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/lazare", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/deron", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/juany-bravo", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/autograf", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/sommers-uk", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/chris-idh", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/summermel", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/joezi", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/benchek", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/terranova", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/ewerseen", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/radian", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/avo", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/eran-hersh", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/massuma", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/amari", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/sarat", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/jerome", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/rose", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/hashtom", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/kenbo-slice", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/jealah", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/maximo", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/eliana", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/gianniblu", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/frankbono", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/erikthedj", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/colin", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/nomar", priority: "0.8", changefreq: "weekly" },
  { path: "/artists/gene-farris", priority: "0.8", changefreq: "weekly" },
  { path: "/archive", priority: "0.7", changefreq: "weekly" },
  {
    path: "/archive/autograf-march-21-2026",
    priority: "0.7",
    changefreq: "monthly",
  },
  { path: "/press", priority: "0.6", changefreq: "monthly" },
  { path: "/insights", priority: "0.6", changefreq: "weekly" },
  { path: "/submit", priority: "0.6", changefreq: "monthly" },
];

function normalizeSitemapPath(path = "") {
  if (!path || path === "/") return "";
  if (!path.startsWith("/")) return `/${path}`;
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

export function buildEventSitemapEntries(events = []) {
  return events
    .filter(
      event =>
        event &&
        !["draft", "hidden"].includes(event.status) &&
        (event.slug || event.id)
    )
    .map(event => ({
      path: `/events/${event.slug || event.id}`,
      priority: event.status === "on-sale" ? "0.9" : "0.7",
      changefreq: event.status === "on-sale" ? "daily" : "weekly",
    }));
}

export function mergeSitemapEntries(entries = []) {
  const merged = [...BASE_PUBLIC_SITEMAP_ENTRIES, ...entries];
  const seen = new Set();

  return merged.filter(entry => {
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
    .map(entry => {
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
