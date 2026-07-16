import { describe, expect, it } from "vitest";
import {
  isHouseOfFriendsCampaignHost,
  resolveCampaignHostPath,
} from "../campaignHosts";

describe("campaign host routing", () => {
  it("maps houseoffriends.vip root and apply aliases into the platform", () => {
    expect(isHouseOfFriendsCampaignHost("HOUSEOFFRIENDS.VIP")).toBe(true);
    expect(isHouseOfFriendsCampaignHost("monolithproject.com")).toBe(false);
    expect(resolveCampaignHostPath("houseoffriends.vip", "/")).toBe(
      "/house-of-friends"
    );
    expect(resolveCampaignHostPath("www.houseoffriends.vip", "/apply")).toBe(
      "/house-of-friends/apply"
    );
  });

  it("does not claim the generic apply path on the Monolith host", () => {
    expect(resolveCampaignHostPath("monolithproject.com", "/apply")).toBe(
      "/apply"
    );
  });

  it("preserves the existing Sunsets and Untold campaign roots", () => {
    expect(resolveCampaignHostPath("sunsets.vip", "/")).toBe("/sunsets");
    expect(resolveCampaignHostPath("untold.vip", "/")).toBe("/untold");
  });
});
