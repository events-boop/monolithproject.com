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
  "/untold-story",
  "/untold-story/season-ii",
  "/untold-story-deron-juany-bravo",
  "/archive",
  "/insights",
  "/booking",
  "/submit",
  "/lineup",
  "/schedule",
  "/events",
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
  await expect
    .poll(async () => (await body.innerText()).trim().length, { timeout: 10000 })
    .toBeGreaterThan(0);
  await expect(body).not.toContainText("Gallery not found");
  await expect(body).not.toContainText("Episode Not Found");
  await expect(body).not.toContainText("This page doesn't exist.");
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

  await nav.getByRole("button", { name: /^shows/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: "CHASING SUN(SETS)" })).toBeVisible();
  await page.getByRole("menuitem", { name: "CHASING SUN(SETS)" }).click({ force: true });
  await expect(page).toHaveURL(/\/chasing-sunsets$/);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await nav.getByRole("button", { name: /^radio/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: "THE SHOW" })).toBeVisible();
  await page.getByRole("menuitem", { name: "THE SHOW" }).click({ force: true });
  await expect(page).toHaveURL(/\/radio$/);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await nav.getByRole("button", { name: /^partners/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: "PARTNER WITH US" })).toBeVisible();
  await page.getByRole("menuitem", { name: "PARTNER WITH US" }).click({ force: true });
  await expect(page).toHaveURL(/\/partners$/);
  await expect(page.getByRole("heading", { name: /partners & crew/i })).toBeVisible();
});

test("community utility CTAs open the intended flows", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  const nav = page.getByRole("navigation").first();

  await nav.getByRole("button", { name: /^shows/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: /^upcoming shows/i })).toBeVisible();
  await page.getByRole("menuitem", { name: /^upcoming shows/i }).click({ force: true });
  await expect(page).toHaveURL(/\/schedule$/);
  await expect(page.getByRole("heading", { name: /upcoming shows/i })).toBeVisible();

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await nav.getByRole("button", { name: /^partners/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: /^partner with us/i })).toBeVisible();
  await page.getByRole("menuitem", { name: /^partner with us/i }).click({ force: true });
  await expect(page).toHaveURL(/\/partners$/);
  await expect(page.getByRole("heading", { name: /partners & crew/i })).toBeVisible();
});
