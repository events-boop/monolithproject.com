import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import SectionDivider from "@/components/SectionDivider";

// Custom hook for animated numbers
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function (easeOutExpo)
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(end * ease));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, inView]);

  return { count, ref: nodeRef };
};

const AnimatedStat = ({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) => {
  const { count, ref } = useCounter(value);

  return (
    <div ref={ref} className="text-center">
      <span className="block font-display text-5xl md:text-6xl text-[#d4a853] mb-2 tabular-nums">
        {count}{suffix}
      </span>
      <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>
  );
};

const teamMembers = [
  {
    gradient: "from-[#d4a853]/10 to-transparent",
    quote: '"Togetherness is the moment the room locks in and nobody wants to leave."',
    name: "Sabry",
    role: "Founder & Resident DJ"
  },
  {
    gradient: "from-[#8B5CF6]/10 to-transparent",
    quote: '"Togetherness is building something with people who actually give a damn."',
    name: "Deron",
    role: "Resident DJ & Curator"
  },
  {
    gradient: "from-white/5 to-transparent",
    quote: '"Togetherness is when the music stops, but the feeling stays."',
    name: "Juany Bravo",
    role: "Resident Artist"
  }
];

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-[#d4a853]/30">
      <Navigation />

      {/* SECTION 1: Hero */}
      <section ref={heroRef} className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="font-mono text-xs text-[#d4a853] tracking-[0.3em] uppercase block mb-4">
              ABOUT THE MONOLITH PROJECT
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-['Pinyon_Script',cursive] text-[clamp(5rem,15vw,12rem)] leading-[0.8] text-white/90 mb-12 transform -rotate-2 origin-center">
              Togetherness
            </h1>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="w-24 h-[1px] bg-[#d4a853]/50 mx-auto"
          />
        </motion.div>
      </section>

      {/* SECTION 2: The Intro */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-[700px] mx-auto text-lg md:text-xl leading-relaxed text-white/70 space-y-6 font-light">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The Monolith Project was built around one idea: <strong className="text-white font-medium">togetherness</strong>.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Our events are designed to put you in a room with people who came for the same reason you did — not to be seen, but to be present. To share a moment that only exists because everyone showed up.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            All our events have one thing in common. <strong className="text-white font-medium">Music</strong>.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Come find us at The Monolith Project and experience togetherness in a city that knows how to <strong className="text-white font-medium">show up for each other</strong>.
          </motion.p>
        </div>
      </section>

      {/* SECTION 3: Etymology */}
      <section className="py-24 px-6 md:px-12 bg-white/[0.02] border-y border-white/[0.03]">
        <div className="max-w-[600px] mx-auto relative pl-8 md:pl-12 border-l-2 border-[#d4a853]/30">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="font-serif text-2xl md:text-3xl text-white">
              Togetherness <span className="italic text-[#d4a853]/70 text-xl md:text-2xl">/təˈɡeðərnəs/</span> — the state of being close to another person or other people.
            </p>

            <p className="text-white/60 font-mono text-sm leading-relaxed">
              From Old English <span className="italic text-white/80">togædere</span> — "so as to be present in one place, in a group, in an accumulated mass."
              <br />
              <span className="italic text-white/80">tō</span> (to) + <span className="italic text-white/80">gædere</span> (together, united)
            </p>

            <p className="text-white/70 leading-relaxed">
              In modern usage, togetherness describes the warm feeling of being united with the people around you — <strong className="text-white font-medium">not by obligation, but by choice</strong>. It is the opposite of isolation. It is the act of choosing to be in the same room, at the same time, for the same reason.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: The Frequency */}
      <section className="py-32 px-6 md:px-12 bg-[#050505] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4a853]/5 rounded-full blur-[100px] opacity-50 pointer-events-none" />

        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed">
              A frequency is something you tune into. It's invisible. It travels through walls, through bodies, through air. You can't hold it, but you feel it.
            </p>
            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed">
              Togetherness works the same way. It's not something you see — it's something that happens when a room full of strangers decides to stop being strangers. When the bass drops and everyone moves at the same time. When the sun sets and nobody reaches for their phone.
            </p>
            <div className="pt-8">
              <p className="font-display text-4xl md:text-6xl text-[#d4a853] leading-tight tracking-tight">
                That's the frequency.<br />
                <span className="text-white">Music is how we find it.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5: Origin Story */}
      <section className="py-24 px-6 md:px-12">
        <SectionDivider number="01" label="Origin" />
        <div className="max-w-[700px] mx-auto mt-16 space-y-6 text-lg md:text-xl leading-relaxed text-white/70 font-light">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p>
              <span className="float-left text-5xl md:text-6xl text-[#d4a853] font-display pr-3 leading-[0.8]">T</span>
              he Monolith Project started in Chicago with a simple question: <strong className="text-white font-medium">What if nightlife actually meant something?</strong>
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Not bottle service. Not VIP ropes. Not a lineup you attend and forget. We wanted to build something where showing up mattered — where the person next to you wasn't a stranger, they were part of the same thing you were.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We called it <strong className="text-white font-medium">togetherness</strong> because that's what was missing. Not more events. Not more DJs. More reasons to be in the same room.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white py-4 border-l-2 border-[#d4a853]/50 pl-6 my-8 italic font-serif text-xl md:text-2xl"
          >
            "Each event is called a chapter. Chasing Sun(Sets) chases golden hour on Chicago rooftops. Untold Story goes deeper — dark rooms, heavy bass, stories told through sound. Two series, one frequency."
          </motion.p>
        </div>
      </section>

      {/* SECTION 6: Mission Statement */}
      <section className="py-32 px-6 md:px-12 bg-white/[0.02] border-y border-white/[0.03]">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-[clamp(2rem,5vw,5rem)] leading-[1.1] text-white/90"
          >
            We offer <span className="text-[#d4a853]">togetherness</span> through shared experiences crafted around music.
          </motion.h2>
        </div>
      </section>

      {/* SECTION 7: The Numbers */}
      <section className="py-24 px-6 md:px-12 border-b border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            <AnimatedStat value={8} label="CHAPTERS" suffix="+" />
            <AnimatedStat value={13} label="ARTISTS" />
            <AnimatedStat value={1000} label="COMMUNITY" suffix="+" />
            <AnimatedStat value={6} label="CITIES" />
          </div>
        </div>
      </section>

      {/* SECTION 8: The Team */}
      <section className="py-32 px-6 md:px-12">
        <SectionDivider number="02" label="The Team" />
        <div className="max-w-6xl mx-auto mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10">
                  <p className="font-serif italic text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                    {member.quote}
                  </p>
                  <div>
                    <span className="block font-display text-xl text-[#d4a853] mb-1">{member.name}</span>
                    <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">{member.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: Close */}
      <section className="py-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.9] tracking-tight text-white mb-2">
            TOGETHERNESS IS THE FREQUENCY.
          </h2>
          <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.9] tracking-tight text-[#d4a853]">
            MUSIC IS THE GUIDE.
          </h2>
        </motion.div>
      </section>

      <SlimSubscribeStrip title="JOIN THE FREQUENCY" source="about_page" />
      <Footer />
    </div>
  );
}
