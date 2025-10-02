"use client";

import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";

// Mapeo de rutas a nombres personalizados
const routeNames: Record<string, string> = {
  "/": "Inicio",
  "/recuperar-password": "Recuperar contraseña",
  "/productos": "Productos",
  "/categorias": "Categorías",
  "/marcas": "Marcas",
  "/carrito": "Carrito de Compras",
  "/checkout": "Finalizar Compra",
  "/perfil": "Mi Perfil",
  "/pedidos": "Mis Pedidos",
};

// Hook personalizado para localStorage seguro con tipos correctos
const useSafeLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const valueToStore =
          newValue instanceof Function ? newValue(prev) : newValue;

        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
        } catch (error) {
          console.warn(`Error setting localStorage key "${key}":`, error);
        }

        return valueToStore;
      });
    },
    [key]
  );

  return [value, setStoredValue] as const;
};

// Función para decodificar de forma segura
const safeDecodeURIComponent = (str: string) => {
  try {
    return decodeURIComponent(str);
  } catch (error) {
    console.warn("Error decodificando URL:", error);
    return str;
  }
};

// Función para obtener el título formateado
const getFormattedTitle = (path: string) => {
  if (routeNames[path]) {
    return routeNames[path];
  }

  const lastSegment = path.split("/").filter(Boolean).pop() || "";
  const decodedSegment = safeDecodeURIComponent(lastSegment);

  return decodedSegment
    .replace(/-/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
};

export default function Breadcrumbs() {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useSafeLocalStorage<string[]>(
    "breadcrumbs",
    []
  );

  // Función para limpiar breadcrumbs
  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([]);
  }, [setBreadcrumbs]);

  // Memoizar la lógica de actualización de breadcrumbs
  const updateBreadcrumbs = useCallback(
    (currentPath: string) => {
      if (!currentPath) {
        setBreadcrumbs([]);
        return;
      }

      setBreadcrumbs((prev: string[]) => {
        // Si es una ruta de producto, mantener solo "/productos"
        if (currentPath.includes("/producto")) {
          return ["/productos"];
        }

        const currentPathIndex = prev.indexOf(currentPath);

        if (currentPathIndex !== -1) {
          // Si la página ya existe, cortar hasta esa posición
          return prev.slice(0, currentPathIndex + 1);
        } else {
          // Agregar nueva ruta (limitar a máximo 5 elementos para performance)
          const updated = [...prev, currentPath];
          return updated.length > 5 ? updated.slice(1) : updated;
        }
      });
    },
    [setBreadcrumbs]
  );

  // Efecto optimizado con dependencias claras
  useEffect(() => {
    updateBreadcrumbs(location.pathname);
  }, [location.pathname, updateBreadcrumbs]);

  // Memoizar la lista de breadcrumbs renderizados
  const renderedBreadcrumbs = useMemo(() => {
    if (breadcrumbs.length === 0) return null;

    return breadcrumbs.map((path, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const title = getFormattedTitle(path);

      return (
        <li key={`${path}-${index}`} className="flex items-center">
          <ChevronRight
            className="w-4 h-4 text-gray-400 mx-1 flex-shrink-0"
            aria-hidden="true"
          />
          {isLast ? (
            <span
              className="text-blue-600 font-medium truncate max-w-[150px] sm:max-w-[200px]"
              aria-current="page"
            >
              {title}
            </span>
          ) : (
            <Link
              to={path}
              className="text-gray-500 hover:text-blue-600 transition-colors duration-200 truncate max-w-[120px] sm:max-w-[150px]"
              onClick={clearBreadcrumbs}
            >
              {title}
            </Link>
          )}
        </li>
      );
    });
  }, [breadcrumbs, clearBreadcrumbs]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Migas de pan"
      className="py-2 px-4 "
    >
      <div className="container mx-auto max-w-7xl">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-700">
          <li className="flex items-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-blue-600 flex items-center transition-colors duration-200"
              onClick={clearBreadcrumbs}
              aria-label="Ir al inicio"
            >
              <Home className="w-4 h-4 mr-1 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only sm:inline">Inicio</span>
            </Link>
          </li>
          {renderedBreadcrumbs}
        </ol>
      </div>
    </nav>
  );
}
