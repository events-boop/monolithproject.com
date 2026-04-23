import { ArrowUpRight, CheckCircle2, Clock3, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import {
  getEventEyebrow,
  getEventVenueLabel,
  getExperienceEvent,
  getPrimaryTicketUrl,
} from "@/lib/siteExperience";
import { getEventPillToneClass } from "@/lib/ctaTone";

const venueMapHref =
  "https://maps.google.com/?q=1240+W+Randolph+St+Chicago+IL+60607";

const checklist = [
  "Valid government ID",
  "Ticket QR code ready before you enter the line",
  "Card or phone wallet for bar and table service",
  "Rideshare exit plan if you are staying late",
];

const houseNotes = [
  "Doors open at the listed start time. Arriving in the first hour keeps entry friction low.",
  "Dress elevated, but comfortable enough to stay in the room for hours.",
  "Photography is active at featured nights, so expect recap capture throughout the venue.",
];

export default function ExperienceGuidePanel() {
  const event = getExperienceEvent("guide");

  if (!event) {
    return null;
  }

  const ticketUrl = getPrimaryTicketUrl(event);
  const headline = event.headline || event.title;

  return (
    <div className="px-6 pb-10 md:px-10 md:pb-12">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-primary/85">
            <Sparkles className="h-3.5 w-3.5" />
            {getEventEyebrow(event)}
          </div>

          <h2 className="mt-5 font-display text-3xl uppercase leading-[0.92] text-white md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-[15px]">
            {event.experienceIntro || event.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Date + Time
              </p>
              <p className="mt-2 font-display text-xl uppercase text-white">
                {event.date}
              </p>
              <p className="mt-1 text-sm text-white/50">{event.time}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Venue
              </p>
              <p className="mt-2 font-display text-xl uppercase text-white">
                {event.venue}
              </p>
              <p className="mt-1 text-sm text-white/50">{getEventVenueLabel(event)}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                Sound
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {event.sound || "House-led curation, tuned for a long room."}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                House Rules
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {event.age || "21+"} entry. {event.dress || "Elevated nightlife attire."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-primary" />
              <h3 className="font-display text-xl uppercase text-white">Entry Checklist</h3>
            </div>

            <div className="mt-5 space-y-3">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-3xl border border-white/10 bg-black/15 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="font-display text-xl uppercase text-white">Room Notes</h3>
            </div>

            <div className="mt-5 space-y-3">
              {houseNotes.map((note) => (
                <p
                  key={note}
                  className="rounded-3xl border border-white/10 bg-black/15 px-4 py-3 text-sm leading-relaxed text-white/70"
                >
                  {note}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-[2rem] border border-white/10 bg-white/[0.025] p-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 text-primary" />
          <div>
            <p className="font-display text-xl uppercase text-white">Arrival Route</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              Use the main entrance for general admission. VIP and table guests should check in
              on the left side of the marquee. If you are coordinating a group, send everyone the
              map link in advance so the room arrives together.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {ticketUrl && (
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${getEventPillToneClass(event)} btn-pill-compact group`}
            >
              Tickets
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

          <a
            href={venueMapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-outline btn-pill-compact group"
          >
            Open Maps
            <ArrowUpRight className="h-4 w-4" />
          </a>

          <Link
            href="/guide"
            className="btn-pill-outline btn-pill-outline-monolith btn-pill-compact group"
          >
            Full Guide
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
