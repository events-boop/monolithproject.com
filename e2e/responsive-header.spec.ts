import { expect, test } from "@playwright/test";

const phoneWidths = [320, 340, 360, 375, 390, 430];
const desktopWidths = [1280, 1366, 1440, 1536, 1600, 1920];

async function waitForAppReady(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForSelector("#initial-loader", {
    state: "detached",
    timeout: 15000,
  });
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
        const banner = nav?.querySelector('a[data-nav-event-banner="true"]');
        const bannerText = banner?.querySelector(".truncate");
        const logo = nav?.querySelector('button[aria-label="Go to homepage"]');
        const menu = nav?.querySelector(
          'button[aria-label="Open navigation menu"], button[aria-label="Close navigation menu"]'
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
          quickRect?.left ?? Number.POSITIVE_INFINITY
        );

        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          totalHeaderHeight:
            (banner?.getBoundingClientRect().height ?? 0) +
            (shell?.getBoundingClientRect().height ?? 0),
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
      expect(metrics.logoToControlsGap).toBeGreaterThanOrEqual(
        width < 390 ? 12 : 20
      );
      expect(metrics.quickCtaVisible).toBe(width >= 370);
    });
  }

  test("desktop primary navigation stays ordered and collision-free", async ({
    page,
  }) => {
    for (const width of desktopWidths) {
      await page.setViewportSize({ width, height: 900 });
      await waitForAppReady(page);

      const metrics = await page.evaluate(() => {
        const nav = document.querySelector("nav");
        const rect = (element: Element | null | undefined) => {
          if (
            !(element instanceof HTMLElement) ||
            element.offsetParent === null
          )
            return null;
          const box = element.getBoundingClientRect();
          return { left: box.left, right: box.right };
        };
        const visibleElement = (selector: string) =>
          Array.from(nav?.querySelectorAll(selector) ?? []).find(
            element =>
              element instanceof HTMLElement && element.offsetParent !== null
          );
        const exactControl = (label: string) =>
          Array.from(nav?.querySelectorAll("button, a") ?? []).find(
            control =>
              control instanceof HTMLElement &&
              control.offsetParent !== null &&
              control.textContent?.trim().replace(/\s+/g, " ").toUpperCase() ===
                label
          );

        const labels = [
          "SHOWS",
          "ARTISTS",
          "SUN(SETS)",
          "UNTOLD STORY",
          "RADIO",
        ];
        const core = labels.map(label => ({
          label,
          rect: rect(exactControl(label)),
        }));
        const extraLabels = ["MONOLITH", "PARTNERS", "CONTACT"];
        const visibleExtras = extraLabels.filter(label => exactControl(label));

        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          logo: rect(visibleElement("[data-nav-logo='true']")),
          core,
          cta: rect(visibleElement("a[data-cursor-text]")),
          menu: rect(visibleElement("[data-nav-menu-toggle='true']")),
          visibleExtras,
        };
      });

      expect(metrics.scrollWidth, `${width}px page overflow`).toBe(
        metrics.clientWidth
      );
      expect(metrics.visibleExtras, `${width}px secondary nav leakage`).toEqual(
        []
      );

      const orderedRects = [
        metrics.logo,
        ...metrics.core.map(item => item.rect),
        metrics.cta,
        metrics.menu,
      ];
      expect(
        orderedRects.every(Boolean),
        `${width}px missing primary navigation control`
      ).toBe(true);

      for (let index = 1; index < orderedRects.length; index += 1) {
        const previous = orderedRects[index - 1]!;
        const current = orderedRects[index]!;
        expect(
          current.left - previous.right,
          `${width}px controls ${index - 1} and ${index} overlap`
        ).toBeGreaterThanOrEqual(8);
      }
    }
  });

  test("universal menu presents one coherent five-world hierarchy", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await waitForAppReady(page);
    await page.getByRole("button", { name: /open navigation menu/i }).click();

    const dialog = page.getByRole("dialog", { name: /navigation menu/i });
    await expect(dialog).toBeVisible();

    const chapters = dialog.locator("button[aria-expanded]");
    await expect(chapters).toHaveCount(5);
    await expect(chapters).toHaveText([
      /Shows/i,
      /Artists/i,
      /Chasing Sun\(Sets\)/i,
      /Untold Story/i,
      /Radio/i,
    ]);
    await expect(
      dialog.getByText("Upcoming Shows", { exact: true })
    ).toHaveCount(0);

    const utilities = dialog.getByRole("navigation", {
      name: /utility links/i,
    });
    await expect(
      utilities.getByRole("link", { name: "Monolith", exact: true })
    ).toBeVisible();
    await expect(
      utilities.getByRole("link", { name: "Partners", exact: true })
    ).toBeVisible();
    await expect(
      utilities.getByRole("link", { name: "Contact", exact: true })
    ).toBeVisible();
  });
});
