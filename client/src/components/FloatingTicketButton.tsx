import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { getSceneForPath } from "@/lib/scenes";
import { getExperienceEvent, getPrimaryTicketUrl } from "@/lib/siteExperience";
import { CTA_LABELS } from "@/lib/cta";
import { signalChirp } from "@/lib/SignalChirpEngine";
import KineticDecryption from "@/components/KineticDecryption";

export default function FloatingTicketButton() {
  const [location] = useLocation();
  const scene = getSceneForPath(location);
  const nextEvent = getExperienceEvent("ticket");
  const ticketUrl = getPrimaryTicketUrl(nextEvent);
  const reduceMotion = useReducedMotion();

  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      // Hide if near the footer to avoid overlap with the massive footer typography
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      setIsAtBottom(scrolledToBottom);
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();

    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  if (!nextEvent || !ticketUrl) return null;

  // Determine accent color based on series
  const isSunsets = nextEvent.series === "chasing-sunsets";
  const isStory = nextEvent.series === "untold-story";
  const accentColor = isSunsets ? "bg-[#E8B86D]" : isStory ? "bg-[#22D3EE]" : "bg-primary";
  const textAccent = isSunsets ? "text-[#E8B86D]" : isStory ? "text-[#22D3EE]" : "text-primary";

  // Parse Date
  const dateParts = nextEvent.date.split(" ");
  const shortDate = dateParts.length >= 2 ? `${dateParts[0].substring(0, 3)} ${dateParts[1].replace(',', '')}` : nextEvent.date;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 md:bottom-8 md:right-8 md:left-auto z-[45] transition-transform duration-700 ease-in-out origin-bottom ${
        isAtBottom ? "translate-y-[120%]" : "translate-y-0"
      }`}
    >
      <a
        href={ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={CTA_LABELS.tickets}
        tabIndex={isAtBottom ? -1 : 0}
        aria-hidden={isAtBottom}
        className="group relative flex flex-col focus-visible:outline-none"
      >
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 1 }}
           onMouseEnter={() => signalChirp.hover()}
           onClick={() => signalChirp.click()}
           className="bg-black border-t md:border border-white/15 p-5 sm:p-6 md:p-8 flex items-center justify-between md:justify-end gap-4 md:gap-8 transition-all duration-500 hover:bg-white hover:border-white overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.8)] md:shadow-2xl hover:[filter:url(#liquid-distortion)]"
        >
          {/* Edge Accent Line */}
          <div className={`absolute top-0 bottom-0 left-0 w-[3px] opacity-50 group-hover:opacity-100 transition-all duration-500 ${accentColor}`} />

          <div className="flex flex-col text-left md:text-right items-start md:items-end z-10 w-full md:w-auto">
            {nextEvent.ticketUrl && (
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full opacity-75 ${accentColor}`} />
                  <span className={`relative inline-flex h-2 w-2 ${accentColor}`} />
                </span>
                <span className={`font-mono text-[9px] uppercase tracking-[0.35em] font-bold ${textAccent} group-hover:text-black/60 transition-colors`}>
                  Priority Access
                </span>
              </div>
            )}
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-black/50 transition-colors mb-1.5 md:mb-2">
              {shortDate}
            </span>
            <span className="font-heavy text-lg md:text-3xl uppercase tracking-tighter text-white group-hover:text-black transition-colors leading-none truncate max-w-[200px] md:max-w-xs">
              <KineticDecryption text={nextEvent.title} />
            </span>
          </div>

          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border border-white/20 rounded-none group-hover:bg-black group-hover:border-black transition-all duration-500 z-10">
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-black transition-all duration-500 transform group-hover:scale-110" />
          </div>

        </motion.div>
      </a>
    </div>
  );
}
