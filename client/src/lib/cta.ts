export const CTA_LABELS = {
  tickets: "Get Tickets",
  schedule: "View Schedule",
  collective: "Enter The Collective",
  journal: "Open Insights",
  radioHub: "Open Radio Show",
  listenNow: "Listen Now",
  archive: "Browse Archive",
  press: "View Press",
  pressKit: "Press Kit",
  network: "Meet The Network",
  sunSets: "Explore Sun(Sets)",
  untoldStory: "Enter Untold Story",
  innerCircle: "Request Access",
  readFeature: "Read Feature",
  readEntry: "Read Entry",
  backToJournal: "Back to Insights",
  viewHome: "Back to Home",
  readFacts: "Fast Facts",
  contact: "Start Contact",
  viewPartners: "View Partners",
  openPressContext: "Open Press Context",
  getTicketsNow: "Get Tickets Now",
  moveTogether: "Explore The Movement",
} as const;

export function getHomePrimaryCtaLabel(hasLiveTickets: boolean) {
  return hasLiveTickets ? CTA_LABELS.tickets : CTA_LABELS.schedule;
}

export function getHomeSecondaryCtaLabel(hasLiveTickets: boolean) {
  return hasLiveTickets ? CTA_LABELS.schedule : CTA_LABELS.archive;
}

export function getHeroEventStatusLabel(hasLiveTickets: boolean) {
  return hasLiveTickets ? "Tickets Live" : CTA_LABELS.schedule;
}
