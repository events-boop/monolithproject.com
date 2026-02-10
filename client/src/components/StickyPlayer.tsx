import { motion, AnimatePresence } from "framer-motion";
import { Pause, X } from "lucide-react";

interface StickyPlayerProps {
  track: { title: string; artist: string; embedUrl: string } | null;
  onClose: () => void;
}

export default function StickyPlayer({ track, onClose }: StickyPlayerProps) {
  return (
    <AnimatePresence>
      {track && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
        >
          <div className="flex items-center gap-4 px-6 py-0">
            {/* Track info */}
            <div className="flex items-center gap-3 min-w-0 shrink-0">
              <Pause className="w-3.5 h-3.5 text-primary shrink-0" />
              <div className="min-w-0">
                <span className="block text-sm text-foreground font-medium truncate">
                  {track.title}
                </span>
                <span className="block text-[10px] text-muted-foreground font-mono tracking-wide">
                  {track.artist}
                </span>
              </div>
            </div>

            {/* SoundCloud mini embed */}
            <div className="flex-1 min-w-0">
              <iframe
                width="100%"
                height="60"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={track.embedUrl + "&auto_play=true&show_artwork=false&visual=false"}
                title={track.title}
                className="w-full opacity-80"
              />
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
