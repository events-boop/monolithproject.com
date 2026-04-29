import { lazy, Suspense, useEffect, useState } from "react";
import { runWhenIdle } from "@/lib/idle";
import { shouldEnableDesktopChrome } from "@/lib/runtimePerformance";

const CoordinateHUD = lazy(() => import("./CoordinateHUD"));
const CustomCursor = lazy(() => import("./CustomCursor"));
const GlobalSVGFilters = lazy(() => import("./ui/GlobalSVGFilters"));
const SensoryOverloadOverlay = lazy(() => import("./SensoryOverloadOverlay"));

export default function DeferredShellChrome() {
  const [enableDesktopChrome, setEnableDesktopChrome] = useState(false);

  useEffect(() => {
    const syncChrome = () => {
      setEnableDesktopChrome(shouldEnableDesktopChrome());
    };

    const cancelIdle = runWhenIdle(syncChrome, 1800);
    window.addEventListener("resize", syncChrome, { passive: true });
    window.addEventListener("orientationchange", syncChrome, { passive: true });

    return () => {
      cancelIdle();
      window.removeEventListener("resize", syncChrome);
      window.removeEventListener("orientationchange", syncChrome);
    };
  }, []);

  if (!enableDesktopChrome) return null;

  return (
    <Suspense fallback={null}>
      <GlobalSVGFilters />
      <CoordinateHUD />
      <CustomCursor />
      <SensoryOverloadOverlay />
    </Suspense>
  );
}
