import express from "express";
import { createServer } from "http";
import { pathToFileURL } from "url";
import { hasDatabase } from "./db/client";
import { logEvent } from "./lib/logging";
import { validateEnvironment } from "./lib/env";
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

const app = express();
let appConfigured = false;

function configureApp() {
  if (appConfigured) return;
  appConfigured = true;

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
  app.use(spaRouter);

  // 4. Finalize with global error handler
  configureErrorMiddleware(app);
}

async function startServer() {
  validateEnvironment();
  configureApp();
  const server = createServer(app);
  const portEnv = process.env.PORT;
  const port = portEnv ? Number.parseInt(portEnv, 10) : 3000;
  const portNumber = Number.isFinite(port) ? port : 3000;
  const host = process.env.HOST || "127.0.0.1";

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(portNumber, host, () => {
      const displayHost = host === "0.0.0.0" ? "localhost" : host;
      console.log(`Server running on http://${displayHost}:${portNumber}/`);
      resolve();
    });
  });
}

configureApp();

const isMainModule =
  process.argv[1] !== undefined &&
  pathToFileURL(process.argv[1]).href === import.meta.url;

if (isMainModule) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { app, configureApp, startServer };
