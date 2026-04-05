type ConnectionInfo = {
  effectiveType?: string;
  saveData?: boolean;
};

function getConnection(): ConnectionInfo | undefined {
  if (typeof navigator === "undefined") return undefined;

  return (navigator as Navigator & {
    connection?: ConnectionInfo;
  }).connection;
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

export function hasConstrainedConnection(include3g = false) {
  const connection = getConnection();
  if (!connection) return false;
  if (connection.saveData) return true;

  const constrainedTypes = include3g
    ? ["slow-2g", "2g", "3g"]
    : ["slow-2g", "2g"];

  return Boolean(connection.effectiveType && constrainedTypes.includes(connection.effectiveType));
}

export function shouldEnableDesktopChrome() {
  return (
    !prefersReducedMotion() &&
    !hasCoarsePointer() &&
    matchesMinWidth(1024) &&
    !hasConstrainedConnection(true)
  );
}

export function shouldEnableSmoothScroll() {
  return (
    !prefersReducedMotion() &&
    !hasCoarsePointer() &&
    matchesMinWidth(1024) &&
    !hasConstrainedConnection()
  );
}

export function shouldEnablePageTransitions() {
  return (
    !prefersReducedMotion() &&
    !hasCoarsePointer() &&
    matchesMinWidth(768) &&
    !hasConstrainedConnection(true)
  );
}
