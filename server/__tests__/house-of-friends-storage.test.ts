import { afterEach, describe, expect, it } from "vitest";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import {
  completeHouseOfFriendsApplication,
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
  await Promise.all(
    createdFolders
      .splice(0)
      .map(folder => rm(folder, { recursive: true, force: true }))
  );
});

describe("House of Friends local application storage", () => {
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
