import { useState } from "react";
import {
  ArrowUpRight,
  Car,
  CheckCircle2,
  Compass,
  Crown,
  MapPin,
  Moon,
  Music,
  ShieldCheck,
  Sun,
  Train,
} from "lucide-react";
import { Link } from "wouter";
import type { ScheduledEvent } from "@shared/events/types";
import { ROUTES } from "@shared/routes";

export type ConciergeRoomId =
  | "castaways"
  | "west-loop"
  | "alhambra"
  | "kashmir";

interface RoomProfile {
  id: ConciergeRoomId;
  series: string;
  name: string;
  neighborhood: string;
  address: string;
  mapsUrl: string;
  atmosphere: "day" | "night";
  soundProfile: string;
  attire: string;
  arrivalWindow: string;
  ridesharePin: string;
  transitNote: string;
  hospitalityNote: string;
  zones: Array<{
    name: string;
    detail: string;
  }>;
}

export const CHICAGO_ROOM_PROFILES: Record<ConciergeRoomId, RoomProfile> = {
  castaways: {
    id: "castaways",
    series: "Chasing Sun(Sets) · Open Air",
    name: "Castaways Beach Club",
    neighborhood: "North Avenue Beach · Lake Michigan",
    address:
      "1603 N Jean Baptiste Pointe du Sable Lake Shore Dr, Chicago, IL 60611",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Castaways+Beach+Club+Chicago",
    atmosphere: "day",
    soundProfile: "Afro house, melodic house & golden-hour shoreline grooves",
    attire: "Elevated lakefront summer attire · Sunglasses & evening layer",
    arrivalWindow:
      "Arrive in the first 90 minutes for effortless bridge check-in and the full daylight-to-dusk arc.",
    ridesharePin:
      "Set drop-off to North Ave & Cannon Dr (Lincoln Park side), then walk across the North Avenue Beach pedestrian bridge.",
    transitNote:
      "CTA Bus #72 (North Ave) or #151 (Sheridan) stops steps from the pedestrian bridge.",
    hospitalityNote:
      "Cabanas & reserved deck tables check in through the dedicated VIP host podium.",
    zones: [
      {
        name: "Upper Sunset Deck",
        detail:
          "Primary open-air dance floor facing Lake Michigan and the Chicago skyline.",
      },
      {
        name: "Cabana & VIP Rail",
        detail:
          "Reserved group hospitality with dedicated server & expedited host entry.",
      },
      {
        name: "North Bridge Check-In",
        detail: "21+ physical government ID verification & mobile QR scan.",
      },
    ],
  },
  "west-loop": {
    id: "west-loop",
    series: "Untold Story · After Dark",
    name: "Hideaway Chicago",
    neighborhood: "West Loop / Fulton Market · Chicago",
    address: "730 W Couch Pl, Chicago, IL",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=730+W+Couch+Pl+Chicago+IL+60661",
    atmosphere: "night",
    soundProfile: "Deep Afro, hypnotic melodic & peak-hour club pressure",
    attire: "Elevated after-dark nightlife attire · Built for movement",
    arrivalWindow:
      "Use the doors time on your event confirmation; hours vary by chapter.",
    ridesharePin:
      "Use 730 W Couch Pl as the venue destination and follow the entry instructions on your event confirmation.",
    transitNote:
      "Check a current transit route to 730 W Couch Pl before you travel.",
    hospitalityNote:
      "Booth-side and elevated table inquiries are coordinated directly with our host team prior to doors.",
    zones: [
      {
        name: "The Dancefloor Core",
        detail:
          "360° or intimate club-focused floor tuned for low-end warmth and minimal phone glare.",
      },
      {
        name: "Booth & Table Perimeter",
        detail:
          "Close-proximity reserved tables with dedicated bottle & host service.",
      },
      {
        name: "Marquee Priority Line",
        detail: "Separate GA and VIP/Table host check-in at street level.",
      },
    ],
  },
  alhambra: {
    id: "alhambra",
    series: "The Monolith Project",
    name: "Alhambra Palace",
    neighborhood: "West Loop · Chicago",
    address: "1240 W Randolph St, Chicago, IL 60607",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=1240+W+Randolph+St+Chicago+IL+60607",
    atmosphere: "night",
    soundProfile: "House music in a historic Chicago room",
    attire: "Check the entry guidance for your specific event.",
    arrivalWindow: "Use the doors time on your event confirmation.",
    ridesharePin: "Use 1240 W Randolph St as the venue destination.",
    transitNote: "Check a current route to the venue before you travel.",
    hospitalityNote:
      "Confirm any table or group arrangements with the host team.",
    zones: [
      {
        name: "Venue entry",
        detail:
          "Use your event confirmation for entry and check-in instructions.",
      },
    ],
  },
  kashmir: {
    id: "kashmir",
    series: "Monolith Residency & House of Friends",
    name: "Kashmir Chicago",
    neighborhood: "West Loop · Randolph Corridor",
    address: "1436 W Randolph St, Chicago, IL 60607",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=1436+W+Randolph+St+Chicago+IL+60607",
    atmosphere: "night",
    soundProfile:
      "Chicago house roots, resident B2Bs & intimate vocal selections",
    attire: "Sharp evening casual to elevated club attire",
    arrivalWindow:
      "Intimate capacity — early arrival is strongly recommended for residency and pop-up nights.",
    ridesharePin: "Direct curbside drop-off at 1436 W Randolph St.",
    transitNote: "CTA Green / Pink Line — Ashland or Morgan station.",
    hospitalityNote:
      "Lounge seating & group reservations available via events@monolithproject.com.",
    zones: [
      {
        name: "Intimate Lounge & Floor",
        detail:
          "Warm architectural room built for close connection between selector and crowd.",
      },
      {
        name: "Randolph Entry",
        detail: "21+ valid government photo ID & guestlist / ticket scan.",
      },
    ],
  },
};

export function inferConciergeRoomForEvent(
  event?: ScheduledEvent | null
): ConciergeRoomId | null {
  if (!event) return "castaways";
  const venueLower = `${event.venue} ${event.location}`.toLowerCase();
  if (venueLower.includes("castaways")) {
    return "castaways";
  }
  if (venueLower.includes("kashmir")) {
    return "kashmir";
  }
  if (venueLower.includes("alhambra")) return "alhambra";
  if (venueLower.includes("hideaway")) return "west-loop";
  return null;
}

interface RoomConciergeCardProps {
  event?: ScheduledEvent | null;
  allowRoomSwitch?: boolean;
  compact?: boolean;
}

export default function RoomConciergeCard({
  event,
  allowRoomSwitch = false,
  compact = false,
}: RoomConciergeCardProps) {
  const defaultRoom = inferConciergeRoomForEvent(event);
  const [selectedRoomId, setSelectedRoomId] = useState<ConciergeRoomId>(
    defaultRoom ?? "castaways"
  );
  const roomId = allowRoomSwitch ? selectedRoomId : defaultRoom;
  if (!roomId)
    return (
      <section className="editorial-status-note">
        <h3>Follow the event confirmation.</h3>
        <p>
          {event?.venueAddress?.streetAddress ||
            "Arrival details will be published with the confirmed venue."}
        </p>
        <Link href="/contact">Ask the host team →</Link>
      </section>
    );
  const room = CHICAGO_ROOM_PROFILES[roomId];

  return (
    <section
      data-room-concierge="true"
      aria-label="Chicago Room and Arrival Concierge"
      className="lg-glass-card rounded-2xl p-6 md:p-8 space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-5">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#f3b572]">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Chicago Room & Arrival Concierge</span>
          </p>
          <h3 className="mt-2 font-display text-2xl md:text-3xl uppercase tracking-wide text-[#fbf6ee]">
            {room.name}
          </h3>
          <p className="mt-1 text-sm text-white/70">
            {room.series} · {room.neighborhood}
          </p>
        </div>

        {allowRoomSwitch && (
          <div
            role="group"
            aria-label="Choose a Chicago Monolith venue"
            className="flex flex-wrap gap-2"
          >
            {(Object.keys(CHICAGO_ROOM_PROFILES) as ConciergeRoomId[]).map(
              id => {
                const candidate = CHICAGO_ROOM_PROFILES[id];
                const active = id === selectedRoomId;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedRoomId(id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                      active
                        ? "border-[#ffe6c2]/65 bg-[#f3a659] text-[#181009] font-semibold"
                        : "border-white/14 bg-white/[0.04] text-white/75 hover:border-[#f3a659]/45 hover:text-white"
                    }`}
                  >
                    {candidate.atmosphere === "day" ? (
                      <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>
                      {id === "castaways"
                        ? "Castaways"
                        : id === "west-loop"
                          ? "Hideaway"
                          : id === "alhambra"
                            ? "Alhambra"
                            : "Kashmir"}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/25 p-4 space-y-2">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f3c68f]">
            <Car className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Rideshare & Drop-Off Pin</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            {room.ridesharePin}
          </p>
          <p className="text-xs text-white/60 flex items-center gap-1.5 pt-1">
            <Train className="h-3.5 w-3.5 shrink-0 text-[#f3b572]" />
            <span>{room.transitNote}</span>
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 p-4 space-y-2">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f3c68f]">
            <Music className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Sound, Attire & Pacing</span>
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            {room.arrivalWindow}
          </p>
          <p className="text-xs text-white/65 pt-1">
            <strong className="text-[#fbf6ee] font-medium">Attire:</strong>{" "}
            {event?.dress || room.attire}
          </p>
        </div>
      </div>

      {!compact && (
        <div className="grid gap-3 sm:grid-cols-3">
          {room.zones.map(zone => (
            <div
              key={zone.name}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-4 space-y-1.5"
            >
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[#ffd8a6]">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{zone.name}</span>
              </p>
              <p className="text-xs leading-relaxed text-white/70">
                {zone.detail}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <p className="flex items-center gap-2 text-xs text-white/70">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#f3b572]" />
          <span>21+ valid physical photo ID · Cashless bar & tables</span>
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={room.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg-pill-glass !min-h-[40px] !px-4 !py-2"
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Directions</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>

          <Link
            href={ROUTES.vip}
            className="lg-pill-amber !min-h-[40px] !px-4 !py-2"
          >
            <Crown className="h-3.5 w-3.5" aria-hidden="true" />
            <span>VIP & Table Inquiry</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
