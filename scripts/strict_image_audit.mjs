import fs from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const publicImagesDir = path.join(rootDir, "client", "public", "images");

async function scanReferences(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const references = new Set();

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subRefs = await scanReferences(fullPath);
      for (const r of subRefs) references.add(r);
      continue;
    }

    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
        const content = await fs.readFile(fullPath, "utf8");
        const matches = content.match(/[\w-]+\.(png|jpg|jpeg|webp|avif|gif)/g);
        if (matches) {
          for (const match of matches) {
            references.add(match);
          }
        }
      }
    }
  }
  return Array.from(references);
}

async function run() {
  console.log("Scanning strict references...");
  const refSet = new Set();

  const componentsRefs = await scanReferences(path.join(rootDir, "client", "src", "components"));
  const pagesRefs = await scanReferences(path.join(rootDir, "client", "src", "pages"));
  const libRefs = await scanReferences(path.join(rootDir, "client", "src", "lib"));
  const dataRefs = await scanReferences(path.join(rootDir, "server", "data"));

  for (const ref of componentsRefs) refSet.add(ref);
  for (const ref of pagesRefs) refSet.add(ref);
  for (const ref of libRefs) refSet.add(ref);
  for (const ref of dataRefs) refSet.add(ref);

  console.log(`Found ${refSet.size} strict image references.`);

  const originalFiles = await fs.readdir(publicImagesDir, { withFileTypes: true });
  let deletedOriginals = 0;
  let deletedVariants = 0;

  for (const entry of originalFiles) {
    if (entry.isDirectory()) continue; // generated or archive
    
    const baseName = entry.name;
    const ext = path.extname(baseName).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(ext)) continue;

    let isUsed = false;
    for (const ref of refSet) {
      if (ref === baseName || baseName.includes(ref) || ref.includes(baseName)) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      console.log(`[STRICT DELETE] Unused: ${baseName}`);
      // Delete original
      await fs.unlink(path.join(publicImagesDir, baseName));
      deletedOriginals++;

      // Delete its generated variants
      const baseWithoutExt = baseName.replace(ext, "");
      const generatedFiles = await fs.readdir(path.join(publicImagesDir, "generated"));
      for (const genFile of generatedFiles) {
        if (genFile.startsWith(baseWithoutExt + "-")) {
          await fs.unlink(path.join(publicImagesDir, "generated", genFile));
          deletedVariants++;
        }
      }
    }
  }

  console.log(`Strict audit complete. Deleted ${deletedOriginals} originals and ${deletedVariants} variants.`);
}

run().catch(console.error);
