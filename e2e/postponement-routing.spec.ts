import { test, expect } from "./fixtures/event-notice-dismissed";
import { writeFileSync } from "node:fs";

test("postponement is consistent on both front doors, even after the old show date", async ({
  page,
}) => {
  for (const width of [360, 390, 430, 768, 1363]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.setFixedTime(new Date("2026-09-21T12:00:00Z"));
    for (const path of ["/", "/sunsets/", "/chasing-sunsets"]) {
      await page.goto(path);
      await expect(page.locator(".event-status-float")).toBeVisible();
      await expect(page.locator(".event-status-float")).toContainText(
        /postponed/i
      );
      await expect(page.locator('a[href*="allevents.in"]')).toHaveCount(0);
      if (await page.locator("[data-nav-event-banner]").count())
        await expect(page.locator("[data-nav-event-banner]")).not.toContainText(
          "LIVE NOW"
        );
      if (path === "/") {
        await expect(
          page.locator('.home-show-card[data-event-id="css-sep19"]')
        ).toHaveAttribute("data-event-status", "EventPostponed");
        await expect(page.locator("#current-event")).toBeVisible();
      }
      if (path === "/sunsets/") {
        const data = await page
          .locator('script[type="application/ld+json"]')
          .textContent();
        expect(JSON.parse(data!).eventStatus).toBe(
          "https://schema.org/EventPostponed"
        );
        await expect(page.locator("body")).not.toContainText("GET TICKETS");
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
      if ([390, 1363].includes(width))
        await page.screenshot({
          path: `/tmp/postponed-${path === "/" ? "home" : path.includes("chasing") ? "series" : "sunsets"}-${width}.png`,
        });
    }
  }
});

test("audit all linked internal routes and anchors from the homepage, series and event guide", async ({
  browser,
}) => {
  test.setTimeout(240000);
  const page = await browser.newPage();
  const links = new Map<string, string[]>();
  for (const seed of ["/", "/chasing-sunsets", "/sunsets/"]) {
    await page.goto("http://127.0.0.1:4173" + seed);
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 650) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 35));
      }
    });
    await page.waitForTimeout(600);
    for (const raw of await page
      .locator("a[href]")
      .evaluateAll(els => els.map(e => e.getAttribute("href")!))) {
      if (!raw || raw === "#" || /^(mailto:|tel:|javascript:)/.test(raw))
        continue;
      const url = new URL(raw, "http://127.0.0.1:4173" + seed);
      const key = url.href;
      links.set(key, [...(links.get(key) || []), seed]);
    }
  }
  const report: any = { checked: [], external: [], broken: [] };
  const hosts = [
    "127.0.0.1",
    "monolithproject.com",
    "www.monolithproject.com",
    "sunsets.vip",
    "www.sunsets.vip",
  ];
  for (const [href, sources] of links) {
    const url = new URL(href);
    if (!hosts.includes(url.hostname)) {
      report.external.push({ href, sources });
      continue;
    }
    let route = url.pathname;
    if (url.hostname.includes("sunsets.vip") && route === "/")
      route = "/sunsets/";
    const local = "http://127.0.0.1:4173" + route + url.search + url.hash;
    if (/\.(ics|pdf|jpg|png|webp)$/.test(route) || route.startsWith("/go/")) {
      report.checked.push({
        href,
        sources,
        kind: "resource-or-redirect",
        status: (await page.request.get(local)).status(),
      });
      continue;
    }
    try {
      const response = await page.goto(local, {
        waitUntil: "domcontentloaded",
        timeout: 12000,
      });
      await page.waitForTimeout(130);
      const body = await page.locator("body").innerText();
      let error =
        response && response.status() >= 400
          ? "HTTP " + response.status()
          : /Gallery not found|404 Page Not Found|Page not found|Something went wrong/i.test(
                body
              )
            ? "Missing route or render error"
            : "";
      if (url.hash && !error) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (
          !(await page.evaluate(id => Boolean(document.getElementById(id)), id))
        ) {
          await page.evaluate(() =>
            window.scrollTo(0, document.body.scrollHeight)
          );
          await page.waitForTimeout(1200);
          if (
            !(await page.evaluate(
              id => Boolean(document.getElementById(id)),
              id
            ))
          )
            error = "Missing anchor " + id;
        }
      }
      const result = { href, sources, status: response?.status(), error };
      report.checked.push(result);
      if (error) report.broken.push(result);
    } catch (e) {
      report.broken.push({ href, sources, error: String(e) });
    }
  }
  writeFileSync(
    "/tmp/monolith-link-audit.json",
    JSON.stringify(report, null, 2)
  );
  console.log(
    JSON.stringify(
      {
        checked: report.checked.length,
        external: report.external.length,
        broken: report.broken,
      },
      null,
      2
    )
  );
  await page.close();
  expect(report.broken).toEqual([]);
});
