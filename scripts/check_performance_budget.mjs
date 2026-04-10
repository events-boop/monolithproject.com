#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const distPublicDir = path.join(process.cwd(), "dist", "public");
const budgetPath = path.join(process.cwd(), "performance-budget.json");

const JS_EXTENSIONS = new Set([".js"]);
const CSS_EXTENSIONS = new Set([".css"]);
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(fullPath)));
      continue;
    }

    if (entry.isFile()) files.push(fullPath);
  }

  return files;
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function sumBytes(records) {
  return records.reduce((total, record) => total + record.bytes, 0);
}

function getLargest(records) {
  return records.reduce(
    (largest, record) => (!largest || record.bytes > largest.bytes ? record : largest),
    null,
  );
}

function printCheck({ actual, budget, label }) {
  const passing = actual <= budget;
  const status = passing ? "PASS" : "FAIL";
  const detail = `${formatBytes(actual)} / ${formatBytes(budget)}`;
  console.log(`${status.padEnd(4)} ${label.padEnd(24)} ${detail}`);
  return passing;
}

if (!(await pathExists(distPublicDir))) {
  console.error(`ERROR: ${distPublicDir} not found. Run "npm run build" first.`);
  process.exit(1);
}

if (!(await pathExists(budgetPath))) {
  console.error(`ERROR: ${budgetPath} not found.`);
  process.exit(1);
}

const budgetFile = JSON.parse(await fs.readFile(budgetPath, "utf8"));
const budgets = budgetFile.budgets;

const files = await listFilesRecursive(distPublicDir);
const records = await Promise.all(
  files.map(async (absolutePath) => {
    const stat = await fs.stat(absolutePath);
    return {
      path: path.relative(distPublicDir, absolutePath).split(path.sep).join("/"),
      ext: path.extname(absolutePath).toLowerCase(),
      bytes: stat.size,
    };
  }),
);

const jsFiles = records.filter((record) => JS_EXTENSIONS.has(record.ext));
const cssFiles = records.filter((record) => CSS_EXTENSIONS.has(record.ext));
const imageFiles = records.filter((record) => IMAGE_EXTENSIONS.has(record.ext));
const videoFiles = records.filter((record) => VIDEO_EXTENSIONS.has(record.ext));

const totalDistBytes = sumBytes(records);
const jsTotalBytes = sumBytes(jsFiles);
const cssTotalBytes = sumBytes(cssFiles);
const imageTotalBytes = sumBytes(imageFiles);
const videoTotalBytes = sumBytes(videoFiles);

const maxJsChunk = getLargest(jsFiles);
const maxCssChunk = getLargest(cssFiles);
const maxImage = getLargest(imageFiles);
const maxVideo = getLargest(videoFiles);

console.log("Performance budget check");
console.log(`Dist root: ${path.relative(process.cwd(), distPublicDir)}`);
console.log("");

const checks = [
  printCheck({ label: "dist/public total", actual: totalDistBytes, budget: budgets.totalDistBytes }),
  printCheck({ label: "all JS", actual: jsTotalBytes, budget: budgets.jsTotalBytes }),
  printCheck({ label: "all CSS", actual: cssTotalBytes, budget: budgets.cssTotalBytes }),
  printCheck({ label: "all images", actual: imageTotalBytes, budget: budgets.imageTotalBytes }),
  printCheck({ label: "all videos", actual: videoTotalBytes, budget: budgets.videoTotalBytes }),
  printCheck({ label: "largest JS chunk", actual: maxJsChunk?.bytes ?? 0, budget: budgets.maxJsChunkBytes }),
  printCheck({ label: "largest CSS chunk", actual: maxCssChunk?.bytes ?? 0, budget: budgets.maxCssChunkBytes }),
  printCheck({ label: "largest image", actual: maxImage?.bytes ?? 0, budget: budgets.maxImageBytes }),
  printCheck({ label: "largest video", actual: maxVideo?.bytes ?? 0, budget: budgets.maxVideoBytes }),
];

console.log("");
console.log("Largest assets");
for (const item of [maxVideo, maxImage, maxJsChunk, maxCssChunk].filter(Boolean)) {
  console.log(`- ${formatBytes(item.bytes).padStart(8)}  ${item.path}`);
}

const passing = checks.every(Boolean);
if (!passing) {
  process.exitCode = 1;
}
