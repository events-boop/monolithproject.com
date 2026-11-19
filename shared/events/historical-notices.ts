/** A public historical notice, deliberately outside the event sales catalogue. */
export const MONOLITH_LAUNCH_NOTICE = {
  path: "/events/css-oct10",
  alias: "/events/monolith-launch",
  title: "Monolith launch — October 10, 2026",
  description:
    "The Monolith Project launch advertised for October 10, 2026 did not take place. Find official updates and future announcements from The Monolith Project here.",
  status: "Did not take place",
} as const;

/** A stale database row must not turn this notice back into a marketed show. */
export function isHistoricalLaunchRecord(event: { id: string; slug?: string }) {
  const ids = [MONOLITH_LAUNCH_NOTICE.path, MONOLITH_LAUNCH_NOTICE.alias].map(
    path => path.slice("/events/".length)
  );
  return (
    ids.includes(event.id) || Boolean(event.slug && ids.includes(event.slug))
  );
}

export function buildLaunchNoticeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://monolithproject.com${MONOLITH_LAUNCH_NOTICE.path}#webpage`,
    url: `https://monolithproject.com${MONOLITH_LAUNCH_NOTICE.path}`,
    name: MONOLITH_LAUNCH_NOTICE.title,
    description: MONOLITH_LAUNCH_NOTICE.description,
    isPartOf: { "@id": "https://monolithproject.com/#website" },
    about: { "@id": "https://monolithproject.com/#organization" },
  };
}
