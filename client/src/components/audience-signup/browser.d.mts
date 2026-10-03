export type SimpleSignup = {
  email: string;
  phone?: string;
  instagram?: string;
  choices?: { email: boolean; sms: boolean };
  honeypot?: string;
};
export type SignupPayload = Required<SimpleSignup> & {
  submissionId: string;
  occurredAt: string;
  landingPage: string;
  referrer: string;
};
export function prepareMonolithSignup(
  input: SimpleSignup,
  context?: { landingPage: string; referrer: string },
): SignupPayload;
export function submitMonolithSignup(
  payload: SignupPayload,
  options?: { fetcher?: typeof fetch },
): Promise<{ ok: boolean; retryable?: boolean; message?: string }>;
