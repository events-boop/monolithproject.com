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

export default function HeroSection() {
  const event = getEventById("css-sep19");
  const schema = event ? buildScheduledEventSchema(event, "/sunsets") : null;
  return (
    <section id="hero" className="monolith-hero" aria-labelledby="home-title">
      {schema && (
        <JsonLd
          data={{
            ...schema,
            eventStatus: `https://schema.org/${currentSunsets.status}`,
          }}
        />
      )}
      <div className="monolith-hero-stage">
        <CinematicHeroMedia />
        <div className="monolith-hero-inner">
          <div className="monolith-hero-copy" data-home-hero-heading="true">
            <div>
              <p className="home-eyebrow" data-home-hero-eyebrow="true">
                Chicago / House music / Together
              </p>
              <h1 id="home-title">MONOLITH</h1>
              <p
                className="monolith-hero-tagline"
                data-home-hero-summary="true"
              >
                Lakefront days. Late-night dance floors.
              </p>
            </div>
            <Link href="/schedule" className="home-text-link home-hero-explore">
              Explore the shows <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container layout-wide monolith-hero-event-rail">
        {sunsetsShowVisible() && (
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
                {sunsetsShortDate} · {currentSunsets.venueName}
              </span>
              <span>
                {sunsetsNeedsUpdate
                  ? "Postponed · New date to be announced"
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
    </section>
  );
}
