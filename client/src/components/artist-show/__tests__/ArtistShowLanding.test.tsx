import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import ArtistShowLanding, {
  type ArtistShowLandingConfig,
} from "../ArtistShowLanding";
import { resolveArtistShowRelease } from "@/lib/artistShowRelease";

const templateConfig: ArtistShowLandingConfig = {
  eventId: "template-artist-test-show",
  publicPath: "/template-artist",
  trackingPrefix: "template_artist",
  trackingSource: "template_artist_landing",
  trackingContentName: "Template Artist at Test Room",
  seo: { title: "Template Artist", description: "Template description" },
  theme: {
    ink: "#040404",
    charcoal: "#101010",
    paper: "#f5f0e7",
    accent: "#315caa",
    metal: "#8eb5ff",
    signal: "#d8e6ff",
  },
  brand: {
    presenter: "The Monolith Project",
    homePath: "/",
    locationLine: "Chicago / Template",
  },
  artist: {
    name: "Template Artist",
    nameLines: ["TEMPLATE", "ARTIST"],
    initials: "TA",
    heroImageAlt: "Template Artist portrait",
    profile: {
      kicker: "Artist profile",
      headline: "A reusable profile headline.",
      bio: ["A reusable artist biography supplied by the show configuration."],
      metrics: [{ value: "10K", label: "Community" }],
      facts: [{ label: "Origin", value: "Chicago" }],
    },
  },
  hero: {
    eyebrow: "The Monolith Project presents",
    thesis: ["A configurable thesis."],
    quickFacts: "200 people / 21+",
  },
  story: {
    kicker: "The story",
    headline: "Every artist receives",
    headlineEmphasis: "a distinct chapter.",
    paragraphs: [{ copy: "Reusable story copy." }],
    stampValue: "200",
    stampCopy: "People. One room.",
  },
  sound: {
    kicker: "Watch",
    headline: "Hear the artist first.",
    description: "Approved video only.",
    featured: {
      label: "Featured set",
      title: "Full transmission",
      description: "Reusable featured-video copy.",
      linkLabel: "Watch on YouTube",
    },
    additionalSlots: [],
  },
  conversion: {
    afterProfile: {
      eyebrow: "Know the artist",
      headline: "Continue into the room.",
      note: "One verified checkout.",
      ctaLabel: "Get tickets",
    },
    afterSound: {
      eyebrow: "Hear the signal",
      headline: "Now enter the room.",
      note: "One verified checkout.",
      ctaLabel: "Enter the room",
    },
  },
  event: {
    shortDate: "09.09",
    dateParts: ["09", "09"],
    fullDate: "Wednesday, September 9, 2026",
    venue: "Test Room",
    city: "Chicago",
    capacity: "200",
    age: "21+",
    timingSuffix: "Artist on late",
    detailsHeadline: "The room is the destination.",
    conversionNote: "Verified inventory only.",
  },
  footer: {
    frequency: "Togetherness is the frequency.",
    guide: "Music is the guide.",
    familyLabel: "The Monolith Project family",
    familyLinks: [{ label: "Home", href: "/" }],
    legalLine: "Chicago / Template",
  },
};

describe("ArtistShowLanding template", () => {
  it("renders a completely different artist from configuration alone", () => {
    const release = resolveArtistShowRelease({
      releaseRequested: "false",
      contractCountersigned: "false",
      ticketUrl: "",
      doors: "",
      heroImage: "/images/artists/template/hero.jpg",
      approvedVideoUrls: ["O94vKVHzamk"],
    });

    const { container } = render(
      <HelmetProvider>
        <ArtistShowLanding config={templateConfig} release={release} preview />
      </HelmetProvider>
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Template Artist" })
    ).toBeVisible();
    expect(screen.getByText(/reusable artist biography/i)).toBeVisible();
    expect(screen.getByText("10K")).toBeVisible();
    expect(container.querySelector('iframe[src*="O94vKVHzamk"]')).toBeTruthy();
    expect(container.querySelector(".show-page")).toHaveStyle(
      "--show-accent: #315caa"
    );
    expect(
      container.querySelectorAll('[data-release-gate="closed"]')
    ).toHaveLength(5);
  });

  it("routes every conversion endpoint through one verified checkout", () => {
    const ticketUrl = "https://posh.vip/e/template-artist";
    const release = resolveArtistShowRelease({
      releaseRequested: "true",
      contractCountersigned: "true",
      ticketUrl,
      doors: "Doors 10:00 PM",
      heroImage: "/images/artists/template/hero.jpg",
      approvedVideoUrls: ["O94vKVHzamk"],
    });

    const { container } = render(
      <HelmetProvider>
        <ArtistShowLanding
          config={templateConfig}
          release={release}
          preview={false}
        />
      </HelmetProvider>
    );

    const ticketLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>(`a[href="${ticketUrl}"]`)
    );

    expect(ticketLinks).toHaveLength(5);
    expect(ticketLinks.every(link => link.href === ticketUrl)).toBe(true);
  });
});
