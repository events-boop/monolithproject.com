import { Router } from "express";
import { existsSync, readFileSync } from "fs";
import path from "path";
import express from "express";
import { injectHeroPreloads } from "../services/hero-preloads";

const router = Router();

function resolveEntryDir() {
  const entryPath = process.argv[1];
  return entryPath ? path.dirname(path.resolve(entryPath)) : process.cwd();
}

function resolveStaticPath() {
  const entryDir = resolveEntryDir();
  const candidates =
    process.env.NODE_ENV === "production"
      ? [
          path.resolve(process.cwd(), "dist", "public"),
          path.resolve(entryDir, "public"),
          path.resolve(process.cwd(), "client"),
        ]
      : [path.resolve(process.cwd(), "dist", "public"), path.resolve(process.cwd(), "client")];

  return (
    candidates.find((candidate) => existsSync(path.join(candidate, "index.html"))) ?? candidates[0]
  );
}

// Never allow /api/* to fall through to SPA HTML.
router.use("/api", (_req, res) => {
  res.status(404).json({
    ok: false,
    error: {
      code: "API_NOT_FOUND",
      message: "API endpoint not found",
    },
  });
});

const staticPath = resolveStaticPath();
const indexHtmlPath = path.join(staticPath, "index.html");
let cachedIndexHtml: string | null = null;

router.use(express.static(staticPath, { index: false }));

function resolvePrerenderedRoutePath(requestPath: string) {
  const cleanPath = requestPath.split("?")[0]?.split("#")[0] || "/";
  if (cleanPath === "/") return indexHtmlPath;

  const normalized = cleanPath.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!normalized) return indexHtmlPath;

  const candidate = path.join(staticPath, normalized, "index.html");
  return existsSync(candidate) ? candidate : indexHtmlPath;
}

router.get("*", (req, res) => {
  try {
    const htmlPath = resolvePrerenderedRoutePath(req.path);
    const shouldInjectPreloads = htmlPath === indexHtmlPath;
    const template =
      process.env.NODE_ENV === "production" && htmlPath === indexHtmlPath
        ? (cachedIndexHtml ??= readFileSync(indexHtmlPath, "utf8"))
        : readFileSync(htmlPath, "utf8");

    res.type("html").send(shouldInjectPreloads ? injectHeroPreloads(template, req.path) : template);
  } catch (error) {
    console.error("Failed to render app shell", error);
    res.status(500).send("Unable to render app shell.");
  }
});

export default router;
