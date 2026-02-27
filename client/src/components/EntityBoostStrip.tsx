import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

type Tone = "dark" | "light" | "warm" | "nocturne";
type Intent = "default" | "watch-recap" | "listen-episode" | "tickets";

interface SmartAction {
  label: string;
  href: string;
}

interface EntityBoostStripProps {
  tone?: Tone;
  className?: string;
  contextLabel?: string;
  intent?: Intent;
  episodeHref?: string;
  hideMeta?: boolean;
}

const toneClasses: Record<Tone, { shell: string; title: string; body: string; line: string; link: string; cta: string }> = {
  dark: {
    shell: "luxe-surface-dark",
    title: "text-white",
    body: "text-white/65",
    line: "border-white/10",
    link: "text-primary hover:text-white",
    cta: "btn-pill-dark",
  },
  light: {
    shell: "luxe-surface-light",
    title: "text-charcoal",
    body: "text-charcoal/70",
    line: "border-charcoal/12",
    link: "text-charcoal hover:text-clay",
    cta: "btn-pill-dark",
  },
  warm: {
    shell: "luxe-surface-warm",
    title: "text-[#2C1810]",
    body: "text-[#2C1810]/70",
    line: "border-[#C2703E]/18",
    link: "text-[#C2703E] hover:text-[#2C1810]",
    cta: "btn-pill-dark",
  },
  nocturne: {
    shell: "luxe-surface-dark",
    title: "text-white",
    body: "text-white/65",
    line: "border-white/10",
    link: "text-primary hover:text-white",
    cta: "btn-pill-dark",
  },
};

export default function EntityBoostStrip({
  tone = "dark",
  className = "",
  contextLabel = "Official Entity Links",
  intent = "default",
  episodeHref,
  hideMeta = true,
}: EntityBoostStripProps) {
  const ui = toneClasses[tone];
  const intentPrimary: Record<Intent, SmartAction> = {
    default: { label: "Radio Hub", href: "/radio" },
    "watch-recap": { label: "Watch Recap", href: "/chasing-sunsets#chasing-july-2025-recap" },
    "listen-episode": { label: "Listen Episode", href: episodeHref || "/radio" },
    tickets: { label: "Get Tickets", href: "/tickets" },
  };
  const intentSecondary: Record<Intent, SmartAction> = {
    default: { label: "Get Tickets", href: "/tickets" },
    "watch-recap": { label: "Get Tickets", href: "/tickets" },
    "listen-episode": { label: "Radio Hub", href: "/radio" },
    tickets: { label: "Watch Recap", href: "/chasing-sunsets#chasing-july-2025-recap" },
  };

  const primaryAction = intentPrimary[intent];
  const secondaryAction = intentSecondary[intent];
  const secondaryActions: SmartAction[] =
    secondaryAction.label === primaryAction.label && secondaryAction.href === primaryAction.href
      ? []
      : [secondaryAction];

  const renderAction = (action: SmartAction, className: string, withArrow = false) => {
    const isExternal = /^https?:\/\//i.test(action.href);
    const isAnchor = action.href.startsWith("#") || action.href.includes("#");
    const content = (
      <>
        {action.label}
        {withArrow && <ArrowRight className="w-3.5 h-3.5" />}
      </>
    );

    if (isExternal || isAnchor) {
      return (
        <a
          key={`${action.label}-${action.href}`}
          href={action.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={className}
        >
          {content}
        </a>
      );
    }

    return (
      <Link key={`${action.label}-${action.href}`} href={action.href} className={className}>
        {content}
      </Link>
    );
  };

  return (
    <section className={`px-4 sm:px-6 ${className}`}>
      <div className={`container max-w-6xl mx-auto rounded-2xl p-5 sm:p-6 md:p-8 lift-hover ${ui.shell}`}>
        {!hideMeta && (
          <>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary mb-3">{contextLabel}</p>
            <h2 className={`font-display text-2xl md:text-3xl uppercase mb-3 ${ui.title}`}>Brand Defense Stack</h2>
            <p className={`text-sm md:text-base mb-5 read-width ${ui.body}`}>
              Keep the entity graph explicit across pages with consistent identity links and next actions.
            </p>
          </>
        )}

        <div className={`flex flex-wrap gap-x-5 gap-y-2 text-sm ${hideMeta ? "pb-4 mb-4" : "pb-5 mb-5"} border-b ${ui.line}`}>
          <Link href="/chasing-sunsets-facts" className={`underline underline-offset-4 transition-colors ${ui.link}`}>
            Chasing Sun(Sets) Facts
          </Link>
          <Link href="/chasing-sunsets-facts" className={`underline underline-offset-4 transition-colors ${ui.link}`}>
            Official Chasing Sun(Sets) Identity
          </Link>
          <Link href="/chasing-sunsets-facts" className={`underline underline-offset-4 transition-colors ${ui.link}`}>
            Not the fragrance — official music series
          </Link>
        </div>

        <div className="cta-stack">
          {renderAction(primaryAction, "btn-pill-coral w-full sm:w-auto", true)}
          {secondaryActions.map((action) => renderAction(action, `${ui.cta} w-full sm:w-auto`))}
        </div>
      </div>
    </section>
  );
}
