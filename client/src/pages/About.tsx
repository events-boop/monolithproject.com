import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import SEO from "@/components/SEO";

// ─── Animated counter ─────────────────────────────────────────────────────────

const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime: number;
    let frame: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const pct = Math.min((ts - startTime) / duration, 1);
      const ease = pct === 1 ? 1 : 1 - Math.pow(2, -10 * pct);
      setCount(Math.floor(end * ease));
      if (pct < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, inView]);

  return { count, ref: nodeRef };
};

const AnimatedStat = ({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) => {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <span className="block font-display text-5xl md:text-6xl text-primary mb-2 tabular-nums">
        {count}{suffix}
      </span>
      <span className="font-mono text-[10px] text-white/40 tracking-[0.25em] uppercase">{label}</span>
    </div>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const teamMembers = [
  {
    accentColor: "#E8B86D",
    quote: '"Togetherness is the moment the room locks in and nobody wants to leave."',
    name: "Sabry",
    role: "Founder & Resident DJ",
  },
  {
    accentColor: "#8B5CF6",
    quote: '"Togetherness is building something with people who actually give a damn."',
    name: "Deron",
    role: "Resident DJ & Curator",
  },
  {
    accentColor: "#E05A3A",
    quote: '"Togetherness is when the music stops, but the feeling stays."',
    name: "Juany Bravo",
    role: "Resident Artist",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen text-white overflow-x-hidden selection:bg-primary/30" style={{ background: "#050505" }}>
      <SEO
        title="About"
        description="The Monolith Project is a Chicago events collective built around togetherness: showing up, staying present, and letting the music guide."
      />
      <Navigation />

      {/* Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(232,184,109,0.06),transparent_50%),radial-gradient(ellipse_at_80%_90%,rgba(139,92,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      {/* ── SECTION 1: Hero ── */}
      <section ref={heroRef} className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="font-mono text-[10px] text-primary/70 tracking-[0.35em] uppercase block mb-6">
              — About The Monolith Project
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-['Pinyon_Script',cursive] text-[clamp(5rem,15vw,12rem)] leading-[0.85] text-white/90 mb-12 transform -rotate-2 origin-center">
              Togetherness
            </h1>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="w-24 h-[1px] bg-primary/40 mx-auto"
          />
        </motion.div>
      </section>

      {/* ── SECTION 2: Intro ── */}
      <section className="relative z-10 py-24 px-6 md:px-12">
        <div className="max-w-[700px] mx-auto text-lg md:text-xl leading-relaxed text-white/65 space-y-6 font-light">
          {[
            <>The Monolith Project was built around one idea: <strong className="text-white font-medium">togetherness</strong>.</>,
            <>Our events are designed to put you in a room with people who came for the same reason you did — not to be seen, but to be present. To share a moment that only exists because everyone showed up.</>,
            <>All our events have one thing in common. <strong className="text-white font-medium">Music</strong>.</>,
            <>Come find us at The Monolith Project and experience togetherness in a city that knows how to <strong className="text-white font-medium">show up for each other</strong>.</>,
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: Etymology ── */}
      <section className="relative z-10 py-24 px-6 md:px-12" style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-[600px] mx-auto relative pl-8 md:pl-12" style={{ borderLeft: "2px solid rgba(232,184,109,0.3)" }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="font-serif text-2xl md:text-3xl text-white">
              Togetherness <span className="italic text-primary/60 text-xl md:text-2xl">/təˈɡeðərnəs/</span> — the state of being close to another person or other people.
            </p>
            <p className="text-white/55 font-mono text-sm leading-relaxed">
              From Old English <span className="italic text-white/75">togædere</span> — "so as to be present in one place, in a group, in an accumulated mass."
              <br />
              <span className="italic text-white/75">tō</span> (to) + <span className="italic text-white/75">gædere</span> (together, united)
            </p>
            <p className="text-white/65 leading-relaxed">
              In modern usage, togetherness describes the warm feeling of being united with the people around you — <strong className="text-white font-medium">not by obligation, but by choice</strong>. It is the opposite of isolation. It is the act of choosing to be in the same room, at the same time, for the same reason.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: The Frequency ── */}
      <section className="relative z-10 py-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(232,184,109,0.04)" }} />
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed">
              A frequency is something you tune into. It's invisible. It travels through walls, through bodies, through air. You can't hold it, but you feel it.
            </p>
            <p className="text-xl md:text-2xl font-light text-white/70 leading-relaxed">
              Togetherness works the same way. It's not something you see — it's something that happens when a room full of strangers decides to stop being strangers. When the bass drops and everyone moves at the same time. When the sun sets and nobody reaches for their phone.
            </p>
            <div className="pt-8">
              <p className="font-display text-4xl md:text-6xl text-primary leading-tight tracking-tight">
                That's the frequency.<br />
                <span className="text-white">Music is how we find it.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5: Origin Story ── */}
      <section className="relative z-10 py-24 px-6 md:px-12">
        <SectionDivider number="01" label="Origin" />
        <div className="max-w-[700px] mx-auto mt-16 space-y-6 text-lg md:text-xl leading-relaxed text-white/65 font-light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p>
              <span className="float-left text-5xl md:text-6xl text-primary font-display pr-3 leading-[0.8]">T</span>
              he Monolith Project started in Chicago with a simple question: <strong className="text-white font-medium">What if nightlife actually meant something?</strong>
            </p>
          </motion.div>

          {[
            "Not bottle service. Not VIP ropes. Not a lineup you attend and forget. We wanted to build something where showing up mattered — where the person next to you wasn't a stranger, they were part of the same thing you were.",
            <>We called it <strong className="text-white font-medium">togetherness</strong> because that's what was missing. Not more events. Not more DJs. More reasons to be in the same room.</>,
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: (i + 1) * 0.1 }}
            >
              {text}
            </motion.p>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white py-5 italic font-serif text-xl md:text-2xl pl-6 my-8"
            style={{ borderLeft: "2px solid rgba(224,90,58,0.4)" }}
          >
            "Each event is called a chapter. Chasing Sun(Sets) chases golden hour on Chicago rooftops. Untold Story goes deeper — dark rooms, heavy bass, stories told through sound. Two event series, one frequency."
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 6: Mission ── */}
      <section className="relative z-10 py-32 px-6 md:px-12" style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-[clamp(2rem,5vw,5rem)] leading-[1.1] text-white/90"
          >
            We offer <span className="text-primary">togetherness</span> through shared experiences crafted around music.
          </motion.h2>
        </div>
      </section>

      {/* ── SECTION 7: Numbers ── */}
      <section className="relative z-10 py-24 px-6 md:px-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            <AnimatedStat value={8} label="Chapters" suffix="+" />
            <AnimatedStat value={13} label="Artists" />
            <AnimatedStat value={1000} label="Community" suffix="+" />
            <AnimatedStat value={2} label="Series" />
          </div>
        </div>
      </section>

      {/* ── SECTION 8: Team ── */}
      <section className="relative z-10 py-32 px-6 md:px-12">
        <SectionDivider number="02" label="The Team" />
        <div className="max-w-6xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-4">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="group relative p-8 overflow-hidden transition-all duration-500"
                style={{
                  background: `${member.accentColor}08`,
                  border: `1px solid ${member.accentColor}18`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] opacity-60"
                  style={{ background: `linear-gradient(to right, ${member.accentColor}60, transparent)` }} />

                <div className="relative z-10">
                  <p className="font-serif italic text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                    {member.quote}
                  </p>
                  <div>
                    <span className="block font-display text-xl mb-1" style={{ color: member.accentColor }}>{member.name}</span>
                    <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase">{member.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: Series ── */}
      <section className="relative z-10 py-20 px-6 md:px-12" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-8">Our Series</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { href: "/chasing-sunsets", label: "Chasing Sun(Sets)", tag: "Rooftop · Golden Hour · Afro House", color: "#E8B86D", desc: "Sunset sessions on Chicago rooftops. Golden hour vibes, organic grooves, and the feeling that summer never has to end." },
              { href: "/story", label: "Untold Story", tag: "Late Night · 360° Immersive · Melodic House", color: "#8B5CF6", desc: "A late-night journey through Afro and melodic house. Dark rooms, heavy bass, and stories told through sound." },
            ].map((series) => (
              <Link key={series.href} href={series.href} asChild>
                <a
                  className="group p-8 relative overflow-hidden transition-all duration-300"
                  style={{ background: `${series.color}08`, border: `1px solid ${series.color}20` }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(to right, ${series.color}60, transparent)` }} />
                  <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: series.color }}>{series.tag}</p>
                  <h3 className="font-display text-2xl uppercase text-white mb-3 group-hover:text-white transition-colors">{series.label}</h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-5">{series.desc}</p>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase transition-colors" style={{ color: `${series.color}80` }}>
                    Explore <ArrowUpRight className="w-3 h-3" />
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 10: Close ── */}
      <section className="relative z-10 py-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.9] tracking-tight text-white mb-2">
            TOGETHERNESS IS THE FREQUENCY.
          </h2>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.9] tracking-tight text-primary">
            MUSIC IS THE GUIDE.
          </h2>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
