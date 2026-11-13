export type SoundCloudProgressPayload = {
  currentPosition?: number;
};

export type SoundCloudWidget = {
  bind: (
    event: string,
    callback: (payload?: SoundCloudProgressPayload) => void
  ) => void;
  unbind: (event: string) => void;
  play: () => void;
  pause: () => void;
  seekTo: (milliseconds: number) => void;
  getPosition?: (callback: (ms: number) => void) => void;
};

export type SoundCloudAPI = {
  Widget: ((frame: HTMLIFrameElement) => SoundCloudWidget) & {
    Events: Record<string, string>;
  };
};

type SoundCloudWindow = Window & { SC?: SoundCloudAPI };

let apiPromise: Promise<SoundCloudAPI> | undefined;

/**
 * Lazily load the SoundCloud Widget API script once per browsing session.
 * Never runs unless a visitor explicitly interacts with an audio player.
 */
export function loadSoundCloudWidgetApi(): Promise<SoundCloudAPI> {
  const target = window as SoundCloudWindow;
  if (target.SC?.Widget) return Promise.resolve(target.SC);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<SoundCloudAPI>((resolve, reject) => {
    const script = document.createElement("script");
    const timer = window.setTimeout(fail, 12000);

    function fail() {
      window.clearTimeout(timer);
      script.remove();
      apiPromise = undefined;
      reject(new Error("The audio player could not connect. Please retry."));
    }

    script.src = "https://w.soundcloud.com/player/api.js";
    script.onload = () => {
      if (!target.SC?.Widget) {
        fail();
        return;
      }
      window.clearTimeout(timer);
      resolve(target.SC);
    };
    script.onerror = fail;
    document.head.append(script);
  });

  return apiPromise;
}

export interface SoundCloudBindingOptions {
  iframe: HTMLIFrameElement;
  resumePositionMs?: number;
  shouldPlayOnReady?: boolean;
  onWidgetReady?: (widget: SoundCloudWidget) => void;
  onPlayingChange?: (playing: boolean) => void;
  onPositionChange?: (positionMs: number) => void;
}

function isFrameLive(iframe: HTMLIFrameElement): boolean {
  try {
    return Boolean(iframe.isConnected && iframe.contentWindow);
  } catch {
    return false;
  }
}

export function safeReadSoundCloudPosition(
  iframe: HTMLIFrameElement | null,
  widget: SoundCloudWidget | null | undefined,
  onPosition?: (ms: number) => void
) {
  if (!iframe || !widget || !onPosition || !isFrameLive(iframe)) return;
  try {
    widget.getPosition?.(ms => {
      if (Number.isFinite(ms)) onPosition(ms);
    });
  } catch {
    // Ignore detached iframe postMessage races during React unmount.
  }
}

/**
 * Attaches the SoundCloud Widget API to a mounted iframe and detaches safely on unmount
 * even when React 19 runs passive effect cleanups after DOM node removal.
 */
export function attachSoundCloudWidget({
  iframe,
  resumePositionMs = 0,
  shouldPlayOnReady = false,
  onWidgetReady,
  onPlayingChange,
  onPositionChange,
}: SoundCloudBindingOptions): () => void {
  let cancelled = false;
  let widget: SoundCloudWidget | undefined;
  let boundEvents: Record<string, string> = {};

  void loadSoundCloudWidgetApi()
    .then(SC => {
      if (cancelled || !isFrameLive(iframe)) return;
      widget = SC.Widget(iframe);
      boundEvents = SC.Widget.Events ?? {};
      onWidgetReady?.(widget);

      const onReady = () => {
        if (cancelled || !widget || !isFrameLive(iframe)) return;
        try {
          if (resumePositionMs > 0) {
            widget.seekTo(resumePositionMs);
          }
          if (shouldPlayOnReady) {
            widget.play();
          }
        } catch {
          // Ignore postMessage race if frame navigated mid-ready.
        }
      };

      const onPlay = () => {
        if (!cancelled) onPlayingChange?.(true);
      };

      const onProgress = (payload?: SoundCloudProgressPayload) => {
        if (
          !cancelled &&
          payload &&
          typeof payload.currentPosition === "number" &&
          Number.isFinite(payload.currentPosition)
        ) {
          onPositionChange?.(payload.currentPosition);
        }
      };

      const onPauseOrEnd = () => {
        if (cancelled) return;
        safeReadSoundCloudPosition(iframe, widget, ms => {
          if (!cancelled) onPositionChange?.(ms);
        });
        onPlayingChange?.(false);
      };

      if (boundEvents.READY) widget.bind(boundEvents.READY, onReady);
      if (boundEvents.PLAY) widget.bind(boundEvents.PLAY, onPlay);
      if (boundEvents.PLAY_PROGRESS)
        widget.bind(boundEvents.PLAY_PROGRESS, onProgress);
      if (boundEvents.PAUSE) widget.bind(boundEvents.PAUSE, onPauseOrEnd);
      if (boundEvents.FINISH) widget.bind(boundEvents.FINISH, onPauseOrEnd);
      if (boundEvents.ERROR) widget.bind(boundEvents.ERROR, onPauseOrEnd);
    })
    .catch(() => {
      // Keep the embedded iframe usable even if the Widget API script fails to load.
    });

  return () => {
    cancelled = true;
    if (!widget || !isFrameLive(iframe)) return;
    try {
      for (const eventName of [
        boundEvents.READY,
        boundEvents.PLAY,
        boundEvents.PLAY_PROGRESS,
        boundEvents.PAUSE,
        boundEvents.FINISH,
        boundEvents.ERROR,
      ]) {
        if (eventName) widget.unbind(eventName);
      }
    } catch {
      // SoundCloud api.js throws if contentWindow becomes null during teardown.
    }
  };
}
