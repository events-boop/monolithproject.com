import LinkBioPage from "@/components/link-bio/LinkBioPage";
import { INSTAGRAM_UNTOLD, SOUNDCLOUD_URL } from "@/data/events";
import { ROUTES } from "@shared/routes";
import SEO from "@/components/SEO";

const UNTOLD_URL = "https://untold.vip";
const MONOLITH_URL = "https://monolithproject.com";
const HOUSE_OF_FRIENDS_URL = "https://houseoffriends.vip";
const CHASING_SUNSETS_CHANNEL_URL =
  "https://www.instagram.com/channel/AbYuqCKYjvqcwcz0/";

const PREVIOUS_SHOWS = [
  {
    chapter: "I",
    title: "Lazare Sabry",
    date: "December 12, 2025",
    schemaDate: "2025-12-12",
    venue: "Carbon Nightclub",
    location: "Chicago, IL",
    image: "/images/lazare-recap.webp",
    href: "/untold-story/season-ii",
    ctaLabel: "View Gallery",
    note: "The first public signal: intimate room, late-night pressure, and a crowd locked into the idea.",
  },
  {
    chapter: "II",
    title: "Juany & Deron",
    date: "March 6, 2026",
    schemaDate: "2026-03-06",
    venue: "Chicago",
    location: "Chicago, IL",
    image: "/images/juany.jpeg",
    href: "/untold-story/season-iii",
    ctaLabel: "View Gallery",
    note: "Juany and Deron went back-to-back in a percussion-led set. The tightest dancefloor of the season.",
  },
  {
    chapter: "III",
    title: "Autograf",
    date: "March 21, 2026",
    schemaDate: "2026-03-21",
    venue: "Alhambra Palace",
    location: "Chicago, IL",
    image: "/images/autograf-recap.jpg",
    href: "/artists/autograf",
    ctaLabel: "View Artist",
    note: "Live instrumentation and immersive room design pushed the series into a larger cinematic lane.",
  },
  {
    chapter: "IV",
    title: "Eran Hersh",
    date: "May 16, 2026",
    schemaDate: "2026-05-16",
    venue: "Hideaway Chicago",
    location: "Chicago, IL",
    image: "/images/eran-hersh-untold-story-iv-bw.jpg",
    href: "/events/eran-hersh-untold-story-iv",
    ctaLabel: "View Event",
    note: "Afro and melodic house pressure carried the room from peak-hour movement into the late finish.",
  },
] as const;

const schemaData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Untold Story",
    url: UNTOLD_URL,
    publisher: {
      "@type": "Organization",
      name: "The Monolith Project",
      url: MONOLITH_URL,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Untold Story previous shows",
    url: UNTOLD_URL,
    itemListElement: PREVIOUS_SHOWS.map((show, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "MusicEvent",
        name: `Untold Story ${show.chapter}: ${show.title}`,
        description: `Untold Story ${show.chapter} — "${show.title}" at ${show.venue}. An after-dark house music chapter by The Monolith Project in Chicago.`,
        startDate: show.schemaDate,
        eventStatus: "https://schema.org/EventCompleted",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: `${UNTOLD_URL}${show.image}`,
        location: {
          "@type": "Place",
          name: show.venue,
          address: show.location,
        },
        organizer: {
          "@type": "Organization",
          name: "The Monolith Project",
          url: MONOLITH_URL,
        },
      },
    })),
  },
];

/** untold.vip: the Untold Story link in bio, on the same layout as sunsets.vip. */
export default function UntoldVipLanding() {
  return (
    <>
      <SEO
        title="Untold Story | Links"
        description="Untold Story by The Monolith Project: show updates, previous chapters, Chasing Sunsets Radio and the Open Network."
        absoluteTitle
        canonicalUrl={`${UNTOLD_URL}/`}
        image="/images/untold-story/hero-astronaut.webp"
        schemaData={schemaData}
      />
      <LinkBioPage
        theme="untold"
        kicker="The Monolith Project presents"
        title="Untold"
        titleAccent="Story"
        showDestinations
        motif="rings"
        tagline="After-dark house music in Chicago rooms. Music first. Good crowd. Late finish."
        badge="2027 / Season III"
        tease="The next chapter is taking shape. Sign up to be the first to know."
        links={[
          {
            label: "Get First Access · 2027",
            detail:
              "Untold Story Season III · Dates and artists to be announced",
            href: `${MONOLITH_URL}${ROUTES.newsletter}`,
            primary: true,
          },
          {
            label: "Previous chapters",
            detail: `${PREVIOUS_SHOWS.map(show => show.title).join(" · ")}`,
            href: ROUTES.untoldStory,
          },
          {
            label: "Chasing Sunsets Radio",
            detail: "A Monolith original, powered by sunsets.fm",
            href: ROUTES.radio,
          },
          {
            label: "SUNSETS.FM · The Open Network",
            detail: "Sets, places and the people behind them",
            href: ROUTES.openNetwork,
          },
          {
            label: "Shows and calendar",
            detail: "What is confirmed and what is next",
            href: ROUTES.schedule,
          },
          {
            label: "Chasing Sun(Sets)",
            detail: "Our open-air lakefront series",
            href: "https://sunsets.vip",
          },
          {
            label: "House of Friends",
            detail: "People-first gatherings and shared rooms",
            href: HOUSE_OF_FRIENDS_URL,
          },
        ]}
        socials={[
          { label: "Instagram", href: INSTAGRAM_UNTOLD },
          { label: "Broadcast channel", href: CHASING_SUNSETS_CHANNEL_URL },
          { label: "SoundCloud", href: SOUNDCLOUD_URL },
        ]}
        footnote="Untold Story is a Monolith Project series."
      />
    </>
  );
}
