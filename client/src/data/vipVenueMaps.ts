import type { VipPackageSize } from "@shared/events/types";

export type VipVenueViewId = "overview" | "stage" | "cabanas";

export type VipVenueCamera = {
  theta: number;
  phi: number;
  radius: number;
  target: [number, number, number];
};

export type VipVenueZone = {
  id: string;
  packageSize: VipPackageSize;
  code: string;
  name: string;
  placement: string;
  world: [number, number, number];
  plan: { left: number; top: number };
  premium?: boolean;
};

export type VipVenueMapDefinition = {
  id: string;
  venueId: string;
  sceneId: "castaways-beach-club";
  label: string;
  version: number;
  illustrative: boolean;
  zones: VipVenueZone[];
  cameras: Record<VipVenueViewId, VipVenueCamera>;
};

const castawaysZones: VipVenueZone[] = [
  {
    id: "deck-intimate",
    packageSize: "small",
    code: "S",
    name: "Small",
    placement: "Lake-side daybed placement",
    world: [8.8, 7.1, 3.25],
    plan: { left: 29, top: 67 },
  },
  {
    id: "deck-crew",
    packageSize: "medium",
    code: "M",
    name: "Medium",
    placement: "Central crew placement",
    world: [6.2, 7.1, -3.25],
    plan: { left: 52, top: 51 },
  },
  {
    id: "captains-cabana",
    packageSize: "large",
    code: "L",
    name: "Large",
    placement: "Elevated cabana placement",
    world: [-15.6, 8.4, 2.15],
    plan: { left: 73, top: 31 },
    premium: true,
  },
];

const castawaysCameras: Record<VipVenueViewId, VipVenueCamera> = {
  overview: {
    theta: -1.02,
    phi: 1.02,
    radius: 54,
    target: [0, 3.4, -1.5],
  },
  stage: {
    theta: -0.28,
    phi: 1.15,
    radius: 25,
    target: [-4, 5.8, 0],
  },
  cabanas: {
    theta: -1.88,
    phi: 0.94,
    radius: 28,
    target: [4.8, 4.2, 0],
  },
};

function castawaysMap(id: string, label: string): VipVenueMapDefinition {
  return {
    id,
    venueId: "castaways-chicago",
    sceneId: "castaways-beach-club",
    label,
    version: 1,
    illustrative: true,
    zones: castawaysZones,
    cameras: castawaysCameras,
  };
}

/**
 * One entry per event, even when two dates share a venue. Geometry can be
 * reused, while zones and camera views remain independently versionable.
 */
export const VIP_VENUE_MAPS: Record<string, VipVenueMapDefinition> = {
  "castaways-sunsets-ii-2026": castawaysMap(
    "castaways-sunsets-ii-2026",
    "Sun(Sets) II · Castaways"
  ),
  "castaways-sunsets-iii-2026": castawaysMap(
    "castaways-sunsets-iii-2026",
    "Sun(Sets) III · Castaways"
  ),
};

export function getVipVenueMap(mapId?: string | null) {
  return mapId ? VIP_VENUE_MAPS[mapId] : undefined;
}

export function getVipVenueZone(
  map: VipVenueMapDefinition | undefined,
  packageSize: VipPackageSize | null
) {
  if (!map || !packageSize) return undefined;
  return map.zones.find(zone => zone.packageSize === packageSize);
}
