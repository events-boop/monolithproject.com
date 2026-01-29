/*
  DESIGN: Cosmic Mysticism - Persistent Audio Player
  - Floating at bottom of viewport
  - Minimal, elegant design
  - Play/pause functionality with visual feedback
*/

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Radio, SkipBack, SkipForward } from "lucide-react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Placeholder track info - would be dynamic in production
  const currentTrack = {
    title: "Golden Hour Sessions",
    artist: "Chasing Sun(Sets) Radio",
    // Using a placeholder - in production this would be a real audio source
    src: "",
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Audio play failed - likely no source or user interaction required
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentTrack.src} preload="metadata" />

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        className="w-full"
      >
        {/* Progress bar */}
        <div className="h-[2px] bg-white/5 w-full">
          <motion.div
            className="h-full bg-[#D4A574] shadow-[0_0_10px_#D4A574]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Player content */}
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/10">
          <div className="container max-w-6xl mx-auto">
            <div className="flex items-center justify-between py-4 px-6 md:px-8">
              {/* Left: Track info */}
              <div className="flex items-center gap-6 flex-1">
                {/* Animated radio icon */}
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.1, 1], borderColor: "rgba(212,165,116,0.6)" } : { borderColor: "rgba(255,255,255,0.1)" }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
                >
                  <Radio className={`w-5 h-5 transition-colors ${isPlaying ? "text-[#D4A574]" : "text-white/20"}`} />
                </motion.div>

                <div className="hidden sm:block">
                  <p className="text-base font-display tracking-wide text-white mb-0.5">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-[#D4A574] uppercase tracking-widest opacity-80 font-mono">
                    {currentTrack.artist}
                  </p>
                </div>
              </div>

              {/* Center: Play controls */}
              <div className="flex items-center justify-center gap-8 flex-1">
                <button className="text-white/20 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>

                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full bg-[#D4A574] text-black flex items-center justify-center hover:shadow-[0_0_20px_rgba(212,165,116,0.5)] transition-all shadow-lg shadow-[#D4A574]/20"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 ml-1 fill-current" />
                  )}
                </motion.button>

                <button className="text-white/20 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Right: Volume & time */}
              <div className="flex items-center gap-6 flex-1 justify-end">
                <span className="text-xs text-white/40 font-mono hidden lg:block tabular-nums tracking-wider">
                  {formatTime(currentTime)} / {formatTime(duration || 0)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Live Event Indicator - Green Beacon */}
                <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                  />
                  <span className="text-[10px] text-white/90 uppercase tracking-widest font-medium group-hover:text-white transition-colors">
                    EVENT IS LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
