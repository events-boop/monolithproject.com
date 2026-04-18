import type { LeadProvider } from "./schemas";

type ValidateEnvironmentOptions = {
  fatal?: boolean;
};

export function readProvider(): LeadProvider {
  const provider = (process.env.LEAD_PROVIDER || "mailchimp").toLowerCase();
  if (provider === "mailchimp" || provider === "beehiiv" || provider === "convertkit" || provider === "hubspot" || provider === "brevo" || provider === "emailoctopus") {
    return provider;
  }
  throw new Error("Unsupported LEAD_PROVIDER. Use mailchimp, beehiiv, convertkit, hubspot, brevo, or emailoctopus.");
}

function logValidationFailure(message: string, { fatal }: Required<ValidateEnvironmentOptions>) {
  if (fatal) {
    console.error(`❌ CRITICAL BOOT FAILURE: ${message}`);
    throw new Error(message);
  }

  console.warn(`⚠️  ${message}`);
}

export function validateEnvironment(options: ValidateEnvironmentOptions = {}) {
  const resolvedOptions: Required<ValidateEnvironmentOptions> = {
    fatal: options.fatal ?? false,
  };
  const isProd = process.env.NODE_ENV === "production";

  // DATABASE_URL is degrade-gracefully: form handlers fall back to email delivery,
  // so a missing value is a warning, not a fatal — even under fatal: true.
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️  DATABASE_URL is not set — running without database persistence. Form handlers and restricted areas may fail.");
  }

  // SPONSOR_SESSION_SECRET is load-bearing: sponsor-session.ts throws at runtime
  // when it's missing, which turns a correct sponsor login into a 500. Under
  // fatal: true we want to fail at boot instead of surviving to serve broken requests.
  const requiredGlobalVars = ["SPONSOR_SESSION_SECRET"];
  const missingGlobal = requiredGlobalVars.filter((v) => !process.env[v]);
  if (missingGlobal.length > 0) {
    logValidationFailure(
      `Missing required env vars at boot: ${missingGlobal.join(", ")}`,
      resolvedOptions,
    );
  }

  if (isProd) {
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
      logValidationFailure(
        `Unknown LEAD_PROVIDER "${provider}". Lead capturing will fail.`,
        resolvedOptions,
      );
      return;
    }

    const missing = vars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      logValidationFailure(
        `Missing env vars for ${provider}: ${missing.join(", ")}. Lead capturing will fail.`,
        resolvedOptions,
      );
    }
  }
}
