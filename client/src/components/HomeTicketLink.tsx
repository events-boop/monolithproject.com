import { ArrowUpRight } from "lucide-react";
import {
  currentSunsets,
  sunsetsTicketsEnabled,
} from "@shared/events/sunsets-current";
import { appendAttributionQueryParams } from "@/lib/attribution";
import { trackAccessEvent } from "@/lib/api";
import { hasAnalyticsConsent } from "@/lib/cookieConsent";

export default function HomeTicketLink({ placement }: { placement: string }) {
  const enabled = sunsetsTicketsEnabled();
  return (
    <a
      className="home-primary"
      href={
        enabled
          ? appendAttributionQueryParams(currentSunsets.ticketUrl)
          : "/sunsets#event-status"
      }
      onClick={event => {
        if (!enabled) return;
        event.currentTarget.href = appendAttributionQueryParams(
          currentSunsets.ticketUrl
        );
        if (hasAnalyticsConsent())
          trackAccessEvent("ticket_click", {
            buttonName: "Get tickets",
            destinationUrl: currentSunsets.ticketUrl,
            eventSlug: "css-sep19",
            eventDate: currentSunsets.start,
            channel: "AllEvents",
            source: `home_${placement}`,
          });
      }}
    >
      {enabled ? "Get tickets" : "Event information"}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
