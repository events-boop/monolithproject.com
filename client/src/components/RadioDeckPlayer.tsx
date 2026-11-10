import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import {
  attachSoundCloudWidget,
  safeReadSoundCloudPosition,
  type SoundCloudWidget,
} from "@/lib/soundcloudWidget";
import "./radio-deck-player.css";

interface RadioDeckPlayerProps {
  slug?: string;
  title: string;
  artist?: string;
  /** SoundCloud widget URL. */
  src: string;
  /** The recording's own page, for "Open on SoundCloud". */
  sourceUrl?: string;
  /** "64:17" or "1:04:17". Used for the scrubber until the widget reports a position. */
  duration: string;
}

/** "64:17" → milliseconds. Returns 0 when the label cannot be read. */
export function durationLabelToMs(label: string): number {
  const parts = label.split(":").map(part => Number.parseInt(part, 10));
  if (parts.length < 2 || parts.some(part => !Number.isFinite(part))) return 0;
  const seconds = parts.reduce((total, part) => total * 60 + part, 0);
  return seconds * 1000;
}

export function clockLabel(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/**
 * The episode page's player: our own play button, scrubber and clock in front of the SoundCloud
 * widget. SoundCloud still plays the audio and is credited; its frame stays mounted (collapsed)
 * because the widget is what makes sound. Playback is shared with the persistent player, so
 * leaving the page keeps the set going from the same position.
 */
export default function RadioDeckPlayer({
  slug,
  title,
  artist,
  src,
  sourceUrl,
  duration,
}: RadioDeckPlayerProps) {
  const audio = useOptionalGlobalAudio();
  const isActive = audio?.activeTrack?.src === src;
  const [localLoaded, setLocalLoaded] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const loaded = isActive || localLoaded;
  const playing = Boolean(isActive && audio?.isPlaying);
  const positionMs = isActive ? (audio?.positionMs ?? 0) : 0;
  const durationMs = durationLabelToMs(duration);
  const progress =
    durationMs > 0 ? Math.min(100, (positionMs / durationMs) * 100) : 0;

  useEffect(() => {
    if (!loaded || !iframeRef.current) return;
    const detach = attachSoundCloudWidget({
      iframe: iframeRef.current,
      resumePositionMs: isActive ? (audio?.positionMs ?? 0) : 0,
      shouldPlayOnReady: isActive ? Boolean(audio?.isPlaying) : false,
      onWidgetReady: widget => {
        widgetRef.current = widget;
      },
      onPlayingChange: next => audio?.setPlaying(next),
      onPositionChange: ms => audio?.setPositionMs(ms),
    });
    return () => {
      widgetRef.current = null;
      detach();
    };
    // The widget is bound once per recording; play state changes go through it, not through a rebind.
  }, [loaded, src]);

  const toggle = () => {
    if (!loaded) {
      setLocalLoaded(true);
      audio?.loadTrack({ slug, title, artist, src });
      return;
    }
    const widget = widgetRef.current;
    try {
      if (playing) {
        safeReadSoundCloudPosition(iframeRef.current, widget, ms =>
          audio?.setPositionMs(ms)
        );
        widget?.pause();
        audio?.setPlaying(false);
      } else {
        if (!isActive) audio?.loadTrack({ slug, title, artist, src });
        widget?.play();
        audio?.setPlaying(true);
      }
    } catch {
      // The widget can be mid-reload; the next tap will reach it.
    }
  };

  const seek = (ms: number) => {
    try {
      widgetRef.current?.seekTo(ms);
      audio?.setPositionMs(ms);
    } catch {
      // Ignore a seek sent while the widget is reloading.
    }
  };

  const status = !loaded
    ? "Ready to play"
    : playing
      ? "Now spinning"
      : "Paused";

  return (
    <div className={`radio-deck${playing ? " is-playing" : ""}`}>
      <div className="radio-deck-main">
        <button
          type="button"
          className="radio-deck-play"
          onClick={toggle}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        >
          {playing ? (
            <Pause size={26} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={26} fill="currentColor" aria-hidden="true" />
          )}
        </button>
        <div className="radio-deck-body">
          <p className="radio-deck-status" role="status">
            <span className="radio-deck-dot" aria-hidden="true" />
            {status}
          </p>
          <p className="radio-deck-title">
            {artist ? `${artist} · ${title}` : title}
          </p>
          <div className="radio-deck-scrub">
            <span>{clockLabel(positionMs)}</span>
            <input
              type="range"
              min={0}
              max={Math.max(durationMs, 1)}
              step={1000}
              value={Math.min(positionMs, Math.max(durationMs, 1))}
              onChange={event => seek(Number(event.target.value))}
              disabled={!loaded || durationMs === 0}
              aria-label="Seek within the episode"
              aria-valuetext={`${clockLabel(positionMs)} of ${duration}`}
              style={{ ["--progress" as string]: `${progress}%` }}
            />
            <span>{duration}</span>
          </div>
        </div>
      </div>
      <div className="radio-deck-foot">
        <span>Playback provided by SoundCloud</span>
        <span className="radio-deck-foot-actions">
          {loaded && (
            <button
              type="button"
              className="radio-deck-link"
              onClick={() => setShowFrame(value => !value)}
              aria-expanded={showFrame}
            >
              {showFrame ? "Hide SoundCloud player" : "Show SoundCloud player"}
            </button>
          )}
          {sourceUrl && (
            <a
              className="radio-deck-link"
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on SoundCloud <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
        </span>
      </div>
      {loaded && (
        <div className={`radio-deck-frame${showFrame ? " is-open" : ""}`}>
          <iframe
            ref={iframeRef}
            title={`${title} SoundCloud player`}
            width="100%"
            height="120"
            scrolling="no"
            frameBorder="0"
            allow="autoplay"
            src={src}
            tabIndex={showFrame ? 0 : -1}
          />
        </div>
      )}
    </div>
  );
}
