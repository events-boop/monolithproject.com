import LinkBioPage from "@/components/link-bio/LinkBioPage";
import SEO from "@/components/SEO";
import { INSTAGRAM_SUNSETS, LAYLO_URL, SOUNDCLOUD_URL } from "@/data/events";
import { ROUTES } from "@shared/routes";
import { SUNSETS_STATUS_PATH } from "@shared/events/sunsets-current";

const SUNSETS_URL = "https://sunsets.vip";

/** sunsets.vip: the Chasing Sun(Sets) link in bio. The full event page stays at /sunsets. */
export default function SunsetsVipBio() {
  return (
    <>
      <SEO
        title="Chasing Sun(Sets) | Links"
        description="Chasing Sun(Sets) by The Monolith Project: show updates, Chasing Sunsets Radio, SUNSETS.FM and the Open Network."
        absoluteTitle
        canonicalUrl={`${SUNSETS_URL}/`}
      />
      <LinkBioPage
        theme="sunsets"
        kicker="The Monolith Project · Chicago"
        title="Chasing Sun(Sets)"
        logo={{
          src: "/sunsets/assets/logo-640.webp",
          alt: "Chasing Sun(Sets)",
          width: 640,
          height: 238,
        }}
        tagline="Open-air house music on the Chicago lakefront."
        badge="New show updates incoming"
        tease="2027 is taking shape. Be first to hear the dates."
        links={[
          {
            label: "Get show updates first",
            detail: "New dates, lineups and first access",
            href: ROUTES.newsletter,
            primary: true,
          },
          {
            label: "Chasing Sunsets Radio",
            detail: "A Monolith original, powered by sunsets.fm",
            href: ROUTES.radio,
          },
          {
            label: "SUNSETS.FM · The Open Network",
            detail: "Sets, places and the people behind them",
            href: ROUTES.openNetwork,
          },
          {
            label: "Shows and calendar",
            detail: "What is confirmed and what is next",
            href: ROUTES.schedule,
          },
          {
            label: "September 19 · JOEZI × MASSUMA",
            badge: "Postponed",
            detail: "Rained out. Ticket-holder update and new-date news",
            href: SUNSETS_STATUS_PATH,
          },
          {
            label: "Untold Story",
            detail: "Our after-dark series",
            href: ROUTES.untoldStory,
          },
        ]}
        socials={[
          { label: "Instagram", href: INSTAGRAM_SUNSETS },
          { label: "SoundCloud", href: SOUNDCLOUD_URL },
          { label: "Text alerts", href: LAYLO_URL },
        ]}
        footnote="Chasing Sun(Sets) is a Monolith Project series."
      />
    </>
  );
}
