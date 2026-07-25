import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(rootDir, "client", "public");
const publicImagesDir = path.join(publicDir, "images");
const clientAssetsDir = path.join(rootDir, "client", "assets");
const outputDir = path.join(publicImagesDir, "generated");
const reportPath = path.join(outputDir, "responsive-image-report.json");

const defaultWidths = [480, 1024];
// Premium editorial tier: retain source masters and ship larger, gentler
// derivatives for artist imagery and full-bleed editorial photography.
const premiumArtistWidths = [640, 1280, 1920];
const premiumArtistBaseNamePrefixes = [
  "artists-sommers-uk-",
  "artists-joezi-",
  "artists-massuma-uk-",
  "artists-chris-idh-",
  "artists-juany-bravo-",
  "artists-amari-",
  "artists-sarat-",
  "artists-benchek-",
  "artists-summer-mel-",
  "artists-jerome-",
  "artists-rose-",
  "artists-avo-",
  "artists-jealah-",
  "artists-maximo-",
  "artists-eliana-",
  "artists-kenbo-slice-",
  "artists-terranova-",
  "events-sunsets-2026-09-19-",
  "untold-story-header-jpq-",
];
const desktopWidthsByBaseName = new Map([
  ["hero-monolith", [480, 1024, 1920]],
  ["hero-video-1-poster", [480, 1024, 1920]],
  ["artist-ewerseen-2026-v2", [447]],
  ["artists-collective", [480, 1024, 1600]],
  ["chasing-sunsets", [480, 1024, 1600]],
  ["chasing-sunsets-castaways-hero", [480, 1024, 1600]],
  ["untold-story-juany-deron-v2", [480, 1024, 1600]],
  ["lazare-recap", [480, 1024, 1542]],
  ["artists-juany-bravo-juany-bravo-portrait", [640, 1280, 1920]],
  ["artists-summer-mel-summer-mel-portrait", [640, 1280]],
  ["artists-summer-mel-summer-mel-orange-portrait", [480, 640]],
  ["artists-sarat-sarat-live", [480, 720]],
  ["artists-jerome-jerome-portrait", [640, 1280, 1920]],
  ["artists-rose-rose-live", [640, 1172]],
  ["artists-avo-avo-portrait", [640, 1280, 1858]],
  ["artists-jealah-jealah-portrait", [640, 1280, 1920]],
  ["artists-maximo-maximo-portrait", [640, 1280, 1920]],
  ["artists-eliana-eliana-live", [309]],
  ["artists-kenbo-slice-kenbo-slice-portrait", [640, 1280, 1863]],
  ["artists-terranova-terranova-live", [640, 1280, 1667]],
  ["events-sunsets-2026-09-19-massuma-official-artwork", [640, 1122]],
  ["events-ape-drums-july31-hero", [480, 864]],
  ["events-ape-drums-july31-square", [160, 320]],
]);
const sourceExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const sourceExtensionPreference = new Map([
  [".avif", 0],
  [".webp", 1],
  [".jpg", 2],
  [".jpeg", 2],
  [".png", 3],
]);
// Quality raised for high-fidelity replacement imports. Effort bumped to 6 so the
// better-looking variants stay as small as possible (slower build, smaller files).
const defaultFormats = [
  { ext: "avif", options: { quality: 62, effort: 6 } },
  { ext: "webp", options: { quality: 82, effort: 6 } },
];
const premiumArtistFormats = [
  { ext: "avif", options: { quality: 76, effort: 6 } },
  { ext: "webp", options: { quality: 90, effort: 6 } },
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
  return entries.some(entry => entry !== "responsive-image-report.json");
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
  return (
    Boolean(relative) &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  );
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

function getWidthsForImage(baseName) {
  const desktopWidths = desktopWidthsByBaseName.get(baseName);
  if (desktopWidths) return desktopWidths;

  if (
    premiumArtistBaseNamePrefixes.some(prefix => baseName.startsWith(prefix))
  ) {
    return premiumArtistWidths;
  }
  return defaultWidths;
}

function getFormatsForImage(baseName) {
  return premiumArtistBaseNamePrefixes.some(prefix =>
    baseName.startsWith(prefix)
  )
    ? premiumArtistFormats
    : defaultFormats;
}

async function getSourceImages() {
  const candidates = [
    ...(await listFilesRecursive(publicDir)),
    ...(await listFilesRecursive(clientAssetsDir)),
  ];

  const imageCandidates = candidates
    .filter(filePath => {
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

    const currentRank =
      sourceExtensionPreference.get(path.extname(current).toLowerCase()) ?? 99;
    const nextRank =
      sourceExtensionPreference.get(path.extname(filePath).toLowerCase()) ?? 99;
    if (nextRank < currentRank) {
      byGeneratedName.set(baseName, filePath);
    }
  }

  return Array.from(byGeneratedName.values()).sort((a, b) =>
    a.localeCompare(b)
  );
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

  const widths = getWidthsForImage(baseName);
  const imageFormats = getFormatsForImage(baseName);
  const variants = [];

  for (const width of widths) {
    for (const format of imageFormats) {
      const outputPath = path.join(
        outputDir,
        `${baseName}-${width}.${format.ext}`
      );
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

  const representativeWidth = widths.includes(1024)
    ? 1024
    : widths.includes(1280)
      ? 1280
      : widths.at(-1);
  const smallestUseful =
    variants
      .filter(variant => variant.width === representativeWidth)
      .sort((a, b) => a.bytes - b.bytes)[0] ||
    variants.sort((a, b) => a.bytes - b.bytes)[0];

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
      ? Math.round(
          (Math.max(0, originalBytes - smallestUseful.bytes) / originalBytes) *
            100
        )
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
        "SKIP_IMAGE_GENERATION=true was set, but pre-generated responsive image assets are missing."
      );
    }

    if (!reportExists) {
      console.warn(
        "⚠️ Skipping image generation without a responsive-image-report.json file."
      );
    }

    console.log(
      "⏩ Skipping image generation; using pre-generated assets from repository."
    );
    return;
  }

  if (isCI && generatedAssetsExist) {
    if (!reportExists) {
      console.warn(
        "⚠️ Skipping image generation in CI without a responsive-image-report.json file."
      );
    }

    console.log(
      "⏩ Skipping image generation in CI; using pre-generated assets from repository."
    );
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
      acc.variantBytes += report.variants.reduce(
        (sum, variant) => sum + variant.bytes,
        0
      );
      return acc;
    },
    {
      originalBytes: 0,
      estimatedTransferBytes: 0,
      estimatedSavingsBytes: 0,
      variantBytes: 0,
    }
  );

  await fs.writeFile(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        defaultWidths,
        premiumArtistWidths,
        premiumArtistBaseNamePrefixes,
        totals,
        images: reports,
      },
      null,
      2
    )}\n`
  );

  const savingsPct = totals.originalBytes
    ? Math.round((totals.estimatedSavingsBytes / totals.originalBytes) * 100)
    : 0;

  console.log(`generated responsive variants for ${reports.length} images`);
  console.log(
    `estimated representative AVIF/WebP transfer: ${formatBytes(totals.estimatedTransferBytes)} vs ${formatBytes(totals.originalBytes)} originals (${savingsPct}% savings)`
  );
  console.log(`variant bytes written: ${formatBytes(totals.variantBytes)}`);
  console.log(`report written: ${path.relative(rootDir, reportPath)}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
