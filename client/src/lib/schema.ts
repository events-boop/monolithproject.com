import { POSH_TICKET_URL, ScheduledEvent } from "@/data/events";
import type { RadioEpisode } from "@/data/radioEpisodes";
import type { ArtistData } from "@/data/artists";

import { getEventById, getEventWindowStatus } from "@/lib/siteExperience";

export const SITE_ORIGIN = "https://monolithproject.com";
export const FACTS_PAGE_PATH = "/chasing-sunsets-facts";
export const RADIO_HUB_PATH = "/radio";
export const CHASING_SUNSETS_PATH = "/chasing-sunsets";

const RA_PROMOTER_PROFILE_URL: string | null = null;

const organizationSameAs = [
  "https://instagram.com/monolithproject.events",
  "https://youtube.com/@monolithproject",
].concat(RA_PROMOTER_PROFILE_URL ? [RA_PROMOTER_PROFILE_URL] : []);

const brandSameAs = [
  "https://instagram.com/chasingsunsets.music",
  "https://soundcloud.com/chasing-sun-sets",
  "https://youtube.com/@monolithproject",
].concat(RA_PROMOTER_PROFILE_URL ? [RA_PROMOTER_PROFILE_URL] : []);

export const CHASING_BRAND_NAMES = [
  "Chasing Sun(Sets)",
  "Chasing Sunsets",
  "The Monolith Project Presents: Chasing Sun(Sets)",
];

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (isAbsoluteUrl(pathOrUrl)) return pathOrUrl;
  return `${SITE_ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function buildSitewideIdentitySchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: "The Monolith Project",
        description:
          "Chicago house music events, Chasing Sun(Sets), Untold Story, and artist-led radio from The Monolith Project.",
        inLanguage: "en-US",
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      {
        "@type": ["Organization", "MusicGroup"],
        "@id": `${SITE_ORIGIN}/#organization`,
        name: "The Monolith Project",
        url: SITE_ORIGIN,
        description:
          "The Monolith Project produces Chicago house music events, open-air Chasing Sun(Sets), Untold Story nights, and artist-led radio.",
        sameAs: organizationSameAs,
        brand: { "@id": `${SITE_ORIGIN}/#brand-chasing-sunsets` },
      },
      {
        "@type": "Brand",
        "@id": `${SITE_ORIGIN}/#brand-chasing-sunsets`,
        name: "Chasing Sun(Sets)",
        alternateName: CHASING_BRAND_NAMES,
        description:
          "Chicago-based sunset house music event series and radio show by The Monolith Project.",
        url: toAbsoluteUrl(CHASING_SUNSETS_PATH),
        sameAs: brandSameAs,
        isPartOf: { "@id": `${SITE_ORIGIN}/#organization` },
      },
    ],
  };
}

export function buildFactsPageSchema() {
  const pageUrl = toAbsoluteUrl(FACTS_PAGE_PATH);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebPage", "AboutPage"],
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Chasing Sun(Sets) Facts | Chicago Sunset House Music Series + Radio Show",
        description:
          "Official identity and disambiguation page for Chasing Sun(Sets), the Chicago-based sunset house music event series and radio show.",
        mainEntity: { "@id": `${pageUrl}#brand` },
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      },
      {
        "@type": "Brand",
        "@id": `${pageUrl}#brand`,
        name: "Chasing Sun(Sets)",
        alternateName: CHASING_BRAND_NAMES,
        description:
          "A Chicago-based sunset house music event series and radio show presented by The Monolith Project.",
        url: toAbsoluteUrl(CHASING_SUNSETS_PATH),
        isPartOf: { "@id": `${SITE_ORIGIN}/#organization` },
        sameAs: brandSameAs,
      },
    ],
  };
}

export function buildPodcastSeriesSchema(episodes: RadioEpisode[]) {
  const seriesUrl = toAbsoluteUrl(RADIO_HUB_PATH);
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "@id": `${seriesUrl}#podcast-series`,
    name: "Chasing Sun(Sets) Radio Show",
    alternateName: ["Chasing Sunsets Radio Show"],
    description:
      "Artist-led radio, guest mixes, and Chicago house music sessions from The Monolith Project.",
    url: seriesUrl,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    isPartOf: { "@id": `${SITE_ORIGIN}/#brand-chasing-sunsets` },
    sameAs: [
      "https://soundcloud.com/chasing-sun-sets",
      "https://youtube.com/@monolithproject",
    ],
    hasPart: episodes.map((episode) => ({
      "@id": `${toAbsoluteUrl(`${RADIO_HUB_PATH}/${episode.slug}`)}#podcast-episode`,
    })),
  };
}

export function buildPodcastEpisodeSchema(episode: RadioEpisode) {
  const episodeUrl = toAbsoluteUrl(`${RADIO_HUB_PATH}/${episode.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    "@id": `${episodeUrl}#podcast-episode`,
    url: episodeUrl,
    name: `Chasing Sun(Sets) Radio Show ${episode.shortCode}: ${episode.title}`,
    datePublished: episode.datePublished,
    description: episode.summary,
    partOfSeries: { "@id": `${toAbsoluteUrl(RADIO_HUB_PATH)}#podcast-series` },
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: episode.audioUrl,
      embedUrl: episode.embedUrl,
      name: `${episode.guest} guest mix`,
    },
    image: toAbsoluteUrl(episode.image),
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    mainEntityOfPage: episodeUrl,
  };
}

interface EventSchemaInput {
  pagePath: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string[];
  performer?: string[];
  ticketUrl?: string;
  ticketAvailability?: "https://schema.org/InStock" | "https://schema.org/PreSale" | "https://schema.org/SoldOut";
  price?: number;
  validFrom?: string;
  locationName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export function buildEventSchema(input: EventSchemaInput) {
  const offers = input.ticketUrl
    ? {
        "@type": "Offer",
        url: input.ticketUrl,
        availability: input.ticketAvailability ?? "https://schema.org/InStock",
        priceCurrency: "USD",
        ...(typeof input.price === "number" ? { price: String(input.price) } : {}),
        ...(input.validFrom ? { validFrom: input.validFrom } : {}),
      }
    : undefined;

  const performer =
    input.performer && input.performer.length > 0
      ? input.performer.map((name) => ({
          "@type": "MusicGroup",
          name,
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: input.name,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: toAbsoluteUrl(input.pagePath),
    image: input.image.map((img) => toAbsoluteUrl(img)),
    location: {
      "@type": "Place",
      name: input.locationName,
      address: {
        "@type": "PostalAddress",
        streetAddress: input.streetAddress,
        addressLocality: input.addressLocality,
        addressRegion: input.addressRegion,
        postalCode: input.postalCode,
        addressCountry: input.addressCountry,
      },
    },
    ...(offers ? { offers } : {}),
    organizer: {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#organization`,
      name: "The Monolith Project",
      url: SITE_ORIGIN,
    },
    ...(performer ? { performer } : {}),
  };
}

export function buildBreadcrumbSchema(
  trail: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: toAbsoluteUrl(crumb.path),
    })),
  };
}

export function buildArtistSchema(artist: ArtistData, pagePath: string) {
  const artistUrl = toAbsoluteUrl(pagePath);
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${artistUrl}#artist`,
    name: artist.name,
    description: artist.bio,
    url: artistUrl,
    image: toAbsoluteUrl(artist.image),
    genre: artist.genre,
    homeLocation: {
      "@type": "Place",
      name: artist.origin,
    },
    sameAs: [
      artist.socials.instagram,
      artist.socials.website,
    ].filter(Boolean),
  };
}

export function buildUntoldStoryEventSchema(pagePath: string) {

  const event = getEventById("us-s3e3");
  if (event) return buildScheduledEventSchema(event, pagePath);

  return buildEventSchema({
    pagePath,
    name: "Untold Story IV: Eran Hersh",
    description:
      "The Monolith Project presents Untold Story IV with Eran Hersh at Hideaway Chicago on May 16, 2026.",
    startDate: "2026-05-16T21:00:00-05:00",
    endDate: "2026-05-17T03:00:00-05:00",
    image: [
      "/images/untold-story-moody.webp",
      "/images/artist-lazare.webp",
    ],
    performer: ["Eran Hersh"],
    ticketUrl: POSH_TICKET_URL,
    locationName: "Hideaway",
    streetAddress: "Chicago IL",
    addressLocality: "Chicago",
    addressRegion: "IL",
    postalCode: "60607",
    addressCountry: "US",
  });
}

export function buildFaqSchema(faqEntries: Array<[string, string]>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

function tryParseDate(dateStr: string, timeStr: string) {
  let cleanTime = timeStr.split("—")[0].split("-")[0].trim();
  if (cleanTime === "TBA" || cleanTime === "Late") cleanTime = "10:00 PM";
  try {
    const d = new Date(`${dateStr} ${cleanTime}`);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch { }

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch { }
  return new Date().toISOString();
}

function getVenueAddress(event: ScheduledEvent) {
  if (event.venue === "Alhambra Palace") {
    return {
      streetAddress: "1240 W Randolph St",
      postalCode: "60607",
    };
  }

  return {
    streetAddress: "Chicago IL",
    postalCode: "60607",
  };
}

export function buildScheduledEventSchema(event: ScheduledEvent, pagePath: string) {
  const startDate = event.startsAt || tryParseDate(event.date, event.time);
  const endDate = event.endsAt || startDate;
  const address = getVenueAddress(event);
  const availableTierPrices =
    event.ticketTiers
      ?.filter((tier) => tier.available)
      .map((tier) => tier.price)
      .filter((price) => Number.isFinite(price)) ?? [];
  const minimumAvailablePrice =
    availableTierPrices.length > 0 ? Math.min(...availableTierPrices) : undefined;
  const price = event.startingPrice ?? minimumAvailablePrice;
  const ticketUrl = event.status === "on-sale" || event.status === "sold-out" ? event.ticketUrl : undefined;
  const ticketAvailability =
    event.status === "sold-out"
      ? "https://schema.org/SoldOut"
      : event.status === "on-sale"
        ? "https://schema.org/InStock"
        : undefined;

  const performer =
    event.lineup
      ?.split("·")
      .map((segment) => segment.trim())
      .map((segment) => segment.replace(/\s*\((?:headliner|support|special guest|guest)\)\s*/gi, "").trim())
      .filter(
        (segment) =>
          segment.length > 0 &&
          !/^(support|support tbd|tbd|lineup drops\b|secret guest\b|venue reveal soon\b)/i.test(segment),
      ) ?? [];

  return buildEventSchema({
    pagePath,
    name: event.headline || event.title,
    description:
      event.description || event.experienceIntro || `The Monolith Project presents ${event.title}`,
    startDate,
    endDate,
    image: event.image ? [event.image] : ["/images/chasing-sunsets-premium.webp"],
    performer,
    ticketUrl,
    ticketAvailability,
    price,
    locationName: event.venue,
    streetAddress: address.streetAddress,
    addressLocality: "Chicago",
    addressRegion: "IL",
    postalCode: address.postalCode,
    addressCountry: "US",
  });
}

export function buildScheduleSchema(events: ScheduledEvent[]) {
  return {
    "@context": "https://schema.org",
    "@graph": events
      .filter((event) => getEventWindowStatus(event) !== "past")
      .map((event) => buildScheduledEventSchema(event, "/schedule")),
  };
}
