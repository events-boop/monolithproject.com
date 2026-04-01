import type {
  SocialEchoActivityRow,
  SocialEchoEventStatsRow,
} from "../db/socialEchoRepo";

export const socialEchoByEvent = new Map<string, SocialEchoEventStatsRow>();
export const socialEchoByEventMaxItems = 200;
export const socialEchoActivity = new Map<string, SocialEchoActivityRow>();
export const socialEchoActivityMaxItems = 120;

export function rememberSocialActivity(activity: SocialEchoActivityRow) {
  socialEchoActivity.set(activity.id, activity);
  if (socialEchoActivity.size <= socialEchoActivityMaxItems) return;

  const ordered = Array.from(socialEchoActivity.values()).sort((a, b) => b.at.localeCompare(a.at));
  const keep = new Set(ordered.slice(0, socialEchoActivityMaxItems).map((item) => item.id));
  socialEchoActivity.forEach((_value, key) => {
    if (!keep.has(key)) socialEchoActivity.delete(key);
  });
}

export function readInMemorySocialEchoSnapshot() {
  const events = Array.from(socialEchoByEvent.values()).sort((a, b) => {
    const scoreA = a.goingCount * 1000 + a.pendingCount * 100;
    const scoreB = b.goingCount * 1000 + b.pendingCount * 100;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
  const activity = Array.from(socialEchoActivity.values())
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 30);

  const totalGoing = events.reduce((sum, event) => sum + event.goingCount, 0);
  const totalPending = events.reduce((sum, event) => sum + event.pendingCount, 0);

  return {
    now: new Date().toISOString(),
    summary: {
      totalGoing,
      totalPending,
      liveEvents: events.length,
    },
    events,
    activity,
  };
}

export function pruneSocialEchoByEvent() {
  if (socialEchoByEvent.size > socialEchoByEventMaxItems) {
    const ordered = Array.from(socialEchoByEvent.entries()).sort(
      (a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt)
    );
    const keep = new Set(ordered.slice(0, socialEchoByEventMaxItems).map(([k]) => k));
    socialEchoByEvent.forEach((_v, k) => {
      if (!keep.has(k)) socialEchoByEvent.delete(k);
    });
  }
}
