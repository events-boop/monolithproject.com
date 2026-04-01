import { useEffect, useState } from "react";

const PROFILE_STORAGE_KEY = "monolith-visitor-profile-v1";
const ROUTE_HISTORY_STORAGE_KEY = "monolith-route-history-v1";
const MAX_ROUTE_HISTORY = 12;

const PARTNER_PATH_PREFIXES = ["/partners", "/press", "/booking", "/contact", "/submit"];
const PARTNER_AUDIENCE_VALUES = [
  "partner",
  "partners",
  "press",
  "media",
  "brand",
  "brands",
  "sponsor",
  "sponsorship",
  "venue",
  "venues",
  "crew",
  "booking",
] as const;
const GENERAL_AUDIENCE_VALUES = [
  "guest",
  "guests",
  "community",
  "fan",
  "fans",
  "listener",
  "listeners",
  "audience",
  "general",
] as const;

export type VisitorSegment = "first-visit" | "returning" | "partner-intent";
export type VisitorAudience = "general" | "partners";

interface VisitorProfile {
  explicitAudience: VisitorAudience | null;
  firstSeenAt: string;
  homeVisits: number;
  lastSeenAt: string;
  lastSegment: VisitorSegment;
}

interface StoredRouteHistory {
  lastUpdatedAt: string;
  paths: string[];
}

export type ClearanceTier = "CITIZEN" | "INITIATE" | "OPERATOR" | "ABSOLUTE_ZERO";

export interface VisitorContextState {
  explicitAudience: VisitorAudience | null;
  homeVisits: number;
  isReady: boolean;
  isReturning: boolean;
  segment: VisitorSegment;
  achievements: string[];
  tier: ClearanceTier;
}

const defaultContext: VisitorContextState = {
  explicitAudience: null,
  homeVisits: 0,
  isReady: false,
  isReturning: false,
  segment: "first-visit",
  achievements: [],
  tier: "CITIZEN",
};

function normalizePath(path?: string | null) {
  const clean = (path || "/").split("?")[0]?.split("#")[0]?.trim() || "/";
  if (!clean.startsWith("/")) return `/${clean}`;
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean;
}

function readJson<T>(storageKey: string) {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(storageKey: string, value: unknown) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Ignore storage write failures and keep the UI functional without persistence.
  }
}

function readProfile() {
  return readJson<VisitorProfile>(PROFILE_STORAGE_KEY);
}

function readRouteHistory(): StoredRouteHistory {
  const stored = readJson<StoredRouteHistory>(ROUTE_HISTORY_STORAGE_KEY);

  if (!stored || !Array.isArray(stored.paths)) {
    return { lastUpdatedAt: "", paths: [] };
  }

  return {
    lastUpdatedAt: typeof stored.lastUpdatedAt === "string" ? stored.lastUpdatedAt : "",
    paths: stored.paths.map((path) => normalizePath(path)).slice(0, MAX_ROUTE_HISTORY),
  };
}

function matchesAudienceValue(
  rawValue: string,
  allowedValues: readonly string[],
) {
  const normalized = rawValue.toLowerCase().trim().replace(/[_\s]+/g, "-");
  return allowedValues.some((value) => normalized === value || normalized.includes(value));
}

function inferExplicitAudience(search: string): VisitorAudience | null {
  const params = new URLSearchParams(search);
  const candidateValues = [
    params.get("audience"),
    params.get("persona"),
    params.get("profile"),
    params.get("utm_audience"),
  ];

  for (const rawValue of candidateValues) {
    if (!rawValue) continue;

    if (matchesAudienceValue(rawValue, PARTNER_AUDIENCE_VALUES)) {
      return "partners";
    }

    if (matchesAudienceValue(rawValue, GENERAL_AUDIENCE_VALUES)) {
      return "general";
    }
  }

  return null;
}

function isPartnerRoute(path: string) {
  return PARTNER_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

function resolveSegment({
  explicitAudience,
  profile,
  routeHistory,
}: {
  explicitAudience: VisitorAudience | null;
  profile: VisitorProfile | null;
  routeHistory: StoredRouteHistory;
}): VisitorSegment {
  if (explicitAudience === "partners") {
    return "partner-intent";
  }

  if (explicitAudience === "general") {
    return profile ? "returning" : "first-visit";
  }

  if (routeHistory.paths.some(isPartnerRoute)) {
    return "partner-intent";
  }

  if (profile) {
    return "returning";
  }

  return "first-visit";
}

export function rememberVisitedPath(path: string) {
  if (typeof window === "undefined") return;

  const normalizedPath = normalizePath(path);
  const routeHistory = readRouteHistory();
  const paths = [
    normalizedPath,
    ...routeHistory.paths.filter((storedPath) => storedPath !== normalizedPath),
  ].slice(0, MAX_ROUTE_HISTORY);

  writeJson(ROUTE_HISTORY_STORAGE_KEY, {
    lastUpdatedAt: new Date().toISOString(),
    paths,
  } satisfies StoredRouteHistory);
}

export function useVisitorContext() {
  const [context, setContext] = useState<VisitorContextState>(defaultContext);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const profile = readProfile();
    const routeHistory = readRouteHistory();
    const explicitAudience = inferExplicitAudience(window.location.search);
    const segment = resolveSegment({ explicitAudience, profile, routeHistory });
    const isHome = window.location.pathname === "/";
    const nextProfile: VisitorProfile = {
      explicitAudience: explicitAudience ?? profile?.explicitAudience ?? null,
      firstSeenAt: profile?.firstSeenAt ?? new Date().toISOString(),
      homeVisits: isHome ? (profile?.homeVisits ?? 0) + 1 : (profile?.homeVisits ?? 0),
      lastSeenAt: new Date().toISOString(),
      lastSegment: segment,
    };

    writeJson(PROFILE_STORAGE_KEY, nextProfile);

    // Calculate Achievements & Tier
    const achievements: string[] = [];
    if (localStorage.getItem("monolith-starred-rites")) achievements.push("STARRED_RITE");
    if (routeHistory.paths.includes("/insights")) achievements.push("VIEWED_INSIGHTS");
    if (routeHistory.paths.includes("/archive")) achievements.push("VIEWED_ARCHIVE");
    if (routeHistory.paths.includes("/radio")) achievements.push("VIEWED_RADIO");
    
    let tier: ClearanceTier = "CITIZEN";
    if (achievements.length >= 4) tier = "ABSOLUTE_ZERO";
    else if (achievements.length >= 2) tier = "OPERATOR";
    else if (achievements.length >= 1) tier = "INITIATE";

    setContext({
      explicitAudience: nextProfile.explicitAudience,
      homeVisits: nextProfile.homeVisits,
      isReady: true,
      isReturning: segment !== "first-visit",
      segment,
      achievements,
      tier,
    });
  }, []);

  return context;
}
