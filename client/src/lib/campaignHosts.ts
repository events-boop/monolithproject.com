import { CAMPAIGN_HOSTS, ROUTES } from "@shared/routes";

function normalizeRouteLocation(location: string) {
  return (location.split("?")[0].replace(/\/$/, "") || "/").toLowerCase();
}

export function resolveCampaignHostPath(host: string, location: string) {
  const normalizedLocation = normalizeRouteLocation(location);
  const normalizedHost = host.trim().toLowerCase();
  const isSunsetsHost =
    normalizedHost === CAMPAIGN_HOSTS.sunsetsVip ||
    normalizedHost === CAMPAIGN_HOSTS.sunsetsVipWww;
  const isUntoldHost =
    normalizedHost === CAMPAIGN_HOSTS.untoldVip ||
    normalizedHost === CAMPAIGN_HOSTS.untoldVipWww;
  const isHouseOfFriendsHost =
    normalizedHost === CAMPAIGN_HOSTS.houseOfFriendsVip ||
    normalizedHost === CAMPAIGN_HOSTS.houseOfFriendsVipWww;

  if (normalizedLocation === ROUTES.home && isSunsetsHost) {
    return ROUTES.sunsets;
  }
  if (normalizedLocation === ROUTES.home && isUntoldHost) {
    return ROUTES.untoldVip;
  }
  if (normalizedLocation === ROUTES.home && isHouseOfFriendsHost) {
    return ROUTES.houseOfFriends;
  }
  if (normalizedLocation === "/apply" && isHouseOfFriendsHost) {
    return ROUTES.houseOfFriendsApply;
  }

  return normalizedLocation;
}
