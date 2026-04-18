import type { ScheduledEvent } from "@shared/events/types";

/**
 * Canonical brand color source of truth.
 * CSS mirrors in `styles/theme.css` must match — keep them in sync.
 */

// Series accents — data-driven (badges, prices, hover glows, borders).
export const MONOLITH_ORANGE = "#E05A3A";
export const SUN_SETS_GOLD = "#E8B86D";
export const UNTOLD_CYAN = "#22D3EE";

// Atmospheric / scene tones (surface glows, gradients — not data accents).
export const UNTOLD_VIOLET = "#8B5CF6";

// Cross-brand signals (not series-specific).
export const LIVE_RED = "#FF3333";

// Deep series backgrounds.
export const SUN_SETS_DEEP = "#2C1810";
export const UNTOLD_DEEP = "#06060F";

export const SERIES_COLORS: Record<ScheduledEvent["series"], string> = {
  "chasing-sunsets": SUN_SETS_GOLD,
  "untold-story": UNTOLD_CYAN,
  "monolith-project": MONOLITH_ORANGE,
};

/** Sun(Sets) Radio is a global extension of Sun(Sets) — same gold. */
export const RADIO_ACCENT = SUN_SETS_GOLD;
