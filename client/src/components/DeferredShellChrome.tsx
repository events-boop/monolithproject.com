import { lazy, Suspense, useEffect, useState } from "react";
import { runWhenIdle } from "@/lib/idle";

const CustomCursor = lazy(() => import("./CustomCursor"));
const MonolithKernel = lazy(() => import("./MonolithKernel"));
const SensoryOverloadOverlay = lazy(() => import("./SensoryOverloadOverlay"));
const SmoothScroll = lazy(() => import("./SmoothScroll"));
const SystemHUD = lazy(() => import("./SystemHUD"));

function shouldEnableDesktopChrome() {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;

  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
  }).connection;

  if (conn?.saveData) return false;
  if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return false;

  return true;
}

function shouldEnableSmoothScroll() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const conn = (navigator as Navigator & {
    connection?: { effectiveType?: string; saveData?: boolean };
  }).connection;

  if (conn?.saveData) return false;
  if (conn?.effectiveType && ["slow-2g", "2g"].includes(conn.effectiveType)) return false;

  return true;
}

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
          <SystemHUD />
          <MonolithKernel />
          <SensoryOverloadOverlay />
        </>
      ) : null}
    </Suspense>
  );
}
