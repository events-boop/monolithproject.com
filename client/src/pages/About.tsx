import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sun, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import RevealText from "@/components/RevealText";
import SectionDivider from "@/components/SectionDivider";

const values = [
  {
    number: "01",
    title: "Authenticity",
    text: "Rooted in genuine intention, not trends. We don't chase hype — we chase meaning.",
  },
  {
    number: "02",
    title: "Togetherness",
    text: "A collective moment, not isolated consumption. The room moves as one.",
  },
  {
    number: "03",
    title: "Intention",
    text: "Every detail is deliberate. The sound, the light, the timing — nothing is accidental.",
  },
  {
    number: "04",
    title: "Artistry",
    text: "The selector is the narrator, the dancefloor is the audience. Music guides everything.",
  },
];

const stats = [
  { value: "2024", label: "Founded" },
  { value: "Chicago", label: "Home Base" },
  { value: "2", label: "Event Series" },
  { value: "10+", label: "Artists" },
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], ["0%", "15%"]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero — full bleed with parallax */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-end overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full pb-16 pt-48 px-6">
          <div className="container max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-6">
                The Collective
              </span>
              <RevealText
                as="h1"
                className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85] uppercase text-foreground mb-8 tracking-tight-display"
              >
                ABOUT
              </RevealText>
              <p className="text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed">
                A Chicago events collective built on music, community,
                and showing up for each other.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-8 md:gap-16 mt-12 pt-8 border-t border-border"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className="block font-display text-2xl md:text-3xl text-foreground">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <SectionDivider number="01" label="Origin" />

      {/* The Problem — editorial two-column */}
      <section className="py-24 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-4">
                Why We Exist
              </span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[0.9] tracking-tight-display">
                THE
                <br />
                PROBLEM
              </h2>
              <div className="w-12 h-[1px] bg-primary mt-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3 space-y-6"
            >
              <p className="text-foreground text-xl md:text-2xl leading-relaxed font-light">
                Nightlife has become transactional. Disconnected. Focused on
                content creation rather than genuine human connection.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We've traded presence for performance. The phone is up before the
                first drop. The VIP rope says more about who you know than what you
                feel. And somewhere along the way, the dancefloor stopped being a
                shared experience.
              </p>
              <p className="text-foreground/90 text-lg leading-relaxed">
                The Monolith Project exists to restore meaning to the spaces where
                we come together — where sound carries emotion and the night feels
                shared.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cinematic break — pull quote */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden bg-card">
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="max-w-4xl text-center"
          >
            <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-white/90 leading-relaxed italic">
              "We believe music carries emotion. We believe gathering should feel
              shared. We believe in rhythm, story, and togetherness."
            </p>
            <span className="block mt-8 font-mono text-xs text-primary tracking-[0.3em] uppercase">
              — The Monolith Project
            </span>
          </motion.div>
        </div>
      </div>

      <SectionDivider number="02" label="Principles" />

      {/* Values — numbered editorial grid */}
      <section className="py-24 px-6">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-4">
              What Drives Us
            </span>
            <RevealText
              as="h2"
              className="font-display text-5xl md:text-7xl text-foreground tracking-tight-display"
            >
              VALUES
            </RevealText>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="bg-background p-10 md:p-12 group"
              >
                <span className="font-display text-5xl md:text-6xl text-white/[0.04] block mb-4 select-none">
                  {v.number}
                </span>
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-3 uppercase tracking-wide">
                  {v.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider number="03" label="The Events" />

      {/* Two Series — dramatic cards */}
      <section className="py-24 px-6 bg-card">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-4">
              Two Series, One Collective
            </span>
            <RevealText
              as="h2"
              className="font-display text-5xl md:text-7xl text-foreground tracking-tight-display"
            >
              THE EVENTS
            </RevealText>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Chasing Sun(Sets) */}
            <Link href="/chasing-sunsets">
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative border border-border hover:border-[#C2703E]/50 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "linear-gradient(135deg, rgba(194,112,62,0.08), transparent)" }}
                />
                <div className="relative p-10 md:p-12">
                  <Sun className="w-6 h-6 text-[#C2703E] mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-mono text-[10px] text-[#C2703E]/60 tracking-[0.3em] uppercase block mb-2">
                    Series 01
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-[#C2703E] mb-4 tracking-wide">
                    CHASING SUN(SETS)
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Rooftop and outdoor shows timed to sunset. Afro house, organic
                    beats, and the kind of crowd that actually dances. Every set starts
                    in daylight and ends under the stars.
                  </p>
                  <div className="flex items-center gap-2 text-[#C2703E] text-xs font-bold tracking-widest uppercase group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Untold Story */}
            <Link href="/story">
              <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group relative border border-border hover:border-[#8B5CF6]/50 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), transparent)" }}
                />
                <div className="relative p-10 md:p-12">
                  <UntoldButterflyLogo className="w-7 h-7 text-[#8B5CF6] mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="font-mono text-[10px] text-[#8B5CF6]/60 tracking-[0.3em] uppercase block mb-2">
                    Series 02
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl text-[#8B5CF6] mb-4 tracking-wide">
                    UNTOLD STORY
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Late-night, intimate, 360-degree sound. Techno, deep house,
                    experimental. The DJ is the narrator, the crowd is the story. No
                    phones, no VIP rope — just the room and the sound system.
                  </p>
                  <div className="flex items-center gap-2 text-[#8B5CF6] text-xs font-bold tracking-widest uppercase group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider number="04" label="The People" />

      {/* The Team / Who We Are */}
      <section className="py-24 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-4">
                Behind the Sound
              </span>
              <h2 className="font-display text-4xl md:text-6xl text-foreground leading-[0.9] tracking-tight-display">
                WHO
                <br />
                WE ARE
              </h2>
              <div className="w-12 h-[1px] bg-primary mt-6" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3 space-y-6"
            >
              <p className="text-foreground text-xl md:text-2xl leading-relaxed font-light">
                We're a group of music lovers, DJs, and creative minds from Chicago
                who wanted something different.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Not bigger. Not louder. Just more real. The Monolith Project started
                as a conversation between friends about what nightlife could feel like
                if you stripped away everything that doesn't matter.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                No bottle service. No influencer tables. No algorithms deciding the
                vibe. Just a room, a sound system, and people who came because they
                love music.
              </p>

              <div className="pt-8">
                <Link href="/lineup">
                  <div className="group inline-flex items-center gap-3 text-foreground hover:text-primary transition-colors cursor-pointer">
                    <span className="font-bold tracking-widest uppercase text-xs">Meet the Artists</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-border bg-card">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <RevealText
              as="h2"
              className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-4 tracking-tight-display"
            >
              MUSIC IS THE GUIDE.
            </RevealText>
            <p className="text-muted-foreground text-lg mb-12 max-w-lg mx-auto">
              Same collective. Same community. Different time of night.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tickets">
                <div className="px-10 py-4 bg-primary text-primary-foreground font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer rounded-full">
                  GET TICKETS
                </div>
              </Link>
              <Link href="/booking">
                <div className="px-10 py-4 border border-border text-foreground font-display text-lg tracking-widest uppercase hover:border-primary hover:text-primary transition-colors cursor-pointer rounded-full">
                  CONTACT US
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SlimSubscribeStrip title="STAY IN THE LOOP" source="about_strip" />
      <Footer />
    </div>
  );
}
