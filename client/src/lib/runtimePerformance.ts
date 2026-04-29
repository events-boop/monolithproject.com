type ConnectionInfo = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithHints = Navigator & {
  connection?: ConnectionInfo;
  deviceMemory?: number;
};

function getConnection(): ConnectionInfo | undefined {
  if (typeof navigator === "undefined") return undefined;

  return (navigator as NavigatorWithHints).connection;
}

function getDeviceMemory() {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as NavigatorWithHints).deviceMemory;
}

function getHardwareConcurrency() {
  if (typeof navigator === "undefined") return undefined;
  return navigator.hardwareConcurrency;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export function matchesMinWidth(minWidth: number) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
}

export function prefersReducedData() {
  return Boolean(getConnection()?.saveData);
}

export function hasConstrainedConnection(include3g = false) {
  const connection = getConnection();
  if (!connection) return false;
  if (connection.saveData) return true;

  const constrainedTypes = include3g
    ? ["slow-2g", "2g", "3g"]
    : ["slow-2g", "2g"];

  return Boolean(connection.effectiveType && constrainedTypes.includes(connection.effectiveType));
}

export function hasWeakDeviceProfile() {
  const deviceMemory = getDeviceMemory();
  const hardwareConcurrency = getHardwareConcurrency();

  const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
  const lowCpu = typeof hardwareConcurrency === "number" && hardwareConcurrency <= 6;

  return lowMemory || lowCpu;
}

export function shouldEnableDesktopChrome() {
  return (
    !prefersReducedMotion() &&
    !hasCoarsePointer() &&
    !prefersReducedData() &&
    matchesMinWidth(1280) &&
    !hasConstrainedConnection(true) &&
    !hasWeakDeviceProfile()
  );
}

export function shouldEnableSmoothScroll() {
  // Keep wheel and trackpad input native. The site already has enough cinematic
  // motion; scroll hijacking makes the experience feel less precise.
  return false;
}

export function shouldEnablePageTransitions() {
  return (
    !prefersReducedMotion() &&
    !hasCoarsePointer() &&
    !prefersReducedData() &&
    matchesMinWidth(960) &&
    !hasConstrainedConnection(true)
  );
}

export function shouldEnableAmbientVideo(minWidth = 640) {
  return (
    !prefersReducedMotion() &&
    !prefersReducedData() &&
    matchesMinWidth(minWidth) &&
    !hasConstrainedConnection(true) &&
    !hasWeakDeviceProfile()
  );
}
