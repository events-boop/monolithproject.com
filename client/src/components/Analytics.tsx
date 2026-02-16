import { useEffect } from "react";
import { useLocation } from "wouter";
import { queueMetaPixelPageview, scheduleMetaPixelInit } from "@/lib/metaPixel";
import { queuePostHogPageview, schedulePostHogInit } from "@/lib/posthog";

export default function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    schedulePostHogInit();
    scheduleMetaPixelInit();
  }, []);

  useEffect(() => {
    queuePostHogPageview();
    queueMetaPixelPageview();
  }, [location]);

  return null;
}

