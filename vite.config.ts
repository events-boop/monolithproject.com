import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      react(),
      tailwindcss(),
      ViteImageOptimizer({
        // Favor delivery size over archival fidelity for photographic assets.
        png: { quality: 78 },
        jpeg: { quality: 76 },
        jpg: { quality: 76 },
        webp: { quality: 74 },
        avif: { quality: 52 },
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
        "@shared": path.resolve(__dirname, "shared"),
      },
    },
    envDir: path.resolve(__dirname),
    root: path.resolve(__dirname, "client"),
    publicDir: path.resolve(__dirname, "client/public"),
    // This makes the shipped code slightly less "copy friendly", but it is not
    // real protection. If something must be secret, it cannot live in the client.
    esbuild: isProd ? { drop: ["console", "debugger"], legalComments: "none" } : undefined,
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      // Keep this explicit so we never accidentally ship sourcemaps.
      sourcemap: false,
      minify: "esbuild",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/[hash].js",
          entryFileNames: "assets/[hash].js",
          assetFileNames: "assets/[hash][extname]",
          // Only pin chunks that are either core to the shell or genuinely shared.
          // Let Rollup keep route-specific libraries with their routes instead of
          // flattening everything into one preloaded fallback bundle.
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/") ||
              id.includes("node_modules/use-sync-external-store/") ||
              id.includes("node_modules/react-is/")
            )
              return "c0";
            if (id.includes("framer-motion")) return "c1";
            if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("vaul")) return "c2";
            if (id.includes("posthog-js")) return "c3";
            if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("input-otp")) return "c4";
            if (id.includes("react-day-picker")) return "c5";
            if (id.includes("recharts")) return "c6";
            if (id.includes("cobe")) return "c7";
            if (id.includes("react-photo-album") || id.includes("yet-another-react-lightbox")) return "c8";
            if (id.includes("zod")) return "c9";
            return undefined;
          },
        },
      },
    },
    server: {
      port: 3001,
      strictPort: false,
      host: true,
      allowedHosts: ["localhost", "127.0.0.1"],
      fs: {
        strict: true,
        allow: [path.resolve(__dirname, "client"), path.resolve(__dirname, "shared")],
        deny: ["**/.*"],
      },
      proxy: {
        "/api": {
          target: "http://127.0.0.1:5001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
