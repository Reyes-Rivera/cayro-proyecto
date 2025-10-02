import { registerSW } from "virtual:pwa-register";

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
