import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import FamilyEventPromo from "../FamilyEventPromo";
import { FAMILY_PROMO } from "@/content/familyPromo";

describe("FamilyEventPromo", () => {
  it("renders the current family booking as a single card to the show page", () => {
    render(<FamilyEventPromo />);

    const link = screen.getByRole("link", { name: /ape drums/i });
    expect(link).toHaveAttribute("href", "/apedrums");
    expect(screen.getByText("Next in the Monolith family")).toBeVisible();
    expect(
      screen.getByText(/friday, july 31 · kashmir · chicago/i)
    ).toBeVisible();
    expect(
      screen.getByRole("img", { name: "Ape Drums July 31 event artwork" })
    ).toHaveAttribute(
      "src",
      expect.stringContaining("ape-drums-july31-square")
    );
  });

  it("keeps the promo config-driven so the slot flips with the release gate", () => {
    expect(FAMILY_PROMO?.href).toBe("/apedrums");
  });
});
