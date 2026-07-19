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
    expect(
      screen.getByRole("heading", {
        name: /he learned to feel the rhythm/i,
      })
    ).toBeVisible();
    expect(screen.getByText("58K")).toBeVisible();
    expect(screen.getByText("3M")).toBeVisible();
    expect(screen.getByText(/friday, july 31, 2026/i)).toBeVisible();
    expect(
      document.querySelectorAll('[data-release-gate="closed"]')
    ).toHaveLength(3);
    expect(document.querySelectorAll("iframe")).toHaveLength(3);
    expect(
      document.querySelector('iframe[src*="O94vKVHzamk"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('iframe[src*="K_2PZkxuNLY"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('iframe[src*="bpG8KPCJ8EM"]')
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Official video pending approval")
    ).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Approved artist hero image pending")
    ).toBeVisible();
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

  it("redirects the public endpoint while any release dependency is unresolved", () => {
    window.history.replaceState({}, "", "/apedrums");

    render(
      <HelmetProvider>
        <ApeDrumsLanding />
      </HelmetProvider>
    );

    expect(window.location.pathname).toBe("/404");
    expect(
      screen.queryByRole("heading", { level: 1, name: /ape drums/i })
    ).not.toBeInTheDocument();
  });
});
