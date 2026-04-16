import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const apiHost = process.env.API_HOST || "127.0.0.1";
const apiPort = Number.parseInt(process.env.API_PORT || process.env.PORT || "5001", 10);
const apiTarget = `http://${apiHost}:${apiPort}`;
const viteBin = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");

const children = new Set();
let shuttingDown = false;

function isPortOpen(host, port) {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForPort(host, port, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isPortOpen(host, port)) return;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  throw new Error(`Timed out waiting for ${host}:${port}`);
}

function stopChildren() {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
}

function spawnService(name, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    ...options,
  });

  children.add(child);
  child.once("exit", (code, signal) => {
    children.delete(child);
    if (shuttingDown) return;

    shuttingDown = true;
    const reason = signal ? `signal ${signal}` : `code ${code ?? 0}`;
    console.error(`[dev] ${name} exited with ${reason}`);
    stopChildren();
    process.exitCode = code && code > 0 ? code : 1;
  });

  return child;
}

process.once("SIGINT", () => {
  shuttingDown = true;
  stopChildren();
});

process.once("SIGTERM", () => {
  shuttingDown = true;
  stopChildren();
});

if (!Number.isFinite(apiPort)) {
  throw new Error(`Invalid API port: ${process.env.API_PORT || process.env.PORT}`);
}

if (await isPortOpen(apiHost, apiPort)) {
  console.log(`[dev] Reusing API server at ${apiTarget}`);
} else {
  console.log(`[dev] Starting API server at ${apiTarget}`);
  spawnService("api", process.execPath, ["--import", "tsx/esm", path.join(rootDir, "server/index.ts")], {
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || "development",
      HOST: apiHost,
      PORT: String(apiPort),
    },
  });
  await waitForPort(apiHost, apiPort);
}

console.log(`[dev] Starting Vite with API proxy ${apiTarget}`);
spawnService("vite", process.execPath, [viteBin, "--host"], {
  env: {
    ...process.env,
    VITE_API_TARGET: apiTarget,
  },
});
