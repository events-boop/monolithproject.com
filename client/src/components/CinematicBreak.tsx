import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useAmbientVideoEnabled } from "@/hooks/useAmbientVideoEnabled";
import { useResponsiveVideoSource } from "@/hooks/useResponsiveVideoSource";
import ResponsiveImage from "./ResponsiveImage";

interface CinematicBreakProps {
  image: string;
  videoSrc?: string;
  mobileVideoSrc?: string;
  quote?: string;
  attribution?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaExternal?: boolean;
}

export default function CinematicBreak({
  image,
  videoSrc,
  mobileVideoSrc,
  quote,
  attribution,
  ctaLabel,
  ctaUrl,
  ctaExternal,
}: CinematicBreakProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "200px", once: true });
  const reduceMotion = useReducedMotion();
  const enableAmbientVideo = useAmbientVideoEnabled(360);
  const activeVideoSrc = useResponsiveVideoSource(videoSrc || "", mobileVideoSrc);
  const [loadVideo, setLoadVideo] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], reduceMotion ? [1, 1, 1, 1] : [0.5, 1, 1, 0.5]);

  // Keep the still image as the "instant" paint, then attach the video src once
  // the section is near the viewport and the browser is idle. This reduces
  // bandwidth contention and helps keep scrolling smooth.
  useEffect(() => {
    if (!videoSrc) return;
    if (!enableAmbientVideo) return;
    if (!isInView) return;
    if (loadVideo) return;
    if (reduceMotion) return;

    const id = window.setTimeout(() => setLoadVideo(true), 50);
    return () => window.clearTimeout(id);
  }, [enableAmbientVideo, isInView, loadVideo, reduceMotion, videoSrc]);

  return (
    <div ref={ref} className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Parallax image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 -top-[20%] -bottom-[20%]"
      >
        {videoSrc && enableAmbientVideo && isInView && loadVideo ? (
          <video
            src={activeVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={image}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <ResponsiveImage
            src={image}
            alt=""
            loading={isInView ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={isInView ? "high" : "auto"}
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </motion.div>

      {/* Lighter center with edge protection */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.18),rgba(0,0,0,0.44)_78%,rgba(0,0,0,0.56)_100%)]" />

      {/* Quote overlay */}
      {quote && (
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 flex items-center justify-center px-8"
        >
          <div className="max-w-4xl text-center">
            <span className="inline-flex items-center rounded-none border border-white/20 bg-black/20 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
              The Collective
            </span>
            <div className="quiet-panel mt-6 px-6 py-8 md:px-10 md:py-10">
              <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-white/90 leading-relaxed italic">
                "{quote}"
              </p>
              {attribution && (
                <span className="block mt-6 font-mono text-xs text-white/70 tracking-[0.3em] uppercase">
                  — {attribution}
                </span>
              )}
              {ctaLabel && ctaUrl && (
                <a
                  href={ctaUrl}
                  target={ctaExternal ? "_blank" : undefined}
                  rel={ctaExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 mt-8 px-8 py-3 border border-white/40 text-white hover:border-primary hover:text-primary transition-all font-mono text-xs tracking-widest uppercase group rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  {ctaLabel}
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
