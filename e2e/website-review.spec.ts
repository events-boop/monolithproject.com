import { test, expect } from "./fixtures/event-notice-dismissed";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 1363])
  test(`accessible venue inquiry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/partners");
    const trigger = page
      .getByRole("button", { name: /Start Conversation/i })
      .first();
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: /Host The Project/i });
    await expect(dialog).toBeVisible();
    for (const name of [
      "Full Name",
      "Email Address",
      "Venue / Property",
      "City / Neighborhood",
      "Venue Notes",
    ])
      await expect(dialog.getByLabel(name, { exact: false })).toBeVisible();
    const close = dialog.getByRole("button", { name: "Close inquiry portal" });
    const box = await close.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(
      await close.evaluate(el => {
        const r = el.getBoundingClientRect();
        return el.contains(
          document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
        );
      })
    ).toBe(true);
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate(el => el.contains(document.activeElement))
      ).toBe(true);
    }
    const axe = await new AxeBuilder({ page })
      .include("dialog")
      .withRules(["label", "aria-dialog-name", "color-contrast"])
      .analyze();
    expect(axe.violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))}))).toEqual([]);
    await page.screenshot({ path: `/tmp/monolith-inquiry-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
for (const path of ["/", "/schedule", "/events/css-sep19", "/contact"])
  test(`single metadata owner for ${path}`, async ({ page, request }) => {
    const response = await request.get(path);
    const html = await response.text();
    expect((html.match(/name="description"/g) || []).length).toBe(1);
    expect((html.match(/rel="canonical"/g) || []).length).toBe(1);
    await page.goto(path);
    await expect(page.locator("nav").first()).toBeVisible();
    await expect(page.locator('head meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('head meta[property="og:title"]')).toHaveCount(1);
    await expect(
      page.locator('head meta[property="og:description"]')
    ).toHaveCount(1);
    await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://monolithproject.com${path}`
    );
  });
test("contact contrast and mobile overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");
  await expect(
    page.getByRole("heading", { name: "CONTACT", exact: true })
  ).toBeVisible();
  const axe = await new AxeBuilder({ page })
    .include("main")
    .withRules(["color-contrast"])
    .analyze();
  expect(
    axe.violations.map(v => ({ id: v.id, html: v.nodes.map(n => n.html) }))
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await page.screenshot({ path: "/tmp/monolith-contact-390.png" });
});
test("mobile navigation starts with visitor destinations", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /Open.*menu/i }).click();
  await expect(
    page.getByRole("navigation", { name: "Main pages" })
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Main pages" }).getByRole("link")
  ).toHaveText([
    "Events / Tickets",
    "Sun(Sets)",
    "Untold Story",
    "Radio",
    "About",
  ]);
});
