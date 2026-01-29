/*
  DESIGN: Cosmic Mysticism - Radio section
  - Chasing Sun(Sets) Radio Show
  - Abstract sound wave visualization
  - Platform links
*/

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Headphones, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import AudioPlayer from "./AudioPlayer";

const platforms = [
  { name: "SoundCloud", url: "#" },
  { name: "Mixcloud", url: "#" },
  { name: "Spotify", url: "#" },
];

export default function RadioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handlePlatformClick = (platform: string) => {
    toast("Coming Soon", {
      description: `${platform} link will be available soon.`,
    });
  };

  return (
    <section
      id="radio"
      ref={ref}
      className="relative section-padding bg-background overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/radio-show.jpg"
          alt="Sound waves"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Animated sound wave visualization */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-primary/30 rounded-full"
              />

              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-primary/20 rounded-full"
              />

              {/* Inner ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 border border-primary/40 rounded-full"
              />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 rounded-full bg-primary/10 border border-primary flex items-center justify-center"
                >
                  <Headphones className="w-10 h-10 text-primary" />
                </motion.div>
              </div>

              {/* Pulse effect */}
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 border border-primary rounded-full"
              />
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              03 — The Frequency
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-4">
              CHASING SUN(SETS)
              <br />
              <span className="text-primary">RADIO</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              The frequency continues.
            </p>
            <p className="text-base text-foreground/80 leading-relaxed mb-8">
              Beyond the gatherings, the sound lives on. Chasing Sun(Sets) Radio is our
              sonic extension — curated mixes and live sessions from our resident artists
              and global guests. Tune in to carry the golden hour with you, wherever you are.
            </p>

            {/* Platform Links */}
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Available On
              </p>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handlePlatformClick(platform.name)}
                    className="group flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-foreground hover:text-primary transition-all duration-300"
                  >
                    <span className="text-sm tracking-widest uppercase">
                      {platform.name}
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Listen Now CTA */}
            <motion.button
              onClick={() => toast("Coming Soon", { description: "Radio show launching soon!" })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 px-8 py-4 bg-primary text-primary-foreground font-display text-lg tracking-widest uppercase hover:glow-golden transition-all duration-300"
            >
              Listen Now
            </motion.button>

            <div className="mt-12 bg-black/20 p-4 rounded-xl border border-white/5 no-doc-scroll relative z-20">
              <AudioPlayer />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
