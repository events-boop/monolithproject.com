import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Globe, MapPin, Music } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type ArtistSeries = "chasing-sunsets" | "untold-story" | "sunsets-radio";

interface ArtistProfileData {
  name: string;
  image: string;
  role: string;
  series: ArtistSeries;
  origin: string;
  genre: string;
  bio: string;
  tags: string[];
  socials: { instagram: string; website: string };
  tracks: { title: string; duration: string }[];
}

const ARTISTS: Record<string, ArtistProfileData> = {
  "haai": {
    name: "HAAi",
    image: "/images/artist-haai.webp",
    role: "HEADLINER",
    series: "untold-story",
    origin: "LONDON, UK",
    genre: "PSYCHEDELIC TECHNO",
    bio: "Hailing from Australia and based in London, HAAi continues to redefine the boundaries of club music. Her sets are a journey through genre-bending soundscapes that fit the Untold Story format.",
    tags: ["Techno", "Psychedelic", "Alternative"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Baby, We're Ascending", duration: "5:42" },
      { title: "The Sun Made For A Soft Landing", duration: "4:15" },
      { title: "Lights Out", duration: "6:03" },
    ],
  },
  "lazare": {
    name: "LAZARE",
    image: "/images/artist-lazare.webp",
    role: "RESIDENT",
    series: "untold-story",
    origin: "PARIS, FR",
    genre: "MELODIC HOUSE",
    bio: "A staple of the Monolith sound. Lazare brings a sophisticated blend of melodic house and progressive rhythms, with sets known for emotional depth and driving energy.",
    tags: ["Melodic", "Progressive", "House"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Eternal Echoes", duration: "6:15" },
      { title: "Nightfall", duration: "5:30" },
      { title: "Resonance", duration: "4:45" },
    ],
  },
  "chus": {
    name: "CHUS",
    image: "/images/artist-chus.webp",
    role: "GUEST",
    series: "chasing-sunsets",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    bio: "Chus' Afro-house rhythms and percussive energy have captivated audiences worldwide. He brings a vibrant, rhythmic pulse to sunset and late-night floors alike.",
    tags: ["Afro House", "Percussive", "Groove"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "7 Seconds", duration: "6:20" },
      { title: "Africa", duration: "5:10" },
      { title: "The Way", duration: "4:55" },
    ],
  },
  "autograf": {
    name: "AUTOGRAF",
    image: "/images/artist-autograf.webp",
    role: "LIVE SET",
    series: "chasing-sunsets",
    origin: "CHICAGO, US",
    genre: "FUTURE HOUSE",
    bio: "Autograf blends live instrumentation with electronic production, creating immersive performances with melodic hooks and club-forward energy.",
    tags: ["Live Electronic", "Indie Dance", "Future House"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Dream", duration: "3:45" },
      { title: "Nobody Knows", duration: "3:58" },
      { title: "Simple", duration: "4:12" },
    ],
  },
  "deron": {
    name: "DERON",
    image: "/images/untold-story-juany-deron-v2.jpg",
    role: "GUEST",
    series: "untold-story",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · MELODIC",
    bio: "Deron is known for emotionally driven selections that move from deep grooves into peak-hour storytelling. His Untold Story sets are designed for dancers first.",
    tags: ["Afro House", "Melodic", "Late Night"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Untold Intro", duration: "4:32" },
      { title: "Chapter Shift", duration: "5:19" },
      { title: "Closing Ceremony", duration: "6:04" },
    ],
  },
  "juany-bravo": {
    name: "JUANY BRAVO",
    image: "/images/untold-story-juany-deron.webp",
    role: "GUEST",
    series: "untold-story",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · GLOBAL HOUSE",
    bio: "Juany Bravo brings a global, percussion-driven house language and a highly dynamic approach to b2b performance in intimate rooms.",
    tags: ["Global House", "Afro House", "B2B"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Ceremony Start", duration: "5:01" },
      { title: "Room Energy", duration: "5:47" },
      { title: "Sunrise Motif", duration: "4:58" },
    ],
  },
  "sabry": {
    name: "SABRY",
    image: "/images/untold-story.jpg",
    role: "RESIDENT",
    series: "untold-story",
    origin: "CHICAGO, US",
    genre: "DEEP HOUSE · TECHNO",
    bio: "Sabry anchors the Monolith sound with deep, hypnotic selections and long-form pacing that adapts to the room.",
    tags: ["Deep House", "Techno", "Resident"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Night Architecture", duration: "5:56" },
      { title: "After Hours Flow", duration: "6:08" },
      { title: "Signal Drift", duration: "4:43" },
    ],
  },
  "summers-uk": {
    name: "SUMMERS UK",
    image: "/images/chasing-sunsets.jpg",
    role: "GUEST",
    series: "chasing-sunsets",
    origin: "LONDON, UK",
    genre: "MELODIC HOUSE",
    bio: "Summers UK blends warm melodic arrangements with open-air pacing built for sunset transitions.",
    tags: ["Melodic House", "Sunset", "Open Air"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Golden Arrival", duration: "4:36" },
      { title: "West Terrace", duration: "5:14" },
      { title: "Hour Change", duration: "4:28" },
    ],
  },
  "chris-idh": {
    name: "CHRIS IDH",
    image: "/images/artist-joezi.webp",
    role: "GUEST",
    series: "chasing-sunsets",
    origin: "PARIS, FR",
    genre: "ORGANIC HOUSE",
    bio: "Chris IDH delivers textured, organic rhythms with a focus on movement and atmosphere.",
    tags: ["Organic", "Melodic", "House"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Open Roof", duration: "5:09" },
      { title: "Driftline", duration: "4:51" },
      { title: "Sunline", duration: "5:02" },
    ],
  },
  "benchek": {
    name: "BENCHEK",
    image: "/images/chasing-sunsets.jpg",
    role: "GUEST",
    series: "sunsets-radio",
    origin: "BERLIN, DE",
    genre: "MELODIC TECHNO",
    bio: "Benchek's mixes balance melodic intensity with dancefloor precision, both on radio episodes and live sets.",
    tags: ["Melodic Techno", "Radio", "Guest"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Chapter III", duration: "58:23" },
      { title: "Marbella Live", duration: "64:17" },
      { title: "Afterglow", duration: "6:12" },
    ],
  },
  "terranova": {
    name: "TERRANOVA",
    image: "/images/autograf-recap.jpg",
    role: "GUEST",
    series: "sunsets-radio",
    origin: "BERLIN, DE",
    genre: "DEEP HOUSE · ELECTRONICA",
    bio: "Terranova blends deep house and electronica into detailed long-form sessions tailored for immersive listening.",
    tags: ["Deep House", "Electronica", "Radio"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "TERRANOVA x CHASING SUN(SETS)", duration: "62:10" },
      { title: "Night Thread", duration: "5:26" },
      { title: "Pulse Study", duration: "4:50" },
    ],
  },
  "ewerseen": {
    name: "EWERSEEN",
    image: "/images/radio-show.jpg",
    role: "GUEST",
    series: "sunsets-radio",
    origin: "AMSTERDAM, NL",
    genre: "AFRO HOUSE · ORGANIC",
    bio: "EWERSEEN merges afro and organic palettes with clean structure and deep rhythmic progression.",
    tags: ["Afro House", "Organic", "Radio"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Mix Vol.3", duration: "55:48" },
      { title: "Collab Mix Vol.2", duration: "48:32" },
      { title: "Crossfade", duration: "5:03" },
    ],
  },
  "radian": {
    name: "RADIAN",
    image: "/images/radio-show.jpg",
    role: "RADIO MIX",
    series: "sunsets-radio",
    origin: "GLOBAL",
    genre: "MELODIC HOUSE · DEEP",
    bio: "Radian brings immersive, slow-burn melodic journeys built for repeat listening and late-night movement.",
    tags: ["Radio", "Melodic", "Deep"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "RADIAN x UNTOLD STORY", duration: "71:05" },
      { title: "Signal Path", duration: "5:11" },
      { title: "Echo Frame", duration: "4:57" },
    ],
  },
};

const LEGACY_ID_MAP: Record<string, string> = {
  "1": "haai",
  "3": "lazare",
  "4": "chus",
  "5": "autograf",
  // Backward compatible artist slug
  "joezi": "chus",
};

function resolveArtistId(id: string | undefined) {
  if (!id) return undefined;
  if (ARTISTS[id]) return id;
  const legacy = LEGACY_ID_MAP[id];
  if (legacy && ARTISTS[legacy]) return legacy;
  return undefined;
}

export default function ArtistProfile() {
  const { id } = useParams<{ id: string }>();
  const resolvedId = resolveArtistId(id);
  const artist = resolvedId ? ARTISTS[resolvedId] : undefined;

  if (!artist) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <section className="pt-48 pb-24 px-6">
          <div className="container max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-4">Artist</p>
            <h1 className="font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9] uppercase mb-6">Profile Not Found</h1>
            <p className="text-muted-foreground mb-8">We couldn't find that artist profile. View the full lineup to continue.</p>
            <Link href="/lineup" asChild>
              <a className="btn-pill-coral inline-flex">View Lineup</a>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const isWarmSeries = artist.series !== "untold-story";
  const accentClass = isWarmSeries ? "text-clay" : "text-primary";
  const borderAccent = isWarmSeries ? "border-clay" : "border-primary";
  const bgAccent = isWarmSeries ? "bg-clay/5" : "bg-primary/5";

  const eventDetails = isWarmSeries
    ? { date: "August 22, 2026", venue: "TBA", location: "Chicago, IL" }
    : { date: "March 6, 2026", venue: "Alhambra Palace", location: "Chicago, IL" };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <section className="relative pt-40 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_12%_18%,rgba(224,90,58,0.18),transparent_34%),radial-gradient(circle_at_88%_20%,rgba(255,255,255,0.08),transparent_36%)]" />

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-[360px_1fr] gap-10 items-end"
          >
            <div className="bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <div className="bg-zinc-100 p-3">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="flex items-center justify-between mt-3 text-[11px] font-mono tracking-wide text-zinc-600 uppercase">
                  <span>{artist.name}</span>
                  <span>{artist.role}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 border ${borderAccent} ${accentClass} text-xs font-mono tracking-widest uppercase`}>
                  {artist.role}
                </span>
                <span className={`text-xs font-mono tracking-widest uppercase ${accentClass}`}>
                  {artist.series === "chasing-sunsets" ? "Sun(Sets)" : artist.series === "sunsets-radio" ? "Sun(Sets) Radio" : "Untold Story"}
                </span>
              </div>

              <h1 className="font-display text-[clamp(3.2rem,9vw,8.5rem)] leading-[0.9] uppercase text-foreground mb-6">
                {artist.name}
              </h1>

              <div className="flex flex-wrap gap-6 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> {artist.origin}
                </span>
                <span className="flex items-center gap-2">
                  <Music className="w-3 h-3" /> {artist.genre}
                </span>
              </div>

              <p className="text-muted-foreground max-w-2xl leading-relaxed mb-8">
                {artist.bio}
              </p>

              <Link href="/tickets" asChild>
                <a className="btn-pill-coral inline-flex">
                  View Event Tickets
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h3 className="font-display text-2xl text-foreground mb-4 uppercase">About</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {artist.bio}
            </p>

            <div className="flex gap-3 mt-6 flex-wrap">
              {artist.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 border border-border text-xs font-mono tracking-widest uppercase text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <a href={artist.socials.instagram} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors" aria-label={`${artist.name} Instagram`}>
                <Instagram className="w-4 h-4" />
              </a>
              <a href={artist.socials.website} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors" aria-label={`${artist.name} Website`}>
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </section>

          <section>
            <h3 className="font-display text-2xl text-foreground mb-6 uppercase">Selected Tracks</h3>
            <div className="border-t border-border">
              {artist.tracks.map((track, i) => (
                <div
                  key={`${artist.name}-${track.title}`}
                  className="group flex items-center justify-between py-4 border-b border-border hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground font-mono text-sm w-6">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-foreground group-hover:text-primary transition-colors">
                      {track.title}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className={`p-8 border ${borderAccent} ${bgAccent}`}>
            <h4 className={`font-display text-xl ${accentClass} mb-6 uppercase`}>
              {artist.series === "chasing-sunsets" ? "Chasing Sun(Sets)" : artist.series === "sunsets-radio" ? "Sun(Sets) Radio" : "Untold Story"}
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Date</span>
                <span className="text-foreground">{eventDetails.date}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Location</span>
                <span className="text-foreground">{eventDetails.location}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Venue</span>
                <span className="text-foreground">{eventDetails.venue}</span>
              </div>

              <Link href="/tickets" asChild>
                <a
                  className={`block w-full text-center py-4 mt-4 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer ${
                    isWarmSeries
                      ? "bg-clay text-background hover:bg-foreground"
                      : "bg-primary text-primary-foreground hover:bg-foreground"
                  }`}
                >
                  Get Tickets
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
