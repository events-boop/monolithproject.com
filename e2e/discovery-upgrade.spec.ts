import { test, expect } from "@playwright/test";

test("home preserves a full-screen scene and a reachable show action", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const action = page.getByRole("link", {
      name: "Explore the shows",
      exact: true,
    });
    await expect(action).toBeInViewport();
    expect(
      await page
        .locator(".monolith-hero-stage")
        .evaluate(e => e.getBoundingClientRect().height)
    ).toBeGreaterThanOrEqual(900);
    expect(
      await page
        .locator(".home-upcoming")
        .evaluate(e => e.getBoundingClientRect().top)
    ).toBeGreaterThanOrEqual(900);
    await action.click();
    await expect(
      page.getByRole("searchbox", { name: "Search shows" })
    ).toBeVisible();
  }
});

test("calendar search combines with series filters and can recover", async ({
  page,
}) => {
  await page.goto("/schedule");
  const search = page.getByRole("searchbox", { name: "Search shows" });
  await search.fill("joezi");
  await expect(page.locator(".schedule-editorial-card")).toHaveCount(1);
  await expect(page.locator(".schedule-editorial-card")).toContainText(
    "Postponed"
  );
  await page
    .getByRole("combobox", { name: "Filter shows by series" })
    .selectOption("untold-story");
  await expect(
    page.getByRole("heading", { name: "No shows match this search." })
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(search).toHaveValue("");
  expect(
    await page.locator(".schedule-editorial-card").count()
  ).toBeGreaterThan(1);
});

test("artist recording action reaches its section and show card uses the real booking", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/artists/joezi");
  await page
    .getByRole("link", { name: "Watch a recorded set", exact: true })
    .click();
  await expect(page.locator("#artist-recording")).toBeInViewport();
  await expect(page.locator(".artist-appearance-note")).toContainText(
    "participation"
  );
  await expect(
    page.getByRole("link", { name: "Read show update", exact: true })
  ).toHaveAttribute("href", "/sunsets#event-update");
  await expect(page.locator("main")).toContainText(
    "Replacement date to be announced"
  );
  await expect(page.locator("main")).not.toContainText("August 2026");
});

test("event artist cards connect a named booking to its profile and published recording", async ({
  page,
}) => {
  await page.goto("/events/eran-hersh-untold-story-iv");
  const artists = page.locator(".event-artist-discovery");
  await expect(
    artists.getByRole("link", { name: "Artist profile", exact: true }).first()
  ).toHaveAttribute("href", "/artists/eran-hersh");
  await artists
    .getByRole("link", { name: "Artist profile", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/artists\/eran-hersh$/);
  await expect(
    page.getByRole("heading", { name: "ERAN HERSH", exact: true })
  ).toBeVisible();
});
