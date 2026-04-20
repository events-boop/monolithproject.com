/// <reference types="vite-plugin-pwa/client" />
import { createRoot } from "react-dom/client";
import { initAttributionTracking } from "./lib/attribution";
import { ensurePublicSiteData } from "./lib/siteData";
import "./styles/index.css";

import { registerSW } from 'virtual:pwa-register';

function renderMountError(error: unknown) {
  const wrapper = document.createElement("div");
  wrapper.style.color = "red";
  wrapper.style.padding = "20px";
  wrapper.style.fontFamily = "monospace";

  const heading = document.createElement("h1");
  heading.textContent = "React Mount Error";

  const details = document.createElement("pre");
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack || "" : "";
  details.textContent = stack ? `${message}\n${stack}` : message;

  wrapper.appendChild(heading);
  wrapper.appendChild(details);

  document.body.replaceChildren(wrapper);
}

function scheduleIdleWork(callback: () => void, timeout = 3000) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout });
    return;
  }

  globalThis.setTimeout(callback, Math.min(timeout, 3000));
}

async function startApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  const { default: App } = await import("./App");

  createRoot(rootElement).render(<App />);

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("monolith:app-ready"));
  });

  scheduleIdleWork(() => {
    initAttributionTracking();
    void ensurePublicSiteData(window.location.pathname).catch((error) => {
      if (import.meta.env.DEV) {
        console.warn("[site-data] Initial preload failed.", error);
      }
    });

    // Keep PWA registration off the LCP path.
    registerSW({ immediate: true });
  });
}

startApp().catch((e: unknown) => {
  renderMountError(e);
  console.error("React Mount Error:", e);
});
