import { test, expect } from "@playwright/test";

for (const path of ["/story", "/sunsets/"]) {
  for (const initial of [null, "declined", "accepted"]) {
    test(`ManyChat loads once after consent on ${path} (${initial})`, async ({
      page,
    }) => {
      let configLoads = 0;
      let coreLoads = 0;
      await page.addInitScript(value => {
        if (value) localStorage.setItem("monolith_cookie_consent", value);
      }, initial);
      await page.route(
        "https://widget.manychat.com/3868559_7108b.js",
        route => {
          configLoads++;
          return route.fulfill({
            contentType: "application/javascript",
            body: `window.mcwidget={pageId:'3868559'}; if(!document.getElementById('mcwidget-core')){const s=document.createElement('script');s.id='mcwidget-core';s.src='https://mccdn.me/assets/js/widget.js';document.head.appendChild(s);}`,
          });
        }
      );
      await page.route("https://mccdn.me/assets/js/widget.js", route => {
        coreLoads++;
        return route.fulfill({
          contentType: "application/javascript",
          body: "window.MC_PIXEL={test:true};",
        });
      });
      await page.goto(path);
      await expect(page.locator('script[src="/manychat.js"]')).toHaveCount(1);
      if (initial !== "accepted") {
        await page.waitForTimeout(500);
        expect(configLoads).toBe(0);
        expect(coreLoads).toBe(0);
        await page.evaluate(() => {
          localStorage.setItem("monolith_cookie_consent", "accepted");
          window.dispatchEvent(
            new CustomEvent("monolith:cookie-consent-resolved", {
              detail: "accepted",
            })
          );
        });
      }
      await expect.poll(() => coreLoads).toBe(1);
      await page.evaluate(() => {
        window.dispatchEvent(
          new CustomEvent("monolith:cookie-consent-resolved", {
            detail: "accepted",
          })
        );
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "monolith_cookie_consent",
            newValue: "accepted",
          })
        );
      });
      expect(configLoads).toBe(1);
      expect(coreLoads).toBe(1);
      await expect(page.locator("#monolith-manychat-config")).toHaveCount(1);
      await expect(page.locator("#mcwidget-core")).toHaveCount(1);
    });
  }
}
