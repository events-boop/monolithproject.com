import { useSyncExternalStore } from "react";
import type {
  PublicSiteData,
  ScheduledEvent,
  SiteExperienceSlot,
} from "@shared/events/types";

const EMPTY_SITE_DATA: PublicSiteData = {
  path: "",
  events: [],
  featuredEvents: {},
};

const listeners = new Set<() => void>();
const pendingRequests = new Map<string, Promise<PublicSiteData>>();
const pendingControllers = new Map<string, AbortController>();

let snapshot: PublicSiteData = EMPTY_SITE_DATA;
let version = 0;

declare global {
  interface Window {
    __MONOLITH_SITE_DATA__?: PublicSiteData;
  }
}

function notify() {
  version += 1;
  listeners.forEach((listener) => listener());
}

function normalizePathname(pathname?: string | null) {
  const raw = pathname || "/";
  const clean = raw.split("?")[0]?.split("#")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

function uniqueEvents(events: ScheduledEvent[]) {
  const seen = new Set<string>();
  return events.filter((event) => {
    if (seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  });
}

export function primePublicSiteData(data: PublicSiteData) {
  snapshot = {
    path: normalizePathname(data.path),
    events: uniqueEvents(data.events || []),
    featuredEvents: data.featuredEvents || {},
  };
  notify();
}

export function getPublicSiteData() {
  return snapshot;
}

export function getPublicEvents() {
  return uniqueEvents([
    ...snapshot.events,
    ...Object.values(snapshot.featuredEvents).filter(Boolean),
  ]);
}

export function getFeaturedEventForSlot(slot: SiteExperienceSlot) {
  return snapshot.featuredEvents[slot];
}

export function hasPublicSiteData(pathname?: string | null) {
  return snapshot.path === normalizePathname(pathname);
}

function abortStaleRequests(activePath: string) {
  pendingControllers.forEach((controller, path) => {
    if (path === activePath) return;
    controller.abort();
    pendingControllers.delete(path);
    pendingRequests.delete(path);
  });
}

export async function ensurePublicSiteData(pathname?: string | null) {
  const normalizedPath = normalizePathname(pathname);
  if (hasPublicSiteData(normalizedPath) && getPublicEvents().length > 0) {
    return snapshot;
  }

  const pending = pendingRequests.get(normalizedPath);
  if (pending) return pending;

  abortStaleRequests(normalizedPath);

  const controller = new AbortController();
  let request: Promise<PublicSiteData>;

  request = fetch(`/api/site-data?path=${encodeURIComponent(normalizedPath)}`, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load site data for ${normalizedPath}`);
      }

      const data = (await response.json()) as PublicSiteData;
      primePublicSiteData(data);
      return snapshot;
    })
    .finally(() => {
      if (pendingRequests.get(normalizedPath) === request) {
        pendingRequests.delete(normalizedPath);
      }
      if (pendingControllers.get(normalizedPath) === controller) {
        pendingControllers.delete(normalizedPath);
      }
    });

  pendingRequests.set(normalizedPath, request);
  pendingControllers.set(normalizedPath, controller);

  return request;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getVersionSnapshot() {
  return version;
}

export function usePublicSiteDataVersion() {
  return useSyncExternalStore(subscribe, getVersionSnapshot, getVersionSnapshot);
}

if (typeof window !== "undefined" && window.__MONOLITH_SITE_DATA__) {
  primePublicSiteData(window.__MONOLITH_SITE_DATA__);
}
