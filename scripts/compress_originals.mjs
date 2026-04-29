import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = path.resolve(import.meta.dirname, "..");
const publicImagesDir = path.join(rootDir, "client", "public", "images");

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
  console.log("Compressing original files in client/public/images...");
  const files = await listFilesRecursive(publicImagesDir);
  let compressedCount = 0;

  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) continue;

    const baseName = path.basename(filePath);
    const stat = await fs.stat(filePath);
    const originalSize = stat.size;

    let buffer;
    if (ext === ".png") {
      // Lossy PNG compression
      buffer = await sharp(filePath)
        .png({ quality: 75, compressionLevel: 9, palette: true })
        .toBuffer();
    } else if (ext === ".jpg" || ext === ".jpeg") {
      buffer = await sharp(filePath)
        .jpeg({ quality: 75, mozjpeg: true })
        .toBuffer();
    } else if (ext === ".webp") {
      buffer = await sharp(filePath)
        .webp({ quality: 75 })
        .toBuffer();
    }

    if (buffer && buffer.length < originalSize) {
      await fs.writeFile(filePath, buffer);
      console.log(`[COMPRESSED] ${baseName} (${(originalSize/1024).toFixed(1)}KB -> ${(buffer.length/1024).toFixed(1)}KB)`);
      compressedCount++;
    } else {
      console.log(`[SKIP] ${baseName} (already optimized or larger)`);
    }
  }

  console.log(`Optimization complete. Compressed ${compressedCount} files.`);
}

run().catch(console.error);
