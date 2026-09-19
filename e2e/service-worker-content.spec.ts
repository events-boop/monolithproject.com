import { createServer, type Server } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve, extname } from "node:path";
import { test, expect } from "./fixtures/event-notice-dismissed";

let server: Server;
let origin: string;
let revision = "first-publication";
const root = resolve("dist/public");
test.beforeAll(async () => {
  server = createServer((req, res) => {
    const pathname = new URL(req.url!, "http://localhost").pathname;
    if (pathname.startsWith("/api/")) { res.writeHead(503); res.end(); return; }
    const file = resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root + "/") || !existsSync(file) || !statSync(file).isFile()) {res.writeHead(404); res.end(); return;}
    const types: Record<string,string> = {".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".json":"application/json", ".webmanifest":"application/manifest+json", ".woff2":"font/woff2", ".svg":"image/svg+xml", ".webp":"image/webp", ".avif":"image/avif", ".png":"image/png", ".jpg":"image/jpeg"};
    res.setHeader("Content-Type",types[extname(file)]||"application/octet-stream");
    res.setHeader("Cache-Control","no-store");
    const body=readFileSync(file);
    res.end(pathname === "/" ? body.toString().replace("</head>",`<meta name="qa-publication" content="${revision}"></head>`) : body);
  });
  await new Promise<void>(done=>server.listen(0,"127.0.0.1",done));
  const address=server.address() as {port:number};
  origin=`http://127.0.0.1:${address.port}`;
});
test.afterAll(async()=>{await new Promise<void>(done=>server.close(()=>done()));});

test("returning visitors receive fresh HTML under the same active worker", async ({page,context})=>{
  test.setTimeout(60000);
  await page.goto(origin);
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.reload();
  await expect(page.locator('meta[name="qa-publication"]')).toHaveAttribute("content","first-publication");
  const worker = await page.evaluate(()=>navigator.serviceWorker.controller!.scriptURL);
  revision="updated-weather-publication";
  await page.reload();
  await expect(page.locator('meta[name="qa-publication"]')).toHaveAttribute("content","updated-weather-publication");
  expect(await page.evaluate(()=>navigator.serviceWorker.controller!.scriptURL)).toBe(worker);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('meta[name="qa-publication"]')).toHaveAttribute("content","updated-weather-publication");
  await context.setOffline(false);
});
