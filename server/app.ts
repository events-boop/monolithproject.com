import express from "express";
import { randomUUID } from "crypto";
import { hasDatabase } from "./db/client";
import { logEvent } from "./lib/logging";
import { configureMiddleware, configureErrorMiddleware } from "./middleware";
import healthRouter from "./routes/health";
import seoRouter from "./routes/seo";
import leadsRouter from "./routes/leads";
import ticketsRouter from "./routes/tickets";
import bookingRouter from "./routes/booking";
import contactRouter from "./routes/contact";
import webhooksRouter from "./routes/webhooks";
import socialEchoRouter from "./routes/social-echo";
import sponsorRouter from "./routes/sponsor";
import siteDataRouter from "./routes/site-data";
import opsRouter from "./routes/ops";
import outboundRouter from "./routes/outbound";
import spaRouter from "./routes/spa";

type CreateAppOptions = {
  includeSpa?: boolean;
};

type MethodGuard = {
  path: string;
  methods: string[];
};

const METHOD_GUARDS: MethodGuard[] = [
  { path: "/api/health", methods: ["GET"] },
  { path: "/api/social/echo", methods: ["GET"] },
  { path: "/api/site-data", methods: ["GET"] },
  { path: "/api/sponsor-deck", methods: ["GET"] },
  { path: "/api/leads", methods: ["POST"] },
  { path: "/api/contact", methods: ["POST"] },
  { path: "/api/booking-inquiry", methods: ["POST"] },
  { path: "/api/ticket-intent", methods: ["POST"] },
  { path: "/api/sponsor-access", methods: ["POST"] },
  { path: "/api/ops/cache/invalidate", methods: ["POST"] },
  { path: "/api/ops/baseline", methods: ["GET"] },
  { path: "/api/webhooks/posh", methods: ["POST"] },
];

export function createMethodNotAllowedHandler(methods: string[]) {
  return (_req: express.Request, res: express.Response) => {
    const requestId = randomUUID();
    res.setHeader("Allow", methods.join(", "));
    return res.status(405).json({
      ok: false,
      requestId,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "HTTP method not allowed for this endpoint.",
        retryable: false,
      },
    });
  };
}

export function createApp({ includeSpa = true }: CreateAppOptions = {}) {
  const app = express();
  app.disable("x-powered-by");

  logEvent("database.mode", { provider: "neon-postgres", configured: hasDatabase() });

  configureMiddleware(app);

  app.use(healthRouter);
  app.use(seoRouter);
  app.use(leadsRouter);
  app.use(ticketsRouter);
  app.use(bookingRouter);
  app.use(contactRouter);
  app.use(webhooksRouter);
  app.use(socialEchoRouter);
  app.use(sponsorRouter);
  app.use(siteDataRouter);
  app.use(opsRouter);
  app.use(outboundRouter);

  for (const guard of METHOD_GUARDS) {
    app.all(guard.path, createMethodNotAllowedHandler(guard.methods));
  }

  if (includeSpa) {
    app.use(spaRouter);
  }

  configureErrorMiddleware(app);

  return app;
}
