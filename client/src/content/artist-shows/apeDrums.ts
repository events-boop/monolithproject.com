import type { ArtistShowLandingConfig } from "@/components/artist-show/ArtistShowLanding";
import { ROUTES } from "@shared/routes";

export const APE_DRUMS_SHOW_CONFIG: ArtistShowLandingConfig = {
  eventId: "ape-drums-kashmir-july-31-2026",
  publicPath: ROUTES.apeDrums,
  trackingPrefix: "ape_drums",
  trackingSource: "ape_drums_landing",
  trackingContentName: "Ape Drums at Kashmir",
  seo: {
    title: "Ape Drums · July 31 · Kashmir · Chicago",
    description:
      "The Monolith Project presents Ape Drums at Kashmir in Chicago on Friday, July 31, 2026. A 350-capacity room and a late-night set.",
  },
  theme: {
    ink: "#050505",
    charcoal: "#0d0c0b",
    paper: "#f4eee4",
    accent: "#e85f28",
    metal: "#d99a58",
    signal: "#ffb347",
  },
  brand: {
    presenter: "The Monolith Project",
    homePath: ROUTES.home,
    locationLine: "Chicago / 2026",
  },
  artist: {
    name: "Ape Drums",
    nameLines: ["APE", "DRUMS"],
    initials: "AD",
    heroImageAlt: "Ape Drums artist portrait",
    profile: {
      kicker: "Eric Alberto-Lopez / Ape Drums",
      headline: "He learned to feel the rhythm before he learned to build it.",
      bio: [
        "Eric Alberto-Lopez, professionally known as Ape Drums, is a Grammy-nominated, genre-bending DJ and producer whose path began with cassette-tape daydreams in Houston. The Mexican-American artist learned by obsessively dissecting songs and teaching himself how arrangements worked long before he had access to proper gear.",
        "Originally drawn to scratch DJing, he changed course after seeing The Martinez Brothers in 2008. A duo project became a solo identity; a connection with the Major Lazer crew began online and grew through collaborations, opening sets, and world tours. In 2019, Ape Drums officially joined the group.",
        "Now based in Miami, he is pushing beyond the Caribbean-influenced electronic music and high-energy dance records that first moved his career. The current chapter runs darker and rawer through Afro-tech and Afro-house, shaped by reggaeton, funk, rock en español, R&B, ’90s dance music, and a lifelong instinct for what moves a room.",
        "Dance remains the compass. Breakdancing taught him to feel music in his body before producing it, and that physical understanding of rhythm still guides every record and set. Today, he is releasing new music consistently while helping shape the next wave of Major Lazer’s sound, with recent solo releases supported by Black Coffee, Keinemusik, Dixon, and more.",
      ],
      metrics: [
        { value: "58K", label: "Instagram followers" },
        { value: "3M", label: "Monthly listeners" },
      ],
      facts: [
        { label: "Origin", value: "Houston, Texas" },
        { label: "Heritage", value: "Mexican-American" },
        { label: "Based", value: "Miami" },
        { label: "Recognition", value: "Grammy-nominated" },
        { label: "Major Lazer", value: "Member since 2019" },
        { label: "Current signal", value: "Afro-tech / Afro-house" },
      ],
      officialLink: {
        label: "Official artist site",
        href: "https://www.apedrums.com/",
      },
    },
  },
  hero: {
    eyebrow: "The Monolith Project presents",
    thesis: ["One year in the making.", "One room for the next sound."],
    quickFacts: "350 people / late night / 21+",
  },
  story: {
    kicker: "A year in the making",
    headline: "Some bookings happen in a week.",
    headlineEmphasis: "This one took a year.",
    paragraphs: [
      {
        copy: "We first reached for Ape Drums last summer. Houston-raised. Forged in the Major Lazer camp—the co-signs, the world tours, the festival main stages. He could have run that lane forever.",
      },
      { copy: "He didn't. He evolved.", emphasis: true },
      {
        copy: "The sound he's building now is deeper, warmer, rhythm-first—the same frequency we've been cultivating in Chicago from day one. When an artist burns down a winning formula to chase something truer, you don't just book him. You give the new chapter a home.",
      },
      {
        copy: "July 31. A 350-cap room. Late night. The first Chicago address of the next era.",
      },
    ],
    stampValue: "350",
    stampCopy: "People. One room. One frequency.",
  },
  sound: {
    kicker: "The new frequency",
    headline: "Don't take our word for it.",
    description:
      "Start with the newest full set, then move through official artist transmissions. Every additional video remains approval-gated before release.",
    featured: {
      label: "Featured / newest set",
      title: "The full transmission",
      description:
        "The clearest entry point into where Ape Drums is moving now: darker pressure, warmer rhythm, and a room-first sense of motion.",
      linkLabel: "Watch on YouTube",
    },
    additionalSlots: [
      {
        number: "02",
        title: "Official video 02",
        line: "The next approved chapter in the sound.",
      },
      {
        number: "03",
        title: "Official video 03",
        line: "A final signal before the room opens.",
      },
    ],
  },
  event: {
    shortDate: "07.31",
    dateParts: ["07", "31"],
    fullDate: "Friday, July 31, 2026",
    venue: "Kashmir",
    city: "Chicago",
    capacity: "350",
    age: "21+",
    timingSuffix: "Ape Drums on late",
    detailsHeadline: "Friday night belongs to the room.",
    conversionNote:
      "Real capacity. Real ticket counts. No manufactured scarcity.",
  },
  footer: {
    frequency: "Togetherness is the frequency.",
    guide: "Music is the guide.",
    familyLabel: "Part of The Monolith Project family",
    familyLinks: [
      { label: "Untold Story", href: ROUTES.story },
      { label: "Chasing Sun(Sets)", href: ROUTES.chasingSunsets },
      { label: "House of Friends", href: ROUTES.houseOfFriends },
    ],
    legalLine: "Chicago / 2026 / Signal 0731",
  },
};
