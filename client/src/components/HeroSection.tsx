import JsonLd from "./JsonLd";
import { buildScheduledEventSchema } from "@/lib/schema";
import { getEventById } from "@/lib/siteExperience";
import HomeTicketLink from "./HomeTicketLink";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { getResponsiveImage } from "@/lib/responsiveImages";
import {
  currentSunsets,
  sunsetsShortDate,
  sunsetsStatusLabel,
} from "@shared/events/sunsets-current";

const photograph = getResponsiveImage("videoPoster1");

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
      <div className="monolith-hero-photo" aria-hidden="true">
        <picture>
          {photograph.sources?.map((source, index) => (
            <source key={index} {...source} />
          ))}
          <img
            src={photograph.src}
            sizes="100vw"
            width="1920"
            height="1080"
            alt=""
            fetchPriority="high"
          />
        </picture>
      </div>
      <div className="container layout-wide monolith-hero-inner">
        <div className="monolith-hero-copy" data-home-hero-heading="true">
          <p className="home-eyebrow" data-home-hero-eyebrow="true">
            Chicago house music
          </p>
          <h1 id="home-title">MONOLITH</h1>
          <p className="monolith-hero-tagline">
            Lakefront days.
            <br />
            Late-night dance floors.
          </p>
          <p className="monolith-hero-summary" data-home-hero-summary="true">
            We bring people together through Chasing Sun(Sets), Untold Story,
            and artist-led radio.
          </p>
          <Link href="/schedule" className="home-text-link">
            Explore the shows <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
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
      </div>
    </section>
  );
}
