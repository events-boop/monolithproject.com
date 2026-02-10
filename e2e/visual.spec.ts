import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded", "1");
  });
});

test("home visual baseline - desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 2200 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("home-desktop.png", {
    fullPage: true,
  });
});

test("home visual baseline - tablet", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 2200 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("home-tablet.png", {
    fullPage: true,
  });
});

test("home visual baseline - mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 2400 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveScreenshot("home-mobile.png", {
    fullPage: true,
  });
});

