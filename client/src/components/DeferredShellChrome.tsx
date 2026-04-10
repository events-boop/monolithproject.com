import { lazy, Suspense, useEffect, useState } from "react";
import { runWhenIdle } from "@/lib/idle";
import {
  shouldEnableDesktopChrome,
  shouldEnableSmoothScroll,
} from "@/lib/runtimePerformance";

const CoordinateHUD = lazy(() => import("./CoordinateHUD"));
const CustomCursor = lazy(() => import("./CustomCursor"));
const GlobalSVGFilters = lazy(() => import("./ui/GlobalSVGFilters"));
const SensoryOverloadOverlay = lazy(() => import("./SensoryOverloadOverlay"));
const SmoothScroll = lazy(() => import("./SmoothScroll"));

export default function DeferredShellChrome() {
  const [enableDesktopChrome, setEnableDesktopChrome] = useState(false);
  const [enableSmoothScroll, setEnableSmoothScroll] = useState(false);

  useEffect(() => {
    const syncChrome = () => {
      setEnableDesktopChrome(shouldEnableDesktopChrome());
      setEnableSmoothScroll(shouldEnableSmoothScroll());
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

  if (!enableDesktopChrome && !enableSmoothScroll) return null;

  return (
    <Suspense fallback={null}>
      {enableSmoothScroll ? <SmoothScroll /> : null}
      {enableDesktopChrome ? (
        <>
          <GlobalSVGFilters />
          <CoordinateHUD />
          <CustomCursor />
          <SensoryOverloadOverlay />
        </>
      ) : null}
    </Suspense>
  );
}
