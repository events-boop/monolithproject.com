import { test, expect } from "@playwright/test";
import episodes from "../client/src/data/openNetworkEpisodes.json" with { type: "json" };

test.beforeEach(async ({ page }) => {
  // Provider contracts are deterministic here; live availability is checked separately.
  await page.route("https://w.soundcloud.com/player/**", route =>
    route.fulfill({
      body: "<button>SoundCloud play</button>",
      contentType: "text/html",
    })
  );
  await page.route("https://www.mixcloud.com/widget/iframe/**", route =>
    route.fulfill({
      body: "<button>Mixcloud play</button>",
      contentType: "text/html",
    })
  );
  await page.route("https://w.soundcloud.com/player/api.js", route =>
    route.fulfill({
      contentType: "application/javascript",
      body: `window.SC={Widget:Object.assign(function(frame){const callbacks={};return {bind(name,fn){callbacks[name]=fn;if(name==='ready')setTimeout(fn,0)},unbind(name){if(!frame.isConnected)throw new Error('Widget cleanup requires a connected iframe');delete callbacks[name]},play(){callbacks.play?.()},pause(){callbacks.pause?.()},seekTo(ms){frame.dataset.seek=String(ms)}}},{Events:{READY:'ready',PLAY:'play',PAUSE:'pause',FINISH:'finish',ERROR:'error'}})};`,
    })
  );
});

test("Monolith shell, connection story and responsive cover layouts", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/radio");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Find your frequency"
    );
    await expect(
      page.getByRole("button", { name: "Go to homepage", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Monolith Project", exact: true })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://monolithproject.com/radio"
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath(`hero-${width}.png`) });
    await page.locator("#monolith-connection").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: testInfo.outputPath(`connection-${width}.png`),
    });
    await page.locator("#listening-room").scrollIntoViewIfNeeded();
    await expect(page.locator(".feature-sleeve img")).toHaveJSProperty(
      "complete",
      true
    );
    expect(
      await page
        .locator(".feature-sleeve img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth)
    ).toBeGreaterThan(100);
    expect(
      await page
        .locator(".feature-sleeve img")
        .evaluate(img => getComputedStyle(img).objectFit)
    ).toBe("contain");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBeTruthy();
    await page.screenshot({ path: testInfo.outputPath(`radio-${width}.png`) });
    await expect(page.locator(".monolith-network iframe")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test("search, artist tabs, all three series and one active player", async ({
  page,
}) => {
  await page.goto("/radio");
  await page.getByRole("button", { name: /Play SOMMERS.*Episode 011/ }).click();
  await expect(page.locator(".embed-slot iframe")).toHaveAttribute(
    "src",
    new RegExp(encodeURIComponent(episodes[0].source))
  );
  await page.getByRole("button", { name: "Stop radio playback" }).click();
  await expect(page.locator(".monolith-network iframe")).toHaveCount(0);
  await page.getByRole("tab", { name: "The episode" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /The artist/ })).toBeFocused();
  await expect(page.locator("#artist-panel")).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search radio episodes" })
    .fill("no-matching-recording");
  await expect(page.getByText("No episodes found.")).toBeVisible();
  await page.getByRole("button", { name: "Clear your search" }).click();
  await expect(page.locator(".radio-sleeve")).toHaveCount(13);
  for (const [series, count] of [
    ["Karma Karma Radio", 41],
    ["Drumcode Radio", 67],
  ] as const) {
    await page
      .getByRole("button", { name: new RegExp(`${series}.*mixes`) })
      .click();
    await expect(page.locator(".radio-sleeve")).toHaveCount(count);
    await page.locator(".episode-play").click();
    await expect(page.locator(".embed-slot iframe")).toHaveCount(1);
    const frame = page.locator(".embed-slot iframe");
    await expect(frame).toHaveAttribute(
      "src",
      series === "Drumcode Radio" ? /mixcloud\.com/ : /soundcloud\.com/
    );
  }
  await page.getByRole("button", { name: /Science Fiction at 4:50/ }).click();
  await expect(page.locator(".embed-slot iframe")).toHaveCount(0);
  await expect(page.locator(".featured-audio-player iframe")).toHaveAttribute(
    "data-seek",
    "290000"
  );
  await expect(page.locator(".monolith-network iframe")).toHaveCount(1);
  await page.locator(".episode-play").click();
  await expect(page.locator(".featured-audio-player iframe")).toHaveCount(0);
  await expect(page.locator(".embed-slot iframe")).toHaveCount(1);
  await page.getByRole("link", { name: "Meet Monolith" }).click();
  await expect(page).toHaveURL(/\/about/);
  await expect(page.locator(".monolith-network iframe")).toHaveCount(0);
});

test("series deep links and every recording cover resolve locally", async ({
  page,
  request,
}) => {
  await page.goto("/radio?series=karma-karma#radio");
  await expect(page.locator(".radio-profile h3")).toHaveText("Shimza");
  await expect(page.locator(".radio-sleeve")).toHaveCount(41);
  for (const episode of episodes) {
    expect(episode.image).toMatch(
      episode.collection === "chasing"
        ? /^\/media\/chasing-radio\//
        : /^\/media\/open-network\/covers\//
    );
    for (const image of new Set(
      [episode.image, episode.imageSmall].filter(Boolean)
    )) {
      const response = await request.get(image!);
      expect(response.ok(), episode.id).toBeTruthy();
      expect(response.headers()["content-type"]).toContain("image/webp");
    }
  }
});

test("temporary provider errors preserve the original recording and stop control", async ({
  page,
}) => {
  await page.route("https://w.soundcloud.com/player/api.js", route =>
    route.fulfill({
      contentType: "application/javascript",
      body: `window.SC={Widget:Object.assign(function(){return {bind(name,fn){if(name==='error')setTimeout(fn,0)},unbind(){},play(){},pause(){},seekTo(){}}},{Events:{READY:'ready',PLAY:'play',PAUSE:'pause',FINISH:'finish',ERROR:'error'}})};`,
    })
  );
  await page.goto("/radio");
  await page.getByRole("button", { name: /Science Fiction at 4:50/ }).click();
  await expect(page.getByRole("alert")).toContainText("could not play");
  await expect(
    page.getByRole("alert").getByRole("link", { name: "Original recording" })
  ).toHaveAttribute(
    "href",
    "https://soundcloud.com/rawcutstv/brunello-b2b-rafael-february#t=4:50"
  );
  await page
    .getByRole("button", { name: "Stop featured set playback" })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Play Rafael B2B Brunello — Santa Monica Pier | RAW CUTS",
      exact: true,
    })
  ).toBeFocused();
  await expect(page.locator(".monolith-network iframe")).toHaveCount(0);
});
