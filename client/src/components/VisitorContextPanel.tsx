import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarRange,
  FileText,
  Handshake,
  LibraryBig,
  Mail,
  Radio,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";
import { getExperienceEvent, getPrimaryTicketUrl, isTicketOnSale } from "@/lib/siteExperience";
import { useVisitorContext, type VisitorSegment } from "@/lib/visitorContext";
import { CTA_LABELS } from "@/lib/cta";

interface ContextAction {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
  note: string;
  external?: boolean;
}

const segmentContent: Record<
  VisitorSegment,
  {
    actions: (ticketUrl: string, hasLiveTickets: boolean) => ContextAction[];
    eyebrow: string;
    label: string;
    title: string;
    description: string;
  }
> = {
  "first-visit": {
    eyebrow: "Start Here",
    label: "First Visit",
    title: "New here? Start with the next date, then the world around it.",
    description:
      "The fastest way into Monolith is the next night, a few past chapters, and the pages that explain how the music, the series, and the room fit together.",
    actions: () => [
      {
        label: CTA_LABELS.schedule,
        href: "/schedule",
        icon: CalendarRange,
        note: "Live dates",
        description: "The fastest way to see the live calendar and the specific series each night belongs to.",
      },
      {
        label: CTA_LABELS.radioHub,
        href: "/radio",
        icon: Radio,
        note: "Listen first",
        description: "The Radio Show is the easiest way to hear the taste behind the room before you arrive.",
      },
      {
        label: CTA_LABELS.archive,
        href: "/archive",
        icon: LibraryBig,
        note: "Past chapters",
        description: "See what the rooms actually looked and felt like once the doors opened.",
      },
    ],
  },
  returning: {
    eyebrow: "Welcome Back",
    label: "Returning Guest",
    title: "Back again? Go straight to what is live now.",
    description:
      "Returning guests usually want the ticket link, the next date, or something to play on the way there. We keep all three close.",
    actions: (ticketUrl, hasLiveTickets) => [
      hasLiveTickets
        ? {
            label: CTA_LABELS.tickets,
            href: ticketUrl,
            icon: Ticket,
            note: "Live window",
            description: "Jump directly into the current on-sale event instead of re-reading the whole homepage.",
            external: true,
          }
        : {
            label: CTA_LABELS.schedule,
            href: "/schedule",
            icon: CalendarRange,
            note: "Next date",
            description: "Go directly to the upcoming calendar when there is no live ticket window yet.",
          },
      {
        label: "Listen To Radio",
        href: "/radio",
        icon: Radio,
        note: "Fresh signal",
        description: "Put on a mix and get back into the mood quickly.",
      },
      {
        label: "Catch Up In Archive",
        href: "/archive",
        icon: LibraryBig,
        note: "Continuity",
        description: "See what happened between the last chapter and the next one.",
      },
    ],
  },
  "partner-intent": {
    eyebrow: "Working View",
    label: "Partner / Press",
    title: "Looking at Monolith as a partner, venue, or press contact? Start here.",
    description:
      "If you are coming in from venues, brands, media, or booking, the clearest path is partners, press, then direct contact.",
    actions: () => [
      {
        label: CTA_LABELS.viewPartners,
        href: "/partners",
        icon: Handshake,
        note: "Brand and venue path",
        description: "See where venue, brand, and collaboration conversations begin.",
      },
      {
        label: CTA_LABELS.openPressContext,
        href: "/press",
        icon: FileText,
        note: "Fast facts",
        description: "Get the language, context, and assets media or collaborators usually need first.",
      },
      {
        label: CTA_LABELS.contact,
        href: "/contact",
        icon: Mail,
        note: "Direct channel",
        description: "Move to the inquiry page once you have enough context.",
      },
    ],
  },
};

export default function VisitorContextPanel() {
  const visitorContext = useVisitorContext();
  const featuredEvent = getExperienceEvent("ticket");
  const ticketUrl = getPrimaryTicketUrl(featuredEvent);
  const hasLiveTickets = isTicketOnSale(featuredEvent);

  if (!visitorContext.isReady) {
    return null;
  }

  const content = segmentContent[visitorContext.segment];
  const actions = content.actions(ticketUrl || "#", hasLiveTickets);

  return (
    <section className="relative z-10 px-6 py-6 md:py-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-none border border-white/12 bg-[linear-gradient(155deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl group"
        >
          {/* Atmospheric Glow Overlay */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-[80px] pointer-events-none" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="ui-kicker scene-kicker mb-4 block">{content.eyebrow}</span>
              <h2 className="font-display text-[clamp(2rem,4.7vw,4.2rem)] leading-[0.94] text-white">
                {content.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/68 md:text-base">
                {content.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center rounded-none border border-primary/40 bg-primary/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_10px_rgba(224,90,58,0.3)]">
                CLEARANCE [{visitorContext.tier}]
              </span>
              <div className="flex items-center h-[30px] px-2 bg-white/5 border border-white/10 gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < visitorContext.achievements.length ? 'bg-primary shadow-[0_0_5px_rgba(224,90,58,1)]' : 'bg-white/10'}`} />
                  ))}
              </div>
              <span className="inline-flex items-center rounded-none border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/62">
                {content.label}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              const cardClasses =
                "group relative block overflow-hidden rounded-none border border-white/8 bg-white/[0.04] p-6 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl";

              return (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  {action.external ? (
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClasses}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="ui-chip text-white/42">{action.note}</p>
                          <h3 className="mt-3 font-display text-2xl uppercase text-white">
                            {action.label}
                          </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-none border border-primary/20 bg-primary/8 text-primary shadow-[0_0_20px_rgba(212,165,116,0.15)] group-hover:shadow-[0_0_30px_rgba(212,165,116,0.25)] transition-all">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-white/64">{action.description}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/72 transition-colors group-hover:text-white">
                        Open
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </a>
                  ) : (
                    <Link href={action.href} className={cardClasses}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="ui-chip text-white/42">{action.note}</p>
                          <h3 className="mt-3 font-display text-2xl uppercase text-white">
                            {action.label}
                          </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-none border border-primary/20 bg-primary/8 text-primary shadow-[0_0_20px_rgba(212,165,116,0.15)] group-hover:shadow-[0_0_30px_rgba(212,165,116,0.25)] transition-all">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-white/64">{action.description}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/72 transition-colors group-hover:text-white">
                        Open
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
