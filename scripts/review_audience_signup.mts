// Run after direct Vite/esbuild compilation documented in docs/AUDIENCE_SIGNUP.md.
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
const children: ChildProcess[] = [];
function service(args: string[], env: Record<string, string>) {
  const child = spawn(process.execPath, args, {
    stdio: "ignore",
    env: { ...process.env, ...env },
  });
  children.push(child);
  return child;
}
async function ready(url: string, child: ChildProcess) {
  for (let i = 0; i < 70; i++) {
    if (child.exitCode !== null)
      throw Error("Temporary review server stopped.");
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(500) })).ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  throw Error("Temporary review server did not start.");
}
const browser = await chromium.launch({ headless: true });
try {
  const api = service(["dist/audience-review-api.js"], {
    NODE_ENV: "development",
    HOST: "127.0.0.1",
    PORT: "5188",
    DATABASE_URL: "",
    LEAD_PROVIDER: "disabled",
    AUDIENCE_SIGNUP_CONTROLLED_ENABLED: "false",
    AUDIENCE_INTAKE_URL: "",
    AUDIENCE_INTAKE_TOKEN: "",
    AUDIENCE_RELEASE_ID: "",
  });
  await ready("http://127.0.0.1:5188/api/health", api);
  const dev = service(
    [
      "node_modules/vite/bin/vite.js",
      "--host",
      "127.0.0.1",
      "--port",
      "3188",
      "--strictPort",
    ],
    { VITE_API_TARGET: "http://127.0.0.1:5188" }
  );
  const prod = service(
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      "4188",
      "--strictPort",
    ],
    { VITE_API_TARGET: "http://127.0.0.1:5188" }
  );
  await Promise.all([
    ready("http://127.0.0.1:3188/newsletter", dev),
    ready("http://127.0.0.1:4188/newsletter", prod),
  ]);
  const context = await browser.newContext({
    viewport: { width: 1512, height: 1050 },
  });
  // This local check cannot send data or assets to any external site/provider.
  await context.route("**/*", route =>
    new URL(route.request().url()).hostname === "127.0.0.1"
      ? route.continue()
      : route.abort()
  );
  const page = await context.newPage(),
    requests: { submissionId: string }[] = [],
    errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  let legacyCalls = 0;
  page.on("request", r => {
    if (
      r.method() === "POST" &&
      new URL(r.url()).pathname === "/api/audience-signup"
    )
      requests.push(r.postDataJSON());
    if (
      r.method() === "POST" &&
      ["/api/leads", "/api/track/lead"].includes(new URL(r.url()).pathname)
    )
      legacyCalls++;
  });
  await page.goto(
    "http://127.0.0.1:3188/newsletter?audience_preview=1&utm_source=local_review"
  );
  const form = page.locator(".monolith-signup"),
    email = form.getByRole("textbox", { name: "Email Required", exact: true }),
    phone = form.getByRole("textbox", { name: "Phone Optional", exact: true }),
    ig = form.getByRole("textbox", { name: "Instagram Optional", exact: true }),
    button = form.getByRole("button", { name: "Get updates", exact: true });
  await expect(button).toBeEnabled();
  await expect(form.getByRole("checkbox")).toHaveCount(2);
  for (const cb of await form.getByRole("checkbox").all())
    await expect(cb).not.toBeChecked();
  assert.equal(await phone.getAttribute("required"), null);
  assert.equal(await ig.getAttribute("required"), null);
  assert.equal(
    await form.locator('input[name="firstName"], input[name="age"]').count(),
    0
  );
  await button.click();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  assert.equal(requests.length, 0);
  await email.fill("synthetic@example.test");
  await button.click();
  // The existing dev proxy/origin guard may reject before the disabled bridge.
  // Local traffic is never relabeled as canonical Monolith traffic for this check.
  await expect(form.getByRole("alert")).toContainText("couldn’t");
  await expect(email).toHaveValue("synthetic@example.test");
  await expect(form.getByRole("status")).toHaveCount(0);
  await button.click();
  await expect(button).toBeEnabled();
  assert.equal(requests.length, 2);
  assert.equal(requests[0].submissionId, requests[1].submissionId);
  await ig.fill("@synthetic.fan");
  await button.click();
  await expect(button).toBeEnabled();
  assert.equal(requests.length, 3);
  assert.notEqual(requests[1].submissionId, requests[2].submissionId);
  await email.fill("");
  await ig.fill("");
  await mkdir("test-results/audience-signup-local", { recursive: true });
  await page.screenshot({
    path: "test-results/audience-signup-local/desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/audience-signup-local/mobile.png",
    fullPage: true,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  );
  await expect(email).toBeVisible();
  assert.equal(legacyCalls, 0);
  assert.deepEqual(errors, []);
  await page.goto("http://127.0.0.1:3188/newsletter");
  await expect(
    page.getByRole("heading", { name: "GET MONOLITH UPDATES", exact: true })
  ).toBeVisible();
  await expect(page.locator(".monolith-signup")).toHaveCount(0);
  await page.goto("http://127.0.0.1:4188/newsletter?audience_preview=1");
  await expect(
    page.getByRole("heading", { name: "GET MONOLITH UPDATES", exact: true })
  ).toBeVisible();
  await expect(page.locator(".monolith-signup")).toHaveCount(0);
  assert.equal(legacyCalls, 0);
  console.log(
    "Local website desktop/mobile, simple independent fields, fail-closed capture, stable retries, no legacy lead sends and unchanged normal/production newsletter pass."
  );
} finally {
  await browser.close();
  await Promise.all(
    children.map(async child => {
      if (child.exitCode !== null) return;
      child.kill("SIGTERM");
      await new Promise(r => child.once("close", r));
    })
  );
}
