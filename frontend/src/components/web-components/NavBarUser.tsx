"use client";

import {
  Menu,
  Sun,
  Moon,
  X,
  User,
  ShoppingCart,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContextType";
import { getCompanyInfoApi } from "@/api/company";
import { getCategories } from "@/api/products"; // Import the categories API
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartConrexr";

// Define a type for category
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

const NavBarUser = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [menuNeedsScroll, setMenuNeedsScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);

  // Effect to fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Effect to check if menu content exceeds viewport height
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const checkMenuHeight = () => {
        if (menuRef.current) {
          const menuHeight = menuRef.current.scrollHeight;
          const viewportHeight = window.innerHeight;
          setMenuNeedsScroll(menuHeight > viewportHeight);
        }
      };

      // Check initially and on resize
      checkMenuHeight();
      window.addEventListener("resize", checkMenuHeight);

      return () => {
        window.removeEventListener("resize", checkMenuHeight);
      };
    }
  }, [isMenuOpen]);

  // Effect to handle body scroll locking when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Disable scrolling on body when menu is open
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        // Re-enable scrolling when menu is closed
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Function to get icon color based on category index
  const getCategoryColor = (index: number) => {
    const colors = [
      {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400",
      },
      {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-600 dark:text-green-400",
      },
      {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-600 dark:text-amber-400",
      },
      {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-600 dark:text-purple-400",
      },
      {
        bg: "bg-rose-100 dark:bg-rose-900/30",
        text: "text-rose-600 dark:text-rose-400",
      },
    ];

    return colors[index % colors.length];
  };

  const getCategoryIcon = () => {
    // Default to ShoppingBag if no icon specified or not found
    return <ShoppingBag className="w-4 h-4" />;
  };

  return (
    <>
      {/* Spacer div to prevent content from being hidden under the navbar */}
      <div className="h-20"></div>

      <div
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg"
            : "bg-white dark:bg-gray-900"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink
                to="/"
                className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
                onClick={() => {
                  localStorage.removeItem("breadcrumbs");
                }}
              >
                <img
                  src={logo || "/placeholder.svg?height=80&width=120"}
                  alt="Logo"
                  className="h-14 w-auto object-contain dark:brightness-110 dark:contrast-125"
                />
              </NavLink>
            </div>

            {/* Menú de navegación en escritorio */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <NavLink
                to="/"
                onClick={() => {
                  localStorage.removeItem("breadcrumbs");
                }}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors duration-200 relative group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </NavLink>

              {/* Menú desplegable de Productos con categorías dinámicas */}
              <div className="relative group">
                <button className="text-base font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group">
                  Productos
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
                </button>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-2 w-64 origin-top-left z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 opacity-50"></div>

                    <div className="relative">
                      <Link
                        to="/productos"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <span className="font-medium">
                            Todos los productos
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Ver catálogo completo
                          </p>
                        </div>
                      </Link>

                      {categories.map((category, index) => (
                        <Link
                          key={category.id}
                          to={`/productos?categoria=${encodeURIComponent(
                            category.name
                          )}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mt-1"
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${
                              getCategoryColor(index).bg
                            } flex items-center justify-center`}
                          >
                            <span className={getCategoryColor(index).text}>
                              {getCategoryIcon()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">{category.name}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {category.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              <NavLink
                to="/contacto"
                className={({ isActive }) =>
                  `text-base font-medium transition-colors duration-200 relative group ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  }`
                }
              >
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-full"></span>
              </NavLink>
            </div>

            {/* Iconos en escritorio */}
            <div className="hidden sm:flex items-center gap-6">
              <Link to="/carrito" className="relative group">
                <ShoppingCart className="h-6 w-6 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
                <span className="sr-only">Carrito de compras</span>
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={
                  darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                }
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600" />
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
                  className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-blue-500/20 group-hover:scale-105 transition-all duration-200">
                    {getInitial(user?.name || "")}
                  </div>
                  <span className="font-medium">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="font-medium">Ingresar</span>
                </Link>
              )}
            </div>

            {/* Menú móvil */}
            <div className="flex items-center sm:hidden">
              <Link to="/carrito" className="relative mr-4">
                <ShoppingCart className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Abrir menú"
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
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`sm:hidden fixed inset-y-0 right-0 w-3/4 max-w-xs bg-white dark:bg-gray-800 shadow-2xl z-50 ${
                  menuNeedsScroll ? "overflow-y-auto" : "overflow-y-hidden"
                }`}
              >
                <div className="flex flex-col p-6 h-full">
                  <div className="flex justify-end mb-6">
                    <button
                      onClick={closeMenu}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      aria-label="Cerrar menú"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {auth ? (
                    <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {getInitial(user?.name || "")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user?.role === "ADMIN"
                            ? "Administrador"
                            : user?.role === "EMPLOYEE"
                            ? "Empleado"
                            : "Usuario"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 mb-6 p-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      <User className="h-5 w-5" />
                      Iniciar sesión
                    </Link>
                  )}

                  <div className="space-y-1 mb-6">
                    <NavLink
                      to="/"
                      onClick={() => {
                        localStorage.removeItem("breadcrumbs");
                        closeMenu();
                      }}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg text-base font-medium ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      Inicio
                    </NavLink>

                    <div className="px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-200">
                      <div className="flex justify-between items-center">
                        <span>Productos</span>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                      <div className="mt-2 ml-4 space-y-1">
                        <Link
                          to="/productos"
                          onClick={closeMenu}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          Todos los productos
                        </Link>

                        {/* Categorías dinámicas en el menú móvil */}
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/productos?categoria=${encodeURIComponent(
                              category.name
                            )}`}
                            onClick={closeMenu}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <NavLink
                      to="/contacto"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg text-base font-medium ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      Contacto
                    </NavLink>

                    <NavLink
                      to="/carrito"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg text-base font-medium ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      Carrito ({itemCount})
                    </NavLink>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        Modo oscuro
                      </span>
                      <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          darkMode ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            darkMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay para cerrar el menú móvil */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="sm:hidden fixed inset-0 bg-black/50 z-40"
                onClick={closeMenu}
              />
            )}
          </AnimatePresence>
        </nav>
      </div>
    </>
  );
};

export default NavBarUser;
