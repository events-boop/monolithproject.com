import { test, expect } from "./fixtures/event-notice-dismissed";

for (const width of [360, 390, 430, 768, 1363]) {
  test(`artist discovery is readable and connected at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const section = page.locator("#showcase");
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await expect(section.getByRole("heading", { name: "Meet the artists." })).toBeVisible();
    const cards = section.locator("article");
    await expect(cards).toHaveCount(3);
    const ids = ["joezi", "massuma", "gene-farris"];
    for (let i = 0; i < 3; i++) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded();
      await expect(card.locator(".home-discovery-portrait")).toHaveAttribute("href", `/artists/${ids[i]}`);
      await expect(card.locator("img")).toBeVisible();
      await expect.poll(() => card.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      expect(await card.locator("img").evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.(webp|avif)/);
      await expect(card.locator(".home-discovery-listen")).toHaveAttribute("target", "_blank");
      await expect(card.locator(".home-discovery-status")).toHaveText(i < 2 ? "Postponed" : "Past appearance");
      await expect(card.locator(".home-discovery-appearance")).toHaveAttribute("href", i < 2 ? "/sunsets#event-update" : "/chasing-sunsets/sunsets-ii-2026");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await section.screenshot({ path: `/tmp/artist-discovery-${width}.png` });
  });
}

test("artist profiles and appearances resolve", async ({ page, request }) => {
  await page.goto("/");
  const links = await page.locator("#showcase a").evaluateAll(anchors => [...new Set(anchors.map(a => a.getAttribute("href")!))].filter(href => href.startsWith("/")));
  for (const link of links) {
    const response = await request.get(link.split("#")[0]);
    expect(response.ok(), link).toBe(true);
  }
  await page.locator(".home-discovery-appearance").first().click();
  await expect(page.locator("#event-update")).toBeVisible();
  await expect(page.locator("#event-update")).toContainText("postponed");
});
