import { Resend } from "resend";
import WelcomeEmail from "../emails/WelcomeEmail";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function sendWelcomeEmail(email: string, firstName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not set — skipping welcome email for:", email);
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
