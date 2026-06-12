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
    // OWNER REWRITE: placeholder bio assembled from launch-brief source
    // material — replace with approved copy before/at announcement push.
    id: "kiko-franco",
    name: "KIKO FRANCO",
    role: "JULY 4 HEADLINER",
    origin: "RIO DE JANEIRO, BR",
    genre: "AFRO HOUSE",
    image: "/images/artist-kiko-franco.webp",
    series: ["chasing-sunsets"],
    bio: "Rio-born Kiko Franco took Afro House global with his No. 1 Beatport remix of \"Love Tonight\" — Diamond certified and a BBC Radio summer anthem — earning support from Black Coffee, Carl Cox, David Guetta, and Tiësto. From Tomorrowland Brasil to Burning Man and Ushuaïa, his sets carry golden-hour energy built for the lakefront. On July 4 he makes his Chicago lakefront debut headlining SUN(SETS) I.",
    tags: ["Afro House", "July 4 Headliner", "Lakefront Debut"],
    socials: {},
    tracks: [
      { title: "Love Tonight (Kiko Franco Remix)", duration: "—" },
      { title: "Live at Tomorrowland Brasil", duration: "—" },
      { title: "Ushuaïa Ibiza Session", duration: "—" },
    ],
  },
];,
];

export const ARTISTS: Record<string, ArtistData> = Object.fromEntries(
  ARTIST_ENTRIES.map(artist => [artist.id, artist])
) as Record<string, ArtistData>;
