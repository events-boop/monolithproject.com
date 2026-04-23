import type { ScheduledEvent } from "@/data/events";

export type CtaTone =
  | ScheduledEvent["series"]
  | "sunsets-radio"
  | "monolith";

const TONE_CLASS_BY_SERIES: Record<ScheduledEvent["series"], string> = {
  "chasing-sunsets": "cta-series-sunsets",
  "untold-story": "cta-series-untold",
  "monolith-project": "cta-series-monolith",
};

const PILL_CLASS_BY_SERIES: Record<ScheduledEvent["series"], string> = {
  "chasing-sunsets": "btn-pill-sunsets",
  "untold-story": "btn-pill-untold",
  "monolith-project": "btn-pill-monolith",
};

const OUTLINE_PILL_CLASS_BY_SERIES: Record<ScheduledEvent["series"], string> = {
  "chasing-sunsets": "btn-pill-outline btn-pill-outline-sunsets",
  "untold-story": "btn-pill-outline btn-pill-outline-untold",
  "monolith-project": "btn-pill-outline btn-pill-outline-monolith",
};

const TONE_CLASS_BY_TONE: Record<CtaTone, string> = {
  ...TONE_CLASS_BY_SERIES,
  "sunsets-radio": "cta-series-radio",
  monolith: "cta-series-monolith",
};

export function getCtaToneClass(tone?: CtaTone | null) {
  return tone ? TONE_CLASS_BY_TONE[tone] : TONE_CLASS_BY_TONE.monolith;
}

export function getEventCtaToneClass(event?: { series?: ScheduledEvent["series"] } | null) {
  return event?.series ? TONE_CLASS_BY_SERIES[event.series] : TONE_CLASS_BY_TONE.monolith;
}

export function getEventPillToneClass(event?: { series?: ScheduledEvent["series"] } | null) {
  return event?.series ? PILL_CLASS_BY_SERIES[event.series] : "btn-pill-monolith";
}

export function getEventOutlinePillToneClass(event?: { series?: ScheduledEvent["series"] } | null) {
  return event?.series ? OUTLINE_PILL_CLASS_BY_SERIES[event.series] : "btn-pill-outline btn-pill-outline-monolith";
}
