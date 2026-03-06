import { access, readFile, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import contactModule from "../netlify/functions/contact.js";
import healthzModule from "../netlify/functions/healthz.js";
import joinModule from "../netlify/functions/join.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.join(projectRoot, "dist", "public");

const routeHandlers = {
  "/api/contact": contactModule.handler,
  "/api/join": joinModule.handler,
  "/api/healthz": healthzModule.handler
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function getContentType(filePath) {
  return contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function getPathType(targetPath) {
  try {
    const stats = await stat(targetPath);
    if (stats.isDirectory()) {
      return "directory";
    }

    if (stats.isFile()) {
      return "file";
    }

    return "other";
  } catch {
    return null;
  }
}

async function resolveStaticPath(urlPathname) {
  const safePathname = decodeURIComponent(urlPathname.split("?")[0]);
  if (safePathname.includes("\0")) {
    return null;
  }

  const normalized = path.posix.normalize(safePathname);
  if (normalized.startsWith("../")) {
    return null;
  }

  const stripped = normalized.replace(/^\/+/, "");
  let candidatePath = path.join(distRoot, stripped);

  if (!stripped) {
    candidatePath = path.join(distRoot, "index.html");
  }

  if ((await getPathType(candidatePath)) === "file") {
    return candidatePath;
  }

  const indexCandidate = path.join(distRoot, stripped, "index.html");
  if ((await getPathType(candidatePath)) === "directory" && (await getPathType(indexCandidate)) === "file") {
    return indexCandidate;
  }

  if ((await getPathType(indexCandidate)) === "file") {
    return indexCandidate;
  }

  return null;
}

async function buildFileResponse(filePath, statusCode = 200, includeBody = true) {
  return {
    statusCode,
    headers: {
      "content-type": getContentType(filePath),
      "cache-control": "no-store"
    },
    body: includeBody ? await readFile(filePath) : ""
  };
}

async function handleFunctionRequest({ method, headers, body }, handler) {
  const response = await handler({
    httpMethod: method || "GET",
    headers,
    body
  });

  return {
    statusCode: response.statusCode || 200,
    headers: response.headers || {},
    body: response.body || ""
  };
}

async function handleStaticRequest(method, pathname) {
  const resolvedPath = await resolveStaticPath(pathname);
  if (resolvedPath) {
    return buildFileResponse(resolvedPath, 200, method !== "HEAD");
  }

  const notFoundPath = path.join(distRoot, "404.html");
  if (await pathExists(notFoundPath)) {
    return buildFileResponse(notFoundPath, 404, method !== "HEAD");
  }

  return {
    statusCode: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8"
    },
    body: method === "HEAD" ? "" : "Not found"
  };
}

export async function ensureBuildOutput() {
  const indexPath = path.join(distRoot, "index.html");
  if (!(await pathExists(indexPath))) {
    throw new Error("Missing dist/public/index.html. Run `npm run build` first.");
  }
}

export function createPreviewServer() {
  return http.createServer(async (req, res) => {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const response = await handlePreviewRequest({
        method: req.method || "GET",
        url: req.url || "/",
        headers: req.headers,
        body: Buffer.concat(chunks).toString("utf8")
      });
      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
    } catch (error) {
      res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, error: "Preview server error." }));
    }
  });
}

export async function handlePreviewRequest({
  method = "GET",
  url = "/",
  headers = {},
  body = ""
} = {}) {
  await ensureBuildOutput();

  const requestUrl = new URL(url, "http://127.0.0.1");
  const pathname = requestUrl.pathname;

  if (routeHandlers[pathname]) {
    return handleFunctionRequest({ method, headers, body }, routeHandlers[pathname]);
  }

  if (method !== "GET" && method !== "HEAD") {
    return {
      statusCode: 405,
      headers: {
        allow: "GET, HEAD"
      },
      body: ""
    };
  }

  return handleStaticRequest(method, pathname);
}

export async function startPreviewServer({ port = Number(process.env.PORT) || 4173 } = {}) {
  await ensureBuildOutput();
  const server = createPreviewServer();

  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

  return {
    port,
    server,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      })
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const { port } = await startPreviewServer();
    console.log(`Preview server running at http://127.0.0.1:${port}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
