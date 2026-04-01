import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

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
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    // This makes the shipped code slightly less "copy friendly", but it is not
    // real protection. If something must be secret, it cannot live in the client.
    esbuild: isProd ? { drop: ["console", "debugger"] } : undefined,
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      // Keep this explicit so we never accidentally ship sourcemaps.
      sourcemap: false,
      minify: "esbuild",
      rollupOptions: {
        output: {
          // Only pin chunks that are either core to the shell or genuinely shared.
          // Let Rollup keep route-specific libraries with their routes instead of
          // flattening everything into one preloaded fallback bundle.
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            // Keep React + its runtime helpers together to avoid circular chunk graphs.
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/") ||
              id.includes("node_modules/use-sync-external-store/") ||
              id.includes("node_modules/react-is/")
            )
              return "vendor-react";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("@radix-ui") || id.includes("cmdk") || id.includes("vaul")) return "vendor-ui";
            if (id.includes("posthog-js")) return "vendor-analytics";
            if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("input-otp")) return "vendor-forms";
            if (id.includes("react-day-picker")) return "vendor-calendar";
            if (id.includes("recharts")) return "vendor-charts";
            if (id.includes("cobe")) return "vendor-globe";
            if (id.includes("react-photo-album") || id.includes("yet-another-react-lightbox")) return "vendor-gallery";
            if (id.includes("zod")) return "vendor-zod";
            return undefined;
          },
        },
      },
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
