import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Glyph, type GlyphName } from "@/components/GlyphRule";

/** Core set in sheet order: a page begins at the Sun and ends at The Monolith. */
const WAYPOINTS: GlyphName[] = [
  "sun",
  "moon",
  "human",
  "place",
  "journey",
  "connection",
  "time",
  "memory",
  "portal",
  "monolith",
];

/** Where the fire stands before any scrolling, and each etching's height, in % of the viewport. */
const FRONT_START = 8;
const FIRST_MARK = 14;
const LAST_MARK = 88;
const markPosition = (index: number) =>
  FIRST_MARK + (index * (LAST_MARK - FIRST_MARK)) / (WAYPOINTS.length - 1);

/**
 * Far-edge light seam. The line burns down the page as it scrolls, and each
 * carved etching catches fire as the front passes it. Decorative, wide screens only.
 */
export default function EdgeSeam() {
  const ref = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  useEffect(() => {
    const seam = ref.current;
    if (!seam) return;
    const wideScreen = window.matchMedia("(min-width: 1280px)");
    const marks = Array.from(
      seam.querySelectorAll<HTMLElement>(".edge-seam-mark")
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      const front = FRONT_START + progress * (100 - FRONT_START);
      seam.style.setProperty("--seam-progress", progress.toFixed(4));
      seam.style.setProperty("--seam-front", `${front.toFixed(2)}%`);
      marks.forEach((mark, index) => {
        mark.classList.toggle("is-lit", front >= markPosition(index));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const detach = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    const syncViewport = () => {
      detach();
      if (!wideScreen.matches) return;
      update();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    };
    syncViewport();
    wideScreen.addEventListener("change", syncViewport);
    return () => {
      detach();
      wideScreen.removeEventListener("change", syncViewport);
    };
  }, [location]);

  return (
    <div ref={ref} className="edge-seam" aria-hidden="true">
      <div className="edge-seam-groove" />
      <div className="edge-seam-fire" />
      <div className="edge-seam-front" />
      {WAYPOINTS.map((name, index) => (
        <span
          key={name}
          className="edge-seam-mark"
          style={{ top: `${markPosition(index)}%` }}
        >
          <Glyph name={name} size={13} />
        </span>
      ))}
      <div className="edge-seam-pool" />
    </div>
  );
}
