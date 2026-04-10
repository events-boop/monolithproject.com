import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
  });
});

async function waitForAppReady(page: import("@playwright/test").Page) {
  await page.goto("/chasing-sunsets", { waitUntil: "networkidle" });
  await page.waitForSelector("#initial-loader", { state: "detached", timeout: 15000 });
}

test("chasing sunsets keeps July 4 banner context on mobile", async ({ page }) => {
  await waitForAppReady(page);

  await expect(page.locator("#chasing-hero")).toContainText("JULY 4TH OPEN-AIR EXPERIENCE");
  await expect(page.locator("#chasing-hero")).toContainText("July 4, 2026");

  const countdown = page.getByText("Series Countdown").locator("..").locator("..");
  await expect(countdown).toContainText("Chasing Sun(Sets)");
  await expect(countdown).toContainText("JULY 4TH OPEN-AIR EXPERIENCE");
  await expect(countdown).toContainText("July 4, 2026");
});
