import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
    envDir: __dirname,
    root: path.resolve(__dirname, "client"),
    // This makes the shipped code slightly less "copy friendly", but it is not
    // real protection. If something must be secret, it cannot live in the client.
    esbuild: isProd ? { drop: ["console", "debugger"] } : undefined,
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      // Keep this explicit so we never accidentally ship sourcemaps.
      sourcemap: false,
      minify: "esbuild",
      // Let Rollup handle chunking automatically to avoid circular vendor graphs.
      // The previous manualChunks setup produced runtime TDZ crashes in deploy previews.
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      allowedHosts: ["localhost", "127.0.0.1"],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
