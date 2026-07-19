import {
  resolveArtistShowRelease,
  type ArtistShowReleaseConfig,
  type ArtistShowReleaseInput,
} from "./artistShowRelease";

export {
  getYouTubeVideoId,
  resolveArtistShowRelease,
} from "./artistShowRelease";

export type ApeDrumsReleaseInput = Omit<
  ArtistShowReleaseInput,
  "minimumVideos"
>;
export type ApeDrumsReleaseConfig = ArtistShowReleaseConfig;

export const APE_DRUMS_FEATURED_SET_URL =
  "https://www.youtube.com/watch?v=O94vKVHzamk";

export function resolveApeDrumsRelease(input: ApeDrumsReleaseInput) {
  return resolveArtistShowRelease({
    ...input,
    minimumVideos: 2,
  });
}

export const APE_DRUMS_RELEASE = resolveApeDrumsRelease({
  releaseRequested: import.meta.env.VITE_APE_DRUMS_RELEASED,
  contractCountersigned: import.meta.env.VITE_APE_DRUMS_CONTRACT_COUNTERSIGNED,
  ticketUrl: import.meta.env.VITE_APE_DRUMS_TICKET_URL,
  doors: import.meta.env.VITE_APE_DRUMS_DOORS,
  heroImage: import.meta.env.VITE_APE_DRUMS_HERO_IMAGE,
  approvedVideoUrls: [
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_1_URL ||
      APE_DRUMS_FEATURED_SET_URL,
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_2_URL,
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_3_URL,
  ],
});
