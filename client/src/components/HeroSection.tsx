import JsonLd from "./JsonLd";
import { buildScheduledEventSchema } from "@/lib/schema";
import { getEventById } from "@/lib/siteExperience";
import HomeTicketLink from "./HomeTicketLink";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import CinematicHeroMedia from "./CinematicHeroMedia";
import {
  currentSunsets,
  sunsetsShortDate,
  sunsetsStatusLabel,
  sunsetsShowVisible,
  sunsetsNeedsUpdate,
  sunsetsTimeLabel,
} from "@shared/events/sunsets-current";

interface HeroSectionProps {
  isActive?: boolean;
  renderMedia?: boolean;
  showInlineEventRail?: boolean;
}

export default function HeroSection({
  isActive = true,
  renderMedia = true,
  showInlineEventRail = true,
}: HeroSectionProps) {
  const event = getEventById("css-sep19");
  const schema = event ? buildScheduledEventSchema(event, "/sunsets") : null;
  const HeadingTag = isActive ? "h1" : "p";

  return (
    <section
      id={isActive ? "hero" : undefined}
      className="monolith-hero"
      aria-labelledby={isActive ? "home-title" : undefined}
    >
      {isActive && schema && (
        <JsonLd
          data={{
            ...schema,
            eventStatus: `https://schema.org/${currentSunsets.status}`,
          }}
        />
      )}
      <div className={renderMedia ? "monolith-hero-stage" : "lg-rooms-stage"}>
        {renderMedia && <CinematicHeroMedia variant="rooms" priority={false} />}
        <div className="monolith-hero-inner">
          <div
            className="monolith-hero-copy"
            data-home-hero-heading={isActive ? "true" : undefined}
          >
            <div>
              <p
                className="home-eyebrow"
                data-home-hero-eyebrow={isActive ? "true" : undefined}
              >
                Chicago / House music / Together
              </p>
              <HeadingTag
                id={isActive ? "home-title" : undefined}
                className="monolith-hero-display"
              >
                MONOLITH
              </HeadingTag>
              <p
                className="monolith-hero-tagline"
                data-home-hero-summary={isActive ? "true" : undefined}
              >
                Lakefront days. Late-night dance floors.
              </p>
            </div>
            <Link href="/schedule" className="home-text-link home-hero-explore">
              <span>Explore the shows</span>
              <span className="home-hero-arrow">
                <ArrowUpRight size={22} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>
      {showInlineEventRail && (
        <div className="container layout-wide monolith-hero-event-rail">
          {sunsetsShowVisible() && !sunsetsNeedsUpdate && (
            <div className="home-event-strip" data-home-hero-card="true">
              <div>
                <div className="home-sunsets-brand-row">
                  <a href="/sunsets" aria-label="Chasing Sun(Sets) event guide">
                    <img
                      className="home-sunsets-logo home-sunsets-logo-compact"
                      src="/sunsets/assets/logo-640.webp"
                      width="640"
                      height="238"
                      alt="Chasing Sun(Sets)"
                      decoding="async"
                    />
                  </a>
                  <span className="home-eyebrow">Season finale</span>
                </div>
                <p>{currentSunsets.headliners.join(" × ")}</p>
              </div>
              <div className="home-strip-details">
                <span>
                  {sunsetsNeedsUpdate ? "Original date: " : ""}
                  {sunsetsShortDate} · {currentSunsets.venueName}
                </span>
                <span>
                  {sunsetsNeedsUpdate
                    ? "New date to be announced"
                    : `${sunsetsTimeLabel} · 21+`}
                </span>
                <a
                  href="/sunsets#event-status"
                  className="home-status"
                  data-status={currentSunsets.status}
                >
                  <span aria-hidden="true" />
                  {sunsetsStatusLabel()}
                </a>
              </div>
              <HomeTicketLink placement="hero" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
