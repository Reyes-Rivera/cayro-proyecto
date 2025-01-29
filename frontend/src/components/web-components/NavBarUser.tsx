import { Menu, Sun, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContextType";
import "sweetalert2/src/sweetalert2.scss";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Link } from "react-router-dom";
import { getCompanyInfoApi } from "@/api/company";

const NavBarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState<string>("");
  console.log(logo);
  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      setDarkMode(false);
      localStorage.setItem("theme", "light");
    } else {
      htmlElement.classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  };

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

  return (
    <div
      className={`sticky top-0 z-50 transition-colors duration-300 bg-white shadow-md dark:bg-gray-900`}
    >
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* LOGO */}
            <div className="flex items-center">
              <NavLink to="/" className="flex-shrink-0">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-28 w-auto object-contain dark:filter dark:drop-shadow-white"
                  loading="lazy"
                />
              </NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6 ml-auto">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-black dark:text-white border-b-2 border-blue-600"
                    : "text-gray-800 dark:text-gray-300 hover:text-blue-600 transition-all"
                }
              >
                Inicio
              </NavLink>
              <NavLink
                to="/productos"
                className={({ isActive }) =>
                  isActive
                    ? "text-black dark:text-white border-b-2 border-blue-600"
                    : "text-gray-800 dark:text-gray-300 hover:text-blue-600 transition-all"
                }
              >
                Productos
              </NavLink>

              {auth ? (
                <div className="flex justify-center items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Avatar" />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link
                    to={
                      user?.role === "ADMIN"
                        ? "/perfil-admin"
                        : user?.role === "USER" ? "/perfil-usuario":"/employee-profile"
                    }
                    className="hidden md:inline-block"
                  >
                    {user?.name}
                  </Link>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Iniciar sesión
                </NavLink>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                {darkMode ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-900" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                {darkMode ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-900" />
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50 transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } sm:hidden w-64`}
        >
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Menú
            </h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-1 pt-4 pb-3">
            <NavLink
              to="/"
              className="block px-4 py-2 text-gray-800 dark:text-gray-300"
            >
              Inicio
            </NavLink>
            <NavLink
              to="/productos"
              className="block px-4 py-2 text-gray-800 dark:text-gray-300"
            >
              Productos
            </NavLink>
            {!auth && (
              <NavLink
                to="/login"
                className="block px-4 py-2 text-gray-800 dark:text-gray-300"
              >
                Iniciar sesión
              </NavLink>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBarUser;
