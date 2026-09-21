/**
 * CMS payload contracts — strict zod schemas for every managed document.
 * These are the publish gate: server/db/cmsRepo.ts refuses to store any
 * payload that fails validation, and scripts/cms_seed.mts validates before
 * inserting. Schemas are strict (unknown keys rejected) so a payload can
 * never silently carry fields the render pipeline does not understand.
 */
import { z } from "zod";
import {
  CMS_DOCUMENT_KEYS,
  isCmsDocumentKey,
  type CmsDocumentKey,
} from "./documents";

/**
 * URLs must be https-absolute or site-relative ("/…"). This rejects
 * javascript:, data:, plain http:, and protocol-relative "//" URLs outright.
 */
function isSafeUrl(value: string) {
  if (value.startsWith("/")) return !value.startsWith("//");
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

const safeUrl = (max = 1000) =>
  z
    .string()
    .min(1)
    .max(max)
    .refine(isSafeUrl, {
      message: "URL must be https-absolute or site-relative (starting with /)",
    });

const httpsUrl = (max = 1000) =>
  z
    .string()
    .min(1)
    .max(max)
    .refine(isHttpsUrl, { message: "URL must be https-absolute" });

const isoDateTime = z.iso.datetime({ offset: true });

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const kebabId = (max = 120) =>
  z.string().min(1).max(max).regex(kebabCase, "Must be kebab-case");

const nonEmpty = (max = 500) => z.string().min(1).max(max);

/* ------------------------------------------------------------------------ */
/* events.catalogue                                                          */
/* ------------------------------------------------------------------------ */

const eventSeriesSchema = z.enum([
  "chasing-sunsets",
  "untold-story",
  "monolith-project",
]);

const eventWindowStatusSchema = z.enum([
  "EventScheduled",
  "EventCancelled",
  "EventPostponed",
  "EventRescheduled",
]);

const eventStatusSchema = z.enum([
  "draft",
  "hidden",
  "on-sale",
  "coming-soon",
  "sold-out",
  "past",
]);

const activeFunnelSchema = z.enum([
  "waitlist",
  "waitlist-chasing",
  "waitlist-untold",
  "giveaway",
  "coordinates",
]);

const ticketTierSchema = z.strictObject({
  id: nonEmpty(80),
  name: nonEmpty(120),
  price: z.number().nonnegative(),
  originalPrice: z.number().nonnegative().optional(),
  description: z.string().max(500),
  features: z.array(nonEmpty(200)).max(24),
  icon: z.enum(["ticket", "star", "crown"]),
  available: z.boolean(),
  highlight: z.boolean().optional(),
});

const vipPackageSchema = z.strictObject({
  size: z.enum(["small", "medium", "large"]),
  name: nonEmpty(120),
  guestRange: nonEmpty(80),
  description: z.string().max(500),
  features: z.array(nonEmpty(200)).max(24),
  availability: z.enum(["available", "limited", "sold-out"]),
  minimumSpend: nonEmpty(120).optional(),
  highlight: z.boolean().optional(),
});

const venueMapSchema = z.strictObject({
  id: nonEmpty(120),
  venueId: nonEmpty(120),
  address: nonEmpty(300),
  neighborhood: nonEmpty(160).optional(),
  illustrative: z.boolean().optional(),
});

const eventArtistImageSchema = z.strictObject({
  src: safeUrl(),
  alt: nonEmpty(200),
  artist: nonEmpty(120),
});

const eventGatesSchema = z.strictObject({
  creativeReady: z.boolean(),
  trackingQA: z.boolean(),
  poshLinked: z.boolean(),
});

const eventFaqSchema = z.strictObject({
  q: nonEmpty(300),
  a: nonEmpty(2000),
});

const NON_SELLING_WINDOW_STATUSES = new Set(["EventPostponed", "EventCancelled"]);
const SELLING_STATUSES = new Set(["on-sale", "sold-out"]);

/**
 * Mirrors ScheduledEvent (shared/events/types.ts) minus `primaryCta`, which
 * is derived server-side and never stored.
 */
export const eventRecordSchema = z
  .strictObject({
    id: kebabId(),
    series: eventSeriesSchema,
    episode: nonEmpty(120),
    title: nonEmpty(200),
    slug: kebabId().optional(),
    subtitle: nonEmpty(300).optional(),
    date: nonEmpty(120),
    time: nonEmpty(120),
    confirmationStatus: z.enum(["pending", "confirmed"]).optional(),
    eventStatus: eventWindowStatusSchema.optional(),
    startsAt: isoDateTime.optional(),
    endsAt: isoDateTime.optional(),
    doors: nonEmpty(120).optional(),
    venue: nonEmpty(200),
    location: nonEmpty(200),
    lineup: nonEmpty(500).optional(),
    image: safeUrl().optional(),
    artistImages: z.array(eventArtistImageSchema).max(24).optional(),
    status: eventStatusSchema,
    featured: z.boolean().optional(),
    inventoryState: z.enum(["normal", "low"]).optional(),
    capacity: nonEmpty(160).optional(),
    format: nonEmpty(200).optional(),
    dress: nonEmpty(200).optional(),
    sound: nonEmpty(200).optional(),
    description: z.string().max(4000).optional(),
    age: nonEmpty(120).optional(),
    ticketUrl: safeUrl().optional(),
    startingPrice: z.number().nonnegative().optional(),
    ticketTiers: z.array(ticketTierSchema).max(12).optional(),
    headline: nonEmpty(300).optional(),
    mainExperience: nonEmpty(200).optional(),
    experienceIntro: z.string().max(2000).optional(),
    whatToExpect: z.array(nonEmpty(300)).max(24).optional(),
    tablePackages: z.array(nonEmpty(300)).max(24).optional(),
    tableReservationEmail: z.email().max(200).optional(),
    venueMap: venueMapSchema.optional(),
    vipPackages: z.array(vipPackageSchema).max(12).optional(),
    faqs: z.array(eventFaqSchema).max(40).optional(),
    photoNotice: z.string().max(1000).optional(),
    eventNotice: z.string().max(1000).optional(),
    activeFunnels: z.array(activeFunnelSchema).max(8).optional(),
    recentlyDropped: z.boolean().optional(),
    layloDropId: nonEmpty(80).optional(),
    gates: eventGatesSchema.optional(),
    archiveSlug: kebabId().optional(),
    recapUrl: safeUrl().optional(),
  })
  .superRefine((event, ctx) => {
    if (
      event.startsAt &&
      event.endsAt &&
      Date.parse(event.endsAt) <= Date.parse(event.startsAt)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "endsAt must be after startsAt",
      });
    }

    if (
      event.eventStatus &&
      NON_SELLING_WINDOW_STATUSES.has(event.eventStatus)
    ) {
      if (event.ticketUrl) {
        ctx.addIssue({
          code: "custom",
          path: ["ticketUrl"],
          message: `ticketUrl is not allowed while eventStatus is ${event.eventStatus}`,
        });
      }
      if (SELLING_STATUSES.has(event.status)) {
        ctx.addIssue({
          code: "custom",
          path: ["status"],
          message: `status cannot be "${event.status}" while eventStatus is ${event.eventStatus}`,
        });
      }
    }

    if (event.status === "on-sale") {
      if (!event.ticketUrl) {
        ctx.addIssue({
          code: "custom",
          path: ["ticketUrl"],
          message: 'An https ticketUrl is required while status is "on-sale"',
        });
      } else if (!isHttpsUrl(event.ticketUrl)) {
        ctx.addIssue({
          code: "custom",
          path: ["ticketUrl"],
          message: 'ticketUrl must be https-absolute while status is "on-sale"',
        });
      }
    }

    if (
      (event.status === "draft" || event.status === "hidden") &&
      event.ticketUrl
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["ticketUrl"],
        message: `ticketUrl is not allowed while status is "${event.status}"`,
      });
    }
  });

export const eventsCatalogueSchema = z
  .strictObject({
    events: z.array(eventRecordSchema).min(1).max(500),
  })
  .superRefine((catalogue, ctx) => {
    const seenIds = new Map<string, number>();
    const seenSlugs = new Map<string, number>();
    catalogue.events.forEach((event, index) => {
      const firstId = seenIds.get(event.id);
      if (firstId !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["events", index, "id"],
          message: `Duplicate event id "${event.id}" (first seen at index ${firstId})`,
        });
      } else {
        seenIds.set(event.id, index);
      }
      if (event.slug) {
        const firstSlug = seenSlugs.get(event.slug);
        if (firstSlug !== undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["events", index, "slug"],
            message: `Duplicate event slug "${event.slug}" (first seen at index ${firstSlug})`,
          });
        } else {
          seenSlugs.set(event.slug, index);
        }
      }
    });
  });

/* ------------------------------------------------------------------------ */
/* sunsets.publication                                                       */
/* ------------------------------------------------------------------------ */

const sunsetsStatusSchema = z.enum([
  "EventScheduled",
  "EventPostponed",
  "EventRescheduled",
  "EventCancelled",
]);

const sunsetsScheduleSlotSchema = z.strictObject({
  artist: nonEmpty(120),
  start: isoDateTime,
  end: isoDateTime,
});

/**
 * Mirrors every field of shared/events/sunsets-page.json and the validation
 * gates enforced by scripts/render_sunsets_page.mjs.
 */
export const sunsetsPublicationSchema = z
  .strictObject({
    canonical: safeUrl(),
    name: nonEmpty(300),
    start: isoDateTime,
    end: isoDateTime,
    venueName: nonEmpty(200),
    address: nonEmpty(300),
    streetAddress: nonEmpty(300),
    locationShort: nonEmpty(160),
    venueHeading: z.string().min(1).max(1000),
    venueDescription: z.string().min(1).max(2000),
    directionsUrl: safeUrl(),
    status: sunsetsStatusSchema,
    statusHeading: z.string().min(1).max(500),
    statusMessage: z.string().min(1).max(2000),
    updatedAt: isoDateTime,
    salesEnabled: z.boolean(),
    ticketUrl: safeUrl().optional(),
    headliners: z.array(nonEmpty(120)).min(1).max(24),
    support: z.array(nonEmpty(120)).max(48),
    schedule: z.array(sunsetsScheduleSlotSchema).max(96),
    scheduleMessage: z.string().min(1).max(2000),
    artworkApprovedFor: z.strictObject({
      start: isoDateTime,
      venueName: nonEmpty(200),
    }),
    heroArtwork: z.string().min(1).max(20000),
    socialImage: safeUrl(),
    statusApproval: z.string().max(2000).optional(),
    ticketHolderMessage: z.string().max(2000).optional(),
    statusParagraphs: z.array(z.string().min(1).max(2000)).max(24),
  })
  .superRefine((event, ctx) => {
    if (Date.parse(event.end) <= Date.parse(event.start)) {
      ctx.addIssue({
        code: "custom",
        path: ["end"],
        message: "end must be after start",
      });
    }

    if (event.status !== "EventScheduled") {
      if (!event.statusApproval?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["statusApproval"],
          message:
            "A named owner approval is required for a non-scheduled status",
        });
      }
      if (event.salesEnabled) {
        ctx.addIssue({
          code: "custom",
          path: ["salesEnabled"],
          message:
            "Sales must be disabled until ticket instructions for the status change are approved",
        });
      }
    }

    if (event.salesEnabled) {
      if (!["EventScheduled", "EventRescheduled"].includes(event.status)) {
        ctx.addIssue({
          code: "custom",
          path: ["salesEnabled"],
          message: `Sales cannot be enabled while status is ${event.status}`,
        });
      }
      if (!event.ticketUrl || !isHttpsUrl(event.ticketUrl)) {
        ctx.addIssue({
          code: "custom",
          path: ["ticketUrl"],
          message: "An https ticketUrl is required while sales are enabled",
        });
      }
    }

    // Artwork and venue photography carry date/location information — a
    // changed show must not silently ship the previous poster.
    if (event.artworkApprovedFor.start !== event.start) {
      ctx.addIssue({
        code: "custom",
        path: ["artworkApprovedFor", "start"],
        message: "artworkApprovedFor.start must equal start (stale artwork)",
      });
    }
    if (event.artworkApprovedFor.venueName !== event.venueName) {
      ctx.addIssue({
        code: "custom",
        path: ["artworkApprovedFor", "venueName"],
        message:
          "artworkApprovedFor.venueName must equal venueName (stale artwork)",
      });
    }

    // Set-time gates mirrored from scripts/render_sunsets_page.mjs.
    const lineup = new Set([...event.headliners, ...event.support]);
    let previous = Date.parse(event.start);
    event.schedule.forEach((slot, index) => {
      if (!lineup.has(slot.artist)) {
        ctx.addIssue({
          code: "custom",
          path: ["schedule", index, "artist"],
          message: `Schedule artist "${slot.artist}" is not in the approved lineup`,
        });
      }
      if (
        Date.parse(slot.start) < previous ||
        Date.parse(slot.end) <= Date.parse(slot.start) ||
        Date.parse(slot.end) > Date.parse(event.end)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["schedule", index],
          message:
            "Schedule slots must be sequential, start after the previous slot, and end within the event window",
        });
      }
      previous = Date.parse(slot.end);
    });
  });

/* ------------------------------------------------------------------------ */
/* faqs.site                                                                 */
/* ------------------------------------------------------------------------ */

const faqItemSchema = z.strictObject({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
});

const faqCategorySchema = z.strictObject({
  id: kebabId(80),
  label: z.string().min(1).max(80),
  items: z.array(faqItemSchema).min(1).max(40),
});

export const faqsSiteSchema = z
  .strictObject({
    categories: z.array(faqCategorySchema).min(1).max(24),
    home: z.array(faqItemSchema).min(1).max(12),
  })
  .superRefine((faqs, ctx) => {
    const seen = new Map<string, number>();
    faqs.categories.forEach((category, index) => {
      const first = seen.get(category.id);
      if (first !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["categories", index, "id"],
          message: `Duplicate category id "${category.id}" (first seen at index ${first})`,
        });
      } else {
        seen.set(category.id, index);
      }
    });
  });

/* ------------------------------------------------------------------------ */
/* home.featured                                                             */
/* ------------------------------------------------------------------------ */

export const homeFeaturedSchema = z.strictObject({
  slots: z.strictObject({
    hero: kebabId(),
    banner: kebabId(),
    funnel: kebabId(),
    ticket: kebabId(),
    guide: kebabId(),
  }),
});

/* ------------------------------------------------------------------------ */
/* tracking.pixels                                                           */
/* ------------------------------------------------------------------------ */

/** Meta/Facebook pixel IDs are long numeric strings. */
const metaPixelId = z
  .string()
  .regex(/^\d{8,20}$/, "Meta pixel ID must be 8-20 digits");

/** GA4 measurement IDs look like G-DE8Z8VS263. */
const ga4MeasurementId = z
  .string()
  .regex(/^G-[A-Z0-9]{6,12}$/, "GA4 measurement ID must look like G-XXXXXXXX");

export const trackingPixelsSchema = z.strictObject({
  metaPixelId,
  metaBrandPixelId: metaPixelId.nullable(),
  ga4MeasurementId,
  notes: z.string().max(200).optional(),
});

/* ------------------------------------------------------------------------ */
/* Registry + validation helper                                              */
/* ------------------------------------------------------------------------ */

export const CMS_PAYLOAD_SCHEMAS: Record<CmsDocumentKey, z.ZodType> = {
  "events.catalogue": eventsCatalogueSchema,
  "sunsets.publication": sunsetsPublicationSchema,
  "faqs.site": faqsSiteSchema,
  "home.featured": homeFeaturedSchema,
  "tracking.pixels": trackingPixelsSchema,
};

export interface CmsValidationResult {
  success: boolean;
  issues: string[];
}

/**
 * Validates a payload against the schema registered for `key`. Issues are
 * flattened to "path.to.field: message" strings. Unknown keys fail closed.
 */
export function validateCmsPayload(
  key: string,
  payload: unknown
): CmsValidationResult {
  if (!isCmsDocumentKey(key)) {
    return {
      success: false,
      issues: [
        `Unknown CMS document key "${key}". Expected one of: ${CMS_DOCUMENT_KEYS.join(", ")}`,
      ],
    };
  }
  const result = CMS_PAYLOAD_SCHEMAS[key].safeParse(payload);
  if (result.success) return { success: true, issues: [] };
  return {
    success: false,
    issues: result.error.issues.map(issue => {
      const path = issue.path.map(String).join(".");
      return `${path || "(root)"}: ${issue.message}`;
    }),
  };
}

export type EventsCataloguePayload = z.infer<typeof eventsCatalogueSchema>;
export type SunsetsPublicationPayload = z.infer<
  typeof sunsetsPublicationSchema
>;
export type FaqsSitePayload = z.infer<typeof faqsSiteSchema>;
export type HomeFeaturedPayload = z.infer<typeof homeFeaturedSchema>;
export type TrackingPixelsPayload = z.infer<typeof trackingPixelsSchema>;
