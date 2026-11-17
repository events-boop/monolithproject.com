import {
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import RoomConciergeCard from "@/components/RoomConciergeCard";
import SEO from "@/components/SEO";
import {
  getEventEyebrow,
  getExperienceEvent,
  getPrimaryTicketUrl,
  getEventWindowStatus,
} from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import { ROUTES } from "@shared/routes";

const checklist = [
  {
    icon: CheckCircle,
    text: "Valid Physical Government Photo ID (21+ strictly enforced)",
    tone: "ok",
  },
  {
    icon: CheckCircle,
    text: "Mobile Ticket QR Code (save to Apple/Google Wallet or screenshot)",
    tone: "ok",
  },
  {
    icon: CheckCircle,
    text: "Tap-to-Pay / Credit or Debit Card (cashless bar & hospitality)",
    tone: "ok",
  },
  {
    icon: AlertCircle,
    text: "No Detached-Lens Professional Cameras without Press Clearance",
    tone: "warn",
  },
  {
    icon: AlertCircle,
    text: "No Outside Beverages, Large Bags, or Unauthorized Totems",
    tone: "warn",
  },
] as const;

function formatIsoTime(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Chicago",
  }).format(date);
}

export default function Guide() {
  usePublicSiteDataVersion();
  const candidate = getExperienceEvent("guide");
  const guideEvent =
    candidate &&
    candidate.confirmationStatus !== "pending" &&
    ["live", "upcoming"].includes(getEventWindowStatus(candidate))
      ? candidate
      : undefined;
  const ticketUrl = getPrimaryTicketUrl(guideEvent);
  const isPostponed = guideEvent?.eventStatus === "EventPostponed";

  const timeline = guideEvent
    ? [
        {
          time: isPostponed
            ? "First 90 Min"
            : guideEvent.doors || guideEvent.time,
          event: "Doors & Golden-Hour Arrival",
          desc: "Arrive in the opening window for zero-friction check-in and the deliberate warmup progression.",
        },
        {
          time: isPostponed
            ? "Peak Arc"
            : guideEvent.mainExperience || "Peak Window",
          event: "Headline & Room Lock-In",
          desc: "When the room fills and the full sound and lighting envelope lock together.",
        },
        {
          time: formatIsoTime(guideEvent.endsAt) || "Closing",
          event: "Final Selection & Exit",
          desc: "Coordinate your rideshare pickup pin with your group before stepping outside.",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden lg-dusk-atmosphere">
      <SEO
        title="Arrival & Room Concierge"
        description="Know before you go. Chicago room profiles, rideshare drop-off pins, entry checklist, and VIP arrival notes for Monolith Project events."
        canonicalPath="/guide"
      />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="relative z-10 pb-36">
        <section className="lg-cinematic-masthead px-6 mb-16 md:mb-20">
          <div className="container layout-wide">
            <header className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] uppercase text-[#f3b572] mb-5">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{getEventEyebrow(guideEvent)} · Arrival Concierge</span>
                </p>
                <h1 className="section-display-title text-[#fbf6ee]">
                  Know The Room.
                </h1>
                <p className="mt-6 max-w-2xl text-base md:text-xl text-white/76 leading-relaxed">
                  Every Monolith session is built around the room, the light,
                  and how people arrive together. Explore our Chicago lakefront
                  and West Loop room guides below.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {guideEvent && ticketUrl ? (
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lg-pill-amber"
                  >
                    <span>Get Tickets</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link href={ROUTES.schedule} className="lg-pill-amber">
                    <span>View Calendar</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
                <Link href={ROUTES.faq} className="lg-pill-glass">
                  <span>Full FAQ</span>
                </Link>
              </div>
            </header>
          </div>
        </section>

        <div className="container layout-wide px-6 space-y-16 md:space-y-20">
          {/* Interactive Chicago Room Switcher & Arrival Concierge */}
          {!guideEvent && (
            <aside className="editorial-status-note">
              <h2>Plan around the confirmed show.</h2>
              <p>
                No current arrival schedule is published. The room profiles
                below are venue references; your event confirmation will provide
                the final address and hours.
              </p>
              <Link href="/sunsets#event-update">
                September ticket-holder update →
              </Link>
            </aside>
          )}
          <RoomConciergeCard event={guideEvent} allowRoomSwitch />

          {/* Night Pacing & Entry Checklist */}
          <div className="grid gap-8 lg:grid-cols-12">
            <section className="lg:col-span-6 lg-glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display text-2xl uppercase text-[#fbf6ee] mb-6 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#f3b572]" aria-hidden="true" />
                <span>How The Night Moves</span>
              </h2>
              <div className="space-y-0 relative border-l border-[#f3a659]/25 ml-2 pl-7 pb-1">
                {timeline.length === 0 && (
                  <p className="text-sm leading-relaxed text-white/75">
                    Doors, set times, and closing will appear here when a new
                    show is confirmed. All published times use Chicago local
                    time.
                  </p>
                )}
                {timeline.map((slot, idx) => (
                  <div key={slot.event} className="relative mb-8 last:mb-0">
                    <span
                      className={`absolute -left-[35px] top-1 w-3.5 h-3.5 rounded-full border ${
                        idx === 0
                          ? "bg-[#f3a659] border-[#ffe6c2]"
                          : "bg-[#121010] border-white/30"
                      }`}
                    />
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#f3b572] mb-1">
                      {slot.time}
                    </p>
                    <h3 className="font-display text-xl uppercase text-[#fbf6ee] mb-1.5">
                      {slot.event}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/70">
                      {slot.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              id="entry"
              className="lg:col-span-6 scroll-mt-32 lg-glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-6"
            >
              <div>
                <h2 className="font-display text-2xl uppercase text-[#fbf6ee] mb-6">
                  Entry Checklist
                </h2>
                <ul className="space-y-3.5">
                  {checklist.map(item => (
                    <li
                      key={item.text}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/85"
                    >
                      <item.icon
                        className={`mt-0.5 w-4 h-4 shrink-0 ${
                          item.tone === "ok"
                            ? "text-[#b5e1be]"
                            : "text-[#f3b572]"
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/65">
                  Questions on group arrival or accessibility?
                </span>
                <Link
                  href={ROUTES.contact}
                  className="lg-pill-glass !min-h-[38px] !px-4 !py-1.5"
                >
                  <span>Contact Host Team</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
