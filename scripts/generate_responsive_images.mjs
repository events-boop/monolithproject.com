import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = path.resolve(import.meta.dirname, "..");
const sourceDir = path.join(rootDir, "client", "public", "images");
const outputDir = path.join(sourceDir, "generated");

const presets = [
  {
    input: "artists-collective.webp",
    baseName: "artists-collective",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "chasing-sunsets.webp",
    baseName: "chasing-sunsets",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "hero-monolith-modern.webp",
    baseName: "hero-monolith-modern",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "hero-video-1-poster.jpg",
    baseName: "hero-video-1-poster",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "eran-hersh-live-1.png",
    baseName: "eran-hersh-hero",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "eran-hersh-live-6.png",
    baseName: "eran-hersh-hero-real",
    widths: [640, 681],
  },
  {
    input: "eran-hersh-live-5.webp",
    baseName: "eran-hersh-international",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "lazare-carbon-center.png",
    baseName: "lazare-carbon-center",
    widths: [480, 768, 1080],
  },
  {
    input: "untold-story-moody.webp",
    baseName: "untold-story",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "untold-story-juany-deron-v2.webp",
    baseName: "untold-story-juany-deron-v2",
    widths: [640, 960, 1280, 1600],
  },
  {
    input: "radio-show-gear.webp",
    baseName: "radio-show-gear",
    widths: [640, 960, 1280, 1600],
  },
];

const formats = [
  { ext: "avif", options: { quality: 52, effort: 4 } },
  { ext: "webp", options: { quality: 74, effort: 4 } },
];

async function generatePreset(preset) {
  const inputPath = path.join(sourceDir, preset.input);
  const metadata = await sharp(inputPath).metadata();
  const originalWidth = metadata.width;

  if (!originalWidth) {
    throw new Error(`Missing width metadata for ${preset.input}`);
  }

  const widths = [...new Set(preset.widths.filter((width) => width < originalWidth).concat(originalWidth))];
  let generatedCount = 0;

  for (const width of widths) {
    for (const format of formats) {
      const outputPath = path.join(outputDir, `${preset.baseName}-${width}.${format.ext}`);
      await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .toFormat(format.ext, format.options)
        .toFile(outputPath);
      generatedCount += 1;
    }
  }

  return { widths, generatedCount };
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  for (const preset of presets) {
    const { widths, generatedCount } = await generatePreset(preset);
    console.log(`generated ${generatedCount} files for ${preset.input} (${widths.join(", ")})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
