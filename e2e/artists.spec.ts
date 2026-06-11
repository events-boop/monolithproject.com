import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
  });
});

async function waitForAppReady(page: import("@playwright/test").Page) {
  // networkidle is unreachable here: tracking fetches use keepalive, which
  // Chromium never reports as finished to Playwright.
  await page
    .waitForSelector("#initial-loader", { state: "detached", timeout: 15000 })
    .catch(() => undefined);
  await page.waitForLoadState("domcontentloaded");
}

test("artists index renders the roster grid with Kiko Franco", async ({
  page,
}) => {
  await page.goto("/artists", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);

  const body = page.locator("body");
  await expect(body).toContainText(/kiko franco/i);
  await expect(body).not.toContainText("This page doesn't exist.");
});

test("kiko franco profile renders bio, role, and next event", async ({
  page,
}) => {
  await page.goto("/artists/kiko-franco", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);

  const body = page.locator("body");
  await expect(body).toContainText(/kiko franco/i);
  await expect(body).toContainText(/july 4 headliner/i);
  await expect(body).toContainText(/afro house/i);
  await expect(body).not.toContainText("Artist Not Found");
});
