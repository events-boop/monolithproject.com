import { test, expect } from "./fixtures/event-notice-dismissed";

for (const width of [360, 390, 430, 768, 1363]) {
  test(`Monolith homepage carries approved event details at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#home-title")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const featured = page.locator("#current-event");
    await expect(featured.locator("h3")).toContainText("MASSUMA");
    await expect(featured.locator(".home-show-details")).toContainText(
      "New date to be announced"
    );
    await expect(featured.locator(".home-show-lineup").first()).toContainText(
      "MVRCO × AVO · Erik · Sher · Jerome × Flare"
    );
    await expect(featured.locator(".event-status-badge")).toContainText(
      "POSTPONED"
    );
    await expect(
      featured.getByRole("link", { name: /ticket-holder update/i })
    ).toHaveAttribute("href", "/tickets");
    await expect(
      page.getByRole("link", { name: "Buy Tickets — August 22", exact: true })
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    const heading = await page
      .locator("[data-home-hero-heading]")
      .boundingBox();
    const featuredBox = await featured.boundingBox();
    expect(featuredBox!.y).toBeGreaterThan(heading!.y + heading!.height - 1);
    await page.screenshot({ path: `/tmp/monolith-home-${width}-opening.png` });
    await page.locator("#current-event").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/monolith-home-${width}-event.png` });
    await page.locator("#community").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: `/tmp/monolith-home-${width}.png`,
      fullPage: true,
    });
  });
}

test("homepage checkout keeps campaign taxonomy and excludes personal fields", async ({
  page,
}) => {
  await page.goto(
    "/?utm_source=instagram&utm_medium=paid_social&utm_campaign=sep19&utm_content=fan%40example.com&email=fan%40example.com&phone=3125551234"
  );
  const link = page.locator("#current-event .home-secondary");
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/tickets");
  await expect(page.locator('a[href*="allevents.in"]')).toHaveCount(0);
});
