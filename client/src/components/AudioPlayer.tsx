import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { attachSoundCloudWidget } from "@/lib/soundcloudWidget";

interface AudioPlayerProps {
  slug?: string;
  title: string;
  artist?: string;
  src: string;
}

export default function AudioPlayer({
  slug,
  title,
  artist,
  src,
}: AudioPlayerProps) {
  const audio = useOptionalGlobalAudio();
  const isActiveGlobal = audio?.activeTrack?.src === src;
  const [localLoaded, setLocalLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const loaded = isActiveGlobal || localLoaded;

  useEffect(() => {
    if (!loaded || !iframeRef.current) return;

    return attachSoundCloudWidget({
      iframe: iframeRef.current,
      resumePositionMs: isActiveGlobal ? (audio?.positionMs ?? 0) : 0,
      shouldPlayOnReady: isActiveGlobal ? Boolean(audio?.isPlaying) : false,
      onPlayingChange: playing => audio?.setPlaying(playing),
      onPositionChange: ms => audio?.setPositionMs(ms),
    });
  }, [loaded, src]);

  if (!loaded)
    return (
      <button
        type="button"
        className="audio-player-prompt"
        onClick={() => {
          setLocalLoaded(true);
          audio?.loadTrack({ slug, title, artist, src });
        }}
      >
        <strong>
          <Play size={20} aria-hidden="true" />
          Load the player
        </strong>
        <span>{title} · SoundCloud</span>
      </button>
    );
  return (
    <iframe
      ref={iframeRef}
      title={`${title} embedded player`}
      width="100%"
      height="166"
      scrolling="no"
      frameBorder="0"
      allow="autoplay"
      src={src}
    />
  );
}
