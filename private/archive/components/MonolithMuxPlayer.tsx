import MuxPlayerReact from "@mux/mux-player-react";

interface MonolithVideoProps {
  playbackId: string;
  autoPlay?: "any" | "muted" | boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  posterUrl?: string; // Optional custom poster
  isHero?: boolean;
}

export default function MonolithMuxPlayer({
  playbackId,
  autoPlay = "muted",
  loop = true,
  muted = true,
  className = "w-full h-full object-cover",
  posterUrl,
  isHero = false,
}: MonolithVideoProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <MuxPlayerReact
        streamType="on-demand"
        playbackId={playbackId}
        metadata={{
          video_id: playbackId,
          video_title: "Monolith Live Experience",
          player_name: "monolith-custom-player",
        }}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        poster={posterUrl}
        // Customizing the mux-player UI to fit the SS-Tier Dark Aesthetic
        style={{
          height: "100%",
          maxWidth: "100%",
          "--controls": isHero ? "none" : "flex", // Hero videos shouldn't have controls
          "--media-object-fit": "cover",
          "--bottom-play-button": "none",
          "--center-controls": "none",
        }}
        className="w-full h-full object-cover mix-blend-screen opacity-90"
      />
    </div>
  );
}
