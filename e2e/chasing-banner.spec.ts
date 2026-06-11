import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
  });
});

async function waitForAppReady(page: import("@playwright/test").Page) {
  // networkidle is unreachable: keepalive tracking fetches never report
  // finished to Playwright. The loader-detach wait below covers readiness.
  await page.goto("/chasing-sunsets", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#initial-loader", {
    state: "detached",
    timeout: 15000,
  });
}

test("chasing sunsets keeps the next-event context on mobile", async ({
  page,
}) => {
  await waitForAppReady(page);

  await expect(page.locator("#chasing-hero")).toContainText("SUN(SETS) I");
  await expect(page.locator("#chasing-hero")).toContainText("July 4, 2026");
  await expect(page.locator("#chasing-hero")).toContainText("Castaways");

  const countdown = page
    .locator("div")
    .filter({ has: page.getByText("Next Event", { exact: true }) })
    .filter({ hasText: "Chasing Sun(Sets)" })
    .filter({ hasText: "July 4, 2026" })
    .first();
  await expect(countdown).toContainText("Chasing Sun(Sets)");
  await expect(countdown).toContainText("July 4, 2026");
});
