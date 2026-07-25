import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../dist/public");

const CAMPAIGN_PIXEL_ID = "1049241148606250";
const BLOCKED_PIXEL_IDS = ["166134370742863"];
const BLOCKED_ONSITE_COMMERCE_EVENTS = ["InitiateCheckout"];

const searchableExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".mjs",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml",
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && searchableExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  try {
    const publicStats = await stat(publicDir);
    if (!publicStats.isDirectory()) {
      throw new Error(`${publicDir} is not a directory`);
    }
  } catch (error) {
    console.error(
      `[pixel:guard] Public build directory is missing: ${publicDir}`
    );
    throw error;
  }

  const files = await walk(publicDir);
  const blockedMatches = [];
  const blockedCommerceMatches = [];
  let campaignPixelFound = false;

  for (const file of files) {
    const contents = await readFile(file, "utf8");
    const relativeFile = path.relative(publicDir, file);

    if (contents.includes(CAMPAIGN_PIXEL_ID)) {
      campaignPixelFound = true;
    }

    for (const blockedPixelId of BLOCKED_PIXEL_IDS) {
      if (contents.includes(blockedPixelId)) {
        blockedMatches.push(`${relativeFile}: ${blockedPixelId}`);
      }
    }

    for (const eventName of BLOCKED_ONSITE_COMMERCE_EVENTS) {
      if (contents.includes(eventName)) {
        blockedCommerceMatches.push(`${relativeFile}: ${eventName}`);
      }
    }
  }

  if (blockedMatches.length > 0) {
    console.error(
      "[pixel:guard] Blocked Meta Pixel ID found in public build:\n" +
        blockedMatches.map(match => `  - ${match}`).join("\n")
    );
    process.exit(1);
  }

  if (!campaignPixelFound) {
    console.error(
      `[pixel:guard] Campaign Meta Pixel ID ${CAMPAIGN_PIXEL_ID} was not found in public build.`
    );
    process.exit(1);
  }

  if (blockedCommerceMatches.length > 0) {
    console.error(
      "[pixel:guard] Monolith must not ship checkout events owned by Posh:\n" +
        blockedCommerceMatches.map(match => `  - ${match}`).join("\n")
    );
    process.exit(1);
  }

  console.log(
    `[pixel:guard] Public build uses campaign Meta Pixel ${CAMPAIGN_PIXEL_ID}; blocked IDs and on-site checkout events absent.`
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
