import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  COMMUNICATION_IDS,
  COMMUNICATIONS,
  isCommunicationId,
} from "../server/emails/communications";
import { renderMonolithMessage } from "../server/emails/render-message";

// Deliberately separate from Express, Vite, live routes, environment loaders,
// provider clients and databases. Bound to loopback; no source is uploaded.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.MONOLITH_EMAIL_PREVIEW_PORT || 3041);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error("Invalid preview port");
const origin = `http://localhost:${port}`;
const ui = resolve(root, "scripts/email-preview");
const publicRoot = resolve(root, "client/public");
const assets = new Set(
  COMMUNICATION_IDS.map(id => COMMUNICATIONS[id].image).filter(Boolean)
);
const files: Record<string, [string, string]> = {
  "/": [resolve(ui, "index.html"), "text/html; charset=utf-8"],
  "/preview.css": [resolve(ui, "preview.css"), "text/css; charset=utf-8"],
  "/preview.mjs": [
    resolve(ui, "preview.mjs"),
    "application/javascript; charset=utf-8",
  ],
};

const server = createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'"
  );
  if (
    ![`localhost:${port}`, `127.0.0.1:${port}`].includes(req.headers.host || "")
  ) {
    res.writeHead(403).end("Local preview only");
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.writeHead(405).end("Preview is read-only");
    return;
  }
  try {
    const url = new URL(req.url || "/", origin);
    const route = url.pathname;
    if (files[route]) {
      const [file, mime] = files[route];
      res.setHeader("Content-Type", mime);
      const content = await readFile(file);
      res.end(req.method === "HEAD" ? undefined : content);
      return;
    }
    if (route === "/catalog.json") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(COMMUNICATIONS));
      return;
    }
    const match = /^\/(email|text)\/([a-z-]+)$/.exec(route);
    if (match && isCommunicationId(match[2])) {
      const id = match[2];
      const reference =
        id === "application-received"
          ? "HOF-PREVIEW-0001"
          : id === "contact-received"
            ? "MSG-PREVIEW-0001"
            : "FA-PREVIEW-0001";
      const result = await renderMonolithMessage({
        messageId: id,
        mode: "preview",
        firstName: "Alex",
        reference,
        assetOrigin: `http://${req.headers.host}`,
        unsubscribeUrl: `http://${req.headers.host}/preferences-preview`,
      });
      res.setHeader(
        "Content-Type",
        match[1] === "email"
          ? "text/html; charset=utf-8"
          : "text/plain; charset=utf-8"
      );
      res.end(
        req.method === "HEAD"
          ? undefined
          : result[match[1] === "email" ? "html" : "text"]
      );
      return;
    }
    if (
      assets.has(
        route as (typeof COMMUNICATIONS)[keyof typeof COMMUNICATIONS]["image"]
      )
    ) {
      const content = await readFile(resolve(publicRoot, `.${route}`));
      res.setHeader(
        "Content-Type",
        route.endsWith(".webp") ? "image/webp" : "image/jpeg"
      );
      res.end(req.method === "HEAD" ? undefined : content);
      return;
    }
    if (route === "/preferences-preview") {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(
        "Design preview only. No mailing-list preferences were changed. Recipient-specific preference and unsubscribe links are required before sending."
      );
      return;
    }
    res.writeHead(404).end("Preview not found");
  } catch {
    res.writeHead(500).end("The local design preview could not be rendered.");
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Monolith communications preview: ${origin}`);
  console.log(
    "Local design only. No database, providers, sends, or live routes."
  );
});
