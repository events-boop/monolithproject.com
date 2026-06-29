import { Resend } from "resend";
import WelcomeEmail from "../emails/WelcomeEmail";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "events@monolithproject.com";

export async function sendWelcomeEmail(email: string, firstName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "⚠️  RESEND_API_KEY not set — skipping welcome email for:",
      email
    );
    return;
  }

  try {
    const data = await resend.emails.send({
      from: "The Monolith Project <rituals@monolithproject.com>",
      to: email,
      subject: "ACCESS GRANTED // THE INNER CIRCLE",
      react: React.createElement(WelcomeEmail, { firstName }),
    });

    return data;
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    throw error;
  }
}

/**
 * Falls back to email when no webhook is configured or webhook delivery fails.
 * Only sends when RESEND_API_KEY is set — otherwise it's a no-op.
 */
export async function notifyFormSubmission(opts: {
  type: "contact" | "booking" | "artist";
  name: string;
  email: string;
  subject?: string | null;
  message?: string | null;
  entity?: string | null;
  inquiryType?: string | null;
  location?: string | null;
  requestId: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const subjectMap: Record<string, string> = {
    contact: `[Contact] ${opts.subject || "New message"} — ${opts.name}`,
    booking: `[Booking] ${opts.inquiryType || "Inquiry"} — ${opts.name}`,
    artist: `[Artist Submit] ${opts.name}`,
  };

  const lines = [
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
  ];
  if (opts.subject) lines.push(`Subject: ${opts.subject}`);
  if (opts.entity) lines.push(`Entity: ${opts.entity}`);
  if (opts.inquiryType) lines.push(`Type: ${opts.inquiryType}`);
  if (opts.location) lines.push(`Location: ${opts.location}`);
  if (opts.message) lines.push(`\nMessage:\n${opts.message}`);

  try {
    await resend.emails.send({
      from: "Monolith Notifications <rituals@monolithproject.com>",
      to: ADMIN_EMAIL,
      subject: subjectMap[opts.type] || `[Form] ${opts.name}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("❌ Failed to send notification email:", error);
  }
}
