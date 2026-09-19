// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import vm from "node:vm";

const publicDir = path.resolve("client/public");
const html = readFileSync(path.join(publicDir, "sunsets/index.html"), "utf8");
const doc = new JSDOM(html).window.document;

describe("published Sunsets event hub", () => {
  it("ships all local assets and self-hosted fonts under its own route", () => {
    for (const el of doc.querySelectorAll("[src], link[href]")) {
      const url = el.getAttribute("src") || el.getAttribute("href") || "";
      if (url.startsWith("/"))
        expect(existsSync(path.join(publicDir, url)), url).toBe(true);
    }
    expect(html).not.toContain("fonts.googleapis.com");
    expect(
      doc.querySelector('link[rel="stylesheet"]')?.getAttribute("href")
    ).toBe("/sunsets/fonts/fonts.css");
    expect(html).not.toContain("file://");
  });

  it("keeps section navigation valid and all ticket buttons on the approved checkout", () => {
    for (const el of doc.querySelectorAll('a[href^="#"]')) {
      const id = el.getAttribute("href")!.slice(1);
      if (id) expect(doc.getElementById(id), id).not.toBeNull();
    }
    for (const el of doc.querySelectorAll(".ticket-link")) {
      expect(el.getAttribute("href")).toBe(
        "https://allevents.in/chicago/chasing-sunsets-iii-joezi-x-massuma-tickets/80003431876974"
      );
    }
    expect(doc.querySelectorAll("#faq details")).toHaveLength(16);
    expect(doc.querySelector("#set-times")?.textContent).toContain(
      "show is postponed"
    );
    expect(doc.querySelector("#faq")?.textContent).toContain("rain-or-shine");
  });

  it("routes only the event page ahead of the SPA fallback", () => {
    const config = readFileSync("netlify.toml", "utf8");
    for (const route of ["/sunsets", "/sunsets/"]) {
      expect(config).toContain(
        `from = "${route}"\n  to = "/sunsets/index.html"\n  status = 200\n  force = true`
      );
    }
    expect(config.indexOf('to = "/sunsets/index.html"')).toBeLessThan(
      config.indexOf('from = "/*"')
    );
    expect(config).toContain('from = "https://sunsets.vip/"');
    expect(config).toContain('from = "/go/*"');
  });

  it("retains both production trackers, consent and honest conversion events", () => {
    const source = readFileSync(
      path.join(publicDir, "sunsets/tracking.js"),
      "utf8"
    );
    function setup(hostname: string, consent: string | null) {
      const scripts: string[] = [];
      const listeners: Record<string, Function> = {};
      const win: any = {
        location: { hostname },
        addEventListener() {},
        dispatchEvent() {},
      };
      const document = {
        createElement: () => ({}),
        head: { appendChild: (el: any) => scripts.push(el.src) },
        addEventListener: (name: string, cb: Function) => {
          listeners[name] = cb;
        },
      };
      vm.runInNewContext(source, {
        window: win,
        document,
        localStorage: { getItem: () => consent, setItem() {} },
        CustomEvent: class {},
      });
      return { win, scripts, listeners };
    }
    expect(setup("localhost", null).scripts).toHaveLength(0);
    const t = setup("monolithproject.com", "declined");
    expect(t.scripts).toHaveLength(0);
    t.win.sunsetsTracking.setConsent("accepted");
    t.win.sunsetsTracking.setConsent("accepted");
    expect(t.scripts).toHaveLength(2);
    expect(t.scripts.join(" ")).toContain("G-DE8Z8VS263");
    expect(JSON.stringify(t.win.fbq.queue)).toContain("1049241148606250");
    const click = (link: any) =>
      t.listeners.click({ target: { closest: () => link } });
    click({
      classList: { contains: () => true },
      dataset: { placement: "hero" },
      href: "https://allevents.in/",
    });
    click({
      classList: { contains: () => false },
      id: "updates-request",
      dataset: {},
    });
    expect(JSON.stringify(t.win.fbq.queue)).toContain("OutboundTicketClick");
    expect(t.win.fbq.queue.some((args: any[]) => args[1] === "Lead")).toBe(
      false
    );
    t.win.sunsetsTracking.setConsent("declined");
    const count = t.win.fbq.queue.length;
    click({
      classList: { contains: () => true },
      dataset: {},
      href: "https://allevents.in/",
    });
    expect(t.win.fbq.queue).toHaveLength(count);
    expect(t.win["ga-disable-G-DE8Z8VS263"]).toBe(true);
  });
});

describe("Sunsets review preview integrity", () => {
  it("puts essentials before the poster and subscriptions after event information", () => {
    expect(
      doc.querySelector("#main")?.firstElementChild?.id === "event-status"
    ).toBe(true);
    expect(doc.querySelector(".hero-status-badge")?.getAttribute("href")).toBe(
      "#event-status"
    );
    expect(doc.querySelector(".hero-event-art")).toBeNull();
    expect(html.indexOf('id="set-times"')).toBeLessThan(
      html.indexOf('id="venue"')
    );
    expect(html.indexOf('id="venue"')).toBeLessThan(
      html.indexOf('id="artists"')
    );
    expect(html.indexOf('id="faq"')).toBeLessThan(html.indexOf('id="updates"'));
    expect(doc.querySelector("#venue img")?.getAttribute("src")).toContain(
      "castaways-hero"
    );
    expect(doc.querySelectorAll(".signup-form")).toHaveLength(2);
    expect(
      doc.querySelectorAll('#updates .signup-fallback a[href^="mailto:"]')
    ).toHaveLength(2);
    expect(doc.querySelector("#updates")?.textContent).toContain(
      "does not subscribe you automatically"
    );
    expect(
      doc.querySelectorAll(".signup-form fieldset[disabled]")
    ).toHaveLength(2);
    expect(doc.querySelector("#set-times")?.textContent).toContain("Erik");
    expect(doc.querySelector("#set-times")?.textContent).not.toContain("6–8");
  });
  it("has one event schema matching visible data and the actual destination canonical", () => {
    const schemas = doc.querySelectorAll('script[type="application/ld+json"]');
    expect(schemas).toHaveLength(1);
    const event = JSON.parse(schemas[0].textContent!);
    expect(event.url).toBe(
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href")
    );
    expect(event.url).toBe("https://monolithproject.com/sunsets");
    expect(event.startDate).toBe("2026-09-19T12:00:00-05:00");
    expect(event.eventStatus).toBe("https://schema.org/EventPostponed");
    expect(doc.querySelector(".status-notice time")?.textContent).toContain(
      "Chicago"
    );
  });
});

describe("approved event changes remain consistent", () => {
  it("rejects unapproved status changes and stale artwork after date changes", async () => {
    // The renderer is shared by every build, not a runtime-only DOM patch.
    const { renderSunsetsPage } =
      await import("../../scripts/render_sunsets_page.mjs");
    const data = JSON.parse(
      readFileSync("shared/events/sunsets-page.json", "utf8")
    );
    const template = readFileSync("scripts/templates/sunsets.html", "utf8");
    expect(() =>
      renderSunsetsPage(
        {
          ...data,
          status: "EventPostponed",
          salesEnabled: false,
          statusApproval: null,
        },
        template
      )
    ).toThrow("approval");
    expect(() =>
      renderSunsetsPage(
        {
          ...data,
          start: "2026-09-20T12:00:00-05:00",
          end: "2026-09-20T22:00:00-05:00",
        },
        template
      )
    ).toThrow("artwork");
    const revised = new JSDOM(
      renderSunsetsPage(
        {
          ...data,
          status: "EventCancelled",
          salesEnabled: false,
          statusApproval: "test-fixture-only",
        },
        template
      )
    ).window.document;
    expect(revised.querySelector("#main")?.firstElementChild?.id).toBe(
      "event-status"
    );
    expect(revised.querySelector(".hero-status-badge")?.textContent).toContain(
      "Cancelled"
    );
    expect(revised.querySelectorAll(".ticket-link")).toHaveLength(0);
    expect(revised.querySelectorAll('a[href*="allevents.in"]')).toHaveLength(0);
    expect(revised.querySelector(".hero-event-art")).toBeNull();
    expect(
      JSON.parse(
        revised.querySelector('script[type="application/ld+json"]')!
          .textContent!
      ).eventStatus
    ).toBe("https://schema.org/EventCancelled");
  });
});
