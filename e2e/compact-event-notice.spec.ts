import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1363]) {
  test(`event update stays on its card without a global banner at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of ["/", "/schedule"]) {
      await page.goto(route);
      await expect(page.locator(".nav-event-update")).toHaveCount(0);
      await expect(page.locator(".event-status-float")).toHaveCount(0);
      await expect(page.locator("dialog.event-notice")).toHaveCount(0);
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        bottomSpace: parseFloat(getComputedStyle(document.body).paddingBottom),
      }));
      expect(metrics.overflow).toBe(false);
      expect(metrics.bottomSpace).toBe(0);
      if (route === "/") {
        const notice = page.locator("#current-event .home-event-notice");
        await expect(notice).toContainText(/postponed/i);
        await notice.locator("summary").click();
        await notice
          .getByRole("link", { name: /Ticket-holder information/i })
          .click();
        await expect(page.locator("#event-update")).toBeVisible();
        await expect(page.locator("dialog.event-notice")).toHaveCount(0);
      }
    }
  });
}
