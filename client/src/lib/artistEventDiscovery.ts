import { ARTIST_ENTRIES, type ArtistData } from "@/data/artists";
import { HOME_ARTIST_DISCOVERY } from "@/data/homeArtistDiscovery";
import type { ScheduledEvent } from "@shared/events/types";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Match a named lineup/booking, never infer an appearance from series membership. */
export function eventIncludesArtist(event: ScheduledEvent, artist: ArtistData) {
  if (
    artist.events?.some(
      appearance =>
        appearance.id === event.id ||
        appearance.eventUrl === `/events/${event.slug || event.id}`
    )
  )
    return true;
  const names = ` ${normalize([event.headline, event.title, event.lineup].filter(Boolean).join(" "))} `;
  return names.includes(
    ` ${normalize(artist.name.replace(/\s*\([A-Z]{2}\)\s*$/, ""))} `
  );
}

export function getEventArtists(event: ScheduledEvent) {
  return ARTIST_ENTRIES.filter(artist => eventIncludesArtist(event, artist));
}

/** Existing published recording destinations only. No eager third-party player. */
export function getArtistRecording(artist: ArtistData) {
  if (artist.featuredVideo)
    return { href: artist.featuredVideo.url, label: "Watch a recorded set" };
  const curated = HOME_ARTIST_DISCOVERY.find(
    entry => entry.artist.id === artist.id
  );
  if (curated)
    return { href: curated.listen.href, label: curated.listen.action };
  const previous = artist.previousSets?.find(set => set.url);
  if (previous?.url)
    return { href: previous.url, label: "Explore the artist’s set links" };
  if (artist.socials.soundcloud)
    return { href: artist.socials.soundcloud, label: "Listen on SoundCloud" };
  return null;
}
