import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { buildResponsiveImageSources } from "@/lib/responsiveImagePath";
import {
  HOME_CINEMATIC_OPENING,
  HOME_HERO_PHOTOGRAPH,
} from "@/data/homeArtDirection";
import { useAmbientVideoEnabled } from "@/hooks/useAmbientVideoEnabled";

export interface HeroMediaTelemetry {
  available: boolean;
  ready: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
}

export interface CinematicHeroMediaHandle {
  togglePlayback: () => void;
  seekTo: (seconds: number) => void;
}

interface CinematicHeroMediaProps {
  variant?: "rooms" | "opening";
  active?: boolean;
  heroInView?: boolean;
  documentVisible?: boolean;
  pausedForModal?: boolean;
  priority?: boolean;
  onPosterReady?: () => void;
  onTelemetryChange?: (telemetry: HeroMediaTelemetry) => void;
}

const EMPTY_TELEMETRY: HeroMediaTelemetry = {
  available: false,
  ready: false,
  playing: false,
  currentTime: 0,
  duration: 0,
};

const CinematicHeroMedia = forwardRef<
  CinematicHeroMediaHandle,
  CinematicHeroMediaProps
>(function CinematicHeroMedia(
  {
    variant = "rooms",
    active = true,
    heroInView = true,
    documentVisible = true,
    pausedForModal = false,
    priority = true,
    onPosterReady,
    onTelemetryChange,
  },
  ref
) {
  const isOpening = variant === "opening";
  const photograph = isOpening ? HOME_CINEMATIC_OPENING : HOME_HERO_PHOTOGRAPH;
  const ambientEnabled = useAmbientVideoEnabled(768);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [videoFailed, setVideoFailed] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const posterReportedRef = useRef(false);

  const videoEnabled =
    isOpening && ambientEnabled && !reducedMotion && !videoFailed;

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

  useEffect(() => {
    if (posterReportedRef.current) return;
    if (imgRef.current?.complete) {
      posterReportedRef.current = true;
      onPosterReady?.();
    }
  }, [onPosterReady]);

  useEffect(() => {
    if (!videoEnabled) {
      setHasFrame(false);
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [videoEnabled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoEnabled) return;

    const shouldPlay =
      active &&
      heroInView &&
      documentVisible &&
      !pausedForModal &&
      !userPausedRef.current;

    if (shouldPlay) {
      if (video.paused) {
        void video.play().catch(() => {
          setPlaying(false);
        });
      }
    } else if (!video.paused) {
      video.pause();
    }
  }, [active, heroInView, documentVisible, pausedForModal, videoEnabled]);

  useEffect(() => {
    if (!onTelemetryChange) return;
    onTelemetryChange(
      videoEnabled
        ? {
            available: true,
            ready: hasFrame,
            playing,
            currentTime,
            duration,
          }
        : EMPTY_TELEMETRY
    );
  }, [
    videoEnabled,
    hasFrame,
    playing,
    currentTime,
    duration,
    onTelemetryChange,
  ]);

  useImperativeHandle(
    ref,
    () => ({
      togglePlayback() {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
          userPausedRef.current = false;
          void video.play().catch(() => {
            setPlaying(false);
          });
        } else {
          userPausedRef.current = true;
          video.pause();
        }
      },
      seekTo(seconds: number) {
        const video = videoRef.current;
        if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
          return;
        }
        const clamped = Math.min(Math.max(0, seconds), video.duration);
        video.currentTime = clamped;
        setCurrentTime(clamped);
      },
    }),
    []
  );

  const sources = [
    ...buildResponsiveImageSources(photograph.mobileSource, "100vw").map(
      source => ({ ...source, media: "(max-width: 639px)" })
    ),
    ...buildResponsiveImageSources(photograph.source, "100vw"),
  ];

  const reportPosterReady = () => {
    if (posterReportedRef.current) return;
    posterReportedRef.current = true;
    onPosterReady?.();
  };

  return (
    <div
      className={`monolith-hero-photo ${isOpening ? "monolith-hero-photo-opening" : "monolith-hero-photo-rooms"}`}
      aria-hidden="true"
    >
      <picture>
        {sources.map((source, index) => (
          <source key={index} {...source} />
        ))}
        <img
          ref={imgRef}
          src={photograph.source}
          sizes="100vw"
          width={photograph.sourceWidth}
          height={photograph.sourceHeight}
          alt=""
          fetchPriority={priority ? "high" : undefined}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={reportPosterReady}
          onError={reportPosterReady}
        />
      </picture>
      {videoEnabled && (
        <video
          ref={videoRef}
          className={hasFrame ? "is-ready" : ""}
          src={HOME_CINEMATIC_OPENING.videoDesktop}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          onLoadedMetadata={event => {
            const d = event.currentTarget.duration;
            if (Number.isFinite(d) && d > 0) setDuration(d);
          }}
          onDurationChange={event => {
            const d = event.currentTarget.duration;
            if (Number.isFinite(d) && d > 0) setDuration(d);
          }}
          onLoadedData={event => {
            if (event.currentTarget.readyState >= 2) {
              setHasFrame(true);
            }
          }}
          onTimeUpdate={event => {
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onPlaying={event => {
            setHasFrame(true);
            setPlaying(true);
            const d = event.currentTarget.duration;
            if (Number.isFinite(d) && d > 0) setDuration(d);
          }}
          onPause={() => {
            setPlaying(false);
          }}
          onError={() => {
            setVideoFailed(true);
            setHasFrame(false);
            setPlaying(false);
          }}
        />
      )}
    </div>
  );
});

export default CinematicHeroMedia;
