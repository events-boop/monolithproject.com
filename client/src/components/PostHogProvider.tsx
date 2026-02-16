// Deprecated: analytics is now handled by `client/src/components/Analytics.tsx`,
// and intentionally deferred so it doesn't compete with first paint / LCP.
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
