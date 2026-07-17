import type {
  ScheduledEvent,
  VipAvailability,
  VipPackage,
  VipPackageSize,
} from "@shared/events/types";
import { getVipVenueMap, getVipVenueZone } from "@/data/vipVenueMaps";

export function isVipPackageSoldOut(
  event: ScheduledEvent,
  vipPackage: VipPackage
) {
  return (
    event.status === "sold-out" ||
    event.status === "past" ||
    vipPackage.availability === "sold-out"
  );
}

export function getVipEventAvailability(
  event: ScheduledEvent
): VipAvailability {
  if (event.status === "sold-out" || event.status === "past") {
    return "sold-out";
  }

  const packages = event.vipPackages || [];
  if (
    packages.length > 0 &&
    packages.every(item => isVipPackageSoldOut(event, item))
  ) {
    return "sold-out";
  }

  if (packages.some(item => item.availability === "limited")) {
    return "limited";
  }

  return "available";
}

export function getVipAvailabilityLabel(status: VipAvailability) {
  switch (status) {
    case "sold-out":
      return "Sold out";
    case "limited":
      return "Limited";
    default:
      return "Available";
  }
}

export function getTicketAvailabilityLabel(status: ScheduledEvent["status"]) {
  switch (status) {
    case "on-sale":
      return "Tickets available";
    case "sold-out":
      return "Tickets sold out";
    case "past":
      return "Event complete";
    default:
      return "Tickets opening soon";
  }
}

export function getDefaultVipPackage(event?: ScheduledEvent | null) {
  if (!event || event.status === "sold-out" || event.status === "past") {
    return undefined;
  }

  const selectablePackages = (event.vipPackages || []).filter(
    item => !isVipPackageSoldOut(event, item)
  );

  return (
    selectablePackages.find(item => item.highlight) ?? selectablePackages[0]
  );
}

export function getVipSelection(event: ScheduledEvent, size: VipPackageSize) {
  const vipPackage = event.vipPackages?.find(item => item.size === size);
  const map = getVipVenueMap(event.venueMap?.id);
  const zone = getVipVenueZone(map, size);

  return { vipPackage, map, zone };
}
