export type MonolithBridgeConfig = {
  intakeUrl: string;
  token: string;
  releaseId: string;
  allowedEmail: string;
  pagePath?: string;
};
export function createMonolithSignupBridge(
  config: MonolithBridgeConfig,
  options?: { fetcher?: typeof fetch },
): (request: Request) => Promise<Response>;
