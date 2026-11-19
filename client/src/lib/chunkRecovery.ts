const KEY = "monolith:chunk-reload";
const COOLDOWN_MS = 60_000;

/**
 * Checks if an error is associated with a chunk, CSS preload, or dynamic import failure.
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return (
    /loading chunk/i.test(message) ||
    /failed to fetch dynamically imported module/i.test(message) ||
    /unable to preload css/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /failed to load module script/i.test(message) ||
    /importing a module script failed/i.test(message)
  );
}

/**
 * Recovers from stale or missing production chunks (e.g. after a new deployment)
 * by purging the service worker page cache and reloading the page with a 60-second cooldown
 * to prevent infinite reload loops.
 *
 * Returns true if a reload was initiated, false if recovery was declined (e.g. during cooldown or offline).
 */
export function recoverFromStaleChunk(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY)) || 0;
    if (
      Date.now() - last < COOLDOWN_MS ||
      (typeof navigator !== "undefined" && !navigator.onLine)
    ) {
      return false;
    }
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // If sessionStorage is blocked or unavailable, do not reload to avoid infinite loop
    return false;
  }

  const fresh = Promise.allSettled([
    typeof caches !== "undefined"
      ? caches.delete("monolith-pages")
      : Promise.resolve(),
    typeof navigator !== "undefined" && navigator.serviceWorker
      ? navigator.serviceWorker.getRegistration().then(reg => reg?.update())
      : Promise.resolve(),
  ]);

  // Give cleanup up to 1500ms before triggering clean reload
  Promise.race([fresh, new Promise(resolve => setTimeout(resolve, 1500))])
    .finally(() => {
      window.location.reload();
    });

  return true;
}
