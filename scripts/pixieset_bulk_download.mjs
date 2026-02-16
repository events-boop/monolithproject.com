#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { chromium } from "@playwright/test";

const DEFAULT_OUTPUT_DIR = path.resolve("private", "downloads", "pixieset");
const DEFAULT_PROFILE_DIR = path.resolve(".tmp", "pixieset-profile");
const DEFAULT_MAX_ITEMS = Number.POSITIVE_INFINITY;
const DEFAULT_DOWNLOAD_TIMEOUT_MS = 20000;
const DEFAULT_AFTER_ACTION_WAIT_MS = 700;

const DOWNLOAD_BUTTON_SELECTORS = [
  '[aria-label*="download" i]',
  'button[title*="download" i]',
  'a[title*="download" i]',
  'button:has-text("Download")',
  'a:has-text("Download")',
  '[data-testid*="download" i]',
  'button[class*="download" i]',
  'a[class*="download" i]',
  'button:has(i[class*="download" i])',
  'a:has(i[class*="download" i])',
];

const DOWNLOAD_MENU_SELECTORS = [
  'button:has-text("Download photo")',
  'a:has-text("Download photo")',
  'button:has-text("Original")',
  'a:has-text("Original")',
  'button:has-text("Full Size")',
  'a:has-text("Full Size")',
];

const NEXT_BUTTON_SELECTORS = [
  '[aria-label*="next" i]',
  'button[title*="next" i]',
  'button:has-text("Next")',
  '.pswp__button--arrow--right',
];

function printHelp() {
  console.log(`
Pixieset per-photo bulk downloader (Playwright)

Usage:
  node scripts/pixieset_bulk_download.mjs --url <pixieset-url> [options]

Options:
  --url <url>                 Pixieset collection URL (required)
  --out <dir>                 Output folder (default: ${DEFAULT_OUTPUT_DIR})
  --profile <dir>             Browser profile dir for session reuse (default: ${DEFAULT_PROFILE_DIR})
  --max <n>                   Max photos to download this run (default: unlimited)
  --headless                  Run browser headless (not recommended for first run)
  --download-timeout-ms <n>   Per-image download wait timeout (default: ${DEFAULT_DOWNLOAD_TIMEOUT_MS})
  --after-action-wait-ms <n>  Wait after each click/step (default: ${DEFAULT_AFTER_ACTION_WAIT_MS})
  --help                      Show this help

Notes:
  1) Open the collection and sign in if needed.
  2) Open the first photo in the viewer.
  3) Press Enter in terminal; script will do Download -> Next repeatedly.
  `);
}

function parseArgs(argv) {
  const options = {
    url: "",
    outDir: DEFAULT_OUTPUT_DIR,
    profileDir: DEFAULT_PROFILE_DIR,
    max: DEFAULT_MAX_ITEMS,
    headless: false,
    downloadTimeoutMs: DEFAULT_DOWNLOAD_TIMEOUT_MS,
    afterActionWaitMs: DEFAULT_AFTER_ACTION_WAIT_MS,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
    if (arg === "--headless") {
      options.headless = true;
      continue;
    }
    if (arg === "--url") {
      options.url = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (arg === "--out") {
      options.outDir = path.resolve(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--profile") {
      options.profileDir = path.resolve(argv[i + 1] || "");
      i += 1;
      continue;
    }
    if (arg === "--max") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("--max must be a positive integer");
      }
      options.max = parsed;
      i += 1;
      continue;
    }
    if (arg === "--download-timeout-ms") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("--download-timeout-ms must be a positive integer");
      }
      options.downloadTimeoutMs = parsed;
      i += 1;
      continue;
    }
    if (arg === "--after-action-wait-ms") {
      const parsed = Number.parseInt(argv[i + 1] || "", 10);
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error("--after-action-wait-ms must be 0 or greater");
      }
      options.afterActionWaitMs = parsed;
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.url) {
    throw new Error("Missing required --url");
  }

  return options;
}

function sanitizeFilenamePart(input) {
  return input
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readManifest(manifestPath) {
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.entries)) return parsed;
  } catch {
    // no-op
  }
  return { entries: [] };
}

async function writeManifest(manifestPath, manifest) {
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function findVisibleLocator(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      if (await locator.isVisible({ timeout: 600 })) {
        return locator;
      }
    } catch {
      // keep searching
    }
  }
  return null;
}

function extFromContentType(contentType) {
  if (!contentType) return "jpg";
  if (contentType.includes("image/jpeg")) return "jpg";
  if (contentType.includes("image/png")) return "png";
  if (contentType.includes("image/webp")) return "webp";
  if (contentType.includes("image/avif")) return "avif";
  if (contentType.includes("image/gif")) return "gif";
  return "jpg";
}

function extFromUrl(url) {
  const parsed = new URL(url);
  const pathname = parsed.pathname.toLowerCase();
  const match = pathname.match(/\.(jpe?g|png|webp|avif|gif)$/);
  if (!match) return "";
  const ext = match[1];
  if (ext === "jpeg") return "jpg";
  return ext;
}

async function saveImageFromCurrentSrc(context, src, outputPrefixPath) {
  if (!src) {
    throw new Error("Could not detect current image URL for direct save fallback.");
  }

  const response = await context.request.get(src);
  if (!response.ok()) {
    throw new Error(`Direct image fetch failed with status ${response.status()}`);
  }

  const contentType = response.headers()["content-type"] || "";
  const ext = extFromUrl(src) || extFromContentType(contentType);
  const filePath = `${outputPrefixPath}.${ext}`;
  const body = await response.body();
  await fs.writeFile(filePath, body);
  return filePath;
}

async function getCurrentImageFingerprint(page) {
  return page.evaluate(() => {
    const images = Array.from(document.querySelectorAll("img"))
      .map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          src: node.currentSrc || node.src || "",
          width: rect.width,
          height: rect.height,
          area: rect.width * rect.height,
          top: rect.top,
          left: rect.left,
        };
      })
      .filter((img) => img.src && img.width > 120 && img.height > 120);

    images.sort((a, b) => b.area - a.area);
    const best = images[0];
    return best?.src || "";
  });
}

async function triggerDownload(page, timeoutMs) {
  await page.mouse.move(1200, 80).catch(() => undefined);
  await page.waitForTimeout(120);
  const button = await findVisibleLocator(page, DOWNLOAD_BUTTON_SELECTORS);
  if (!button) {
    throw new Error("Could not find a visible Download button in the viewer.");
  }

  try {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: timeoutMs }),
      button.click(),
    ]);
    return download;
  } catch {
    // Some UIs open a download menu first.
  }

  const menuButton = await findVisibleLocator(page, DOWNLOAD_MENU_SELECTORS);
  if (!menuButton) {
    throw new Error("Download button clicked, but no download event or menu item was found.");
  }

  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: timeoutMs }),
    menuButton.click(),
  ]);
  return download;
}

async function dumpVisibleActions(page) {
  const actions = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll("button, a, [role='button']"));
    const visible = nodes.filter((node) => {
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        style.opacity !== "0"
      );
    });
    return visible.slice(0, 80).map((node) => {
      const element = node;
      return {
        text: (element.textContent || "").trim().slice(0, 60),
        ariaLabel: element.getAttribute("aria-label") || "",
        title: element.getAttribute("title") || "",
        cls: (element.getAttribute("class") || "").slice(0, 120),
      };
    });
  });
  if (actions.length === 0) {
    console.log("No visible action elements found.");
    return;
  }
  console.log("Visible action elements (sample):");
  actions.forEach((item, idx) => {
    console.log(
      `  [${idx + 1}] text="${item.text}" aria="${item.ariaLabel}" title="${item.title}" class="${item.cls}"`
    );
  });
}

async function advanceToNext(page, afterActionWaitMs) {
  const before = await getCurrentImageFingerprint(page);

  const nextButton = await findVisibleLocator(page, NEXT_BUTTON_SELECTORS);
  if (nextButton) {
    await nextButton.click();
  } else {
    await page.keyboard.press("ArrowRight");
  }

  await page.waitForTimeout(afterActionWaitMs);

  const after = await getCurrentImageFingerprint(page);
  if (!before || !after) return true;
  return before !== after;
}

async function promptForStart(url, outDir) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("\nManual setup required:");
  console.log(`- Open: ${url}`);
  console.log("- Complete any login/download PIN prompts if needed.");
  console.log("- Open the FIRST photo in the lightbox/viewer.");
  console.log(`- Downloads will be saved to: ${outDir}`);
  await rl.question("\nPress Enter here once the first photo is open...");
  rl.close();
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await ensureDir(options.outDir);
  await ensureDir(options.profileDir);

  const manifestPath = path.join(options.outDir, "_manifest.json");
  const manifest = await readManifest(manifestPath);
  const seenFingerprints = new Set(
    manifest.entries.map((entry) => entry.fingerprint).filter(Boolean)
  );

  const context = await chromium.launchPersistentContext(options.profileDir, {
    headless: options.headless,
    acceptDownloads: true,
    viewport: null,
  });

  try {
    const page = context.pages()[0] || (await context.newPage());
    await page.goto(options.url, { waitUntil: "domcontentloaded" });
    await promptForStart(options.url, options.outDir);

    let downloadedCount = 0;
    let visitedCount = 0;
    let stalledMoves = 0;
    const maxStalledMoves = 2;

    while (downloadedCount < options.max) {
      const fingerprint = await getCurrentImageFingerprint(page);
      const photoKey = fingerprint || `${page.url()}::${visitedCount}`;

      if (seenFingerprints.has(photoKey)) {
        const moved = await advanceToNext(page, options.afterActionWaitMs);
        visitedCount += 1;
        if (!moved) stalledMoves += 1;
        if (stalledMoves >= maxStalledMoves) {
          console.log("Reached the end (could not advance to a new image).");
          break;
        }
        continue;
      }

      let outputName = "";
      let outputPath = "";
      try {
        const download = await triggerDownload(page, options.downloadTimeoutMs);
        const suggested = download.suggestedFilename() || "photo.jpg";
        const safeSuggested = sanitizeFilenamePart(suggested) || "photo.jpg";
        outputName = `${String(manifest.entries.length + 1).padStart(4, "0")}-${safeSuggested}`;
        outputPath = path.join(options.outDir, outputName);
        await download.saveAs(outputPath);
      } catch (error) {
        // Fallback for Pixieset themes where the download button isn't directly exposed:
        // save the currently displayed largest image URL using authenticated context cookies.
        console.log(
          `Download button flow failed, using direct-image fallback (${error instanceof Error ? error.message : String(error)})`
        );
        await dumpVisibleActions(page);
        const safeBaseName = `${String(manifest.entries.length + 1).padStart(4, "0")}-${sanitizeFilenamePart("pixieset-photo")}`;
        const outputPrefixPath = path.join(options.outDir, safeBaseName);
        outputPath = await saveImageFromCurrentSrc(context, fingerprint, outputPrefixPath);
        outputName = path.basename(outputPath);
      }

      seenFingerprints.add(photoKey);
      manifest.entries.push({
        index: manifest.entries.length + 1,
        filename: outputName,
        savedAt: new Date().toISOString(),
        pageUrl: page.url(),
        fingerprint: photoKey,
      });
      await writeManifest(manifestPath, manifest);

      downloadedCount += 1;
      visitedCount += 1;
      stalledMoves = 0;
      console.log(`Saved ${outputName}`);

      const moved = await advanceToNext(page, options.afterActionWaitMs);
      if (!moved) {
        stalledMoves += 1;
        if (stalledMoves >= maxStalledMoves) {
          console.log("Reached the end (could not advance to a new image).");
          break;
        }
      }
    }

    console.log(`\nDone. Downloaded ${downloadedCount} new photo(s) to ${options.outDir}`);
    console.log(`Manifest: ${manifestPath}`);
  } finally {
    await context.close();
  }
}

main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
