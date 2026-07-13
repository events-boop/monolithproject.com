import { getDatabase } from "../db/client";
import { houseOfFriendsApplications } from "../db/schema";
import { logEvent } from "../lib/logging";
import { scrubEmail } from "../lib/security";
import { notifyFormSubmission } from "./email";
import type { StoredHouseOfFriendsApplication } from "./house-of-friends-storage";

const WEBHOOK_TIMEOUT_MS = 8_000;

export async function deliverHouseOfFriendsApplication(
  application: StoredHouseOfFriendsApplication,
  requestId: string
) {
  const db = getDatabase();
  const email = scrubEmail(application.email);
  const submittedAt = application.submittedAt || new Date().toISOString();
  let dbPersisted = false;
  let webhookDelivered = false;

  if (db) {
    try {
      await db
        .insert(houseOfFriendsApplications)
        .values({
          id: application.applicationId,
          referenceCode: application.referenceCode,
          status: application.status,
          firstName: application.firstName,
          lastName: application.lastName,
          stageName: application.stageName,
          email,
          phone: application.phone,
          city: application.city,
          state: application.state,
          instagram: application.instagram,
          artistUrl: application.artistUrl || null,
          yearsActive: application.yearsActive,
          genres: application.genres,
          bio: application.bio,
          whyHouseOfFriends: application.whyHouseOfFriends,
          collaborationStyle: application.collaborationStyle,
          setTitle: application.setTitle,
          setTracklist: application.setTracklist || null,
          setUrl: application.setUrl || null,
          folderPrefix: application.folderPrefix,
          profileObjectKey: application.profileKey,
          photoObjectKey: application.photoObjectKey,
          djSetObjectKey: application.djSetObjectKey,
          photoMetadata: application.photo,
          djSetMetadata: application.djSet,
          ageConfirmed: application.ageConfirmed,
          availabilityConfirmed: application.availabilityConfirmed,
          rightsConfirmed: application.rightsConfirmed,
          termsAccepted: application.termsAccepted,
          marketingConsent: application.marketingConsent,
          submittedAt,
          createdAt: application.createdAt,
          updatedAt: submittedAt,
          metadata: {
            requestId,
            event: "Chasing Sun(Sets) II — August 22, 2026",
            program: "House of Friends Founding Class 2026",
            mediaVerified: true,
          },
        })
        .onConflictDoUpdate({
          target: houseOfFriendsApplications.id,
          set: {
            status: application.status,
            submittedAt,
            updatedAt: submittedAt,
            photoMetadata: application.photo,
            djSetMetadata: application.djSet,
            metadata: {
              requestId,
              event: "Chasing Sun(Sets) II — August 22, 2026",
              program: "House of Friends Founding Class 2026",
              mediaVerified: true,
              retryFinalized: true,
            },
          },
        });
      dbPersisted = true;
    } catch (error) {
      logEvent("house_of_friends.application_db_failed", {
        requestId,
        applicationId: application.applicationId,
        referenceCode: application.referenceCode,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const webhook = process.env.HOF_APPLICATION_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...application,
          email,
          type: "house_of_friends_application",
          requestId,
        }),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`Webhook returned status ${response.status}`);
      }
      webhookDelivered = true;
    } catch (error) {
      logEvent("house_of_friends.application_webhook_failed", {
        requestId,
        applicationId: application.applicationId,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  void notifyFormSubmission({
    type: "house-of-friends",
    name: application.stageName,
    email,
    entity: `${application.firstName} ${application.lastName}`,
    inquiryType: "Founding Class 2026 application",
    location: `${application.city}, ${application.state}`,
    referenceCode: application.referenceCode,
    folderPrefix: application.folderPrefix,
    message: `Genres: ${application.genres}\nSet: ${application.setTitle}\nInstagram: ${application.instagram}`,
    requestId,
  });

  logEvent("house_of_friends.application_completed", {
    requestId,
    applicationId: application.applicationId,
    referenceCode: application.referenceCode,
    dbPersisted,
    webhookDelivered,
  });

  return { dbPersisted, webhookDelivered };
}
