export interface ArtistShowReleaseInput {
  releaseRequested?: string;
  contractCountersigned?: string;
  ticketUrl?: string;
  doors?: string;
  heroImage?: string;
  approvedVideoUrls?: Array<string | undefined>;
  allowedTicketHosts?: string[];
  minimumVideos?: number;
  /**
   * ISO event date (YYYY-MM-DD). Once the show has concluded, promos retire
   * and the event hands off to the archive. Not a launch blocker.
   */
  eventDate?: string;
  /**
   * Hours after event-date midnight (local) when the show is treated as
   * concluded. Defaults to 36 — noon the day after the event.
   */
  eventConcludesAfterHours?: number;
}

export interface ArtistShowReleaseConfig {
  publicReady: boolean;
  ticketUrl: string;
  doors: string;
  heroImage: string;
  videoIds: string[];
  blockers: string[];
  /** True once the event itself is over and promos should retire. */
  eventConcluded: boolean;
  /** ISO timestamp when the event is treated as concluded, if known. */
  concludesAt: string | null;
}

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const DEFAULT_TICKET_HOSTS = ["posh.vip"];

function isEnabled(value?: string) {
  return value?.trim().toLowerCase() === "true";
}

function isApprovedTicketUrl(value: string, allowedHosts: string[]) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      allowedHosts.map(host => host.toLowerCase()).includes(url.hostname)
    );
  } catch {
    return false;
  }
}

function isApprovedHeroImage(value: string) {
  if (
    /^\/(?:images|assets)\/[a-zA-Z0-9_./%+()-]+\.(?:avif|gif|jpe?g|png|webp)$/i.test(
      value
    )
  ) {
    return true;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const DEFAULT_CONCLUSION_HOURS = 36;

function resolveConcludesAt(eventDate?: string, afterHours?: number) {
  const normalized = eventDate?.trim();
  if (!normalized) return null;

  const start = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;

  const hours = afterHours ?? DEFAULT_CONCLUSION_HOURS;
  return new Date(start.getTime() + hours * 60 * 60 * 1000);
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

export function resolveArtistShowRelease(
  input: ArtistShowReleaseInput,
  now: Date = new Date()
): ArtistShowReleaseConfig {
  const ticketUrl = input.ticketUrl?.trim() || "";
  const doors = input.doors?.trim() || "";
  const heroImage = input.heroImage?.trim() || "";
  const allowedTicketHosts = input.allowedTicketHosts?.length
    ? input.allowedTicketHosts
    : DEFAULT_TICKET_HOSTS;
  const minimumVideos = Math.max(1, input.minimumVideos ?? 1);
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
  if (!isApprovedTicketUrl(ticketUrl, allowedTicketHosts)) {
    blockers.push("approved checkout URL is missing or invalid");
  }
  if (!doors || /\[|\]|\btba\b/i.test(doors)) {
    blockers.push("doors time is missing");
  }
  if (!isApprovedHeroImage(heroImage)) {
    blockers.push("approved hero image is missing or invalid");
  }
  if (videoIds.length < minimumVideos) {
    const minimumVideoLabel =
      ({ 1: "one", 2: "two", 3: "three" } as Record<number, string>)[
        minimumVideos
      ] || minimumVideos.toString();
    blockers.push(
      `${minimumVideoLabel} approved official YouTube ${
        minimumVideos === 1 ? "URL is" : "URLs are"
      } required`
    );
  }

  const concludesAt = resolveConcludesAt(
    input.eventDate,
    input.eventConcludesAfterHours
  );

  return {
    publicReady: blockers.length === 0,
    ticketUrl,
    doors,
    heroImage,
    videoIds,
    blockers,
    eventConcluded: concludesAt ? now.getTime() >= concludesAt.getTime() : false,
    concludesAt: concludesAt ? concludesAt.toISOString() : null,
  };
}
