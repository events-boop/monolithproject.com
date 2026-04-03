import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useUI } from "@/contexts/UIContext";
import { signalChirp } from "@/lib/SignalChirpEngine";

const SIGNALS: Record<string, string[]> = {
  DEFAULT: [
    "SEC_04 REGISTERED: 8 GUESTS IN QUEUE",
    "SYSTEM_IDLE: OPTIMIZING TEXTURE STREAMS",
    "NETWORK_SYNC: BORDERLESS ATMOSPHERE ENGAGED",
    "SIGNAL_STRENGTH: 98% / ENCRYPTION: ACTIVE",
  ],
  SERIES: [
    "LOG: SCANNING ARCHITECTURAL PATHWAYS",
    "SIGNAL: THREEexpressions DETECTED",
    "BUFFER: 0ms // SYNC: COMPLETE",
  ],
  ROSTER: [
    "BPM_TRACKING: 124 // TEMPO: STABLE",
    "LINEUP_STATUS: 100% ALLOCATED",
    "DECODER: ARTIST_SIGNATURE_FETCHED",
  ],
  COMMUNITY: [
    "QUEUING: 14 NODES ACTIVE",
    "SIGNAL: INNER_CIRCLE_REACHABLE",
    "COMM: ENCRYPTED_CHANNEL_OPEN",
  ],
};

export default function SystemHUD() {
  const [location] = useLocation();
  const { hoveredExpression } = useUI();
  const [uptime, setUptime] = useState(0);
  const [requestId, setRequestId] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<{ number: string; label: string } | null>(null);
  const [currentSignal, setCurrentSignal] = useState(SIGNALS.DEFAULT[0]);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 89, hours: 23, minutes: 59, seconds: 59 });
  const signalIndexRef = useRef(0);

  // Global Drop Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Contextual Branding
  const activeExp = hoveredExpression || (
    location === "/chasing-sunsets" ? "sunsets" :
    location === "/story" || location === "/untold-story-deron-juany-bravo" ? "untold" :
    location === "/radio" ? "radio" : null
  );
  
  let accentColor = "rgba(224,90,58,0.2)";
  let textColor = "text-primary";

  if (activeExp === "sunsets") { accentColor = "rgba(232,184,109,0.35)"; textColor = "text-[#E8B86D]"; }
  if (activeExp === "untold") { accentColor = "rgba(34,211,238,0.35)"; textColor = "text-[#22D3EE]"; }
  if (activeExp === "radio") { accentColor = "rgba(255,255,255,0.25)"; textColor = "text-white"; }

  // REQID & Uptime (Immutable per session)
  useEffect(() => {
    signalChirp.boot();
    setRequestId(Math.random().toString(36).substring(7).toUpperCase());
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Signal Rotator (Independent of Chapter for stability)
  useEffect(() => {
    const signalInterval = setInterval(() => {
      const sectionKey = (currentChapter?.label?.toUpperCase() || "DEFAULT") as keyof typeof SIGNALS;
      const pool = SIGNALS[sectionKey] || SIGNALS.DEFAULT;
      signalIndexRef.current = (signalIndexRef.current + 1) % pool.length;
      setCurrentSignal(pool[signalIndexRef.current]);
    }, 4500);
    return () => clearInterval(signalInterval);
  }, [currentChapter]);

  // Section Observer (Pure detection—only triggers if label actually changes)
  useEffect(() => {
    const sections = [
      { id: "series", number: "01", label: "SERIES" },
      { id: "season", number: "02", label: "SEASON" },
      { id: "collective", number: "03", label: "COLLECTIVE" },
      { id: "roster", number: "04", label: "ROSTER" },
      { id: "journal", number: "05", label: "JOURNAL" },
      { id: "archive", number: "06", label: "ARCHIVE" },
      { id: "mixes", number: "07", label: "MIXES" },
      { id: "community", number: "08", label: "COMMUNITY" },
    ];

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        
        if (visible.length > 0) {
          const matched = sections.find(s => s.id === visible[0].target.id);
          if (matched) {
            // Only update state if the chapter actually changed to prevent infinite loops
            setCurrentChapter(prev => {
              if (prev?.label === matched.label) return prev;
              signalChirp.hover();
              return { number: matched.number, label: matched.label };
            });
          }
        } else if (window.scrollY < 400) {
          setCurrentChapter(null);
        }
      },
      { threshold: [0.1, 0.5], rootMargin: "-10% 0px -70% 0px" }
    );

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // No dependencies—observer is setup once.

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[9999] pointer-events-none select-none overflow-hidden">
      {/* HUD Frame Components — hidden on small screens to prevent content coverage */}
      <div className="absolute top-6 right-8 hidden xl:flex flex-col items-end gap-1.5 mix-blend-difference pointer-events-auto">
        <div
          onClick={() => {
            setDiagnosticsOpen(!diagnosticsOpen);
            diagnosticsOpen ? signalChirp.error() : signalChirp.click();
          }}
          className="group flex flex-col items-end gap-1.5 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase whitespace-nowrap">
              System Uptime: {Math.floor(uptime/60).toString().padStart(2, "0")}:{ (uptime%60).toString().padStart(2, "0") }
            </span>
            <div className="w-1.5 h-1.5 bg-green-500 rounded-none animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-heavy text-xs ${textColor} tracking-widest tabular-nums group-hover:text-white transition-colors`}>
              REQID: {requestId}
            </span>
            <div className={`w-2 h-2 ${diagnosticsOpen ? "bg-primary animate-ping" : "bg-white/40"} rounded-none`} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {diagnosticsOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scaleY: 0 }}
            animate={{ opacity: 1, x: 0, scaleY: 1 }}
            exit={{ opacity: 0, x: 10, scaleY: 0 }}
            className="absolute top-24 right-8 w-64 bg-black/95 border border-white/10 p-4 font-mono z-50 origin-top shadow-2xl pointer-events-auto"
          >
            <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-4 border-b border-white/10 pb-2">Diagnostic_Log</span>
            <div className="flex flex-col gap-2 max-h-[300px] overflow-hidden text-[9px] text-white/70">
              <p className="text-primary group-hover:text-white">[SYSTEM] BOOT_SEQUENCE: 0x4F12A</p>
              <p>[NET] LATENCY_CHECK: 12ms</p>
              <p>[OS] KERNEL_LOAD: STABLE</p>
              <p>[CONTEXT] REGION: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              <p>[SESSION] ARCH_LVL: GOD_TIER</p>
              <p className="opacity-40">[LOG] SECTION_SPY: ATTACHED</p>
              <p className="opacity-40">[LOG] PARALLAX_ENGINE: RUNNING</p>
              <p className="text-white/30 mt-4 animate-pulse">STREAMING_SIGNALS...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-8 hidden lg:flex flex-col items-start gap-1.5 mix-blend-difference">
        <div className="flex items-center gap-4 mb-2 pointer-events-auto">
           <div className="grid grid-cols-4 gap-1">
             {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white/20" />
             ))}
           </div>
           <div className="flex flex-col">
             <span className="font-mono text-[10px] text-primary tracking-[0.4em] uppercase">SYSTEM_NODES:</span>
             <span className="font-heavy text-xs text-white tabular-nums">ACTIVE_12 // RES: 100%</span>
           </div>
        </div>
        <div className="flex items-center gap-4 mb-2">
           <span className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase whitespace-nowrap">NEXT_DROP:</span>
           <span className={`font-heavy text-xs ${textColor} tabular-nums`}>
             {timeLeft.days}D:{timeLeft.hours}H:{timeLeft.minutes}M:{timeLeft.seconds}S
           </span>
        </div>
        <span className="font-mono text-[9px] text-white/40 tracking-[0.2em] uppercase">
          Client Session — 0x{requestId}
        </span>
      </div>

      <div className="absolute bottom-6 right-8 hidden lg:flex flex-col items-end gap-1.5 mix-blend-difference min-w-[200px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSignal}
            initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -5, filter: "blur(2px)" }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <span className="font-mono text-[8px] text-white/50 tracking-[0.2em] uppercase">{currentSignal}</span>
            <div className="w-1 h-1 bg-white/40 animate-pulse rounded-none" />
          </motion.div>
        </AnimatePresence>
        
        <AnimatePresence>
          {currentChapter && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="flex items-center gap-3"
             >
               <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">LATENCY: 12ms / BUFFER: 0%</span>
               <span className="font-heavy text-xs text-white/90 tabular-nums">SEC_{currentChapter.number} // {currentChapter.label}</span>
               <div className="w-2 h-2 bg-white/40 animate-ping rounded-none" />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden mix-blend-overlay opacity-30 hidden md:block">
        <div className="absolute inset-0 w-full h-[100%] bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-scanline" />
        <div 
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(circle at center, transparent 0%, ${accentColor} 100%)`, boxShadow: 'inset 0 0 150px rgba(0,0,0,0.5)' }} 
        />
      </div>

      <style>{`
        @keyframes scanline { 0% { transform: translateY(0); } 100% { transform: translateY(4px); } }
        .animate-scanline { animation: scanline 0.15s linear infinite; }
      `}</style>
      
      <div className="absolute inset-0 border border-white/5 pointer-events-none" />
    </div>
  );
}
