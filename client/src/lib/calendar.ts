import { canAddEventToCalendar } from "./schedulePresentation";
import type { ScheduledEvent } from "@shared/events/types";
import { getEventWindow } from "@/lib/siteExperience";

const MONTH_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatIcsChicago(date: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map(part => [part.type, part.value])
  );

  return `${parts.year}${parts.month}${parts.day}T${parts.hour}${parts.minute}${parts.second}`;
}

function formatIcsUtc(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function parseDateLabel(value: string) {
  const match = value.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) return null;

  const month = MONTH_INDEX[match[1].toLowerCase()];
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (month === undefined || day < 1 || day > 31 || !Number.isFinite(year))
    return null;

  return { year, month, day };
}

function formatIcsDate(parts: { year: number; month: number; day: number }) {
  return `${parts.year}${pad(parts.month + 1)}${pad(parts.day)}`;
}

function getNextDate(parts: { year: number; month: number; day: number }) {
  const date = new Date(Date.UTC(parts.year, parts.month, parts.day + 1));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}

export function escapeIcsText(value?: string | null) {
  return (value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

interface CalendarEventPayload {
  title: string;
  description: string;
  location: string;
  eventUrl: string;
  start?: Date;
  end?: Date;
  dateParts?: { year: number; month: number; day: number };
}

function resolveCalendarEventPayload(
  event: ScheduledEvent
): CalendarEventPayload | null {
  if (!canAddEventToCalendar(event)) return null;

  let start: Date | undefined;
  let end: Date | undefined;
  let dateParts: { year: number; month: number; day: number } | undefined;

  if (event.startsAt) {
    const window = getEventWindow(event);
    if (!window.start || !window.end) return null;
    start = window.start;
    end = window.end;
  } else {
    const parsed = parseDateLabel(event.date);
    if (!parsed) return null;
    dateParts = parsed;
  }

  const description = [
    event.description || event.experienceIntro || "The Monolith Project Event",
    event.lineup ? `Lineup: ${event.lineup}` : null,
    !event.startsAt && event.time ? `Time: ${event.time}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const eventPath = `/events/${event.slug || event.id}`;
  const location = event.venueAddress?.streetAddress
    ? `${event.venue}, ${event.venueAddress.streetAddress} — ${event.location}`
    : `${event.venue} — ${event.location}`;

  return {
    title: event.headline || event.title,
    description,
    location,
    eventUrl: `https://monolithproject.com${eventPath}`,
    start,
    end,
    dateParts,
  };
}

export function buildEventCalendarFile(
  event: ScheduledEvent,
  generatedAt = new Date()
) {
  const payload = resolveCalendarEventPayload(event);
  if (!payload) return null;

  const dateLines =
    payload.start && payload.end
      ? [
          `DTSTART;TZID=America/Chicago:${formatIcsChicago(payload.start)}`,
          `DTEND;TZID=America/Chicago:${formatIcsChicago(payload.end)}`,
        ]
      : payload.dateParts
        ? [
            `DTSTART;VALUE=DATE:${formatIcsDate(payload.dateParts)}`,
            `DTEND;VALUE=DATE:${formatIcsDate(getNextDate(payload.dateParts))}`,
          ]
        : null;

  if (!dateLines) return null;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//The Monolith Project//Events//EN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(event.id)}@monolithproject.com`,
    `DTSTAMP:${formatIcsUtc(generatedAt)}`,
    ...dateLines,
    `SUMMARY:${escapeIcsText(payload.title)}`,
    `DESCRIPTION:${escapeIcsText(payload.description)}`,
    `LOCATION:${escapeIcsText(`${event.venue} — ${event.location}`)}`,
    `URL:${payload.eventUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function buildGoogleCalendarUrl(event: ScheduledEvent): string | null {
  const payload = resolveCalendarEventPayload(event);
  if (!payload) return null;

  const dates =
    payload.start && payload.end
      ? `${formatIcsChicago(payload.start)}/${formatIcsChicago(payload.end)}`
      : payload.dateParts
        ? `${formatIcsDate(payload.dateParts)}/${formatIcsDate(getNextDate(payload.dateParts))}`
        : null;

  if (!dates) return null;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: payload.title,
    dates,
    details: `${payload.description}\n\nEvent details: ${payload.eventUrl}`,
    location: payload.location,
  });

  if (payload.start && payload.end) {
    params.set("ctz", "America/Chicago");
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadEventCalendar(event: ScheduledEvent) {
  const calendarFile = buildEventCalendarFile(event);
  if (!calendarFile) return;

  const blob = new Blob([calendarFile], {
    type: "text/calendar;charset=utf-8",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const fileName = (event.headline || event.title)
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_|_$/g, "");

  link.href = url;
  link.setAttribute("download", `${fileName || "Monolith_Event"}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
