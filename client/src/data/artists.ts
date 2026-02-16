export type ArtistSeries = "chasing-sunsets" | "untold-story" | "sunsets-radio";

export interface ArtistData {
  id: string;
  name: string;
  role: string;
  origin: string;
  genre: string;
  image: string;
  // Non-empty list: first entry is the artist's primary series for badges/colors.
  series: [ArtistSeries, ...ArtistSeries[]];
  bio: string;
  tags: string[];
  socials: { instagram?: string; website?: string };
  tracks: { title: string; duration: string }[];
}

export const ARTIST_ENTRIES: ArtistData[] = [
  {
    id: "lazare",
    name: "LAZARE",
    role: "RESIDENT",
    origin: "PARIS, FR",
    genre: "MELODIC HOUSE",
    image: "/images/artist-lazare.webp",
    series: ["untold-story"],
    bio: "A staple of the Monolith sound. Lazare brings a sophisticated blend of melodic house and progressive rhythms, with sets known for emotional depth and driving energy.",
    tags: ["Melodic", "Progressive", "House"],
    socials: {},
    tracks: [
      { title: "Eternal Echoes", duration: "6:15" },
      { title: "Nightfall", duration: "5:30" },
      { title: "Resonance", duration: "4:45" },
    ],
  },
  {
    id: "sabry",
    name: "SABRY",
    role: "RESIDENT",
    origin: "CHICAGO, US",
    genre: "DEEP HOUSE · TECHNO",
    image: "/images/untold-story.jpg",
    series: ["untold-story"],
    bio: "Sabry anchors the Monolith sound with deep, hypnotic selections and long-form pacing that adapts to the room.",
    tags: ["Deep House", "Techno", "Resident"],
    socials: {},
    tracks: [
      { title: "Night Architecture", duration: "5:56" },
      { title: "After Hours Flow", duration: "6:08" },
      { title: "Signal Drift", duration: "4:43" },
    ],
  },
  {
    id: "deron",
    name: "DERON",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · MELODIC",
    image: "/images/artist-deron-untold.webp",
    series: ["untold-story"],
    bio: "Deron is known for emotionally driven selections that move from deep grooves into peak-hour storytelling. His Untold Story sets are designed for dancers first.",
    tags: ["Afro House", "Melodic", "Late Night"],
    socials: {},
    tracks: [
      { title: "Untold Intro", duration: "4:32" },
      { title: "Chapter Shift", duration: "5:19" },
      { title: "Closing Ceremony", duration: "6:04" },
    ],
  },
  {
    id: "juany-bravo",
    name: "JUANY BRAVO",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · GLOBAL HOUSE",
    image: "/images/artist-juany-bravo-untold.webp",
    series: ["untold-story"],
    bio: "Juany Bravo brings a global, percussion-driven house language and a highly dynamic approach to b2b performance in intimate rooms.",
    tags: ["Global House", "Afro House", "B2B"],
    socials: {},
    tracks: [
      { title: "Ceremony Start", duration: "5:01" },
      { title: "Room Energy", duration: "5:47" },
      { title: "Sunrise Motif", duration: "4:58" },
    ],
  },
  {
    id: "haai",
    name: "HAAi",
    role: "HEADLINER",
    origin: "LONDON, UK",
    genre: "PSYCHEDELIC TECHNO",
    image: "/images/artist-haai.webp",
    series: ["untold-story"],
    bio: "Hailing from Australia and based in London, HAAi continues to redefine the boundaries of club music. Her sets are a journey through genre-bending soundscapes that fit the Untold Story format.",
    tags: ["Techno", "Psychedelic", "Alternative"],
    socials: {},
    tracks: [
      { title: "Baby, We're Ascending", duration: "5:42" },
      { title: "The Sun Made For A Soft Landing", duration: "4:15" },
      { title: "Lights Out", duration: "6:03" },
    ],
  },
  {
    id: "autograf",
    name: "AUTOGRAF",
    role: "LIVE SET",
    origin: "CHICAGO, US",
    genre: "FUTURE HOUSE",
    image: "/images/artist-autograf.webp",
    series: ["chasing-sunsets"],
    bio: "Autograf blends live instrumentation with electronic production, creating immersive performances with melodic hooks and club-forward energy.",
    tags: ["Live Electronic", "Indie Dance", "Future House"],
    socials: {},
    tracks: [
      { title: "Dream", duration: "3:45" },
      { title: "Nobody Knows", duration: "3:58" },
      { title: "Simple", duration: "4:12" },
    ],
  },
  {
    id: "summers-uk",
    name: "SUMMERS UK",
    role: "GUEST",
    origin: "LONDON, UK",
    genre: "MELODIC HOUSE",
    image: "/images/chasing-sunsets.jpg",
    series: ["chasing-sunsets"],
    bio: "Summers UK blends warm melodic arrangements with open-air pacing built for sunset transitions.",
    tags: ["Melodic House", "Sunset", "Open Air"],
    socials: {},
    tracks: [
      { title: "Golden Arrival", duration: "4:36" },
      { title: "West Terrace", duration: "5:14" },
      { title: "Hour Change", duration: "4:28" },
    ],
  },
  {
    id: "chris-idh",
    name: "CHRIS IDH",
    role: "GUEST",
    origin: "PARIS, FR",
    genre: "ORGANIC HOUSE",
    image: "/images/chasing-sunsets.jpg",
    series: ["chasing-sunsets"],
    bio: "Chris IDH delivers textured, organic rhythms with a focus on movement and atmosphere.",
    tags: ["Organic", "Melodic", "House"],
    socials: {},
    tracks: [
      { title: "Open Roof", duration: "5:09" },
      { title: "Driftline", duration: "4:51" },
      { title: "Sunline", duration: "5:02" },
    ],
  },
  {
    id: "chus",
    name: "CHUS",
    role: "GUEST",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    image: "/images/artist-chus.webp",
    series: ["chasing-sunsets"],
    bio: "Chus' Afro-house rhythms and percussive energy have captivated audiences worldwide. He brings a vibrant, rhythmic pulse to sunset and late-night floors alike.",
    tags: ["Afro House", "Percussive", "Groove"],
    socials: {},
    tracks: [
      { title: "7 Seconds", duration: "6:20" },
      { title: "Africa", duration: "5:10" },
      { title: "The Way", duration: "4:55" },
    ],
  },
  {
    id: "benchek",
    name: "BENCHEK",
    role: "GUEST",
    origin: "BERLIN, DE",
    genre: "MELODIC TECHNO",
    image: "/images/chasing-sunsets.jpg",
    series: ["sunsets-radio"],
    bio: "Benchek's mixes balance melodic intensity with dancefloor precision, both on radio episodes and live sets.",
    tags: ["Melodic Techno", "Radio", "Guest"],
    socials: {},
    tracks: [
      { title: "Chapter III", duration: "58:23" },
      { title: "Marbella Live", duration: "64:17" },
      { title: "Afterglow", duration: "6:12" },
    ],
  },
  {
    id: "terranova",
    name: "TERRANOVA",
    role: "GUEST",
    origin: "BERLIN, DE",
    genre: "DEEP HOUSE · ELECTRONICA",
    image: "/images/autograf-recap.jpg",
    series: ["sunsets-radio"],
    bio: "Terranova blends deep house and electronica into detailed long-form sessions tailored for immersive listening.",
    tags: ["Deep House", "Electronica", "Radio"],
    socials: {},
    tracks: [
      { title: "TERRANOVA x CHASING SUN(SETS)", duration: "62:10" },
      { title: "Night Thread", duration: "5:26" },
      { title: "Pulse Study", duration: "4:50" },
    ],
  },
  {
    id: "ewerseen",
    name: "EWERSEEN",
    role: "GUEST",
    origin: "AMSTERDAM, NL",
    genre: "AFRO HOUSE · ORGANIC",
    image: "/images/radio-show.jpg",
    series: ["sunsets-radio", "chasing-sunsets"],
    bio: "EWERSEEN merges afro and organic palettes with clean structure and deep rhythmic progression.",
    tags: ["Afro House", "Organic", "Radio"],
    socials: {},
    tracks: [
      { title: "Mix Vol.3", duration: "55:48" },
      { title: "Collab Mix Vol.2", duration: "48:32" },
      { title: "Crossfade", duration: "5:03" },
    ],
  },
  {
    id: "radian",
    name: "RADIAN",
    role: "RADIO MIX",
    origin: "GLOBAL",
    genre: "MELODIC HOUSE · DEEP",
    image: "/images/radio-show.jpg",
    series: ["sunsets-radio"],
    bio: "Radian brings immersive, slow-burn melodic journeys built for repeat listening and late-night movement.",
    tags: ["Radio", "Melodic", "Deep"],
    socials: {},
    tracks: [
      { title: "RADIAN x UNTOLD STORY", duration: "71:05" },
      { title: "Signal Path", duration: "5:11" },
      { title: "Echo Frame", duration: "4:57" },
    ],
  },
];

export const ARTISTS: Record<string, ArtistData> = Object.fromEntries(
  ARTIST_ENTRIES.map((artist) => [artist.id, artist]),
) as Record<string, ArtistData>;

