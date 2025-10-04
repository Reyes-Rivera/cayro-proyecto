import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContextType.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

const params = new URLSearchParams(location.search);
const IS_AUDIT = params.has("audit");
const IS_PURGE = params.has("purge");

async function purgeForAudit() {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if (indexedDB?.databases) {
      const dbs = await indexedDB.databases();
      await Promise.all(
        (dbs || [])
          .map((d: any) => d?.name)
          .filter(Boolean)
          .map(
            (name: string) =>
              new Promise<void>((res) => {
                const req = indexedDB.deleteDatabase(name);
                req.onblocked = req.onerror = req.onsuccess = () => res();
              })
          )
      );
    }
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* empty */
    }
  } catch (e) {
    console.warn("[purgeForAudit] algo falló:", e);
  } finally {
    location.replace(location.origin + location.pathname + "?audit=1");
  }
}

async function initPWA() {
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;
  if (IS_AUDIT) return;

  const { registerSW } = await import("virtual:pwa-register");

  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm("Hay una nueva versión disponible, ¿quieres actualizar?")) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log("App lista para trabajar offline");
    },
  });

  (window as any).__pwa_update = () => updateSW(true);
}

(async function boot() {
  if (IS_PURGE) {
    await purgeForAudit();
    return;
  }

  await initPWA();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>
  );
})();
