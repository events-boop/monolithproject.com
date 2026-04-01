import { Link } from "wouter";
import { motion } from "framer-motion";
import { Terminal, ShieldAlert, ArrowLeft, Disc } from "lucide-react";
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
      <SEO title="404 // NULL_ZONE" description="The requested signal does not exist. Environmental frequency lost." noIndex canonicalPath="/404" />

      {/* 🔮 THE VOID BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] bg-noise" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.02)_0%,transparent_70%)]" />

      {/* 📟 SYSTEM TERMINAL (DECORATIVE) */}
      <div className="absolute top-12 left-12 font-mono text-[9px] text-white/10 tracking-[0.3em] uppercase hidden lg:block select-none">
        <div className="flex gap-4 mb-2">
          <span>MODULE: R_004</span>
          <span>STATUS: SIGNAL_LOST</span>
        </div>
        <div className="opacity-40">
          [ ERR_NULL_REFERENCE_LOC_99X ]<br />
          [ INITIALIZING_ENVIRONMENT_PURGE ]<br />
          [ SCANNING_FOR_VITAL_SIGNALS... ]
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 border border-white/20 flex items-center justify-center mb-12 bg-white/[0.02] backdrop-blur-md relative group"
        >
            <ShieldAlert size={32} className="text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-500" />
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/40 transition-all duration-700 scale-125 opacity-0 group-hover:opacity-100" />
        </motion.div>

        <h1 className="font-heavy text-[clamp(6rem,20vw,14rem)] leading-[0.75] tracking-[-0.05em] uppercase text-white mb-8 relative">
           <GlitchText active={glitchActive}>404</GlitchText>
           <span className="absolute -top-4 -right-8 font-mono text-[10px] text-white/40 tracking-widest uppercase rotate-90 origin-left">
             Null / Zone
           </span>
        </h1>

        <div className="flex flex-col items-center text-center max-w-lg">
            <h2 className="font-heavy text-4xl md:text-5xl uppercase tracking-tighter text-white/90 mb-6 font-display">
               Lost In The Frequency
            </h2>
            <p className="font-sans text-lg text-white/50 mb-12 font-light leading-relaxed">
               The node you are requesting has been purged or never existed within this environment. Redirect your signal back to the core.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <Link href="/" asChild>
                    <button className="group relative px-10 py-5 bg-white text-black font-heavy text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:pr-14">
                        <span className="relative z-10">Back to Monolith</span>
                        <ArrowLeft className="w-5 h-5 absolute right-6 top-1/2 -translate-y-1/2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" />
                    </button>
                </Link>

                {/* SECRET CLEARANCE LINK */}
                <Link href="/archive" asChild>
                    <button className="px-10 py-5 border border-white/10 text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-white/5 hover:text-white transition-all focus:outline-none flex items-center gap-3">
                        <Disc size={12} className="opacity-40" />
                        Enter Archive
                    </button>
                </Link>
            </div>
        </div>
      </div>

      <div className="absolute bottom-12 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
            <span className="font-mono text-[8px] text-white/20 tracking-[0.5em] uppercase">
                ERRORCODE_0xDEADBEEF // NULLSIGNALFOUND
            </span>
      </div>
    </div>
  );
}
