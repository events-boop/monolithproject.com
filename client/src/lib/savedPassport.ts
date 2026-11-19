import { useSyncExternalStore } from "react";

export const SAVED_EVENTS_KEY = "monolith-starred-rites";
export const SAVED_ARTISTS_KEY = "monolith-saved-artists-v1";
export const SAVED_EPISODES_KEY = "monolith-saved-episodes-v1";
const SAVED_PASSPORT_CHANGE_EVENT = "monolith:saved-passport-change";

export interface SavedPassportSnapshot {
  events: string[];
  artists: string[];
  episodes: string[];
  total: number;
}

const EMPTY_SNAPSHOT: SavedPassportSnapshot = {
  events: [],
  artists: [],
  episodes: [],
  total: 0,
};

let cachedKey = "";
let cachedSnapshot: SavedPassportSnapshot = EMPTY_SNAPSHOT;

function readStringArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(
      new Set(
        parsed.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
      )
    );
  } catch {
    return [];
  }
}

function writeStringArray(key: string, values: string[]) {
  if (typeof window === "undefined") return;
  try {
    const deduped = Array.from(new Set(values));
    window.localStorage.setItem(key, JSON.stringify(deduped));
    window.dispatchEvent(new CustomEvent(SAVED_PASSPORT_CHANGE_EVENT));
  } catch {
    /* Browsing remains fully functional when storage is restricted. */
  }
}

export function getSavedPassportSnapshot(): SavedPassportSnapshot {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT;

  const events = readStringArray(SAVED_EVENTS_KEY);
  const artists = readStringArray(SAVED_ARTISTS_KEY);
  const episodes = readStringArray(SAVED_EPISODES_KEY);
  const nextKey = `${events.join(",")}|${artists.join(",")}|${episodes.join(",")}`;

  if (nextKey === cachedKey) {
    return cachedSnapshot;
  }

  cachedKey = nextKey;
  cachedSnapshot = {
    events,
    artists,
    episodes,
    total: events.length + artists.length + episodes.length,
  };
  return cachedSnapshot;
}

function subscribeSavedPassport(listener: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (
      !event.key ||
      event.key === SAVED_EVENTS_KEY ||
      event.key === SAVED_ARTISTS_KEY ||
      event.key === SAVED_EPISODES_KEY
    ) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(SAVED_PASSPORT_CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SAVED_PASSPORT_CHANGE_EVENT, listener);
  };
}

export function useSavedPassport(): SavedPassportSnapshot {
  return useSyncExternalStore(
    subscribeSavedPassport,
    getSavedPassportSnapshot,
    () => EMPTY_SNAPSHOT
  );
}

function toggleListEntry(key: string, id: string): boolean {
  const current = readStringArray(key);
  const exists = current.includes(id);
  const next = exists ? current.filter(item => item !== id) : [...current, id];
  writeStringArray(key, next);
  return !exists;
}

export function toggleSavedEvent(eventId: string): boolean {
  return toggleListEntry(SAVED_EVENTS_KEY, eventId);
}

export function toggleSavedArtist(artistId: string): boolean {
  return toggleListEntry(SAVED_ARTISTS_KEY, artistId);
}

export function toggleSavedEpisode(episodeSlug: string): boolean {
  return toggleListEntry(SAVED_EPISODES_KEY, episodeSlug);
}

export function clearSavedPassport() {
  writeStringArray(SAVED_EVENTS_KEY, []);
  writeStringArray(SAVED_ARTISTS_KEY, []);
  writeStringArray(SAVED_EPISODES_KEY, []);
}
