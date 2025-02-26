import { Menu, Sun, Moon, X, User, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContextType";
import { Link } from "react-router-dom";
import { getCompanyInfoApi } from "@/api/company";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const NavBarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState<string>("");

  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfoApi();
      setLogo(res.data[0].logoUrl);
    };
    getInfo();

    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const newTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setDarkMode(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Obtener la primera letra del nombre del usuario
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  return (
    <div className="sticky bg-white dark:bg-gray-900 shadow-md top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Logo"
                className="h-28 w-auto object-contain dark:filter dark:drop-shadow-white"
              />
            </NavLink>
          </div>

          {/* Menú de navegación en escritorio */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <NavLink
              to="/"
              className="text-black dark:text-white hover:text-blue-600"
            >
              Inicio
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-black dark:text-white hover:text-blue-600">
                  Productos
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <DropdownMenuItem>
                  <Link
                    to="/productos"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Todos los productos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to="/productos?categoria=uniformes-escolares"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Uniformes Escolares
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to="/productos?categoria=deportivos"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Deportivos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/contacto"
              className="text-black dark:text-white hover:text-blue-600"
            >
              Contacto
            </NavLink>
          </div>

          {/* Iconos en escritorio */}
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/carrito">
              <ShoppingCart className="h-6 w-6 text-black dark:text-white hover:text-blue-600" />
            </Link>

            <button onClick={toggleTheme} className="p-2 hover:text-blue-600">
              {darkMode ? (
                <Sun className="h-6 w-6 text-black dark:text-white hover:text-blue-600" />
              ) : (
                <Moon className="h-6 w-6 text-black dark:text-white hover:text-blue-600" />
              )}
            </button>
            {auth ? (
              <Link
                to={
                  user?.role === "ADMIN"
                    ? "/perfil-admin"
                    : user?.role === "EMPLOYEE"
                    ? "/perfil-empleado"
                    : "/perfil-usuario"
                }
                className="flex items-center gap-2 text-black dark:text-white hover:text-blue-600"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {getInitial(user?.name || "")}
                  </div>
                  <span>{user?.name}</span>
                </div>
              </Link>
            ) : (
              <Link to="/login">
                <User className="h-6 w-6 text-black dark:text-white hover:text-blue-600" />
              </Link>
            )}
          </div>

          {/* Menú móvil */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="sm:hidden fixed inset-y-0 right-0 w-1/2 bg-white dark:bg-gray-800 shadow-lg z-50">
            <div className="flex flex-col space-y-4 p-6">
              <NavLink
                to="/"
                onClick={closeMenu}
                className="text-black dark:text-white hover:text-blue-600"
              >
                Inicio
              </NavLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="text-start">
                  <button className="text-black dark:text-white hover:text-blue-600">
                    Productos
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <DropdownMenuItem>
                    <Link
                      to="/productos"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Todos los productos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/productos?categoria=uniformes-escolares"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Uniformes Escolares
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/productos?categoria=deportivos"
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Deportivos
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <NavLink
                to="/contacto"
                onClick={closeMenu}
                className="text-black dark:text-white hover:text-blue-600"
              >
                Contacto
              </NavLink>

              <div className="flex flex-col  gap-4">
                {auth ? (
                  <Link
                    to={
                      user?.role === "ADMIN"
                        ? "/perfil-admin"
                        : "/perfil-usuario"
                    }
                    onClick={closeMenu}
                    className="flex items-center gap-2 text-black dark:text-white hover:text-blue-600"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {getInitial(user?.name || "")}
                    </div>
                    <span>{user?.name}</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-black dark:text-white hover:text-blue-600"
                  >
                    <User className="h-6 w-6" />
                  </Link>
                )}
                <div className="flex flex-row justify-between">
                  <Link
                    to="/carrito"
                    onClick={closeMenu}
                    className="text-black dark:text-white hover:text-blue-600"
                  >
                    <ShoppingCart className="h-6 w-6" />
                  </Link>
                <button
                  onClick={toggleTheme}
                  className="text-black dark:text-white hover:text-blue-600"
                >
                  {darkMode ? (
                    <Sun className="h-6 w-6" />
                  ) : (
                    <Moon className="h-6 w-6" />
                  )}
                </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBarUser;
