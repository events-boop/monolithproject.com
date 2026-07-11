import { expect, test, type Page } from "@playwright/test";

const API_BASE = "http://127.0.0.1:5001";
const APP_BASE = API_BASE;
const ATTRIBUTION_STORAGE_KEY = "monolith:attribution:v1";
const CONSENT_STORAGE_KEY = "monolith_cookie_consent";
const SESSION_STORAGE_KEY = "monolith:session:v1";

async function preparePage(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("monolith-loaded", "1");
    sessionStorage.setItem("monolith-loaded-v2", "1");
    sessionStorage.setItem("event-banner-dismissed", "1");
  });
}

async function waitForAppReady(page: Page) {
  await page
    .waitForSelector("#initial-loader", {
      state: "detached",
      timeout: 15000,
    })
    .catch(() => undefined);
  await page.waitForLoadState("domcontentloaded");
}

function syntheticIp(lastOctet: number) {
  return `198.51.100.${lastOctet}`;
}

test.describe("campaign hardening stress checks", () => {
  test("CAPI lead capture accepts 50 concurrent unique event IDs locally", async ({
    request,
  }) => {
    const eventIds = Array.from(
      { length: 50 },
      (_, index) => `stress-lead-${Date.now()}-${index}`
    );
    const responses = await Promise.all(
      eventIds.map(eventId =>
        request.post(`${API_BASE}/api/track/lead`, {
          data: {
            eventId,
            eventSourceUrl: `https://sunsets.vip/sunsets?event_id=${eventId}`,
            fbclid: `fbclid-${eventId}`,
          },
          headers: {
            "x-forwarded-for": syntheticIp(11),
          },
        })
      )
    );

    expect(responses.map(response => response.status())).toEqual(
      Array.from({ length: 50 }, () => 202)
    );

    const bodies = await Promise.all(
      responses.map(response => response.json())
    );
    expect(new Set(bodies.map(body => body.eventId)).size).toBe(50);
    expect(bodies.map(body => body.ok)).toEqual(
      Array.from({ length: 50 }, () => true)
    );
  });

  test("health endpoints stay liveness-only without credentials", async ({
    request,
  }) => {
    for (const path of ["/health", "/api/health"]) {
      const response = await request.get(`${API_BASE}${path}`);
      expect(response.status()).toBe(200);
      const body = await response.json();

      expect(body.ok).toBe(true);
      // Integration diagnostics moved behind the admin guard; the public
      // probe must not leak CAPI status or integration topology.
      expect(body).not.toHaveProperty("capi");
      expect(body).not.toHaveProperty("integrations");
      expect(JSON.stringify(body).toLowerCase()).not.toContain("token");
    }
  });

  test("health details require admin credentials", async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/health/details`);
    // 401 when OPS_ADMIN_SECRET is configured, 503 when unset (fail closed).
    expect([401, 503]).toContain(response.status());
  });

  test("sunsets.vip root mirrors the /sunsets link-in-bio surface", async ({
    page,
  }) => {
    await preparePage(page);
    await page.route(
      /https?:\/\/([^/]+\.)?(youtube\.com|youtube-nocookie\.com|ytimg\.com|googlevideo\.com|soundcloud\.com|sndcdn\.com)\//,
      route => route.fulfill({ body: "", status: 204 })
    );
    const pageViewRequests: string[] = [];

    page.on("request", request => {
      if (request.url().includes("/api/track/page-view")) {
        pageViewRequests.push(request.postData() || "");
      }
    });

    await page.goto("http://sunsets.vip:5001/", {
      waitUntil: "domcontentloaded",
    });
    await waitForAppReady(page);

    const ticketCta = page.getByRole("link", {
      name: /get july 4 tickets/i,
    });
    await expect(ticketCta).toBeVisible();
    await expect(ticketCta).toHaveAttribute(
      "href",
      /\/go\/tickets\/sunsets-july4/
    );
    const lakeListCta = page.getByRole("link", {
      name: /join the lake list/i,
    });
    await expect(lakeListCta).toBeVisible();
    await expect(lakeListCta).toHaveAttribute("href", /\/go\/lakelist/);
    await expect(
      page.getByRole("heading", { name: /chasing\s*sun\(sets\)\s*2026/i })
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://sunsets.vip/sunsets"
    );
    await expect
      .poll(() => pageViewRequests.length, { timeout: 5000 })
      .toBeGreaterThanOrEqual(1);

    const trackedPaths = new Set(
      pageViewRequests
        .map(postData => {
          try {
            return JSON.parse(postData).pagePath as string | undefined;
          } catch {
            return undefined;
          }
        })
        .filter(Boolean)
    );
    expect(trackedPaths).toContain("/sunsets");
  });

  test("multi-tab attribution keeps session and first touch tab-scoped", async ({
    context,
  }) => {
    await context.addInitScript(() => {
      localStorage.removeItem("monolith:attribution:v1");
      localStorage.removeItem("monolith:session:v1");
      sessionStorage.setItem("monolith-loaded", "1");
      sessionStorage.setItem("monolith-loaded-v2", "1");
      sessionStorage.setItem("event-banner-dismissed", "1");
    });

    const states: Array<{
      firstUtmSource?: string;
      localAttribution: string | null;
      localSession: string | null;
      sessionId: string | null;
    }> = [];

    for (const source of ["tab_one", "tab_two", "tab_three"]) {
      const page = await context.newPage();
      await page.goto(
        `${APP_BASE}/?utm_source=${source}&utm_medium=cpc&utm_campaign=${source}_campaign`,
        { waitUntil: "domcontentloaded" }
      );
      await waitForAppReady(page);
      await expect
        .poll(
          () =>
            page.evaluate(
              key => sessionStorage.getItem(key),
              SESSION_STORAGE_KEY
            ),
          { timeout: 10000 }
        )
        .toBeTruthy();

      states.push(
        await page.evaluate(
          ({ attributionKey, sessionKey }) => {
            const attribution = JSON.parse(
              sessionStorage.getItem(attributionKey) || "{}"
            );
            return {
              firstUtmSource: attribution.firstTouch?.utmSource,
              localAttribution: localStorage.getItem(attributionKey),
              localSession: localStorage.getItem(sessionKey),
              sessionId: sessionStorage.getItem(sessionKey),
            };
          },
          {
            attributionKey: ATTRIBUTION_STORAGE_KEY,
            sessionKey: SESSION_STORAGE_KEY,
          }
        )
      );
    }

    expect(new Set(states.map(state => state.sessionId)).size).toBe(3);
    expect(states.map(state => state.firstUtmSource)).toEqual([
      "tab_one",
      "tab_two",
      "tab_three",
    ]);
    expect(states.every(state => state.localAttribution === null)).toBe(true);
    expect(states.every(state => state.localSession === null)).toBe(true);
  });

  test("rapid SPA navigation preserves tracked funnel page views without console errors", async ({
    page,
  }) => {
    await preparePage(page);
    await page.route(
      /https?:\/\/([^/]+\.)?(youtube\.com|youtube-nocookie\.com|ytimg\.com|googlevideo\.com|soundcloud\.com|sndcdn\.com)\//,
      route => route.fulfill({ body: "", status: 204 })
    );
    const consoleErrors: string[] = [];
    const firstPartyFailures: string[] = [];
    const pageViewRequests: string[] = [];

    page.on("console", message => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("response", response => {
      if (response.status() < 400) return;
      const url = new URL(response.url());
      if (
        [
          "127.0.0.1:5001",
          "localhost:5001",
          "monolithproject.com:5001",
          "sunsets.vip:5001",
        ].includes(url.host)
      ) {
        firstPartyFailures.push(`${response.status()} ${response.url()}`);
      }
    });
    page.on("request", request => {
      if (request.url().includes("/api/track/page-view")) {
        pageViewRequests.push(request.postData() || "");
      }
    });

    await page.goto(`${APP_BASE}/`, { waitUntil: "domcontentloaded" });
    await waitForAppReady(page);

    const routes = [
      "/lake",
      "/radio",
      "/sunsets",
      "/story",
      "/lake",
      "/sunsets",
    ];
    const startedAt = Date.now();
    for (const route of routes) {
      await page.evaluate(path => {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }, route);
      await page.waitForTimeout(120);
    }
    const durationMs = Date.now() - startedAt;

    expect(durationMs).toBeLessThan(3000);
    await expect
      .poll(() => pageViewRequests.length, { timeout: 5000 })
      .toBeGreaterThanOrEqual(2);
    const trackedPaths = new Set(
      pageViewRequests
        .map(postData => {
          try {
            return JSON.parse(postData).pagePath as string | undefined;
          } catch {
            return undefined;
          }
        })
        .filter(Boolean)
    );
    expect(trackedPaths).toContain("/lake");
    expect(trackedPaths).toContain("/sunsets");
    expect(consoleErrors).toEqual([]);
    expect(firstPartyFailures).toEqual([]);
  });

  test("cookie consent gates brand and Lake campaign pixels by contract", async ({
    browser,
  }) => {
    async function collectFbqCalls(
      url: string,
      consentState: "accepted" | "declined" | null
    ) {
      const context = await browser.newContext();
      await context.route(
        "https://connect.facebook.net/en_US/fbevents.js",
        route =>
          route.fulfill({
            body: "window.__facebookPixelScriptLoaded = true;",
            contentType: "application/javascript",
          })
      );

      const page = await context.newPage();
      await page.addInitScript(
        ({ consentKey, consent }) => {
          sessionStorage.setItem("monolith-loaded", "1");
          sessionStorage.setItem("monolith-loaded-v2", "1");
          sessionStorage.setItem("event-banner-dismissed", "1");
          if (consent) localStorage.setItem(consentKey, consent);
          else localStorage.removeItem(consentKey);
        },
        { consent: consentState, consentKey: CONSENT_STORAGE_KEY }
      );

      await page.goto(url, { waitUntil: "domcontentloaded" });
      await waitForAppReady(page);
      await page.waitForTimeout(4300);

      const calls = await page.evaluate(() => {
        const fbq = window.fbq as unknown as { queue?: unknown[] } | undefined;
        return fbq?.queue || [];
      });
      await context.close();
      return calls;
    }

    const brandBeforeConsent = await collectFbqCalls(
      "http://monolithproject.com:5001/",
      null
    );
    const brandAccepted = await collectFbqCalls(
      "http://monolithproject.com:5001/",
      "accepted"
    );
    const lakeBeforeConsent = await collectFbqCalls(
      "http://sunsets.vip:5001/sunsets",
      null
    );
    const lakeDeclined = await collectFbqCalls(
      "http://sunsets.vip:5001/sunsets",
      "declined"
    );

    expect(brandBeforeConsent).toEqual([]);
    expect(JSON.stringify(brandAccepted)).toContain("PageView");
    expect(JSON.stringify(lakeBeforeConsent)).toContain("trackSingle");
    expect(JSON.stringify(lakeBeforeConsent)).toContain("PageView");
    expect(lakeDeclined).toEqual([]);
  });

  test("tracking rate limiter saturates at 240 events per window", async ({
    request,
  }) => {
    const responses = await Promise.all(
      Array.from({ length: 250 }, (_, index) =>
        request.post(`${API_BASE}/api/track/page-view`, {
          data: {
            pagePath: `/stress/${index}`,
            eventSlug: "stress-rate-limit",
            source: "playwright",
          },
          headers: {
            "x-forwarded-for": syntheticIp(12),
          },
        })
      )
    );
    const statuses = responses.map(response => response.status());

    expect(statuses.filter(status => status === 202)).toHaveLength(240);
    expect(statuses.filter(status => status === 429)).toHaveLength(10);
    expect(responses.at(-1)?.headers()["retry-after"]).toBeTruthy();
  });

  test("outbound redirects remain decodable after tracking-param decoration", async ({
    request,
  }) => {
    const safePrefix = "a".repeat(190);
    const ref = `${safePrefix}&utm_campaign=poisoned${"b".repeat(80)}`;
    const fbclid = `${"c".repeat(199)}%2F`;
    const response = await request.get(
      `${API_BASE}/go/tickets/featured?ref=${encodeURIComponent(
        ref
      )}&fbclid=${encodeURIComponent(fbclid)}`,
      { maxRedirects: 0 }
    );

    expect(response.status()).toBe(302);
    const location = response.headers().location;
    expect(location).toBeTruthy();
    expect(location).not.toContain("poisoned");
    expect(location).not.toMatch(/\?(#|$)/);

    const destination = new URL(location!);
    expect(destination.searchParams.get("ref")).toBe(safePrefix);
    expect(destination.searchParams.get("fbclid")).toBe("c".repeat(199));
    expect(() => decodeURIComponent(destination.search)).not.toThrow();
    expect(destination.toString()).not.toContain("%25");

    const noQueryResponse = await request.get(
      `${API_BASE}/go/tickets/featured`,
      { maxRedirects: 0 }
    );
    expect(noQueryResponse.headers().location).not.toMatch(/\?$/);
  });
});
