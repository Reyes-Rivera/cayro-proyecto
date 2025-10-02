import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import viteImagemin from "vite-plugin-imagemin";

export default defineConfig({
  plugins: [
    react(),

    // Optimización de imágenes en build
    viteImagemin({
      gifsicle: { optimizationLevel: 3 },
      optipng: { optimizationLevel: 5 },
      mozjpeg: { quality: 78 }, // JPG/JPEG
      pngquant: { quality: [0.72, 0.85] }, // PNG
      webp: { quality: 80 }, // WEBP
      svgo: { plugins: [{ name: "removeViewBox", active: false }] },
    }),

    // PWA
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: { enabled: true },

      manifest: {
        name: "Cayro Uniformes",
        short_name: "Cayro",
        description: "Ecommerce de ropa",
        id: "/",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0ea5e9",
        orientation: "portrait-primary",
        icons: [
          { src: "/icon-96.png", sizes: "96x96", type: "image/png" },
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable any",
          },
        ],
        shortcuts: [
          {
            name: "Inicio",
            short_name: "Inicio",
            url: "/",
            icons: [{ src: "/icon-96.png", sizes: "96x96", type: "image/png" }],
          },
          {
            name: "Catálogo",
            short_name: "Catálogo",
            url: "/catalogo",
            icons: [{ src: "/icon-96.png", sizes: "96x96", type: "image/png" }],
          },
          {
            name: "Carrito",
            short_name: "Carrito",
            url: "/carrito",
            icons: [{ src: "/icon-96.png", sizes: "96x96", type: "image/png" }],
          },
        ],
        screenshots: [
          {
            src: "/screenshot1.png", // 1280x720
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshot2.png", // 640x1136 (por ejemplo)
            sizes: "640x1136",
            type: "image/png",
          },
        ],
        prefer_related_applications: false,
      },

      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MiB
        runtimeCaching: [
          // Imágenes (cache-first + expiración)
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // API (network-first)
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/api/") ||
              /^https:\/\/api\.example\.com\//.test(url.href),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],

  define: {
    "process.env": process.env,
  },

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  server: {
    fs: { strict: true },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build: particionado de bundles + aviso de tamaño
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
