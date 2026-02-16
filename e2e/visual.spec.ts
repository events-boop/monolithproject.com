import { expect, test } from "@playwright/test";

test.describe("visual regression", () => {
  test.skip(process.env.VISUAL_TESTS !== "1", "Set VISUAL_TESTS=1 to run visual regression tests.");

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      sessionStorage.setItem("monolith-loaded", "1");
    });
  });

  async function waitForAppReady(page: import("@playwright/test").Page) {
    // The index.html loader is removed on window load.
    await page.waitForSelector("#initial-loader", { state: "detached", timeout: 15000 });
  }

  test("home hero - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForAppReady(page);

    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();

    await expect(hero).toHaveScreenshot("home-hero-desktop.png", {
      animations: "disabled",
      caret: "hide",
      mask: [page.getByTestId("hero-countdown")],
    });
  });

  test("home hero - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await waitForAppReady(page);

    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();

    await expect(hero).toHaveScreenshot("home-hero-mobile.png", {
      animations: "disabled",
      caret: "hide",
      mask: [page.getByTestId("hero-countdown")],
    });
  });

  test("chasing sunsets hero - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/chasing-sunsets", { waitUntil: "networkidle" });
    await waitForAppReady(page);

    const hero = page.locator("#chasing-hero");
    await expect(hero).toBeVisible();

    await expect(hero).toHaveScreenshot("chasing-hero-desktop.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("chasing sunsets hero - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/chasing-sunsets", { waitUntil: "networkidle" });
    await waitForAppReady(page);

    const hero = page.locator("#chasing-hero");
    await expect(hero).toBeVisible();

    await expect(hero).toHaveScreenshot("chasing-hero-mobile.png", {
      animations: "disabled",
      caret: "hide",
    });
  });
});

