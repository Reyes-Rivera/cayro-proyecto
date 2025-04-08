import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContextType.tsx";
import { CartProvider } from "./context/CartConrexr.tsx";
import { setupGlobalErrorHandlers } from "./utils/global-error-handler"; // 👈 importa función global
import { ErrorBoundary } from "./components/ErrorBoundary.tsx"; // 👈 importa el componente

// Activar captura global
setupGlobalErrorHandlers();

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
