import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:3001/";

const consoleMessages = [];
const failedRequests = [];

async function dismissOverlays(page) {
  // Try common cookie/consent/modal dismissals without failing if absent.
  const candidates = [
    'button:has-text("Accept")',
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'button:has-text("Got it")',
    'button:has-text("Close")',
    '[aria-label="Close"]',
    '[aria-label="close"]',
  ];
  for (const sel of candidates) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 500 })) {
        await el.click({ timeout: 1000 });
        await page.waitForTimeout(300);
      }
    } catch {
      /* ignore */
    }
  }
  // Fallback: press Escape to close any modal/dialog
  try {
    await page.keyboard.press("Escape");
  } catch {
    /* ignore */
  }
}

function wireListeners(page, tag) {
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleMessages.push(`[${tag}] console.${msg.type()}: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    consoleMessages.push(`[${tag}] pageerror: ${err.message}`);
  });
  page.on("requestfailed", (req) => {
    failedRequests.push(
      `[${tag}] FAILED ${req.method()} ${req.url()} — ${req.failure()?.errorText}`
    );
  });
  page.on("response", (res) => {
    if (res.status() >= 400) {
      failedRequests.push(`[${tag}] HTTP ${res.status()} ${res.url()}`);
    }
  });
}

async function settle(page) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 15000 });
  } catch {
    /* network may keep streaming (video); continue anyway */
  }
  await page.waitForTimeout(2500); // let animations/lazy images settle
  // Trigger lazy-loaded content by scrolling through the page, then back to top
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 120);
        else resolve();
      };
      step();
    });
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

async function settleHero(page) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 15000 });
  } catch {
    /* hero video may keep streaming; continue after the fixed settle window */
  }
  // Do not perform the full-page lazy-load scroll for a viewport-only capture.
  // Scrolling the carousel offscreen can leave its active frame blank.
  await page.waitForTimeout(4000);
}

const browser = await chromium.launch();
try {
  // 1) Desktop 1440x900 full-page
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    wireListeners(page, "desktop-full");
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await dismissOverlays(page);
    await settle(page);
    await page.screenshot({
      path: path.join(__dirname, "homepage-desktop-1440x900-full.png"),
      fullPage: true,
    });
    await ctx.close();
  }

  // 2) Desktop 1440x900 viewport-only (hero / above the fold)
  {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    wireListeners(page, "desktop-hero");
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await dismissOverlays(page);
    await settleHero(page);
    await page.screenshot({
      path: path.join(__dirname, "homepage-desktop-1440x900-hero.png"),
      fullPage: false,
    });
    await ctx.close();
  }

  // 3) Mobile 390x844 full-page
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });
    const page = await ctx.newPage();
    wireListeners(page, "mobile-full");
    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
    await dismissOverlays(page);
    await settle(page);
    await page.screenshot({
      path: path.join(__dirname, "homepage-mobile-390x844-full.png"),
      fullPage: true,
    });
    await ctx.close();
  }
} finally {
  await browser.close();
}

console.log("=== CONSOLE MESSAGES ===");
console.log(consoleMessages.length ? consoleMessages.join("\n") : "(none)");
console.log("=== FAILED REQUESTS / HTTP>=400 ===");
console.log(failedRequests.length ? failedRequests.join("\n") : "(none)");
