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
  previousSets?: { title: string; date: string; url?: string }[];
  gallery?: { src: string; alt: string }[];
}

export const ARTIST_ENTRIES: ArtistData[] = [
  {
    id: "lazare",
    name: "LAZARE SABRY",
    role: "HEADLINER",
    origin: "CHICAGO, US",
    genre: "MELODIC HOUSE · TECHNO",
    image: "/images/artist-lazare.webp",
    series: ["untold-story"],
    bio: "Over 100 million spins and counting on hit songs. Lazare Sabry is a headliner for record night at Carbon Night Club Chicago, bringing a sophisticated blend of melodic house, deep techno, and progressive rhythms.",
    tags: ["Headliner", "Melodic", "House"],
    socials: {},
    tracks: [
      { title: "Eternal Echoes", duration: "6:15" },
      { title: "Nightfall", duration: "5:30" },
      { title: "Resonance", duration: "4:45" },
    ],
  },
  {
    id: "deron",
    name: "DERON",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · MELODIC",
    image: "/images/deron-press.jpg",
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
    image: "/images/untold-story-juany-deron-v2.webp",
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
    bio: "Hailing from Australia and based in London, HAAi pushes club music into psychedelic, high-energy territory. Her Untold Story sets are unpredictable, physical, and built for dancers, making her a natural fit for Monolith headline nights.",
    tags: ["Techno", "Psychedelic", "Alternative"],
    socials: { instagram: "https://instagram.com/haaihaaihaai" },
    tracks: [
      { title: "Baby, We're Ascending", duration: "5:42" },
      { title: "The Sun Made For A Soft Landing", duration: "4:15" },
      { title: "Lights Out", duration: "6:03" },
    ],
    previousSets: [
      { title: "Untold Story S1 E2", date: "June 2024", url: "https://soundcloud.com/haaihaaihaai/untold-story-exclusive" },
      { title: "Monolith Radio 044", date: "Oct 2024", url: "https://soundcloud.com/haaihaaihaai/monolith-radio-session" }
    ]
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
    image: "/images/chasing-sunsets-premium.webp",
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
    image: "/images/chasing-sunsets-premium.webp",
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
    id: "arodes",
    name: "ARODES",
    role: "GUEST",
    origin: "SPAIN",
    genre: "AFRO HOUSE",
    image: "/images/chasing-sunsets-1.jpg",
    series: ["chasing-sunsets"],
    bio: "Arodes brings deep, rhythmic Afro house to the sunset stage. His selections are tailored for open-air environments, building steady energy as the light fades.",
    tags: ["Afro House", "Guest", "Open Air"],
    socials: {},
    tracks: [
      { title: "Sunset Rhythm", duration: "5:45" }
    ],
  },
  {
    id: "summermel",
    name: "SUMMERMEL",
    role: "RESIDENT",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · ORGANIC HOUSE",
    image: "/images/chasing-sunsets-premium.webp",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Summermel blends energetic Afro house rhythms with deep, organic grooves. As a Resident DJ for Chasing Sun(Sets), he captures the perfect golden-hour warmth and transitions seamlessly into high-energy nightfall sessions. He was instrumental in launching the very first Untold Story and recently provided pivotal support for the defining Lazare & Sabry set.",
    tags: ["Resident", "Afro House", "Organic House"],
    socials: { instagram: "https://instagram.com/summermel" },
    tracks: [
      { title: "Golden Hour Set", duration: "60:00" },
      { title: "Open Air Mix", duration: "55:30" }
    ],
    previousSets: [
      { title: "The First Untold Story", date: "2024" },
      { title: "Lazare x Sabry Support", date: "2025" }
    ]
  },
  {
    id: "chus",
    name: "CHUS",
    role: "GUEST",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    image: "/images/chasing-sunsets.webp",
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
    image: "/images/artist-benchek.jpg",
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
    image: "/images/artist-terranova.png",
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
    image: "/images/artist-ewerseen.png",
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
    image: "/images/radio-show-gear.webp",
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
  {
    id: "avo",
    name: "AVO",
    role: "RESIDENT",
    origin: "CHICAGO, US",
    genre: "MELODIC TECHNO · AFRO",
    image: "/images/untold-story-moody.webp",
    series: ["untold-story"],
    bio: "A key Monolith Project resident, AVO blends deep melodic techno with percussive Afro-house rhythms. His sets are precise, physical, and built for raw late-night rooms, shaping the tension-and-release arc that defines Untold Story. He recently played alongside Deron and Juany Bravo, and provided direct support for Eran Hersh.",
    tags: ["Resident", "Melodic Techno", "Afro House"],
    socials: { instagram: "https://instagram.com/avomusic_" },
    tracks: [
      { title: "Architectural tension", duration: "6:42" },
      { title: "Concrete Jungle", duration: "5:58" },
      { title: "Lunar Shift", duration: "7:12" },
    ],
    previousSets: [
      { title: "Direct Support for Eran Hersh", date: "2025" },
      { title: "Juany Bravo b2b Deron Support", date: "2025" },
      { title: "Untold Story S1 E4", date: "Nov 2024", url: "https://soundcloud.com/avomusic" },
      { title: "Monolith Radio 038", date: "Aug 2024", url: "https://soundcloud.com/avomusic" }
    ]
  },
  {
    id: "eran-hersh",
    name: "ERAN HERSH",
    role: "HEADLINER",
    origin: "MIAMI, US",
    genre: "AFRO HOUSE · MELODIC HOUSE",
    image: "/images/eran-hersh-live-5.webp",
    series: ["untold-story"],
    bio: "Miami-based DJ and producer Eran Hersh is a rising force in America’s electronic music scene with over 100 million global spins, seamlessly blending Afro and tribal house with Middle Eastern influences. In 2023, he reached a career milestone collaborating with Madonna on 'Sorry'. His versatility shines through remix work for icons like Bob Sinclar, David Guetta, Swedish House Mafia, and Alicia Keys. With performances at major festivals like EDC, BPM, and Zamna, his music released on Insomniac Records, Armada, Spinnin’ Records, and Ultra has amassed over 90+ million Spotify streams and a dedicated following of 1.2 million monthly listeners.",
    tags: ["Afro House", "Melodic", "Headliner"],
    socials: { instagram: "https://instagram.com/eranhersh" },
    tracks: [
      { title: "Ale Ale", duration: "6:15" },
      { title: "Always", duration: "5:42" },
      { title: "Forbidden", duration: "6:30" },
    ],
    previousSets: [
      { title: "Live at RheinRiff", date: "Sept 2025", url: "https://soundcloud.com/eranhersh" },
      { title: "Bazar by Sasson Chapter", date: "Aug 2025", url: "https://soundcloud.com/eranhersh" },
    ],
    gallery: [
      { src: "/images/eran-hersh-live-1.webp", alt: "Eran Hersh live at Bazar by Sasson" },
      { src: "/images/eran-hersh-live-5.webp", alt: "Eran Hersh at RheinRiff" },
      { src: "/images/eran-hersh-live-6.png", alt: "Eran Hersh portrait" },
    ],
  },
  {
    id: "amari",
    name: "AMARI",
    role: "RESIDENT",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · MELODIC HOUSE",
    image: "/images/chasing-sunsets-premium.webp",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Amari anchors the Monolith sound across both open-air and after-dark sessions. As a Resident DJ for both Chasing Sun(Sets) and Untold Story, his sets seamlessly connect melodic groove with deep, rhythmic afro house.",
    tags: ["Resident", "Afro House", "Melodic House"],
    socials: { instagram: "https://instagram.com/amari.music" },
    tracks: [
      { title: "Golden Hour Session", duration: "6:20" },
      { title: "After Dark Selection", duration: "5:45" },
    ],
  },
  {
    id: "jerome",
    name: "JEROME",
    role: "RESIDENT",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists-collective.webp",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Jerome is a producer, local Chicago DJ, and Resident for the Monolith ecosystem, setting the standard for opening sets across both day and night formats.",
    tags: ["Resident", "Producer", "Local"],
    socials: {},
    tracks: [],
  },
  {
    id: "rose",
    name: "ROSE",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/untold-story-moody.webp",
    series: ["untold-story"],
    bio: "Rose is a standout selector who recently played the massive Juany Bravo b2b Deron show, as well as the Autograf headline event, establishing herself as a go-to name for direct support.",
    tags: ["Guest", "Local Support"],
    socials: {},
    tracks: [],
    previousSets: [
      { title: "Juany Bravo b2b Deron Show", date: "2025" },
      { title: "Autograf Show", date: "2024" }
    ]
  },
  {
    id: "hashtom",
    name: "HASHTOM",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists-collective.webp",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Hashtom is a local Chicago rising star, bringing fresh energy to the house music scene with sets perfectly tailored for the Monolith dancefloor.",
    tags: ["Rising Star", "Local"],
    socials: {},
    tracks: [],
  },
  {
    id: "kenbo-slice",
    name: "KENBO SLICE",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/untold-story-hero-post1.webp",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Kenbo Slice is a dedicated local artist providing essential support and high-energy selections for Chicago's premier open-air and late-night shows.",
    tags: ["Local Artist", "Support"],
    socials: {},
    tracks: [],
  },
  {
    id: "jealah",
    name: "JEALAH",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/chasing-sunsets-1.jpg",
    series: ["untold-story", "chasing-sunsets"],
    bio: "Jealah is a standout local artist and vibrant selector who provided essential support at the massive Autograf headline show.",
    tags: ["Guest", "Local Support"],
    socials: {},
    tracks: [],
    previousSets: [
      { title: "Autograf Show Support", date: "2024" }
    ]
  },
  {
    id: "maximo",
    name: "MAXIMO",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/autograf-recap.jpg",
    series: ["untold-story", "chasing-sunsets"],
    bio: "Maximo is a commanding presence in the late-night circuit, having notably closed out the massive Autograf show in March with an unforgettable set.",
    tags: ["Guest", "Closer"],
    socials: {},
    tracks: [],
    previousSets: [
      { title: "Autograf Show Closing Set", date: "Mar 2024" }
    ]
  }
];

export const ARTISTS: Record<string, ArtistData> = Object.fromEntries(
  ARTIST_ENTRIES.map((artist) => [artist.id, artist]),
) as Record<string, ArtistData>;
