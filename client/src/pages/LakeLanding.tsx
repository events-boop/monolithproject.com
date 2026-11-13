import { useEffect } from "react";
import SEO from "@/components/SEO";
import LinkBioPage from "@/components/link-bio/LinkBioPage";
import { trackFunnelPageView } from "@/lib/api";
import { trackLakePageView } from "@/lib/campaignPixel";
import { ROUTES } from "@shared/routes";

/** Permanent campaign address: new signup, truthful history, ticket-holder support. */
export default function LakeLanding() {
  useEffect(() => {
    trackFunnelPageView({ pagePath: "/lake", source: "sunsets_lake" });
    trackLakePageView();
  }, []);

  return (
    <div id="lake-list">
      <SEO
        title="Sun(Sets) Lake List & First Access"
        description="Join First Access for Chasing Sunsets IV in 2027. Revisit previous chapters, listen to the radio archive, and find the September 19 ticket-holder update."
        image="/images/chasing-sunsets-castaways-hero.png"
        canonicalPath="/lake"
      />
      <LinkBioPage
        theme="sunsets"
        kicker="The Monolith Project presents"
        title="Chasing Sunsets"
        titleAccent="2027"
        badge="The Lake List / Chasing Sunsets IV"
        tagline="House music. Lake Michigan. One more sunset."
        tease="The next chapter is taking shape. Be the first to know."
        showDestinations
        links={[
          {
            label: "Get First Access · 2027",
            detail: "Chasing Sunsets IV · Dates and artists to be announced",
            href: ROUTES.newsletter,
            primary: true,
          },
          {
            label: "September 19 ticket-holder update",
            detail: "Postponed · New date to be confirmed",
            href: "/sunsets#event-status",
          },
          {
            label: "Revisit July 4",
            detail: "10-hour gathering · 2,800 attendees",
            href: "/chasing-sunsets/sunsets-i-2026",
          },
          {
            label: "Sunsets II · August 22",
            detail: "Previous chapter · Event history",
            href: "/events/css-aug22",
          },
          {
            label: "Chasing Sunsets Radio",
            detail: "Keep the music close",
            href: ROUTES.radio,
          },
          { label: "Full calendar", href: ROUTES.schedule },
          { label: "SUNSETS.FM", href: "https://sunsets.fm" },
        ]}
        socials={[
          {
            label: "Instagram",
            href: "https://instagram.com/chasingsunsets.music",
          },
          { label: "Contact", href: "mailto:events@monolithproject.com" },
          { label: "Privacy", href: ROUTES.privacy },
        ]}
        footnote="Chasing Sunsets by The Monolith Project · Chicago"
      />
    </div>
  );
}
