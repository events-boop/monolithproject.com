import { test, expect } from "@playwright/test";
import hostedForms from "../shared/signup-forms.json" with { type: "json" };

for (const width of [320, 390, 768, 1440]) {
  test(`homepage network slides and signup at ${width}px`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 960 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#home-title")).toHaveText("MONOLITH");
    await expect(
      page.getByRole("button", { name: "Go to homepage", exact: true })
    ).toBeVisible();
    await expect(page.locator("dialog.event-notice")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Start homepage slides" })
    ).toBeVisible();
    for (const name of ["SUNSETS.FM", "Radio", "Monolith"]) {
      await page
        .getByRole("button", { name: `Show ${name} slide`, exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: `Show ${name} slide`, exact: true })
      ).toHaveAttribute("aria-current", "true");
      await page.locator(".home-carousel").scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(() => document.fonts.ready);
      const images = page.locator(".home-carousel img");
      for (const image of await images.all()) {
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate((el: HTMLImageElement) => el.naturalWidth)
        ).toBeGreaterThan(0);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
      await expect(page.locator(".home-carousel h1")).toHaveCount(1);
      await page.screenshot({
        path: testInfo.outputPath(`${name.replaceAll(".", "-")}-${width}.png`),
      });
    }
    await page
      .getByRole("button", { name: "Show SUNSETS.FM slide", exact: true })
      .click();
    await expect(
      page.getByRole("link", { name: /Watch Diplo live in Antarctica/ })
    ).toHaveAttribute("href", "https://www.youtube.com/watch?v=QtKGMfeyPUE");
    await expect(page.locator(".home-carousel iframe")).toHaveCount(0);
    await page.getByRole("link", { name: "Get launch updates" }).click();
    await expect(page.locator("#sunsets-fm-signup")).toBeInViewport();
    const signup = page.getByRole("link", { name: "Sign up for SUNSETS.FM" });
    await expect(signup).toHaveAttribute("href", hostedForms.radio);
    await expect(signup).toHaveAttribute("target", "_blank");
    await page
      .getByRole("button", { name: "Show Radio slide", exact: true })
      .click();
    await page.getByRole("link", { name: "Enter the listening room" }).click();
    await expect(page).toHaveURL(/\/radio#radio-featured$/);
    await expect(page.locator("#radio-featured")).toBeVisible();
    await expect(page.locator(".radio-cover-feature img")).toHaveAttribute(
      "src",
      /\/media\/chasing-radio\//
    );
    expect(errors).toEqual([]);
  });
}

test("homepage rotation can be paused, resumed, and stopped by keyboard focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Pause homepage slides" }).click();
  await expect(
    page.getByRole("button", { name: "Start homepage slides" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Start homepage slides" }).click();
  await expect(
    page.getByRole("button", { name: "Pause homepage slides" })
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Show Radio slide", exact: true })
    .focus();
  await expect(
    page.getByRole("button", { name: "Start homepage slides" })
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator(".home-radio-slide")).toBeVisible();
  await page.getByRole("button", { name: "Next homepage slide" }).click();
  await expect(page.locator("#home-title")).toBeVisible();
});

test("legacy event-notice markup never auto-opens; explicit requests still work", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    const node = document.createElement("div");
    node.innerHTML =
      '<button data-open-event-notice>Read event update</button><dialog class="event-notice" data-revision="test" data-auto-open="true"><button data-notice-close>Close update</button><p>Postponed event update</p></dialog>';
    document.body.append(node);
    const module = await import(/* @vite-ignore */ "/event-notice.js");
    module.mountEventNotice(node.querySelector("dialog"));
  });
  await page.waitForTimeout(700);
  await expect(page.locator("dialog.event-notice")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Read event update", exact: true })
    .click();
  await expect(page.locator("dialog.event-notice")).toBeVisible();
  await page.getByRole("button", { name: "Close update", exact: true }).click();
  await expect(page.locator("dialog.event-notice")).not.toBeVisible();
});

test("SUNSETS doorway uses launch signup and archive galleries have a page heading", async ({
  page,
}) => {
  await page.goto("/sunsets-fm");
  await expect(page.locator("main")).toContainText("Coming soon");
  await expect(
    page.getByRole("link", { name: "Get SUNSETS.FM launch updates" })
  ).toHaveAttribute("href", hostedForms.radio);
  await expect(
    page.getByRole("link", { name: "Explore the Open Network", exact: true })
  ).toHaveAttribute("href", "/open-network");
  await page.goto("/archive/autograf-march-21-2026");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Autograf");
  await page.goto("/#sunsets-fm-signup");
  await expect(page.locator("#sunsets-fm-signup")).toBeInViewport();
});
