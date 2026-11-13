import { test, expect } from "./fixtures/event-notice-dismissed";

for (const width of [390, 1363]) {
  test(`homepage events have clear purchase and announcement paths at ${width}px`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date("2026-09-19T12:00:00-05:00"));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?utm_source=instagram&utm_campaign=sep19");
    const section = page.locator("#schedule");
    await section.scrollIntoViewIfNeeded();
    const finale = section.locator('[data-event-id="css-sep19"]');
    await expect(finale.getByRole("heading")).toHaveText("JOEZI × MASSUMA");
    await expect(finale).toContainText("September 19, 2026");
    await expect(finale).toContainText("Castaways Beach Club");
    await expect(finale).toContainText("New date to be announced");
    await expect(finale).toContainText("POSTPONED");
    await expect(finale.locator(".home-show-action a")).toHaveCount(1);
    await expect(finale.locator(".home-show-action a")).toHaveAttribute(
      "href",
      "/sunsets"
    );
    // The October 10 date was removed; it must not come back as a pending card.
    await expect(section.locator('[data-event-id="css-oct10"]')).toHaveCount(
      0
    );
    await expect(section).not.toContainText("August 22");
    await expect(section).not.toContainText("LIVE");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await page.evaluate(() => document.fonts.ready);
    await section.screenshot({ path: `/tmp/monolith-upcoming-${width}.png` });
  });
}

test("postponed finale retains its update after the original date", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-09-20T03:01:00Z"));
  await page.goto("/");
  await expect(page.locator("#home-upcoming-title")).toBeVisible();
  await expect(page.locator(".home-event-strip, #current-event")).toHaveCount(
    2
  );
  await expect(
    page.locator('#schedule [data-event-id="css-sep19"]')
  ).toHaveCount(1);
  await expect(
    page.locator('#schedule [data-event-id="css-oct10"]')
  ).toHaveCount(0);
});
