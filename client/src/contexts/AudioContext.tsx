import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface GlobalAudioTrack {
  slug?: string;
  title: string;
  artist?: string;
  src: string;
}

interface AudioContextValue {
  activeTrack: GlobalAudioTrack | null;
  isPlaying: boolean;
  positionMs: number;
  loadTrack: (track: GlobalAudioTrack) => void;
  unloadTrack: () => void;
  setPlaying: (playing: boolean) => void;
  setPositionMs: (positionMs: number) => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

/**
 * Holds active radio/mix playback state above the Wouter router so audio
 * continues playing cleanly when visitors navigate across pages.
 */
export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  const [activeTrack, setActiveTrack] = useState<GlobalAudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);

  const loadTrack = useCallback((track: GlobalAudioTrack) => {
    setActiveTrack(current => {
      if (current?.src === track.src) return current;
      setPositionMs(0);
      return track;
    });
    setIsPlaying(true);
  }, []);

  const unloadTrack = useCallback(() => {
    setActiveTrack(null);
    setIsPlaying(false);
    setPositionMs(0);
  }, []);

  const value = useMemo(
    () => ({
      activeTrack,
      isPlaying,
      positionMs,
      loadTrack,
      unloadTrack,
      setPlaying: setIsPlaying,
      setPositionMs,
    }),
    [activeTrack, isPlaying, positionMs, loadTrack, unloadTrack]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useGlobalAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useGlobalAudio must be used within GlobalAudioProvider");
  }
  return context;
}

export function useOptionalGlobalAudio() {
  return useContext(AudioContext);
}
