import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = path.resolve(import.meta.dirname, "..");
const publicImagesDir = path.join(rootDir, "client", "public", "images");

// 1. Scan for referenced images across the workspace
async function scanReferences(dir, extSet) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const references = new Set();

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subRefs = await scanReferences(fullPath, extSet);
      for (const ref of subRefs) references.add(ref);
      continue;
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".ts", ".tsx", ".js", ".jsx", ".json", ".mts", ".mjs"].includes(ext)) {
        const content = await fs.readFile(fullPath, "utf8");
        // Match strings that look like image paths or image basenames
        const matches = content.match(/[\w-]+\.(png|jpg|jpeg|webp|avif|gif)/g);
        if (matches) {
          for (const match of matches) {
            references.add(match);
          }
        }
      }
    }
  }
  return references;
}

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "generated") continue; // Skip generated directory
      files.push(...(await listFilesRecursive(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function run() {
  console.log("Scanning references...");
  const refSet = new Set();
  const extSet = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);

  const clientRefs = await scanReferences(path.join(rootDir, "client"), extSet);
  const serverRefs = await scanReferences(path.join(rootDir, "server"), extSet);
  const privateArchiveRefs = await scanReferences(path.join(rootDir, "private"), extSet);

  for (const ref of clientRefs) refSet.add(ref);
  for (const ref of serverRefs) refSet.add(ref);
  for (const ref of privateArchiveRefs) refSet.add(ref);

  console.log(`Found ${refSet.size} image references in codebase.`);

  console.log("Auditing original files in client/public/images...");
  const originalFiles = await listFilesRecursive(publicImagesDir);
  let deletedCount = 0;
  let resizedCount = 0;

  for (const filePath of originalFiles) {
    const ext = path.extname(filePath).toLowerCase();
    if (!extSet.has(ext)) continue;

    const baseName = path.basename(filePath);

    // Determine if clearly unused
    let isUsed = false;
    for (const ref of refSet) {
      if (ref.includes(baseName) || baseName.includes(ref)) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      console.log(`[DELETE] Unused image: ${baseName}`);
      await fs.unlink(filePath);
      deletedCount++;
      continue;
    }

    // Determine image classification and maximum width
    let targetWidth = 1600; // Default: Gallery
    const lowerName = baseName.toLowerCase();

    if (
      lowerName.includes("profile") ||
      lowerName.includes("avatar") ||
      lowerName.includes("icon") ||
      lowerName.includes("logo") ||
      lowerName.includes("nav") ||
      lowerName.includes("square")
    ) {
      targetWidth = 800; // Small
    } else if (
      lowerName.includes("hero") ||
      lowerName.includes("modern") ||
      lowerName.includes("cover") ||
      lowerName.includes("banner") ||
      lowerName.includes("fullbleed") ||
      lowerName.includes("sunset-party") ||
      lowerName.includes("video-1")
    ) {
      targetWidth = 1920; // Hero
    }

    // Resize using sharp
    const metadata = await sharp(filePath).metadata();
    if (metadata.width > targetWidth) {
      console.log(`[RESIZE] ${baseName} (${metadata.width}px -> ${targetWidth}px)`);
      const buffer = await sharp(filePath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .toBuffer();
      await fs.writeFile(filePath, buffer);
      resizedCount++;
    } else {
      console.log(`[KEEP] ${baseName} is already ${metadata.width}px`);
    }
  }

  console.log(`Audit complete. Deleted: ${deletedCount}, Resized: ${resizedCount}`);
}

run().catch(console.error);
