import { test, expect } from "./fixtures/event-notice-dismissed";
import AxeBuilder from "@axe-core/playwright";

const route = "/sunsets/index.html";
for (const width of [360, 390, 430, 768, 1363]) {
  test(`Sunsets responsive event guide at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await page.locator("#event-title").waitFor();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await expect(page.locator(".event-status-float")).toBeVisible();
    await expect(page.locator("#event-status")).toContainText("POSTPONED");
    await expect(page.locator("#event-title")).toHaveText("JOEZI × MASSUMA");
    for (const img of await page.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `/tmp/sunsets-review-${width}-opening.png` });
    await page.screenshot({
      path: `/tmp/sunsets-review-${width}.png`,
      fullPage: true,
    });
    await page.locator('a[href="#weather"]').first().click();
    const rain = page
      .locator("summary")
      .filter({ hasText: "Is the event rain or shine?" });
    await rain.focus();
    await page.keyboard.press("Enter");
    await expect(rain.locator("..")).toHaveAttribute("open", "");
    await page.locator("#privacy-open").click();
    await expect(page.locator("#privacy-dialog")).toBeVisible();
    await expect(page.locator(".booking-dock")).not.toHaveClass(/is-visible/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#privacy-dialog")).not.toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.map(v => ({ id: v.id, nodes: v.nodes.length }))
    ).toEqual([]);
  });
}
test("ticket campaign parameters are constrained; no personal data travels to checkout", async ({
  page,
}) => {
  await page.goto(
    route +
      "?utm_source=instagram&utm_campaign=sep19&utm_medium=paid_social&email=fan%40example.com&phone=3125551234&utm_content=fan%40example.com"
  );
  await expect(page.locator(".ticket-link")).toHaveCount(0);
  for (const link of await page.locator(".ticket-link").all()) {
    const url = new URL((await link.getAttribute("href"))!);
    expect(url.hostname).toBe("allevents.in");
    expect(url.searchParams.get("utm_source")).toBe("instagram");
    expect(url.searchParams.get("utm_campaign")).toBe("sep19");
    expect(url.searchParams.has("email")).toBe(false);
    expect(url.searchParams.has("phone")).toBe(false);
    expect(url.searchParams.has("utm_content")).toBe(false);
  }
});
test("forms fail closed when subscription service is unavailable", async ({
  page,
}) => {
  await page.route("**/api/sunsets/subscriptions", route =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: '{"ok":false}',
    })
  );
  await page.goto(route + "#updates");
  await expect(page.locator("#email-event")).toBeDisabled();
  await expect(page.locator("#email-radio")).toBeDisabled();
  await expect(page.locator(".form-feedback").first()).toContainText(
    "temporarily unavailable"
  );
});
test("on-page form validates, handles failure/retry and pending double opt-in without a false success", async ({
  page,
}) => {
  let failure = true;
  const submitted: unknown[] = [];
  await page.route("**/api/sunsets/subscriptions", async route => {
    if (route.request().method() === "GET")
      return route.fulfill({
        json: { ok: true, audiences: { event: true, radio: true } },
      });
    submitted.push(route.request().postDataJSON());
    return route.fulfill({
      status: failure ? 502 : 200,
      json: failure
        ? {
            ok: false,
            message: "We couldn’t confirm your signup. Please try again.",
          }
        : {
            ok: true,
            state: "confirmation_required",
            message: "Check your inbox to confirm your email subscription.",
          },
    });
  });
  await page.goto(route + "#updates");
  const form = page.locator('.signup-form[data-audience="event"]');
  await expect(form.locator("input[type=email]")).toBeEnabled();
  await form.locator("input[type=email]").fill("review@example.com");
  await expect(page.locator(".booking-dock")).not.toHaveClass(/is-visible/);
  await form.locator("button").click();
  expect(submitted).toHaveLength(0);
  await form.locator("input[type=checkbox]").check();
  await form.locator("button").click();
  await expect(form.locator(".form-feedback")).toContainText(
    "couldn’t confirm"
  );
  expect(submitted[0]).toEqual({
    email: "review@example.com",
    audience: "event",
    consent: true,
    website: "",
  });
  failure = false;
  await form.locator("button").click();
  await expect(form.locator(".form-feedback")).toContainText(
    "Check your inbox"
  );
  await expect(form.locator("input[type=email]")).toBeEnabled();
  await expect(
    page.locator('.signup-form[data-audience="radio"] .form-feedback')
  ).not.toContainText("Check your inbox");
});

test("saved signup stays distinct from a confirmed subscription", async ({
  page,
}) => {
  await page.route("**/api/sunsets/subscriptions", route =>
    route.fulfill({
      json:
        route.request().method() === "GET"
          ? { ok: true, audiences: { event: true, radio: true } }
          : {
              ok: true,
              state: "saved",
              message: "Your request for show updates is saved.",
            },
    })
  );
  await page.goto(route + "#updates");
  await page.evaluate(() => {
    (window as any).__signupResults = [];
    (window as any).sunsetsTracking.subscriptionResult = (
      audience: string,
      state: string
    ) => {
      (window as any).__signupResults.push({ audience, state });
    };
  });
  const form = page.locator('.signup-form[data-audience="event"]');
  await expect(form.locator("input[type=email]")).toBeEnabled();
  await form.locator("input[type=email]").fill("review@example.com");
  await form.locator("input[type=checkbox]").check();
  await form.locator("button").click();
  await expect(form.locator(".form-feedback")).toHaveText(
    "Your request for show updates is saved."
  );
  expect(await page.evaluate(() => (window as any).__signupResults)).toEqual([
    { audience: "event", state: "saved" },
  ]);
});
