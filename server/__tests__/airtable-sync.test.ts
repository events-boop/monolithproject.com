import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isAirtableSyncEnabled,
  mirrorLeadToAirtable,
} from "../services/airtable-sync";

describe("airtable sync", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function configureAirtable() {
    process.env.AIRTABLE_API_KEY = "pat_test";
    process.env.AIRTABLE_BASE_ID = "app123";
    process.env.AIRTABLE_LEADS_TABLE_ID = "tbl456";
    process.env.AIRTABLE_API_BASE_URL = "https://airtable.test/v0";
    delete process.env.AIRTABLE_SYNC_ENABLED;
  }

  const lead = {
    email: "Fan@Example.com",
    phone: "555-0100",
    firstName: "Lake",
    lastName: "List",
    consent: true,
    source: "sunsets-link-bio",
    formType: "lake-list",
    funnelId: "sunsets",
    offerId: "css-jul04",
    eventSeries: "sunsets",
    eventTitle: "Sun(Sets) I",
    interestTags: ["lake-list", "sunsets"],
    utmSource: "instagram",
    utmCampaign: "sunsets-launch",
    pageUrl: "https://monolithproject.com/sunsets",
  } as const;

  it("no-ops when Airtable is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    delete process.env.AIRTABLE_API_KEY;
    delete process.env.AIRTABLE_BASE_ID;
    delete process.env.AIRTABLE_LEADS_TABLE_ID;
    delete process.env.AIRTABLE_LEADS_TABLE_NAME;

    expect(isAirtableSyncEnabled()).toBe(false);

    await mirrorLeadToAirtable({
      lead,
      provider: "brevo",
      requestId: "req_1",
      idempotencyKey: "idem_1",
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts lead records to the configured Airtable table", async () => {
    configureAirtable();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    expect(isAirtableSyncEnabled()).toBe(true);

    await mirrorLeadToAirtable({
      lead,
      provider: "brevo",
      requestId: "req_2",
      idempotencyKey: "idem_2",
      submittedAt: "2026-05-31T12:00:00.000Z",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://airtable.test/v0/app123/tbl456",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer pat_test",
          "Content-Type": "application/json",
        }),
      })
    );

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body));

    expect(body.typecast).toBe(true);
    expect(body.records[0].fields).toMatchObject({
      Email: "fan@example.com",
      Phone: "555-0100",
      "First Name": "Lake",
      "Last Name": "List",
      Source: "sunsets-link-bio",
      "Form Type": "lake-list",
      "Event Series": "sunsets",
      "Event Title": "Sun(Sets) I",
      "Interest Tags": "lake-list, sunsets",
      "UTM Source": "instagram",
      "UTM Campaign": "sunsets-launch",
      "Page URL": "https://monolithproject.com/sunsets",
      Provider: "brevo",
      "Request ID": "req_2",
      "Idempotency Key": "idem_2",
      "Submitted At": "2026-05-31T12:00:00.000Z",
    });
  });

  it("supports Airtable table names when a table id is not configured", async () => {
    configureAirtable();
    delete process.env.AIRTABLE_LEADS_TABLE_ID;
    process.env.AIRTABLE_LEADS_TABLE_NAME = "Lake List Leads";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);

    await mirrorLeadToAirtable({
      lead,
      provider: "brevo",
      requestId: "req_3",
      idempotencyKey: "idem_3",
    });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://airtable.test/v0/app123/Lake%20List%20Leads"
    );
  });

  it("does not throw when Airtable returns an error", async () => {
    configureAirtable();
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      text: vi.fn().mockResolvedValue("Unknown field"),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      mirrorLeadToAirtable({
        lead,
        provider: "brevo",
        requestId: "req_4",
        idempotencyKey: "idem_4",
      })
    ).resolves.toBeUndefined();
  });

  it("does not throw when the Airtable request fails", async () => {
    configureAirtable();
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      mirrorLeadToAirtable({
        lead,
        provider: "brevo",
        requestId: "req_5",
        idempotencyKey: "idem_5",
      })
    ).resolves.toBeUndefined();
  });
});
