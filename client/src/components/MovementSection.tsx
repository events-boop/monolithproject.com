import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Play } from "lucide-react";
import RevealText from "./RevealText";

export default function MovementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section
      id="movement"
      ref={ref}
      className="relative section-padding bg-sand overflow-hidden"
    >
      <div className="absolute inset-0 atmo-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.08),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(224,90,58,0.12),transparent_36%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute right-0 top-0 bottom-0 w-[52%] opacity-[0.06] blur-[1px]"
          style={{
            backgroundImage:
              "linear-gradient(to left, rgba(255,255,255,0.16), rgba(255,255,255,0.08) 22%, transparent 68%), url('/images/autograf-recap.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute left-0 bottom-0 h-[44%] w-[44%] opacity-[0.05] blur-[0.8px]"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0.18), transparent 55%), url('/images/lazare-carbon-center.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - The Definition */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="font-serif text-charcoal space-y-6 select-none">
              <div>
                <RevealText as="h2" className="text-6xl md:text-7xl mb-2 font-serif tracking-tight">Monolith</RevealText>
                <span className="text-stone font-mono text-sm tracking-wide italic opacity-60">/monelīTH/</span>
                <p className="text-stone font-serif italic text-sm mt-1">(from Greek mónos "single" + líthos "stone")</p>
              </div>

              <div className="space-y-4 pl-4 border-l-2 border-clay/20">
                <div>
                  <span className="font-bold text-clay mr-2">1.</span>
                  <span className="text-xl md:text-2xl text-charcoal/80 italic leading-relaxed">
                    A symbol of unity, a gathering point for our community.
                  </span>
                </div>
                <div>
                  <span className="font-bold text-clay mr-2">2.</span>
                  <span className="text-xl md:text-2xl text-charcoal/80 italic leading-relaxed">
                    A single, massive block; a beacon of togetherness.
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <p className="font-display uppercase tracking-widest text-clay text-sm">Target Frequency</p>
                <p className="text-2xl font-serif italic text-charcoal">Togetherness.</p>
              </div>

              {/* Floating Autograf Video on Home Front */}
              <div
                className="mt-12 md:mt-16 mx-auto lg:mx-0 relative w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-charcoal/10 group bg-cover bg-center bg-black/5"
                style={{ backgroundImage: "url('/images/autograf-recap.jpg')" }}
              >
                <div className="absolute inset-0 z-0">
                  {isInView && showVideo ? (
                    <iframe
                      className="absolute inset-0 h-full w-full scale-[1.45]"
                      src="https://www.youtube.com/embed/9R6XH7JZlJI?autoplay=1&mute=1&controls=0&loop=1&playlist=9R6XH7JZlJI&playsinline=1&rel=0&modestbranding=1&start=3714"
                      title="Autograf live at Monolith"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : null}
                </div>
                {!showVideo && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px] transition-colors hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/60"
                    aria-label="Play Autograf clip"
                  >
                    <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/55 px-5 py-3 text-white/95 shadow-lg">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-charcoal">
                        <Play className="h-4 w-4 fill-current" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Play clip</span>
                    </span>
                  </button>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Live at Monolith
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - The Manifesto */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-10 pl-0 lg:pl-12 border-l-0 lg:border-l border-charcoal/10"
          >
            <div className="space-y-8">
              {/* The Intro */}
              <div>
                <span className="font-serif italic text-lg text-clay mb-2 block">
                  Guided by authentic intention — the purest form of energy.
                </span>
                <p className="text-lg text-charcoal/90 leading-relaxed max-w-lg">
                  The Monolith Project is a creative house, an experience engine, and a cultural movement built on one simple truth: <span className="font-medium text-charcoal">Togetherness is the frequency. Music is the guide.</span>
                </p>
                <p className="text-charcoal/80 leading-relaxed mt-4 text-sm max-w-lg">
                  Born in Chicago, designed for the world, we unite sound, storytelling, and human connection across three signature series.
                </p>
              </div>

              {/* The Pillars */}
              <div className="space-y-6">
                {/* Branch 1: Chasing Sunsets */}
                <div className="group">
                  <Link href="/chasing-sunsets" asChild>
                    <a className="text-xl font-display text-charcoal hover:text-warmGold transition-colors mb-1 inline-flex items-center gap-2">
                      CHASING SUN(SETS)
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-warmGold" />
                    </a>
                  </Link>
                  <p className="text-charcoal/70 leading-relaxed text-sm max-w-md">
                    A global ritual of light, sound, and soul, celebrating the magic of golden hour.
                  </p>
                </div>

                {/* Branch 2: Untold Story */}
                <div className="group">
                  <Link href="/story" asChild>
                    <a className="text-xl font-display text-charcoal hover:text-clay transition-colors mb-1 inline-flex items-center gap-2">
                      UNTOLD STORY
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-clay" />
                    </a>
                  </Link>
                  <p className="text-charcoal/70 leading-relaxed text-sm max-w-md">
                    An immersive, narrative-driven nightlife experience. Artists become storytellers and energy givers in a 360° setting.
                  </p>
                </div>

                {/* Branch 3: Radio */}
                <div className="group">
                  <Link href="/radio" asChild>
                    <a className="text-xl font-display text-charcoal hover:text-stone transition-colors mb-1 inline-flex items-center gap-2">
                      MONOLITH RADIO
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-stone" />
                    </a>
                  </Link>
                  <p className="text-charcoal/70 leading-relaxed text-sm max-w-md">
                    A signal of gathering. Moving fast. Stay tuned.
                  </p>
                </div>
              </div>

              {/* The Outro */}
              <div className="pt-6 border-t border-charcoal/10">
                <p className="text-charcoal/80 text-sm italic leading-relaxed max-w-lg mb-6">
                  "We exist to elevate the culture with intention — crafting experiences that turn nights into memories and artists into storytellers. This is the blueprint for something different."
                </p>
                <div className="flex flex-col sm:flex-row gap-6 text-xs font-mono uppercase tracking-widest text-stone">
                  <a href="https://instagram.com/untoldstory.music" className="hover:text-clay transition-colors">@untoldstory.music</a>
                  <a href="https://instagram.com/chasingsunsets.music" className="hover:text-warmGold transition-colors">@chasingsunsets.music</a>
                  <a href="https://instagram.com/monolithproject.events" className="hover:text-primary transition-colors">@monolithproject.events</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
