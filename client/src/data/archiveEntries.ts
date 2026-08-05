import {
  archiveCollectionsBySlug,
  type ArchiveCollection,
} from "@/data/galleryData";

export type ArchiveEntry = ArchiveCollection & { href: string };

// The single ordered record of public archive galleries, newest first.
// Both the /archive page and the navigation drawer read from this list —
// add each new collection here once, then let each surface apply its own
// filter below. Ordering rule: newer events always prepend.
const ARCHIVE_ENTRIES: ArchiveEntry[] = [
  {
    ...archiveCollectionsBySlug["ape-drums-july31-2026"],
    href: "/archive/ape-drums-july31-2026",
  },
  {
    ...archiveCollectionsBySlug["chasing-sunsets-sunsets-i-2026"],
    href: "/chasing-sunsets/sunsets-i-2026",
  },
  {
    ...archiveCollectionsBySlug["autograf-march-21-2026"],
    href: "/archive/autograf-march-21-2026",
  },
  {
    ...archiveCollectionsBySlug["untold-story-season-iii"],
    href: "/untold-story/season-iii",
  },
  {
    ...archiveCollectionsBySlug["chasing-sunsets-season-iii"],
    href: "/chasing-sunsets/season-iii",
  },
  {
    ...archiveCollectionsBySlug["untold-story-season-ii"],
    href: "/untold-story/season-ii",
  },
  {
    ...archiveCollectionsBySlug["chasing-sunsets-season-ii"],
    href: "/chasing-sunsets/season-ii",
  },
  {
    ...archiveCollectionsBySlug["untold-story-season-i"],
    href: "/untold-story/season-i",
  },
  {
    ...archiveCollectionsBySlug["chasing-sunsets-season-i"],
    href: "/chasing-sunsets/season-i",
  },
];

// Full history, including announced collections still in the edit.
export const archiveEntries = ARCHIVE_ENTRIES.filter(
  entry => entry.media.length > 0 || entry.comingSoon
);

// Published galleries only — for surfaces that shouldn't tease an empty room.
export const publishedArchiveEntries = ARCHIVE_ENTRIES.filter(
  entry => entry.media.length > 0
);
