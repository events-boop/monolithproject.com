export type ArtistSeries = "chasing-sunsets" | "untold-story" | "sunsets-radio";

export interface ArtistData {
  id: string;
  name: string;
  role: string;
  origin: string;
  genre: string;
  image: string;
  imagePosition?: string;
  // Non-empty list: first entry is the artist's primary series for badges/colors.
  series: [ArtistSeries, ...ArtistSeries[]];
  bio: string;
  tags: string[];
  socials: {
    instagram?: string;
    website?: string;
    soundcloud?: string;
    spotify?: string;
  };
  tracks: { title: string; duration: string }[];
  previousSets?: { title: string; date: string; url?: string }[];
  events?: {
    id: string;
    title: string;
    series?:
      | "chasing-sunsets"
      | "untold-story"
      | "sunsets-radio"
      | "monolith-launch"
      | "special-event";
    date: string;
    venue: string;
    city?: string;
    status?: "upcoming" | "past" | "on-sale" | "sold-out" | "first-access";
    ticketUrl?: string;
    eventUrl?: string;
    cardImage?: string;
    description?: string;
    badge?: string;
  }[];
  galleryCredit?: string;
  galleryLabel?: string;
  gallery?: { src: string; alt: string }[];
  featuredVideo?: {
    url: string;
    title: string;
    label: string;
    source: string;
    description: string;
  };
}

export const ARTIST_ENTRIES: ArtistData[] = [
  {
    // OWNER REWRITE: placeholder bio assembled from launch-brief source
    // material — replace with approved copy before/at announcement push.
    id: "kiko-franco",
    name: "KIKO FRANCO",
    role: "JULY 4 HEADLINER",
    origin: "RIO DE JANEIRO, BR",
    genre: "AFRO HOUSE",
    image: "/images/artist-kiko-franco.webp",
    series: ["chasing-sunsets"],
    bio: 'Rio-born Kiko Franco took Afro House global with his No. 1 Beatport remix of "Love Tonight" — Diamond certified and a BBC Radio summer anthem — earning support from Black Coffee, Carl Cox, David Guetta, and Tiësto. From Tomorrowland Brasil to Burning Man and Ushuaïa, his sets carry golden-hour energy built for the lakefront. On July 4 he makes his Chicago lakefront debut headlining SUN(SETS) I.',
    tags: ["Afro House", "July 4 Headliner", "Lakefront Debut"],
    socials: {},
    tracks: [
      { title: "Love Tonight (Kiko Franco Remix)", duration: "—" },
      { title: "Live at Tomorrowland Brasil", duration: "—" },
      { title: "Ushuaïa Ibiza Session", duration: "—" },
    ],
  },
  {
    id: "ape-drums",
    name: "APE DRUMS",
    role: "SPECIAL GUEST · HEADLINER",
    origin: "HOUSTON / MIAMI, US",
    genre: "AFRO-TECH · AFRO HOUSE",
    image: "/images/artist-ape-drums.jpg",
    imagePosition: "50% 25%",
    series: ["untold-story", "chasing-sunsets"],
    bio: "Eric Alberto-Lopez, professionally known as Ape Drums, is a Grammy-nominated, genre-bending DJ and producer whose path began with cassette-tape daydreams in Houston. Officially joining Major Lazer in 2019, he is now pushing beyond festival mainstages into a darker, rawer Afro-tech and Afro-house sound. Breakdance-rooted timing and a physical understanding of rhythm guide every record and set.",
    tags: [
      "Afro-Tech",
      "Afro House",
      "Major Lazer",
      "Grammy Nominated",
      "July 31",
    ],
    socials: {
      instagram: "https://instagram.com/apedrums",
      website: "https://www.apedrums.com/",
    },
    tracks: [
      { title: "Gimme Di Teppa", duration: "4:12" },
      { title: "Delete", duration: "3:48" },
      { title: "The Way", duration: "5:05" },
    ],
    events: [
      {
        id: "ape-drums-kashmir-july-31-2026",
        title: "Ape Drums at Kashmir",
        series: "untold-story",
        date: "Friday, July 31, 2026",
        venue: "Kashmir Chicago",
        city: "Chicago, IL",
        status: "past",
        badge: "ARCHIVE",
        eventUrl: "/archive/ape-drums-july31-2026",
        cardImage: "/images/events/ape-drums-july31-card.jpg",
        description:
          "A 350-capacity late-night room built around where Ape Drums is moving next. Darker pressure, warmer rhythm.",
      },
    ],
    previousSets: [
      {
        title: "Major Lazer World Tour Sessions",
        date: "2024–2025",
        url: "https://www.apedrums.com/",
      },
      {
        title: "Live Transmission · Afro-Tech Chapter",
        date: "2026",
        url: "https://www.youtube.com/results?search_query=ape+drums+live",
      },
    ],
  },
  {
    id: "lazare",
    name: "LAZARE SABRY",
    role: "HEADLINER",
    origin: "CHICAGO, US",
    genre: "MELODIC HOUSE · TECHNO",
    image: "/images/lazare-recap.webp",
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
    image: "/images/artists/juany-bravo/juany-bravo-portrait.jpg",
    imagePosition: "50% 28%",
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
    id: "autograf",
    name: "AUTOGRAF",
    role: "LIVE SET",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE",
    image: "/images/artist-autograf-new.jpg",
    series: ["chasing-sunsets"],
    bio: "Autograf is a dynamic DJ group known for their unique Afrohouse sound that’s captivated audiences worldwide. Their innovative music has earned them spots at top festivals like Coachella, Lollapalooza, and EDC Las Vegas. Their live 360 performances offer fans an immersive experience, making them feel like a part of the show.",
    tags: ["Afro House", "Live 360", "Global Touring"],
    socials: {},
    tracks: [
      { title: "Dream", duration: "3:45" },
      { title: "Nobody Knows", duration: "3:58" },
      { title: "Simple", duration: "4:12" },
    ],
  },
  {
    id: "sommers-uk",
    name: "SOMMERS (UK)",
    role: "FEATURED SET",
    origin: "LONDON, UK",
    genre: "AFRO-TECH · MELODIC HOUSE",
    image: "/images/artists/sommers-uk/sommers-uk-portrait.jpg",
    imagePosition: "50% 28%",
    series: ["chasing-sunsets", "sunsets-radio"],
    bio: "SOMMERS (UK) is a London-based duo shaping a distinctive fusion of Afro-Tech and melodic house. Their Chasing Sun(Sets) session moves through warm, open-air pacing with a deeper club pulse underneath.",
    tags: ["Afro-Tech", "Melodic House", "UK Duo"],
    socials: {},
    tracks: [],
    previousSets: [
      {
        title: "CHAPTER 1 · CHASING SUN(SETS)",
        date: "SUN(SETS) RADIO",
        url: "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets",
      },
    ],
    galleryCredit: "Darren Hartwell · Apollo Flux",
    galleryLabel: "Press Gallery",
    gallery: [
      {
        src: "/images/artists/sommers-uk/sommers-uk-motion.jpg",
        alt: "SOMMERS (UK) red-room motion portrait",
      },
      {
        src: "/images/artists/sommers-uk/sommers-uk-press-01.jpg",
        alt: "SOMMERS (UK) duo press portrait",
      },
      {
        src: "/images/artists/sommers-uk/sommers-uk-press-02.jpg",
        alt: "SOMMERS (UK) red-room editorial portrait",
      },
      {
        src: "/images/artists/sommers-uk/sommers-uk-press-03.jpg",
        alt: "SOMMERS (UK) close-up press portrait",
      },
      {
        src: "/images/artists/sommers-uk/sommers-uk-press-04.jpg",
        alt: "SOMMERS (UK) back-to-back press portrait",
      },
    ],
  },
  {
    id: "chris-idh",
    name: "CHRIS IDH",
    role: "GUEST",
    origin: "PARIS, FR",
    genre: "ORGANIC HOUSE",
    image: "/images/artists/chris-idh/chris-idh-portrait.jpg",
    imagePosition: "58% 28%",
    series: ["sunsets-radio"],
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
    id: "summermel",
    name: "SUMMER MEL",
    role: "RESIDENT",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · ORGANIC HOUSE",
    image: "/images/artists/summer-mel/summer-mel-orange-portrait.jpg",
    imagePosition: "50% 34%",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Summer Mel blends energetic Afro house rhythms with deep, organic grooves. As a Resident DJ for Chasing Sun(Sets), he captures the perfect golden-hour warmth and transitions seamlessly into high-energy nightfall sessions. He was instrumental in launching the very first Untold Story and recently provided pivotal support for the defining Lazare & Sabry set.",
    tags: ["Resident", "Afro House", "Organic House"],
    socials: { instagram: "https://instagram.com/summermel" },
    tracks: [
      { title: "Golden Hour Set", duration: "60:00" },
      { title: "Open Air Mix", duration: "55:30" },
    ],
    previousSets: [
      { title: "The First Untold Story", date: "2024" },
      { title: "Lazare x Sabry Support", date: "2025" },
    ],
  },
  {
    id: "joezi",
    name: "JOEZI",
    role: "GUEST",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    image: "/images/artists/joezi/joezi-portrait.jpg",
    imagePosition: "50% 28%",
    series: ["untold-story"],
    bio: "Joezi's Afro-house rhythms and percussive energy have captivated audiences worldwide. He brings a vibrant, rhythmic pulse to sunset and late-night floors alike.",
    tags: ["Afro House", "Percussive", "Groove"],
    socials: {},
    tracks: [
      { title: "7 Seconds", duration: "6:20" },
      { title: "Africa", duration: "5:10" },
      { title: "The Way", duration: "4:55" },
    ],
    galleryLabel: "Press Gallery",
    gallery: [
      {
        src: "/images/artists/joezi/joezi-portrait.jpg",
        alt: "Joezi portrait with crossed tattooed arms",
      },
      {
        src: "/images/artists/joezi/joezi-press-01.jpg",
        alt: "Joezi seated portrait wearing sunglasses",
      },
    ],
    featuredVideo: {
      url: "https://youtu.be/qMWZngFojK0",
      title: "JOEZI Live DJ Set @SOLLUNA Festival W2026",
      label: "Live at SOLLUNA Festival · W2026",
      source: "SOLLUNA FESTIVAL",
      description:
        "Joezi's live set from SOLLUNA Festival W2026, embedded from the festival's official YouTube release.",
    },
  },
  {
    id: "benchek",
    name: "BENCHEK",
    role: "RESIDENT DJ",
    origin: "BERLIN, DE",
    genre: "MELODIC TECHNO",
    image: "/images/artists/benchek/benchek-portrait.jpg",
    imagePosition: "50% 28%",
    series: ["sunsets-radio"],
    bio: "Benchek's mixes balance melodic intensity with dancefloor precision, both on radio episodes and live sets.",
    tags: ["Resident DJ", "Melodic Techno", "Radio"],
    socials: {},
    tracks: [
      { title: "Chapter III", duration: "58:23" },
      { title: "Marbella Live", duration: "64:17" },
      { title: "Afterglow", duration: "6:12" },
    ],
    galleryLabel: "Press Gallery",
    gallery: [
      {
        src: "/images/artists/benchek/benchek-press-02.jpg",
        alt: "Benchek full-length studio portrait in a green suit",
      },
      {
        src: "/images/artists/benchek/benchek-press-01.jpg",
        alt: "Benchek studio portrait in a white shirt",
      },
      {
        src: "/images/artists/benchek/benchek-press-03.jpg",
        alt: "Benchek close studio portrait",
      },
    ],
  },
  {
    id: "terranova",
    name: "TERRANOVA",
    role: "GUEST",
    origin: "BERLIN, DE",
    genre: "DEEP HOUSE · ELECTRONICA",
    image: "/images/artists/terranova/terranova-live.jpg",
    imagePosition: "50% 42%",
    series: ["untold-story"],
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
    role: "RESIDENT DJ",
    origin: "AMSTERDAM, NL",
    genre: "AFRO HOUSE · ORGANIC",
    image: "/images/artist-ewerseen-2026-v2.jpg",
    imagePosition: "50% 35%",
    series: ["sunsets-radio", "chasing-sunsets"],
    bio: "EWERSEEN merges afro and organic palettes with clean structure and deep rhythmic progression.",
    tags: ["Resident DJ", "Afro House", "Organic", "Radio"],
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
    role: "RESIDENT DJ",
    origin: "CHICAGO, US",
    genre: "MELODIC TECHNO · AFRO",
    image: "/images/artists/avo/avo-portrait.jpg",
    imagePosition: "50% 48%",
    series: ["untold-story"],
    bio: "A key Monolith Project resident, AVO blends deep melodic techno with percussive Afro-house rhythms. His sets are precise, physical, and built for raw late-night rooms, shaping the tension-and-release arc that defines Untold Story. He recently played alongside Deron and Juany Bravo, and provided direct support for Eran Hersh.",
    tags: ["Resident DJ", "Melodic Techno", "Afro House"],
    socials: { instagram: "https://instagram.com/avomusic_" },
    tracks: [
      { title: "Architectural tension", duration: "6:42" },
      { title: "Concrete Jungle", duration: "5:58" },
      { title: "Lunar Shift", duration: "7:12" },
    ],
    previousSets: [
      { title: "Direct Support for Eran Hersh", date: "2025" },
      { title: "Juany Bravo b2b Deron Support", date: "2025" },
      {
        title: "Untold Story S1 E4",
        date: "Nov 2024",
        url: "https://soundcloud.com/avomusic",
      },
      {
        title: "Monolith Radio 038",
        date: "Aug 2024",
        url: "https://soundcloud.com/avomusic",
      },
    ],
  },
  {
    id: "eran-hersh",
    name: "ERAN HERSH",
    role: "HEADLINER",
    origin: "MIAMI, US",
    genre: "AFRO HOUSE · MELODIC HOUSE",
    image: "/images/eran-hersh-untold-story-iv-bw.jpg",
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
      {
        title: "Live at RheinRiff",
        date: "Sept 2025",
        url: "https://soundcloud.com/eranhersh",
      },
      {
        title: "Bazar by Sasson Chapter",
        date: "Aug 2025",
        url: "https://soundcloud.com/eranhersh",
      },
    ],
    gallery: [
      {
        src: "/images/eran-hersh-untold-story-iv-bw.jpg",
        alt: "Eran Hersh Untold Story IV Flyer",
      },
      {
        src: "/images/eran-hersh-live-1.webp",
        alt: "Eran Hersh live at Bazar by Sasson",
      },
      { src: "/images/eran-hersh-live-5.webp", alt: "Eran Hersh at RheinRiff" },
      { src: "/images/eran-hersh-live-6.png", alt: "Eran Hersh portrait" },
    ],
  },
  {
    id: "amari",
    name: "AMARI",
    role: "RESIDENT DJ",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · MELODIC HOUSE",
    image: "/images/artists/amari/amari-portrait.jpg",
    imagePosition: "50% 34%",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Amari anchors the Monolith sound across both open-air and after-dark sessions. As a Resident DJ for both Chasing Sun(Sets) and Untold Story, his sets seamlessly connect melodic groove with deep, rhythmic afro house.",
    tags: ["Resident DJ", "Afro House", "Melodic House"],
    socials: { instagram: "https://instagram.com/amari.music" },
    tracks: [
      { title: "Golden Hour Session", duration: "6:20" },
      { title: "After Dark Selection", duration: "5:45" },
    ],
  },
  {
    id: "sarat",
    name: "SARAT",
    role: "DJ · PRODUCER",
    origin: "CHICAGO, US",
    genre: "HOUSE · AFRO HOUSE",
    image: "/images/artists/sarat/sarat-live.jpg",
    imagePosition: "62% 36%",
    series: ["chasing-sunsets"],
    bio: "Chicago DJ, producer, and drone photographer Sarat builds house sets around the city's first light. A spontaneous 5 a.m. North Avenue Beach session became a local viral moment in 2024, and that experiment grew into a run of sunrise and open-water mixes—including WHY NOT and 5AM Boat Flow—alongside appearances in the Chasing Sun(Sets) orbit.",
    tags: ["Sunrise Sets", "House", "Lakefront"],
    socials: {
      instagram: "https://instagram.com/sarat_music",
      website: "https://soundcloud.com/sarat_music",
    },
    tracks: [],
  },
  {
    id: "jerome",
    name: "JEROME",
    role: "RESIDENT DJ",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists/jerome/jerome-portrait.jpg",
    imagePosition: "56% 52%",
    series: ["chasing-sunsets", "untold-story"],
    bio: "Jerome is a producer, local Chicago DJ, and Resident for the Monolith ecosystem, setting the standard for opening sets across both day and night formats.",
    tags: ["Resident DJ", "Producer", "Local"],
    socials: {},
    tracks: [],
  },
  {
    id: "rose",
    name: "ROSE",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists/rose/rose-live.png",
    imagePosition: "62% 34%",
    series: ["untold-story"],
    bio: "Rose is a standout selector who recently played the massive Juany Bravo b2b Deron show, as well as the Autograf headline event, establishing herself as a go-to name for direct support.",
    tags: ["Guest", "Local Support"],
    socials: {},
    tracks: [],
    previousSets: [
      { title: "Juany Bravo b2b Deron Show", date: "2025" },
      { title: "Autograf Show", date: "2024" },
    ],
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
    image: "/images/artists/kenbo-slice/kenbo-slice-portrait.jpg",
    imagePosition: "50% 52%",
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
    image: "/images/artists/jealah/jealah-portrait.jpg",
    imagePosition: "50% 28%",
    series: ["untold-story", "chasing-sunsets"],
    bio: "Jealah is a standout local artist and vibrant selector who provided essential support at the massive Autograf headline show.",
    tags: ["Guest", "Local Support"],
    socials: {},
    tracks: [],
    previousSets: [{ title: "Autograf Show Support", date: "2024" }],
  },
  {
    id: "maximo",
    name: "MAXIMO",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists/maximo/maximo-portrait.jpg",
    imagePosition: "50% 28%",
    series: ["untold-story", "chasing-sunsets"],
    bio: "Maximo is a commanding presence in the late-night circuit, having notably closed out the massive Autograf show in March with an unforgettable set.",
    tags: ["Guest", "Closer"],
    socials: {},
    tracks: [],
    previousSets: [{ title: "Autograf Show Closing Set", date: "Mar 2024" }],
  },
  {
    // OWNER REWRITE: approved biography, socials, and tracks remain pending.
    id: "massuma",
    name: "MASSUMA (UK)",
    role: "GUEST",
    origin: "UNITED KINGDOM",
    genre: "AFRO HOUSE",
    image: "/images/artists/massuma-uk/massuma-uk-portrait.jpg",
    imagePosition: "50% 26%",
    series: ["untold-story", "chasing-sunsets"],
    bio: "Bio coming soon.",
    tags: ["Guest", "UK"],
    socials: {},
    tracks: [],
    featuredVideo: {
      url: "https://www.youtube.com/watch?v=iErA3nUrdQE",
      title: "Massuma - Live @ KOKO London | Afro & Melodic House Set (2026)",
      label: "Live @ KOKO London · 2026",
      source: "MASSUMA (UK)",
      description:
        "Massuma's live Afro & Melodic House set at KOKO London, embedded from his official YouTube release.",
    },
  },
  {
    id: "eliana",
    name: "ELIANA",
    role: "RESIDENT DJ",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists/eliana/eliana-live.png",
    imagePosition: "50% 35%",
    series: ["chasing-sunsets"],
    bio: "Eliana is a standout selector, bringing essential energy and curation to the Chasing Sun(Sets) series.",
    tags: ["Resident DJ", "Local"],
    socials: {},
    tracks: [],
  },
  {
    id: "gianniblu",
    name: "GIANNI BLU",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists-collective.webp",
    series: ["chasing-sunsets"],
    bio: "Gianni Blu brings fresh energy to the house music scene with sets tailored for the daytime lakefront.",
    tags: ["Guest", "Local Support"],
    socials: {},
    tracks: [],
  },
  {
    id: "frankbono",
    name: "FRANK BONO",
    role: "RESIDENT DJ",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/chasing-sunsets-1.jpg",
    series: ["chasing-sunsets"],
    bio: "Frank Bono is a dedicated local artist providing essential support and high-energy selections for Chicago's premier open-air shows.",
    tags: ["Resident DJ", "Local"],
    socials: {},
    tracks: [],
  },
  {
    id: "erikthedj",
    name: "ERIK THE DJ",
    role: "RESIDENT DJ · CREATIVE DIRECTOR",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/artists-collective.webp",
    series: ["chasing-sunsets"],
    bio: "Erik The DJ is Creative Director of the Monolith Project and a Resident DJ for Chasing Sun(Sets), setting the standard for opening sets across day formats.",
    tags: ["Resident DJ", "Creative Director", "Local"],
    socials: {},
    tracks: [],
  },
  {
    id: "colin",
    name: "COLIN",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/chasing-sunsets-premium.webp",
    series: ["chasing-sunsets"],
    bio: "Colin provides essential support and deep grooves for Chasing Sun(Sets).",
    tags: ["Guest", "Local Support"],
    socials: {},
    tracks: [],
  },
  {
    id: "nomar",
    name: "NOMAR",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "HOUSE",
    image: "/images/autograf-recap.jpg",
    series: ["chasing-sunsets"],
    bio: "Nomar is a commanding presence in the Chicago house scene.",
    tags: ["Guest", "Local Support"],
    socials: {},
    tracks: [],
  },
];

export const ARTISTS: Record<string, ArtistData> = Object.fromEntries(
  ARTIST_ENTRIES.map(artist => [artist.id, artist])
) as Record<string, ArtistData>;
