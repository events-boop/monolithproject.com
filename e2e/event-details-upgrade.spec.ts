import { test, expect } from "./fixtures/event-notice-dismissed";

test("past event detail renders verified chapter receipt, set times, and venue dossier without calendar export", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/events/chasing-sunsets-july-4-2026");

  await expect(page.getByText("Verified Chapter Receipt")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /View Chapter Recap/i })
  ).toHaveAttribute("href", "/chasing-sunsets/sunsets-i-2026");

  await expect(
    page.getByRole("heading", { name: /Run Of Show & Set Times/i })
  ).toBeVisible();
  await expect(page.getByText("Doors / Event Begins")).toBeVisible();

  await expect(
    page.getByRole("heading", { name: /Historical Ticket Tiers/i })
  ).toBeVisible();
  await expect(page.getByText("1603 N Lake Shore Dr").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Maps/i })).toHaveAttribute(
    "href",
    /google\.com\/maps\/search/
  );
  await expect(
    page.getByRole("button", { name: /\.ics/i })
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: /Relive The Room/i })
  ).toBeVisible();
});

test("postponed event detail preserves venue intelligence and vip room link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/events/css-sep19");

  await expect(page.getByText("1603 N Lake Shore Dr").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /3D Room & VIP Map/i })
  ).toHaveAttribute("href", "/vip");
  await expect(
    page.getByRole("heading", { name: /Stay On The Signal/i })
  ).toBeVisible();
});

test("schedule surfaces 2026 season archive filter cleanly across mobile and desktop", async ({
  page,
}) => {
  for (const width of [390, 1363]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/schedule");

    await expect(
      page.getByRole("heading", { name: "2026 SEASON ARCHIVE" })
    ).toBeVisible();

    const archiveButton = page.locator('[data-schedule-filter="PAST"]');
    await archiveButton.click();
    await expect(page.locator('[data-event-id="css-sep19"]')).toHaveCount(0);
    await expect(page.locator('[data-event-id="css-jul04"]')).toHaveCount(1);

    await page.locator('[data-schedule-filter="ALL"]').click();
    await expect(page.locator('[data-event-id="css-sep19"]')).toHaveCount(1);
    await expect(page.locator('[data-event-id="css-jul04"]')).toHaveCount(1);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  }
});

