import { test, expect } from "./fixtures/event-notice-dismissed";
import { readFileSync } from "node:fs";
const ticketPolicy = JSON.parse(
  readFileSync(
    new URL("../shared/events/ticket-policy.json", import.meta.url),
    "utf8"
  )
);
const policy = ticketPolicy.salesFinal + " " + ticketPolicy.sunsetsRefund;
for (const path of ["/faq", "/terms", "/chasing-sunsets", "/untold-story"]) {
  test(`ticket policy is consistent on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    if (path === "/chasing-sunsets" || path === "/untold-story") {
      const item = page
        .locator("details")
        .filter({ hasText: "What is the ticket refund policy?" });
      await item.locator("summary").click();
      await expect(item).toContainText(policy);
    } else
      await expect(
        page.getByText(policy, { exact: true }).first()
      ).toBeVisible();
    await expect(page.locator("body")).not.toContainText(
      "full refunds will be issued automatically"
    );
    if (path === "/faq") {
      await expect(page.locator("#ticket-policy")).toContainText(
        "ticket purchases will be honored"
      );
      await expect(
        page.locator('#ticket-policy a[href="/sunsets#weather"]')
      ).toBeVisible();
      await page.screenshot({
        path: "/tmp/monolith-policy-faq-mobile.png",
        fullPage: true,
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  });
}
for (const width of [390, 1363]) {
  test(`month-only calendar announcements stay honest and ordered at ${width}px`, async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date("2026-09-21T12:00:00Z"));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const events = [
      {
        id: "october-day",
        date: "October 10, 2026",
        confirmationStatus: "pending",
      },
      { id: "september-month", date: "September 2026" },
      { id: "october-month", date: "October 2026" },
      {
        id: "september-day",
        date: "September 26, 2026",
        confirmationStatus: "pending",
      },
    ].map(item => ({
      title: item.id,
      series: "untold-story",
      episode: "II",
      time: "10 PM",
      venue: "TBA",
      location: "Chicago",
      status: "coming-soon",
      ...item,
    }));
    await page.route("**/api/site-data**", route =>
      route.fulfill({ json: { path: "/schedule", events, featuredEvents: {} } })
    );
    await page.goto("/schedule");
    await expect(page.locator('[data-event-id="september-month"]')).toHaveCount(
      1
    );
    await expect(page.locator("[data-calendar-month]")).toHaveText([
      "SEPTEMBER 2026",
      "OCTOBER 2026",
      "DATES TO BE ANNOUNCED",
    ]);
    expect(
      await page
        .locator("[data-event-id]")
        .evaluateAll(items =>
          items.map(item => item.getAttribute("data-event-id"))
        )
    ).toEqual([
      "september-month",
      "october-month",
      "october-day",
      "september-day",
    ]);
    const month = page.locator('[data-event-id="september-month"]');
    await expect(month).toContainText("Sep 2026");
    await expect(month).toContainText("Date / time to be confirmed");
    await expect(
      month.getByRole("button", { name: "Calendar unavailable", exact: true })
    ).toBeDisabled();
    await page.locator('[data-schedule-filter="OCTOBER"]').click();
    await expect(page.locator("[data-event-id]")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  });
}
