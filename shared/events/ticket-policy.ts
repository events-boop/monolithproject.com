// Published Sunsets policy, shared by public pages and the CMS FAQ seed.
import policy from "./ticket-policy.json";
import sunsets from "./sunsets-page.json";

export const TICKET_POLICY = policy;
export const SUNSETS_TICKET_HOLDER_UPDATE = sunsets.ticketHolderMessage;
export const TICKET_POLICY_FAQS: Array<[string, string]> = [
  ["What is the ticket refund policy?", policy.salesFinal],
  [
    "I have a Sun(Sets) III ticket. What happens now?",
    `The JOEZI × MASSUMA show is postponed. ${SUNSETS_TICKET_HOLDER_UPDATE} Keep your booking confirmation and check the official Sunsets event guide for instructions.`,
  ],
];
