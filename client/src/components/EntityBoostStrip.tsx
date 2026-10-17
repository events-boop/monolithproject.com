import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { CTA_LABELS } from "@/lib/cta";

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

export default function EntityBoostStrip({
  tone = "dark",
  className = "",
  contextLabel = "Explore Monolith",
  intent = "default",
  episodeHref,
}: EntityBoostStripProps) {
  const intentPrimary: Record<Intent, SmartAction> = {
    default: { label: CTA_LABELS.radioHub, href: "/radio" },
    "watch-recap": {
      label: "Watch Recap",
      href: "/chasing-sunsets#chasing-july-2025-recap",
    },
    "listen-episode": {
      label: CTA_LABELS.listenNow,
      href: episodeHref || "/radio",
    },
    tickets: { label: "Events & tickets", href: "/schedule" },
  };
  const intentSecondary: Record<Intent, SmartAction> = {
    default: { label: "Events & tickets", href: "/schedule" },
    "watch-recap": { label: "Events & tickets", href: "/schedule" },
    "listen-episode": { label: CTA_LABELS.radioHub, href: "/radio" },
    tickets: {
      label: "Watch Recap",
      href: "/chasing-sunsets#chasing-july-2025-recap",
    },
  };

  const primaryAction = intentPrimary[intent];
  const secondaryAction = intentSecondary[intent];
  const secondaryActions: SmartAction[] =
    secondaryAction.label === primaryAction.label &&
    secondaryAction.href === primaryAction.href
      ? []
      : [secondaryAction];

  const renderAction = (
    action: SmartAction,
    className: string,
    withArrow = false
  ) => {
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
      <Link
        key={`${action.label}-${action.href}`}
        href={action.href}
        className={className}
      >
        {content}
      </Link>
    );
  };

  return (
    <nav
      className={`entity-links ${className}`}
      data-tone={tone}
      aria-label={contextLabel}
    >
      <div className="container layout-default entity-links-inner">
        <span className="section-kicker">{contextLabel}</span>
        <div className="entity-links-actions">
          {renderAction(primaryAction, "home-text-link", true)}
          {secondaryActions.map(action =>
            renderAction(action, "home-text-link", true)
          )}
          <details>
            <summary>More from Monolith</summary>
            <div>
              <Link href="/chasing-sunsets">Chasing Sun(Sets)</Link>
              <Link href="/untold-story">Untold Story</Link>
              <Link href="/faq">Event FAQs</Link>
            </div>
          </details>
        </div>
      </div>
    </nav>
  );
}
