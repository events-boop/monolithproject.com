/**
 * Route-level code splitting without the first-load loader flash.
 *
 * Inner pages ship prerendered HTML that paints immediately. With plain
 * React.lazy(), mounting the app replaced that HTML with the "Loading Next
 * Scene" fallback until the page chunk arrived, delaying the real content.
 *
 * main.tsx calls preloadRouteChunk() for the landing path and waits for it
 * (alongside the App bundle) before rendering, so the prerendered HTML stays
 * on screen. lazyRoute() then renders the already-loaded module directly;
 * later client-side navigations still fall back to React.lazy + Suspense.
 */
import { lazy, type ComponentType } from "react";

const PAGE_LOADERS = {
  Tickets: () => import("../pages/Tickets"),
  About: () => import("../pages/About"),
  ArtistProfile: () => import("../pages/ArtistProfile"),
  SunsetsFM: () => import("../pages/SunsetsFM"),
  Radio: () => import("../pages/Radio"),
  RadioEpisode: () => import("../pages/RadioEpisode"),
  UntoldStory: () => import("../pages/UntoldStory"),
  UntoldVipLanding: () => import("../pages/UntoldVipLanding"),
  ChasingSunsets: () => import("../pages/ChasingSunsets"),
  Booking: () => import("../pages/Booking"),
  Partners: () => import("../pages/Partners"),
  Lineup: () => import("../pages/Lineup"),
  Schedule: () => import("../pages/Schedule"),
  EventDetails: () => import("../pages/EventDetails"),
  Newsletter: () => import("../pages/Newsletter"),
  Contact: () => import("../pages/Contact"),
  FAQ: () => import("../pages/FAQ"),
  Press: () => import("../pages/Press"),
  Archive: () => import("../pages/Archive"),
  ArchiveGalleryPage: () => import("../pages/ArchiveGalleryPage"),
  Submit: () => import("../pages/Submit"),
  Insights: () => import("../pages/Insights"),
  InsightArticle: () => import("../pages/InsightArticle"),
  VIP: () => import("../pages/VIP"),
  Shop: () => import("../pages/Shop"),
  Monolith: () => import("../pages/Monolith"),
  HouseOfFriends: () => import("../pages/HouseOfFriends"),
} satisfies Record<string, () => Promise<{ default: ComponentType<any> }>>;

type PageKey = keyof typeof PAGE_LOADERS;

const EXACT_ROUTES: Record<string, PageKey> = {
  "/tickets": "Tickets",
  "/about": "About",
  "/sunsets-fm": "SunsetsFM",
  "/radio": "Radio",
  "/booking": "Booking",
  "/partners": "Partners",
  "/archive": "Archive",
  "/lineup": "Lineup",
  "/artists": "Lineup",
  "/schedule": "Schedule",
  "/events": "Schedule",
  "/insights": "Insights",
  "/chasing-sunsets": "ChasingSunsets",
  "/story": "UntoldStory",
  "/untold-story": "UntoldStory",
  "/untold": "UntoldVipLanding",
  "/newsletter": "Newsletter",
  "/contact": "Contact",
  "/faq": "FAQ",
  "/press": "Press",
  "/submit": "Submit",
  "/vip": "VIP",
  "/shop": "Shop",
  "/monolith": "Monolith",
  "/house-of-friends": "HouseOfFriends",
};

const PREFIX_ROUTES: Array<[string, PageKey]> = [
  ["/artists/", "ArtistProfile"],
  ["/radio/", "RadioEpisode"],
  ["/events/", "EventDetails"],
  ["/insights/", "InsightArticle"],
  ["/archive/", "ArchiveGalleryPage"],
];

const loadedPages = new Map<PageKey, ComponentType<any>>();

function loadPage(key: PageKey) {
  return PAGE_LOADERS[key]().then(module => {
    loadedPages.set(key, module.default);
    return module;
  });
}

/** Resolves once the landing route's page chunk is loaded (never rejects). */
export function preloadRouteChunk(pathname: string): Promise<void> {
  const path =
    pathname.length > 1 ? pathname.replace(/\/+$/, "").toLowerCase() : "/";
  const key =
    EXACT_ROUTES[path] ??
    PREFIX_ROUTES.find(([prefix]) => path.startsWith(prefix))?.[1];
  if (!key) return Promise.resolve();
  // A failed preload is harmless: the lazy() path retries on render.
  return loadPage(key).then(
    () => undefined,
    () => undefined
  );
}

export function lazyRoute<P extends object>(key: PageKey): ComponentType<P> {
  const LazyPage = lazy(() => loadPage(key)) as unknown as ComponentType<P>;
  function RoutePage(props: P) {
    const Page = loadedPages.get(key) as ComponentType<P> | undefined;
    return Page ? <Page {...props} /> : <LazyPage {...props} />;
  }
  RoutePage.displayName = `Route(${key})`;
  return RoutePage;
}
