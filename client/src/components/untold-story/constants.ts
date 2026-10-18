import { TICKET_POLICY_FAQS } from "@shared/events/ticket-policy";

// Untold Story palette — synced with CSS custom properties in index.css
// (--color-untold-violet, --color-untold-cyan, --color-untold-deep, --color-untold-card)
// Raw hex kept here for inline style alpha concatenation (e.g. `${violet}25`)
export const violet = "#8B5CF6";
export const cyan = "#22D3EE";
export const deepBg = "#06060F";
export const cardBg = "#0C0C1A";

export const eventVisuals = {
  poster: "/images/untold-story-moody.webp",
  eran: "/images/untold-story-hero-post1.webp",
};

export const lineupVisuals = [
  {
    name: "Next Guest",
    role: "Headliner",
    image: "/images/untold-story-moody.webp",
  },
  {
    name: "Monolith Residents",
    role: "Support",
    image: "/images/untold-story-hero-post1.webp",
  },
  {
    name: "Local Support TBA",
    role: "Support",
    image: "/images/untold-story-juany-deron-v2.webp",
  },
];

export const untoldFaqs: Array<[string, string]> = [
  ...TICKET_POLICY_FAQS,
  [
    "What is Untold Story?",
    "Untold Story is The Monolith Project’s after-dark house music series in Chicago, with intimate rooms and a focus on Afro and melodic house.",
  ],
  [
    "When and where is the next chapter?",
    "Check the event panel on this page for the latest published date, venue and lineup. If details are still to be announced, follow Untold Story for the next update before making travel plans.",
  ],
  [
    "Where can I find tickets?",
    "When tickets are available, the event panel links to the official ticket destination. An updates or first-access link is for announcements and does not reserve admission.",
  ],
  [
    "What should I know before arriving?",
    "Check your event announcement and ticket confirmation for door times, age requirements, ID, dress and re-entry policies. These details are specific to each event and venue.",
  ],
  [
    "Who can help with tables, groups or accessibility?",
    "Email events@monolithproject.com with the event name and your question. For tables or groups, include your party size; confirm availability, pricing and inclusions with the team before booking.",
  ],
  [
    "Where can I find photos from past nights?",
    "The Previous shows and Gallery sections link to the published Untold Story collections. Each chapter has its own photo archive.",
  ],
];
