import { createServer } from "http";
import { pathToFileURL } from "url";
import { validateEnvironment } from "./lib/env";
import { createApp } from "./app";

const app = createApp();

function configureApp() {
  return app;
}

async function startServer() {
  validateEnvironment({ fatal: true });

  const server = createServer(app);
  const portEnv = process.env.PORT;
  const port = portEnv ? Number.parseInt(portEnv, 10) : 5000;
  const portNumber = Number.isFinite(port) ? port : 5000;
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
