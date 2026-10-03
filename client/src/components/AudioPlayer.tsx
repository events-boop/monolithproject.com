import { useState } from "react";
import { Play } from "lucide-react";
export default function AudioPlayer({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  const [loaded, setLoaded] = useState(false);
  if (!loaded)
    return (
      <button
        type="button"
        className="audio-player-prompt"
        onClick={() => setLoaded(true)}
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
