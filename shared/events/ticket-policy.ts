// Published Sunsets policy, shared by public pages and the CMS FAQ seed.
import policy from "./ticket-policy.json";
import sunsets from "./sunsets-page.json";

export const TICKET_POLICY = {
  ...policy,
  salesFinal: `${policy.salesFinal} ${policy.sunsetsRefund}`,
};
export const SUNSETS_REFUND_REQUEST_URL =
  "mailto:events@monolithproject.com?subject=" +
  encodeURIComponent("Refund request — Chasing Sun(Sets) III — September 19") +
  "&body=" +
  encodeURIComponent(
    "Hi Monolith team,\n\nI would like to request a refund for the postponed September 19, 2026 show.\n\nBooking name:\nBooking email:\nOrder ID:\nNumber of tickets:\n\nPlease let me know the next steps. Thank you."
  );
export const SUNSETS_TICKET_HOLDER_UPDATE = sunsets.ticketHolderMessage;
export const TICKET_POLICY_FAQS: Array<[string, string]> = [
  ["What is the ticket refund policy?", TICKET_POLICY.salesFinal],
  [
    "I have a Sun(Sets) III ticket. What happens now?",
    `The JOEZI × MASSUMA show is postponed. ${SUNSETS_TICKET_HOLDER_UPDATE} Keep your booking confirmation and check the official Sunsets event guide for instructions.`,
  ],
];
