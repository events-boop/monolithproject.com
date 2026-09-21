import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { SUNSETS_PRELAUNCH_LOCKED } from "../shared/events/sunsets-ticketing";

// networkidle is unreachable on this site: tracking fetches use keepalive,
// which Chromium never reports as finished to Playwright. Wait for the app
// shell loader instead (same pattern as campaign-hardening.spec.ts).
async function waitForAppReady(page: import("@playwright/test").Page) {
  await page
    .waitForSelector("#initial-loader", { state: "detached", timeout: 15000 })
    .catch(() => undefined);
  await page.waitForLoadState("domcontentloaded");
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
    const style = document.createElement("style");
    // More robust selectors for tailwind brackets
    style.innerHTML = `
      [class*="z-[200]"], [class*="z-[60]"], [class*="fixed"] { 
        pointer-events: none !important; 
        display: none !important; 
      }
    `;
    document.documentElement.appendChild(style);
  });
});

async function ensureNewsletterVisible(page: import("@playwright/test").Page) {
  await page.goto("/newsletter");
  await waitForAppReady(page);
  await page.waitForTimeout(1500);
  await page.waitForSelector("#newsletter", {
    state: "visible",
    timeout: 20000,
  });
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
}

test("newsletter opens hosted signup without claiming a subscription", async ({
  page,
}) => {
  let postedLead = false;
  page.on("request", request => {
    if (request.url().endsWith("/api/leads") && request.method() === "POST")
      postedLead = true;
  });
  await ensureNewsletterVisible(page);
  const newsletter = page.locator("#newsletter");
  const signup = newsletter.getByRole("link", {
    name: /continue to email signup/i,
  });
  await expect(signup).toBeVisible();
  await expect(signup).toHaveAttribute(
    "href",
    /^https:\/\/50586c7f\.sibforms\.com\/serve\//
  );
  await expect(signup).toHaveAttribute("target", "_blank");
  await expect(
    newsletter.getByText(/confirm it from your inbox/i)
  ).toBeVisible();
  await expect(
    newsletter.getByRole("heading", { name: /Thanks For Joining/i })
  ).toHaveCount(0);
  expect(postedLead).toBe(false);
});

test("ticket flow emits intent tracking and preserves outbound ticket link", async ({
  page,
}) => {
  test.skip(
    SUNSETS_PRELAUNCH_LOCKED,
    "/tickets redirects to /sunsets while SUNSETS_PRELAUNCH_LOCKED is on; re-enable at launch."
  );
  let intentTracked = false;
  await page.route("**/api/ticket-intent", async route => {
    intentTracked = true;
    await route.fulfill({ status: 202, body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/tickets");
  await waitForAppReady(page); // Wait for cinematic PageTransition
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /^(NEXT SIGNAL|TICKETS LIVE)$/i,
    })
  ).toBeVisible({
    timeout: 10000,
  });

  const ctaLink = page.locator('main a[href*="/go/"]').first();
  await expect(ctaLink).toBeVisible();
  await ctaLink.click({ force: true });

  await expect.poll(() => intentTracked).toBeTruthy();
});

test("scoped a11y checks pass for newsletter and tickets header", async ({
  page,
}) => {
  // Reduced motion keeps axe from sampling colors mid fade-in, which reads
  // blended foreground/background values and reports phantom contrast issues.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ensureNewsletterVisible(page);
  const newsletterA11y = await new AxeBuilder({ page })
    .include("#newsletter")
    .analyze();
  expect(newsletterA11y.violations).toEqual([]);

  await page.goto("/tickets");
  await waitForAppReady(page);
  if (SUNSETS_PRELAUNCH_LOCKED) {
    // /tickets redirects to the /sunsets launch page while locked — audit that.
    await expect(page).toHaveURL(/\/sunsets$/);
    await expect(
      page.getByRole("link", { name: /get july 4 tickets/i })
    ).toBeVisible({ timeout: 10000 });
  } else {
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /^(NEXT SIGNAL|TICKETS LIVE)$/i,
      })
    ).toBeVisible({
      timeout: 10000,
    });
  }
  const ticketsA11y = await new AxeBuilder({ page }).include("main").analyze();
  expect(ticketsA11y.violations).toEqual([]);
});

test("monolith manifesto page loads and contains required sections", async ({
  page,
}) => {
  await page.goto("/monolith");
  await waitForAppReady(page);

  // Verify main heading
  await expect(
    page.getByRole("heading", { name: /THE MONOLITH/i, level: 1 })
  ).toBeVisible();

  // Verify custom sections exist
  await expect(page.locator("#story")).toBeVisible();
  await expect(page.locator("#manifesto")).toBeVisible();
  await expect(page.locator("#vision")).toBeVisible();

  // Run accessibility verification
  const monolithA11y = await new AxeBuilder({ page })
    .include("main")
    .exclude(".word-scrub-word")
    .analyze();
  expect(monolithA11y.violations).toEqual([]);
});

test("all navigation megamenu and chapter links load cleanly without 404", async ({
  page,
}) => {
  const linksToTest = [
    "/artists/autograf",
    "/artists/lazare",
    "/radio/ep-004-benchek-part-2",
    "/radio/ep-02-ewerseen",
    "/radio/ep-03-terranova",
    "/story",
    "/archive",
    "/monolith",
    "/schedule",
    "/tickets",
    "/newsletter",
    "/chasing-sunsets",
    "/lineup",
    "/radio",
    "/radio/ep-01-benchek",
    "/guide",
    "/vip",
  ];

  for (const path of linksToTest) {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);

    await page.waitForLoadState("domcontentloaded");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain("This page doesn't exist.");
    expect(bodyText).not.toContain("Episode Not Found");
    expect(bodyText).not.toContain("Gallery not found");
  }
});
