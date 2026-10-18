import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const path of ["/", "/sunsets/"])
  for (const width of [360, 390, 430, 768, 1363]) {
    test(`postponement stays on the event card on ${path} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await expect(page.locator("dialog.event-notice")).toHaveCount(0);
      await expect(page.locator(".event-status-float")).toHaveCount(0);
      const notice = page.locator(
        path === "/"
          ? "#current-event .home-event-notice"
          : ".event-pass #event-status"
      );
      await expect(notice).toBeVisible();
      if (path === "/") await notice.locator("summary").click();
      await expect(notice).toContainText(/postponed/i);
      if (path === "/") {
        await expect(notice).toContainText("ticket purchases");
        await expect(notice).toContainText("30 days");
      }
      await expect(notice).not.toContainText(/10\.10|October 10/);
      const box = await notice.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      if ([390, 1363].includes(width)) {
        const axe = await new AxeBuilder({ page })
          .include(path === "/" ? ".home-event-notice" : "#event-status")
          .withTags(["wcag2a", "wcag2aa"])
          .analyze();
        expect(
          axe.violations.map(v => ({
            id: v.id,
            nodes: v.nodes.map(n => n.html),
          }))
        ).toEqual([]);
      }
      if (path === "/")
        await notice
          .getByRole("link", { name: /Ticket-holder information/i })
          .click();
      else await notice.getByRole("link", { name: /Event postponed/i }).click();
      await expect(page.locator("#event-update")).toBeVisible();
      await expect(page.locator("dialog.event-notice")).toHaveCount(0);
      await expect(page.locator("#event-update")).toContainText(
        "ticket purchases"
      );
    });
  }

test("ticket and event pages carry the approved status without first-access sales copy", async ({
  page,
}) => {
  await page.goto("/tickets");
  await expect(
    page.getByRole("heading", { name: "Postponed due to weather." })
  ).toBeVisible();
  await expect(page.locator("main")).not.toContainText("FIRST ACCESS OPEN");
  await expect(page.locator("main")).toContainText("30 days");
  await page.goto("/events/css-sep19");
  await expect(page.locator("main")).toContainText("POSTPONED");
  await expect(page.locator("main")).not.toContainText("COMING SOON");
  await expect(page).toHaveTitle(/Postponed/);
});
