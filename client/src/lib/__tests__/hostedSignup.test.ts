import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import hostedForms from "@shared/signup-forms.json";

const script = readFileSync("client/public/sunsets/app.js", "utf8");
const page = readFileSync("client/public/sunsets/index.html", "utf8");
afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

function loadForms(payload: unknown) {
  document.body.innerHTML = page;
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => payload });
  vi.stubGlobal("fetch", fetchMock);
  // Execute the actual static-page script against the DOM fixture; no browser or network.
  new Function(script)();
  return fetchMock;
}

describe("hosted signup handoff", () => {
  it("keeps event and radio audiences distinct without posting or claiming success", async () => {
    const fetchMock = loadForms({
      audiences: { event: false, radio: false },
      hostedForms,
    });
    for (const audience of ["event", "radio"] as const) {
      const form = document.querySelector<HTMLFormElement>(
        `form[data-audience="${audience}"]`
      )!;
      const link =
        form.parentElement!.querySelector<HTMLAnchorElement>(
          ".signup-fallback a"
        )!;
      await vi.waitFor(() => expect(link.href).toBe(hostedForms[audience]));
      expect(form.hidden).toBe(true);
      expect(link.target).toBe("_blank");
      expect(link.rel).toContain("noopener");
      expect(form.parentElement!.textContent).toContain(
        "Confirm your email from your inbox"
      );
    }
    expect(new Set(Object.values(hostedForms)).size).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]).not.toHaveProperty("method", "POST");
  });

  it("keeps the email-request fallback when a hosted URL is untrusted", async () => {
    loadForms({
      audiences: {},
      hostedForms: {
        event: "https://example.com/collect",
        radio: "javascript:alert(1)",
      },
    });
    await new Promise(resolve => setTimeout(resolve, 0));
    for (const link of document.querySelectorAll<HTMLAnchorElement>(
      ".signup-fallback a"
    )) {
      expect(link.href).toMatch(/^mailto:/);
    }
    for (const fieldset of document.querySelectorAll<HTMLFieldSetElement>(
      ".signup-form fieldset"
    )) {
      expect(fieldset.disabled).toBe(true);
    }
  });
});
