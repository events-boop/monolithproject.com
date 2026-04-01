export type SubmissionWebhookStatus = "pending" | "success" | "failed";
export type SubmissionDeliveryState = "delivered" | "queued" | "failed";

interface SubmissionOutcomeOptions {
  acceptedMessage: string;
  deliveryFailedMessage: string;
  successStatus: number;
  unavailableMessage?: string;
  webhookConfigured: boolean;
  webhookDelivered: boolean;
  dbPersisted: boolean;
}

export interface SubmissionOutcome {
  deliveryState: SubmissionDeliveryState;
  responseStatus: number;
  responseMessage: string;
  retryable: boolean;
  webhookStatus: SubmissionWebhookStatus;
}

export function resolveSubmissionOutcome({
  acceptedMessage,
  deliveryFailedMessage,
  successStatus,
  unavailableMessage,
  webhookConfigured,
  webhookDelivered,
  dbPersisted,
}: SubmissionOutcomeOptions): SubmissionOutcome {
  if (webhookDelivered) {
    return {
      deliveryState: "delivered",
      responseStatus: successStatus,
      responseMessage: acceptedMessage,
      retryable: false,
      webhookStatus: "success",
    };
  }

  if (dbPersisted) {
    return {
      deliveryState: "queued",
      responseStatus: 202,
      responseMessage: acceptedMessage,
      retryable: false,
      webhookStatus: webhookConfigured ? "failed" : "pending",
    };
  }

  return {
    deliveryState: "failed",
    responseStatus: webhookConfigured ? 502 : 503,
    responseMessage: webhookConfigured ? deliveryFailedMessage : unavailableMessage || deliveryFailedMessage,
    retryable: webhookConfigured,
    webhookStatus: "failed",
  };
}
