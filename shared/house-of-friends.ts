import { z } from "zod";

export const HOUSE_OF_FRIENDS_APPLICATION_YEAR = 2026;
export const HOUSE_OF_FRIENDS_EVENT_SLUG = "chasing-sunsets-ii-2026-08-22";

export const HOUSE_OF_FRIENDS_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const HOUSE_OF_FRIENDS_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/x-flac",
] as const;

export const HOUSE_OF_FRIENDS_PHOTO_MAX_BYTES = 10 * 1024 * 1024;
export const HOUSE_OF_FRIENDS_AUDIO_MAX_BYTES = 1_500 * 1024 * 1024;
export const HOUSE_OF_FRIENDS_UPLOAD_MIN_BYTES = 1_024;

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine(value => !value || z.string().url().safeParse(value).success, {
    message: "Enter a complete URL, including https://",
  });

export const houseOfFriendsProfileSchema = z.object({
  firstName: z.string().trim().min(2).max(80),
  lastName: z.string().trim().min(2).max(80),
  stageName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(40),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(80),
  instagram: z.string().trim().min(2).max(120),
  artistUrl: optionalUrl,
  yearsActive: z.enum(["under-1", "1-2", "3-5", "6-plus"]),
  genres: z.string().trim().min(2).max(240),
  bio: z.string().trim().min(100).max(1_500),
  whyHouseOfFriends: z.string().trim().min(100).max(1_500),
  collaborationStyle: z.string().trim().min(60).max(1_000),
  setTitle: z.string().trim().min(2).max(160),
  setTracklist: z.string().trim().max(5_000),
  setUrl: optionalUrl,
  ageConfirmed: z.boolean().refine(Boolean, {
    message: "Confirm that you will be 21 or older on August 22, 2026.",
  }),
  availabilityConfirmed: z.boolean().refine(Boolean, {
    message: "Confirm your availability for the full event day.",
  }),
  rightsConfirmed: z.boolean().refine(Boolean, {
    message:
      "Confirm that you have permission to submit this set for private selection review.",
  }),
  termsAccepted: z.boolean().refine(Boolean, {
    message: "Accept the application terms to continue.",
  }),
  marketingConsent: z.boolean(),
});

export type HouseOfFriendsProfile = z.infer<typeof houseOfFriendsProfileSchema>;

export const houseOfFriendsFileDescriptorSchema = z.object({
  name: z.string().trim().min(1).max(240),
  size: z.number().int().min(HOUSE_OF_FRIENDS_UPLOAD_MIN_BYTES),
  type: z.string().trim().min(1).max(120),
  lastModified: z.number().int().nonnegative().optional(),
});

export type HouseOfFriendsFileDescriptor = z.infer<
  typeof houseOfFriendsFileDescriptorSchema
>;

export type HouseOfFriendsAssetType = "photo" | "dj-set";

export type HouseOfFriendsPrepareRequest = HouseOfFriendsProfile & {
  photo: HouseOfFriendsFileDescriptor;
  djSet: HouseOfFriendsFileDescriptor;
};

export type HouseOfFriendsUploadTarget = {
  assetType: HouseOfFriendsAssetType;
  key: string;
  method: "PUT";
  url: string;
  headers: Record<string, string>;
};

export type HouseOfFriendsPrepareResponse = {
  ok: true;
  applicationId: string;
  referenceCode: string;
  folderPrefix: string;
  applicationToken: string;
  uploads: HouseOfFriendsUploadTarget[];
};

export type HouseOfFriendsCompleteResponse = {
  ok: true;
  applicationId: string;
  referenceCode: string;
  message: string;
};

export type HouseOfFriendsApplicationStatusResponse = {
  ok: true;
  acceptingApplications: boolean;
  message: string;
};
