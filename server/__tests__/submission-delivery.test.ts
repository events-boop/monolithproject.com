import { describe, expect, it } from "vitest";
import { resolveSubmissionOutcome } from "../services/submission-delivery";

describe("resolveSubmissionOutcome", () => {
  const baseOptions = {
    acceptedMessage: "Received",
    deliveryFailedMessage: "Delivery failed",
    successStatus: 200,
  };

  it("marks delivered requests as successful", () => {
    const result = resolveSubmissionOutcome({
      ...baseOptions,
      webhookConfigured: true,
      webhookDelivered: true,
      dbPersisted: true,
    });

    expect(result.deliveryState).toBe("delivered");
    expect(result.responseStatus).toBe(200);
    expect(result.webhookStatus).toBe("success");
  });

  it("queues requests when delivery failed but the DB audit row exists", () => {
    const result = resolveSubmissionOutcome({
      ...baseOptions,
      webhookConfigured: true,
      webhookDelivered: false,
      dbPersisted: true,
    });

    expect(result.deliveryState).toBe("queued");
    expect(result.responseStatus).toBe(202);
    expect(result.webhookStatus).toBe("failed");
  });

  it("keeps unconfigured-but-persisted requests pending", () => {
    const result = resolveSubmissionOutcome({
      ...baseOptions,
      webhookConfigured: false,
      webhookDelivered: false,
      dbPersisted: true,
    });

    expect(result.deliveryState).toBe("queued");
    expect(result.responseStatus).toBe(202);
    expect(result.webhookStatus).toBe("pending");
  });

  it("fails requests that have neither delivery nor persistence", () => {
    const result = resolveSubmissionOutcome({
      ...baseOptions,
      webhookConfigured: true,
      webhookDelivered: false,
      dbPersisted: false,
    });

    expect(result.deliveryState).toBe("failed");
    expect(result.responseStatus).toBe(502);
    expect(result.retryable).toBe(true);
  });
});
