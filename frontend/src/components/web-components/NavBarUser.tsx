import { Menu, Sun, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContextType";
import "sweetalert2/src/sweetalert2.scss";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Link } from "react-router-dom";
import { getCompanyInfoApi } from "@/api/company";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";

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
  const categories = {
    Uniformesescolares: "uniformes-escolares",
    Deportivos: "deportivos",
    Pantalones: "pantalones",
    Gorras: "gorras",
    Polo: "polo",
    Playeras: "playeras",
    Calcetas: "calcetas",
    Short: "shorts",
    Espinilleras: "espinilleras",
  };
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

              {/* Menú de Productos */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-md transition-colors"
                  >
                    Productos
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <DropdownMenuItem
                    key={"productos"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Productos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"uniformes-escolares"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Uniformesescolares}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Uniformes Escolares
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"deportivos"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Deportivos}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Deportivos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"pantalones"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Pantalones}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Pantalones
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"gorras"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Gorras}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Gorras
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"polo"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Polo}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Polo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"playeras"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Playeras}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Playeras
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"calcetas"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Calcetas}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Calcetas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"shorts"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Short}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Shorts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    key={"espinilleras"}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/productos?categoria=${categories.Espinilleras}`}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      Espinilleras
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Avatar o Iniciar Sesión */}
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
                        : user?.role === "USER"
                        ? "/perfil-usuario"
                        : "/employee-profile"
                    }
                    className="hidden md:inline-block text-gray-700 dark:text-gray-300"
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

              {/* Botón de Tema (Modo Claro/Oscuro) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                {darkMode ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-900 dark:text-gray-300" />
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
                  <Moon className="h-6 w-6 text-gray-900 dark:text-gray-300" />
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

        {/* Mobile Menu */}
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
              className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Inicio
            </NavLink>
            <NavLink
              to="/productos"
              className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Productos
            </NavLink>
            {!auth && (
              <NavLink
                to="/login"
                className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
