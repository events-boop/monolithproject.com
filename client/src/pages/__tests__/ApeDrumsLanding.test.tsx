import { fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByText(/july 31 \/ kashmir \/ 350 people/i)).toBeVisible();
    expect(
      screen.getByText(/july 31\. kashmir\. a 350-cap room/i)
    ).toBeVisible();
    expect(
      document.querySelectorAll('[data-release-gate="closed"]')
    ).toHaveLength(5);
    expect(
      screen.getByText("Know the story. Then feel it in the room.")
    ).toBeVisible();
    expect(screen.getByText("The next move is into the room.")).toBeVisible();

    // Videos render as click-to-play facades; no YouTube player JS mounts
    // until a visitor presses play.
    expect(document.querySelectorAll("iframe")).toHaveLength(0);
    const playButtons = screen.getAllByRole("button", { name: /^play /i });
    expect(playButtons).toHaveLength(4);
    ["O94vKVHzamk", "K_2PZkxuNLY", "bpG8KPCJ8EM", "Vyo-kk0wRw4"].forEach(id =>
      expect(
        document.querySelector(`img[src*="i.ytimg.com/vi/${id}/"]`)
      ).toBeInTheDocument()
    );
    expect(
      document.querySelector('[data-video-variant="lineage"]')
    ).toHaveTextContent(/major lazer/i);
    expect(
      screen.queryByLabelText("Official video pending approval")
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: /play ape drums — the full transmission/i,
      })
    );
    const featuredFrame = document.querySelector(
      'iframe[src*="youtube-nocookie.com/embed/O94vKVHzamk"]'
    );
    expect(featuredFrame).toBeInTheDocument();
    expect(featuredFrame).toHaveAttribute(
      "src",
      expect.stringContaining("autoplay=1")
    );
    expect(document.querySelectorAll("iframe")).toHaveLength(1);

    expect(
      screen.getByRole("img", {
        name: "Ape Drums July 31 event artwork",
      })
    ).toBeVisible();
    expect(
      screen.queryByLabelText("Approved artist hero image pending")
    ).not.toBeInTheDocument();
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
