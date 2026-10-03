import { test, expect } from "@playwright/test";

test("artist search works with series filters and recovers from no results", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/artists");
  const search = page.getByRole("searchbox", { name: "Search artists" });
  await search.fill("gene farris");
  await expect(
    page.getByRole("heading", { name: "GENE FARRIS", exact: true })
  ).toBeVisible();
  await expect(page.locator("section article")).toHaveCount(1);
  await page.getByRole("button", { name: "Untold Story", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No artists found." })
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all artists" }).click();
  await expect(search).toHaveValue("");
  await expect(
    page.getByRole("button", { name: "All", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator("section article").count()).toBeGreaterThan(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
});

test("mobile footer keeps navigation reachable through disclosures", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await page.evaluate(() =>
    scrollTo({ top: document.body.scrollHeight, behavior: "instant" })
  );
  const footer = page.locator("footer.site-footer-refined");
  await expect(footer).toBeVisible();
  const group = footer
    .locator("details")
    .filter({ has: page.locator("summary").filter({ hasText: "Explore" }) });
  await expect(group).not.toHaveAttribute("open", "");
  await group.locator("summary").click();
  await expect(
    group.getByRole("link", { name: "Artists", exact: true })
  ).toBeVisible();
  await group.getByRole("link", { name: "Artists", exact: true }).click();
  await expect(
    page.getByRole("searchbox", { name: "Search artists" })
  ).toBeVisible();
});

test("audio initializes only when requested", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://w.soundcloud.com/player/**", route =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Player preview</body></html>",
    })
  );
  await page.goto("/radio/ep-01-benchek");
  await expect(page.locator('iframe[src*="soundcloud"]')).toHaveCount(0);
  await page.getByRole("button", { name: /Load the player/ }).click();
  await expect(page.locator('iframe[src*="soundcloud"]')).toHaveCount(1);
});

test("phone homepage uses the mobile hero and keeps refund requests distinct from submissions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator(".monolith-hero-photo img");
  await expect
    .poll(() => hero.evaluate((img: HTMLImageElement) => img.currentSrc))
    .toMatch(/monolith-crowd-hero-mobile-v2-(480|720)\.(avif|webp)$/);
  await expect(page.locator(".monolith-hero-photo video")).toHaveCount(0);
  const help = page.locator("#current-event .home-show-support");
  await help.locator("summary").click();
  await expect(help).toContainText("That window has not started");
  await expect(
    help.getByRole("link", { name: /Request a refund/ })
  ).toHaveAttribute("href", /^mailto:events@monolithproject.com\?subject=/);
  await expect(help).toContainText("Opens an email draft");
  await expect(page.locator("dialog.event-notice")).toHaveCount(0);
});

test("pending show details do not advertise a provisional date", async ({
  page,
}) => {
  await page.goto("/events/css-oct10");
  await expect(page.locator("body")).not.toContainText("October 10");
  await expect(page.locator("body")).toContainText("Date to be announced");
  await expect(page).toHaveTitle(/Details to be announced/);
});
