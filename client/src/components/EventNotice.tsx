import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  currentSunsets,
  sunsetsNeedsUpdate,
  sunsetsUpdatedLabel,
} from "@shared/events/sunsets-current";

export default function EventNotice() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [location] = useLocation();
  useEffect(() => {
    if (!sunsetsNeedsUpdate) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const source = "/event-notice.js";
    import(/* @vite-ignore */ source).then(module => {
      if (!disposed) cleanup = module.mountEventNotice(dialog.current);
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [location]);
  if (!sunsetsNeedsUpdate) return null;
  return (
    <>
      <link rel="stylesheet" href="/event-notice.css" />
      <dialog
        ref={dialog}
        className="event-notice"
        aria-labelledby="event-notice-title"
        data-revision={currentSunsets.updatedAt}
        data-auto-open={location === "/" ? "true" : "false"}
      >
        <button
          type="button"
          className="notice-close"
          data-notice-close
          aria-label="Close event update"
        >
          ×
        </button>
        <p className="notice-kicker">The Monolith Project · Official update</p>
        <h2 id="event-notice-title">
          Sun(Sets) III
          <br />
          Postponed due to weather.
        </h2>
        <p className="notice-artists">JOEZI × MASSUMA</p>
        {currentSunsets.statusParagraphs
          .filter((_, index) => [0, 2, 3].includes(index))
          .map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 1 ? "notice-ticket" : undefined}
            >
              {paragraph}
            </p>
          ))}
        <p className="notice-signature">— The Monolith Project</p>
        <time dateTime={currentSunsets.updatedAt}>
          Updated {sunsetsUpdatedLabel} · Chicago
        </time>
        <div className="notice-actions">
          <a href="/sunsets#event-update" data-notice-link>
            Full event update ↗
          </a>
          <a href="mailto:events@monolithproject.com">Contact the team</a>
        </div>
      </dialog>
    </>
  );
}
