import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useEffect, useState } from "react";

// Configuración de nombres personalizados para las rutas
const routeNames: Record<string, string> = {
  "/": "Inicio",
  "/products": "Productos",
  "/terms": "Términos y Condiciones",
  "/about": "Acerca de Nosotros",
  "/recuperar-password": "Recuperar contraseña",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(
    () => JSON.parse(localStorage.getItem("breadcrumbs") || "[]")
  );

  useEffect(() => {
    if (location.pathname === "/") {
      // Reinicia breadcrumbs al estar en Inicio
      setBreadcrumbs([]);
      localStorage.removeItem("breadcrumbs");
    } else {
      setBreadcrumbs((prev) => {
        const currentPathIndex = prev.indexOf(location.pathname);

        if (currentPathIndex === -1) {
          // Agrega la ruta actual si no está en los breadcrumbs
          const updatedBreadcrumbs = [...prev, location.pathname];
          localStorage.setItem("breadcrumbs", JSON.stringify(updatedBreadcrumbs));
          return updatedBreadcrumbs;
        } else {
          // Elimina rutas posteriores si retrocedemos
          const updatedBreadcrumbs = prev.slice(0, currentPathIndex + 1);
          localStorage.setItem("breadcrumbs", JSON.stringify(updatedBreadcrumbs));
          return updatedBreadcrumbs;
        }
      });
    }
  }, [location.pathname]);

  // Si estamos en la página de inicio, no mostramos breadcrumbs
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="py-2 px-4">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link to="/" className="text-gray-500 hover:text-blue-600 flex items-center">
            <Home className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
        </li>
        {breadcrumbs.map((path, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const title = routeNames[path] || path
            .split("/")
            .filter((p) => p)
            .pop()
            ?.replace(/-/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());

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
