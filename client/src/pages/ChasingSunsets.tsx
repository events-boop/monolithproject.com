import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "wouter";


const events = [
  {
    month: "AUG",
    day: "2026",
    title: "THE FIRST MONOLITH",
    location: "Chicago, IL",
    time: "4:00 PM - Late",
    status: "coming-soon" as const,
  },
];

// Chasing Sunsets palette — Auburn + Warm Gold
const auburn = "#C2703E";
const warmGold = "#E8B86D";
const cream = "#FBF5ED";
const deepWarm = "#2C1810";

export default function ChasingSunsets() {
  return (
    <div className="min-h-screen selection:text-white relative overflow-hidden" style={{ background: cream, color: deepWarm }}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(232,184,109,0.25),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(194,112,62,0.2),transparent_32%),radial-gradient(circle_at_75%_84%,rgba(139,92,246,0.14),transparent_36%)]" />
      <Navigation variant="light" />

      {/* Hero — raw, warm, big type */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Sunset gradient wash */}
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{ background: `linear-gradient(180deg, ${warmGold}40, ${cream} 60%)` }}
        />
        {/* Warm glow orb */}
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none"
          style={{ background: `radial-gradient(circle, ${auburn}, transparent)` }}
        />

        <div className="relative z-10 container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-6" style={{ color: auburn }}>
              Series 01
            </span>
            <h1 className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] uppercase mb-8 tracking-tight-display" style={{ color: deepWarm }}>
              CHASING
              <br />
              SUN(SETS)
            </h1>
            <p className="max-w-lg text-lg leading-relaxed" style={{ color: `${deepWarm}90` }}>
              Golden hour. Good people. Great music. Rooftop shows and outdoor
              gatherings where the sun does half the work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Concept */}
      <section className="py-24 px-6" style={{ borderTop: `1px solid ${auburn}15` }}>
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: auburn }}>
                The Format
              </span>
              <h2 className="font-display text-5xl md:text-6xl mb-6" style={{ color: deepWarm }}>
                SUNSET TO
                <br />
                SUNDOWN
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6 rounded-2xl border p-6 md:p-8 backdrop-blur-sm"
              style={{ borderColor: `${auburn}22`, background: "linear-gradient(145deg,rgba(255,255,255,0.62),rgba(255,255,255,0.36))" }}
            >
              <p className="text-lg leading-relaxed" style={{ color: `${deepWarm}80` }}>
                Every Chasing Sun(Sets) show starts during golden hour. The music
                builds as the light changes. By the time the sun is gone, the
                energy is already there.
              </p>
              <p className="leading-relaxed" style={{ color: `${deepWarm}70` }}>
                Melodic house, afro house, organic downtempo — sounds that match
                the warmth. Rooftops, gardens, open-air spaces. No dark rooms,
                no strobes. Just the sky and the sound.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 pt-4">
                {["Rooftop", "Golden Hour", "Melodic House", "Afro House", "Open Air"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-xs font-mono tracking-widest uppercase"
                    style={{ border: `1px solid ${auburn}30`, color: auburn }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 px-6" style={{ background: `${warmGold}12`, borderTop: `1px solid ${auburn}15` }}>
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-16 pb-6" style={{ borderBottom: `1px solid ${auburn}15` }}>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: deepWarm }}>UPCOMING</h2>
            <span className="font-mono text-xs tracking-widest" style={{ color: auburn }}>SEASON 2026</span>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.title}
                className="group p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all rounded-2xl backdrop-blur-sm"
                style={{ border: `1px solid ${auburn}20`, background: "linear-gradient(145deg,rgba(255,255,255,0.75),rgba(255,255,255,0.45))" }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center justify-center w-16 h-16" style={{ border: `1px solid ${auburn}30`, background: `${auburn}08` }}>
                    <span className="text-xs font-bold uppercase" style={{ color: auburn }}>{event.month}</span>
                    <span className="text-lg font-display" style={{ color: deepWarm }}>{event.day}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display tracking-wide mb-1 group-hover:transition-colors" style={{ color: deepWarm }}>
                      {event.title}
                    </h3>
                    <div className="flex gap-4 text-sm font-mono uppercase" style={{ color: `${deepWarm}60` }}>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {event.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href="/tickets">
                  <div
                    className="px-8 py-3 font-bold tracking-widest text-xs uppercase hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer text-white rounded-full"
                    style={{ background: `linear-gradient(135deg, ${auburn}, ${warmGold})` }}
                  >
                    GET TICKETS <ArrowUpRight size={14} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative" style={{ borderTop: `1px solid ${auburn}15` }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(194,112,62,0.18),transparent_32%),radial-gradient(circle_at_82%_76%,rgba(232,184,109,0.22),transparent_34%)]" />
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-7xl mb-6" style={{ color: deepWarm }}>
            CHASE THE LIGHT
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-12" style={{ color: `${deepWarm}70` }}>
            Sign up for the newsletter to get ticket access before anyone else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/story">
              <div className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-80 transition-opacity cursor-pointer rounded-full" style={{ border: `1px solid ${deepWarm}30`, color: deepWarm }}>
                UNTOLD STORY
              </div>
            </Link>
            <Link href="/">
              <div
                className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer text-white rounded-full"
                style={{ background: `linear-gradient(135deg, ${auburn}, ${warmGold})` }}
              >
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
