import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import {
  completeHouseOfFriendsApplication,
  getHouseOfFriendsApplicationReadiness,
  getLocalAssetPath,
  prepareHouseOfFriendsApplication,
  verifyApplicationToken,
} from "../services/house-of-friends-storage";
import type { HouseOfFriendsPrepareRequest } from "@shared/house-of-friends";

const createdFolders: string[] = [];

const application: HouseOfFriendsPrepareRequest = {
  firstName: "Ari",
  lastName: "Rivera",
  stageName: "ARI R",
  email: "ari@example.com",
  phone: "+1 312 555 0199",
  city: "Chicago",
  state: "Illinois",
  instagram: "@arir",
  artistUrl: "https://soundcloud.com/arir",
  yearsActive: "1-2",
  genres: "Afro House, Melodic House",
  bio: "B".repeat(120),
  whyHouseOfFriends: "W".repeat(120),
  collaborationStyle: "C".repeat(80),
  setTitle: "House of Friends Submission",
  setTracklist: "",
  setUrl: "",
  ageConfirmed: true,
  availabilityConfirmed: true,
  rightsConfirmed: true,
  termsAccepted: true,
  marketingConsent: false,
  photo: { name: "artist.jpg", size: 2_048, type: "image/jpeg" },
  djSet: { name: "artist-set.mp3", size: 4_096, type: "audio/mpeg" },
};

afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(
    createdFolders
      .splice(0)
      .map(folder => rm(folder, { recursive: true, force: true }))
  );
});

describe("House of Friends local application storage", () => {
  it("keeps production applications closed until every explicit gate is ready", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("HOF_APPLICATIONS_OPEN", "false");
    expect(getHouseOfFriendsApplicationReadiness().acceptingApplications).toBe(
      false
    );

    vi.stubEnv("DATABASE_URL", "postgresql://example.test/app");
    vi.stubEnv("HOF_R2_ACCOUNT_ID", "account");
    vi.stubEnv("HOF_R2_ACCESS_KEY_ID", "access");
    vi.stubEnv("HOF_R2_SECRET_ACCESS_KEY", "secret");
    vi.stubEnv("HOF_R2_BUCKET", "house-of-friends-private");
    vi.stubEnv("HOF_APPLICATION_SIGNING_SECRET", "signing-secret");
    expect(getHouseOfFriendsApplicationReadiness().acceptingApplications).toBe(
      false
    );

    vi.stubEnv("HOF_APPLICATIONS_OPEN", "true");
    expect(getHouseOfFriendsApplicationReadiness().acceptingApplications).toBe(
      true
    );
  });

  it("fails closed on Netlify even when NODE_ENV is not production", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NETLIFY", "true");
    vi.stubEnv("HOF_APPLICATIONS_OPEN", "true");

    expect(getHouseOfFriendsApplicationReadiness()).toEqual({
      acceptingApplications: false,
      message:
        "Founding Class applications are temporarily unavailable while secure intake is connected.",
    });
  });

  it("creates one private folder map and finalizes only after both files exist", async () => {
    const prepared = await prepareHouseOfFriendsApplication(application);
    const token = verifyApplicationToken(prepared.applicationToken);
    const folderPath = getLocalAssetPath(token.folderPrefix);
    createdFolders.push(folderPath);

    expect(prepared.referenceCode).toMatch(/^HOF26-[A-F0-9]{8}$/);
    expect(prepared.uploads.map(upload => upload.assetType).sort()).toEqual([
      "dj-set",
      "photo",
    ]);

    const initialProfile = JSON.parse(
      await readFile(getLocalAssetPath(token.profileKey), "utf8")
    );
    expect(initialProfile.status).toBe("uploading");

    for (const asset of Object.values(token.assets)) {
      const assetPath = getLocalAssetPath(asset.key);
      await mkdir(path.dirname(assetPath), { recursive: true });
      await writeFile(assetPath, Buffer.alloc(asset.size, 1));
    }

    const completed = await completeHouseOfFriendsApplication(
      prepared.applicationToken
    );
    expect(completed.status).toBe("submitted");
    expect(completed.folderPrefix).toBe(prepared.folderPrefix);
    expect(completed.submittedAt).toEqual(expect.any(String));
  });
});
