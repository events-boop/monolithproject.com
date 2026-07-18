export interface ApeDrumsReleaseInput {
  releaseRequested?: string;
  contractCountersigned?: string;
  ticketUrl?: string;
  doors?: string;
  approvedVideoUrls?: Array<string | undefined>;
}

export interface ApeDrumsReleaseConfig {
  publicReady: boolean;
  ticketUrl: string;
  doors: string;
  videoIds: string[];
  blockers: string[];
}

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

function isEnabled(value?: string) {
  return value?.trim().toLowerCase() === "true";
}

function isApprovedPoshUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "posh.vip";
  } catch {
    return false;
  }
}

export function getYouTubeVideoId(value?: string) {
  const normalized = value?.trim();
  if (!normalized) return null;
  if (YOUTUBE_ID_PATTERN.test(normalized)) return normalized;

  try {
    const url = new URL(normalized);
    if (url.hostname === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (
      url.hostname !== "youtube.com" &&
      url.hostname !== "www.youtube.com" &&
      url.hostname !== "m.youtube.com"
    ) {
      return null;
    }

    const pathId = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    const id = url.searchParams.get("v") || pathId;
    return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function resolveApeDrumsRelease(
  input: ApeDrumsReleaseInput
): ApeDrumsReleaseConfig {
  const ticketUrl = input.ticketUrl?.trim() || "";
  const doors = input.doors?.trim() || "";
  const videoIds = Array.from(
    new Set(
      (input.approvedVideoUrls || [])
        .map(getYouTubeVideoId)
        .filter((id): id is string => Boolean(id))
    )
  );
  const blockers: string[] = [];

  if (!isEnabled(input.releaseRequested)) {
    blockers.push("release flag is closed");
  }
  if (!isEnabled(input.contractCountersigned)) {
    blockers.push("contract countersignature is not confirmed");
  }
  if (!isApprovedPoshUrl(ticketUrl)) {
    blockers.push("Posh checkout URL is missing or invalid");
  }
  if (!doors || /\[|\]|\btba\b/i.test(doors)) {
    blockers.push("doors time is missing");
  }
  if (videoIds.length < 2) {
    blockers.push("two approved official YouTube URLs are required");
  }

  return {
    publicReady: blockers.length === 0,
    ticketUrl,
    doors,
    videoIds,
    blockers,
  };
}

export const APE_DRUMS_RELEASE = resolveApeDrumsRelease({
  releaseRequested: import.meta.env.VITE_APE_DRUMS_RELEASED,
  contractCountersigned: import.meta.env.VITE_APE_DRUMS_CONTRACT_COUNTERSIGNED,
  ticketUrl: import.meta.env.VITE_APE_DRUMS_TICKET_URL,
  doors: import.meta.env.VITE_APE_DRUMS_DOORS,
  approvedVideoUrls: [
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_1_URL,
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_2_URL,
    import.meta.env.VITE_APE_DRUMS_APPROVED_VIDEO_3_URL,
  ],
});
