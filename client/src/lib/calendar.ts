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

export function buildEventCalendarFile(
  event: ScheduledEvent,
  generatedAt = new Date()
) {
  const dateLines = (() => {
    if (event.startsAt) {
      const { start, end } = getEventWindow(event);
      if (!start || !end) return null;
      return [
        `DTSTART;TZID=America/Chicago:${formatIcsChicago(start)}`,
        `DTEND;TZID=America/Chicago:${formatIcsChicago(end)}`,
      ];
    }

    const dateParts = parseDateLabel(event.date);
    if (!dateParts) return null;
    return [
      `DTSTART;VALUE=DATE:${formatIcsDate(dateParts)}`,
      `DTEND;VALUE=DATE:${formatIcsDate(getNextDate(dateParts))}`,
    ];
  })();

  if (!dateLines) return null;

  const description = [
    event.description || event.experienceIntro || "The Monolith Project Event",
    event.lineup ? `Lineup: ${event.lineup}` : null,
    !event.startsAt && event.time ? `Time: ${event.time}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  const eventPath = `/events/${event.slug || event.id}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//The Monolith Project//Events//EN",
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(event.id)}@monolithproject.com`,
    `DTSTAMP:${formatIcsUtc(generatedAt)}`,
    ...dateLines,
    `SUMMARY:${escapeIcsText(event.headline || event.title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(`${event.venue} — ${event.location}`)}`,
    `URL:https://monolithproject.com${eventPath}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
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
