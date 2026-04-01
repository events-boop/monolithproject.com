export const CTA_LABELS = {
  tickets: "Secure Tickets",
  schedule: "The Program",
  collective: "Enter Collective",
  journal: "The Archive",
  radioHub: "The Signal",
  listenNow: "Play",
  archive: "View Records",
  press: "Press",
  pressKit: "Press Kit",
  network: "The Network",
  sunSets: "Enter Sun(Sets)",
  untoldStory: "Enter Untold",
  innerCircle: "Request Access",
  readFeature: "Read",
  readEntry: "Read",
  backToJournal: "Back",
  viewHome: "Home",
  readFacts: "The Facts",
  contact: "Inquiries",
  viewPartners: "Partners",
  openPressContext: "Context",
  getTicketsNow: "Secure Access",
  moveTogether: "Move With Us",
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
