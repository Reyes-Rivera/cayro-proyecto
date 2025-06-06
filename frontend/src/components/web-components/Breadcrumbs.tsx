"use client";

import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useState } from "react";

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

export default function Breadcrumbs() {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("breadcrumbs") || "[]")
  );

  // Función para decodificar de forma segura
  const safeDecodeURIComponent = (str: string) => {
    try {
      return decodeURIComponent(str);
    } catch (error) {
      console.error("Error decodificando URL:", error);
      return str;
    }
  };

  // Función para obtener el título formateado de una ruta
  const getFormattedTitle = (path: string) => {
    // Si existe en el mapeo de rutas, usar ese nombre
    if (routeNames[path]) {
      return routeNames[path];
    }

    // Extraer la última parte de la ruta
    const lastSegment =
      path
        .split("/")
        .filter((p) => p)
        .pop() || "";

    // Decodificar caracteres especiales (como %C3%A1 -> á)
    const decodedSegment = safeDecodeURIComponent(lastSegment);

    // Formatear: reemplazar guiones por espacios y capitalizar primera letra
    return decodedSegment
      .replace(/-/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  useEffect(() => {
    if (!location.pathname) {
      setBreadcrumbs([]);
      localStorage.removeItem("breadcrumbs");
    } else {
      if (
        location.pathname.includes("/producto")
      ) {
        setBreadcrumbs([]);
        localStorage.removeItem("breadcrumbs");
      }
      setBreadcrumbs((prev) => {
        const currentPathIndex = prev.indexOf(location.pathname);

        if (currentPathIndex !== -1) {
          // Si la página seleccionada ya estaba en la lista, eliminar las posteriores y conservar la seleccionada
          const updatedBreadcrumbs = prev.slice(0, currentPathIndex + 1);
          localStorage.setItem(
            "breadcrumbs",
            JSON.stringify(updatedBreadcrumbs)
          );
          return updatedBreadcrumbs;
        } else {
          // Si la página es nueva, agregarla a la lista
          const updatedBreadcrumbs = [...prev, location.pathname];
          localStorage.setItem(
            "breadcrumbs",
            JSON.stringify(updatedBreadcrumbs)
          );
          return updatedBreadcrumbs;
        }
      });
    }
  }, [location.pathname]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="py-2 px-4">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link
            to="/"
            className="text-gray-500 hover:text-blue-600 flex items-center"
            onClick={() => localStorage.removeItem("breadcrumbs")}
          >
            <Home className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
        </li>
        {breadcrumbs.map((path, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const title = getFormattedTitle(path);

          return (
            <li key={path} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
              {isLast ? (
                <span className="text-blue-600 font-medium">{title}</span>
              ) : (
                <Link to={path} className="text-gray-500 hover:text-blue-600">
                  {title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
