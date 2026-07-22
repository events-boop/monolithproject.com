import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    launchOptions: {
      args: [
        "--host-resolver-rules=MAP monolithproject.com 127.0.0.1,MAP sunsets.vip 127.0.0.1",
      ],
    },
    trace: "on-first-retry",
  },
  webServer: [
    {
      // Port 5002 is reserved for e2e so the suite can never silently reuse
      // the dev API on 5001, which runs without TRUST_PROXY_HEADERS and
      // collapses every synthetic client IP into one rate-limit bucket.
      command:
        "NODE_ENV=production PORT=5002 HOST=127.0.0.1 TRUST_PROXY_HEADERS=true RATE_LIMIT_DEBUG_HEADERS=true node dist/index.js",
      port: 5002,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      // Bind to localhost so this works in restricted environments (CI/sandboxes).
      command:
        "VITE_API_TARGET=http://127.0.0.1:5002 npx vite preview --port 4173 --strictPort --host 127.0.0.1",
      port: 4173,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
