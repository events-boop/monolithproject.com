// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildEventSitemapEntries } from "../seo/public-seo.js";
import {
  PUBLIC_HISTORY_SITEMAP_ENTRIES,
  publicGalleryRoutes,
} from "../seo/history";
import {
  MONOLITH_LAUNCH_NOTICE,
  buildLaunchNoticeSchema,
} from "../events/historical-notices";
import {
  upcomingEvents,
  buildPublicSiteData,
} from "../../server/data/public-site-data";
import { ARTIST_ENTRIES } from "../../client/src/data/artists";
import { radioEpisodes } from "../../client/src/data/radioEpisodes";
import { archiveCollectionsBySlug } from "../../client/src/data/galleryData";
import { getPublishedEventState } from "../events/publishedState";

describe("permanent public history", () => {
  it("prevents a stale database row from republishing the never-held launch as a show", () => {
    const stale = {
      ...upcomingEvents[0],
      id: "css-oct10",
      slug: "monolith-launch",
      status: "on-sale" as const,
      ticketUrl: "https://example.com/stale-checkout",
    };
    expect(buildPublicSiteData("/events/css-oct10", [stale]).events).toEqual(
      []
    );
  });
  it("keeps past and postponed dossiers in the sitemap while excluding unpublished records", () => {
    const records = [
      { id: "old-night", slug: "permanent-night", status: "past" },
      { id: "postponed", status: "coming-soon" },
      { id: "draft-night", status: "draft" },
      { id: "private-night", status: "hidden" },
    ];
    expect(buildEventSitemapEntries(records).map(entry => entry.path)).toEqual([
      "/events/permanent-night",
      "/events/postponed",
    ]);
  });

  it("discovers every roster and radio entry without a manually maintained list", () => {
    const paths = new Set(
      PUBLIC_HISTORY_SITEMAP_ENTRIES.map(entry => entry.path)
    );
    for (const artist of ARTIST_ENTRIES)
      expect(paths.has(`/artists/${artist.id}`)).toBe(true);
    for (const episode of radioEpisodes)
      expect(paths.has(`/radio/${episode.slug}`)).toBe(true);
  });

  it("keeps each archive and the existing series-season addresses", () => {
    const paths = new Set(publicGalleryRoutes.map(entry => entry.path));
    for (const gallery of Object.values(archiveCollectionsBySlug))
      expect(paths.has(`/archive/${gallery.slug}`)).toBe(true);
    for (const series of ["chasing-sunsets", "untold-story"]) {
      for (const season of ["i", "ii", "iii"])
        expect(paths.has(`/${series}/season-${season}`)).toBe(true);
    }
  });

  it("preserves the never-held launch as an indexed notice rather than a scheduled or performed event", () => {
    expect(
      PUBLIC_HISTORY_SITEMAP_ENTRIES.some(
        entry => entry.path === MONOLITH_LAUNCH_NOTICE.path
      )
    ).toBe(true);
    expect(buildLaunchNoticeSchema()["@type"]).toBe("WebPage");
    expect(buildLaunchNoticeSchema()).not.toHaveProperty("offers");
    expect(
      upcomingEvents.some(event =>
        ["css-oct10", "monolith-launch"].includes(event.id)
      )
    ).toBe(false);
  });

  it("keeps September 19 postponed with no checkout despite the old date", () => {
    const event = upcomingEvents.find(event => event.id === "css-sep19");
    expect(event?.eventStatus).toBe("EventPostponed");
    expect(event?.ticketUrl).toBeUndefined();
    expect(
      getPublishedEventState(event, new Date("2026-11-11T12:00:00Z")).kind
    ).toBe("postponed");
    expect(event?.description).not.toMatch(/tickets are live/i);
  });
});
