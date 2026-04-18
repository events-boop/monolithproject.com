import { capturePostHogEvent } from "./posthog";

type VitalName = "CLS" | "INP" | "LCP";
type VitalRating = "good" | "needs_improvement" | "poor";
type LayoutShiftEntry = PerformanceEntry & {
  hadRecentInput?: boolean;
  value: number;
};
type EventTimingEntry = PerformanceEntry & {
  duration: number;
  interactionId?: number;
};

let started = false;

function canObserve(entryType: string) {
  if (typeof window === "undefined") return false;
  if (typeof PerformanceObserver === "undefined") return false;
  return Array.isArray(PerformanceObserver.supportedEntryTypes)
    ? PerformanceObserver.supportedEntryTypes.includes(entryType)
    : false;
}

function getRating(name: VitalName, value: number): VitalRating {
  switch (name) {
    case "CLS":
      if (value <= 0.1) return "good";
      if (value <= 0.25) return "needs_improvement";
      return "poor";
    case "INP":
      if (value <= 200) return "good";
      if (value <= 500) return "needs_improvement";
      return "poor";
    case "LCP":
    default:
      if (value <= 2500) return "good";
      if (value <= 4000) return "needs_improvement";
      return "poor";
  }
}

function roundValue(name: VitalName, value: number) {
  return name === "CLS" ? Number(value.toFixed(3)) : Math.round(value);
}

function reportVital(name: VitalName, value: number, path: string) {
  capturePostHogEvent("web_vital", {
    metric_name: name,
    metric_value: roundValue(name, value),
    metric_unit: name === "CLS" ? "unitless" : "ms",
    metric_rating: getRating(name, value),
    route: path,
  });
}

function onPageHidden(callback: () => void) {
  let flushed = false;

  const flush = () => {
    if (flushed) return;
    flushed = true;
    callback();
    cleanup();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      flush();
    }
  };

  const handlePageHide = () => {
    flush();
  };

  const cleanup = () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", handlePageHide);
  };

  document.addEventListener("visibilitychange", handleVisibilityChange, {
    passive: true,
  });
  window.addEventListener("pagehide", handlePageHide, { passive: true });

  return cleanup;
}

function startLcpObserver(path: string) {
  if (!canObserve("largest-contentful-paint")) return;

  let latest: PerformanceEntry | null = null;
  let reported = false;
  let flushTimer: number | null = null;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    latest = entries[entries.length - 1] || latest;

    if (flushTimer !== null) {
      window.clearTimeout(flushTimer);
    }

    flushTimer = window.setTimeout(() => {
      flush();
    }, 2500);
  });

  const flush = () => {
    if (reported || !latest) return;
    reported = true;
    reportVital("LCP", latest.startTime, path);
    observer.disconnect();
    cleanupHidden();
    if (flushTimer !== null) {
      window.clearTimeout(flushTimer);
      flushTimer = null;
    }
  };

  const cleanupHidden = onPageHidden(flush);

  observer.observe({
    type: "largest-contentful-paint",
    buffered: true,
  });
}

function startClsObserver(path: string) {
  if (!canObserve("layout-shift")) return;

  let cls = 0;
  let reported = false;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as LayoutShiftEntry[]) {
      if (entry.hadRecentInput) continue;
      cls += entry.value;
    }
  });

  const flush = () => {
    if (reported) return;
    reported = true;
    reportVital("CLS", cls, path);
    observer.disconnect();
    cleanupHidden();
  };

  const cleanupHidden = onPageHidden(flush);

  observer.observe({
    type: "layout-shift",
    buffered: true,
  });
}

function startInpObserver(path: string) {
  if (!canObserve("event")) return;

  let worstInteraction = 0;
  let reported = false;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as EventTimingEntry[]) {
      worstInteraction = Math.max(worstInteraction, entry.duration);
    }
  });

  const flush = () => {
    if (reported || worstInteraction <= 0) return;
    reported = true;
    reportVital("INP", worstInteraction, path);
    observer.disconnect();
    cleanupHidden();
  };

  const cleanupHidden = onPageHidden(flush);

  observer.observe({
    type: "event",
    buffered: true,
    durationThreshold: 40,
  } as PerformanceObserverInit);
}

export function startWebVitalsReporting() {
  if (started) return;
  if (typeof window === "undefined") return;

  started = true;
  const bootPath = `${window.location.pathname}${window.location.search}`;

  startLcpObserver(bootPath);
  startClsObserver(bootPath);
  startInpObserver(bootPath);
}
