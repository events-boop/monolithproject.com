import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiProxyTarget = process.env.VITE_API_TARGET || "http://127.0.0.1:5001";

function cspSafeStylesheetLinks() {
  return {
    name: "csp-safe-stylesheet-links",
    enforce: "post" as const,
    transformIndexHtml(html: string) {
      return html.replace(
        /<link rel="preload" as="style" crossorigin href="([^"]+\.css)" onload="this\.onload=null;this\.rel='stylesheet'"><noscript><link rel="stylesheet" crossorigin href="\1"><\/noscript>/g,
        '<link rel="stylesheet" crossorigin href="$1">',
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml', 'fonts/**/*.woff2'],
        manifest: {
          name: 'The Monolith Project',
          short_name: 'Monolith',
          description: "Chicago's premier electronic music ecosystem.",
          theme_color: '#000000',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: '/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,woff2,xml,webmanifest}'],
          maximumFileSizeToCacheInBytes: 700000,
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|webp|avif|gif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'monolith-images',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        }
      }),
      ViteImageOptimizer({
        // Favor delivery size over archival fidelity for photographic assets.
        png: { quality: 85 },
        jpeg: { quality: 85 },
        jpg: { quality: 85 },
        webp: { quality: 85 },
        avif: { quality: 65 },
      }),
      cspSafeStylesheetLinks(),
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
          // Isolate specific heavy vendor libraries into dedicated chunks.
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom")) return "v-reactdom";
              if (id.includes("react/")) return "v-react";
              if (id.includes("react-router")) return "v-router";
              if (id.includes("framer-motion")) return "v-framer";
              if (id.includes("lucide-react")) return "v-lucide";
              if (id.includes("@radix-ui")) return "v-radix";
              if (id.includes("recharts")) return "v-charts";
              if (id.includes("cobe")) return "v-cobe";
              if (id.includes("lenis")) return "v-lenis";
              if (id.includes("posthog-js")) return "v-posthog";
              if (id.includes("react-photo-album")) return "v-album";
              if (id.includes("yet-another-react-lightbox")) return "v-lightbox";
            }
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
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
