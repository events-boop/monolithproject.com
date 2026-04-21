export interface AttributionPayload {
  sessionId?: string;
  pageUrl?: string;
  landingPageUrl?: string;
  referrer?: string;
  referrerDomain?: string;
  firstReferrer?: string;
  firstReferrerDomain?: string;
  firstTouchAt?: string;
  lastTouchAt?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  firstUtmSource?: string;
  firstUtmMedium?: string;
  firstUtmCampaign?: string;
  firstUtmTerm?: string;
  firstUtmContent?: string;
  lastUtmSource?: string;
  lastUtmMedium?: string;
  lastUtmCampaign?: string;
  lastUtmTerm?: string;
  lastUtmContent?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  firstGclid?: string;
  firstFbclid?: string;
  firstTtclid?: string;
  firstMsclkid?: string;
  lastGclid?: string;
  lastFbclid?: string;
  lastTtclid?: string;
  lastMsclkid?: string;
}

interface TouchPoint {
  capturedAt: string;
  pageUrl: string;
  referrer?: string;
  referrerDomain?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
}

interface StoredAttribution {
  sessionId: string;
  landingPageUrl: string;
  firstTouch: TouchPoint;
  lastTouch: TouchPoint;
}

const ATTRIBUTION_STORAGE_KEY = "monolith:attribution:v1";
const SESSION_STORAGE_KEY = "monolith:session:v1";
const ATTRIBUTION_QUERY_PARAMS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  gclid: "gclid",
  fbclid: "fbclid",
  ttclid: "ttclid",
  msclkid: "msclkid",
} as const satisfies Record<string, keyof AttributionPayload>;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getLocalStorage() {
  if (!isBrowser()) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getSessionStorage() {
  if (!isBrowser()) return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `sess_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function normalizeExternalReferrer(currentOrigin: string, rawReferrer?: string) {
  if (!rawReferrer) return {};

  try {
    const referrerUrl = new URL(rawReferrer);
    if (referrerUrl.origin === currentOrigin) return {};

    return {
      referrer: referrerUrl.toString(),
      referrerDomain: referrerUrl.hostname,
    };
  } catch {
    return {};
  }
}

function readStoredAttribution(): StoredAttribution | null {
  const storage = getLocalStorage();
  const raw = storage?.getItem(ATTRIBUTION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed?.sessionId || !parsed?.firstTouch?.pageUrl || !parsed?.lastTouch?.pageUrl) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredAttribution(store: StoredAttribution) {
  const storage = getLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage write failures so attribution never blocks conversion flows.
  }
}

function resolveSessionId() {
  const sessionStorage = getSessionStorage();
  const localStorage = getLocalStorage();

  const existingSessionId =
    sessionStorage?.getItem(SESSION_STORAGE_KEY)?.trim() ||
    readStoredAttribution()?.sessionId ||
    "";

  if (existingSessionId) return existingSessionId;

  const nextSessionId = createSessionId();
  try {
    sessionStorage?.setItem(SESSION_STORAGE_KEY, nextSessionId);
    localStorage?.setItem(SESSION_STORAGE_KEY, nextSessionId);
  } catch {
    // Ignore storage write failures and continue with the in-memory session id.
  }
  return nextSessionId;
}

function readQueryParam(url: URL, name: string) {
  return url.searchParams.get(name) || undefined;
}

function buildCurrentTouchPoint(): TouchPoint | null {
  if (!isBrowser()) return null;

  const pageUrl = new URL(window.location.href);
  const referrer = normalizeExternalReferrer(pageUrl.origin, document.referrer);

  return {
    capturedAt: new Date().toISOString(),
    pageUrl: pageUrl.toString(),
    ...referrer,
    utmSource: readQueryParam(pageUrl, "utm_source"),
    utmMedium: readQueryParam(pageUrl, "utm_medium"),
    utmCampaign: readQueryParam(pageUrl, "utm_campaign"),
    utmTerm: readQueryParam(pageUrl, "utm_term"),
    utmContent: readQueryParam(pageUrl, "utm_content"),
    gclid: readQueryParam(pageUrl, "gclid"),
    fbclid: readQueryParam(pageUrl, "fbclid"),
    ttclid: readQueryParam(pageUrl, "ttclid"),
    msclkid: readQueryParam(pageUrl, "msclkid"),
  };
}

function hasAcquisitionSignal(touch: TouchPoint) {
  return Boolean(
    touch.referrer ||
      touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.utmTerm ||
      touch.utmContent ||
      touch.gclid ||
      touch.fbclid ||
      touch.ttclid ||
      touch.msclkid,
  );
}

function mergeTouchPoint(existing: TouchPoint, current: TouchPoint): TouchPoint {
  const shouldRefreshSignals = hasAcquisitionSignal(current);

  return {
    capturedAt: current.capturedAt,
    pageUrl: current.pageUrl,
    referrer: shouldRefreshSignals ? current.referrer || existing.referrer : existing.referrer,
    referrerDomain: shouldRefreshSignals ? current.referrerDomain || existing.referrerDomain : existing.referrerDomain,
    utmSource: shouldRefreshSignals ? current.utmSource || existing.utmSource : existing.utmSource,
    utmMedium: shouldRefreshSignals ? current.utmMedium || existing.utmMedium : existing.utmMedium,
    utmCampaign: shouldRefreshSignals ? current.utmCampaign || existing.utmCampaign : existing.utmCampaign,
    utmTerm: shouldRefreshSignals ? current.utmTerm || existing.utmTerm : existing.utmTerm,
    utmContent: shouldRefreshSignals ? current.utmContent || existing.utmContent : existing.utmContent,
    gclid: shouldRefreshSignals ? current.gclid || existing.gclid : existing.gclid,
    fbclid: shouldRefreshSignals ? current.fbclid || existing.fbclid : existing.fbclid,
    ttclid: shouldRefreshSignals ? current.ttclid || existing.ttclid : existing.ttclid,
    msclkid: shouldRefreshSignals ? current.msclkid || existing.msclkid : existing.msclkid,
  };
}

export function captureAttribution() {
  const currentTouch = buildCurrentTouchPoint();
  if (!currentTouch) return null;

  const existing = readStoredAttribution();
  const sessionId = resolveSessionId();

  const nextStore: StoredAttribution = existing
    ? {
        sessionId: existing.sessionId || sessionId,
        landingPageUrl: existing.landingPageUrl || currentTouch.pageUrl,
        firstTouch: existing.firstTouch,
        lastTouch: mergeTouchPoint(existing.lastTouch, currentTouch),
      }
    : {
        sessionId,
        landingPageUrl: currentTouch.pageUrl,
        firstTouch: currentTouch,
        lastTouch: currentTouch,
      };

  writeStoredAttribution(nextStore);
  return nextStore;
}

export function initAttributionTracking() {
  return captureAttribution();
}

export function syncAttributionForNavigation() {
  return captureAttribution();
}

export function getAttributionPayload(): AttributionPayload {
  const store = captureAttribution();
  const firstTouch = store?.firstTouch;
  const lastTouch = store?.lastTouch;

  return {
    sessionId: store?.sessionId,
    pageUrl: lastTouch?.pageUrl,
    landingPageUrl: store?.landingPageUrl || firstTouch?.pageUrl,
    referrer: lastTouch?.referrer,
    referrerDomain: lastTouch?.referrerDomain,
    firstReferrer: firstTouch?.referrer,
    firstReferrerDomain: firstTouch?.referrerDomain,
    firstTouchAt: firstTouch?.capturedAt,
    lastTouchAt: lastTouch?.capturedAt,
    utmSource: lastTouch?.utmSource,
    utmMedium: lastTouch?.utmMedium,
    utmCampaign: lastTouch?.utmCampaign,
    utmTerm: lastTouch?.utmTerm,
    utmContent: lastTouch?.utmContent,
    firstUtmSource: firstTouch?.utmSource,
    firstUtmMedium: firstTouch?.utmMedium,
    firstUtmCampaign: firstTouch?.utmCampaign,
    firstUtmTerm: firstTouch?.utmTerm,
    firstUtmContent: firstTouch?.utmContent,
    lastUtmSource: lastTouch?.utmSource,
    lastUtmMedium: lastTouch?.utmMedium,
    lastUtmCampaign: lastTouch?.utmCampaign,
    lastUtmTerm: lastTouch?.utmTerm,
    lastUtmContent: lastTouch?.utmContent,
    gclid: lastTouch?.gclid,
    fbclid: lastTouch?.fbclid,
    ttclid: lastTouch?.ttclid,
    msclkid: lastTouch?.msclkid,
    firstGclid: firstTouch?.gclid,
    firstFbclid: firstTouch?.fbclid,
    firstTtclid: firstTouch?.ttclid,
    firstMsclkid: firstTouch?.msclkid,
    lastGclid: lastTouch?.gclid,
    lastFbclid: lastTouch?.fbclid,
    lastTtclid: lastTouch?.ttclid,
    lastMsclkid: lastTouch?.msclkid,
  };
}

export function getAttributionQueryParams() {
  const payload = getAttributionPayload();
  const params = new URLSearchParams();

  for (const [queryName, payloadKey] of Object.entries(ATTRIBUTION_QUERY_PARAMS)) {
    const value = payload[payloadKey];
    if (typeof value === "string" && value.trim()) {
      params.set(queryName, value.trim());
    }
  }

  return params;
}

export function appendAttributionQueryParams(href: string) {
  const params = getAttributionQueryParams();
  if (!Array.from(params.keys()).length) return href;

  try {
    const origin = isBrowser() ? window.location.origin : "https://monolithproject.com";
    const url = new URL(href, origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return href;

    params.forEach((value, key) => {
      if (!url.searchParams.has(key)) {
        url.searchParams.set(key, value);
      }
    });

    if (url.origin === origin && !/^https?:\/\//i.test(href)) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    return href;
  }
}

export function clearAttributionState() {
  getLocalStorage()?.removeItem(ATTRIBUTION_STORAGE_KEY);
  getLocalStorage()?.removeItem(SESSION_STORAGE_KEY);
  getSessionStorage()?.removeItem(SESSION_STORAGE_KEY);
}
