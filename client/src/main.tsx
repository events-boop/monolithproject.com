/// <reference types="vite-plugin-pwa/client" />
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
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

// Ensure the UI shell caches instantly
registerSW({ immediate: true });

async function startApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  initAttributionTracking();
  ensurePublicSiteData(window.location.pathname); // non-blocking — fetch in background
  const { default: App } = await import("./App");

  createRoot(rootElement).render(
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  );

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("monolith:app-ready"));
  });
}

startApp().catch((e: unknown) => {
  renderMountError(e);
  console.error("React Mount Error:", e);
});
