import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import LolaPopupFrame from "../LolaPopupFrame";

describe("LolaPopupFrame", () => {
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
