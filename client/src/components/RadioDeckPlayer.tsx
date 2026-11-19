import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import "./radio-deck-player.css";

interface RadioDeckPlayerProps {
  slug?: string;
  title: string;
  artist?: string;
  src: string;
  sourceUrl?: string;
  duration: string;
}

export function durationLabelToMs(label: string): number {
  if (!/^\d+:\d{2}(?::\d{2})?$/.test(label)) return 0;
  const parts = label.split(":").map(Number);
  if (parts.slice(1).some(part => part >= 60)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0) * 1000;
}

export function clockLabel(ms: number): string {
  const total = Number.isFinite(ms) ? Math.max(0, Math.floor(ms / 1000)) : 0;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Page controls for the single SoundCloud transport owned by StickyPlayer. */
export default function RadioDeckPlayer({
  slug,
  title,
  artist,
  src,
  sourceUrl,
  duration,
}: RadioDeckPlayerProps) {
  const audio = useOptionalGlobalAudio();
  if (!audio)
    return (
      <iframe
        title={`${title} SoundCloud player`}
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="0"
        allow="autoplay"
        src={src}
      />
    );
  const active = audio.activeTrack?.src === src;
  const playing = active && audio.isPlaying;
  const error = active ? audio.playbackError : null;
  const positionMs = active ? audio.positionMs : 0;
  const durationMs = durationLabelToMs(duration);
  const progress =
    durationMs > 0 ? Math.min(100, (positionMs / durationMs) * 100) : 0;
  const toggle = () => {
    if (error) {
      audio.retryPlayback();
      return;
    }
    if (active) audio.setPlaying(!audio.isPlaying);
    else audio.loadTrack({ slug, title, artist, src, duration });
  };
  return (
    <div className={`radio-deck${playing ? " is-playing" : ""}`}>
      <div className="radio-deck-main">
        <button
          type="button"
          className="radio-deck-play"
          onClick={toggle}
          aria-label={`${error ? "Retry" : playing ? "Pause" : "Play"} ${title}`}
        >
          {playing ? (
            <Pause size={24} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={24} fill="currentColor" aria-hidden="true" />
          )}
        </button>
        <div className="radio-deck-body">
          <p className="radio-deck-status" role="status">
            <span className="radio-deck-dot" aria-hidden="true" />
            {error
              ? "Connection unavailable"
              : active
                ? playing
                  ? "Now playing"
                  : "Paused"
                : "Ready to play"}
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
              onChange={event => audio.seekTo(Number(event.target.value))}
              disabled={!active || durationMs === 0}
              aria-label="Seek within the episode"
              aria-valuetext={`${clockLabel(positionMs)} of ${duration}`}
              style={{ ["--progress" as string]: `${progress}%` }}
            />
            <span>{duration}</span>
          </div>
        </div>
      </div>
      <div className="radio-deck-foot">
        {error && <p role="alert">{error}</p>}
        <span>Playback provided by SoundCloud</span>
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
      </div>
    </div>
  );
}
