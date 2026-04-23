import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Disc } from "lucide-react";
import SEO from "@/components/SEO";
import GlitchText from "@/components/GlitchText";
import * as React from "react";

export default function NotFound() {
  const [glitchActive, setGlitchActive] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => setGlitchActive(true), 3000);
    const stopTimer = setInterval(() => setGlitchActive(false), 3150);
    return () => { clearInterval(timer); clearInterval(stopTimer); };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <SEO title="Page Not Found" description="The page you requested does not exist." noIndex canonicalPath="/404" />

      {/* 🔮 THE VOID BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-noise" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.02)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 border border-white/20 flex items-center justify-center mb-12 bg-white/[0.02] backdrop-blur-md relative group"
        >
            <ShieldAlert size={32} className="text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-500" />
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/40 transition-all duration-700 scale-125 opacity-0 group-hover:opacity-100" />
        </motion.div>

        <h1 className="font-heavy text-[clamp(6rem,20vw,14rem)] leading-[0.75] tracking-[-0.04em] uppercase text-white mb-8 relative">
           <GlitchText active={glitchActive}>404</GlitchText>
           <span className="absolute -top-4 -right-8 font-mono text-[10px] text-white/40 tracking-widest uppercase rotate-90 origin-left">
             Page Not Found
           </span>
        </h1>

        <div className="flex flex-col items-center text-center max-w-lg">
            <h2 className="font-heavy text-4xl md:text-5xl uppercase tracking-tighter text-white/90 mb-6 font-display">
               Page Not Found
            </h2>
            <p className="font-sans text-lg text-white/50 mb-12 font-light leading-relaxed">
               The page you were looking for does not exist or may have moved. Head back home or open the event archive.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <Link href="/" asChild>
                    <button className="btn-pill-neutral group">
                        <span className="relative z-10">Back to Monolith</span>
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </Link>

                <Link href="/archive" asChild>
                    <button className="btn-pill-outline">
                        <Disc size={12} className="opacity-40" />
                        See The Archive
                    </button>
                </Link>
            </div>
        </div>
      </div>

      <div className="absolute bottom-12 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
            <span className="font-mono text-[10px] text-white/20 tracking-[0.5em] uppercase">
                404 / Page not found
            </span>
      </div>
    </div>
  );
}
