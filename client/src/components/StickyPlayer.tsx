import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Bookmark, Pause, Play, Radio, X } from "lucide-react";
import { Link } from "wouter";
import { useGlobalAudio } from "@/contexts/AudioContext";
import { radioEpisodes } from "@/data/radioEpisodes";
import { toggleSavedEpisode, useSavedPassport } from "@/lib/savedPassport";
import {
  attachSoundCloudWidget,
  safeReadSoundCloudPosition,
  type SoundCloudWidget,
} from "@/lib/soundcloudWidget";
import { clockLabel, durationLabelToMs } from "./RadioDeckPlayer";

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
  const passport = useSavedPassport();
  const dockWrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const resumeStateRef = useRef({ isPlaying, positionMs });
  resumeStateRef.current = { isPlaying, positionMs };

  const matchedEpisode = useMemo(() => {
    if (!activeTrack) return undefined;
    return radioEpisodes.find(
      ep => ep.slug === activeTrack.slug || ep.embedUrl === activeTrack.src
    );
  }, [activeTrack]);

  const coverSrc =
    activeTrack?.coverImage ||
    matchedEpisode?.coverImage ||
    matchedEpisode?.image;
  const durationLabel = activeTrack?.duration || matchedEpisode?.duration || "";
  const durationMs = durationLabel ? durationLabelToMs(durationLabel) : 0;
  const progressPct =
    durationMs > 0 ? Math.min(100, Math.max(0, (positionMs / durationMs) * 100)) : 0;

  // Publish exact dock height so CookieConsent & FloatingFactsChip never overlap
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!activeTrack) {
      root.style.setProperty("--sticky-audio-dock-height", "0px");
      return;
    }

    const syncHeight = () => {
      const h = dockWrapRef.current?.offsetHeight ?? 84;
      root.style.setProperty("--sticky-audio-dock-height", `${h}px`);
    };

    syncHeight();
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && dockWrapRef.current) {
      observer = new ResizeObserver(syncHeight);
      observer.observe(dockWrapRef.current);
    }
    window.addEventListener("resize", syncHeight, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", syncHeight);
      root.style.setProperty("--sticky-audio-dock-height", "0px");
    };
  }, [activeTrack]);

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

  const trackSlug = activeTrack?.slug || matchedEpisode?.slug;
  const trackHref = trackSlug ? `/radio/${trackSlug}` : "/radio";
  const isSaved = Boolean(trackSlug && passport.episodes.includes(trackSlug));

  return (
    <AnimatePresence>
      {activeTrack && (
        <motion.div
          ref={dockWrapRef}
          data-sticky-audio-dock="true"
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="lg-audio-dock-wrap"
          role="region"
          aria-label="Persistent audio player"
        >
          <div className="lg-audio-dock">
            {durationMs > 0 && (
              <div className="lg-audio-dock-progress" aria-hidden="true">
                <span style={{ width: `${progressPct}%` }} />
              </div>
            )}

            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 sm:gap-4 sm:px-5">
              {/* Left: Cover Art, Play/Pause & Episode Link */}
              <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial sm:max-w-[340px]">
                {coverSrc && (
                  <Link href={trackHref} className="hidden min-[380px]:block shrink-0">
                    <img
                      src={coverSrc}
                      alt=""
                      width={44}
                      height={44}
                      decoding="async"
                      className="h-11 w-11 rounded-lg object-cover object-top border border-white/15"
                      style={{ objectPosition: "50% 0%" }}
                    />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleTogglePlayback}
                  aria-label={isPlaying ? "Pause episode" : "Play episode"}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ffe6c2]/65 bg-[#f3a659] text-[#181009] shadow-[0_4px_18px_rgba(243,152,70,0.34)] transition-transform hover:scale-105 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" fill="currentColor" aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" fill="currentColor" aria-hidden="true" />
                  )}
                </button>

                <Link href={trackHref} className="min-w-0 block group">
                  <span className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.18em] text-[#f3b572]">
                    <Radio className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>{isPlaying ? "NOW SPINNING" : "PAUSED"}</span>
                    {durationMs > 0 && (
                      <span className="text-white/55 tabular-nums">
                        · {clockLabel(positionMs)}
                      </span>
                    )}
                  </span>
                  <span className="block text-sm text-[#fbf6ee] font-medium truncate group-hover:text-[#ffd8a6] transition-colors">
                    {activeTrack.title}
                  </span>
                  {activeTrack.artist && (
                    <span className="block text-[11px] text-white/65 font-mono tracking-wide truncate">
                      {activeTrack.artist}
                    </span>
                  )}
                </Link>
              </div>

              {/* Center: Keep a measurable 320×60 SoundCloud embed so mobile never triggers a 0×0 canvas warning */}
              <div className="absolute h-px w-px overflow-hidden opacity-0 pointer-events-none lg:static lg:w-full lg:h-[60px] lg:flex-1 lg:min-w-0 lg:opacity-85 lg:pointer-events-auto">
                <iframe
                  ref={iframeRef}
                  width="320"
                  height="60"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={embedSrc}
                  title={activeTrack.title}
                  className="w-[320px] lg:w-full"
                />
              </div>

              {/* Right: Save Episode, Open Room & Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                {trackSlug && (
                  <button
                    type="button"
                    onClick={() => toggleSavedEpisode(trackSlug)}
                    aria-label={
                      isSaved
                        ? "Remove episode from saved list"
                        : "Save episode to your list"
                    }
                    className={`hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                      isSaved
                        ? "border-[#f3a659]/50 bg-[#f3a659]/18 text-[#ffd8a6]"
                        : "border-white/12 bg-white/[0.04] text-white/70 hover:text-white"
                    }`}
                  >
                    <Bookmark
                      className="h-3.5 w-3.5"
                      fill={isSaved ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  </button>
                )}

                <Link
                  href={trackHref}
                  aria-label="Open episode page"
                  className="hidden md:inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/80 hover:border-[#f3a659]/45 hover:text-white transition-colors"
                >
                  <span>Episode</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>

                <button
                  type="button"
                  onClick={unloadTrack}
                  aria-label="Close audio player"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
