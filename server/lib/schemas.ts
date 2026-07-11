import { z } from "zod";
import { honeypotFieldName } from "@shared/generated/hardening";

export type LeadProvider =
  | "disabled"
  | "mailchimp"
  | "beehiiv"
  | "convertkit"
  | "hubspot"
  | "brevo"
  | "emailoctopus"
  | "laylo";

const shortText = (max: number) => z.string().trim().max(max).optional();
const urlText = z.string().url().max(500).optional();
const shortArray = (maxItems: number, maxItemLength: number) =>
  z.array(z.string().trim().min(1).max(maxItemLength)).max(maxItems).optional();

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

const honeypotFields = {
  [honeypotFieldName]: z.string().max(10).optional(),
  metadata_correlation_id: z.string().max(10).optional(),
} as const;

export const leadSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(40).optional(),
  instagramHandle: z.string().trim().max(80).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  source: z.string().trim().max(120).optional(),
  formType: z.string().trim().max(80).optional(),
  funnelId: z.string().trim().max(120).optional(),
  offerId: z.string().trim().max(120).optional(),
  eventInterest: z.string().trim().max(120).optional(),
  eventSeries: z.string().trim().max(80).optional(),
  eventTitle: z.string().trim().max(160).optional(),
  interestTags: shortArray(12, 80),
  ...honeypotFields,
  ...attributionFields,
});

export const clickCaptureSchema = z.object({
  contactId: shortText(120),
  anonymousSessionId: shortText(120),
  buttonName: z.string().trim().min(1).max(120),
  destinationUrl: z.string().trim().min(1).max(700),
  pagePath: z.string().trim().min(1).max(240),
  eventSlug: shortText(160),
  eventDate: shortText(80),
  interestType: shortText(80),
  channel: shortText(80),
  source: shortText(120),
  ...attributionFields,
});

export const pageViewCaptureSchema = z.object({
  contactId: shortText(120),
  anonymousSessionId: shortText(120),
  pagePath: z.string().trim().min(1).max(240),
  eventSlug: shortText(160),
  source: shortText(120),
  ...attributionFields,
});

export const ticketIntentSchema = z.object({
  source: z.string().trim().min(1).max(120),
  eventId: z.string().trim().max(120).optional(),
  destinationUrl: urlText,
  ...attributionFields,
});

// Meta CAPI lead capture. Email stays lax (shape only, no .email()) so an
// odd-but-real address never drops an authentic conversion; format strictness
// adds no protection since forgers can trivially satisfy it anyway.
export const leadConversionCaptureSchema = z.object({
  eventId: z.string().trim().min(1).max(120),
  email: z.string().trim().max(320).optional(),
  phone: z.string().trim().max(40).optional(),
  eventSourceUrl: urlText,
  fbclid: z.string().trim().max(500).optional(),
  ...honeypotFields,
});

export const bookingInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  entity: z.string().trim().min(2).max(160),
  type: z.enum([
    "partner-on-location",
    "artist-booking",
    "sponsorship",
    "general",
  ]),
  location: z.string().trim().max(180).optional(),
  message: z.string().trim().min(10).max(5000),
  ...honeypotFields,
});

export const sponsorAccessSchema = z.object({
  password: z.string().trim().min(1).max(256),
  ...honeypotFields,
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(2).max(5000),
  source: shortText(120),
  formType: shortText(80),
  funnelId: shortText(120),
  interestTags: shortArray(12, 80),
  ...honeypotFields,
});

export const poshWebhookPayloadSchema = z.record(z.string(), z.unknown());
export const layloWebhookPayloadSchema = z.record(z.string(), z.unknown());
