export type IntakeEvent = {
  httpMethod: string;
  path: string;
  headers?: Record<string, string | undefined>;
  multiValueHeaders?: Record<string, string[] | undefined>;
  body?: string | null;
  isBase64Encoded?: boolean;
};
export function createNeonIntakeFunction(
  env?: Record<string, string | undefined>,
  options?: {
    load?: () => Promise<{
      handleWebsiteIntake: (...args: any[]) => Promise<Response>;
    }>;
  },
): (
  event: IntakeEvent,
) => Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}>;
