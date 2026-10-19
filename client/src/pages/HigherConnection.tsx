import { ArrowRight, Play } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { getScheduledEvents } from "@/lib/siteExperience";
import { getEventDetailsHref } from "@/lib/cta";
import { getScheduleDate, getScheduleVenue } from "@/lib/schedulePresentation";
import "@/styles/higher-connection.css";

/**
 * "A Higher Connection": the Monolith Project as the home of People, Places and Sound, with
 * SUN(SETS).FM inside it. Preview of Erik's 2026-10-17 design; the live homepage is unchanged.
 * The monolith, light and sky are drawn here (no generated photography).
 */
const SUNSETS = "https://sunsets.fm";
const NAV = [
  { label: "People", href: "/lineup" },
  { label: "Places", href: `${SUNSETS}/atlas` },
  { label: "Sound", href: "/radio" },
  { label: "Events", href: "/schedule" },
  { label: "SUNSETS.FM", href: SUNSETS },
  { label: "Passport", href: `${SUNSETS}/passport` },
] as const;
// Real coordinates, printed the way the design prints Chicago's.
const CITIES = [
  { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { name: "Ibiza", lat: 38.9067, lon: 1.4206 },
  { name: "Tulum", lat: 20.2114, lon: -87.4654 },
  { name: "Cape Town", lat: -33.9249, lon: 18.4241 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
] as const;
const coordinate = (value: number, positive: string, negative: string) =>
  `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`;
const isExternal = (href: string) => href.startsWith("http");
// A postponed or cancelled show keeps its card but never shows a date that has already passed.
const STATUS_LABEL: Partial<Record<string, string>> = { EventPostponed: "Postponed", EventCancelled: "Cancelled", EventRescheduled: "Rescheduled" };

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return isExternal(href)
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    : <Link className={className} href={href}>{children}</Link>;
}

/** Thin line glyphs, one per idea: sun (global), signal (sound), peak (passport), pillars (monolith). */
function Glyph({ kind }: { kind: "sun" | "signal" | "peak" | "pillars" | "horizon" | "cross" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "round" as const };
  return <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    {kind === "sun" && <><circle cx="20" cy="20" r="11" {...common} /><path d="M6 20h28M20 6v28" {...common} opacity=".55" /></>}
    {kind === "signal" && <path d="M8 20v0M12 15v10M16 9v22M20 13v14M24 6v28M28 12v16M32 17v6" {...common} />}
    {kind === "peak" && <><path d="M20 7 34 32H6Z" {...common} /><path d="M20 20v6M17 23h6" {...common} opacity=".6" /></>}
    {kind === "pillars" && <><rect x="11" y="6" width="7" height="28" {...common} /><rect x="22" y="6" width="7" height="28" {...common} /></>}
    {kind === "horizon" && <><path d="M6 26h28M10 30h20" {...common} /><path d="M12 26a8 8 0 0 1 16 0" {...common} /></>}
    {kind === "cross" && <path d="M20 6v28M11 20h18M14 14l12 12M26 14 14 26" {...common} opacity=".8" />}
  </svg>;
}

/** The hero: a split monolith with light pouring through the seam, a low sun and one figure. */
function MonolithScene() {
  return <svg className="hc-scene" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="hc-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d0b0a" />
        <stop offset=".45" stopColor="#2a1a10" />
        <stop offset=".66" stopColor="#8a4d1e" />
        <stop offset=".74" stopColor="#d9893a" />
        <stop offset=".8" stopColor="#3a2416" />
        <stop offset="1" stopColor="#0b0908" />
      </linearGradient>
      <radialGradient id="hc-sun" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(990 560) scale(260 120)">
        <stop offset="0" stopColor="#ffd38a" stopOpacity=".95" />
        <stop offset=".25" stopColor="#ff9a3c" stopOpacity=".55" />
        <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hc-seam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffb04a" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff1c9" />
        <stop offset="1" stopColor="#ffb04a" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="hc-stone-l" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0c0b0b" />
        <stop offset=".8" stopColor="#24201d" />
        <stop offset="1" stopColor="#6b4a2a" />
      </linearGradient>
      <linearGradient id="hc-stone-r" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7a5230" />
        <stop offset=".18" stopColor="#2a2420" />
        <stop offset="1" stopColor="#0c0b0b" />
      </linearGradient>
      <filter id="hc-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
      <filter id="hc-glow" x="-200%" y="-10%" width="500%" height="120%"><feGaussianBlur stdDeviation="9" /></filter>
    </defs>
    <rect width="1200" height="760" fill="url(#hc-sky)" />
    <rect width="1200" height="760" fill="url(#hc-sun)" />
    {/* Far ridges and the water line. */}
    <path d="M0 560 160 520 300 548 420 512 560 556 700 530 860 548 1000 520 1200 552V600H0Z" fill="#17110d" />
    <path d="M0 600H1200V760H0Z" fill="#0e0b09" />
    <path d="M820 606h360M880 622h260M930 640h160" stroke="#ffb860" strokeOpacity=".45" strokeWidth="2" />
    {/* The monolith, split by light. */}
    <g>
      <path d="M470 0H596L590 640H452Z" fill="url(#hc-stone-l)" />
      <path d="M604 0H760L748 640H610Z" fill="url(#hc-stone-r)" />
      <g filter="url(#hc-grain)"><path d="M470 0H596L590 640H452Z" fill="#000" /><path d="M604 0H760L748 640H610Z" fill="#000" /></g>
      <path d="M520 120 548 260 536 410M690 90 704 240 680 380M712 420 700 560" stroke="#3a3029" strokeWidth="1.4" fill="none" />
      <rect x="586" y="0" width="28" height="660" fill="url(#hc-seam)" filter="url(#hc-glow)" className="hc-seam-glow" />
      <rect x="598" y="0" width="4" height="660" fill="#fff5dc" className="hc-seam-core" />
      <path d="M600 640 470 760H730Z" fill="#ffcf8a" opacity=".12" />
    </g>
    {/* Rocks in the foreground. */}
    <path d="M0 690 90 640 210 668 300 636 400 690 380 760H0ZM800 700 900 650 1010 676 1110 640 1200 668V760H780Z" fill="#090807" />
    {/* One figure at the threshold. */}
    <g fill="#060505" transform="translate(600 586)">
      <ellipse cx="0" cy="-58" rx="7" ry="8" />
      <path d="M-11-48C-14-30-13-6-10 6H10C13-6 14-30 11-48Q0-53-11-48Z" />
      <path d="M-8 6-7 40H-2L0 12 2 40H7L8 6Z" />
    </g>
  </svg>;
}

/** Cities on a dark Earth limb with arcs, printed with real coordinates. */
function CityGlobe() {
  return <svg className="hc-globe" viewBox="0 0 520 300" aria-hidden="true">
    <defs>
      <radialGradient id="hc-earth" cx=".55" cy=".35" r=".75">
        <stop offset="0" stopColor="#1d1a17" /><stop offset=".7" stopColor="#0b0a09" /><stop offset="1" stopColor="#050505" />
      </radialGradient>
      <linearGradient id="hc-limb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ffb860" stopOpacity="0" /><stop offset=".5" stopColor="#ffb860" stopOpacity=".55" /><stop offset="1" stopColor="#ffb860" stopOpacity="0" /></linearGradient>
    </defs>
    <circle cx="300" cy="330" r="300" fill="url(#hc-earth)" />
    <path d="M20 250A300 300 0 0 1 580 250" fill="none" stroke="url(#hc-limb)" strokeWidth="1.5" />
    {[[140, 160, 300, 98], [300, 98, 420, 150], [300, 98, 250, 210], [420, 150, 470, 230], [140, 160, 250, 210]].map(([x1, y1, x2, y2], index) =>
      <path key={index} d={`M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 60} ${x2} ${y2}`} fill="none" stroke="#ffb860" strokeOpacity=".5" strokeWidth="1" />)}
    {[[140, 160], [300, 98], [420, 150], [250, 210], [470, 230], [360, 200]].map(([x, y], index) =>
      <g key={index}><circle cx={x} cy={y} r="9" fill="#ffb860" opacity=".18" /><circle cx={x} cy={y} r="2.6" fill="#ffe2b0" /></g>)}
  </svg>;
}

export default function HigherConnection() {
  const next = getScheduledEvents()[0];
  return <div className="hc-page">
    <SEO title="A Higher Connection" description="The Monolith Project: a global community of people, places and sound." noIndex />
    <aside className="hc-rail" aria-hidden="true">
      <p className="hc-coords">{coordinate(41.8781, "N", "S")}<br />{coordinate(-87.6298, "E", "W")}</p>
      <div className="hc-rail-glyphs"><Glyph kind="cross" /><Glyph kind="sun" /><Glyph kind="signal" /><Glyph kind="peak" /><Glyph kind="pillars" /></div>
      <p className="hc-rail-words">People<br />Places<br />Sound<br />A higher connection</p>
    </aside>

    <header className="hc-header">
      <Link href="/" className="hc-brand" aria-label="The Monolith Project home">
        <span className="hc-brand-mark" aria-hidden="true"><i /><i /></span>
        <span className="hc-brand-name"><small>The</small>Monolith<small>Project</small></span>
      </Link>
      <nav className="hc-nav" aria-label="Main">{NAV.map(item => <NavLink key={item.label} href={item.href}>{item.label}</NavLink>)}</nav>
      <a className="hc-connect" href="/newsletter"><Glyph kind="sun" /><span>Connect<small>A higher connection</small></span></a>
    </header>

    <section className="hc-hero" aria-labelledby="hc-title">
      <MonolithScene />
      <div className="hc-hero-copy">
        <p className="hc-kicker">A global community<br />for a brighter tomorrow</p>
        <h1 id="hc-title">People<br />Places<br />Sound</h1>
        <span className="hc-rule" aria-hidden="true" />
        <p className="hc-tagline">A higher connection</p>
        <Link href="/schedule" className="hc-button">Explore <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
    </section>

    <section className="hc-pillars" aria-label="What the Monolith Project is">
      <a href={`${SUNSETS}/sunsets`} target="_blank" rel="noopener noreferrer"><Glyph kind="sun" /><h2>Global</h2><p>A 24-hour sun relay.<br />Music without borders.</p></a>
      <a href={SUNSETS} target="_blank" rel="noopener noreferrer"><Glyph kind="signal" /><h2>SUNSETS.FM</h2><p>Live sets. New cities.<br />A higher frequency.</p></a>
      <a href={`${SUNSETS}/passport`} target="_blank" rel="noopener noreferrer"><Glyph kind="peak" /><h2>Passport</h2><p>Collect experiences.<br />Not things.</p></a>
      <Link href="/about"><Glyph kind="pillars" /><h2>The Monolith</h2><p>Intelligence. Observation.<br />Guidance.</p></Link>
    </section>

    <section className="hc-cards" aria-label="Now">
      <a className="hc-card hc-transmissions" href={`${SUNSETS}/live`} target="_blank" rel="noopener noreferrer">
        <p className="hc-label">Featured<br />transmissions</p>
        <div className="hc-card-foot"><span className="hc-play" aria-hidden="true"><Play size={18} /></span><span><strong>Live sets &amp; radio</strong><small>On SUNSETS.FM</small></span></div>
      </a>
      <a className="hc-card hc-cities" href={`${SUNSETS}/atlas`} target="_blank" rel="noopener noreferrer">
        <p className="hc-label">Cities<br /><small>Find your frequency.</small></p>
        <CityGlobe />
        <ul>{CITIES.map(city => <li key={city.name}><span>{city.name}</span><small>{coordinate(city.lat, "N", "S")} · {coordinate(city.lon, "E", "W")}</small></li>)}</ul>
      </a>
      {next ? <Link className="hc-card hc-event" href={getEventDetailsHref(next)}>
        <p className="hc-label">Upcoming<br />events</p>
        <div className="hc-card-foot"><span><small>{(next.eventStatus && STATUS_LABEL[next.eventStatus]) ?? getScheduleDate(next).label}</small><strong>{next.headline || next.title}</strong><small>{getScheduleVenue(next)}</small></span><span className="hc-arrow" aria-hidden="true"><ArrowRight size={16} /></span></div>
      </Link> : <Link className="hc-card hc-event" href="/newsletter">
        <p className="hc-label">Upcoming<br />events</p>
        <div className="hc-card-foot"><span><small>Next season</small><strong>Announced to the list first</strong><small>Join for the first dates</small></span><span className="hc-arrow" aria-hidden="true"><ArrowRight size={16} /></span></div>
      </Link>}
    </section>
  </div>;
}
