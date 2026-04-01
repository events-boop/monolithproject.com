import type { LeadProvider } from "./schemas";

export function readProvider(): LeadProvider {
  const provider = (process.env.LEAD_PROVIDER || "mailchimp").toLowerCase();
  if (provider === "mailchimp" || provider === "beehiiv" || provider === "convertkit" || provider === "hubspot" || provider === "brevo" || provider === "emailoctopus") {
    return provider;
  }
  throw new Error("Unsupported LEAD_PROVIDER. Use mailchimp, beehiiv, convertkit, hubspot, brevo, or emailoctopus.");
}

export function validateEnvironment() {
  const isProd = process.env.NODE_ENV === "production";

  // 1. Database Requirement
  if (!process.env.DATABASE_URL) {
    if (isProd) {
      console.error("❌ CRITICAL BOOT FAILURE: DATABASE_URL environment variable is missing.");
      console.error("   The application form handlers and security depend on the database in production.");
      process.exit(1);
    } else {
      console.warn("⚠️  DATABASE_URL is not set — running without database persistence.");
    }
  }

  const requiredGlobalVars = ["SPONSOR_SESSION_SECRET"];
  const missingGlobal = requiredGlobalVars.filter((v) => !process.env[v]);
  if (missingGlobal.length > 0) {
    if (isProd) {
      console.error(`❌ CRITICAL BOOT FAILURE: Missing global env vars: ${missingGlobal.join(", ")}`);
      process.exit(1);
    } else {
      console.warn(`⚠️  Missing env vars (non-fatal in dev): ${missingGlobal.join(", ")}`);
    }
  }

  if (isProd) {
    // 2. Email Provider Requirement
    const provider = (process.env.LEAD_PROVIDER || "mailchimp").toLowerCase();
    const requiredEnvVars: Record<string, string[]> = {
      mailchimp: ["MAILCHIMP_API_KEY", "MAILCHIMP_LIST_ID"],
      beehiiv: ["BEEHIIV_API_KEY", "BEEHIIV_PUBLICATION_ID"],
      convertkit: ["CONVERTKIT_API_KEY", "CONVERTKIT_FORM_ID"],
      hubspot: ["HUBSPOT_PORTAL_ID", "HUBSPOT_FORM_ID"],
      brevo: ["BREVO_API_KEY"],
      emailoctopus: ["EMAILOCTOPUS_API_KEY", "EMAILOCTOPUS_LIST_ID"],
    };

    const vars = requiredEnvVars[provider];
    if (!vars) {
      console.error(`❌ CRITICAL BOOT FAILURE: Unknown LEAD_PROVIDER "${provider}".`);
      process.exit(1);
    }

    const missing = vars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      console.error(`❌ CRITICAL BOOT FAILURE: Missing env vars for ${provider}: ${missing.join(", ")}`);
      process.exit(1);
    }
  }
}
