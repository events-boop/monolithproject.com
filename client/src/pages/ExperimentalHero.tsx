import { Link } from "wouter";
import { ArrowUpRight, Menu } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { getEventCta } from "@/lib/cta";
import {
  getEventEyebrow,
  getEventVenueLabel,
  getExperienceEvent,
} from "@/lib/siteExperience";

const MONOLITH_RENDER_SRC = "/video/monolith-transparent.webm";

function MonolithObject() {
  return (
    <div className="relative h-[58svh] min-h-[30rem] w-[76vw] max-w-[34rem] md:h-[66svh] md:max-w-[38rem]">
      <div
        className="absolute inset-x-[13%] inset-y-0 overflow-hidden border border-white/12 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.22)_18%,rgba(0,0,0,0.82)_44%,rgba(255,255,255,0.2)_66%,rgba(0,0,0,0.94))] shadow-[0_0_90px_rgba(255,255,255,0.12),inset_0_0_80px_rgba(255,255,255,0.08)]"
        style={{ clipPath: "polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)" }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.24),transparent_22%),radial-gradient(circle_at_42%_64%,rgba(255,255,255,0.18),transparent_24%)]" />
        <div className="absolute left-[48%] top-0 h-full w-[10%] bg-white/16 blur-3xl" />
        <div className="absolute inset-x-[18%] top-0 h-px bg-white/70" />
        <div className="absolute inset-x-[8%] bottom-0 h-1/3 bg-gradient-to-t from-black via-black/66 to-transparent" />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-[20%] bottom-[-2%] h-[16%] rounded-full bg-white/20 blur-3xl"
      />

      <video
        className="absolute inset-0 h-full w-full object-contain mix-blend-screen"
        src={MONOLITH_RENDER_SRC}
        autoPlay
        loop
        muted
        playsInline
        aria-label="Monolith render"
        onError={event => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

function HeroTopBar() {
  return (
    <header className="relative z-40 flex min-h-[4.75rem] items-center justify-between rounded-full border border-white/10 bg-[#0d0b0d]/72 px-5 shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl md:px-8">
      <Link
        href="/"
        className="font-display text-2xl uppercase tracking-[0.04em] text-white md:text-[1.65rem]"
      >
        Monolith
      </Link>

      <nav
        className="hidden items-center gap-9 font-mono text-[10px] uppercase tracking-[0.3em] text-white/54 lg:flex"
        aria-label="Hero editorial links"
      >
        <Link className="transition hover:text-white" href="/schedule">
          Chapters
        </Link>
        <Link className="transition hover:text-white" href="/radio">
          Radio
        </Link>
        <Link className="transition hover:text-white" href="/archive">
          Archive
        </Link>
      </nav>

      <Link
        href="/contact"
        aria-label="Open contact"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.08] text-white transition hover:bg-white/14"
      >
        <Menu className="h-7 w-7" />
      </Link>
    </header>
  );
}

export default function ExperimentalHero() {
  const featuredEvent = getExperienceEvent("hero");
  const cta = getEventCta(featuredEvent);
  const ctaIsExternal = /^https?:\/\//i.test(cta.href);
  const eventTitle =
    featuredEvent?.headline || featuredEvent?.title || "The Next Chapter";
  const eventEyebrow = getEventEyebrow(featuredEvent);
  const eventDate = featuredEvent?.date || "Date TBA";
  const eventVenue = featuredEvent
    ? getEventVenueLabel(featuredEvent)
    : "Chicago";

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_40%,rgba(255,255,255,0.09),transparent_24%),radial-gradient(circle_at_84%_76%,rgba(255,60,48,0.13),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.92))]" />

      <div
        className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <h1
          className="font-display text-[clamp(7rem,26vw,34rem)] uppercase leading-[0.72] tracking-[0] text-white/[0.14] md:text-white/[0.12] xl:text-white/[0.15]"
          style={{ transform: "scaleY(1.3)" }}
        >
          MONOLITH
        </h1>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center pt-20 opacity-75 md:pt-0 md:opacity-95">
        <MonolithObject />
      </div>

      <div className="relative z-30 flex min-h-[100svh] flex-col px-5 py-6 md:px-10 md:py-8 xl:px-12">
        <HeroTopBar />

        <div className="grid flex-1 items-end gap-8 pb-8 pt-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-10 md:pb-10 md:pt-16">
          <div className="hidden max-w-sm rounded-[1.25rem] border border-white/10 bg-black/36 p-5 backdrop-blur-md md:block md:bg-transparent md:p-0 md:backdrop-blur-0">
            <div className="font-mono text-[10px] uppercase leading-7 tracking-[0.32em] text-white/56">
              <span className="block text-white/80">The Monolith Project</span>
              <span className="block">Chicago, IL</span>
              <span className="mt-3 block">Sound / Culture / Connection</span>
            </div>
            <div className="mt-7 h-px w-10 bg-white/28" />
          </div>

          <div className="justify-self-stretch rounded-[1.5rem] border border-white/10 bg-black/52 p-5 shadow-[0_26px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl md:max-w-[42rem] md:justify-self-end md:p-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
              Current Signal
            </span>
            <h2 className="mt-3 max-w-[14ch] break-normal hyphens-none text-balance font-display text-[clamp(2.45rem,10vw,3.7rem)] uppercase leading-[0.84] tracking-[0.01em] text-white md:ml-auto md:max-w-[11.8ch] md:text-right md:text-[clamp(3.7rem,5.25vw,5.35rem)] md:leading-[0.82] md:tracking-[0.02em]">
              {eventTitle}
            </h2>
            <div className="mt-5 grid gap-3 border-t border-white/12 pt-5 font-mono text-[10px] uppercase tracking-[0.26em] text-white/64 sm:grid-cols-3">
              <span>{eventEyebrow}</span>
              <span>{eventDate}</span>
              <span>{eventVenue}</span>
            </div>

            <MagneticButton strength={0.16}>
              <a
                href={cta.href}
                target={ctaIsExternal ? "_blank" : undefined}
                rel={ctaIsExternal ? "noopener noreferrer" : undefined}
                className="mt-7 inline-flex min-h-[4rem] w-full items-center justify-center rounded-full bg-white px-8 font-mono text-[11px] font-black uppercase tracking-[0.28em] text-black transition hover:-translate-y-0.5 hover:bg-primary hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:w-auto"
              >
                {cta.label}
                <ArrowUpRight className="ml-4 h-4 w-4" strokeWidth={2.5} />
              </a>
            </MagneticButton>
          </div>
        </div>

        <p className="border-t border-white/8 py-5 text-center font-mono text-[10px] uppercase tracking-[0.38em] text-white/38">
          A living archive of sound, story, and connection.
        </p>
      </div>
    </div>
  );
}
