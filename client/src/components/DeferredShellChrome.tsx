import { lazy, Suspense, useEffect, useState } from "react";
import { runWhenIdle } from "@/lib/idle";
import {
  shouldEnableDesktopChrome,
  shouldEnableSmoothScroll,
} from "@/lib/runtimePerformance";

const CustomCursor = lazy(() => import("./CustomCursor"));
const SensoryOverloadOverlay = lazy(() => import("./SensoryOverloadOverlay"));
const SmoothScroll = lazy(() => import("./SmoothScroll"));

export default function DeferredShellChrome() {
  const [enableDesktopChrome, setEnableDesktopChrome] = useState(false);
  const [enableSmoothScroll, setEnableSmoothScroll] = useState(false);

  useEffect(() => {
    return runWhenIdle(() => {
      setEnableDesktopChrome(shouldEnableDesktopChrome());
      setEnableSmoothScroll(shouldEnableSmoothScroll());
    }, 1800);
  }, []);

  if (!enableDesktopChrome && !enableSmoothScroll) return null;

  return (
    <Suspense fallback={null}>
      {enableSmoothScroll ? <SmoothScroll /> : null}
      {enableDesktopChrome ? (
        <>
          <CustomCursor />
          <SensoryOverloadOverlay />
        </>
      ) : null}
    </Suspense>
  );
}
