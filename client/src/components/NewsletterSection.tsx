import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import MagneticButton from "./MagneticButton";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const InputField = ({
  type,
  placeholder,
  id,
  label
}: {
  type: string;
  placeholder: string;
  id: string;
  label: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <input
        type={type}
        id={id}
        required
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => setIsFocused(e.target.value.length > 0)}
        className="w-full bg-transparent border-b border-white/10 py-4 text-lg text-foreground placeholder-transparent focus:outline-none transition-colors z-10 relative"
        placeholder={placeholder}
      />

      {/* Animated Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] bg-primary w-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-300 pointer-events-none uppercase tracking-widest font-mono text-xs
          ${isFocused
            ? "-top-6 text-primary text-[10px]"
            : "top-4 text-muted-foreground"
          }`}
      >
        {label}
      </label>
    </div>
  );
};

export default function NewsletterSection() {
  const [interest, setInterest] = useState<"ritual" | "music">("ritual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section className="py-32 relative overflow-hidden bg-void">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Glass Card Container */}
          <div className="relative backdrop-blur-2xl bg-white/[0.02] border border-white/10 p-8 md:p-16 overflow-hidden">
            {/* Decorative Corner Marks */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/40" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/40" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/40" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/40" />

            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="text-xs font-mono text-primary uppercase tracking-[0.3em]">Incoming Transmission</span>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50" />
              </motion.div>

              <h2 className="font-display text-5xl md:text-7xl mb-6 tracking-tight text-glow-golden">
                JOIN THE <span className="text-golden-gradient">RITUAL</span>
              </h2>

              <p className="text-muted-foreground max-w-xl mx-auto font-light leading-relaxed text-lg">
                Be the first to receive coordinates for upcoming gatherings, exclusive releases, and artifacts from the void.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12 flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1.2 }}
                    className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20"
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="font-display text-3xl text-foreground mb-4 uppercase tracking-widest">Welcome to the Fold</h3>
                  <p className="text-muted-foreground text-lg">Your frequency has been harmonized.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  onSubmit={handleSubmit}
                  className="space-y-16 max-w-3xl mx-auto"
                >
                  {/* Custom Toggle Switch */}
                  <div className="flex justify-center">
                    <div className="bg-white/5 p-1 rounded-full border border-white/10 flex relative">
                      {/* Sliding Highlight */}
                      <motion.div
                        className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] top-1 bg-primary/10 border border-primary/20 rounded-full"
                        animate={{
                          left: interest === "ritual" ? "4px" : "calc(50%)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />

                      <button
                        type="button"
                        onClick={() => setInterest("ritual")}
                        className={`relative z-10 px-8 py-3 rounded-full text-xs font-mono uppercase tracking-widest transition-colors duration-300 w-40 ${interest === "ritual" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Ritual Updates
                      </button>
                      <button
                        type="button"
                        onClick={() => setInterest("music")}
                        className={`relative z-10 px-8 py-3 rounded-full text-xs font-mono uppercase tracking-widest transition-colors duration-300 w-40 ${interest === "music" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Radio & Music
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                    <div className="md:col-span-2">
                      <InputField type="email" placeholder="enter your email address" label="Email Address" id="email" />
                    </div>
                    <div>
                      <InputField type="text" placeholder="first name" label="First Name" id="firstName" />
                    </div>
                    <div>
                      <InputField type="text" placeholder="last name" label="Last Name" id="lastName" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-10">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative">
                        <input type="checkbox" required className="peer sr-only" />
                        <div className="w-5 h-5 border border-white/30 transition-all duration-300 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100" />
                        </div>
                        <div className="absolute inset-0 border border-primary opacity-0 peer-checked:animate-ping" />
                      </div>
                      <span className="text-xs text-muted-foreground/60 font-mono tracking-wide group-hover:text-muted-foreground transition-colors">
                        I ACCEPT THE TERMS OF THE TRANSMISSION
                      </span>
                    </label>

                    <MagneticButton strength={0.3}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative px-16 py-5 bg-foreground text-background hover:bg-primary transition-all duration-500 font-display text-xl tracking-widest uppercase disabled:opacity-50 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSubmitting ? "Processing..." : "Initiate"}
                          {!isSubmitting && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      </button>
                    </MagneticButton>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
