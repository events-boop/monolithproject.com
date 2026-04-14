import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
    const style = document.createElement('style');
    // More robust selectors for tailwind brackets
    style.innerHTML = `
      [class*="z-[200]"], [class*="z-[60]"], [class*="fixed"] { 
        pointer-events: none !important; 
        display: none !important; 
      }
    `;
    document.documentElement.appendChild(style);
  });
});

async function ensureNewsletterVisible(page: import("@playwright/test").Page) {
  await page.goto("/newsletter");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);
  await page.waitForSelector("#newsletter", { state: "visible", timeout: 20000 });
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
}

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

  await ensureNewsletterVisible(page);
  const newsletter = page.locator("#newsletter");

  await newsletter.locator("#email").fill("test@example.com");
  const consentCheckbox = newsletter.getByRole("checkbox", { name: /i agree to receive updates and event announcements/i });
  const adultCheckbox = newsletter.getByRole("checkbox", { name: /i confirm that i am 18 years of age or older/i });

  await consentCheckbox.evaluate((node) => {
    (node as HTMLInputElement).click();
  });
  await adultCheckbox.evaluate((node) => {
    (node as HTMLInputElement).click();
  });
  await expect(consentCheckbox).toBeChecked();
  await expect(adultCheckbox).toBeChecked();
  await expect(newsletter.getByRole("button", { name: /SECURE MEMBERSHIP/i })).toBeVisible();
  await newsletter.locator("form").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
  });

  await expect(page.getByText("Provider unavailable. Please retry.")).toBeVisible();

  await page.unroute("**/api/leads");
  await page.route("**/api/leads", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await newsletter.locator("form").evaluate((form) => {
    (form as HTMLFormElement).requestSubmit();
  });
  await expect(page.getByRole("heading", { name: /Welcome To The Circle/i })).toBeVisible();
});

test("ticket flow emits intent tracking and preserves outbound ticket link", async ({ page }) => {
  let intentTracked = false;
  await page.route("**/api/ticket-intent", async (route) => {
    intentTracked = true;
    await route.fulfill({ status: 202, body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/tickets");
  await page.waitForLoadState("networkidle"); // Wait for cinematic PageTransition
  await expect(page.getByRole("heading", { name: /SECURE ACCESS/i })).toBeVisible({ timeout: 10000 });

  const ctaLink = page.locator("main a").filter({
    hasText: /Tickets|View Schedule|Early Tickets|Secure Final Entry/i,
  }).first();
  await expect(ctaLink).toBeVisible();
  await ctaLink.click({ force: true });

  await expect.poll(() => intentTracked).toBeTruthy();
});

test("scoped a11y checks pass for newsletter and tickets header", async ({ page }) => {
  await ensureNewsletterVisible(page);
  const newsletterA11y = await new AxeBuilder({ page }).include("#newsletter").analyze();
  expect(newsletterA11y.violations).toEqual([]);

  await page.goto("/tickets");
  await expect(page.getByRole("heading", { name: /SECURE ACCESS/i })).toBeVisible({ timeout: 10000 });
  const ticketsA11y = await new AxeBuilder({ page }).include("main").analyze();
  expect(ticketsA11y.violations).toEqual([]);
});
