export function createMonolithExpressHandler(
  bridge: (request: Request) => Promise<Response>,
): (
  request: {
    method: string;
    headers: Record<string, string | readonly string[] | undefined>;
    body: unknown;
  },
  response: {
    setHeader: (key: string, value: string) => unknown;
    status: (code: number) => { send: (body: string) => unknown };
  },
) => Promise<void>;
