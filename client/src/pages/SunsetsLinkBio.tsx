import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Headphones,
  Handshake,
  Play,
  Sparkles,
  Sun,
  Ticket,
  Users,
} from "lucide-react";
import SEO from "@/components/SEO";
import { trackFunnelPageView, trackLinkClick } from "@/lib/api";

type BioLink = {
  type?: "link" | "youtube" | "soundcloud" | "gallery";
  label: string;
  buttonName: string;
  eyebrow: string;
  sub: string;
  href: string;
  eventSlug?: string;
  eventDate?: string;
  interestType: string;
  channel: string;
  icon: typeof Sun;
  image?: string;
  variant?: "primary" | "warm" | "cool";
  external?: boolean;
};

const FIRST_ACCESS_HREF = "/go/waitlist/chasing-sunsets";
const CHAT_HREF = "/go/waitlist/chasing-sunsets?utm_content=join_chat";
const TICKET_HUB_HREF = "/chasing-sunsets#chasing-tickets";
const RECAP_HREF = "https://youtu.be/9R6XH7JZlJI?si=L6IvNCRrC31yjrpA";
const SOUNDCLOUD_HREF = "https://soundcloud.com/chasing-sun-sets";
const GALLERY_HREF = "https://khrysseesyou.pic-time.com/-chasingsunsets4thofjuly/gallery";
const JULY_4_EVENT_SLUG = "chasing-sunsets-july-4-2026";
const AUGUST_22_EVENT_SLUG = "chasing-sunsets-august-22-2026";
const SEPTEMBER_19_EVENT_SLUG = "chasing-sunsets-september-19-2026";

const schedule = [
  {
    date: "July 4",
    title: "Independence Day On The Lake",
    venue: "Castaways, Chicago",
    time: "3 PM - 10 PM",
    href: TICKET_HUB_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
  },
  {
    date: "Aug 22",
    title: "Summer Chapter",
    venue: "Castaways, Chicago",
    time: "Golden Hour",
    href: TICKET_HUB_HREF,
    eventSlug: AUGUST_22_EVENT_SLUG,
  },
  {
    date: "Sept 19",
    title: "Season Finale",
    venue: "Castaways, Chicago",
    time: "Golden Hour",
    href: TICKET_HUB_HREF,
    eventSlug: SEPTEMBER_19_EVENT_SLUG,
  },
];

const links: BioLink[] = [
  {
    label: "Join First Access",
    buttonName: "Join First Access",
    eyebrow: "Laylo",
    sub: "Ticket drops, lineup announcements & early access.",
    href: FIRST_ACCESS_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "first_access_click",
    channel: "Laylo",
    icon: Sun,
    variant: "primary",
  },
  {
    label: "2026 Schedule / Tickets",
    buttonName: "2026 Schedule / Tickets",
    eyebrow: "Posh",
    sub: "See the season dates and ticket path for each chapter.",
    href: TICKET_HUB_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "ticket_click",
    channel: "Posh",
    icon: Ticket,
    variant: "warm",
  },
  {
    label: "Join The Chat",
    buttonName: "Join The Chat",
    eyebrow: "Community",
    sub: "SMS, email, and IG reminders now. Discord can plug in later.",
    href: CHAT_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "first_access_click",
    channel: "Laylo",
    icon: Sparkles,
    variant: "cool",
  },
  {
    label: "VIP / Tables",
    buttonName: "VIP / Tables",
    eyebrow: "Fillout",
    sub: "Groups, birthdays, tables, and elevated lakefront experiences.",
    href: "https://chasingsunsets.vip",
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "vip_click",
    channel: "Fillout",
    icon: Users,
    external: true,
  },
  {
    type: "youtube",
    label: "View Last Year's Event",
    buttonName: "Watch Recap",
    eyebrow: "YouTube",
    sub: "See the energy from last year's Chasing Sun(Sets).",
    href: RECAP_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "recap_click",
    channel: "YouTube",
    icon: Play,
    image: "/images/archive/chasing-sunsets/css-s3-1.jpg",
    external: true,
  },
  {
    type: "soundcloud",
    label: "Featured: Chris IDH",
    buttonName: "Follow the Sound",
    eyebrow: "SoundCloud",
    sub: "Mixes, radio, and artist discovery from the Chasing archive.",
    href: SOUNDCLOUD_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "soundcloud_click",
    channel: "SoundCloud",
    icon: Headphones,
    image: "https://i1.sndcdn.com/artworks-FMot44uoQiVdP1Uj-bYxapA-t500x500.jpg",
    external: true,
    variant: "cool",
  },
  {
    type: "gallery",
    label: "View The Gallery",
    buttonName: "View Gallery",
    eyebrow: "Pic-Time",
    sub: "Photos and lakefront moments from the last chapter.",
    href: GALLERY_HREF,
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "gallery_click",
    channel: "Pic-Time",
    icon: Camera,
    image: "/images/archive/chasing-sunsets/css-s3-4.jpg",
    external: true,
  },
  {
    label: "Partner Inquiry",
    buttonName: "Partner Inquiry",
    eyebrow: "Fillout",
    sub: "Venues, brands, sponsors, and city collaborations.",
    href: "/partners",
    eventSlug: JULY_4_EVENT_SLUG,
    eventDate: "2026-07-04",
    interestType: "partner_form_submit",
    channel: "Fillout",
    icon: Handshake,
  },
];

function trackSunsetsClick(item: Pick<BioLink, "buttonName" | "href" | "eventSlug" | "eventDate" | "interestType" | "channel">) {
  if (typeof window === "undefined") return;
  const win = window as Window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  };

  win.gtag?.("event", "sunsets_bio_click", {
    link_label: item.buttonName,
    link_url: item.href,
    page_path: "/sunsets",
    event_slug: item.eventSlug,
    interest_type: item.interestType,
  });

  trackLinkClick({
    buttonName: item.buttonName,
    destinationUrl: item.href,
    pagePath: "/sunsets",
    eventSlug: item.eventSlug,
    eventDate: item.eventDate,
    interestType: item.interestType,
    channel: item.channel,
    source: "sunsets_link_bio",
  });
}

function LinkCard({ item, index }: { item: BioLink; index: number }) {
  const Icon = item.icon;
  const isPrimary = item.variant === "primary";
  const cardClass = isPrimary
    ? "border-[#E8B86D]/70 bg-[#FBF5ED] text-[#050403] shadow-[0_16px_44px_rgba(232,184,109,0.18)] hover:border-[#FFD28A] hover:bg-white"
    : item.variant === "cool"
      ? "border-[#193B3B]/70 bg-[#071110]/50 text-white hover:border-[#193B3B] hover:bg-[#193B3B]/25"
      : "border-[#5C4331]/40 bg-[#18110D]/52 text-white hover:border-[#E8B86D]/45 hover:bg-[#3A2816]/30";
  const iconClass = isPrimary
    ? "border-[#050403]/12 bg-[#050403] text-[#E8B86D]"
    : "border-white/10 bg-black/40 text-white/70";
  const eyebrowClass = isPrimary ? "text-[#050403]/55" : "text-white/40";
  const titleClass = isPrimary ? "text-[#050403]" : "text-white/90 group-hover:text-white";
  const subClass = isPrimary ? "text-[#050403]/68" : "text-white/50 group-hover:text-white/70";
  const arrowClass = isPrimary ? "text-[#050403]/70 opacity-100" : "text-white/30 group-hover:text-white/80";
  const glowClass =
    item.variant === "cool"
      ? "group-hover:border-[#193B3B]/80 group-hover:bg-[#193B3B]/25"
      : "group-hover:border-[#E8B86D]/50 group-hover:bg-[#E8B86D]/5";

  return (
    <motion.a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + index * 0.045, duration: 0.42 }}
      onClick={() => trackSunsetsClick(item)}
      data-sunsets-link={item.eyebrow.toLowerCase()}
      className={`group relative flex min-h-[76px] items-center gap-4 overflow-hidden rounded-[1.1rem] border p-4 transition duration-500 hover:-translate-y-0.5 ${cardClass} ${isPrimary ? "" : glowClass}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-500 group-hover:scale-110 ${iconClass}`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[9px] font-sans font-semibold uppercase tracking-[0.2em] ${eyebrowClass}`}>
          {item.eyebrow}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-3">
          <span className={`text-[14px] font-display tracking-[0.03em] transition-colors ${titleClass}`}>
            {item.label}
          </span>
          <ArrowUpRight className={`h-4 w-4 shrink-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 ${arrowClass}`} strokeWidth={1.5} />
        </span>
        <span className={`mt-1 block text-xs font-light leading-relaxed transition-colors ${subClass}`}>
          {item.sub}
        </span>
      </span>
    </motion.a>
  );
}

export default function SunsetsLinkBio() {
  useEffect(() => {
    trackFunnelPageView({
      pagePath: "/sunsets",
      eventSlug: JULY_4_EVENT_SLUG,
      source: "sunsets_link_bio",
    });
  }, []);

  return (
    <main className="min-h-[100dvh] w-full overflow-hidden bg-[#0B0A09] text-white/90 font-sans selection:bg-[#E8B86D]/30">
      <SEO
        title="Chasing Sun(Sets) | Chicago Lakefront House Music"
        description="Official Chasing Sun(Sets) mini hub for first access, tickets, VIP tables, recap video, SoundCloud, gallery, and partner inquiries."
        canonicalPath="/sunsets"
        image="/images/chasing-sunsets-premium.webp"
        absoluteTitle
      />

      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start px-4 py-12 sm:px-6">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,184,109,0.14),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(25,59,59,0.24),transparent_42%),linear-gradient(180deg,#0B0A09_0%,#050403_100%)] pointer-events-none" />
        <div className="fixed inset-0 opacity-[0.08] pointer-events-none [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[480px] z-10"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-[#5C4331]/45 bg-[#050403]/82 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
            {/* Subtle top glare */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="relative px-5 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12">
              <header className="text-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#E8B86D]/20 bg-black/60 shadow-[0_0_40px_rgba(232,184,109,0.15)]"
                >
                  <Sun className="h-7 w-7 text-[#E8B86D]" strokeWidth={1} />
                </motion.div>

                <p className="text-[9px] font-sans font-light uppercase tracking-[0.4em] text-[#E8B86D]/80">
                  The Monolith Project Presents
                </p>
                <h1 className="mt-4 bg-gradient-to-b from-white to-white/48 bg-clip-text font-display text-[clamp(2.75rem,11vw,4.5rem)] uppercase leading-[0.92] tracking-[-0.035em] text-transparent drop-shadow-[0_0_30px_rgba(232,184,109,0.3)]">
                  Chasing
                  <br />
                  Sun(Sets)
                </h1>
                <p className="mx-auto mt-6 max-w-xs text-xs font-light tracking-[0.1em] uppercase text-[#E8B86D]/90">
                  Watch the sun. Stay for the (sets).
                </p>
                <p className="mx-auto mt-5 max-w-[21rem] text-sm font-light leading-relaxed text-white/50">
                  Join the Chasing Sun(Sets) circle for first access, ticket drops, VIP tables, recap video, sound, gallery, and partner inquiries.
                </p>
              </header>

              {/* Signals Grid */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {["Lakefront", "House", "Chicago"].map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    key={item} 
                    className="flex flex-col items-center justify-center rounded-lg border border-[#5C4331]/40 bg-[#18110D]/55 py-3 transition-colors hover:border-[#E8B86D]/30 hover:bg-[#E8B86D]/5"
                  >
                    <p className="text-[8px] font-sans font-light uppercase tracking-[0.2em] text-white/40">
                      Signal
                    </p>
                    <p className="mt-1.5 text-[10px] font-display tracking-[0.08em] text-white/80">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* July 4th Featured Block */}
              <motion.a
                href={FIRST_ACCESS_HREF}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => trackSunsetsClick({
                  buttonName: "July 4 Tickets",
                  href: FIRST_ACCESS_HREF,
                  eventSlug: JULY_4_EVENT_SLUG,
                  eventDate: "2026-07-04",
                  interestType: "ticket_click",
                  channel: "Laylo",
                })}
                className="mt-8 group relative block overflow-hidden rounded-[1.4rem] border border-[#E8B86D]/40 bg-gradient-to-br from-[#E8B86D]/20 to-black/60 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#E8B86D]/70 hover:shadow-[0_15px_40px_rgba(232,184,109,0.25)]"
              >
                <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(ellipse_at_top_right,rgba(232,184,109,0.15),transparent_60%)]" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-[#E8B86D] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-black shadow-[0_0_15px_rgba(232,184,109,0.5)]">
                      Next Chapter
                    </span>
                    <h2 className="mt-3 font-display text-3xl uppercase leading-[0.9] tracking-[-0.02em] text-white">
                      July 4th
                      <br />
                      <span className="text-[#E8B86D]">Open Air</span>
                    </h2>
                    <p className="mt-2 text-xs font-light text-white/70">
                      Castaways, Chicago • 3 PM - 10 PM
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8B86D] text-black transition-transform duration-500 group-hover:scale-110">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </div>
                </div>
                <div className="relative z-10 mt-4 border-t border-white/10 pt-3">
                  <p className="flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.2em] text-[#E8B86D]">
                    <Sparkles className="h-3 w-3" />
                    Join First Access Waitlist
                  </p>
                </div>
              </motion.a>

              <div className="mt-5 rounded-[1.25rem] border border-[#5C4331]/45 bg-[#18110D]/70 p-3">
                <div className="flex items-center justify-between gap-3 px-1 pb-2">
                  <p className="text-[9px] font-sans font-light uppercase tracking-[0.26em] text-[#E8B86D]/80">
                    2026 Schedule
                  </p>
                  <a
                    href={TICKET_HUB_HREF}
                    onClick={() =>
                      trackSunsetsClick({
                        buttonName: "Schedule View",
                        href: TICKET_HUB_HREF,
                        eventSlug: JULY_4_EVENT_SLUG,
                        eventDate: "2026-07-04",
                        interestType: "schedule_view",
                        channel: "Posh",
                      })
                    }
                    className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#FBF5ED] transition hover:text-[#E8B86D]"
                  >
                    Tickets
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
                <div className="grid gap-2">
                  {schedule.map((event) => (
                    <a
                      key={event.eventSlug}
                      href={event.href}
                      onClick={() =>
                        trackSunsetsClick({
                          buttonName: `${event.date} Schedule`,
                          href: event.href,
                          eventSlug: event.eventSlug,
                          eventDate:
                            event.eventSlug === JULY_4_EVENT_SLUG
                              ? "2026-07-04"
                              : event.eventSlug === AUGUST_22_EVENT_SLUG
                                ? "2026-08-22"
                                : "2026-09-19",
                          interestType: "schedule_view",
                          channel: "Posh",
                        })
                      }
                      className="group grid grid-cols-[3.85rem_1fr_auto] items-center gap-3 rounded-xl border border-white/5 bg-black/22 px-3 py-3 transition hover:border-[#A87B3F]/55 hover:bg-[#3A2816]/45"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#FFD28A]">
                        {event.date}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12px] font-semibold uppercase leading-snug tracking-[0.06em] text-white/88">
                          {event.title}
                        </span>
                        <span className="mt-1 block text-[11px] leading-snug text-white/45">
                          {event.venue} · {event.time}
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#E8B86D]" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Links Array */}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((item, index) => {
                  if (item.type === "youtube" || item.type === "soundcloud" || item.type === "gallery") {
                    const Icon = item.icon;
                    const actionLabel =
                      item.type === "youtube"
                        ? "Watch on YouTube"
                        : item.type === "soundcloud"
                          ? "Open SoundCloud"
                          : "Open Gallery";
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.045, duration: 0.42 }}
                        onClick={() => trackSunsetsClick(item)}
                        className="group my-3 block overflow-hidden rounded-[1.2rem] border border-[#5C4331]/45 bg-[#18110D]/70 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:border-[#A87B3F]/70"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-[#E8B86D]" />
                            <span className="text-[9px] font-sans font-light uppercase tracking-[0.2em] text-[#E8B86D]">
                              {item.eyebrow}
                            </span>
                          </div>
                          <span className="text-[10px] font-display tracking-[0.05em] text-white/60">
                            {item.label}
                          </span>
                        </div>
                        <div className="relative min-h-[156px] overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover opacity-58 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-72"
                              loading="lazy"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,0.18)_0%,rgba(5,4,3,0.88)_100%)]" />
                          <div className="relative flex min-h-[156px] flex-col justify-end p-4">
                            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8B86D] text-[#050403] shadow-[0_0_24px_rgba(232,184,109,0.35)] transition group-hover:scale-105">
                              <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                            </div>
                            <p className="max-w-[15rem] text-sm font-semibold leading-snug text-white/90">
                              {item.sub}
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center justify-between border-t border-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#FBF5ED] transition group-hover:text-[#E8B86D]">
                          {actionLabel}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </motion.a>
                    );
                  }

                  return <LinkCard key={item.label} item={item} index={index} />;
                })}
              </div>

              {/* Removed Schedule Section */}

              {/* Footer */}
              <footer className="mt-10 pt-4 text-center">
                <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-[9px] font-sans font-light uppercase tracking-[0.3em] text-white/40 shadow-sm backdrop-blur-md transition-colors hover:border-[#E8B86D]/30 hover:text-[#E8B86D]/80">
                  <Sparkles className="h-3.5 w-3.5 text-[#E8B86D]/70" strokeWidth={1.5} />
                  monolithproject.com/sunsets
                </div>
                <p className="text-[10px] uppercase font-light tracking-[0.3em] text-white/30">
                  Togetherness is the frequency.
                </p>
                <p className="mt-1.5 text-[10px] uppercase font-light tracking-[0.3em] text-white/30">
                  Music is the guide.
                </p>
              </footer>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
