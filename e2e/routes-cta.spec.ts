import { expect, test } from "@playwright/test";

const routeSamples = [
  "/",
  "/tickets",
  "/artists/lazare",
  "/sponsors",
  "/about",
  "/togetherness",
  "/chasing-sunsets",
  "/chasing-sunsets-facts",
  "/chasing-sunsets/season-ii",
  "/radio",
  "/radio/ep-01-benchek",
  "/story",
  "/untold-story/season-ii",
  "/untold-story-deron-juany-bravo",
  "/archive",
  "/insights",
  "/booking",
  "/submit",
  "/lineup",
  "/schedule",
  "/newsletter",
  "/contact",
  "/faq",
  "/partners",
  "/press",
  "/vip",
  "/travel",
  "/guide",
  "/shop",
  "/ambassadors",
  "/alerts",
  "/terms",
  "/privacy",
  "/cookies",
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
    const style = document.createElement('style');
    // More robust selectors for tailwind brackets, hiding blockers
    style.innerHTML = `
      [class*="z-[200]"], [class*="z-[60]"] { 
        display: none !important; 
        pointer-events: none !important; 
        visibility: hidden !important;
      }
    `;
    document.documentElement.appendChild(style);
  });
});

async function waitForAppReady(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000); // Cinematic transition buffer
}

async function expectValidRoute(page: import("@playwright/test").Page, pathname: string) {
  await page.goto(pathname, { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await page.waitForTimeout(150);

  const body = page.locator("body");
  await expect(body).not.toContainText("Gallery not found");
  await expect(body).not.toContainText("Episode Not Found");
  await expect(body).not.toContainText("This page doesn't exist.");
  await expect(body).toContainText(/\S+/);
}

for (const pathname of routeSamples) {
  test(`route loads cleanly: ${pathname}`, async ({ page }) => {
    await expectValidRoute(page, pathname);
  });
}

test("event banner chrome stays off ineligible routes", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await expect(page.getByLabel("Open tickets for current featured event")).toHaveCount(0);

  await page.goto("/press", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await expect(page.getByLabel("Open tickets for current featured event")).toHaveCount(0);
});

test("desktop nav CTA flows resolve to working destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  const nav = page.getByRole("navigation").first();

  await nav.getByRole("button", { name: /^events/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: "CHASING SUN(SETS)" })).toBeVisible();
  await page.getByRole("menuitem", { name: "CHASING SUN(SETS)" }).click({ force: true });
  await expect(page).toHaveURL(/\/chasing-sunsets$/);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await nav.getByRole("button", { name: /^radio \+ archive/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: "RADIO SHOW" })).toBeVisible();
  await page.getByRole("menuitem", { name: "RADIO SHOW" }).click({ force: true });
  await expect(page).toHaveURL(/\/radio$/);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await nav.getByRole("button", { name: /^radio \+ archive/i }).click({ force: true });
  await page.getByRole("menuitem", { name: "JOURNAL" }).click({ force: true });
  await expect(page).toHaveURL(/\/insights$/);
  await expect(page.getByRole("heading", { name: /news, notes, and event context/i })).toBeVisible();
});

test("community utility CTAs open the intended flows", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  const nav = page.getByRole("navigation").first();

  await nav.getByRole("button", { name: /^plan your night/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: /^inner circle/i })).toBeVisible();
  await page.getByRole("menuitem", { name: /^inner circle/i }).click({ force: true });
  await expect(page).toHaveURL(/\/newsletter$/);
  await expect(page.getByRole("heading", { name: /get monolith updates/i })).toBeVisible();

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await nav.getByRole("button", { name: /^events/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: /^entry guide/i })).toBeVisible();
  await page.getByRole("menuitem", { name: /^entry guide/i }).click({ force: true });
  await expect(page).toHaveURL(/\/guide/);
  await expect(page.getByRole("heading", { name: /the night of/i })).toBeVisible();
});
