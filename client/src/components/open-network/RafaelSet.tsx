import { useEffect, useLayoutEffect, useRef, useState } from "react";
import cues from "@/data/openNetworkCues.json";

const RECORDING =
  "https://soundcloud.com/rawcutstv/brunello-b2b-rafael-february";
const COVER = "/media/open-network/rafael-brunello-rawcuts.webp";
const SET_NAME = "Rafael B2B Brunello — Santa Monica Pier | RAW CUTS";
type SoundWidget = {
  bind: (event: string, callback: () => void) => void;
  unbind: (event: string) => void;
  play: () => void;
  pause: () => void;
  seekTo: (milliseconds: number) => void;
};
type SoundCloudAPI = {
  Widget: ((frame: HTMLIFrameElement) => SoundWidget) & {
    Events: Record<string, string>;
  };
};
type SoundCloudWindow = Window & { SC?: SoundCloudAPI };
let apiPromise: Promise<SoundCloudAPI> | undefined;
function loadSoundCloud() {
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

function SetPlayer({
  seconds,
  requestId,
  onStatus,
  onError,
}: {
  seconds: number;
  requestId: number;
  onStatus: (message: string) => void;
  onError: (message: string) => void;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<SoundWidget | null>(null);
  const ready = useRef(false);
  const pendingSeconds = useRef(seconds);
  useEffect(() => {
    pendingSeconds.current = seconds;
    if (ready.current && widgetRef.current) {
      widgetRef.current.seekTo(seconds * 1000);
      widgetRef.current.play();
    }
  }, [seconds, requestId]);
  // The widget API requires a connected iframe during unbind/pause. A layout
  // cleanup runs before React removes the iframe, including on route changes.
  useLayoutEffect(() => {
    let disposed = false;
    let widget: SoundWidget | undefined;
    let eventNames: string[] = [];
    let timer: number | undefined;
    onStatus("Connecting to the RAW CUTS recording…");
    function fail(message: string) {
      if (disposed) return;
      window.clearTimeout(timer);
      onError(message);
    }
    loadSoundCloud()
      .then(api => {
        if (disposed || !mount.current) return;
        const frame = document.createElement("iframe");
        frame.title = SET_NAME + " audio player";
        frame.src =
          "https://w.soundcloud.com/player/?" +
          new URLSearchParams({
            url: RECORDING,
            auto_play: "true",
            visual: "false",
            color: "#d8b77e",
            show_artwork: "false",
            hide_related: "true",
            show_comments: "false",
            show_user: "true",
            show_reposts: "false",
            show_teaser: "false",
            buying: "false",
            sharing: "false",
            download: "false",
          });
        frame.allow = "autoplay";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        mount.current.replaceChildren(frame);
        widget = api.Widget(frame);
        widgetRef.current = widget;
        timer = window.setTimeout(
          () =>
            fail("The recording is taking too long to connect. Please retry."),
          16000
        );
        function bind(name: string, callback: () => void) {
          const event = api.Widget.Events[name];
          eventNames.push(event);
          widget!.bind(event, () => {
            if (!disposed) callback();
          });
        }
        bind("READY", () => {
          window.clearTimeout(timer);
          ready.current = true;
          onStatus("Ready · press play in the player if needed.");
          if (pendingSeconds.current)
            widget!.seekTo(pendingSeconds.current * 1000);
          widget!.play();
        });
        bind("PLAY", () =>
          onStatus("Now playing · Rafael B2B Brunello at Santa Monica Pier")
        );
        bind("PAUSE", () => onStatus("Paused · Rafael B2B Brunello"));
        bind("FINISH", () =>
          onStatus("Set finished. Follow the next connection.")
        );
        bind("ERROR", () =>
          fail("This recording could not play here right now. Please retry.")
        );
      })
      .catch(error => fail(error.message));
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      eventNames.forEach(event => widget?.unbind(event));
      widget?.pause();
      widgetRef.current = null;
      ready.current = false;
    };
  }, [onStatus, onError]);
  return <div className="featured-audio-player" ref={mount} />;
}

export default function RafaelSet({
  active,
  onPlay,
  onStop,
}: {
  active: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const [request, setRequest] = useState({ seconds: 0, version: 0 });
  const [status, setStatus] = useState(
    "Press play, or choose a moment from the tracklist."
  );
  const [error, setError] = useState("");
  const poster = useRef<HTMLButtonElement>(null);
  const originalUrl =
    RECORDING +
    (active && request.seconds
      ? `#t=${Math.floor(request.seconds / 60)}:${String(request.seconds % 60).padStart(2, "0")}`
      : "");
  function play(seconds = 0) {
    setError("");
    setRequest(value => ({ seconds, version: value.version + 1 }));
    onPlay();
  }
  return (
    <section
      className="inside-frequency paper section-pad"
      id="inside-set"
      aria-labelledby="inside-frequency-title"
    >
      <div className="section-kicker">
        <span className="eyebrow">OPEN RADIO / GO INSIDE THE SET</span>
        <span>SELECTOR / 001</span>
      </div>
      <div className="inside-frequency-heading">
        <h2 className="section-title" id="inside-frequency-title">
          Hear the set.
          <br />
          <em>Follow the story.</em>
        </h2>
        <p>
          Rafael B2B Brunello.
          <br />
          Santa Monica Pier, through the lens of RAW CUTS.
        </p>
      </div>
      <div className="rafael-desk featured-audio-desk">
        <div className="rafael-film">
          <div className="rafael-stage">
            <img
              className="featured-set-cover"
              src={COVER}
              alt="Rafael B2B Brunello at Santa Monica Pier — original RAW CUTS cover"
              width={500}
              height={500}
              loading="lazy"
            />
            {!active && (
              <button
                ref={poster}
                className="rafael-poster"
                aria-label={`Play ${SET_NAME}`}
                onClick={() => play()}
              >
                <span className="rafael-play-circle" aria-hidden="true">
                  ▶
                </span>
                <span className="rafael-poster-label">
                  PLAY THE FULL SET <span aria-hidden="true">↗</span>
                </span>
              </button>
            )}
          </div>
          {active &&
            (error ? (
              <div className="featured-audio-error" role="alert">
                <p>{error}</p>
                <button
                  className="button cream"
                  onClick={() => play(request.seconds)}
                >
                  Retry the player ↻
                </button>
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">
                  Original recording ↗
                </a>
              </div>
            ) : (
              <SetPlayer
                seconds={request.seconds}
                requestId={request.version}
                onStatus={setStatus}
                onError={setError}
              />
            ))}
          <div className="rafael-meta">
            <div>
              <p className="eyebrow">THE ARTISTS / THE RECORDING</p>
              <h3>Rafael B2B Brunello</h3>
              <p>
                Santa Monica Pier · RAW CUTS <span>· 1:59:17</span>
              </p>
            </div>
            <a href={originalUrl} target="_blank" rel="noopener noreferrer">
              Original recording ↗
            </a>
          </div>
          <div className="rafael-controls">
            <p role="status">
              {active
                ? error
                  ? "The player could not connect. Please retry."
                  : status
                : "Press play, or choose a moment from the tracklist."}
            </p>
            {active && (
              <button
                aria-label="Stop featured set playback"
                onClick={() => {
                  onStop();
                  requestAnimationFrame(() => poster.current?.focus());
                }}
              >
                Stop playback ■
              </button>
            )}
          </div>
          <p className="rafael-credit">
            Recording &amp; artwork / RAW CUTS · Official SoundCloud recording
          </p>
        </div>
        <aside
          className="rafael-tracklist"
          aria-label="Rafael and Brunello partial tracklist"
        >
          <div className="rafael-tracklist-heading">
            <h3>Inside the mix</h3>
            <span>11 IDENTIFIED MOMENTS</span>
          </div>
          <ol aria-label="Featured set tracklist cue points">
            {cues.map(cue => (
              <li key={cue.seconds}>
                <button
                  className="rafael-cue"
                  aria-current={
                    active && request.seconds === cue.seconds
                      ? "true"
                      : undefined
                  }
                  aria-label={`Play ${cue.artist} — ${cue.title} at ${cue.time}`}
                  onClick={() => play(cue.seconds)}
                >
                  <span className="cue-time">{cue.time}</span>
                  <span className="cue-track">
                    <strong>{cue.title}</strong>
                    <span>{cue.artist}</span>
                  </span>
                  <span className="cue-arrow" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="rafael-tracklist-credit">
            <a
              href="https://www.mixid.fm/mixes/rafael-b2b-brunello-on-the-santa-monica-pier-raw-cuts"
              target="_blank"
              rel="noopener noreferrer"
            >
              Partial tracklist / identifications via MixID ↗
            </a>
            <span>
              Community identifications. Unidentified passages are not listed.
            </span>
          </div>
        </aside>
      </div>
      <div className="set-to-network">
        <span>
          THE SET <i>→</i> THE ARTISTS <i>→</i> SANTA MONICA
        </span>
        <p>This is where the network begins.</p>
        <a href="#network">Explore the three pillars ↓</a>
      </div>
    </section>
  );
}
