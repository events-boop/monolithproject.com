export interface EpisodeTrack {
  timecode: string;
  artist: string;
  title: string;
}

export interface EpisodeLink {
  label: string;
  url: string;
}

export interface RadioEpisode {
  slug: string;
  episodeNumber: number;
  shortCode: string;
  title: string;
  guest: string;
  datePublished: string;
  displayDate: string;
  duration: string;
  summary: string;
  narrative: string;
  image: string;
  coverImage?: string;
  embedUrl: string;
  audioUrl: string;
  guestLinks: EpisodeLink[];
  tracklist: EpisodeTrack[];
}

export const RADIO_SERIES_NAME = "Chasing Sun(Sets) Radio Show";

export const LEGACY_RADIO_SLUG_REDIRECTS: Record<string, string> = {
  autograf: "/artists/autograf",
  lazare: "/artists/lazare",
  "eran-hersh": "/story",
};

export const radioEpisodes: RadioEpisode[] = [
  {
    slug: "ep-004-benchek-part-2",
    episodeNumber: 5,
    shortCode: "EP004",
    title: "Live Set from Marbella Part II",
    guest: "BENCHEK",
    datePublished: "2026-02-15",
    displayDate: "February 15, 2026",
    duration: "64:17",
    summary: "BENCHEK returns with a live open-air session from Marbella, blending deep melodic grooves with classic sunset energy.",
    narrative: "This is BENCHEK's highly anticipated Part II. Recorded live during a golden-hour set in Marbella, the mix perfectly captures the essence of Chasing Sun(Sets). The selection moves seamlessly through percussive afro house into peak-time melodic anthems. The energy shift is palpable, reflecting the exact moment the sun dips below the horizon.",
    image: "/images/radio-show-gear.webp",
    coverImage: "https://i1.sndcdn.com/artworks-WN7kMdVH3nFy71kQ-s2YUBw-t500x500.jpg",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    audioUrl: "https://soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella",
    guestLinks: [
      { label: "BENCHEK on SoundCloud", url: "https://soundcloud.com/chasing-sun-sets" },
    ],
    tracklist: [
      { timecode: "00:00", artist: "BENCHEK", title: "Marbella Intro" },
      { timecode: "64:17", artist: "BENCHEK", title: "Marbella Outro" },
    ],
  },
  {
    slug: "ch-02-radian-no-sleep",
    episodeNumber: 6,
    shortCode: "CH-02",
    title: "Chapter II — No Sleep (Berlin)",
    guest: "RADIAN",
    datePublished: "2026-01-25",
    displayDate: "January 25, 2026",
    duration: "75:00",
    summary: "RADIAN's Chapter II session recorded in Berlin, pushing a darker, no-sleep narrative for the late-night hours.",
    narrative: "Recorded during a late-night session in Berlin, RADIAN's Chapter II titled 'No Sleep' dives into the heavier, more hypnotic side of The Monolith Project's sound. The transitions are incredibly patient, letting the driving basslines dictate the mood. It's a masterclass in tension and release, perfect for the darkest hours of the dancefloor.",
    image: "/images/radio-show-gear.webp",
    coverImage: "https://i1.sndcdn.com/artworks-ej63xmhBtCg8zlTu-8jyiyw-t500x500.jpg",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/radianofc-set&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    audioUrl: "https://soundcloud.com/chasing-sun-sets/radianofc-set",
    guestLinks: [
      { label: "RADIAN Feature", url: "https://soundcloud.com/chasing-sun-sets/radianofc-set" },
    ],
    tracklist: [
      { timecode: "00:00", artist: "RADIAN", title: "No Sleep Intro" },
      { timecode: "75:00", artist: "RADIAN", title: "Berlin Outro" },
    ],
  },
  {
    slug: "ep-01-benchek",
    episodeNumber: 1,
    shortCode: "EP-01",
    title: "Chapter III: Special NYE",
    guest: "BENCHEK",
    datePublished: "2025-12-30",
    displayDate: "December 30, 2025",
    duration: "58:23",
    summary:
      "BENCHEK opens the Chasing Sun(Sets) Radio Show with a melodic New Year transition session built for sunset starts and late-night lift.",
    narrative:
      "Episode 01 sets the frame for what Chasing Sun(Sets) Radio Show is supposed to be: a bridge between the rooftop chapter and the headphones chapter. BENCHEK starts with warm percussion and low-end patience, then gradually pushes into rolling melodic house without ever losing the sunset feel. The progression is intentional. Nothing rushes. Every transition sounds like a continuation of the same story instead of a hard cut for attention. That is exactly the energy we build at Chasing Sun(Sets) events in Chicago, and this first episode translates that identity into a clean, repeatable listen.\n\nThe middle section leans deeper with organic textures and vocal accents, then resolves with a final stretch designed for late-evening momentum. If you were at one of our golden-hour sessions, you will recognize the emotional pacing immediately. If this is your first time hearing Monolith, this is the right place to start: melodic, precise, and built for repeat listening.",
    image: "/images/radio-show-gear.webp",
    coverImage: "https://i1.sndcdn.com/artworks-WN7kMdVH3nFy71kQ-s2YUBw-t500x500.jpg",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    audioUrl:
      "https://soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek",
    guestLinks: [
      { label: "BENCHEK on SoundCloud", url: "https://soundcloud.com/chasing-sun-sets" },
      { label: "Chasing Sun(Sets) Instagram", url: "https://instagram.com/chasingsunsets.music" },
    ],
    tracklist: [
      { timecode: "00:00", artist: "BENCHEK", title: "Chapter III Intro" },
      { timecode: "08:42", artist: "Nitefreak", title: "Gorah (Afro House Edit)" },
      { timecode: "21:15", artist: "Samm", title: "Back To Life" },
      { timecode: "34:27", artist: "Hyenah", title: "The Wish" },
      { timecode: "47:08", artist: "BENCHEK", title: "Special NYE Closing Run" },
    ],
  },
  {
    slug: "ep-02-ewerseen",
    episodeNumber: 2,
    shortCode: "EP-02",
    title: "Mix Vol. 3",
    guest: "EWERSEEN",
    datePublished: "2025-11-14",
    displayDate: "November 14, 2025",
    duration: "55:48",
    summary:
      "EWERSEEN delivers a driving Afro and organic house blend that mirrors Chasing Sun(Sets) peak-hour movement.",
    narrative:
      "Episode 02 captures the dancefloor pressure point where Chasing Sun(Sets) usually shifts from social to fully locked in. EWERSEEN opens with tight drums and negative space, then layers melodic elements in measured steps so the groove keeps climbing without becoming noisy. That control is the signature here. Each blend leaves room for the previous idea to breathe before introducing the next one, which keeps the full hour fluid and focused.\n\nThe center of the mix is heavy on Afro House movement with organic textures that still feel open-air. That balance matters for this series because the Chasing Sun(Sets) identity is never about one-dimensional intensity; it is about building emotion while keeping rhythm in front. The final third leans slightly darker, then resolves with a cleaner melodic finish that feels like the last light disappearing over the skyline. For listeners finding us through search, this episode makes the case quickly: Chasing Sun(Sets) is a Chicago-rooted house music series with global range and mixes worth replaying.",
    image: "/images/radio-show-gear.webp",
    coverImage: "https://i1.sndcdn.com/artworks-FMot44uoQiVdP1Uj-bYxapA-t500x500.jpg",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    audioUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3",
    guestLinks: [
      { label: "EWERSEEN on SoundCloud", url: "https://soundcloud.com/chasing-sun-sets" },
      { label: "Chasing Sun(Sets) Instagram", url: "https://instagram.com/chasingsunsets.music" },
    ],
    tracklist: [
      { timecode: "00:00", artist: "EWERSEEN", title: "Mix Vol. 3 Intro" },
      { timecode: "11:33", artist: "Da Capo", title: "Found You" },
      { timecode: "23:09", artist: "Moojo", title: "Nuances" },
      { timecode: "36:41", artist: "Caiiro", title: "The Akan" },
      { timecode: "49:55", artist: "EWERSEEN", title: "Vol. 3 Outro" },
    ],
  },
  {
    slug: "ep-03-terranova",
    episodeNumber: 3,
    shortCode: "EP-03",
    title: "Terranova x Chasing Sun(Sets)",
    guest: "TERRANOVA",
    datePublished: "2025-10-03",
    displayDate: "October 3, 2025",
    duration: "62:10",
    summary:
      "A long-form guest mix from TERRANOVA with deep grooves, melodic lift, and patient transitions tuned for sunset-to-night listening.",
    narrative:
      "Episode 03 extends the radio format into a slower-burning arc. TERRANOVA approaches this mix like a full room journey: understated opening, mid-set tension, and a final run that lifts without breaking the emotional thread. The arrangement is minimal in the best way. Percussion and bass are always doing the work, while melodic motifs are introduced sparingly so each one has impact.\n\nThis episode is useful for understanding the overlap between our event series and radio identity. On the event side, Chasing Sun(Sets) is about golden-hour gatherings in Chicago with Afro House, Organic House, and Melodic House at the center. On the radio side, the same palette becomes a long-form listening environment where details are easier to hear. TERRANOVA keeps that DNA intact from start to finish. The transitions are deliberate, EQ work is clean, and the pacing never chases shortcuts. If you are curating a weekend sunset stack, this is one of the most replayable entries in the archive.",
    image: "/images/radio-show-gear.webp",
    coverImage: "https://i1.sndcdn.com/artworks-yrdlfcJnVQdyx9ZE-uV4tLw-t500x500.jpg",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/terranova&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    audioUrl: "https://soundcloud.com/chasing-sun-sets/terranova",
    guestLinks: [
      { label: "TERRANOVA Feature", url: "https://soundcloud.com/chasing-sun-sets/terranova" },
      { label: "The Monolith Project YouTube", url: "https://youtube.com/@monolithproject" },
    ],
    tracklist: [
      { timecode: "00:00", artist: "TERRANOVA", title: "Guest Session Intro" },
      { timecode: "14:22", artist: "Arodes", title: "Concentrate" },
      { timecode: "28:06", artist: "Notre Dame", title: "Yumi" },
      { timecode: "41:50", artist: "Keinemusik", title: "Move" },
      { timecode: "57:12", artist: "TERRANOVA", title: "Sunline Exit" },
    ],
  },
  {
    slug: "ep-04-radian",
    episodeNumber: 4,
    shortCode: "EP-04",
    title: "Radian x Untold Story Crossover",
    guest: "RADIAN",
    datePublished: "2025-09-12",
    displayDate: "September 12, 2025",
    duration: "71:05",
    summary:
      "RADIAN takes the Chasing Sun(Sets) format deeper with a crossover session connecting sunset warmth to late-night Untold Story energy.",
    narrative:
      "Episode 04 is a crossover by design. RADIAN starts in the Chasing Sun(Sets) lane with open, melodic phrasing, then threads in darker textures associated with Untold Story while keeping the groove consistent. That duality is why this set matters in the archive. It demonstrates how the two Monolith chapters speak to each other without losing their own identities.\n\nFrom an arrangement standpoint, the mix uses long blends and gradual harmonic movement, which makes the 71-minute runtime feel shorter than it is. The percussive layer stays active through the entire session, but the emotional tone shifts in stages: warm entry, focused middle, and a more immersive final act. For returning listeners, it plays like a bridge set you can use before a night event. For new listeners, it makes the relationship clear: Chasing Sun(Sets) opens the evening, Untold Story takes it deeper, and both belong to the same Chicago music world. This episode is one of the strongest examples of that overlap on radio.",
    image: "/images/radio-show-gear.webp",
    coverImage: "https://i1.sndcdn.com/artworks-ej63xmhBtCg8zlTu-8jyiyw-t500x500.jpg",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/radianofc-set&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    audioUrl: "https://soundcloud.com/chasing-sun-sets/radianofc-set",
    guestLinks: [
      { label: "RADIAN Feature", url: "https://soundcloud.com/chasing-sun-sets/radianofc-set" },
      { label: "Untold Story Event Series", url: "/story" },
    ],
    tracklist: [
      { timecode: "00:00", artist: "RADIAN", title: "Crossover Intro" },
      { timecode: "16:18", artist: "AMEME", title: "Ando High" },
      { timecode: "31:44", artist: "Bun Xapa", title: "Mali Spirit" },
      { timecode: "48:02", artist: "Eli & Fur", title: "Insomnia" },
      { timecode: "63:15", artist: "RADIAN", title: "Untold Closing Theme" },
    ],
  },
];

export function getRadioEpisode(slug: string) {
  return radioEpisodes.find((episode) => episode.slug === slug);
}

export function getLegacyRadioRedirect(slug: string) {
  return LEGACY_RADIO_SLUG_REDIRECTS[slug.trim().toLowerCase()];
}
