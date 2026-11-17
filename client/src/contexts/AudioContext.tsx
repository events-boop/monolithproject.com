import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export interface GlobalAudioTrack {
  slug?: string;
  title: string;
  artist?: string;
  src: string;
  coverImage?: string;
  duration?: string;
}

interface AudioContextValue {
  activeTrack: GlobalAudioTrack | null;
  isPlaying: boolean;
  positionMs: number;
  loadTrack: (track: GlobalAudioTrack) => void;
  unloadTrack: () => void;
  setPlaying: (playing: boolean) => void;
  setPositionMs: (positionMs: number) => void;
  seekTo: (positionMs: number) => void;
  registerSeek: (handler: (positionMs: number) => void) => () => void;
  playbackError: string | null;
  transportAttempt: number;
  reportPlaybackError: (message: string | null) => void;
  retryPlayback: () => void;
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
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [transportAttempt, setTransportAttempt] = useState(0);
  const reportPlaybackError = useCallback((message: string | null) => {
    setPlaybackError(message);
    if (message) setIsPlaying(false);
  }, []);
  const retryPlayback = useCallback(() => {
    setPlaybackError(null);
    setTransportAttempt(attempt => attempt + 1);
    setIsPlaying(true);
  }, []);
  const seekHandler = useRef<((positionMs: number) => void) | null>(null);
  const registerSeek = useCallback((handler: (positionMs: number) => void) => {
    seekHandler.current = handler;
    return () => {
      if (seekHandler.current === handler) seekHandler.current = null;
    };
  }, []);
  const seekTo = useCallback((position: number) => {
    if (!Number.isFinite(position)) return;
    const safe = Math.max(0, position);
    seekHandler.current?.(safe);
    setPositionMs(safe);
  }, []);

  const loadTrack = useCallback((track: GlobalAudioTrack) => {
    setPlaybackError(null);
    setActiveTrack(current => {
      if (current?.src === track.src) return current;
      setPositionMs(0);
      return track;
    });
    setIsPlaying(true);
  }, []);

  const unloadTrack = useCallback(() => {
    setPlaybackError(null);
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
      seekTo,
      registerSeek,
      playbackError,
      transportAttempt,
      reportPlaybackError,
      retryPlayback,
    }),
    [
      activeTrack,
      isPlaying,
      positionMs,
      loadTrack,
      unloadTrack,
      seekTo,
      registerSeek,
      playbackError,
      transportAttempt,
      reportPlaybackError,
      retryPlayback,
    ]
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
