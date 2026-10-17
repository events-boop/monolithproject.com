/**
 * Build-time renderer for prerendered routes (scripts/prerender_public_routes.mts).
 *
 * Produces the real page markup so the first paint shows the finished design
 * instead of a text-only shell. The client still mounts with createRoot and
 * replaces this markup; it is not hydrated, so small server/client differences
 * are harmless.
 */
import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "../contexts/ThemeContext";
import { UIProvider } from "../contexts/UIContext";
import { InquiryProvider } from "../contexts/InquiryContext";
import type { PublicSiteData } from "@shared/events/types";
import { primePublicSiteData } from "../lib/siteData";

const PAGES: Record<string, () => Promise<{ default: ComponentType }>> = {
  Tickets: () => import("../pages/Tickets"),
  Radio: () => import("../pages/Radio"),
  Booking: () => import("../pages/Booking"),
  Partners: () => import("../pages/Partners"),
  Archive: () => import("../pages/Archive"),
};

export type PrerenderPageKey = keyof typeof PAGES;

export const PRERENDER_PAGE_ROUTES: Record<string, PrerenderPageKey> = {
  "/tickets": "Tickets",
  "/radio": "Radio",
  "/booking": "Booking",
  "/partners": "Partners",
  "/archive": "Archive",
};

/** Source module for a page, as keyed in Vite's build manifest. */
export function pageModuleId(key: PrerenderPageKey) {
  return `src/pages/${key}.tsx`;
}

export async function renderPage(
  path: string,
  key: PrerenderPageKey,
  siteData: PublicSiteData
) {
  primePublicSiteData(siteData);
  const { default: Page } = await PAGES[key]();
  const markup = renderToString(
    <HelmetProvider context={{}}>
      <ThemeProvider defaultTheme="dark">
        <UIProvider>
          <InquiryProvider>
            <Router ssrPath={path}>
              <Page />
            </Router>
          </InquiryProvider>
        </UIProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
  // Same wrappers App renders around every route: #app-shell (several page
  // styles are scoped to it) and withTransition()'s container.
  return `<div><div id="app-shell" class="w-full origin-top transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-screen relative"><div class="relative w-full bg-background min-h-screen overflow-x-clip">${markup}</div></div></div>`;
}
