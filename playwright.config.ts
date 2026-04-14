import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "NODE_ENV=production PORT=5001 HOST=127.0.0.1 node dist/index.js",
      port: 5001,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      // Bind to localhost so this works in restricted environments (CI/sandboxes).
      command: "npx vite preview --port 4173 --strictPort --host 127.0.0.1",
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
