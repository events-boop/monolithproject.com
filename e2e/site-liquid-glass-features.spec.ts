import { expect, test } from "@playwright/test";

test.describe("Liquid-Glass Site Design Pass & 5 Discovery Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("monolith_cookie_consent", "declined");
      window.sessionStorage.setItem("monolith-loaded-v2", "1");
    });

    await page.route("https://w.soundcloud.com/player/**", async route => {
      const reqUrl = route.request().url();
      if (reqUrl.includes("api.js")) {
        await route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: 'window.SC = { Widget: Object.assign(function(){ return { bind:function(){}, play:function(){}, pause:function(){}, getPosition:function(cb){cb(30000);} }; }, { Events: { READY: "ready", PLAY: "play", PAUSE: "pause", FINISH: "finish" } }) };',
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: '<!doctype html><html><body style="background:#0c0a09;margin:0"></body></html>',
      });
    });
  });

  test("⌘K Sonic Command Palette searches artists & radio sets and launches Liquid-Glass Sticky Audio Dock", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Trigger via header search button
    const searchBtn = page.locator("[data-nav-search-trigger]");
    await expect(searchBtn).toBeVisible();
    await searchBtn.click();

    const palette = page.locator("[data-sonic-command-palette]");
    await expect(palette).toBeVisible();

    const input = palette.locator("input");
    await input.fill("benchek");

    await expect(palette).toContainText("Chasing Sunsets Radio — Play in Deck");
    await expect(palette).toContainText("Artists Roster (32)");

    // Select first radio item -> plays in persistent Liquid-Glass Audio Dock
    await palette.locator("[cmdk-item]").first().click();
    await expect(palette).toBeHidden();

    const dock = page.locator("[data-sticky-audio-dock]");
    await expect(dock).toBeVisible();
    await expect(dock).toContainText(/BENCHEK/i);

    // Save episode directly from dock and verify Saved Passport badge updates
    const saveEpisodeBtn = dock.getByRole("button", {
      name: /save episode|remove episode/i,
    });
    await saveEpisodeBtn.click();
    await expect(page.locator("[data-nav-saved-trigger]")).toContainText("1");
  });

  test("Artist Dossier Sonic Lineage plays in deck, saves artist, and opens Your Monolith List drawer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/artists/benchek", { waitUntil: "domcontentloaded" });

    const playInDeckBtn = page.getByRole("button", { name: /play in deck/i });
    await expect(playInDeckBtn).toBeVisible();
    await playInDeckBtn.click();

    await expect(page.locator("[data-sticky-audio-dock]")).toBeVisible();

    const saveArtistBtn = page.getByRole("button", {
      name: /save benchek/i,
    });
    await saveArtistBtn.click();

    // Open Saved Passport Drawer via header bookmark button
    await page.locator("[data-nav-saved-trigger]").click();
    const drawer = page.locator('[data-offcanvas-drawer="saved"]');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText("Your Monolith List");
    await expect(drawer).toContainText("BENCHEK");
  });

  test("Chicago Room & Arrival Concierge switches rooms cleanly on /guide", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/guide", { waitUntil: "domcontentloaded" });

    const concierge = page.locator("[data-room-concierge]");
    await expect(concierge).toBeVisible();
    await expect(concierge).toContainText("Castaways Beach Club");

    await concierge.getByRole("tab", { name: /West Loop/i }).click();
    await expect(concierge).toContainText("Hideaway & West Loop Rooms");
    await expect(concierge).toContainText("W Randolph St");

    await concierge.getByRole("tab", { name: /Kashmir/i }).click();
    await expect(concierge).toContainText("Kashmir Chicago");
    await expect(concierge).toContainText("W Randolph St");
  });
});
