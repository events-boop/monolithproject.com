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
  type?: "link" | "youtube" | "soundcloud";
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
    time: "3 PM - 10 PM",
    href: TICKET_HUB_HREF,
  },
  {
    date: "August 19",
    title: "Late Summer Chapter",
    venue: "Castaways, Chicago",
    time: "Golden Hour",
    href: TICKET_HUB_HREF,
  },
  {
    date: "August 22",
    title: "Late Summer Chapter",
    venue: "Castaways, Chicago",
    time: "Golden Hour",
    href: TICKET_HUB_HREF,
  },
  {
    date: "September 19",
    title: "Fall Chapter",
    venue: "Castaways, Chicago",
    time: "Golden Hour",
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
    type: "youtube",
    label: "Watch The Recap",
    eyebrow: "YouTube",
    sub: "See the energy from last year's Chasing Sun(Sets).",
    href: RECAP_HREF,
    icon: Play,
    external: true,
  },
  {
    type: "soundcloud",
    label: "Featured: Chris IDH",
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
      ? "group-hover:border-cyan-200/50 group-hover:bg-cyan-900/10"
      : "group-hover:border-[#E8B86D]/50 group-hover:bg-[#E8B86D]/5";

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
      className={`group relative flex min-h-[72px] items-center gap-4 overflow-hidden border-b border-white/5 p-4 transition duration-500 hover:-translate-y-0.5 ${
        isPrimary
          ? "border-b-[#E8B86D]/40 bg-gradient-to-r from-[#E8B86D]/10 to-transparent"
          : `${glowClass} bg-transparent`
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/40 ${
          isPrimary ? "text-[#E8B86D] border-[#E8B86D]/30" : "text-white/70"
        } transition-transform duration-500 group-hover:scale-110`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-[9px] font-sans font-light uppercase tracking-[0.2em] ${isPrimary ? "text-[#E8B86D]" : "text-white/40"}`}>
          {item.eyebrow}
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-3">
          <span className="text-[14px] hero-wordmark font-light tracking-[0.05em] text-white/90 group-hover:text-white transition-colors">
            {item.label}
          </span>
          <ArrowUpRight className={`h-4 w-4 shrink-0 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 ${isPrimary ? "text-[#E8B86D] opacity-100" : "text-white/30 group-hover:text-white/80"}`} strokeWidth={1.5} />
        </span>
        <span className="mt-1 block text-xs font-light text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
          {item.sub}
        </span>
      </span>
    </motion.a>
  );
}

export default function SunsetsLinkBio() {
  return (
    <main className="min-h-[100dvh] w-full overflow-hidden bg-black text-stone-100 font-sans selection:bg-[#E8B86D]/30">
      <SEO
        title="Chasing Sun(Sets) | Chicago Lakefront House Music"
        description="Official Chasing Sun(Sets) mini hub for first access, tickets, VIP tables, recap video, SoundCloud, gallery, and partner inquiries."
        canonicalPath="/sunsets"
        image="/images/chasing-sunsets-premium.webp"
        absoluteTitle
      />

      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start px-4 py-12 sm:px-6">
        {/* Cinematic Thin-Film Gradients */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,184,109,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(47,213,229,0.06),transparent_40%),linear-gradient(180deg,#0a0a0a_0%,#000000_100%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[480px] z-10"
        >
          {/* Glass Card Container */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-black/40 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl">
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
                <h1 className="mt-4 text-[clamp(3.5rem,15vw,5rem)] hero-wordmark font-light uppercase leading-[0.8] tracking-[0.02em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-[0_0_30px_rgba(232,184,109,0.3)]">
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
                    className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] py-3 transition-colors hover:border-[#E8B86D]/20 hover:bg-[#E8B86D]/5"
                  >
                    <p className="text-[8px] font-sans font-light uppercase tracking-[0.2em] text-white/40">
                      Signal
                    </p>
                    <p className="mt-1.5 text-[10px] hero-wordmark tracking-[0.1em] text-white/80">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Links Array */}
              <div className="mt-8 flex flex-col gap-1">
                {links.map((item, index) => {
                  if (item.type === "youtube") {
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.045, duration: 0.42 }}
                        className="my-3 overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Play className="h-3.5 w-3.5 text-[#E8B86D]" />
                            <span className="text-[9px] font-sans font-light uppercase tracking-[0.2em] text-[#E8B86D]">
                              {item.eyebrow}
                            </span>
                          </div>
                          <span className="text-[10px] hero-wordmark tracking-[0.05em] text-white/60">
                            {item.label}
                          </span>
                        </div>
                        <iframe
                          className="w-full aspect-video"
                          src="https://www.youtube.com/embed/9R6XH7JZlJI?si=L6IvNCRrC31yjrpA&controls=1&rel=0&modestbranding=1"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </motion.div>
                    );
                  }

                  if (item.type === "soundcloud") {
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 + index * 0.045, duration: 0.42 }}
                        className="my-3 overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-3.5 w-3.5 text-cyan-200/80" />
                            <span className="text-[9px] font-sans font-light uppercase tracking-[0.2em] text-cyan-200/80">
                              {item.eyebrow}
                            </span>
                          </div>
                          <span className="text-[10px] hero-wordmark tracking-[0.05em] text-white/60">
                            {item.label}
                          </span>
                        </div>
                        <iframe
                          width="100%"
                          height="140"
                          scrolling="no"
                          frameBorder="no"
                          allow="autoplay"
                          src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chrisidh&color=%23E8B86D&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
                        />
                      </motion.div>
                    );
                  }

                  return <LinkCard key={item.label} item={item} index={index} />;
                })}
              </div>

              {/* Schedule Section */}
              <section className="mt-10 border-t border-white/10 pt-8">
                <div className="mb-6 flex items-center justify-between gap-3 px-2">
                  <div>
                    <p className="text-[9px] font-sans font-light uppercase tracking-[0.3em] text-[#E8B86D]/80">
                      2026 Schedule
                    </p>
                    <h2 className="mt-2 text-xl hero-wordmark font-light uppercase tracking-[0.05em] text-white/90">
                      Upcoming Chapters
                    </h2>
                  </div>
                  <Waves className="h-5 w-5 text-cyan-100/40" strokeWidth={1} />
                </div>

                <div className="flex flex-col border-t border-white/5">
                  {schedule.map((event, index) => (
                    <motion.a
                      key={event.date}
                      href={event.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.48 + index * 0.05, duration: 0.5 }}
                      onClick={() => trackSunsetsClick(`${event.date} tickets`, event.href)}
                      className="group flex items-center justify-between gap-4 border-b border-white/5 py-4 px-2 transition-all duration-500 hover:bg-white/[0.02] hover:px-4"
                    >
                      <span className="flex-1">
                        <span className="text-[10px] font-sans font-light uppercase tracking-[0.2em] text-[#E8B86D]/70 transition-colors group-hover:text-[#E8B86D]">
                          {event.date}
                        </span>
                        <span className="mt-1 block text-base hero-wordmark tracking-[0.03em] text-white/80 transition-colors group-hover:text-white">
                          {event.title}
                        </span>
                        <span className="mt-1 block text-[11px] font-light text-white/40">
                          {event.venue} / {event.time}
                        </span>
                      </span>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/30 transition-all duration-500 group-hover:border-[#E8B86D]/40 group-hover:bg-[#E8B86D]/10 group-hover:text-[#E8B86D]">
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                      </span>
                    </motion.a>
                  ))}
                </div>
              </section>

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
