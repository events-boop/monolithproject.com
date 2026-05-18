import { useState, useEffect, useRef } from "react";

/* ── tiny colour math ── */

type RGB = [number, number, number];

const hex2rgb = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
};

const rgb2hex = ([r, g, b]: RGB): string =>
  "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

// smoothstep for silky transitions between stops
const ease = (t: number) => t * t * (3 - 2 * t);

interface Stop {
  at: number;
  rgb: RGB;
}

function sample(stops: Stop[], t: number): string {
  if (t <= stops[0].at) return rgb2hex(stops[0].rgb);
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i],
      b = stops[i + 1];
    if (t <= b.at) {
      return rgb2hex(mix(a.rgb, b.rgb, ease((t - a.at) / (b.at - a.at))));
    }
  }
  return rgb2hex(stops[stops.length - 1].rgb);
}

/* ── colour journeys (scroll 0 → 1) ── */

// Background: off-white → cool mist → teal → deep teal → near-black
const BG: Stop[] = [
  { at: 0.0, rgb: hex2rgb("#FAFAF7") },
  { at: 0.18, rgb: hex2rgb("#FAFAF7") },
  { at: 0.42, rgb: hex2rgb("#E8F7F5") },
  { at: 0.62, rgb: hex2rgb("#52B8B0") },
  { at: 0.82, rgb: hex2rgb("#123E46") },
  { at: 1.0, rgb: hex2rgb("#071014") },
];

// Text: dark → light (flips for contrast as bg darkens)
const TEXT: Stop[] = [
  { at: 0.0, rgb: hex2rgb("#2C1810") },
  { at: 0.48, rgb: hex2rgb("#2C1810") },
  { at: 0.66, rgb: hex2rgb("#FBF5ED") },
  { at: 1.0, rgb: hex2rgb("#FBF5ED") },
];

// Accent: teal → cyan → violet in the dark sections
const ACCENT: Stop[] = [
  { at: 0.0, rgb: hex2rgb("#1F8A8D") },
  { at: 0.55, rgb: hex2rgb("#14B8A6") },
  { at: 0.8, rgb: hex2rgb("#8B5CF6") },
  { at: 1.0, rgb: hex2rgb("#8B5CF6") },
];

// Glass panels: white glass → dark glass
const GLASS: Stop[] = [
  { at: 0.0, rgb: hex2rgb("#FFFFFF") },
  { at: 0.5, rgb: hex2rgb("#FFFFFF") },
  { at: 0.72, rgb: hex2rgb("#3D1E10") },
  { at: 1.0, rgb: hex2rgb("#2A1409") },
];

export interface SunsetPalette {
  bg: string;
  text: string;
  accent: string;
  warmGold: string;
  glass: string;
  progress: number;
}

const INITIAL: SunsetPalette = {
  bg: "var(--sunset-bg, #FAFAF7)",
  text: "var(--sunset-text, #2C1810)",
  accent: "var(--sunset-accent, #1F8A8D)",
  warmGold: "var(--sunset-warmGold, #14B8A6)",
  glass: "var(--sunset-glass, #FFFFFF)",
  progress: 0,
};

export default function useScrollSunset(): SunsetPalette {
  useEffect(() => {
    let rafRef = 0;
    let prevT = -1;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // Update native CSS vars to avoid heavy React state commits on scroll
      if (Math.abs(t - prevT) > 0.001) {
        prevT = t;
        const root = document.documentElement;
        root.style.setProperty("--sunset-bg", sample(BG, t));
        root.style.setProperty("--sunset-text", sample(TEXT, t));
        root.style.setProperty("--sunset-accent", sample(ACCENT, t));
        root.style.setProperty("--sunset-warmGold", "#14B8A6");
        root.style.setProperty("--sunset-glass", sample(GLASS, t));
      }
      rafRef = 0;
    };

    const onScroll = () => {
      if (!rafRef) rafRef = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    tick(); // initialise at current position

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef) cancelAnimationFrame(rafRef);
    };
  }, []);

  return INITIAL;
}
