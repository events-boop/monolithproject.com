import { useState, useEffect } from "react";

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

// Background: cream → warm sand → amber → deep rust → near-black
const BG: Stop[] = [
  { at: 0.0, rgb: hex2rgb("#FBF5ED") },
  { at: 0.18, rgb: hex2rgb("#FBF5ED") },
  { at: 0.42, rgb: hex2rgb("#F0D8B8") },
  { at: 0.62, rgb: hex2rgb("#C4805A") },
  { at: 0.82, rgb: hex2rgb("#5C2A18") },
  { at: 1.0, rgb: hex2rgb("#1A0E08") },
];

// Text: dark → light (flips for contrast as bg darkens)
const TEXT: Stop[] = [
  { at: 0.0, rgb: hex2rgb("#2C1810") },
  { at: 0.48, rgb: hex2rgb("#2C1810") },
  { at: 0.66, rgb: hex2rgb("#FBF5ED") },
  { at: 1.0, rgb: hex2rgb("#FBF5ED") },
];

// Accent: auburn → brightens toward gold in the dark sections
const ACCENT: Stop[] = [
  { at: 0.0, rgb: hex2rgb("#C2703E") },
  { at: 0.55, rgb: hex2rgb("#D4884E") },
  { at: 0.8, rgb: hex2rgb("#E8B86D") },
  { at: 1.0, rgb: hex2rgb("#E8B86D") },
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

export default function useScrollSunset(): SunsetPalette {
  const [palette, setPalette] = useState<SunsetPalette>({
    bg: "#FBF5ED",
    text: "#2C1810",
    accent: "#C2703E",
    warmGold: "#E8B86D",
    glass: "#FFFFFF",
    progress: 0,
  });

  useEffect(() => {
    let raf = 0;
    let prev = -1;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // skip if scroll barely moved (< 0.3%)
      if (Math.abs(t - prev) < 0.003) {
        raf = 0;
        return;
      }
      prev = t;

      setPalette({
        bg: sample(BG, t),
        text: sample(TEXT, t),
        accent: sample(ACCENT, t),
        warmGold: "#E8B86D",
        glass: sample(GLASS, t),
        progress: t,
      });
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    tick(); // initialise at current position
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return palette;
}
