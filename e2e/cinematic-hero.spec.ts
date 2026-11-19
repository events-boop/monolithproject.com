import { test, expect } from "./fixtures/event-notice-dismissed";

for (const width of [320, 390, 430, 1363]) {
  test(`cinematic hero reserves the viewport and respects reduced motion at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#home-title")).toHaveText("MONOLITH");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".monolith-hero-photo video")).toHaveCount(0);
    const stage = await page.locator(".monolith-hero-stage").boundingBox();
    expect(stage!.height).toBeGreaterThanOrEqual(width < 640 ? 828 : 900);
    expect(stage!.width).toBe(width);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await expect(
      page.locator(".monolith-hero-photo img").first()
    ).toHaveJSProperty("complete", true);
    await expect(page.locator(".lg-portal-layer")).toBeVisible();
    await expect(page.locator(".lg-console-shell")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore Events" })
    ).toHaveAttribute("href", "/schedule");
    await expect(
      page.getByRole("button", { name: "Watch the Film" })
    ).toBeVisible();
  });
}

test("short landscape viewport grows without clipping copy, buttons, or console", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#home-title")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Events" })).toBeVisible();
  await expect(page.locator(".lg-console-shell")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  const titleBox = await page.locator("#home-title").boundingBox();
  const consoleBox = await page.locator(".lg-console-shell").boundingBox();
  expect(consoleBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height);
});

test("desktop film stays silent, reports real playback telemetry, and provides keyboard pause/play", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 12 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });
  await page.goto("/");
  const film = page.locator(".monolith-hero-photo video");
  await expect(film).toHaveJSProperty("muted", true);
  const pause = page.getByRole("button", { name: "Pause background film" });
  await expect(pause).toBeVisible({ timeout: 15000 });
  const timeText = await page.locator(".lg-media-time").textContent();
  expect(timeText).not.toContain("1:24");
  expect(timeText).toMatch(/^\d+:\d{2} \/ \d+:\d{2}$/);
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(film).toHaveJSProperty("paused", true);
  await page
    .getByRole("button", { name: "Play background film" })
    .press("Enter");
  await expect(film).toHaveJSProperty("paused", false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(film).toHaveCount(0);
});

test("carousel transitions left-to-right while persistent glass HUD and bottom console stay stationary", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("#home-title")).toHaveText("MONOLITH");

  // Record persistent interface geometry on Slide 1
  const consoleBefore = await page.locator(".lg-console-shell").boundingBox();
  const consoleStepBefore = await page
    .locator(".lg-console-step-count")
    .textContent();

  // Trigger manual advance to Slide 2 (Live Rooms — preserved existing hero)
  await page.getByRole("button", { name: "Next homepage slide" }).click();

  // Sample mid-transition: incoming enters from -100% toward 0, outgoing moves 0 toward +100%
  await page.waitForTimeout(260);
  const midState = await page.evaluate(() => {
    const entering = document.querySelector(".is-scene-entering-ltr");
    const exiting = document.querySelector(".is-scene-exiting-ltr");
    const parseTx = (el: Element | null) => {
      if (!el) return null;
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.m41;
    };
    return {
      enteringX: parseTx(entering),
      exitingX: parseTx(exiting),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
  expect(midState.enteringX).not.toBeNull();
  expect(midState.exitingX).not.toBeNull();
  expect(midState.enteringX!).toBeLessThan(0);
  expect(midState.exitingX!).toBeGreaterThan(0);
  expect(midState.scrollWidth).toBeLessThanOrEqual(midState.innerWidth);

  // Settle on Slide 2 (preserved existing hero)
  await page.waitForTimeout(1100);
  await expect(
    page.getByRole("button", { name: "Show Live Rooms slide", exact: true })
  ).toHaveAttribute("aria-current", "true");
  await expect(page.locator("#home-title")).toHaveText("MONOLITH");
  await expect(page.locator(".monolith-hero-tagline")).toContainText(
    "Lakefront days. Late-night dance floors."
  );
  // Portal and orbital arc belong only to Slide 1
  await expect(page.locator(".lg-portal-layer")).toHaveCount(0);

  // Persistent glass console did not jump, disappear, or reset its independent index
  const consoleAfter = await page.locator(".lg-console-shell").boundingBox();
  expect(Math.abs(consoleAfter!.y - consoleBefore!.y)).toBeLessThanOrEqual(2);
  expect(consoleAfter!.width).toBe(consoleBefore!.width);
  await expect(page.locator(".lg-console-step-count")).toHaveText(
    consoleStepBefore!
  );
});

test("bottom event console rotates independently without fabricated details and Watch the Film opens real media", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  // No invented California / Nov 14 / Tickets Live data anywhere in the hero
  const heroText = await page.locator(".home-carousel").innerText();
  expect(heroText).not.toContain("San Clemente");
  expect(heroText).not.toContain("Nov 14");
  expect(heroText).not.toContain("1:24");

  // Step through console announcements independently while main slide stays on Slide 01
  await expect(
    page.getByRole("button", { name: "Show Monolith slide", exact: true })
  ).toHaveAttribute("aria-current", "true");
  const initialCount = await page
    .locator(".lg-console-step-count")
    .textContent();
  await page
    .getByRole("button", { name: "Next event announcement" })
    .click();
  await expect(page.locator(".lg-console-step-count")).not.toHaveText(
    initialCount!
  );
  await expect(
    page.getByRole("button", { name: "Show Monolith slide", exact: true })
  ).toHaveAttribute("aria-current", "true");

  // Watch the Film opens real available Monolith live recording dialog and closes cleanly
  await page.getByRole("button", { name: "Watch the Film" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/9R6XH7JZlJI/
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});

test("homepage passes WCAG axe-core accessibility audit on Slide 1 and Slide 2", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#home-title")).toBeVisible();
  const slide1Axe = await new AxeBuilder({ page })
    .include(".home-carousel")
    .analyze();
  expect(slide1Axe.violations).toEqual([]);

  await page
    .getByRole("button", { name: "Show Live Rooms slide", exact: true })
    .click();
  await expect(page.locator("#home-title")).toBeVisible();
  const slide2Axe = await new AxeBuilder({ page })
    .include(".home-carousel")
    .analyze();
  expect(slide2Axe.violations).toEqual([]);
});
