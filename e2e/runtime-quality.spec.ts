import { expect, test } from "@playwright/test";

const phoneWidths = [320, 360, 390];

async function waitForAppReady(page: import("@playwright/test").Page, pathname = "/") {
  await page.goto(pathname, { waitUntil: "networkidle" });
  await page.waitForSelector("#initial-loader", { state: "detached", timeout: 15000 });
  await page.waitForTimeout(800);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded", "1");
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
  });
});

test("exact route aliases resolve the intended experiences", async ({ page }) => {
  await waitForAppReady(page, "/events");
  await expect(page.getByRole("heading", { name: /upcoming shows/i })).toBeVisible();

  await waitForAppReady(page, "/untold-story");
  await expect(page).toHaveTitle(/Untold Story/i);
  await expect(page.getByRole("heading", { name: /untold/i }).first()).toBeVisible();
});

test("chasing sunsets keeps hero, countdown, and pricing aligned to one featured event", async ({ page }) => {
  await waitForAppReady(page, "/chasing-sunsets");

  const ids = await page.evaluate(() => ({
    hero: document.querySelector("#chasing-hero")?.getAttribute("data-featured-event-id"),
    countdown: document
      .querySelector("[data-countdown-event-id]")
      ?.getAttribute("data-countdown-event-id"),
    ticketing: document
      .querySelector("#chasing-tickets")
      ?.getAttribute("data-featured-event-id"),
  }));

  expect(ids.hero).toBeTruthy();
  expect(ids.countdown).toBe(ids.hero);
  expect(ids.ticketing).toBe(ids.hero);
});

for (const width of phoneWidths) {
  test(`home hero copy and conversion card stay separated at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await waitForAppReady(page, "/");

    const layout = await page.evaluate(() => {
      const heading = document.querySelector('[data-home-hero-heading="true"]');
      const card = document.querySelector('[data-home-hero-card="true"]');

      if (!(heading instanceof HTMLElement) || !(card instanceof HTMLElement)) {
        return null;
      }

      const headingRect = heading.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      return {
        headingBottom: headingRect.bottom,
        cardTop: cardRect.top,
        overlap: headingRect.bottom > cardRect.top - 12,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout?.overlap).toBe(false);
    expect(layout?.cardTop ?? 0).toBeGreaterThan(layout?.headingBottom ?? 0);
  });
}

test("vip route loads without browser console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await waitForAppReady(page, "/vip");

  expect(consoleErrors).toEqual([]);
});

test("mobile shells keep primary tap targets and hero copy above minimum usability thresholds", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await waitForAppReady(page, "/");

  const homeMetrics = await page.evaluate(() => {
    const getRect = (selector: string) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) return null;
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    };

    const getFontSize = (selector: string) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) return null;
      return Number.parseFloat(window.getComputedStyle(element).fontSize);
    };

    return {
      logo: getRect("[data-nav-logo='true']"),
      menu: getRect("[data-nav-menu-toggle='true']"),
      quickCta: getRect("[data-mobile-quick-cta='true']"),
      heroEyebrow: getFontSize("[data-home-hero-eyebrow='true']"),
      heroSummary: getFontSize("[data-home-hero-summary='true']"),
    };
  });

  expect(homeMetrics.logo?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(homeMetrics.logo?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(homeMetrics.menu?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(homeMetrics.menu?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(homeMetrics.quickCta?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(homeMetrics.quickCta?.height ?? 0).toBeGreaterThanOrEqual(44);
  expect(homeMetrics.heroEyebrow ?? 0).toBeGreaterThanOrEqual(12);
  expect(homeMetrics.heroSummary ?? 0).toBeGreaterThanOrEqual(12);

  await waitForAppReady(page, "/chasing-sunsets");

  const chasingMetrics = await page.evaluate(() => {
    const getFontSize = (selector: string) => {
      const element = document.querySelector(selector);
      if (!(element instanceof HTMLElement)) return null;
      return Number.parseFloat(window.getComputedStyle(element).fontSize);
    };

    return {
      episode: getFontSize("[data-chasing-episode='true']"),
      meta: getFontSize("[data-chasing-meta='true']"),
      formatLinkHeight: (document.querySelector(".season-anchor-link") as HTMLElement | null)?.getBoundingClientRect().height ?? 0,
    };
  });

  expect(chasingMetrics.episode ?? 0).toBeGreaterThanOrEqual(12);
  expect(chasingMetrics.meta ?? 0).toBeGreaterThanOrEqual(12);
  expect(chasingMetrics.formatLinkHeight).toBeGreaterThanOrEqual(44);

  await waitForAppReady(page, "/schedule");

  const scheduleMetrics = await page.evaluate(() => {
    const filter = document.querySelector("[data-schedule-filter='ALL']");
    if (!(filter instanceof HTMLElement)) return null;
    const rect = filter.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });

  expect(scheduleMetrics).not.toBeNull();
  expect(scheduleMetrics?.height ?? 0).toBeGreaterThanOrEqual(44);
});
