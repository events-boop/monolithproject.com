import { useMemo } from "react";
import FunnelWaitlist from "@/components/FunnelWaitlist";
import GiveawayFunnel from "@/components/GiveawayFunnel";
import CoordinatesFunnel from "@/components/CoordinatesFunnel";
import { upcomingEvents } from "@/data/events";

interface EventFunnelStackProps {
    eventId: string;
}

export default function EventFunnelStack({ eventId }: EventFunnelStackProps) {
    const event = useMemo(() => upcomingEvents.find((e) => e.id === eventId), [eventId]);

    if (!event || !event.activeFunnels || event.activeFunnels.length === 0) {
        return null;
    }

    return (
        <>
            {event.activeFunnels.map((funnel, index) => {
                switch (funnel) {
                    case "waitlist":
                        return <FunnelWaitlist key={`funnel-${index}`} variant="default" />;
                    case "waitlist-chasing":
                        return <FunnelWaitlist key={`funnel-${index}`} variant="chasing-sunsets" />;
                    case "waitlist-untold":
                        return (
                            <div key={`funnel-${index}`} className="relative z-20 w-full overflow-hidden bg-black/40 backdrop-blur-3xl border-y border-[#8B5CF6]/10">
                                <FunnelWaitlist variant="untold-story" />
                            </div>
                        );
                    case "giveaway":
                        return <GiveawayFunnel key={`funnel-${index}`} />;
                    case "coordinates":
                        return <CoordinatesFunnel key={`funnel-${index}`} />;
                    default:
                        return null;
                }
            })}
        </>
    );
}
