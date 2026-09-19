import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { useAmbientVideoEnabled } from "@/hooks/useAmbientVideoEnabled";

const photograph = getResponsiveImage("videoPoster1");
// A portrait viewport crops a wide photograph; request enough pixels for its height.
const imageSizes = "(max-width: 639px) 165svh, 100vw";

export default function CinematicHeroMedia() {
  const ambientEnabled = useAmbientVideoEnabled(768);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoEnabled = ambientEnabled && !reducedMotion;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasFrame, setHasFrame] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReducedMotion(media.matches);
      if (media.matches) {
        setHasFrame(false);
        setPlaying(false);
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <>
      <div className="monolith-hero-photo" aria-hidden="true">
        <picture>
          {photograph.sources?.map((source, index) => (
            <source key={index} {...source} sizes={imageSizes} />
          ))}
          <img
            src={photograph.src}
            sizes={imageSizes}
            width="1920"
            height="1080"
            alt=""
            fetchPriority="high"
          />
        </picture>
        {videoEnabled && (
          <video
            ref={videoRef}
            className={hasFrame ? "is-ready" : ""}
            src="/videos/hero-video-1.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            onPlaying={() => {
              setHasFrame(true);
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onError={() => {
              setHasFrame(false);
              setPlaying(false);
            }}
          />
        )}
      </div>
      {videoEnabled && hasFrame && (
        <button
          type="button"
          className="home-film-control"
          aria-label={
            playing ? "Pause background film" : "Play background film"
          }
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) void video.play().catch(() => setPlaying(false));
            else video.pause();
          }}
        >
          {playing ? (
            <Pause size={16} aria-hidden="true" />
          ) : (
            <Play size={16} aria-hidden="true" />
          )}
          <span>{playing ? "Pause film" : "Play film"}</span>
        </button>
      )}
    </>
  );
}
