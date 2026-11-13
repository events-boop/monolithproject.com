import { ARTIST_ENTRIES } from "../../client/src/data/artists";
import { radioEpisodes } from "../../client/src/data/radioEpisodes";
import { insightEntries } from "../../client/src/data/insights";
import { archiveCollectionsBySlug } from "../../client/src/data/galleryData";
import { MONOLITH_LAUNCH_NOTICE } from "../events/historical-notices";

/** Canonical historical entities are discovered from their public registries. */
export const publicGalleryRoutes = Object.values(
  archiveCollectionsBySlug
).flatMap(gallery => {
  const routes = [{ path: `/archive/${gallery.slug}`, gallery }];
  const season = gallery.slug.match(/^(chasing-sunsets|untold-story)-(.+)$/);
  if (season) routes.push({ path: `/${season[1]}/${season[2]}`, gallery });
  return routes;
});

export const PUBLIC_HISTORY_SITEMAP_ENTRIES = [
  ...ARTIST_ENTRIES.map(artist => ({ path: `/artists/${artist.id}` })),
  ...radioEpisodes.map(episode => ({ path: `/radio/${episode.slug}` })),
  ...insightEntries.map(entry => ({ path: `/insights/${entry.slug}` })),
  ...publicGalleryRoutes.map(({ path }) => ({ path })),
  { path: MONOLITH_LAUNCH_NOTICE.path },
].map(entry => ({ ...entry, priority: "0.6", changefreq: "monthly" }));
