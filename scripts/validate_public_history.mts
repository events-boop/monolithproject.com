import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ARTIST_ENTRIES } from "../client/src/data/artists.ts";
import { radioEpisodes } from "../client/src/data/radioEpisodes.ts";
import { insightEntries } from "../client/src/data/insights.ts";
import { upcomingEvents } from "../server/data/public-site-data.ts";
import { publicGalleryRoutes } from "../shared/seo/history.ts";
import { MONOLITH_LAUNCH_NOTICE } from "../shared/events/historical-notices.ts";
import {
  SUNSETS_CANONICALS_LIVE,
  SUNSETS_EPISODE_URLS,
} from "../shared/seo/sunsets-radio.ts";

const origin = "https://monolithproject.com";
const root = path.resolve("dist/public");
const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");
const errors: string[] = [];
const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
let count = 0;

function verify(
  route: string,
  marker: string,
  canonical = origin + route,
  indexed = true
) {
  count++;
  const file = path.join(root, route, "index.html");
  if (!existsSync(file)) {
    errors.push(`${route}: missing static HTML`);
    return "";
  }
  const html = readFileSync(file, "utf8");
  if (!html.includes(escape(marker)))
    errors.push(`${route}: missing entity content`);
  if (!html.includes(`<link rel="canonical" href="${canonical}"`))
    errors.push(`${route}: canonical differs`);
  if (indexed && !sitemap.includes(`${origin}${route}</loc>`))
    errors.push(`${route}: missing sitemap entry`);
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html))
    errors.push(`${route}: history must remain indexable`);
  for (const match of html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )) {
    try {
      JSON.parse(match[1]);
    } catch {
      errors.push(`${route}: invalid JSON-LD`);
    }
  }
  return html;
}

for (const artist of ARTIST_ENTRIES)
  verify(`/artists/${artist.id}`, artist.name);
for (const episode of radioEpisodes) {
  const route = `/radio/${episode.slug}`;
  verify(
    route,
    episode.summary,
    (SUNSETS_CANONICALS_LIVE && SUNSETS_EPISODE_URLS[episode.slug]) ||
      origin + route
  );
}
for (const entry of insightEntries)
  verify(`/insights/${entry.slug}`, entry.title);
for (const { path: route, gallery } of publicGalleryRoutes)
  verify(route, gallery.description);
for (const event of upcomingEvents.filter(
  event => !["draft", "hidden"].includes(event.status)
)) {
  const route = `/events/${event.slug || event.id}`;
  const html = verify(route, event.headline || event.title);
  if (event.slug && event.slug !== event.id)
    verify(
      `/events/${event.id}`,
      event.headline || event.title,
      origin + route,
      false
    );
  if (
    event.eventStatus === "EventPostponed" &&
    !html.includes("POSTPONED — NEW DATE TO BE CONFIRMED")
  )
    errors.push(`${route}: missing postponement notice`);
  if (event.status === "past" && !html.includes("Past event"))
    errors.push(`${route}: missing historical state`);
  if (
    (event.status === "past" ||
      event.eventStatus === "EventPostponed" ||
      event.eventStatus === "EventCancelled") &&
    /"offers"\s*:/.test(html)
  )
    errors.push(`${route}: historical or paused event exposes ticket offers`);
}
const launch = verify(
  MONOLITH_LAUNCH_NOTICE.path,
  MONOLITH_LAUNCH_NOTICE.description
);
if (
  !launch.includes(MONOLITH_LAUNCH_NOTICE.status) ||
  /"@type"\s*:\s*"MusicEvent"/.test(launch)
)
  errors.push(
    `${MONOLITH_LAUNCH_NOTICE.path}: never-held notice misrepresents a performance`
  );

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `[validate:history] ${count} historical routes retain static content, canonicals, sitemap coverage, and truthful event states.`
  );
}
