import { test, expect } from "./fixtures/event-notice-dismissed";

for (const width of [360, 390, 430, 768, 1363]) {
  test(`Chasing series guide and gallery at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/chasing-sunsets?utm_source=instagram&utm_campaign=sep19");
    await expect(page.locator("#chasing-hero-title img")).toHaveAttribute(
      "src",
      "/sunsets/assets/logo-640.webp"
    );
    await expect(page.locator("#current-event-title")).toContainText("MASSUMA");
    await expect(page.locator(".home-event-essentials")).toContainText(
      "New date to be announced"
    );
    await expect(page.locator(".home-event-lineup")).toContainText(
      "MVRCO × AVO · Erik · Sher · Jerome × Flare"
    );
    await expect(page.locator("#current-event .home-primary")).toHaveAttribute(
      "href",
      "/sunsets#event-status"
    );
    await expect(page.locator("main")).not.toContainText("Tables From $2,000");
    await expect(page.locator("main")).not.toContainText("Next: SUN(SETS) II");
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `/tmp/chasing-series-${width}-opening.png` });
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0
          )
        )
        .toBe(true);
    }
    const faq = page.getByText("What happens if it rains or plans change?", {
      exact: true,
    });
    await faq.scrollIntoViewIfNeeded();
    await faq.focus();
    await page.keyboard.press("Enter");
    await expect(faq.locator("..")).toHaveAttribute("open", "");
    await expect(faq.locator("..")).toContainText("ticket-holder instructions");
    await page.locator("#chasing-updates").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer .footer-mega-wordmark")).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await page.screenshot({
      path: `/tmp/chasing-series-${width}.png`,
      fullPage: true,
    });
  });
}

test("new homepage media and series archive destinations resolve", async ({
  page,
}) => {
  await page.goto("/");
  for (const img of await page
    .locator("#platform img, #featured img, .home-artist-photo img")
    .all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0
        )
      )
      .toBe(true);
  }
  await page.goto("/chasing-sunsets");
  const urls = await page
    .locator(".chasing-archive-card, .chasing-older-seasons a")
    .evaluateAll(els => els.map(el => el.getAttribute("href")!));
  for (const url of urls) {
    await page.goto(url);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Gallery not found");
  }
});
