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

  const hero = page.locator("#chasing-hero");
  await expect(hero).toHaveAttribute("data-featured-event-id", /.+/);
  await expect(hero.locator("[data-chasing-episode='true']")).not.toBeEmpty();
  await expect(hero.locator("[data-chasing-meta='true']")).toBeVisible();

  // The campaign state can advance from first access to on-sale without
  // invalidating the mobile context contract. Assert the live conversion CTA
  // inside the featured hero instead of freezing a date or button label.
  await expect(
    hero.locator("a.cta-laylo, a.cta-posh, a.cta-fillout").first()
  ).toBeVisible();
});
