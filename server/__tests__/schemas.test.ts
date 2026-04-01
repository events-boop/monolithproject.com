import { describe, it, expect } from "vitest";
import {
  leadSchema,
  ticketIntentSchema,
  bookingInquirySchema,
  sponsorAccessSchema,
  contactSchema,
  poshWebhookPayloadSchema,
} from "../lib/schemas";

// ---------------------------------------------------------------------------
// leadSchema
// ---------------------------------------------------------------------------
describe("leadSchema", () => {
  const validLead = { email: "fan@example.com", consent: true };

  it("accepts a minimal valid payload (email + consent)", () => {
    const result = leadSchema.safeParse(validLead);
    expect(result.success).toBe(true);
  });

  it("accepts a fully-populated payload with all optional fields", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      firstName: "Ada",
      lastName: "Lovelace",
      source: "home-hero",
      eventInterest: "cs-ibiza-2026",
      utmSource: "instagram",
      utmMedium: "social",
      utmCampaign: "summer-launch",
      utmTerm: "electronic+music",
      utmContent: "carousel-1",
      pageUrl: "https://example.com/tickets",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when email is missing", () => {
    const result = leadSchema.safeParse({ consent: true });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is missing", () => {
    const result = leadSchema.safeParse({ email: "fan@example.com" });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is false (must be literal true)", () => {
    const result = leadSchema.safeParse({ email: "fan@example.com", consent: false });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = leadSchema.safeParse({ email: "not-an-email", consent: true });
    expect(result.success).toBe(false);
  });

  it("rejects an empty string email", () => {
    const result = leadSchema.safeParse({ email: "", consent: true });
    expect(result.success).toBe(false);
  });

  it("enforces firstName max length of 80", () => {
    const tooLong = leadSchema.safeParse({
      ...validLead,
      firstName: "A".repeat(81),
    });
    expect(tooLong.success).toBe(false);

    const atLimit = leadSchema.safeParse({
      ...validLead,
      firstName: "A".repeat(80),
    });
    expect(atLimit.success).toBe(true);
  });

  it("enforces lastName max length of 80", () => {
    const tooLong = leadSchema.safeParse({
      ...validLead,
      lastName: "B".repeat(81),
    });
    expect(tooLong.success).toBe(false);

    const atLimit = leadSchema.safeParse({
      ...validLead,
      lastName: "B".repeat(80),
    });
    expect(atLimit.success).toBe(true);
  });

  it("enforces source max length of 120", () => {
    const tooLong = leadSchema.safeParse({
      ...validLead,
      source: "x".repeat(121),
    });
    expect(tooLong.success).toBe(false);
  });

  it("enforces utmCampaign max length of 140", () => {
    const tooLong = leadSchema.safeParse({
      ...validLead,
      utmCampaign: "c".repeat(141),
    });
    expect(tooLong.success).toBe(false);
  });

  it("enforces pageUrl max length of 500", () => {
    const tooLong = leadSchema.safeParse({
      ...validLead,
      pageUrl: "https://example.com/" + "a".repeat(490),
    });
    expect(tooLong.success).toBe(false);
  });

  it("rejects an invalid pageUrl", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      pageUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace from optional string fields", () => {
    const result = leadSchema.safeParse({
      ...validLead,
      firstName: "  Ada  ",
      source: "  hero  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe("Ada");
      expect(result.data.source).toBe("hero");
    }
  });
});

// ---------------------------------------------------------------------------
// ticketIntentSchema
// ---------------------------------------------------------------------------
describe("ticketIntentSchema", () => {
  it("accepts a valid source string", () => {
    const result = ticketIntentSchema.safeParse({ source: "hero-cta" });
    expect(result.success).toBe(true);
  });

  it("accepts a valid source with optional eventId", () => {
    const result = ticketIntentSchema.safeParse({
      source: "schedule-card",
      eventId: "evt-ibiza-2026",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when source is missing", () => {
    const result = ticketIntentSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects when source is empty after trim", () => {
    const result = ticketIntentSchema.safeParse({ source: "" });
    expect(result.success).toBe(false);
  });

  it("enforces source max length of 120", () => {
    const tooLong = ticketIntentSchema.safeParse({ source: "s".repeat(121) });
    expect(tooLong.success).toBe(false);
  });

  it("trims whitespace from source", () => {
    const result = ticketIntentSchema.safeParse({ source: "  hero-cta  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("hero-cta");
    }
  });
});

// ---------------------------------------------------------------------------
// bookingInquirySchema
// ---------------------------------------------------------------------------
describe("bookingInquirySchema", () => {
  const validInquiry = {
    name: "John Doe",
    email: "john@example.com",
    entity: "Acme Corp",
    type: "sponsorship" as const,
    message: "We would like to sponsor the main stage at the upcoming event.",
  };

  it("accepts a valid complete inquiry", () => {
    const result = bookingInquirySchema.safeParse(validInquiry);
    expect(result.success).toBe(true);
  });

  it("accepts an inquiry with optional location", () => {
    const result = bookingInquirySchema.safeParse({
      ...validInquiry,
      location: "Ibiza, Spain",
    });
    expect(result.success).toBe(true);
  });

  it.each([
    "partner-on-location",
    "artist-booking",
    "sponsorship",
    "general",
  ] as const)("accepts type enum value '%s'", (type) => {
    const result = bookingInquirySchema.safeParse({ ...validInquiry, type });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid type enum value", () => {
    const result = bookingInquirySchema.safeParse({
      ...validInquiry,
      type: "invalid-type",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when required fields are missing", () => {
    const result = bookingInquirySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects when name is missing", () => {
    const { name: _, ...noName } = validInquiry;
    const result = bookingInquirySchema.safeParse(noName);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = bookingInquirySchema.safeParse({
      ...validInquiry,
      email: "bad-email",
    });
    expect(result.success).toBe(false);
  });

  it("enforces message min length of 10", () => {
    const tooShort = bookingInquirySchema.safeParse({
      ...validInquiry,
      message: "Short",
    });
    expect(tooShort.success).toBe(false);
  });

  it("enforces message max length of 5000", () => {
    const tooLong = bookingInquirySchema.safeParse({
      ...validInquiry,
      message: "M".repeat(5001),
    });
    expect(tooLong.success).toBe(false);
  });

  it("accepts message at exactly 10 characters", () => {
    const result = bookingInquirySchema.safeParse({
      ...validInquiry,
      message: "A".repeat(10),
    });
    expect(result.success).toBe(true);
  });

  it("accepts message at exactly 5000 characters", () => {
    const result = bookingInquirySchema.safeParse({
      ...validInquiry,
      message: "A".repeat(5000),
    });
    expect(result.success).toBe(true);
  });

  it("enforces name min length of 2", () => {
    const tooShort = bookingInquirySchema.safeParse({
      ...validInquiry,
      name: "J",
    });
    expect(tooShort.success).toBe(false);
  });

  it("enforces entity max length of 160", () => {
    const tooLong = bookingInquirySchema.safeParse({
      ...validInquiry,
      entity: "E".repeat(161),
    });
    expect(tooLong.success).toBe(false);
  });

  it("enforces location max length of 180", () => {
    const tooLong = bookingInquirySchema.safeParse({
      ...validInquiry,
      location: "L".repeat(181),
    });
    expect(tooLong.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// sponsorAccessSchema
// ---------------------------------------------------------------------------
describe("sponsorAccessSchema", () => {
  it("accepts a valid password string", () => {
    const result = sponsorAccessSchema.safeParse({ password: "secret123" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty password (after trim, length < 1)", () => {
    const result = sponsorAccessSchema.safeParse({ password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only password (trimmed to empty)", () => {
    const result = sponsorAccessSchema.safeParse({ password: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects when password field is missing", () => {
    const result = sponsorAccessSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("enforces password max length of 256", () => {
    const tooLong = sponsorAccessSchema.safeParse({
      password: "p".repeat(257),
    });
    expect(tooLong.success).toBe(false);

    const atLimit = sponsorAccessSchema.safeParse({
      password: "p".repeat(256),
    });
    expect(atLimit.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// contactSchema
// ---------------------------------------------------------------------------
describe("contactSchema", () => {
  const validContact = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    subject: "Partnership inquiry",
    message: "Would love to collaborate on an upcoming event.",
  };

  it("accepts a valid contact payload", () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("rejects when name is missing", () => {
    const { name: _, ...noName } = validContact;
    const result = contactSchema.safeParse(noName);
    expect(result.success).toBe(false);
  });

  it("rejects when email is missing", () => {
    const { email: _, ...noEmail } = validContact;
    const result = contactSchema.safeParse(noEmail);
    expect(result.success).toBe(false);
  });

  it("rejects when subject is missing", () => {
    const { subject: _, ...noSubject } = validContact;
    const result = contactSchema.safeParse(noSubject);
    expect(result.success).toBe(false);
  });

  it("rejects when message is missing", () => {
    const { message: _, ...noMessage } = validContact;
    const result = contactSchema.safeParse(noMessage);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({
      ...validContact,
      email: "not-email",
    });
    expect(result.success).toBe(false);
  });

  it("enforces name max length of 120", () => {
    const tooLong = contactSchema.safeParse({
      ...validContact,
      name: "N".repeat(121),
    });
    expect(tooLong.success).toBe(false);
  });

  it("enforces email max length of 320", () => {
    // Build an email with local part long enough to exceed 320 total characters
    const longLocal = "a".repeat(310);
    const tooLong = contactSchema.safeParse({
      ...validContact,
      email: `${longLocal}@example.com`,
    });
    expect(tooLong.success).toBe(false);
  });

  it("enforces subject max length of 200", () => {
    const tooLong = contactSchema.safeParse({
      ...validContact,
      subject: "S".repeat(201),
    });
    expect(tooLong.success).toBe(false);
  });

  it("enforces message max length of 5000", () => {
    const tooLong = contactSchema.safeParse({
      ...validContact,
      message: "M".repeat(5001),
    });
    expect(tooLong.success).toBe(false);
  });

  it("enforces name min length of 2", () => {
    const tooShort = contactSchema.safeParse({
      ...validContact,
      name: "A",
    });
    expect(tooShort.success).toBe(false);
  });

  it("enforces subject min length of 2", () => {
    const tooShort = contactSchema.safeParse({
      ...validContact,
      subject: "S",
    });
    expect(tooShort.success).toBe(false);
  });

  it("enforces message min length of 2", () => {
    const tooShort = contactSchema.safeParse({
      ...validContact,
      message: "M",
    });
    expect(tooShort.success).toBe(false);
  });

  it("trims whitespace from string fields", () => {
    const result = contactSchema.safeParse({
      name: "  Ada  ",
      email: "  ada@example.com  ",
      subject: "  Hello  ",
      message: "  Hey there!  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Ada");
      expect(result.data.subject).toBe("Hello");
      expect(result.data.message).toBe("Hey there!");
    }
  });
});

// ---------------------------------------------------------------------------
// poshWebhookPayloadSchema
// ---------------------------------------------------------------------------
describe("poshWebhookPayloadSchema", () => {
  it("accepts an empty object", () => {
    const result = poshWebhookPayloadSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts any record with string keys", () => {
    const result = poshWebhookPayloadSchema.safeParse({
      event: "ticket.purchased",
      quantity: 2,
      nested: { deep: true },
      items: [1, 2, 3],
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-object inputs", () => {
    expect(poshWebhookPayloadSchema.safeParse("string").success).toBe(false);
    expect(poshWebhookPayloadSchema.safeParse(42).success).toBe(false);
    expect(poshWebhookPayloadSchema.safeParse(null).success).toBe(false);
  });
});
