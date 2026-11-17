import type { ReactNode } from "react";

/**
 * Monolith Glyph Language v1.0 — core set plus the sound & frequency family.
 * Single-stroke marks on a 24px grid, tinted by currentColor. Names follow the
 * owner's glyph sheet so each mark keeps its meaning wherever it is used.
 */
const GLYPHS = {
  // Core set
  sun: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v20M2 12h20" />
    </>
  ),
  moon: <path d="M16.5 4.5a8 8 0 1 0 0 15 6.5 6.5 0 0 1 0-15z" />,
  human: (
    <>
      <circle cx="12" cy="4" r="1.8" />
      <path d="M7 8.5h10M12 8.5L6.5 22M12 8.5L17.5 22M8.4 17h7.2M12 8.5V17" />
    </>
  ),
  place: (
    <>
      <path d="M12 5l6 7-6 7-6-7z" />
      <path d="M12 9l2.6 3-2.6 3-2.6-3z" />
      <path d="M12 2v3M12 19v3" />
    </>
  ),
  journey: (
    <path d="M12 22V3M6.5 8.5L12 3l5.5 5.5M6.5 13.5L12 8l5.5 5.5M6.5 18.5L12 13l5.5 5.5" />
  ),
  connection: (
    <>
      <path d="M12 2v20M5 5l14 14M19 5L5 19" />
      <path d="M12 8.5l3.5 3.5-3.5 3.5L8.5 12z" />
    </>
  ),
  time: (
    <path d="M12 2v20M3 12h3M18 12h3M9.2 7.3a5.5 5.5 0 0 0 0 9.4M14.8 7.3a5.5 5.5 0 0 1 0 9.4" />
  ),
  memory: <path d="M12 2l5 5L7 17l5 5 5-5L7 7z" />,
  portal: <path d="M7 22V3h10v19M12 7v11" />,
  monolith: (
    <>
      <rect x="6" y="2" width="4.75" height="20" />
      <rect x="13.25" y="2" width="4.75" height="20" />
      <path d="M8.5 12h7M12 10v4" />
    </>
  ),
  // Sound & frequency family
  sound: <path d="M3 12h0M6 9v6M9 6v12M12 3v18M15 7v10M18 10v4M21 12h0" />,
  frequency: <path d="M12 2v20M7 6.5h10M5 10.5h14M8 14.5h8M6 18.5h12" />,
  music: <path d="M5 4l14 16M19 4L5 20M14.5 2.5l5 5" />,
  rhythm: <path d="M6 6v12M10 4v16M14 8v8M18 6v12M3 12h18" />,
  beat: <path d="M12 2v20M6 9h12M8 14h8" />,
  bass: <path d="M5 4h14l-7 9zM8 14h8l-4 7z" />,
  harmony: (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </>
  ),
  resonance: (
    <path d="M4 12a8 8 0 0 1 16 0M7 12a5 5 0 0 1 10 0M9.8 12a2.2 2.2 0 0 1 4.4 0M12 12v10" />
  ),
  silence: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12h0" />
    </>
  ),
  transmission: <path d="M3 12h18M15 6l6 6-6 6" />,
  receive: <path d="M21 12H3M9 6l-6 6 6 6" />,
  live: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v20" />
    </>
  ),
  voice: (
    <path d="M5 7c2.3-3 4.7 3 7 0s4.7 3 7 0M5 12c2.3-3 4.7 3 7 0s4.7 3 7 0M5 17c2.3-3 4.7 3 7 0s4.7 3 7 0" />
  ),
} satisfies Record<string, ReactNode>;

export type GlyphName = keyof typeof GLYPHS;

export function Glyph({ name, size = 18 }: { name: GlyphName; size?: number }) {
  return (
    <svg
      className="monolith-glyph"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name]}
    </svg>
  );
}

/** Core set in sheet order, with The Monolith at the centre. */
const DEFAULT_SEQUENCE: GlyphName[] = [
  "sun",
  "moon",
  "human",
  "place",
  "monolith",
  "journey",
  "connection",
  "time",
  "memory",
];

/** A quiet engraved divider: hairline, a short run of glyphs, hairline. */
export default function GlyphRule({
  glyphs = DEFAULT_SEQUENCE,
}: {
  glyphs?: GlyphName[];
}) {
  return (
    <div className="glyph-rule" aria-hidden="true">
      {glyphs.map((name, index) => (
        <Glyph
          key={`${name}-${index}`}
          name={name}
          size={name === "monolith" ? 28 : 18}
        />
      ))}
    </div>
  );
}
