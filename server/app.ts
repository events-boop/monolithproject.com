import express from "express";
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
import spaRouter from "./routes/spa";

type CreateAppOptions = {
  includeSpa?: boolean;
};

export function createApp({ includeSpa = true }: CreateAppOptions = {}) {
  const app = express();

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

  if (includeSpa) {
    app.use(spaRouter);
  }

  configureErrorMiddleware(app);

  return app;
}
