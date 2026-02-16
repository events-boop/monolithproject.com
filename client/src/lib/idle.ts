type IdleHandle = number;

// Schedule non-critical work so it doesn't compete with first paint / LCP.
export function runWhenIdle(fn: () => void, timeoutMs = 2000): () => void {
  if (typeof window === "undefined") return () => {};

  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => IdleHandle;
    cancelIdleCallback?: (handle: IdleHandle) => void;
  };

  if (typeof w.requestIdleCallback === "function") {
    const handle = w.requestIdleCallback(fn, { timeout: timeoutMs });
    return () => w.cancelIdleCallback?.(handle);
  }

  const handle = window.setTimeout(fn, timeoutMs);
  return () => window.clearTimeout(handle);
}

