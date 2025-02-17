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
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar el fondo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // Cambia a fondo sólido después de 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <div
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
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

          {/* Menú de navegación */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <NavLink
              to="/"
              className={`transition-all ${
                scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
              } hover:text-blue-600`}
            >
              Inicio
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`transition-all ${
                    scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
                  } hover:text-blue-600`}
                >
                  Productos
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <DropdownMenuItem>
                  <Link
                    to="/productos"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Todos los productos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to="/productos?categoria=uniformes-escolares"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Uniformes Escolares
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    to="/productos?categoria=deportivos"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Deportivos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/contacto"
              className={`transition-all ${
                scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
              } hover:text-blue-600`}
            >
              Contacto
            </NavLink>
          </div>

          {/* Iconos */}
          <div className="hidden sm:flex items-center gap-4">
            {auth ? (
              <Link
                to={user?.role === "ADMIN" ? "/perfil-admin" : "/perfil-usuario"}
              >
                <User
                  className={`h-6 w-6 transition ${
                    scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
                  } hover:text-blue-600`}
                />
              </Link>
            ) : (
              <Link to="/login">
                <User
                  className={`h-6 w-6 transition ${
                    scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
                  } hover:text-blue-600`}
                />
              </Link>
            )}

            <Link to="/carrito">
              <ShoppingCart
                className={`h-6 w-6 transition ${
                  scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
                } hover:text-blue-600`}
              />
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 hover:text-blue-600 border-b-blue-600"
            >
              {darkMode ? (
                <Sun  className={`h-6 w-6 transition ${
                  scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
                } hover:text-blue-600`} />
              ) : (
                <Moon  className={`h-6 w-6 transition ${
                  scrolled ? "text-gray-800 dark:text-gray-300" : "text-white"
                } hover:text-blue-600`} />
              )}
            </button>
          </div>

          {/* Menú móvil */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition ${
                scrolled ? "text-gray-800 dark:text-white" : "text-white"
              } hover:bg-gray-200 dark:hover:bg-gray-800`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBarUser;
