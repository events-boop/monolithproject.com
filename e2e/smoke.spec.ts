import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded", "1");
  });
});

test("newsletter flow shows user-visible error then success", async ({ page }) => {
  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error: { message: "Provider unavailable. Please retry." },
      }),
    });
  });

  await page.goto("/");
  await page.locator("#newsletter").scrollIntoViewIfNeeded();

  await page.fill("#email", "test@example.com");
  await page.check('input[type="checkbox"]');
  await page.getByRole("button", { name: /join newsletter list/i }).click();

  await expect(page.getByText("Provider unavailable. Please retry.")).toBeVisible();

  await page.unroute("**/api/leads");
  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.getByRole("button", { name: /join newsletter list/i }).click();
  await expect(page.getByRole("heading", { name: "YOU'RE IN" })).toBeVisible();
});

test("ticket flow emits intent tracking and preserves outbound ticket link", async ({ page }) => {
  let intentTracked = false;
  await page.route("**/api/ticket-intent", async (route) => {
    intentTracked = true;
    await route.fulfill({ status: 202, body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/tickets");
  await expect(page.getByRole("heading", { name: "GET TICKETS" })).toBeVisible();

  const ctaLink = page.locator(`a[href*="posh.vip"]`).first();
  await expect(ctaLink).toBeVisible();
  await page.getByRole("button", { name: /Get General Admission/i }).click();

  await expect.poll(() => intentTracked).toBeTruthy();
});

test("scoped a11y checks pass for newsletter and tickets header", async ({ page }) => {
  await page.goto("/");
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  const newsletterA11y = await new AxeBuilder({ page }).include("#newsletter").analyze();
  expect(newsletterA11y.violations).toEqual([]);

  await page.goto("/tickets");
  const ticketsA11y = await new AxeBuilder({ page }).include("section").analyze();
  expect(ticketsA11y.violations).toEqual([]);
});
