import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function useEvents(
  page: import("@playwright/test").Page,
  events: object[]
) {
  await page.route("**/api/site-data?**", route => {
    const path =
      new URL(route.request().url()).searchParams.get("path") || "/story";
    return route.fulfill({ json: { path, events, featuredEvents: {} } });
  });
}

for (const width of [320, 390, 768, 1363]) {
  test(`Untold shares the Sunsets series layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await useEvents(page, []);
    await page.goto("/story");
    await expect(
      page.locator(".untold-series-page .chasing-series-hero")
    ).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("#untold-event")).toContainText(
      "The next night starts here."
    );
    await expect(page.locator("#untold-event")).not.toContainText(
      "Tickets on sale"
    );
    const sections = page.getByRole("navigation", {
      name: "Untold Story sections",
    });
    const hrefs = await sections
      .locator("a")
      .evaluateAll(links => links.map(link => link.getAttribute("href")));
    expect(hrefs).toEqual([
      "#untold-event",
      "#untold-room",
      "#untold-sound",
      "#untold-records",
      "#untold-gallery",
      "#untold-faq",
    ]);
    await page.screenshot({ path: `/tmp/untold-after-${width}-hero.png` });
    for (const href of hrefs) {
      await page.locator(href!).scrollIntoViewIfNeeded();
      await expect(page.locator(href!)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
    }
    const archiveLinks = page.locator("#untold-records .chasing-archive-card");
    await expect(archiveLinks).toHaveCount(3);
    for (const link of await archiveLinks.all())
      await expect(link).toHaveAttribute("href", /^\/untold-story\//);
    await page.getByText("Where can I find tickets?", { exact: true }).click();
    await expect(page.locator("#untold-faq details[open]")).toContainText(
      "does not reserve admission"
    );
    const images = page.locator("main img");
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      expect(
        await image.evaluate((img: HTMLImageElement) => img.naturalWidth)
      ).toBeGreaterThan(0);
    }
    await page.locator("#untold-event").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `/tmp/untold-after-${width}-event.png` });
    if (width === 390) {
      const scan = await new AxeBuilder({ page })
        .include("main")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(scan.violations).toEqual([]);
    }
  });
}

test("an unconfirmed Untold announcement never invents doors or checkout", async ({
  page,
}) => {
  await useEvents(page, [
    {
      id: "untold-next",
      series: "untold-story",
      title: "Next chapter",
      date: "October 2026",
      venue: "TBA",
      location: "Chicago",
      status: "coming-soon",
    },
  ]);
  await page.goto("/untold-story");
  const event = page.locator("#untold-event");
  await expect(event).toContainText("October 2026");
  await expect(event).toContainText("Venue to be announced");
  await expect(event).toContainText("Announcement pending");
  await expect(event).not.toContainText("9:00 PM");
  await expect(event).not.toContainText("Tickets on sale");
  await expect(
    event.locator('a[href*="posh.vip"], a[href*="allevents.in"]')
  ).toHaveCount(0);
});
