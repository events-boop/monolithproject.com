import { z } from "zod";

export type LeadProvider = "mailchimp" | "beehiiv" | "convertkit" | "hubspot" | "brevo" | "emailoctopus";

export const leadSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  consent: z.literal(true),
  source: z.string().trim().max(120).optional(),
  eventInterest: z.string().trim().max(120).optional(),
  utmSource: z.string().trim().max(120).optional(),
  utmMedium: z.string().trim().max(120).optional(),
  utmCampaign: z.string().trim().max(140).optional(),
  utmTerm: z.string().trim().max(140).optional(),
  utmContent: z.string().trim().max(140).optional(),
  pageUrl: z.string().url().max(500).optional(),
});

export const ticketIntentSchema = z.object({
  source: z.string().trim().min(1).max(120),
  eventId: z.string().trim().max(120).optional(),
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
