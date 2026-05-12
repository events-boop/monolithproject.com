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
  Waves,
} from "lucide-react";
import SEO from "@/components/SEO";

type BioLink = {
  label: string;
  eyebrow: string;
  sub: string;
  href: string;
  icon: typeof Sun;
  variant?: "primary" | "warm" | "cool";
  external?: boolean;
};

const FIRST_ACCESS_HREF = "/go/waitlist/chasing-sunsets";
const CHAT_HREF = "/go/waitlist/chasing-sunsets?utm_content=join_chat";
const TICKET_HUB_HREF = "/chasing-sunsets#chasing-tickets";
const RECAP_HREF = "https://youtu.be/9R6XH7JZlJI?si=L6IvNCRrC31yjrpA";
const SOUNDCLOUD_HREF = "https://soundcloud.com/chasing-sun-sets";
const GALLERY_HREF = "https://khrysseesyou.pic-time.com/-chasingsunsets4thofjuly/register";

const schedule = [
  {
    date: "July 4",
    title: "Independence Day On The Lake",
    venue: "Castaways, Chicago",
    time: "1 PM - 10 PM",
    href: TICKET_HUB_HREF,
  },
  {
    date: "August 22",
    title: "Summer Chapter",
    venue: "Castaways, Chicago",
    time: "1 PM - 10 PM",
    href: TICKET_HUB_HREF,
  },
  {
    date: "September 19",
    title: "Season Finale",
    venue: "Castaways, Chicago",
    time: "1 PM - 10 PM",
    href: TICKET_HUB_HREF,
  },
];

const links: BioLink[] = [
  {
    label: "Join First Access 🌅",
    eyebrow: "Laylo",
    sub: "Ticket drops, lineup announcements & early access.",
    href: FIRST_ACCESS_HREF,
    icon: Sun,
    variant: "primary",
  },
  {
    label: "2026 Schedule / Tickets",
    eyebrow: "Posh",
    sub: "The season path for July 4, August 22, and the finale.",
    href: TICKET_HUB_HREF,
    icon: Ticket,
    variant: "warm",
  },
  {
    label: "Join The Chat",
    eyebrow: "Community",
    sub: "SMS, email, and IG reminders now. Discord can plug in later.",
    href: CHAT_HREF,
    icon: Sparkles,
    variant: "cool",
  },
  {
    label: "VIP / Tables",
    eyebrow: "Fillout",
    sub: "Groups, birthdays, tables, and elevated lakefront experiences.",
    href: "/vip",
    icon: Users,
  },
  {
    label: "Watch The Recap",
    eyebrow: "YouTube",
    sub: "See the energy from last year's Chasing Sun(Sets).",
    href: RECAP_HREF,
    icon: Play,
    external: true,
  },
  {
    label: "Follow The Sound",
    eyebrow: "SoundCloud",
    sub: "Mixes, radio, and artist discovery from the Chasing archive.",
    href: SOUNDCLOUD_HREF,
    icon: Headphones,
    external: true,
    variant: "cool",
  },
  {
    label: "View The Gallery",
    eyebrow: "Pic-Time",
    sub: "Photos and lakefront moments from the last chapter.",
    href: GALLERY_HREF,
    icon: Camera,
    external: true,
  },
  {
    label: "Partner Inquiry",
    eyebrow: "Fillout",
    sub: "Venues, brands, sponsors, and city collaborations.",
    href: "/partners",
    icon: Handshake,
  },
];

function trackSunsetsClick(label: string, href: string) {
  if (typeof window === "undefined") return;
  const win = window as Window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  };

  win.gtag?.("event", "sunsets_bio_click", {
    link_label: label,
    link_url: href,
    page_path: "/sunsets",
  });
}

function LinkCard({ item, index }: { item: BioLink; index: number }) {
  const Icon = item.icon;
  const isPrimary = item.variant === "primary";
  const glowClass =
    item.variant === "cool"
      ? "group-hover:border-cyan-200/35 group-hover:bg-cyan-100/[0.08]"
      : "group-hover:border-amber-200/35 group-hover:bg-amber-100/[0.08]";

  return (
    <motion.a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + index * 0.045, duration: 0.42 }}
      onClick={() => trackSunsetsClick(item.label, item.href)}
      data-sunsets-link={item.eyebrow.toLowerCase()}
      className={`group relative flex min-h-[82px] items-center gap-3 overflow-hidden rounded-[1.35rem] border p-3.5 transition duration-300 ${
        isPrimary
          ? "border-amber-100/60 bg-[#F2C16D] text-[#150D06] shadow-[0_20px_70px_rgba(232,184,109,0.22)]"
          : `border-white/10 bg-white/[0.055] text-stone-100 backdrop-blur-xl ${glowClass}`
      }`}
    >
      <span
        className={`absolute inset-y-0 left-0 w-1 ${
          item.variant === "cool" ? "bg-cyan-200" : "bg-amber-200"
        } opacity-70`}
      />
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          isPrimary ? "bg-black text-amber-100" : "bg-black/45 text-amber-100"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[9px] font-black uppercase tracking-[0.28em] ${isPrimary ? "text-black/55" : "text-amber-100/55"}`}>
          {item.eyebrow}
        </span>
        <span className="mt-1 flex items-center justify-between gap-3">
          <span className="text-[13px] font-black uppercase tracking-[0.02em]">
            {item.label}
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
        <span className={`mt-1 block text-xs leading-snug ${isPrimary ? "text-black/68" : "text-stone-400"}`}>
          {item.sub}
        </span>
      </span>
    </motion.a>
  );
}

export default function SunsetsLinkBio() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#070705] text-stone-100">
      <SEO
        title="Chasing Sun(Sets) | Chicago Lakefront House Music"
        description="Official Chasing Sun(Sets) mini hub for first access, tickets, VIP tables, recap video, SoundCloud, gallery, and partner inquiries."
        canonicalPath="/sunsets"
        image="/images/chasing-sunsets-premium.webp"
        absoluteTitle
      />

      <section className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,196,116,0.28),transparent_35%),radial-gradient(circle_at_18%_22%,rgba(47,213,229,0.12),transparent_28%),linear-gradient(180deg,#151007_0%,#070705_46%,#020202_100%)]" />
        <div className="absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(255,232,188,0.18),transparent)]" />
        <div className="absolute -left-28 top-40 h-56 w-56 rounded-full bg-cyan-200/10 blur-3xl" />
        <div className="absolute -right-28 bottom-24 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative w-full max-w-[460px]"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/64 shadow-[0_35px_120px_rgba(0,0,0,0.58)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_13%,rgba(255,210,128,0.30),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_38%)]" />
            <div className="absolute left-1/2 top-8 h-36 w-36 -translate-x-1/2 rounded-full bg-amber-200/24 blur-3xl" />

            <div className="relative px-4 pb-5 pt-6 sm:px-5 sm:pb-6 sm:pt-7">
              <header className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-amber-100/25 bg-black/45 shadow-[0_0_80px_rgba(232,184,109,0.20)]">
                  <Sun className="h-9 w-9 text-amber-100" strokeWidth={1.25} />
                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.44em] text-amber-100/68">
                  The Monolith Project Presents
                </p>
                <h1 className="mt-3 text-[clamp(3.15rem,17vw,5.4rem)] font-black uppercase leading-[0.78] tracking-[-0.045em] text-stone-50">
                  Chasing
                  <br />
                  Sun(Sets)
                </h1>
                <p className="mx-auto mt-4 max-w-xs text-sm italic text-[#F4D7A1]">
                  Watch the sun. Stay for the (sets).
                </p>
                <p className="mx-auto mt-4 max-w-[21rem] text-sm leading-relaxed text-[#F4D7A1]/78">
                  Join the Chasing Sun(Sets) circle for first access, ticket drops, VIP tables, recap video, sound, gallery, and partner inquiries.
                </p>
                <p className="mx-auto mt-3 w-fit rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">
                  monolithproject.com/sunsets
                </p>
              </header>

              <div className="mt-5 grid grid-cols-3 gap-2 rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-2 text-center">
                {["Lakefront", "House", "Chicago"].map((item) => (
                  <div key={item} className="rounded-2xl bg-black/30 px-2 py-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-stone-500">
                      Signal
                    </p>
                    <p className="mt-1 text-[11px] font-black uppercase tracking-[0.08em] text-stone-100">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {links.map((item, index) => (
                  <LinkCard key={item.label} item={item} index={index} />
                ))}
              </div>

              <section className="mt-5 rounded-[1.6rem] border border-amber-200/14 bg-[#160f07]/72 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.32em] text-amber-100/55">
                      2026 Schedule
                    </p>
                    <h2 className="mt-1 text-lg font-black uppercase tracking-[-0.025em] text-stone-50">
                      Upcoming Chapters
                    </h2>
                  </div>
                  <Waves className="h-5 w-5 text-cyan-100/70" />
                </div>

                <div className="space-y-2.5">
                  {schedule.map((event, index) => (
                    <motion.a
                      key={event.date}
                      href={event.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.48 + index * 0.05, duration: 0.36 }}
                      onClick={() => trackSunsetsClick(`${event.date} tickets`, event.href)}
                      className="group block rounded-[1.1rem] border border-white/10 bg-black/34 p-3 transition hover:border-amber-200/35 hover:bg-black/48"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="text-xs font-black uppercase tracking-[0.22em] text-amber-100">
                            {event.date}
                          </span>
                          <span className="mt-1 block text-sm font-black uppercase leading-tight text-stone-100">
                            {event.title}
                          </span>
                          <span className="mt-1.5 block text-xs leading-relaxed text-stone-400">
                            {event.venue} / {event.time}
                          </span>
                        </span>
                        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-black transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </span>
                    </motion.a>
                  ))}
                </div>
              </section>

              <footer className="mt-5 border-t border-white/10 pt-5 text-center">
                <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">
                  <Sparkles className="h-3.5 w-3.5 text-amber-100" />
                  Official Bio Link
                </div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                  Togetherness is the frequency.
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-stone-500">
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
