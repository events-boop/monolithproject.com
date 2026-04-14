import { expect, test } from "@playwright/test";

const phoneWidths = [320, 340, 360, 375, 390, 430];

async function waitForAppReady(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForSelector("#initial-loader", { state: "detached", timeout: 15000 });
  await page.waitForTimeout(800);
}

test.describe("responsive header", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      sessionStorage.setItem("monolith-loaded", "1");
      sessionStorage.setItem("monolith-loaded-v2", "1");
    });
  });

  for (const width of phoneWidths) {
    test(`mobile header stays breathable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await waitForAppReady(page);

      const metrics = await page.evaluate(() => {
        const nav = document.querySelector("nav");
        const shell = nav?.querySelector(".shell-frame, .shell-frame-light");
        const banner = nav?.querySelector('a[aria-label*="current featured event"], a[aria-label*="early access"]');
        const bannerText = banner?.querySelector(".truncate");
        const logo = nav?.querySelector('button[aria-label="Go to homepage"]');
        const menu = nav?.querySelector(
          'button[aria-label="Open navigation menu"], button[aria-label="Close navigation menu"]',
        );
        const quickCta = nav?.querySelector('[data-mobile-quick-cta="true"]');

        const rect = (el: Element | null | undefined) => {
          if (!(el instanceof HTMLElement)) return undefined;
          if (el.offsetParent === null) return undefined;
          const box = el.getBoundingClientRect();
          if (box.width === 0 || box.height === 0) return undefined;
          return box;
        };
        const shellRect = rect(shell);
        const bannerRect = rect(banner);
        const logoRect = rect(logo);
        const menuRect = rect(menu);
        const quickRect = rect(quickCta);
        const controlsLeft = Math.min(
          menuRect?.left ?? Number.POSITIVE_INFINITY,
          quickRect?.left ?? Number.POSITIVE_INFINITY,
        );

        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          totalHeaderHeight:
            (banner?.getBoundingClientRect().height ?? 0) + (shell?.getBoundingClientRect().height ?? 0),
          shellHeight: shellRect?.height ?? 0,
          bannerHeight: bannerRect?.height ?? 0,
          bannerTextLength: bannerText?.textContent?.trim().length ?? 0,
          logoWidth: logoRect?.width ?? 0,
          logoToControlsGap:
            controlsLeft === Number.POSITIVE_INFINITY || !logoRect
              ? 0
              : Math.round((controlsLeft - logoRect.right) * 100) / 100,
          quickCtaVisible: !!quickRect,
        };
      });

      expect(metrics.scrollWidth).toBe(metrics.clientWidth);
      expect(metrics.totalHeaderHeight).toBeLessThanOrEqual(98);
      expect(metrics.shellHeight).toBeLessThanOrEqual(64);
      expect(metrics.bannerHeight).toBeLessThanOrEqual(38);
      expect(metrics.bannerTextLength).toBeGreaterThan(8);
      expect(metrics.logoWidth).toBeLessThanOrEqual(110);
      expect(metrics.logoToControlsGap).toBeGreaterThanOrEqual(width < 390 ? 12 : 20);
      expect(metrics.quickCtaVisible).toBe(width >= 370);
    });
  }
});
