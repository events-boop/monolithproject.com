import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlobalAudioProvider } from "@/contexts/AudioContext";
import { InquiryProvider } from "@/contexts/InquiryContext";
import { UIProvider } from "@/contexts/UIContext";
import FixedTicketBadge from "@/components/FixedTicketBadge";
import StickyPlayer from "@/components/StickyPlayer";
import Partners from "@/pages/Partners";
import Press from "@/pages/Press";
import Radio from "@/pages/Radio";
import { useGlobalAudio } from "@/contexts/AudioContext";

vi.mock("@/components/GlobalListenerMap", () => ({
  default: () => <div data-testid="mock-listener-map" />,
}));

vi.mock("@/components/RadioGlobe", () => ({
  default: () => <div data-testid="mock-radio-globe" />,
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <UIProvider>
        <InquiryProvider>
          <GlobalAudioProvider>{ui}</GlobalAudioProvider>
        </InquiryProvider>
      </UIProvider>
    </HelmetProvider>
  );
}

describe("UX audit surgical fixes", () => {
  beforeEach(() => {
    if (!window.matchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    }
    if (!("IntersectionObserver" in window)) {
      class MockIntersectionObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
      vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("removes unverified placeholder press quotes from Press", () => {
    const { container } = renderWithProviders(<Press />);

    expect(container.textContent).not.toContain("Chicago Scene");
    expect(container.textContent).not.toContain("Resident Advisor");
    expect(container.textContent).not.toContain("Chicago Reader");
    expect(container.textContent).not.toContain("Coverage examples");
  });

  it("renders verified production and venue copy plus July 4 proof on Partners", () => {
    renderWithProviders(<Partners />);

    expect(screen.getByText("PRODUCTION CREW")).toBeInTheDocument();
    expect(screen.getByText("VENUE PARTNERS")).toBeInTheDocument();
    expect(
      screen.getByText(/10-hour gathering · 2,800 attendees/i)
    ).toBeInTheDocument();
  });

  it("keeps FixedTicketBadge hidden when zero events are on-sale", () => {
    const { container } = renderWithProviders(<FixedTicketBadge />);

    expect(container).toBeEmptyDOMElement();
  });

  it("toggles Radio playback heading from FEATURED EPISODE to NOW SPINNING on player load", () => {
    renderWithProviders(<Radio />);

    expect(
      screen.getByRole("heading", { name: /featured episode/i })
    ).toBeInTheDocument();

    // The deck's own play button replaced the "Load the player" prompt.
    fireEvent.click(
      screen.getByRole("button", {
        name: /^play live set from marbella part ii$/i,
      })
    );

    expect(
      screen.getByRole("heading", { name: /now spinning/i })
    ).toBeInTheDocument();
  });

  it("renders StickyPlayer when an active track is loaded in GlobalAudioProvider", () => {
    function Harness() {
      const { loadTrack } = useGlobalAudio();
      return (
        <>
          <button
            type="button"
            onClick={() =>
              loadTrack({
                slug: "ep-004-benchek-part-2",
                title: "Live Set from Marbella Part II",
                artist: "BENCHEK",
                src: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/test",
              })
            }
          >
            Trigger Track
          </button>
          <StickyPlayer />
        </>
      );
    }

    renderWithProviders(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Trigger Track" }));

    expect(
      screen.getByRole("region", { name: "Persistent audio player" })
    ).toBeInTheDocument();
    expect(screen.getByText("NOW SPINNING")).toBeInTheDocument();
  });
});
