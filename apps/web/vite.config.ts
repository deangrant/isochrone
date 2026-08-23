import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const analyzeBundle = process.env.ANALYZE === "true";

export default defineConfig({
  build: {
    // mapbox-gl is isolated in its own vendor chunk (~1.8 MB); limit applies there only.
    chunkSizeWarningLimit: 1900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/mapbox-gl")) {
            return "mapbox";
          }
        },
      },
    },
  },
  plugins: [
    react(),
    ...(analyzeBundle
      ? [
          visualizer({
            filename: "dist/stats.html",
            gzipSize: true,
            open: false,
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
  },
  test: {
    env: {
      VITE_MAPBOX_GL_JS_PUBLIC: "pk.test",
    },
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
  },
});
