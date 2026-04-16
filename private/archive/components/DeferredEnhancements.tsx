import { lazy, Suspense, useEffect, useState } from "react";
import { runWhenIdle } from "@/lib/idle";

const GridBackground = lazy(() => import("./GridBackground"));

export default function DeferredEnhancements() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => runWhenIdle(() => setEnabled(true), 1200), []);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <GridBackground />
    </Suspense>
  );
}
