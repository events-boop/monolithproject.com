import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import LolaPopupFrame from "../LolaPopupFrame";

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("@/content/familyPromo");
});

describe("LolaPopupFrame", () => {
  it("renders nothing while the release gate is closed", async () => {
    vi.resetModules();
    vi.doMock("@/content/familyPromo", () => ({ FAMILY_PROMO: null }));
    const { default: GatedFrame } = await import("../LolaPopupFrame");

    const { container } = render(<GatedFrame layout="stacked" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("links the release-gated announcement to the internal Ape Drums page", () => {
    render(<LolaPopupFrame layout="stacked" />);

    expect(
      screen.getByRole("heading", { name: "The Lola Pop-Up Weekend" })
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View Ape Drums event details" })
    ).toHaveAttribute("href", "/apedrums");
    expect(
      screen.getByRole("img", {
        name: /ape drums.*friday, july 31.*west loop/i,
      })
    ).toBeVisible();
  });
});
