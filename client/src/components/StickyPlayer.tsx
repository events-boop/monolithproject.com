import { useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, Radio, X } from "lucide-react";
import { Link } from "wouter";
import { useGlobalAudio } from "@/contexts/AudioContext";
import {
  attachSoundCloudWidget,
  safeReadSoundCloudPosition,
  type SoundCloudWidget,
} from "@/lib/soundcloudWidget";

function buildMiniEmbedUrl(src: string, autoPlay: boolean): string {
  try {
    const parsed = new URL(src);
    parsed.searchParams.set("auto_play", autoPlay ? "true" : "false");
    parsed.searchParams.set("show_artwork", "false");
    parsed.searchParams.set("visual", "false");
    return parsed.toString();
  } catch {
    const sep = src.includes("?") ? "&" : "?";
    return `${src}${sep}auto_play=${autoPlay ? "true" : "false"}&show_artwork=false&visual=false`;
  }
}

export default function StickyPlayer() {
  const {
    activeTrack,
    isPlaying,
    positionMs,
    setPlaying,
    setPositionMs,
    unloadTrack,
  } = useGlobalAudio();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const resumeStateRef = useRef({ isPlaying, positionMs });
  resumeStateRef.current = { isPlaying, positionMs };

  // Freeze initial embed query params per track so play/pause never reloads the iframe.
  const embedSrc = useMemo(() => {
    if (!activeTrack) return "";
    return buildMiniEmbedUrl(activeTrack.src, resumeStateRef.current.isPlaying);
  }, [activeTrack?.src]);

  useEffect(() => {
    if (!activeTrack || !iframeRef.current) return;

    const detach = attachSoundCloudWidget({
      iframe: iframeRef.current,
      resumePositionMs: resumeStateRef.current.positionMs,
      shouldPlayOnReady: resumeStateRef.current.isPlaying,
      onWidgetReady: widget => {
        widgetRef.current = widget;
      },
      onPlayingChange: setPlaying,
      onPositionChange: setPositionMs,
    });

    return () => {
      widgetRef.current = null;
      detach();
    };
  }, [activeTrack?.src, setPlaying, setPositionMs]);

  const handleTogglePlayback = () => {
    const widget = widgetRef.current;
    if (isPlaying) {
      safeReadSoundCloudPosition(iframeRef.current, widget, setPositionMs);
      try {
        widget?.pause();
      } catch {
        // Ignore transient widget postMessage errors if frame is reloading.
      }
      setPlaying(false);
    } else {
      try {
        widget?.play();
      } catch {
        // Ignore transient widget postMessage errors if frame is reloading.
      }
      setPlaying(true);
    }
  };

  const trackHref = activeTrack?.slug
    ? `/radio/${activeTrack.slug}`
    : "/radio";

  return (
    <AnimatePresence>
      {activeTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-[env(safe-area-inset-bottom)]"
          role="region"
          aria-label="Persistent audio player"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2 sm:gap-4 sm:px-6 sm:py-0 max-w-full overflow-hidden">
            {/* Playback toggle & track info */}
            <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial sm:max-w-[260px]">
              <button
                type="button"
                onClick={handleTogglePlayback}
                aria-label={isPlaying ? "Pause episode" : "Play episode"}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-primary hover:border-primary/60 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
              <Link href={trackHref} className="min-w-0 block group">
                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-primary">
                  <Radio className="w-3 h-3 shrink-0" aria-hidden="true" />
                  {isPlaying ? "NOW SPINNING" : "PAUSED"}
                </span>
                <span className="block text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">
                  {activeTrack.title}
                </span>
                {activeTrack.artist && (
                  <span className="block text-[10px] text-muted-foreground font-mono tracking-wide truncate">
                    {activeTrack.artist}
                  </span>
                )}
              </Link>
            </div>

            {/* SoundCloud mini embed (keeps audio active on mobile without overflow) */}
            <div className="w-0 h-0 overflow-hidden opacity-0 pointer-events-none sm:w-full sm:h-[60px] sm:flex-1 sm:min-w-0 sm:opacity-80 sm:pointer-events-auto">
              <iframe
                ref={iframeRef}
                width="100%"
                height="60"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={embedSrc}
                title={activeTrack.title}
                className="w-full"
              />
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={unloadTrack}
              aria-label="Close audio player"
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
