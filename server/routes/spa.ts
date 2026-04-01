import { Router } from "express";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { injectHeroPreloads } from "../services/hero-preloads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

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

const staticPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "public")
    : path.resolve(__dirname, "..", "..", "dist", "public");
const indexHtmlPath = path.join(staticPath, "index.html");
let cachedIndexHtml: string | null = null;

router.use(express.static(staticPath, { index: false }));

router.get("*", (req, res) => {
  try {
    const template =
      process.env.NODE_ENV === "production"
        ? (cachedIndexHtml ??= readFileSync(indexHtmlPath, "utf8"))
        : readFileSync(indexHtmlPath, "utf8");

    res.type("html").send(injectHeroPreloads(template, req.path));
  } catch (error) {
    console.error("Failed to render app shell", error);
    res.status(500).send("Unable to render app shell.");
  }
});

export default router;
