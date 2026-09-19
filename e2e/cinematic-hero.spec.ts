import { test, expect } from "./fixtures/event-notice-dismissed";

for (const width of [390, 1363]) {
  test(`cinematic hero reserves the viewport and respects reduced motion at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#home-title")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".monolith-hero-photo video")).toHaveCount(0);
    const stage = await page.locator(".monolith-hero-stage").boundingBox();
    expect(stage!.height).toBeGreaterThanOrEqual(width < 640 ? 828 : 900);
    expect(stage!.width).toBe(width);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await expect(page.locator(".monolith-hero-photo img")).toHaveJSProperty(
      "complete",
      true
    );
    await page.screenshot({ path: `/tmp/monolith-cinematic-${width}.png` });
  });
}
test("desktop film stays silent and provides keyboard pause/play", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 12 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });
  await page.goto("/");
  const film = page.locator(".monolith-hero-photo video");
  await expect(film).toHaveJSProperty("muted", true);
  const pause = page.getByRole("button", { name: "Pause background film" });
  await expect(pause).toBeVisible({ timeout: 15000 });
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(film).toHaveJSProperty("paused", true);
  await page
    .getByRole("button", { name: "Play background film" })
    .press("Enter");
  await expect(film).toHaveJSProperty("paused", false);
  await page.screenshot({ path: "/tmp/monolith-cinematic-film.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(film).toHaveCount(0);
});
