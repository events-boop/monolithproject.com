import { describe, expect, it } from "vitest";
import { isFirstAccessLeadAnchor, isLakeCampaignPath } from "../MetaPixelGate";

describe("MetaPixelGate", () => {
  it("suppresses the brand pixel gate on Lake campaign routes", () => {
    expect(isLakeCampaignPath("/lake")).toBe(true);
    expect(isLakeCampaignPath("/lake/")).toBe(true);
    expect(isLakeCampaignPath("/lake/first-access")).toBe(true);
    expect(isLakeCampaignPath("/Lake")).toBe(true);
  });

  it("keeps the brand pixel gate enabled on general Monolith routes", () => {
    expect(isLakeCampaignPath("/")).toBe(false);
    expect(isLakeCampaignPath("/sunsets")).toBe(false);
    expect(isLakeCampaignPath("/story")).toBe(false);
    expect(isLakeCampaignPath("/events/css-jul04")).toBe(false);
  });

  it("does not treat campaign-owned Lake CTAs as brand Lead anchors", () => {
    const anchor = document.createElement("a");
    anchor.href = "https://laylo.com/monolithproject/luYXPr";
    anchor.textContent = "Join the Lake List";
    anchor.setAttribute("data-campaign-lead", "lake");

    expect(isFirstAccessLeadAnchor(anchor)).toBe(false);
  });

  it("does not treat ticket CTAs as Lead anchors", () => {
    const anchor = document.createElement("a");
    anchor.href = "/go/tickets/css-jul04";
    anchor.textContent = "July 4 Ticket Access";

    expect(isFirstAccessLeadAnchor(anchor)).toBe(false);
  });

  it("still recognizes non-campaign first-access waitlist anchors", () => {
    const anchor = document.createElement("a");
    anchor.href = "https://laylo.com/monolithproject/luYXPr";
    anchor.textContent = "Get First Access";

    expect(isFirstAccessLeadAnchor(anchor)).toBe(true);
  });
});
