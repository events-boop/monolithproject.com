import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
export function renderSunsetsPage(event, template) {
  const escape = value =>
    String(value).replace(
      /[&<>"']/g,
      c =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]
    );
  const fmt = (date, options) =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      ...options,
    }).format(new Date(date));
  if (
    ![
      "EventScheduled",
      "EventPostponed",
      "EventRescheduled",
      "EventCancelled",
    ].includes(event.status)
  )
    throw new Error("Unsupported event status");
  if (event.status !== "EventScheduled" && !event.statusApproval)
    throw new Error("A named owner approval is required for a status change");
  if (event.status !== "EventScheduled" && event.salesEnabled)
    throw new Error(
      "Disable sales until ticket instructions for the status change are approved"
    );
  if (
    !Number.isFinite(Date.parse(event.updatedAt)) ||
    Date.parse(event.end) <= Date.parse(event.start)
  )
    throw new Error("Invalid event dates");
  // The artwork and venue photography contain location/date information too. A change
  // must include replacement assets/copy, not silently ship the previous poster.
  if (
    event.artworkApprovedFor.start !== event.start ||
    event.artworkApprovedFor.venueName !== event.venueName
  )
    throw new Error(
      "Review artwork, venue photos and copy for the revised date/location before publishing"
    );
  const startTime = fmt(event.start, {
    hour: "numeric",
    minute: new Date(event.start).getUTCMinutes() ? "2-digit" : undefined,
  });
  const endTime = fmt(event.end, {
    hour: "numeric",
    minute: new Date(event.end).getUTCMinutes() ? "2-digit" : undefined,
  });
  const monthDay = fmt(event.start, { month: "long", day: "numeric" });
  const json = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.name,
    startDate: event.start,
    endDate: event.end,
    eventStatus: "https://schema.org/" + event.status,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: event.canonical,
    image: event.socialImage,
    location: {
      "@type": "Place",
      name: event.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.streetAddress,
        addressLocality: "Chicago",
        addressRegion: "IL",
        postalCode: "60611",
        addressCountry: "US",
      },
    },
    performer: [...event.headliners, ...event.support].map(name => ({
      "@type": "MusicGroup",
      name,
    })),
    organizer: {
      "@type": "Organization",
      name: "The Monolith Project",
      url: "https://monolithproject.com",
    },
  };
  let scheduleHtml =
    '<p class="lineup-names">' +
    event.headliners.map(escape).join(' <span aria-hidden="true">/</span> ') +
    '</p><p class="support-names"><strong>WITH</strong>' +
    event.support
      .map(name => '<span class="support-act">' + escape(name) + "</span>")
      .join(" · ") +
    "</p>";
  if (event.schedule.length) {
    let previous = Date.parse(event.start);
    scheduleHtml =
      '<dl class="set-times-list">' +
      event.schedule
        .map(slot => {
          if (
            ![...event.headliners, ...event.support].includes(slot.artist) ||
            Date.parse(slot.start) < previous ||
            Date.parse(slot.end) <= Date.parse(slot.start) ||
            Date.parse(slot.end) > Date.parse(event.end)
          )
            throw new Error("Invalid or overlapping approved schedule");
          previous = Date.parse(slot.end);
          return (
            "<div><dt>" +
            escape(slot.artist) +
            "</dt><dd>" +
            escape(
              fmt(slot.start, { hour: "numeric", minute: "2-digit" }) +
                "–" +
                fmt(slot.end, { hour: "numeric", minute: "2-digit" })
            ) +
            "</dd></div>"
          );
        })
        .join("") +
      "</dl>";
  }
  const statusDisplay = {
    EventScheduled: {
      statusTone: "green",
      statusLabel: "EVENT SCHEDULED",
      statusShortLabel: "Scheduled",
    },
    EventPostponed: {
      statusTone: "amber",
      statusLabel: "EVENT POSTPONED",
      statusShortLabel: "Postponed",
    },
    EventRescheduled: {
      statusTone: "amber",
      statusLabel: "DATE UPDATED",
      statusShortLabel: "Date updated",
    },
    EventCancelled: {
      statusTone: "red",
      statusLabel: "EVENT CANCELLED",
      statusShortLabel: "Cancelled",
    },
  }[event.status];
  const raw = {
    eventJson: JSON.stringify(json).replace(/</g, "\\u003c"),
    scheduleHtml,
    heroArtwork: event.status === "EventScheduled" ? event.heroArtwork : "",
    venueHeading: event.venueHeading,
  };
  const values = {
    ...event,
    ...statusDisplay,
    monthDay,
    monthDayUpper: monthDay.toUpperCase(),
    shortDate: fmt(event.start, {
      weekday: "short",
      month: "long",
      day: "numeric",
    }),
    longDate: fmt(event.start, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    fullDate: fmt(event.start, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    hours: startTime + "–" + endTime,
    startTime,
    endTime,
    updatedLabel:
      fmt(event.updatedAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }) + " (Chicago)",
    dockLabel:
      fmt(event.start, { month: "short", day: "numeric" }).toUpperCase() +
      " · " +
      event.venueName,
    ticketLabel: event.salesEnabled
      ? "Official tickets via AllEvents"
      : "Read the current ticket-holder notice",
    ticketUrl: event.salesEnabled ? event.ticketUrl : "#event-update",
  };
  let html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key in raw) return raw[key];
    if (!(key in values)) throw new Error("Unknown event field: " + key);
    return escape(values[key]);
  });
  // Keep an approved urgent update first in both visual and screen-reader order.
  if (event.status !== "EventScheduled") {
    const notice = html.match(
      /<!-- status-panel:start -->[\s\S]*?<!-- status-panel:end -->/
    );
    if (!notice) throw new Error("Missing event status panel");
    html = html
      .replace(notice[0], "")
      .replace('<main id="main">', '<main id="main">\n' + notice[0]);
  }
  if (!event.salesEnabled) {
    html = html.replace(
      /<a\b[^>]*class="[^"]*ticket-link[^"]*"[^>]*>[\s\S]*?<\/a>/g,
      '<a class="button button-primary" href="#event-update">READ EVENT UPDATE</a>'
    );
  }
  if (event.status === "EventPostponed") {
    html = html
      .replace(
        '<p class="status-summary">',
        '<p class="status-summary">Originally '
      )
      .replace(
        "CDT · Check here before you travel.",
        "CDT · Postponed. New date to be announced."
      );

    html = html.replace("<body", '<body data-event-status="EventPostponed"');
    html = html.replace(
      '<div class="status-bottom">',
      '<h2 class="postponement-heading">' +
        escape(event.statusHeading) +
        '</h2><p class="postponement-copy">' +
        escape(event.statusMessage) +
        '</p><div class="status-bottom">'
    );
    html = html
      .replace(
        '<span class="fact-label">WHEN</span>',
        '<span class="fact-label">ORIGINAL DATE · POSTPONED</span>'
      )
      .replace(
        '<span class="fact-label">WHERE</span>',
        '<span class="fact-label">ORIGINAL VENUE</span>'
      );
    html = html
      .replace("EVENT STARTS<strong>", "ORIGINAL START<strong>")
      .replace("EVENT ENDS<strong>", "ORIGINAL END<strong>");
    html = html
      .replace("02 / MEET US BY THE WATER", "02 / THE ORIGINAL VENUE")
      .replace("Get directions", "Original venue location");
    html = html.replace(
      /<p>Saturday, [\s\S]*?Plan your arrival around any entry-time conditions on your ticket\.<\/p>/,
      "<p>The September 19 show is postponed. A new date and hours have not yet been announced. Read the official event update before making travel plans.</p>"
    );
    html = html.replace(
      /<a href="\/sunsets\/assets\/chasing-sunsets-iii.ics"[\s\S]*?<\/a>/,
      '<a href="#event-update" class="text-link">Read the postponement update ↗</a>'
    );
    html = html.replace(
      "Purchase through the official AllEvents listing. Have the mobile QR ticket from your confirmation ready to scan on arrival. Check your selected ticket for any arrival-time requirement. If you cannot locate your confirmation, check your spam folder and contact the team with your booking details.",
      "The show is postponed and ticket sales on this page are paused. Keep your original booking confirmation. Ticket-holder instructions will be published in the official update; contact events@monolithproject.com with a booking question."
    );
    html = html.replace(
      "GA and VIP links open the same official listing. Select an available tier at checkout and review its inclusions before paying. Table enquiries open your email app; availability and pricing are confirmed by the team.",
      "Ticket sales are paused while updated arrangements are confirmed. For existing GA, VIP or table bookings, keep your confirmation and read the official update."
    );
    html = html.replace(
      "Check the official ticket listing for current VIP passes and inclusions.",
      "For an existing VIP booking, keep your confirmation and check the official update."
    );
    html = html.replace(
      "If the show cannot take place, ticket holders will be offered admission to a rescheduled show or credit toward a future event.",
      "Specific arrangements for this postponement have not yet been announced. Check the official update and the terms attached to your booking."
    );
    html = html.replace(
      "We finish<br><em>together.</em>",
      "Stay close.<br><em>Updates here.</em>"
    );
    html = html.replace(
      '<aside class="booking-dock"',
      '<aside class="event-status-float" aria-label="Important event update"><div><strong>POSTPONED · JOEZI × MASSUMA</strong><span>September 19 show · New date to be announced</span><time datetime="' +
        escape(event.updatedAt) +
        '">Updated ' +
        escape(values.updatedLabel) +
        '</time></div><a href="#event-update">Read update ↗</a></aside><aside class="booking-dock"'
    );
  }
  if (event.status === "EventPostponed" && event.statusParagraphs) {
    const paragraphs = event.statusParagraphs
      .map(
        (text, index) =>
          "<p" +
          (index === 2 ? ' class="notice-ticket"' : "") +
          ">" +
          escape(text) +
          "</p>"
      )
      .join("");
    html = html.replace(
      /<div class="event-info-notice" id="event-update">[\s\S]*?<\/div>/,
      '<div class="event-info-notice" id="event-update"><strong>' +
        escape(event.statusHeading) +
        "</strong>" +
        paragraphs +
        '<p>Keep your booking confirmation. For individual booking questions, email <a href="mailto:events@monolithproject.com">events@monolithproject.com</a>.</p><time datetime="' +
        escape(event.updatedAt) +
        '">Updated ' +
        escape(values.updatedLabel) +
        "</time></div>"
    );
    html = html.replace(
      "Specific arrangements for this postponement have not yet been announced. Check the official update and the terms attached to your booking.",
      escape(event.ticketHolderMessage)
    );
    html = html.replace(
      "If a date change is confirmed, check the official notice for ticket-holder instructions and review the terms attached to your booking. A change of date alone does not establish refund or transfer rights. Contact events@monolithproject.com with a booking question.",
      escape(event.ticketHolderMessage) +
        " Keep your booking confirmation. Contact events@monolithproject.com with a booking question."
    );
    const popupParagraphs = event.statusParagraphs
      .filter((_, index) => [0, 2, 3].includes(index))
      .map(
        (text, index) =>
          "<p" +
          (index === 1 ? ' class="notice-ticket"' : "") +
          ">" +
          escape(text) +
          "</p>"
      )
      .join("");
    html = html.replace(
      "</head>",
      '<link rel="stylesheet" href="/event-notice.css"></head>'
    );
    html = html.replace(
      "</body>",
      '<dialog class="event-notice" aria-labelledby="event-notice-title" data-standalone-notice data-auto-open="true" data-revision="' +
        escape(event.updatedAt) +
        '"><button type="button" class="notice-close" data-notice-close aria-label="Close event update">×</button><p class="notice-kicker">The Monolith Project · Official update</p><h2 id="event-notice-title">Sun(Sets) III<br>Postponed due to weather.</h2><p class="notice-artists">JOEZI × MASSUMA</p>' +
        popupParagraphs +
        '<p class="notice-signature">— The Monolith Project</p><time datetime="' +
        escape(event.updatedAt) +
        '">Updated ' +
        escape(values.updatedLabel) +
        '</time><div class="notice-actions"><a href="#event-update" data-notice-link>Full event update ↗</a><a href="mailto:events@monolithproject.com">Contact the team</a></div></dialog><script type="module" src="/event-notice.js"></script></body>'
    );
    html = html.replace(
      '<a href="#event-update">Read update ↗</a>',
      '<a href="#event-update" data-open-event-notice>Read update ↗</a>'
    );
  }
  return html.replace(/[ \t]+$/gm, "");
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const event = JSON.parse(
    readFileSync("shared/events/sunsets-page.json", "utf8")
  );
  const html = renderSunsetsPage(
    event,
    readFileSync("scripts/templates/sunsets.html", "utf8")
  );
  writeFileSync("client/public/sunsets/index.html", html);
  const utc = value =>
    new Date(value)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z/, "Z");
  const icsEscape = value =>
    value
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Monolith Project//Sunsets//EN",
    "BEGIN:VEVENT",
    "UID:css-sep19@monolithproject.com",
    "DTSTAMP:" + utc(event.updatedAt),
    "DTSTART:" + utc(event.start),
    "DTEND:" + utc(event.end),
    "SUMMARY:" + icsEscape(event.name),
    "LOCATION:" + icsEscape(event.venueName + ", " + event.address),
    "URL:" + event.canonical,
    "STATUS:" +
      (event.status === "EventCancelled"
        ? "CANCELLED"
        : event.status === "EventPostponed"
          ? "TENTATIVE"
          : "CONFIRMED"),
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  writeFileSync("client/public/sunsets/assets/chasing-sunsets-iii.ics", ics);
  console.log(
    "Rendered Sunsets HTML, metadata, structured data and calendar from approved event data."
  );
}
