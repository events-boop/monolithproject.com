import { z } from "zod";

export type LeadProvider = "mailchimp" | "beehiiv" | "convertkit" | "hubspot" | "brevo" | "emailoctopus";

const shortText = (max: number) => z.string().trim().max(max).optional();
const urlText = z.string().url().max(500).optional();

const attributionFields = {
  sessionId: shortText(120),
  pageUrl: urlText,
  landingPageUrl: urlText,
  referrer: urlText,
  referrerDomain: shortText(200),
  firstReferrer: urlText,
  firstReferrerDomain: shortText(200),
  firstTouchAt: shortText(40),
  lastTouchAt: shortText(40),
  utmSource: shortText(120),
  utmMedium: shortText(120),
  utmCampaign: shortText(140),
  utmTerm: shortText(140),
  utmContent: shortText(140),
  firstUtmSource: shortText(120),
  firstUtmMedium: shortText(120),
  firstUtmCampaign: shortText(140),
  firstUtmTerm: shortText(140),
  firstUtmContent: shortText(140),
  lastUtmSource: shortText(120),
  lastUtmMedium: shortText(120),
  lastUtmCampaign: shortText(140),
  lastUtmTerm: shortText(140),
  lastUtmContent: shortText(140),
  gclid: shortText(200),
  fbclid: shortText(200),
  ttclid: shortText(200),
  msclkid: shortText(200),
  firstGclid: shortText(200),
  firstFbclid: shortText(200),
  firstTtclid: shortText(200),
  firstMsclkid: shortText(200),
  lastGclid: shortText(200),
  lastFbclid: shortText(200),
  lastTtclid: shortText(200),
  lastMsclkid: shortText(200),
} as const;

export const leadSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  source: z.string().trim().max(120).optional(),
  eventInterest: z.string().trim().max(120).optional(),
  ...attributionFields,
});

export const ticketIntentSchema = z.object({
  source: z.string().trim().min(1).max(120),
  eventId: z.string().trim().max(120).optional(),
  destinationUrl: urlText,
  ...attributionFields,
});

export const bookingInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  entity: z.string().trim().min(2).max(160),
  type: z.enum(["partner-on-location", "artist-booking", "sponsorship", "general"]),
  location: z.string().trim().max(180).optional(),
  message: z.string().trim().min(10).max(5000),
});

export const sponsorAccessSchema = z.object({
  password: z.string().trim().min(1).max(256),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(2).max(5000),
});

export const poshWebhookPayloadSchema = z.record(z.string(), z.unknown());
