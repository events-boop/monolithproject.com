/// <reference types="vite-plugin-pwa/client" />
import { createRoot } from "react-dom/client";
import { initAttributionTracking } from "./lib/attribution";
import { ensurePublicSiteData } from "./lib/siteData";
import { preloadRouteChunk } from "./lib/routePreload";
import { recoverFromStaleChunk } from "./lib/chunkRecovery";
import "./styles/index.css";

import { registerSW } from "virtual:pwa-register";

// Intercept Vite asset preload errors before React mount
window.addEventListener("vite:preloadError", event => {
  if (recoverFromStaleChunk()) {
    event.preventDefault();
  }
});

function renderMountError(error: unknown) {
  const wrapper = document.createElement("div");
  wrapper.style.minHeight = "100svh";
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.padding = "2rem";
  wrapper.style.backgroundColor = "#0a0a0a";
  wrapper.style.color = "#ffffff";
  wrapper.style.fontFamily = "ui-monospace, monospace";

  const card = document.createElement("div");
  card.style.maxWidth = "42rem";
  card.style.width = "100%";
  card.style.border = "1px solid rgba(255, 255, 255, 0.1)";
  card.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  card.style.backdropFilter = "blur(16px)";
  card.style.padding = "2.5rem";

  const kicker = document.createElement("div");
  kicker.style.display = "flex";
  kicker.style.alignItems = "center";
  kicker.style.gap = "0.75rem";
  kicker.style.marginBottom = "1.5rem";
  kicker.innerHTML = `
    <div style="height: 1px; width: 2.5rem; background-color: rgba(224, 90, 58, 0.6);"></div>
    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.35em; color: #E05A3A;">Connection Notice</span>
  `;

  const heading = document.createElement("h1");
  heading.style.fontSize = "clamp(2.5rem, 6vw, 4rem)";
  heading.style.lineHeight = "0.9";
  heading.style.textTransform = "uppercase";
  heading.style.fontWeight = "bold";
  heading.style.letterSpacing = "-0.02em";
  heading.style.marginBottom = "1.5rem";
  heading.innerHTML = "Page<br>Did Not<br>Load";

  const message = document.createElement("p");
  message.style.fontSize = "0.875rem";
  message.style.letterSpacing = "0.05em";
  message.style.color = "rgba(255, 255, 255, 0.7)";
  message.style.lineHeight = "1.6";
  message.style.marginBottom = "2rem";
  message.textContent =
    "Something went wrong while loading this experience. This often happens after a new show or audio release lands while your browser has older files cached.";

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.flexWrap = "wrap";
  btnContainer.style.gap = "1rem";

  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "RELOAD EXPERIENCE ↗";
  refreshBtn.style.padding = "0.75rem 1.5rem";
  refreshBtn.style.backgroundColor = "#ffffff";
  refreshBtn.style.color = "#000000";
  refreshBtn.style.fontSize = "11px";
  refreshBtn.style.letterSpacing = "0.2em";
  refreshBtn.style.fontWeight = "bold";
  refreshBtn.style.border = "none";
  refreshBtn.style.cursor = "pointer";
  refreshBtn.onclick = () => window.location.reload();

  const homeBtn = document.createElement("a");
  homeBtn.href = "/";
  homeBtn.textContent = "RETURN HOME";
  homeBtn.style.padding = "0.75rem 1.5rem";
  homeBtn.style.border = "1px solid rgba(255, 255, 255, 0.2)";
  homeBtn.style.color = "rgba(255, 255, 255, 0.8)";
  homeBtn.style.fontSize = "11px";
  homeBtn.style.letterSpacing = "0.2em";
  homeBtn.style.textDecoration = "none";
  homeBtn.style.display = "inline-flex";
  homeBtn.style.alignItems = "center";

  btnContainer.appendChild(refreshBtn);
  btnContainer.appendChild(homeBtn);

  card.appendChild(kicker);
  card.appendChild(heading);
  card.appendChild(message);

  if (import.meta.env.DEV) {
    const debugPre = document.createElement("pre");
    debugPre.style.fontSize = "10px";
    debugPre.style.color = "rgba(224, 90, 58, 0.9)";
    debugPre.style.marginBottom = "1.5rem";
    debugPre.style.whiteSpace = "pre-wrap";
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack || "" : "";
    debugPre.textContent = stack ? `${msg}\n${stack}` : msg;
    card.appendChild(debugPre);
  }

  card.appendChild(btnContainer);
  wrapper.appendChild(card);

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

  // Start data preload IMMEDIATELY, do not wait for idle or App bundle.
  void ensurePublicSiteData(window.location.pathname).catch(error => {
    if (import.meta.env.DEV) {
      console.warn("[site-data] Initial preload failed.", error);
    }
  });

  // Load the landing page chunk with the App bundle so the prerendered HTML
  // stays on screen instead of flashing the route loader.
  const [{ default: App }] = await Promise.all([
    import("./App"),
    preloadRouteChunk(window.location.pathname),
  ]);

  createRoot(rootElement).render(<App />);

  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("monolith:app-ready"));
  });

  scheduleIdleWork(() => {
    initAttributionTracking();

    // Keep PWA registration off the LCP path.
    registerSW({ immediate: true });
  });
}

startApp().catch((e: unknown) => {
  if (recoverFromStaleChunk()) {
    return;
  }
  renderMountError(e);
  console.error("React Mount Error:", e);
});
