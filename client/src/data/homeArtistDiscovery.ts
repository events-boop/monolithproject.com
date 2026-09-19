import { ARTISTS } from "./artists";

/** Homepage introductions, using existing artist/show material and official sets. */
export const HOME_ARTIST_DISCOVERY = [
  {
    artist: ARTISTS.joezi,
    name: "JOEZI",
    sound: "Afro house / Melodic",
    introduction:
      "Soulful vocals, melodic hooks and percussion with a pulse. Start with JOEZI’s set from SOLLUNA and get to know the sound behind the name.",
    listen: {
      href: ARTISTS.joezi.featuredVideo!.url,
      title: "Live at SOLLUNA",
      platform: "YouTube",
      action: "Watch the set",
    },
    eventId: "css-sep19",
  },
  {
    artist: ARTISTS.massuma,
    name: "MASSUMA",
    sound: "Afro house / Melodic",
    introduction:
      "Warm basslines and rolling grooves connect Afro and melodic house. Hear MASSUMA build a room in his full-length set from KOKO London.",
    listen: {
      href: ARTISTS.massuma.featuredVideo!.url,
      title: "Live at KOKO London",
      platform: "YouTube",
      action: "Watch the set",
    },
    eventId: "css-sep19",
  },
  {
    artist: ARTISTS["gene-farris"],
    name: "GENE FARRIS",
    sound: "Chicago house / Tech house",
    introduction:
      "Chicago house roots, soulful textures and driving grooves. Meet the Farris Wheel Recordings founder through his extended Groove Cruise sunrise set.",
    listen: {
      href: "https://soundcloud.com/genefarris/groove-cruise-gene-farris-3hrs-of-4-hr-sunrise-set-2026",
      title: "Groove Cruise sunrise set",
      platform: "SoundCloud",
      action: "Listen to the set",
    },
    eventId: "css-aug22",
  },
];
