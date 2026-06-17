import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "../db/client";
import {
  campaigns,
  contacts,
  contactEventInterest,
  emailPlatformSyncStatus,
  events,
  formSubmissions,
  layloSignups,
  sponsorLeads,
  utmSources,
  vipLeads,
} from "../db/schema";
import { leadSchema, type LeadProvider } from "../lib/schemas";
import { scrubEmail } from "../lib/security";
import { logEvent } from "../lib/logging";

type LeadInput = z.infer<typeof leadSchema>;

type PersistLeadCaptureInput = {
  lead: LeadInput;
  provider: LeadProvider;
  idempotencyKey: string;
  requestId: string;
};

type PersistedLeadCapture = {
  contactId?: string;
  campaignId?: string;
  eventId?: string;
  formSubmissionId?: string;
};

function pagePathFromUrl(pageUrl?: string) {
  if (!pageUrl) return undefined;

  try {
    return new URL(pageUrl).pathname;
  } catch {
    return undefined;
  }
}

function hasAttribution(lead: LeadInput) {
  return Boolean(
    lead.utmSource ||
    lead.utmMedium ||
    lead.utmCampaign ||
    lead.utmTerm ||
    lead.utmContent ||
    lead.gclid ||
    lead.fbclid ||
    lead.ttclid ||
    lead.msclkid ||
    lead.pageUrl ||
    lead.landingPageUrl ||
    lead.referrer ||
    lead.sessionId
  );
}

function buildCampaignKey(lead: LeadInput) {
  const campaign =
    lead.utmCampaign || lead.lastUtmCampaign || lead.firstUtmCampaign;
  const source =
    lead.utmSource || lead.lastUtmSource || lead.firstUtmSource || lead.source;
  const medium = lead.utmMedium || lead.lastUtmMedium || lead.firstUtmMedium;

  if (!campaign && !source && !medium) return undefined;
  return [campaign || "uncampaigned", source || "unknown", medium || "unknown"]
    .join(":")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 240);
}

function leadMatchesIntent(lead: LeadInput, intent: string) {
  const haystack = [
    lead.formType,
    lead.source,
    lead.funnelId,
    lead.offerId,
    lead.eventSeries,
    ...(lead.interestTags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(intent);
}

async function upsertCampaign(lead: LeadInput) {
  const db = getDatabase();
  const key = buildCampaignKey(lead);
  if (!db || !key) return undefined;

  const now = new Date().toISOString();
  const [row] = await db
    .insert(campaigns)
    .values({
      id: randomUUID(),
      key,
      name:
        lead.utmCampaign ||
        lead.lastUtmCampaign ||
        lead.firstUtmCampaign ||
        key,
      source:
        lead.utmSource ||
        lead.lastUtmSource ||
        lead.firstUtmSource ||
        lead.source ||
        null,
      medium:
        lead.utmMedium || lead.lastUtmMedium || lead.firstUtmMedium || null,
      platform:
        lead.utmSource || lead.lastUtmSource || lead.firstUtmSource || null,
      updatedAt: now,
      metadata: {
        firstUtmCampaign: lead.firstUtmCampaign,
        lastUtmCampaign: lead.lastUtmCampaign,
      },
    })
    .onConflictDoUpdate({
      target: campaigns.key,
      set: {
        source:
          lead.utmSource ||
          lead.lastUtmSource ||
          lead.firstUtmSource ||
          lead.source ||
          null,
        medium:
          lead.utmMedium || lead.lastUtmMedium || lead.firstUtmMedium || null,
        platform:
          lead.utmSource || lead.lastUtmSource || lead.firstUtmSource || null,
        updatedAt: now,
      },
    })
    .returning({ id: campaigns.id });

  return row?.id;
}

async function upsertEvent(lead: LeadInput) {
  const db = getDatabase();
  if (!db || !lead.eventInterest) return undefined;

  const now = new Date().toISOString();
  const [row] = await db
    .insert(events)
    .values({
      id: lead.eventInterest,
      externalId: lead.eventInterest,
      series: lead.eventSeries || null,
      title: lead.eventTitle || lead.eventInterest,
      status: "interest",
      updatedAt: now,
      metadata: { source: lead.source, funnelId: lead.funnelId },
    })
    .onConflictDoUpdate({
      target: events.id,
      set: {
        series: lead.eventSeries || null,
        title: lead.eventTitle || lead.eventInterest,
        updatedAt: now,
      },
    })
    .returning({ id: events.id });

  return row?.id;
}

export async function persistLeadCapture({
  lead,
  provider,
  idempotencyKey,
  requestId,
}: PersistLeadCaptureInput): Promise<PersistedLeadCapture> {
  const db = getDatabase();
  if (!db) return {};

  const email = scrubEmail(lead.email);
  const now = new Date().toISOString();
  const pagePath = pagePathFromUrl(lead.pageUrl);
  const source =
    lead.source || lead.utmSource || lead.lastUtmSource || "website";

  try {
    const [contact] = await db
      .insert(contacts)
      .values({
        id: randomUUID(),
        email,
        emailNormalized: email,
        phone: lead.phone || null,
        firstName: lead.firstName || null,
        lastName: lead.lastName || null,
        instagramHandle: lead.instagramHandle || null,
        city: lead.city || null,
        state: lead.state || null,
        primarySource: source,
        sourceFirstSeen: lead.firstUtmSource || lead.utmSource || source,
        utmSource:
          lead.utmSource || lead.lastUtmSource || lead.firstUtmSource || null,
        utmMedium:
          lead.utmMedium || lead.lastUtmMedium || lead.firstUtmMedium || null,
        utmCampaign:
          lead.utmCampaign ||
          lead.lastUtmCampaign ||
          lead.firstUtmCampaign ||
          null,
        utmContent:
          lead.utmContent ||
          lead.lastUtmContent ||
          lead.firstUtmContent ||
          null,
        utmTerm: lead.utmTerm || lead.lastUtmTerm || lead.firstUtmTerm || null,
        lastSeenAt: now,
        consentEmail: true,
        consentSms: Boolean(lead.phone),
        tags: lead.interestTags || [],
        metadata: {
          requestId,
          funnelId: lead.funnelId,
          offerId: lead.offerId,
          interestTags: lead.interestTags,
        },
      })
      .onConflictDoUpdate({
        target: contacts.emailNormalized,
        set: {
          phone: lead.phone || null,
          firstName: lead.firstName || null,
          lastName: lead.lastName || null,
          instagramHandle: lead.instagramHandle || null,
          city: lead.city || null,
          state: lead.state || null,
          primarySource: source,
          utmSource:
            lead.utmSource || lead.lastUtmSource || lead.firstUtmSource || null,
          utmMedium:
            lead.utmMedium || lead.lastUtmMedium || lead.firstUtmMedium || null,
          utmCampaign:
            lead.utmCampaign ||
            lead.lastUtmCampaign ||
            lead.firstUtmCampaign ||
            null,
          utmContent:
            lead.utmContent ||
            lead.lastUtmContent ||
            lead.firstUtmContent ||
            null,
          utmTerm:
            lead.utmTerm || lead.lastUtmTerm || lead.firstUtmTerm || null,
          lastSeenAt: now,
          consentEmail: true,
          consentSms: Boolean(lead.phone),
          tags: lead.interestTags || [],
          metadata: sql`${contacts.metadata} || ${JSON.stringify({
            lastRequestId: requestId,
            lastFunnelId: lead.funnelId,
            lastOfferId: lead.offerId,
          })}::jsonb`,
        },
      })
      .returning({ id: contacts.id });

    const contactId = contact?.id;
    const [campaignId, eventId] = await Promise.all([
      upsertCampaign(lead),
      upsertEvent(lead),
    ]);

    if (contactId && hasAttribution(lead)) {
      await db.insert(utmSources).values({
        id: randomUUID(),
        contactId,
        campaignId: campaignId || null,
        sessionId: lead.sessionId || null,
        source:
          lead.utmSource ||
          lead.lastUtmSource ||
          lead.firstUtmSource ||
          source ||
          null,
        medium:
          lead.utmMedium || lead.lastUtmMedium || lead.firstUtmMedium || null,
        campaign:
          lead.utmCampaign ||
          lead.lastUtmCampaign ||
          lead.firstUtmCampaign ||
          null,
        term: lead.utmTerm || lead.lastUtmTerm || lead.firstUtmTerm || null,
        content:
          lead.utmContent ||
          lead.lastUtmContent ||
          lead.firstUtmContent ||
          null,
        gclid: lead.gclid || lead.lastGclid || lead.firstGclid || null,
        fbclid: lead.fbclid || lead.lastFbclid || lead.firstFbclid || null,
        ttclid: lead.ttclid || lead.lastTtclid || lead.firstTtclid || null,
        msclkid: lead.msclkid || lead.lastMsclkid || lead.firstMsclkid || null,
        pagePath: pagePath || null,
        pageUrl: lead.pageUrl || null,
        landingPageUrl: lead.landingPageUrl || null,
        referrer: lead.referrer || lead.firstReferrer || null,
        referrerDomain: lead.referrerDomain || lead.firstReferrerDomain || null,
        firstTouchAt: lead.firstTouchAt || null,
        lastTouchAt: lead.lastTouchAt || null,
        rawPayload: lead,
      });
    }

    const [submission] = await db
      .insert(formSubmissions)
      .values({
        id: randomUUID(),
        contactId: contactId || null,
        eventId: eventId || null,
        campaignId: campaignId || null,
        submissionKey: idempotencyKey,
        formType: lead.formType || lead.funnelId || "lead_capture",
        source,
        pagePath: pagePath || null,
        pageUrl: lead.pageUrl || null,
        eventInterest: lead.eventInterest || null,
        eventSeries: lead.eventSeries || null,
        eventTitle: lead.eventTitle || null,
        provider,
        providerStatus: "pending",
        sessionId: lead.sessionId || null,
        rawPayload: lead,
      })
      .onConflictDoUpdate({
        target: formSubmissions.submissionKey,
        set: {
          provider,
          providerStatus: "pending",
          rawPayload: lead,
        },
      })
      .returning({ id: formSubmissions.id });

    const formSubmissionId = submission?.id;

    if (contactId && formSubmissionId) {
      if (lead.eventInterest) {
        await db.insert(contactEventInterest).values({
          id: randomUUID(),
          contactId,
          anonymousSessionId: lead.sessionId || null,
          eventSlug: lead.eventInterest,
          interestType: lead.formType || "first_access_signup",
          source,
          metadata: { requestId, provider, payload: lead },
        });
      }

      await db.insert(emailPlatformSyncStatus).values({
        id: randomUUID(),
        contactId,
        formSubmissionId,
        platform: provider,
        status: "pending",
        metadata: { requestId, idempotencyKey },
      });

      if (leadMatchesIntent(lead, "laylo")) {
        await db.insert(layloSignups).values({
          id: randomUUID(),
          contactId,
          formSubmissionId,
          eventId: eventId || null,
          dropName: lead.eventTitle || "Chasing Sun(Sets)",
          dropSlug: lead.eventInterest || lead.eventSeries || "chasing-sunsets",
          signupChannel:
            lead.utmSource || lead.lastUtmSource || lead.source || "website",
          phone: lead.phone || null,
          email,
          instagramHandle: lead.instagramHandle || null,
          utmSource:
            lead.utmSource || lead.lastUtmSource || lead.firstUtmSource || null,
          utmCampaign:
            lead.utmCampaign ||
            lead.lastUtmCampaign ||
            lead.firstUtmCampaign ||
            null,
          layloUrl:
            process.env.LAYLO_URL ||
            process.env.OUTBOUND_WAITLIST_CHASING_SUNSETS_URL ||
            null,
          status: "pending",
          metadata: { requestId, source },
        });
      }

      if (leadMatchesIntent(lead, "vip")) {
        await db.insert(vipLeads).values({
          id: randomUUID(),
          contactId,
          formSubmissionId,
          eventId: eventId || null,
          status: "new",
          metadata: { requestId, source, payload: lead },
        });
      }

      if (
        leadMatchesIntent(lead, "sponsor") ||
        leadMatchesIntent(lead, "partner")
      ) {
        await db.insert(sponsorLeads).values({
          id: randomUUID(),
          contactId,
          formSubmissionId,
          company: lead.eventTitle || null,
          sponsorshipType: lead.eventSeries || null,
          status: "new",
          metadata: { requestId, source, payload: lead },
        });
      }
    }

    return { contactId, campaignId, eventId, formSubmissionId };
  } catch (error) {
    logEvent("crm.lead_capture_failed", {
      requestId,
      message:
        error instanceof Error
          ? error.message
          : "Unknown CRM persistence error",
    });
    return {};
  }
}

export async function markLeadCaptureProviderStatus(
  capture: PersistedLeadCapture,
  status: "success" | "failed",
  errorMessage?: string
) {
  const db = getDatabase();
  if (!db || !capture.formSubmissionId) return;

  const now = new Date().toISOString();

  await Promise.all([
    db
      .update(formSubmissions)
      .set({ providerStatus: status })
      .where(eq(formSubmissions.id, capture.formSubmissionId))
      .catch(() => undefined),
    db
      .update(emailPlatformSyncStatus)
      .set({
        status,
        lastSyncedAt: status === "success" ? now : null,
        errorMessage: errorMessage || null,
        updatedAt: now,
      })
      .where(
        eq(emailPlatformSyncStatus.formSubmissionId, capture.formSubmissionId)
      )
      .catch(() => undefined),
  ]);
}
