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

export const APE_DRUMS_TICKET_URL =
  "https://posh.vip/e/monolith-project-presents-ape-drums?u=erik&_t=mrzne6d7&os=ios&src=event_page";
export const APE_DRUMS_FEATURED_SET_URL =
  "https://www.youtube.com/watch?v=O94vKVHzamk";
export const APE_DRUMS_HERO_IMAGE = import.meta.env.DEV
  ? "/src/assets/private/ape-drums/ape-drums-july31-hero.png"
  : "/images/events/ape-drums-july31-hero.png";
export const APE_DRUMS_SECOND_VIDEO_URL =
  "https://www.youtube.com/watch?v=K_2PZkxuNLY";
export const APE_DRUMS_THIRD_VIDEO_URL =
  "https://www.youtube.com/watch?v=bpG8KPCJ8EM";
export const APE_DRUMS_MAJOR_LAZER_VIDEO_URL =
  "https://www.youtube.com/watch?v=Vyo-kk0wRw4";

export function resolveApeDrumsRelease(input: ApeDrumsReleaseInput) {
  return resolveArtistShowRelease({
    ...input,
    minimumVideos: 2,
  });
}

export const APE_DRUMS_RELEASE = resolveApeDrumsRelease({
  releaseRequested: import.meta.env.VITE_APE_DRUMS_RELEASED,
  contractCountersigned: import.meta.env.VITE_APE_DRUMS_CONTRACT_COUNTERSIGNED,
  ticketUrl: import.meta.env.VITE_APE_DRUMS_TICKET_URL || APE_DRUMS_TICKET_URL,
  doors: import.meta.env.VITE_APE_DRUMS_DOORS,
  heroImage: import.meta.env.VITE_APE_DRUMS_HERO_IMAGE || APE_DRUMS_HERO_IMAGE,
  approvedVideoUrls: [
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_1_URL ||
      APE_DRUMS_FEATURED_SET_URL,
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_2_URL ||
      APE_DRUMS_SECOND_VIDEO_URL,
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_3_URL ||
      APE_DRUMS_THIRD_VIDEO_URL,
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_4_URL ||
      APE_DRUMS_MAJOR_LAZER_VIDEO_URL,
  ],
});

// Square campaign art for the family cross-promo card. Falls back to the
// approved hero when no dedicated promo image is published.
export const APE_DRUMS_PROMO_IMAGE =
  import.meta.env.VITE_APE_DRUMS_PROMO_IMAGE ||
  (import.meta.env.DEV
    ? "/src/assets/private/ape-drums/ape-drums-july31-square.png"
    : "/images/events/ape-drums-july31-square.png") ||
  APE_DRUMS_RELEASE.heroImage;
