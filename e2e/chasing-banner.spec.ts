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

  // On-sale era: the prelaunch "Next Event" countdown is replaced by the
  // live ticket state. (The top ticker is dismissed via sessionStorage in
  // beforeEach, so assert the in-page CTA.)
  await expect(
    page
      .locator("main")
      .getByRole("link", { name: /buy tickets — july 4/i })
      .first()
  ).toBeVisible();
});
