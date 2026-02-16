#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const distPublicDir = path.join(process.cwd(), "dist", "public");

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function shouldGzip(ext) {
  return [".js", ".css", ".html", ".json", ".svg", ".txt", ".map"].includes(ext);
}

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full)));
      continue;
    }
    if (entry.isFile()) files.push(full);
  }
  return files;
}

if (!(await pathExists(distPublicDir))) {
  console.error(`ERROR: ${distPublicDir} not found. Run "npm run build" first.`);
  process.exit(1);
}

const buckets = [
  { name: "assets", dir: path.join(distPublicDir, "assets") },
  { name: "images", dir: path.join(distPublicDir, "images") },
  { name: "videos", dir: path.join(distPublicDir, "videos") },
];

const allFiles = [];
for (const bucket of buckets) {
  if (await pathExists(bucket.dir)) {
    allFiles.push(...(await listFilesRecursive(bucket.dir)));
  }
}

const records = [];
for (const absolutePath of allFiles) {
  const rel = path.relative(distPublicDir, absolutePath).split(path.sep).join("/");
  const ext = path.extname(rel).toLowerCase();
  const stat = await fs.stat(absolutePath);
  const sizeBytes = stat.size;

  let gzipBytes = null;
  if (shouldGzip(ext)) {
    const buf = await fs.readFile(absolutePath);
    gzipBytes = zlib.gzipSync(buf, { level: 9 }).length;
  }

  records.push({
    path: rel,
    ext: ext || "none",
    bytes: sizeBytes,
    gzipBytes,
  });
}

const totalsByExt = {};
let totalBytes = 0;
for (const r of records) {
  totalBytes += r.bytes;
  totalsByExt[r.ext] = (totalsByExt[r.ext] || 0) + r.bytes;
}

const sorted = [...records].sort((a, b) => b.bytes - a.bytes);
const top = sorted.slice(0, 20);

const report = {
  generatedAt: new Date().toISOString(),
  totalBytes,
  totalsByExt,
  topFiles: top,
};

const reportJsonPath = path.join(distPublicDir, "bundle-report.json");
await fs.writeFile(reportJsonPath, JSON.stringify(report, null, 2));

const maxTopBytes = top[0]?.bytes || 1;
const rowsHtml = top
  .map((r) => {
    const widthPct = Math.max(2, Math.round((r.bytes / maxTopBytes) * 100));
    const gzip = r.gzipBytes != null ? formatBytes(r.gzipBytes) : "—";
    return `
      <tr>
        <td class="path">${r.path}</td>
        <td class="num">${formatBytes(r.bytes)}</td>
        <td class="num">${gzip}</td>
        <td class="barcell"><div class="bar" style="width:${widthPct}%"></div></td>
      </tr>
    `;
  })
  .join("\n");

const totalsRowsHtml = Object.entries(totalsByExt)
  .sort((a, b) => b[1] - a[1])
  .map(([ext, bytes]) => `<tr><td>${ext}</td><td class="num">${formatBytes(bytes)}</td></tr>`)
  .join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bundle Report</title>
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; background: #0a0a0a; color: #f5f5f5; font-family: ui-sans-serif, system-ui; }
      .wrap { max-width: 1100px; margin: 0 auto; padding: 28px 18px 60px; }
      h1 { margin: 0 0 6px; font-size: 22px; letter-spacing: 0.08em; text-transform: uppercase; }
      p { margin: 0 0 18px; color: rgba(245,245,245,0.65); font-size: 13px; }
      .grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
      .card { border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); padding: 16px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 10px 8px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12px; vertical-align: top; }
      th { text-align: left; color: rgba(245,245,245,0.65); font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; }
      .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
      .path { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; }
      .barcell { width: 30%; }
      .bar { height: 10px; background: linear-gradient(90deg,#E05A3A,#E8B86D); border-radius: 999px; opacity: 0.85; }
      .kpi { display: flex; gap: 14px; flex-wrap: wrap; margin: 14px 0 0; }
      .pill { border: 1px solid rgba(255,255,255,0.12); padding: 8px 10px; border-radius: 999px; font-size: 12px; }
      .pill strong { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>Bundle Report</h1>
      <p>Generated at ${report.generatedAt}. Output: <span class="path">dist/public/bundle-report.json</span></p>
      <div class="kpi">
        <div class="pill">Total (dist/public): <strong>${formatBytes(report.totalBytes)}</strong></div>
        <div class="pill">Top file: <strong>${top[0]?.path || "—"}</strong></div>
      </div>
      <div class="grid">
        <div class="card">
          <h2 style="margin:0 0 12px;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;">Largest Files</h2>
          <table>
            <thead>
              <tr>
                <th>Path</th>
                <th class="num">Size</th>
                <th class="num">Gzip</th>
                <th>Scale</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
        <div class="card">
          <h2 style="margin:0 0 12px;font-size:14px;letter-spacing:0.12em;text-transform:uppercase;">Totals By Extension</h2>
          <table>
            <thead>
              <tr>
                <th>Ext</th>
                <th class="num">Bytes</th>
              </tr>
            </thead>
            <tbody>
              ${totalsRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>`;

const reportHtmlPath = path.join(distPublicDir, "bundle-report.html");
await fs.writeFile(reportHtmlPath, html);

console.log(`Bundle report written: ${path.relative(process.cwd(), reportHtmlPath)}`);
console.log(`Total dist/public: ${formatBytes(totalBytes)}`);
console.log("Top files:");
for (const r of top.slice(0, 8)) {
  console.log(`- ${formatBytes(r.bytes).padStart(8)}  ${r.path}`);
}
