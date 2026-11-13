// @vitest-environment node
import { describe, expect, it } from "vitest";
import { COMMUNICATIONS, COMMUNICATION_IDS } from "../communications";
import { renderMonolithMessage } from "../render-message";

describe("Monolith communications", () => {
  it.each(COMMUNICATION_IDS)(
    "renders %s into HTML and useful plain text",
    async messageId => {
      const result = await renderMonolithMessage({
        messageId,
        mode: "preview",
        firstName: "Alex",
        reference: "DESIGN-PREVIEW-0001",
      });
      expect(result.subject).toBe(COMMUNICATIONS[messageId].subject);
      expect(/<html\b[^>]*\blang="en"/.test(result.html)).toBe(true);
      expect(result.text.toLowerCase()).toContain(
        COMMUNICATIONS[messageId].heading.toLowerCase()
      );
      expect(result.text).toContain(
        `https://monolithproject.com${COMMUNICATIONS[messageId].href}`
      );
      expect(result.html).not.toMatch(/<script\b/i);
    }
  );

  it("requires recipient unsubscribe and a real sender address before marketing delivery", async () => {
    await expect(
      renderMonolithMessage({ messageId: "monolith-welcome", mode: "delivery" })
    ).rejects.toThrow("unsubscribe");
    await expect(
      renderMonolithMessage({
        messageId: "monolith-welcome",
        mode: "delivery",
        unsubscribeUrl: "https://email.monolithproject.com/unsubscribe/token",
      })
    ).rejects.toThrow("postal address");
    await expect(
      renderMonolithMessage({
        messageId: "monolith-welcome",
        mode: "delivery",
        unsubscribeUrl: "javascript:alert(1)",
        postalAddress: "Test sender address",
      })
    ).rejects.toThrow("HTTPS");
  });

  it("escapes personalisation and receipt references instead of injecting markup", async () => {
    const result = await renderMonolithMessage({
      messageId: "application-received",
      mode: "preview",
      firstName: '<img src=x onerror="alert(1)">',
      reference: "<script>bad()</script>",
    });
    expect(result.html).toContain("&lt;img");
    expect(result.html).toContain("&lt;script&gt;");
    expect(result.html).not.toContain('<img src="x"');
    expect(result.html).not.toContain("<script>");
  });

  it("keeps a saved receipt distinct from a subscribed welcome", async () => {
    const result = await renderMonolithMessage({
      messageId: "signup-saved",
      mode: "preview",
      reference: "FA-PREVIEW-0001",
    });
    expect(result.text).toContain("subscription isn’t confirmed yet");
    expect(result.text).toContain("FA-PREVIEW-0001");
    expect(result.text).not.toContain("You’re on the Monolith list");
    expect(result.text).not.toContain("Email preferences / unsubscribe");
  });

  it("does not turn an application or inquiry into acceptance or marketing", async () => {
    for (const messageId of [
      "application-received",
      "contact-received",
    ] as const) {
      const result = await renderMonolithMessage({
        messageId,
        mode: "preview",
        reference: "PREVIEW-0001",
      });
      expect(result.text).toContain("doesn’t subscribe you to marketing");
      expect(result.text).not.toContain("One project. A few ways to belong");
    }
    const receipt = await renderMonolithMessage({
      messageId: "application-received",
      mode: "preview",
    });
    expect(receipt.text).toContain("isn’t an acceptance");
  });

  it("retains Monolith radio identity and the powering credit", async () => {
    const result = await renderMonolithMessage({
      messageId: "radio-welcome",
      mode: "preview",
    });
    expect(result.text).toContain("Chasing Sunsets Radio");
    expect(result.text).toContain("Powered by sunsets.fm");
    expect(result.text).toContain("separate from event updates");
  });

  it("refuses sample references and local artwork origins in delivery mode", async () => {
    await expect(
      renderMonolithMessage({
        messageId: "signup-saved",
        mode: "delivery",
        reference: "FA-PREVIEW-0001",
      })
    ).rejects.toThrow("real receipt reference");
    await expect(
      renderMonolithMessage({
        messageId: "event-update",
        mode: "delivery",
        assetOrigin: "http://localhost:3041",
      })
    ).rejects.toThrow("public origin");
  });
});
