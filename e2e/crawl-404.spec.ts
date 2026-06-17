import { test, expect } from "@playwright/test";

test("crawl and audit all internal links for 404s", async ({ page }) => {
  const visited = new Set<string>();
  const queue = ["/"];
  const maxPages = 75; // Capping to keep test execution fast
  const failedLinks: { page: string; href: string; error: string }[] = [];

  while (queue.length > 0 && visited.size < maxPages) {
    const currentPath = queue.shift()!;
    if (visited.has(currentPath)) continue;
    visited.add(currentPath);

    console.log(`Auditing page: ${currentPath}`);
    const response = await page.goto(currentPath);

    // 1. Check HTTP response status code
    const status = response?.status() ?? 0;
    if (status >= 400) {
      failedLinks.push({
        page: currentPath,
        href: currentPath,
        error: `HTTP status ${status}`,
      });
      continue;
    }

    // Wait for transition animation and DOM load state
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(100); // Allow animations/drawers to settle

    const bodyText = await page.locator("body").innerText();

    // 2. Check for SPA client-side 404 components / copy
    if (
      bodyText.includes("This page doesn't exist.") ||
      bodyText.includes("Episode Not Found") ||
      bodyText.includes("Gallery not found") ||
      bodyText.includes("Article Not Found")
    ) {
      failedLinks.push({
        page: currentPath,
        href: currentPath,
        error: "Client-side 404 text detected",
      });
      continue;
    }

    // 3. Extract and queue all internal links
    const hrefs = await page.locator("a[href]").evaluateAll(elements =>
      elements
        .map(el => el.getAttribute("href"))
        .filter((href): href is string => {
          if (!href) return false;
          // Ignore external links, anchors, and protocol prefixes
          if (/^https?:\/\//i.test(href)) return false;
          if (
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("inquiry://")
          )
            return false;
          return true;
        })
    );

    for (const href of hrefs) {
      const url = new URL(href, "http://localhost");
      const normalizedPath = url.pathname;
      if (!visited.has(normalizedPath) && !queue.includes(normalizedPath)) {
        queue.push(normalizedPath);
      }
    }
  }

  console.log(
    `\n--- Link audit complete. Visited ${visited.size} internal pages. ---`
  );
  if (failedLinks.length > 0) {
    console.error("404 Errors Found:\n", JSON.stringify(failedLinks, null, 2));
  }

  expect(failedLinks).toEqual([]);
});
