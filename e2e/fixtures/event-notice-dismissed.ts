import { test as base, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const event = JSON.parse(readFileSync("shared/events/sunsets-page.json", "utf8"));
// Layout/form regressions exercise the underlying page after the notice is read.
// event-notice.spec.ts separately verifies first visit, dismissal and reopening.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(
      revision =>
        sessionStorage.setItem("monolith:event-notice:" + revision, "seen"),
      event.updatedAt
    );
    await use(page);
  },
});
export { expect };
