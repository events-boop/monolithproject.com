import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HelmetProvider } from "react-helmet-async";
import { beforeEach, describe, expect, it } from "vitest";
import ApeDrumsLanding from "../ApeDrumsLanding";

describe("Ape Drums private landing preview", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/sandbox/ape-drums");
  });

  it("renders the complete story while keeping every conversion endpoint locked", () => {
    render(
      <HelmetProvider>
        <ApeDrumsLanding />
      </HelmetProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /ape drums/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/some bookings happen in a week/i)).toBeVisible();
    expect(screen.getByText(/friday, july 31, 2026/i)).toBeVisible();
    expect(
      document.querySelectorAll('[data-release-gate="closed"]')
    ).toHaveLength(3);
    expect(document.querySelectorAll("iframe")).toHaveLength(0);
    expect(
      screen.getAllByLabelText("Official video pending approval")
    ).toHaveLength(3);
    expect(
      document.querySelector('a[href^="https://posh.vip"]')
    ).not.toBeInTheDocument();
  });

  it("contains none of the prohibited event-adjacency language", () => {
    render(
      <HelmetProvider>
        <ApeDrumsLanding />
      </HelmetProvider>
    );

    const renderedCopy = document.body.textContent?.toLowerCase() || "";
    const prohibited = [
      "lolla" + "palooza",
      "lol" + "la",
      "official after" + "show",
    ];

    prohibited.forEach(term => expect(renderedCopy).not.toContain(term));
  });
});
