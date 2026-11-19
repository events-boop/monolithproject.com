import LinkBioPage from "./LinkBioPage";
import SEO from "@/components/SEO";
import {
  CAMPAIGN_BIOS,
  MONOLITH_ORIGIN,
  type CampaignBioTheme,
} from "@shared/campaign-bios";
import { ROUTES } from "@shared/routes";
import { SUNSETS_STATUS_PATH } from "@shared/events/sunsets-current";

export default function CampaignBioPage({
  theme,
}: {
  theme: CampaignBioTheme;
}) {
  const bio = CAMPAIGN_BIOS[theme];
  return (
    <>
      <SEO
        title={`${bio.name} | The Monolith Project`}
        absoluteTitle
        description={bio.description}
        canonicalUrl={`${bio.domain}/`}
      />
      <LinkBioPage
        theme={theme}
        kicker="The Monolith Project · Chicago"
        title={bio.title}
        titleAccent={bio.accent}
        tagline={bio.description}
        badge={bio.status}
        tease={bio.note}
        links={[
          {
            label: "Be first to know",
            detail: "Join Monolith for new dates, lineups and project updates",
            href: MONOLITH_ORIGIN + ROUTES.newsletter,
            primary: true,
          },
          bio.fullPage,
          {
            label: "Chasing Sunsets Radio",
            detail: "Artist-led sets. Keep the music close.",
            href: MONOLITH_ORIGIN + ROUTES.radio,
          },
          {
            label: "Shows & calendar",
            detail: "Explore the calendar and latest show updates",
            href: MONOLITH_ORIGIN + ROUTES.schedule,
          },
        ]}
        notice={
          theme === "sunsets"
            ? {
                label: "September 19 · JOEZI × MASSUMA",
                detail: "Postponed · Ticket-holder information",
                href: MONOLITH_ORIGIN + SUNSETS_STATUS_PATH,
              }
            : undefined
        }
        socials={[
          { label: "Instagram", href: bio.instagram },
          {
            label: "SoundCloud",
            href: "https://soundcloud.com/monolithproject",
          },
        ]}
        footnote={`${bio.name} is part of The Monolith Project.`}
      />
    </>
  );
}
