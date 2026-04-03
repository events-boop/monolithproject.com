import serverless from "serverless-http";
import { createApp } from "../../server/app";
import { validateEnvironment } from "../../server/lib/env";

validateEnvironment({ fatal: false });

const app = createApp({ includeSpa: false });

export const handler = serverless(app);
