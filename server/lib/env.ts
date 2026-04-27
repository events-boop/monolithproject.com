import type { LeadProvider } from "./schemas";

type ValidateEnvironmentOptions = {
  fatal?: boolean;
};

export function readProvider(): LeadProvider {
  const provider = (process.env.LEAD_PROVIDER || "disabled").toLowerCase();
  if (
    provider === "disabled" ||
    provider === "mailchimp" ||
    provider === "beehiiv" ||
    provider === "convertkit" ||
    provider === "hubspot" ||
    provider === "brevo" ||
    provider === "emailoctopus"
  ) {
    return provider;
  }
  throw new Error("Unsupported LEAD_PROVIDER. Use disabled, mailchimp, beehiiv, convertkit, hubspot, brevo, or emailoctopus.");
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

  // Sponsor access is optional. If a sponsor password is configured, the
  // matching session secret must also be configured so successful logins can
  // issue signed cookies.
  const sponsorPasswordConfigured = Boolean(process.env.SPONSOR_ACCESS_PASSWORD?.trim());
  const sponsorSecretConfigured = Boolean(process.env.SPONSOR_SESSION_SECRET?.trim());
  if (sponsorPasswordConfigured && !sponsorSecretConfigured) {
    logValidationFailure(
      "SPONSOR_ACCESS_PASSWORD is configured but SPONSOR_SESSION_SECRET is missing. Sponsor access will fail.",
      resolvedOptions,
    );
  }

  if (isProd) {
    const provider = (process.env.LEAD_PROVIDER || "disabled").toLowerCase();
    const requiredEnvVars: Record<string, string[]> = {
      disabled: [],
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

    if (vars.length === 0) {
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
