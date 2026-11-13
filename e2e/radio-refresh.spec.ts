import { test, expect } from "@playwright/test";

test("radio archive keeps its layout and readable new covers at mobile and desktop widths", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    await page.goto("/radio");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "CHASING SUNSETS RADIO"
    );
    await expect(
      page.getByRole("button", { name: "Go to homepage", exact: true })
    ).toBeVisible();
    await expect(page.locator(".radio-powered-by")).toHaveText(
      "powered by sunsets.fm"
    );
    await expect(
      page.getByRole("link", {
        name: "Explore the Open Network →",
        exact: true,
      })
    ).toHaveAttribute("href", "/open-network");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://monolithproject.com/radio"
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: testInfo.outputPath(`radio-hero-${width}.png`),
    });
    await page
      .locator(".radio-cover-feature")
      .screenshot({ path: testInfo.outputPath(`radio-cover-${width}.png`) });
    await page
      .locator("#radio-archive")
      .evaluate(el =>
        el.scrollIntoView({ block: "start", behavior: "instant" })
      );
    await page.waitForTimeout(800);
    const covers = page.locator("#radio-archive article img");
    await expect(covers).toHaveCount(6);
    for (const cover of await covers.all()) {
      await cover.scrollIntoViewIfNeeded();
      await expect(cover).toHaveAttribute("src", /\/media\/chasing-radio\//);
      await expect
        .poll(() =>
          cover.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0
          )
        )
        .toBe(true);
      expect(await cover.evaluate(img => getComputedStyle(img).objectFit)).toBe(
        "contain"
      );
    }
    await page
      .locator("#radio-archive")
      .evaluate(el =>
        el.scrollIntoView({ block: "start", behavior: "instant" })
      );
    await page.waitForTimeout(800);
    await page.screenshot({
      path: testInfo.outputPath(`radio-archive-${width}.png`),
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await expect(page.locator("dialog.event-notice[open]")).toHaveCount(0);
    await expect(page.locator("#radio-map")).toBeAttached();
    await expect(page.locator("#radio-faq")).toBeAttached();
  }
  expect(errors).toEqual([]);
});

test("filtering and loading a recording preserves the selection until the listener changes it", async ({
  page,
}) => {
  await page.route("https://w.soundcloud.com/player/**", route =>
    route.fulfill({
      body: "<button>SoundCloud play</button>",
      contentType: "text/html",
    })
  );
  await page.goto("/radio#radio-archive");
  await page
    .getByRole("button", { name: "Late-Night Bridges", exact: true })
    .click();
  await expect(page.locator("#radio-archive article")).toHaveCount(2);
  await page
    .locator("#radio-archive article")
    .first()
    .getByRole("button", { name: "Load In Deck" })
    .click();
  await page.getByRole("button", { name: /Load the player/ }).click();
  const frame = page.locator(".radio-playback iframe");
  await expect(frame).toHaveAttribute(
    "src",
    /radian-x-chasing-sunsets-chapter-ii-x-no-sleep/
  );
  const recording = await frame.getAttribute("src");
  await page.waitForTimeout(7500);
  await expect(frame).toHaveAttribute("src", recording!);
  await page.getByRole("button", { name: "Sunset Cuts", exact: true }).click();
  await expect(page.locator("#radio-archive article")).toHaveCount(4);
  await page
    .locator("#radio-archive article")
    .first()
    .getByRole("button", { name: "Load In Deck" })
    .click();
  await expect(frame).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Load the player/ })
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explore the Open Network →", exact: true })
    .click();
  await expect(page).toHaveURL(/\/open-network$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Find your frequency"
  );
});
