import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ARTIST_ENTRIES } from "../client/src/data/artists.ts";
import { radioEpisodes } from "../client/src/data/radioEpisodes.ts";
import { untoldFaqs } from "../client/src/components/untold-story/constants.ts";
import {
  buildArtistSchema,
  buildFactsPageSchema,
  buildFaqSchema,
  buildPodcastEpisodeSchema,
  buildPodcastSeriesSchema,
  buildScheduleSchema,
  buildScheduledEventSchema,
  buildSitewideIdentitySchema,
} from "../client/src/lib/schema.ts";
import {
  INSTAGRAM_MONOLITH,
  INSTAGRAM_SUNSETS,
  POSH_TICKET_URL,
  SOUNDCLOUD_URL,
  buildPublicSiteData,
  upcomingEvents,
} from "../server/data/public-site-data.ts";
import { injectHeroPreloads } from "../server/services/hero-preloads.ts";
import {
  SITE_ORIGIN,
  buildEventSitemapEntries,
  mergeSitemapEntries,
} from "../shared/seo/public-seo.js";

type RouteDefinition = {
  path: string;
  title: string;
  description: string;
  image?: string;
  schemaData?: Record<string, unknown> | Array<Record<string, unknown>>;
  bodyHtml: string;
};

const distPublicDir = path.resolve("dist/public");
const templatePath = path.join(distPublicDir, "index.html");
const template = readFileSync(templatePath, "utf8");

const futureEvents = upcomingEvents.filter((event) => event.status !== "past");
const featuredTicketEvent =
  futureEvents.find((event) => event.status === "on-sale" && event.ticketUrl) ?? futureEvents[0];
const featuredChasingEvent =
  futureEvents.find((event) => event.series === "chasing-sunsets" && event.headline) ??
  futureEvents.find((event) => event.series === "chasing-sunsets");
const featuredUntoldEvent =
  futureEvents.find((event) => event.series === "untold-story" && event.id === "us-s3e3") ??
  futureEvents.find((event) => event.series === "untold-story");

const sharedLinks = [
  { href: "/tickets", label: "Tickets" },
  { href: "/schedule", label: "Schedule" },
  { href: "/chasing-sunsets", label: "Chasing Sun(Sets)" },
  { href: "/story", label: "Untold Story" },
  { href: "/radio", label: "Radio Show" },
  { href: "/about", label: "About Monolith" },
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

function serializeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function upsertTag(html: string, pattern: RegExp, replacement: string) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `  ${replacement}\n</head>`);
}

function upsertMetaByName(html: string, name: string, content: string) {
  const escapedContent = escapeHtml(content);
  const pattern = new RegExp(`<meta[^>]+name="${name}"[^>]*>`, "i");
  return upsertTag(html, pattern, `<meta name="${name}" content="${escapedContent}" />`);
}

function upsertMetaByProperty(html: string, property: string, content: string) {
  const escapedContent = escapeHtml(content);
  const pattern = new RegExp(`<meta[^>]+property="${property}"[^>]*>`, "i");
  return upsertTag(html, pattern, `<meta property="${property}" content="${escapedContent}" />`);
}

function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_ORIGIN}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function fullTitle(title: string) {
  return title.includes("The Monolith Project") ? title : `${title} | The Monolith Project`;
}

function renderParagraphs(paragraphs: string[]) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n");
}

function renderLinkList(
  links: Array<{ href: string; label: string; external?: boolean }>,
  ordered = false,
) {
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${links
    .map((link) => {
      const rel = link.external ? ` rel="noopener noreferrer"` : "";
      const target = link.external ? ` target="_blank"` : "";
      return `<li><a href="${escapeHtml(link.href)}"${target}${rel}>${escapeHtml(link.label)}</a></li>`;
    })
    .join("")}</${tag}>`;
}

function renderEventFacts(pathname: string) {
  const event = buildPublicSiteData(pathname, upcomingEvents).events.find((entry) => {
    const slug = pathname.startsWith("/events/") ? pathname.slice("/events/".length) : null;
    if (!slug) return false;
    return entry.slug === slug || entry.id === slug;
  });

  if (!event) return "";

  const factRows = [
    ["Date", event.date],
    ["Time", event.time],
    ["Venue", event.venue],
    ["Location", event.location],
    ["Lineup", event.lineup || "Lineup to be announced"],
  ];

  return `
    <section>
      <h2>Event Details</h2>
      <dl>
        ${factRows
          .map(
            ([label, value]) =>
              `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`,
          )
          .join("\n")}
      </dl>
    </section>
  `;
}

function renderUpcomingEventsSection() {
  return `
    <section>
      <h2>Upcoming Chicago Dates</h2>
      <ol>
        ${futureEvents
          .map((event) => {
            const eventPath = `/events/${event.slug || event.id}`;
            const ticketHref = event.ticketUrl || POSH_TICKET_URL;
            return `<li>
              <h3><a href="${escapeHtml(eventPath)}">${escapeHtml(event.headline || event.title)}</a></h3>
              <p>${escapeHtml(`${event.date} · ${event.time} · ${event.venue}`)}</p>
              <p>${escapeHtml(event.description || `${event.title} by The Monolith Project in Chicago.`)}</p>
              <p><a href="${escapeHtml(ticketHref)}">Tickets and RSVP</a></p>
            </li>`;
          })
          .join("\n")}
      </ol>
    </section>
  `;
}

function renderBaseLayout(
  eyebrow: string,
  h1: string,
  paragraphs: string[],
  links: Array<{ href: string; label: string; external?: boolean }>,
  extra = "",
) {
  return `
    <main>
      <header>
        <p>${escapeHtml(eyebrow)}</p>
        <h1>${escapeHtml(h1)}</h1>
        ${renderParagraphs(paragraphs)}
      </header>
      ${extra}
      <nav aria-label="Primary">
        <h2>Explore</h2>
        ${renderLinkList(links)}
      </nav>
    </main>
  `;
}

function renderHomeCriticalLayout() {
  return `
    <main class="critical-home-shell">
      <section class="critical-hero" aria-label="The Monolith Project">
        <picture class="critical-hero__media">
          <source
            type="image/avif"
            srcset="/images/generated/hero-video-1-poster-480.avif 480w, /images/generated/hero-video-1-poster-1024.avif 1024w, /images/generated/hero-video-1-poster-1920.avif 1920w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcset="/images/generated/hero-video-1-poster-480.webp 480w, /images/generated/hero-video-1-poster-1024.webp 1024w, /images/generated/hero-video-1-poster-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/images/hero-video-1-poster.jpg"
            alt=""
            width="1920"
            height="1080"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </picture>
        <div class="critical-hero__shade" aria-hidden="true"></div>
        <header class="critical-hero__content">
          <p class="critical-hero__eyebrow">Chicago Music Project</p>
          <h1>MONOLITH <span class="sr-only">Project | Chicago House & Techno</span></h1>
          <div class="critical-hero__rule" aria-hidden="true"></div>
          <p class="critical-hero__kicker">PROJECT</p>
          <p class="critical-hero__summary">Root Architecture / Events / Radio / Research</p>
        </header>
      </section>
      <section class="critical-home-content" aria-label="Monolith overview">
        <h2>The Monolith Project</h2>
        ${renderParagraphs([
          "The Monolith Project is a Chicago music platform built around events, radio, and long-term cultural memory.",
          "Chasing Sun(Sets) covers open-air and golden-hour sessions. Untold Story covers the after-dark room. The radio archive keeps the signal active between events.",
        ])}
      </section>
      ${renderUpcomingEventsSection()}
      <nav class="critical-home-content" aria-label="Primary">
        <h2>Explore</h2>
        ${renderLinkList([
          { href: "/tickets", label: "See current tickets" },
          { href: "/schedule", label: "View the Chicago schedule" },
          { href: "/chasing-sunsets", label: "Explore Chasing Sun(Sets)" },
          { href: "/story", label: "Explore Untold Story" },
          { href: "/radio", label: "Listen to the radio archive" },
          { href: INSTAGRAM_MONOLITH, label: "Instagram", external: true },
          { href: SOUNDCLOUD_URL, label: "SoundCloud archive", external: true },
        ])}
      </nav>
    </main>
  `;
}

function renderHomeCriticalStyle() {
  return `<style id="critical-home-hero-css">
    #root:has(.critical-home-shell) {
      min-height: 100svh;
      background: #000;
    }
    .critical-home-shell {
      margin: 0;
      min-height: 100svh;
      background: #000;
      color: #fff;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .critical-hero {
      position: relative;
      isolation: isolate;
      min-height: 100svh;
      overflow: hidden;
      background: #000;
    }
    .critical-hero__media,
    .critical-hero__media img,
    .critical-hero__shade {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
    }
    .critical-hero__media img {
      object-fit: cover;
      object-position: 80% center;
    }
    .critical-hero__shade {
      z-index: 1;
      background:
        radial-gradient(circle at 50% 42%, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.46) 78%, rgba(0, 0, 0, 0.62)),
        linear-gradient(90deg, rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.18) 56%, rgba(0, 0, 0, 0.62));
    }
    .critical-hero__content {
      position: relative;
      z-index: 2;
      box-sizing: border-box;
      display: flex;
      min-height: 100svh;
      width: min(100%, 1220px);
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 7rem 32rem 6rem 3rem;
      text-align: left;
    }
    .critical-hero__eyebrow,
    .critical-hero__kicker,
    .critical-hero__summary {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      text-transform: uppercase;
    }
    .critical-hero__eyebrow {
      margin-bottom: 2rem;
      color: rgba(255, 255, 255, 0.52);
      font-size: 0.78rem;
      letter-spacing: 0.78em;
    }
    .critical-hero h1 {
      margin: 0;
      color: #fff;
      font-family: "Archivo Black", Impact, "Arial Black", sans-serif;
      font-size: clamp(4rem, 16.5vw, 12.5rem);
      line-height: 0.8;
      text-transform: uppercase;
      text-shadow: 0 0 80px rgba(255, 255, 255, 0.08);
    }
    .critical-hero__rule {
      width: min(100%, 50rem);
      height: 1px;
      margin: 1.6rem 0 1.8rem;
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.32), transparent);
    }
    .critical-hero__kicker {
      color: rgba(255, 255, 255, 0.9);
      font-size: clamp(0.8rem, 5vw, 2.5rem);
      line-height: 1;
      letter-spacing: 0.5em;
    }
    .critical-hero__summary {
      max-width: 30rem;
      margin-top: 1.25rem;
      color: rgba(255, 255, 255, 0.58);
      font-size: 0.68rem;
      letter-spacing: 0.32em;
      line-height: 1.8;
    }
    .critical-home-content,
    .critical-home-shell > section:not(.critical-hero),
    .critical-home-shell > nav {
      box-sizing: border-box;
      padding: 4rem 1.5rem;
      background: #111;
    }
    .critical-home-content > *,
    .critical-home-shell > section:not(.critical-hero) > *,
    .critical-home-shell > nav > * {
      max-width: 70rem;
      margin-left: auto;
      margin-right: auto;
    }
    @media (max-width: 900px) {
      .critical-hero__content {
        align-items: center;
        justify-content: flex-start;
        padding: 7.5rem 1.5rem 18rem;
        text-align: center;
      }
      .critical-hero__eyebrow {
        font-size: 0.68rem;
        letter-spacing: 0.5em;
      }
      .critical-hero h1 {
        font-size: clamp(3rem, 16.2vw, 7rem);
      }
      .critical-hero__rule {
        width: min(100%, 34rem);
      }
      .critical-hero__summary {
        max-width: 22rem;
        font-size: 0.62rem;
        letter-spacing: 0.24em;
      }
    }
  </style>`;
}

function deferHomeAppStylesheets(html: string) {
  return html.replace(
    /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
    (_match, href: string) =>
      `<link rel="preload" as="style" crossorigin href="${href}" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`,
  );
}

const staticRoutes = new Map<string, Omit<RouteDefinition, "path">>([
  [
    "/",
    {
      title: "Monolith Project | Chicago House & Techno Event Series & Radio Show",
      description:
        "The Monolith Project is the root. Chasing Sun(Sets) runs daytime — rooftops in summer, the Radio Show worldwide. Untold Story runs the night. One Chicago music project.",
      schemaData: buildSitewideIdentitySchema(),
      bodyHtml: renderHomeCriticalLayout(),
    },
  ],
  [
    "/tickets",
    {
      title: "Tickets",
      description:
        "Secure your spot for the next Monolith Project event. Limited capacity available.",
      image: featuredTicketEvent?.image || "/images/untold-story-moody.webp",
      schemaData:
        featuredTicketEvent && featuredTicketEvent.ticketUrl
          ? buildScheduledEventSchema(featuredTicketEvent, "/tickets")
          : undefined,
      bodyHtml: renderBaseLayout(
        "Priority Ticket Access",
        "Get In",
        [
          featuredTicketEvent
            ? `${featuredTicketEvent.headline || featuredTicketEvent.title} is the current featured Monolith event.`
            : "Current featured Monolith event tickets and RSVP information.",
          featuredTicketEvent
            ? `${featuredTicketEvent.date} · ${featuredTicketEvent.time} · ${featuredTicketEvent.venue}.`
            : "Check the official schedule for dates, venue announcements, and ticket windows.",
        ],
        [
          { href: featuredTicketEvent?.ticketUrl || POSH_TICKET_URL, label: "Buy tickets" },
          {
            href: featuredTicketEvent ? `/events/${featuredTicketEvent.slug || featuredTicketEvent.id}` : "/schedule",
            label: featuredTicketEvent ? "Open event details" : "View schedule",
          },
          { href: "/schedule", label: "Full schedule" },
        ],
      ),
    },
  ],
  [
    "/schedule",
    {
      title: "Chicago Event Schedule | Chasing Sun(Sets) + Monolith Project",
      description:
        "Official schedule for Chasing Sun(Sets) and The Monolith Project in Chicago with event dates, venues, lineup details, and ticket links.",
      schemaData: buildScheduleSchema(upcomingEvents),
      bodyHtml: renderBaseLayout(
        "Official Schedule",
        "Chicago Event Schedule",
        [
          "Browse upcoming Monolith, Chasing Sun(Sets), and Untold Story dates in Chicago.",
          "Each event page includes date, venue, lineup context, and ticket or RSVP access when available.",
        ],
        sharedLinks,
        renderUpcomingEventsSection(),
      ),
    },
  ],
  [
    "/chasing-sunsets",
    {
      title: "Chasing Sun(Sets)",
      description:
        "The premier open-air electronic music series in Chicago. Curated rooms, panoramic views, and uncompromised sound.",
      image: featuredChasingEvent?.image || "/images/chasing-sunsets-premium.webp",
      schemaData:
        featuredChasingEvent ? buildScheduledEventSchema(featuredChasingEvent, "/chasing-sunsets") : undefined,
      bodyHtml: renderBaseLayout(
        "Open-Air Chicago Series",
        "Chasing Sun(Sets)",
        [
          "Chasing Sun(Sets) is The Monolith Project's open-air and golden-hour music series in Chicago.",
          "The format is built around panoramic views, intentional pacing, and a transition from late afternoon into night.",
        ],
        [
          {
            href: featuredChasingEvent ? `/events/${featuredChasingEvent.slug || featuredChasingEvent.id}` : "/schedule",
            label: "Open the featured date",
          },
          { href: "/radio", label: "Listen to the radio show" },
          { href: INSTAGRAM_SUNSETS, label: "Instagram", external: true },
        ],
      ),
    },
  ],
  [
    "/story",
    {
      title: "Untold Story",
      description:
        "The premier after-dark electronic music series in Chicago. Curated rooms, uncompromised sound, and a dedicated architectural standard for the late night.",
      image: featuredUntoldEvent?.image || "/images/eran-hersh-live-5.webp",
      schemaData: [
        buildFaqSchema(untoldFaqs),
        ...(featuredUntoldEvent ? [buildScheduledEventSchema(featuredUntoldEvent, "/story")] : []),
      ],
      bodyHtml: renderBaseLayout(
        "After-Dark Chicago Series",
        "Untold Story",
        [
          "Untold Story is The Monolith Project's late-night series in Chicago.",
          "It is built around intimate rooms, deeper pacing, and a more focused dancefloor atmosphere.",
        ],
        [
          {
            href: featuredUntoldEvent ? `/events/${featuredUntoldEvent.slug || featuredUntoldEvent.id}` : "/schedule",
            label: "Open the featured date",
          },
          { href: "/tickets", label: "View tickets" },
          { href: "/newsletter", label: "Get updates" },
        ],
      ),
    },
  ],
  [
    "/radio",
    {
      title: "Chasing Sun(Sets) Radio Show | Episodes, Tracklists, Guest Mixes",
      description:
        "Official Chasing Sun(Sets) Radio Show archive from Chicago with guest mixes, episode pages, tracklists, and links to tickets and facts.",
      schemaData: buildPodcastSeriesSchema(radioEpisodes),
      bodyHtml: renderBaseLayout(
        "Chicago Radio Archive",
        "Chasing Sun(Sets) Radio Show",
        [
          "The radio archive extends the Chasing Sun(Sets) brand beyond live events through mixes, guest sessions, and episode pages.",
          "Each episode page includes the guest, date, tracklist, and a direct listening link.",
        ],
        radioEpisodes.map((episode) => ({
          href: `/radio/${episode.slug}`,
          label: `${episode.shortCode}: ${episode.title}`,
        })),
      ),
    },
  ],
  [
    "/chasing-sunsets-facts",
    {
      title: "Chasing Sun(Sets) Facts | Chicago Sunset House Music Series + Radio Show",
      description:
        "Official identity and disambiguation for Chasing Sun(Sets): a Chicago sunset house music event series and radio show by The Monolith Project, not a fragrance brand.",
      schemaData: buildFactsPageSchema(),
      bodyHtml: renderBaseLayout(
        "Official Identity",
        "Chasing Sun(Sets) Facts",
        [
          "Chasing Sun(Sets) is a Chicago-based sunset house music event series and radio show by The Monolith Project.",
          "This page clarifies the music brand and distinguishes it from unrelated products that share a similar name.",
        ],
        [
          { href: "/chasing-sunsets", label: "Official Chasing Sun(Sets) page" },
          { href: "/radio", label: "Official radio archive" },
          { href: "/tickets", label: "Official tickets" },
        ],
      ),
    },
  ],
  [
    "/about",
    {
      title: "About The Monolith Project | Chicago Music Project",
      description:
        "Monolith is the root. Chasing Sun(Sets) carries the daytime — rooftops in Chicago, the Radio Show worldwide. Untold Story carries the night. Togetherness is the vision that holds the branches together.",
      bodyHtml: renderBaseLayout(
        "Project Overview",
        "About The Monolith Project",
        [
          "The Monolith Project is a Chicago-rooted music project designed around events, radio, and cultural continuity.",
          "Chasing Sun(Sets), Untold Story, and the radio archive all sit inside the same ecosystem.",
        ],
        sharedLinks,
      ),
    },
  ],
  [
    "/lineup",
    {
      title: "Lineup",
      description:
        "Explore the artists behind The Monolith Project across Chasing Sun(Sets), Untold Story, and Sun(Sets) Radio.",
      bodyHtml: renderBaseLayout(
        "Artist Roster",
        "Lineup",
        [
          "Explore the artists behind The Monolith Project across Chasing Sun(Sets), Untold Story, and the radio archive.",
          "Each profile includes background, genre context, and series association.",
        ],
        ARTIST_ENTRIES.map((artist) => ({
          href: `/artists/${artist.id}`,
          label: artist.name,
        })),
      ),
    },
  ],
  [
    "/contact",
    {
      title: "Contact",
      description:
        "Get in touch with The Monolith Project for bookings, partnerships, and general inquiries.",
      bodyHtml: renderBaseLayout(
        "Get In Touch",
        "Contact",
        [
          "Reach out to The Monolith Project for bookings, partnerships, artist inquiries, and general contact.",
        ],
        [
          { href: "/booking", label: "Booking inquiries" },
          { href: "/partners", label: "Partnerships" },
          { href: "/privacy", label: "Privacy and legal" },
        ],
      ),
    },
  ],
  [
    "/faq",
    {
      title: "FAQ | Chasing Sun(Sets), Tickets, Venue & Radio Show",
      description:
        "Answers about tickets, venues, schedule timing, booking, and Monolith Project events in Chicago.",
      bodyHtml: renderBaseLayout(
        "Frequently Asked Questions",
        "FAQ",
        [
          "Find answers about tickets, venue logistics, booking, and event expectations for The Monolith Project in Chicago.",
        ],
        [
          { href: "/tickets", label: "Ticket page" },
          { href: "/schedule", label: "Schedule" },
          { href: "/booking", label: "Booking" },
        ],
      ),
    },
  ],
  [
    "/partners",
    {
      title: "Partners & Crew",
      description:
        "Partnerships, crew, and collaborators behind The Monolith Project experiences in Chicago.",
      bodyHtml: renderBaseLayout(
        "Partners and Crew",
        "Partners",
        [
          "Meet the venues, partners, crew, and collaborators behind The Monolith Project experiences.",
        ],
        [
          { href: "/contact", label: "Contact" },
          { href: "/booking", label: "Booking" },
        ],
      ),
    },
  ],
  [
    "/booking",
    {
      title: "Booking",
      description:
        "Booking inquiries for The Monolith Project, Chasing Sun(Sets), Untold Story, and related Chicago events.",
      bodyHtml: renderBaseLayout(
        "Artist and Booking Inquiries",
        "Booking",
        [
          "Use the booking page to submit artist information, mixes, or touring inquiries for Monolith Project events in Chicago.",
        ],
        [
          { href: "/contact", label: "General contact" },
          { href: "/lineup", label: "Current lineup" },
        ],
      ),
    },
  ],
  [
    "/newsletter",
    {
      title: "Newsletter",
      description:
        "Join the Monolith list for priority ticket windows, lineup drops, and fresh radio mixes.",
      bodyHtml: renderBaseLayout(
        "Direct Updates",
        "Get Monolith Updates",
        [
          "Join the Monolith newsletter for early ticket access, lineup drops, and new radio episodes before the public push.",
        ],
        [
          { href: "/schedule", label: "View schedule" },
          { href: "/vip", label: "VIP information" },
        ],
      ),
    },
  ],
  [
    "/terms",
    {
      title: "Terms of Service",
      description: "Terms of Service for The Monolith Project website and events.",
      bodyHtml: renderBaseLayout(
        "Legal",
        "Terms of Service",
        ["Review the terms that govern use of The Monolith Project website and events."],
        [
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/cookies", label: "Cookie Policy" },
        ],
      ),
    },
  ],
  [
    "/privacy",
    {
      title: "Privacy Policy",
      description:
        "Privacy policy for The Monolith Project website and event communications.",
      bodyHtml: renderBaseLayout(
        "Legal",
        "Privacy Policy",
        ["Review how The Monolith Project handles website data and event communications."],
        [
          { href: "/terms", label: "Terms of Service" },
          { href: "/cookies", label: "Cookie Policy" },
        ],
      ),
    },
  ],
  [
    "/cookies",
    {
      title: "Cookie Policy",
      description: "Cookie policy for The Monolith Project website.",
      bodyHtml: renderBaseLayout(
        "Legal",
        "Cookie Policy",
        ["Review how cookies are used on The Monolith Project website."],
        [
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
        ],
      ),
    },
  ],
]);

function buildArtistRoutes(): RouteDefinition[] {
  return ARTIST_ENTRIES.map((artist) => ({
    path: `/artists/${artist.id}`,
    title: artist.name,
    description: artist.bio,
    image: artist.image,
    schemaData: buildArtistSchema(artist, `/artists/${artist.id}`),
    bodyHtml: renderBaseLayout(
      "Artist Profile",
      artist.name,
      [
        artist.bio,
        `${artist.name} is associated with ${artist.series.join(", ")} in The Monolith Project ecosystem.`,
      ],
      [
        ...(artist.socials.instagram
          ? [{ href: artist.socials.instagram, label: `${artist.name} on Instagram`, external: true }]
          : []),
        ...(artist.socials.website
          ? [{ href: artist.socials.website, label: `${artist.name} website`, external: true }]
          : []),
        { href: "/lineup", label: "Back to lineup" },
      ],
      `
        <section>
          <h2>Artist Details</h2>
          <p><strong>Origin:</strong> ${escapeHtml(artist.origin)}</p>
          <p><strong>Genre:</strong> ${escapeHtml(artist.genre)}</p>
          <p><strong>Series:</strong> ${escapeHtml(artist.series.join(", "))}</p>
        </section>
      `,
    ),
  }));
}

function buildRadioEpisodeRoutes(): RouteDefinition[] {
  return radioEpisodes.map((episode) => ({
    path: `/radio/${episode.slug}`,
    title: `Chasing Sun(Sets) Radio Show ${episode.shortCode}: ${episode.title}`,
    description: `${episode.summary} Official Chicago radio episode with guest mix details and tracklist from Chasing Sun(Sets).`,
    image: episode.image,
    schemaData: buildPodcastEpisodeSchema(episode),
    bodyHtml: renderBaseLayout(
      "Radio Episode",
      `${episode.shortCode}: ${episode.title}`,
      [
        `${episode.guest} · ${episode.displayDate} · ${episode.duration}`,
        episode.summary,
      ],
      [
        { href: episode.audioUrl, label: "Listen on SoundCloud", external: true },
        { href: "/radio", label: "Back to the radio archive" },
      ],
      `
        <section>
          <h2>Tracklist</h2>
          ${renderLinkList(
            episode.tracklist.map((track) => ({
              href: episode.audioUrl,
              label: `${track.timecode} · ${track.artist} — ${track.title}`,
              external: true,
            })),
            true,
          )}
        </section>
      `,
    ),
  }));
}

function buildEventRoutes(): RouteDefinition[] {
  return futureEvents.map((event) => {
    const routePath = `/events/${event.slug || event.id}`;
    return {
      path: routePath,
      title: `${event.title} - ${event.venue}`,
      description:
        event.description || `Join us for ${event.title} at ${event.venue} on ${event.date}.`,
      image: event.image || "/images/hero-monolith.webp",
      schemaData: buildScheduledEventSchema(event, routePath),
      bodyHtml: renderBaseLayout(
        event.series === "untold-story" ? "Untold Story Event" : "Chasing Sun(Sets) Event",
        event.headline || event.title,
        [
          `${event.date} · ${event.time} · ${event.venue}`,
          event.description || `Official event details for ${event.title} in Chicago.`,
        ],
        [
          { href: event.ticketUrl || POSH_TICKET_URL, label: "Tickets and RSVP" },
          { href: "/schedule", label: "Back to schedule" },
        ],
        renderEventFacts(routePath),
      ),
    };
  });
}

const routeDefinitions = [
  ...Array.from(staticRoutes.entries()).map(([routePath, route]) => ({ path: routePath, ...route })),
  ...buildArtistRoutes(),
  ...buildRadioEpisodeRoutes(),
  ...buildEventRoutes(),
];

for (const sitemapEntry of mergeSitemapEntries(buildEventSitemapEntries(upcomingEvents))) {
  const sitemapPath = sitemapEntry.path || "/";
  if (!routeDefinitions.some((route) => route.path === sitemapPath)) {
    routeDefinitions.push({
      path: sitemapPath,
      title: sitemapPath === "/" ? "The Monolith Project" : sitemapPath.split("/").filter(Boolean).join(" "),
      description: `Official ${sitemapPath === "/" ? "homepage" : stripTags(sitemapPath)} page for The Monolith Project.`,
      bodyHtml: renderBaseLayout(
        "The Monolith Project",
        sitemapPath === "/" ? "The Monolith Project" : sitemapPath,
        [`Official route for ${sitemapPath} on The Monolith Project website.`],
        sharedLinks,
      ),
    });
  }
}

for (const route of routeDefinitions) {
  const canonicalUrl = toAbsoluteUrl(route.path);
  const schemaMarkup = route.schemaData
    ? `<script type="application/ld+json">${serializeJson(route.schemaData)}</script>`
    : "";
  const siteDataMarkup = `<script>window.__MONOLITH_SITE_DATA__=${serializeJson(
    buildPublicSiteData(route.path, upcomingEvents),
  )};</script>`;

  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle(route.title))}</title>`);
  html = upsertMetaByName(html, "description", route.description);
  html = upsertMetaByProperty(html, "og:url", canonicalUrl);
  html = upsertMetaByProperty(html, "og:title", fullTitle(route.title));
  html = upsertMetaByProperty(html, "og:description", route.description);
  html = upsertMetaByName(html, "twitter:url", canonicalUrl);
  html = upsertMetaByName(html, "twitter:title", fullTitle(route.title));
  html = upsertMetaByName(html, "twitter:description", route.description);

  if (route.image) {
    const imageUrl = toAbsoluteUrl(route.image);
    html = upsertMetaByProperty(html, "og:image", imageUrl);
    html = upsertMetaByName(html, "twitter:image", imageUrl);
  }

  if (route.path === "/") {
    html = html.replace("</head>", `${renderHomeCriticalStyle()}\n</head>`);
    html = deferHomeAppStylesheets(html);
  }

  html = upsertTag(
    html,
    /<link[^>]+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" data-rh="true" />`,
  );
  html = html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root">${route.bodyHtml}</div>`,
  );
  html = html.replace(/<script[^>]+type="module"[^>]*>/i, `${siteDataMarkup}\n${schemaMarkup}\n$&`);
  html = injectHeroPreloads(html, route.path);

  const outputPath =
    route.path === "/"
      ? templatePath
      : path.join(distPublicDir, route.path.replace(/^\/+/, ""), "index.html");

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html, "utf8");
}
