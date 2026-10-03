import { test, expect } from "./fixtures/event-notice-dismissed";
for (const width of [320, 390, 768, 1363]) {
  test(`calendar presents actionable show information at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/schedule");
    await expect(
      page.getByRole("heading", { name: "Find your next night." })
    ).toBeVisible();
    const event = page.locator('[data-event-id="css-sep19"]');
    await expect(event).toContainText("Original date");
    await expect(event).toContainText("Postponed");
    await expect(
      event.getByRole("button", { name: "Calendar unavailable" })
    ).toBeDisabled();
    await expect(
      event.locator('a[href*="allevents.in"], a[href*="/go/tickets/"]')
    ).toHaveCount(0);
    await event.locator("summary").click();
    await expect(event).toContainText("30 days");
    await event.getByRole("button", { name: /Save/ }).click();
    await page.getByRole("button", { name: "Saved", exact: true }).click();
    await expect(page.locator("[data-event-id]")).toHaveCount(1);
    await page.reload();
    await page.getByRole("button", { name: "Saved", exact: true }).click();
    await expect(event).toBeVisible();
    await event.getByRole("button", { name: /Remove/ }).click();
    await expect(page.locator("[data-event-id]")).toHaveCount(0);
    await expect(page.getByText("Your next nights, saved.")).toBeVisible();
    await page.getByRole("button", { name: "All shows", exact: true }).click();
    await expect(page.locator('[data-event-id="css-oct10"]')).toContainText(
      "Date TBA"
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  });
}
