import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(rootDir, "client", "public");
const publicImagesDir = path.join(publicDir, "images");
const clientAssetsDir = path.join(rootDir, "client", "assets");
const outputDir = path.join(publicImagesDir, "generated");
const reportPath = path.join(outputDir, "responsive-image-report.json");

const widths = [480, 1024, 1920];
const sourceExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const sourceExtensionPreference = new Map([
  [".avif", 0],
  [".webp", 1],
  [".jpg", 2],
  [".jpeg", 2],
  [".png", 3],
]);
const formats = [
  { ext: "avif", options: { quality: 45, effort: 4 } },
  { ext: "webp", options: { quality: 60, effort: 4 } },
];

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function hasGeneratedAssets() {
  if (!(await pathExists(outputDir))) return false;

  const entries = await fs.readdir(outputDir);
  return entries.some((entry) => entry !== "responsive-image-report.json");
}

async function listFilesRecursive(dir) {
  if (!(await pathExists(dir))) return [];

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

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function getPublicPath(absolutePath) {
  if (!isInside(absolutePath, publicDir)) return null;
  return `/${toPosixPath(path.relative(publicDir, absolutePath))}`;
}

function getGeneratedBaseName(publicPath) {
  const withoutPrefix = publicPath.startsWith("/images/")
    ? publicPath.replace(/^\/images\//, "")
    : publicPath.replace(/^\//, "");

  return withoutPrefix
    .replace(/\.(?:png|jpe?g|webp|avif)$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function toKb(bytes) {
  return Number((bytes / 1024).toFixed(1));
}

async function getSourceImages() {
  const candidates = [
    ...(await listFilesRecursive(publicDir)),
    ...(await listFilesRecursive(clientAssetsDir)),
  ];

  const imageCandidates = candidates
    .filter((filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (!sourceExtensions.has(ext)) return false;
      if (isInside(filePath, outputDir) || filePath === outputDir) return false;
      return !toPosixPath(filePath).includes("/generated/");
    })
    .sort((a, b) => a.localeCompare(b));

  const byGeneratedName = new Map();

  for (const filePath of imageCandidates) {
    const publicPath = getPublicPath(filePath);
    if (!publicPath) continue;

    const baseName = getGeneratedBaseName(publicPath);
    const current = byGeneratedName.get(baseName);
    if (!current) {
      byGeneratedName.set(baseName, filePath);
      continue;
    }

    const currentRank = sourceExtensionPreference.get(path.extname(current).toLowerCase()) ?? 99;
    const nextRank = sourceExtensionPreference.get(path.extname(filePath).toLowerCase()) ?? 99;
    if (nextRank < currentRank) {
      byGeneratedName.set(baseName, filePath);
    }
  }

  return Array.from(byGeneratedName.values()).sort((a, b) => a.localeCompare(b));
}

async function generateForImage(inputPath) {
  const publicPath = getPublicPath(inputPath);
  if (!publicPath) return null;

  const baseName = getGeneratedBaseName(publicPath);
  const metadata = await sharp(inputPath).metadata();
  const originalWidth = metadata.width;
  const originalHeight = metadata.height;
  const originalBytes = (await fs.stat(inputPath)).size;

  if (!baseName || !originalWidth || !originalHeight) {
    throw new Error(`Missing image metadata for ${inputPath}`);
  }

  const variants = [];

  for (const width of widths) {
    for (const format of formats) {
      const outputPath = path.join(outputDir, `${baseName}-${width}.${format.ext}`);
      await sharp(inputPath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .toFormat(format.ext, format.options)
        .toFile(outputPath);

      const outputBytes = (await fs.stat(outputPath)).size;
      variants.push({
        path: `/images/generated/${baseName}-${width}.${format.ext}`,
        width,
        format: format.ext,
        bytes: outputBytes,
      });
    }
  }

  const smallestUseful = variants
    .filter((variant) => variant.width === 1024)
    .sort((a, b) => a.bytes - b.bytes)[0] || variants.sort((a, b) => a.bytes - b.bytes)[0];

  return {
    source: publicPath,
    originalBytes,
    originalKb: toKb(originalBytes),
    originalWidth,
    originalHeight,
    generatedBaseName: baseName,
    variants,
    estimatedTransferBytes: smallestUseful.bytes,
    estimatedTransferKb: toKb(smallestUseful.bytes),
    estimatedSavingsBytes: Math.max(0, originalBytes - smallestUseful.bytes),
    estimatedSavingsPct: originalBytes
      ? Math.round((Math.max(0, originalBytes - smallestUseful.bytes) / originalBytes) * 100)
      : 0,
  };
}

async function main() {
  const skipGeneration =
    process.env.SKIP_IMAGE_GENERATION === "true" ||
    process.env.GENERATE_RESPONSIVE_IMAGES === "false";
  const isCI = process.env.CI === "true" || process.env.NETLIFY === "true";
  const reportExists = await pathExists(reportPath);
  const generatedAssetsExist = await hasGeneratedAssets();

  if (skipGeneration) {
    if (!generatedAssetsExist) {
      throw new Error(
        "SKIP_IMAGE_GENERATION=true was set, but pre-generated responsive image assets are missing.",
      );
    }

    if (!reportExists) {
      console.warn("⚠️ Skipping image generation without a responsive-image-report.json file.");
    }

    console.log("⏩ Skipping image generation; using pre-generated assets from repository.");
    return;
  }

  if (isCI && generatedAssetsExist) {
    if (!reportExists) {
      console.warn("⚠️ Skipping image generation in CI without a responsive-image-report.json file.");
    }

    console.log("⏩ Skipping image generation in CI; using pre-generated assets from repository.");
    return;
  }

  // Only clear the output directory if we are actually going to regenerate
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  const sourceImages = await getSourceImages();
  const reports = [];

  for (const imagePath of sourceImages) {
    const report = await generateForImage(imagePath);
    if (report) reports.push(report);
  }

  const totals = reports.reduce(
    (acc, report) => {
      acc.originalBytes += report.originalBytes;
      acc.estimatedTransferBytes += report.estimatedTransferBytes;
      acc.estimatedSavingsBytes += report.estimatedSavingsBytes;
      acc.variantBytes += report.variants.reduce((sum, variant) => sum + variant.bytes, 0);
      return acc;
    },
    { originalBytes: 0, estimatedTransferBytes: 0, estimatedSavingsBytes: 0, variantBytes: 0 },
  );

  await fs.writeFile(
    reportPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), widths, totals, images: reports }, null, 2)}\n`,
  );

  const savingsPct = totals.originalBytes
    ? Math.round((totals.estimatedSavingsBytes / totals.originalBytes) * 100)
    : 0;

  console.log(`generated responsive variants for ${reports.length} images`);
  console.log(
    `estimated 1024w AVIF/WebP transfer: ${formatBytes(totals.estimatedTransferBytes)} vs ${formatBytes(totals.originalBytes)} originals (${savingsPct}% savings)`,
  );
  console.log(`variant bytes written: ${formatBytes(totals.variantBytes)}`);
  console.log(`report written: ${path.relative(rootDir, reportPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
