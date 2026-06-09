/**
 * CANONICAL ROUTES — single source of truth for all application route paths.
 *
 * Every component, page, and link must reference these constants instead of
 * hardcoding path strings. If a route changes, you update it here once and
 * every consumer follows automatically.
 *
 * Dynamic paths are exposed as functions so callers can construct them with
 * real parameter values; static paths are plain strings.
 */

/* ------------------------------------------------------------------ */
/*  Static Routes                                                      */
/* ------------------------------------------------------------------ */

export const ROUTES = {
  home: "/",
  tickets: "/tickets",
  about: "/about",
  lineup: "/lineup",
  schedule: "/schedule",
  events: "/events",
  archive: "/archive",
  insights: "/insights",
  radio: "/radio",
  sunsets: "/sunsets",
  lake: "/lake",
  chasingSunsets: "/chasing-sunsets",
  chasingSunsetsFacts: "/chasing-sunsets-facts",
  story: "/story",
  untoldStory: "/untold-story",
  untoldStoryDeronJuanyBravo: "/untold-story-deron-juany-bravo",
  newsletter: "/newsletter",
  contact: "/contact",
  faq: "/faq",
  partners: "/partners",
  press: "/press",
  booking: "/booking",
  submit: "/submit",
  sponsors: "/sponsors",
  vip: "/vip",
  travel: "/travel",
  guide: "/guide",
  shop: "/shop",
  ambassadors: "/ambassadors",
  alerts: "/alerts",
  terms: "/terms",
  privacy: "/privacy",
  cookies: "/cookies",
  monolith: "/monolith",
  notFound: "/404",

  // Redirect aliases (resolved to canonical routes by the router)
  togetherness: "/togetherness", // → /about#togetherness
  innerCircle: "/inner-circle", // → /newsletter
  theMonolith: "/the-monolith", // → /monolith
  collective: "/collective", // → /monolith

  // Dev-only routes (gated behind VITE_ENABLE_MONOLITH_OPS)
  monolithOps: "/monolith-ops",
  sandboxHero: "/sandbox/hero",
} as const;

/* ------------------------------------------------------------------ */
/*  Anchor Hashes                                                      */
/* ------------------------------------------------------------------ */

export const ANCHORS = {
  togetherness: "#togetherness",
  entry: "#entry",
  vision: "#vision",
  story: "#story",
  manifesto: "#manifesto",
  expect: "#expect",
  dresscode: "#dresscode",
  tables: "#tables",
  lakeList: "#lake-list",
} as const;

/* ------------------------------------------------------------------ */
/*  Dynamic Route Builders                                             */
/* ------------------------------------------------------------------ */

export function routeArtist(id: string) {
  return `/artists/${id}` as const;
}

export function routeRadioEpisode(slug: string) {
  return `/radio/${slug}` as const;
}

export function routeEvent(slug: string) {
  return `/events/${slug}` as const;
}

export function routeInsightArticle(slug: string) {
  return `/insights/${slug}` as const;
}

export function routeChasingSunsetsSeason(season: string) {
  return `/chasing-sunsets/${season}` as const;
}

export function routeUntoldStorySeason(season: string) {
  return `/untold-story/${season}` as const;
}

/* ------------------------------------------------------------------ */
/*  Campaign Host Detection                                            */
/* ------------------------------------------------------------------ */

export const CAMPAIGN_HOSTS = {
  sunsetsVip: "sunsets.vip",
  sunsetsVipWww: "www.sunsets.vip",
  untoldVip: "untold.vip",
  untoldVipWww: "www.untold.vip",
  monolithProject: "monolithproject.com",
  monolithProjectWww: "www.monolithproject.com",
} as const;

/* ------------------------------------------------------------------ */
/*  Outbound Short-Link Groups                                         */
/* ------------------------------------------------------------------ */

export const GO_GROUPS = {
  tickets: "tickets",
  waitlist: "waitlist",
  media: "media",
  gallery: "gallery",
  forms: "forms",
  social: "social",
} as const;

/** Build a /go/:group/:key outbound redirect path. */
export function goPath(group: string, key: string) {
  return `/go/${group}/${key}` as const;
}

/* ------------------------------------------------------------------ */
/*  Route Alias Map — maps legacy/vanity paths to canonical routes     */
/* ------------------------------------------------------------------ */

export const ROUTE_ALIASES: Record<string, string> = {
  "/togetherness": ROUTES.about + ANCHORS.togetherness,
  "/inner-circle": ROUTES.newsletter,
  "/the-monolith": ROUTES.monolith,
  "/collective": ROUTES.monolith,
};

/* ------------------------------------------------------------------ */
/*  Legacy Redirect Paths (case-variant SUNSETS)                       */
/* ------------------------------------------------------------------ */

export const SUNSETS_REDIRECT_SOURCES = [
  "/SUNSETS",
  "/SUNSET",
  "/Sunsets",
  "/Sunset",
  "/sunset/",
  "/sunset",
] as const;

/* ------------------------------------------------------------------ */
/*  Standalone Landing Pages (render without global chrome)            */
/* ------------------------------------------------------------------ */

export const STANDALONE_LANDING_PATHS = new Set([
  ROUTES.sunsets,
  ROUTES.lake,
  ROUTES.story,
]);

/* ------------------------------------------------------------------ */
/*  Paths where the event banner should appear                         */
/* ------------------------------------------------------------------ */

export const EVENT_BANNER_PATHS = new Set([
  ROUTES.home,
  ROUTES.tickets,
  ROUTES.chasingSunsets,
  ROUTES.story,
  ROUTES.untoldStoryDeronJuanyBravo,
  ROUTES.lineup,
  ROUTES.schedule,
  ROUTES.radio,
]);
