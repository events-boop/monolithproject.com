/**
 * Canonical site FAQ content. This is the seed source for the "faqs.site"
 * CMS document (see shared/cms/schemas.ts) and the single source of truth
 * rendered by client/src/pages/FAQ.tsx (categories) and
 * client/src/components/FAQSection.tsx (home). Icons and accent colors stay
 * in the page component — they are presentation, not content.
 */
import type { FaqsSitePayload } from "./cms/schemas";
import { TICKET_POLICY, TICKET_POLICY_FAQS } from "./events/ticket-policy";

export const FAQ_SITE: FaqsSitePayload = {
  categories: [
    {
      id: "tickets-entry",
      label: "Tickets & Entry",
      items: [
        ...TICKET_POLICY_FAQS.slice(1).map(([question, answer]) => ({
          question,
          answer,
        })),
        {
          question: "What is the ticket refund policy?",
          answer: TICKET_POLICY.salesFinal,
        },
        {
          question: "Where do I buy tickets?",
          answer:
            "Use the official ticket link on the event page. Ticket providers vary by event. If sales are paused or details are pending, use the event update link before purchasing.",
        },
        {
          question: "Can I transfer my ticket to someone else?",
          answer:
            "Transfer availability depends on the ticket provider and event. Check your booking confirmation and the provider’s transfer options, or email events@monolithproject.com with your event name and order number.",
        },
        {
          question: "What is the age requirement?",
          answer:
            "Check the event page and your ticket confirmation for the age requirement and ID rules. Sun(Sets) III is 21+ and requires valid government-issued photo ID.",
        },
        {
          question: "Are tickets available at the door or after a sellout?",
          answer:
            "Door sales, waitlists and additional releases are announced for each event. Do not assume entry is available without a confirmed ticket. Check the official event page for availability.",
        },
      ],
    },
    {
      id: "venue-location",
      label: "Venue & Location",
      items: [
        {
          question: "Where is my event?",
          answer:
            "Monolith events take place at different venues. Use the address on your specific event page and check its latest status before travelling. A venue marked “to be announced” is not yet confirmed.",
        },
        {
          question: "How should I plan transport or parking?",
          answer:
            "Check your event’s confirmed venue and address before arranging transport. Parking, transit and rideshare access vary by location; follow any arrival instructions published in the event guide.",
        },
        {
          question: "Is the venue accessible?",
          answer:
            "Accessibility varies by venue. Email events@monolithproject.com with the event name and your access requirements so the team can confirm the arrangements before you attend.",
        },
      ],
    },
    {
      id: "night-of",
      label: "Night Of",
      items: [
        {
          question: "What time do doors open?",
          answer:
            "Door times and set times are specific to each event. Check the event page, your ticket confirmation and the latest status update. If a show is postponed, its original times do not apply to a new date.",
        },
        {
          question: "Is there a dress code?",
          answer:
            "Check the event guide and venue’s entry policy for any dress requirements. For outdoor Sun(Sets) events, plan for the weather and check the latest event update before leaving.",
        },
        {
          question: "Can I re-enter if I leave?",
          answer:
            "Re-entry depends on the event and venue. Confirm the policy with door staff before leaving; do not assume your ticket permits re-entry.",
        },
        {
          question: "Is there coat check?",
          answer:
            "Coat check availability, fees and bag policies vary by venue. Check the event guide or contact events@monolithproject.com with the event name before bringing larger items.",
        },
      ],
    },
    {
      id: "artists-bookings",
      label: "Artists & Bookings",
      items: [
        {
          question: "How do I submit a mix or booking inquiry?",
          answer:
            "Use the Booking page and include your artist name, a mix link, sound and availability.",
        },
        {
          question: "How do I follow up on a booking inquiry?",
          answer:
            "Email events@monolithproject.com with your artist name and the details of your original inquiry. Response times vary.",
        },
        {
          question: "Do you work with international artists?",
          answer:
            "Yes. Monolith hosts artists from Chicago and beyond. Use the Booking page to share your music and tour availability.",
        },
      ],
    },
    {
      id: "safety-community",
      label: "Safety & Community",
      items: [
        {
          question: "What is your policy on harassment?",
          answer:
            "Harassment and discrimination are not welcome at Monolith events. Tell a member of staff or security if you need help or witness behaviour that makes someone feel unsafe.",
        },
        {
          question: "Who do I contact if I feel unsafe at an event?",
          answer:
            "Find a staff member or venue security immediately. For questions before or after an event, email events@monolithproject.com.",
        },
        {
          question: "Can I attend without drinking alcohol?",
          answer:
            "Yes. You are welcome whether or not you drink. Check with the venue about its non-alcoholic options and follow the event’s published age and ID requirements.",
        },
      ],
    },
    {
      id: "accessibility",
      label: "Accessibility",
      items: [
        {
          question: "How do I request accessibility arrangements?",
          answer:
            "Email events@monolithproject.com with the event name and the arrangements you need. Contact us before attending so the team can check the venue’s facilities and confirm what is available.",
        },
        {
          question: "Is there seating available?",
          answer:
            "Seating varies by event and venue. If you need seating, email events@monolithproject.com before booking or attending so the team can confirm availability.",
        },
      ],
    },
  ],
  home: [
    ...TICKET_POLICY_FAQS.slice(1).map(([question, answer]) => ({
      question,
      answer,
    })),
    {
      question: "What is the ticket refund policy?",
      answer: TICKET_POLICY.salesFinal,
    },
    {
      question:
        "What is the difference between Chasing Sun(Sets) and Untold Story?",
      answer:
        "Chasing Sun(Sets) is the open-air series. Untold Story is the after-dark house music series, with intimate rooms and deeper sounds.",
    },
    {
      question: "Where do I find the latest event details?",
      answer:
        "Use the official event guide for ticket availability, venue, arrival times and show updates. Check the status before travelling, especially if a date is postponed or details are pending.",
    },
  ],
};
