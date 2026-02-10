import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Globe, MapPin, Music } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ARTISTS: Record<string, {
  name: string;
  image: string;
  role: string;
  series: "chasing-sunsets" | "untold-story";
  origin: string;
  genre: string;
  bio: string;
  tags: string[];
  socials: { instagram: string; website: string };
  tracks: { title: string; duration: string }[];
}> = {
  "1": {
    name: "HAAi",
    image: "/images/artist-haai.png",
    role: "HEADLINER",
    series: "untold-story",
    origin: "LONDON, UK",
    genre: "PSYCHEDELIC TECHNO",
    bio: "Hailing from Australia and based in London, HAAi continues to redefine the boundaries of club music. Her sets are a journey through genre-bending soundscapes — exactly what Untold Story was built for.",
    tags: ["Techno", "Psychedelic", "Alternative"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Baby, We're Ascending", duration: "5:42" },
      { title: "The Sun Made For A Soft Landing", duration: "4:15" },
      { title: "Lights Out", duration: "6:03" },
    ],
  },
  "3": {
    name: "LAZARE",
    image: "/images/artist-lazare.png",
    role: "RESIDENT",
    series: "untold-story",
    origin: "PARIS, FR",
    genre: "MELODIC HOUSE",
    bio: "A staple of the Monolith sound. Lazare brings a sophisticated blend of melodic techno and progressive rhythms — sets known for emotional depth and driving energy.",
    tags: ["Melodic Techno", "Progressive"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Eternal Echoes", duration: "6:15" },
      { title: "Nightfall", duration: "5:30" },
      { title: "Resonance", duration: "4:45" },
    ],
  },
  "4": {
    name: "JOEZI",
    image: "/images/artist-joezi.png",
    role: "GUEST",
    series: "chasing-sunsets",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    bio: "Joezi's Afro-house rhythms and infectious energy have captivated audiences worldwide. He brings a vibrant, rhythmic soul to the Chasing Sun(Sets) stage.",
    tags: ["Afro House", "Tribal"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "7 Seconds", duration: "6:20" },
      { title: "Africa", duration: "5:10" },
      { title: "The Way", duration: "4:55" },
    ],
  },
  "5": {
    name: "AUTOGRAF",
    image: "/images/artist-autograf.png",
    role: "LIVE SET",
    series: "chasing-sunsets",
    origin: "CHICAGO, US",
    genre: "FUTURE HOUSE",
    bio: "Autograf blends live instrumentation with electronic production, creating an immersive experience. Their 'Future Soup' sound is a perfect fit for Chasing Sun(Sets).",
    tags: ["Live Electronic", "Indie Dance", "Future Bass"],
    socials: { instagram: "#", website: "#" },
    tracks: [
      { title: "Dream", duration: "3:45" },
      { title: "Nobody Knows", duration: "3:58" },
      { title: "Simple", duration: "4:12" },
    ],
  },
};

export default function ArtistProfile() {
  const { id } = useParams();
  const artist = ARTISTS[id as keyof typeof ARTISTS] || ARTISTS["1"];

  const isSunsets = artist.series === "chasing-sunsets";
  const accentClass = isSunsets ? "text-clay" : "text-primary";
  const borderAccent = isSunsets ? "border-clay" : "border-primary";
  const bgAccent = isSunsets ? "bg-clay/5" : "bg-primary/5";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero — image-led profile card */}
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
                  {isSunsets ? "Sun(Sets)" : "Untold Story"}
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

              <Link href="/tickets">
                <a className="btn-pill-coral inline-flex">
                  View Event Tickets
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <div className="container max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Bio + Tracks */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h3 className="font-display text-2xl text-foreground mb-4 uppercase">About</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {artist.bio}
            </p>

            <div className="flex gap-3 mt-6">
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
              <a href={artist.socials.instagram} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={artist.socials.website} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </section>

          {/* Tracks */}
          <section>
            <h3 className="font-display text-2xl text-foreground mb-6 uppercase">Selected Tracks</h3>
            <div className="border-t border-border">
              {artist.tracks.map((track, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between py-4 border-b border-border hover:text-primary transition-colors cursor-pointer"
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

        {/* Right: Event sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className={`p-8 border ${borderAccent} ${bgAccent}`}>
            <h4 className={`font-display text-xl ${accentClass} mb-6 uppercase`}>
              {isSunsets ? "Chasing Sun(Sets)" : "Untold Story"}
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Date</span>
                <span className="text-foreground">August 22, 2026</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Location</span>
                <span className="text-foreground">Chicago, IL</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="text-muted-foreground uppercase tracking-widest text-xs font-mono">Venue</span>
                <span className="text-foreground">TBA</span>
              </div>

              <Link href="/tickets">
                <button className={`w-full py-4 mt-4 font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer ${
                  isSunsets
                    ? "bg-clay text-background hover:bg-foreground"
                    : "bg-primary text-primary-foreground hover:bg-foreground"
                }`}>
                  Get Tickets
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
