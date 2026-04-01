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
  "/chasing-sunsets/season-2",
  "/radio",
  "/radio/ep-01-benchek",
  "/story",
  "/untold-story/season-2",
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

test("event banner only renders on eligible routes", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await expect(page.getByLabel("Open tickets for current featured event")).toBeVisible();

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
  await nav.getByRole("button", { name: /^artists/i }).click({ force: true });
  await expect(page.getByRole("menuitem", { name: "RADIO SESSIONS" })).toBeVisible();
  await page.getByRole("menuitem", { name: "RADIO SESSIONS" }).click({ force: true });
  await expect(page).toHaveURL(/\/radio$/);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  await nav.getByRole("link", { name: /^journal$/i }).click({ force: true });
  await expect(page).toHaveURL(/\/insights$/);
  await expect(page.getByRole("heading", { name: /insights that make the project feel built/i })).toBeVisible();
});

test("community utility CTAs open the intended flows", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await waitForAppReady(page);
  const communityMenu = page.getByRole("menu", { name: "Community links" });

  await page.getByRole("button", { name: /community/i }).click({ force: true });
  await expect(communityMenu).toBeVisible();
  await communityMenu.getByRole("menuitem", { name: /^inner circle/i }).click({ force: true });
  // Check the title in the drawer
  await expect(page.locator("h2, [role='heading']").filter({ hasText: "Stay On Signal" })).toBeVisible();
  await page.getByLabel("Close drawer").click({ force: true });

  await page.getByRole("button", { name: /community/i }).click({ force: true });
  await expect(communityMenu).toBeVisible();
  await communityMenu.getByRole("menuitem", { name: /^night guide/i }).click({ force: true });
  await expect(page.getByRole("heading", { name: "Arrival Intelligence" })).toBeVisible();
  await page.getByRole("link", { name: "Full Guide" }).click();
  await expect(page).toHaveURL(/\/guide$/);
  await expect(page.getByRole("heading", { name: /the night of/i })).toBeVisible();
});
