import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, Calendar, MapPin, Clock, Users, Shirt } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import { POSH_TICKET_URL } from "@/data/events";

// Untold Story palette — Electric Violet + Cyan
const violet = "#8B5CF6";
const cyan = "#22D3EE";
const deepBg = "#06060F";
const cardBg = "#0C0C1A";

const eventVisuals = {
  poster: "/images/untold-juany-deron-poster.jpg",
  deron: "/images/untold-deron-single.jpg",
  juany: "/images/untold-juany-single.jpg",
};

const lineupVisuals = [
  { name: "Juany Bravo", role: "B2B set with Deron", image: "/images/lineup-juany-bravo.jpg" },
  { name: "Deron", role: "Chicago debut", image: "/images/lineup-deron.jpg" },
  { name: "Hashtom", role: "Support", image: "/images/lineup-hashtom.jpg" },
  { name: "Rose", role: "Support", image: "/images/lineup-rose.jpg" },
  { name: "Avo", role: "Support", image: "/images/lineup-avo.jpg" },
  { name: "Jerome b2b Kenbo", role: "Support", image: "/images/lineup-jerome-kenbo.jpg" },
];

export default function UntoldStory() {
  const faqs = [
    ["Are tickets refundable?", "All sales are final. No refunds or exchanges."],
    ["What time should I arrive?", "Doors open at 7:00 PM. Peak experience begins around 9:00 PM. Early arrival is recommended for the full journey."],
    ["Is there re-entry?", "No re-entry permitted once you leave the venue."],
    ["What's the age requirement?", "21+ only. Valid government-issued ID required for entry."],
    ["Is parking available?", "Street parking and nearby garage parking available in the West Loop. Rideshare recommended."],
    ["Do I need printed tickets?", "No. Mobile QR codes are accepted at the door."],
    ["What's the dress code?", "Elevated nightlife attire encouraged. Dress to move comfortably — this is a dancefloor experience."],
    ["Is food available?", "Yes. Food is available inside the venue."],
    ["Can I bring a camera?", "Personal photos welcome. Professional cameras require prior approval. This event will be photographed for Monolith Project and partner marketing channels."],
    ["What if the event is sold out?", "Limited door tickets may be available on the night of the event, but advance purchase is strongly recommended."],
  ];

  return (
    <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white" style={{ background: deepBg }}>
      <Navigation />

      {/* Hero — heavy, dark, confrontational */}
      <section className="relative pt-48 pb-32 px-6">
        {/* Subtle purple glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle, ${violet}, transparent)` }} />

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <UntoldButterflyLogo className="w-20 h-20 mb-8 text-[#8B5CF6]" glow />
            <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-6" style={{ color: cyan }}>
              Series 02
            </span>
            <h1 className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] uppercase text-white mb-8 tracking-tight-display">
              UNTOLD
              <br />
              STORY
            </h1>
            <p className="max-w-lg text-white/50 text-lg leading-relaxed">
              Late night. Intimate rooms. 360 sound. The story is told
              through the music — no narrative, no script, just what happens
              when the lights go down.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Event Detail */}
      <section className="py-24 px-6 border-t" style={{ background: cardBg, borderColor: `${violet}15` }}>
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-8 pb-6" style={{ borderBottom: `1px solid ${violet}20` }}>
            <div>
              <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-2" style={{ color: cyan }}>
                Season III · Episode II
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-white">JUANY BRAVO B2B DERON</h2>
            </div>
            <span className="font-mono text-xs tracking-widest" style={{ color: violet }}>THE JUANY X DERON SHOW</span>
          </div>

          {/* Featured event card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
            style={{ border: `1px solid ${violet}30`, background: deepBg }}
          >
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-10 blur-[100px] pointer-events-none" style={{ background: violet }} />

            <div className="relative p-8 md:p-12">
              <div className="mb-10 overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
                <img
                  src={eventVisuals.poster}
                  alt="Juany Bravo b2b Deron featured event artwork"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-10">
                <div className="overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
                  <img
                    src={eventVisuals.deron}
                    alt="Deron portrait artwork"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
                  <img
                    src={eventVisuals.juany}
                    alt="Juany Bravo portrait artwork"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-10">
                A late-night journey through Afro and melodic house led by two of Chicago's finest selectors in an immersive 360° dancefloor experience.
              </p>

              {/* Event details grid */}
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-4" style={{ color: cyan }}>
                Event Details
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10" style={{ borderBottom: `1px solid ${violet}15` }}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] tracking-widest uppercase">Date</span>
                  </div>
                  <p className="text-white text-sm font-medium">Friday, March 6, 2026</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] tracking-widest uppercase">Doors</span>
                  </div>
                  <p className="text-white text-sm font-medium">7:00 PM</p>
                  <p className="text-white/40 text-xs">Main Experience: 9:00 PM - 2:00 AM</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] tracking-widest uppercase">Venue</span>
                  </div>
                  <p className="text-white text-sm font-medium">Alhambra Palace</p>
                  <p className="text-white/40 text-xs">West Loop, Chicago</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-mono text-[10px] tracking-widest uppercase">Age</span>
                  </div>
                  <p className="text-white text-sm font-medium">21+ (Valid ID Required)</p>
                </div>
              </div>

              {/* The experience */}
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                The Experience
              </span>
              <p className="text-white/70 text-base leading-relaxed mb-4">
                Untold Story returns with its most anticipated pairing yet. Juany Bravo and Deron share the decks for an extended B2B session, moving from deep, soulful grooves to peak-hour energy inside the intimate Alhambra Palace setting.
              </p>
              <p className="text-white/70 text-base leading-relaxed mb-8">
                This is not a club night. This is a musical journey built for dancers, not spectators.
              </p>

              <div className="mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                  What to Expect
                </span>
                <div className="flex flex-wrap gap-3">
                  {[
                    "360° Immersive Dancefloor",
                    "Extended B2B DJ Storytelling",
                    "World-Class Sound System",
                    "Afro House, Melodic Grooves & Global Rhythms",
                    "Community-Driven Energy",
                  ].map((item) => (
                    <span
                      key={item}
                      className="px-4 py-2 text-xs font-mono tracking-widest uppercase text-white/80"
                      style={{ border: `1px solid ${violet}25`, background: `${violet}08` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-white/80 italic mt-6">This is house music as ceremony.</p>
              </div>

              {/* Lineup */}
              <div className="mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                  Lineup
                </span>
                <p className="text-white text-lg font-display tracking-wide mb-2">
                  JUANY BRAVO B2B DERON (Headliner)
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/60 text-sm">
                  <span>Hashtom</span>
                  <span className="text-white/20">·</span>
                  <span>Rose</span>
                  <span className="text-white/20">·</span>
                  <span>Jerome</span>
                  <span className="text-white/20">·</span>
                  <span>b2b Kenbo</span>
                  <span className="text-white/20">·</span>
                  <span>Avo</span>
                </div>
                <p className="text-white/40 text-xs mt-2">Additional guests may be announced</p>
              </div>

              <div className="mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                  Artist Visuals
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {lineupVisuals.map((artist) => (
                    <div key={artist.name} className="overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
                      <img src={artist.image} alt={`${artist.name} lineup image`} className="w-full aspect-[4/5] object-cover" />
                      <div className="px-3 py-2 bg-black/35">
                        <p className="text-white font-semibold text-sm">{artist.name}</p>
                        <p className="text-white/60 text-xs">{artist.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tables */}
              <div className="mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                  Tables & Bottle Service
                </span>
                <p className="text-white/70 mb-4">All tables include bottle service and priority treatment throughout the night.</p>
                <div className="space-y-3 text-white/80">
                  <p>Standard Table (up to 5 guests): $300 — Includes 1 standard bottle</p>
                  <p>Gold Table (up to 5 guests): $500 — Includes 1 premium bottle + elevated placement</p>
                  <p>Platinum Table (up to 5 guests): $750 — Includes 1 premium bottle, closest DJ proximity, priority service</p>
                  <p className="text-white/60">Additional Bottles: Standard: $150 | Premium: $200 | Top Shelf: $250</p>
                  <p className="text-white/70">Table Reservations: <a className="underline" href="mailto:events@monolithproject.com">events@monolithproject.com</a></p>
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                  Frequently Asked Questions
                </span>
                <div className="space-y-3">
                  {faqs.map(([q, a]) => (
                    <details key={q} className="border px-4 py-3" style={{ borderColor: `${violet}25` }}>
                      <summary className="cursor-pointer text-white font-medium">{q}</summary>
                      <p className="text-white/70 mt-2 text-sm">{a}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Notice */}
              <div className="mb-10">
                <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                  Photo & Video Notice
                </span>
                <p className="text-white/70 text-sm">
                  This event will be photographed and recorded for The Monolith Project, House of Friends, and partner marketing channels. By entering the venue, you consent to possible use of your likeness in event media.
                </p>
              </div>

              {/* Age + CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <a href={POSH_TICKET_URL} target="_blank" rel="noopener noreferrer">
                  <div
                    className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center gap-3 cursor-pointer text-white rounded-full"
                    style={{ background: `linear-gradient(135deg, ${violet}, ${cyan})` }}
                  >
                    GET TICKETS <ArrowUpRight size={16} />
                  </div>
                </a>
                <span className="font-mono text-xs text-white/50 tracking-widest">Tickets are moving fast — prices increase as tiers sell out.</span>
              </div>
              {/* Contact / Socials */}
              <div className="mt-10 pt-8" style={{ borderTop: `1px solid ${violet}15` }}>
                <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                  Connect
                </span>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <span className="text-white/40 uppercase tracking-wider text-[10px] w-20">Inquiries</span>
                    <a href="mailto:events@monolithproject.com" className="hover:text-white transition-colors border-b border-white/20 hover:border-white">
                      events@monolithproject.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <span className="text-white/40 uppercase tracking-wider text-[10px] w-20">Follow</span>
                    <a href="https://instagram.com/monolithproject.events" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors border-b border-white/20 hover:border-white">
                      @TheMonolithProject.events
                    </a>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2 text-[10px] text-white/30 font-mono tracking-wider uppercase">
                  <span>#UNTOLDSTORY</span>
                  <span>#CHASINGSUNSETS</span>
                  <span>#CHICAGO</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Contrast */}
      <section className="py-32 px-6 border-t" style={{ borderColor: `${violet}15` }}>
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl text-white mb-6">
            TWO SIDES
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-4">
            Chasing Sun(Sets) is the warmth. Untold Story is the weight.
            Together they make up The Monolith Project.
          </p>
          <p className="text-white/40 max-w-xl mx-auto mb-12">
            Same collective. Same community. Different time of night.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chasing-sunsets">
              <div className="px-10 py-4 text-white font-display text-lg tracking-widest uppercase hover:text-white transition-colors cursor-pointer rounded-full" style={{ border: `1px solid ${violet}40` }}>
                CHASING SUN(SETS)
              </div>
            </Link>
            <Link href="/">
              <div className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer text-white rounded-full" style={{ background: `linear-gradient(135deg, ${violet}, ${cyan})` }}>
                BACK TO MONOLITH
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
