"use client";
import type React from "react";
import {
  Menu,
  Sun,
  Moon,
  X,
  User,
  ShoppingCart,
  ChevronDown,
  ShoppingBag,
  Home,
  Phone,
  Search,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContextType";
import { getCompanyInfoApi } from "@/api/company";
import { getCategories } from "@/api/products"; // Import the categories API
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

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
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [menuNeedsScroll, setMenuNeedsScroll] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();
  const [categories, setCategories] = useState<Category[]>([]); // Initialize as empty array
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Effect to fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // Ensure we always set an array
        if (response && response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.warn("Categories response is not an array:", response);
          setCategories([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Fallback to empty array on error
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
      document.body.style.overflow = "hidden"; // Add this to prevent scrolling
      return () => {
        // Re-enable scrolling when menu is closed
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = ""; // Reset overflow
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await getCompanyInfoApi();
        if (res && res.data && res.data[0] && res.data[0].logoUrl) {
          setLogo(res.data[0].logoUrl);
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };
    getInfo();
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Determine if we've scrolled enough to change the navbar appearance
      setScrolled(currentScrollY > 5);
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down & past threshold - hide navbar
        setVisible(false);
      } else {
        // Scrolling up or at top - show navbar
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/productos?search=${encodeURIComponent(
        searchQuery.trim()
      )}`;
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Only show navbar for non-authenticated users or users with USER role
  if (auth && (user?.role === "ADMIN" || user?.role === "EMPLOYEE")) {
    return null;
  }

  return (
    <>
      {/* Spacer div to prevent content from being hidden under the navbar */}
      <div className="h-20"></div>
      <div
        className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900 shadow-sm ${
          scrolled ? "shadow-lg" : ""
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-blue-900/10 pointer-events-none"></div>
        <nav
          ref={navRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        >
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center h-16 overflow-hidden">
              <NavLink
                to="/"
                className="flex-shrink-0 transition-transform duration-300 relative group h-full flex items-center"
                onClick={() => {
                  localStorage.removeItem("breadcrumbs");
                }}
              >
                <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={logo || "/placeholder.svg?height=80&width=120"}
                  alt="Logo"
                  className="h-32 w-auto object-contain transition-all duration-300 relative"
                />
              </NavLink>
            </div>
            {/* Menú de navegación en escritorio */}
            <div className="hidden sm:flex sm:items-center sm:space-x-1 lg:space-x-2">
              {/* Búsqueda o Navegación */}
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="w-64 pl-4 pr-2 py-2 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearchSubmit();
                          } else if (e.key === "Escape") {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }
                        }}
                      />
                      <div className="flex items-center pr-1">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Buscar"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-1"
                          aria-label="Cancelar búsqueda"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="navigation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-1 lg:space-x-2"
                  >
                    <NavLink
                      to="/"
                      onClick={() => {
                        localStorage.removeItem("breadcrumbs");
                      }}
                      className={({ isActive }) =>
                        `text-sm font-medium transition-all duration-200 relative group px-3 py-2 rounded-full ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                        } flex items-center gap-1.5`
                      }
                    >
                      <Home className="w-4 h-4" />
                      <span>Inicio</span>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-1/2"></span>
                    </NavLink>
                    {/* Menú desplegable de Productos con categorías dinámicas */}
                    <div className="relative group">
                      <button className="text-sm font-medium transition-all duration-200 flex items-center gap-1.5 group px-3 py-2 rounded-full text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70">
                        <ShoppingBag className="w-4 h-4" />
                        <span>Productos</span>
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-1/2"></span>
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
                            {/* Safe check for categories array */}
                            {Array.isArray(categories) &&
                              categories.length > 0 &&
                              categories.map((category, index) => (
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
                                    <span
                                      className={getCategoryColor(index).text}
                                    >
                                      {getCategoryIcon()}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      {category.name}
                                    </span>
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
                        `text-sm font-medium transition-all duration-200 relative group px-3 py-2 rounded-full ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                        } flex items-center gap-1.5`
                      }
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contacto</span>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-1/2"></span>
                    </NavLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Iconos en escritorio */}
            <div className="hidden sm:flex items-center gap-1 lg:gap-2">
              {/* Botón de búsqueda */}
              <button
                ref={searchButtonRef}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Buscar productos"
              >
                <Search className="h-4 w-4 transition-colors duration-200 text-gray-700 dark:text-gray-300" />
              </button>
              <Link to="/carrito" className="relative group">
                <div className="p-2 rounded-full transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <ShoppingCart className="h-4 w-4 transition-colors duration-200 text-gray-700 dark:text-gray-300" />
                </div>
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center group-hover:scale-110 transition-transform px-1">
                  {itemCount}
                </span>
                <span className="sr-only">Carrito de compras</span>
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={
                  darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                }
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                  className="flex items-center gap-2 transition-colors duration-200 group ml-1 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-blue-500/20 group-hover:scale-105 transition-all duration-200">
                    {getInitial(user?.name || "")}
                  </div>
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 transition-colors duration-200 ml-1 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium text-sm">Ingresar</span>
                </Link>
              )}
            </div>
            {/* Menú móvil */}
            <div className="flex items-center sm:hidden gap-2">
              {/* Búsqueda o Navegación móvil */}
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div
                    key="search-mobile"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar..."
                        className="w-36 pl-3 pr-1 py-1.5 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearchSubmit();
                          } else if (e.key === "Escape") {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }
                        }}
                      />
                      <div className="flex items-center pr-1">
                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Buscar"
                        >
                          <Search className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-1"
                          aria-label="Cancelar búsqueda"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    key="search-button-mobile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 rounded-full transition-colors text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Buscar productos"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
              <Link to="/carrito" className="relative">
                <div className="p-2 rounded-full transition-colors text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {itemCount}
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full transition-colors text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Abrir menú"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`sm:hidden fixed inset-y-0 right-0 w-3/4 max-w-xs bg-white dark:bg-gray-800 shadow-2xl z-50 ${
                  menuNeedsScroll ? "overflow-y-auto" : ""
                }`}
                style={{ top: "0", height: "100vh" }}
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
                    <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl">
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
                      className="flex items-center justify-center gap-2 mb-6 p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md"
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
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <Home className="w-5 h-5" />
                      Inicio
                    </NavLink>
                    <div className="px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-5 h-5" />
                          <span>Productos</span>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                      <div className="mt-2 ml-8 space-y-1">
                        <Link
                          to="/productos"
                          onClick={closeMenu}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          Todos los productos
                        </Link>
                        {/* Categorías dinámicas en el menú móvil - Safe check */}
                        {Array.isArray(categories) &&
                          categories.length > 0 &&
                          categories.map((category) => (
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
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <Phone className="w-5 h-5" />
                      Contacto
                    </NavLink>
                    <NavLink
                      to="/carrito"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Carrito ({itemCount})
                    </NavLink>
                  </div>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-xl">
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
          {/* Overlay for mobile menu - Fixed positioning to prevent content overlap */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="sm:hidden fixed inset-0 bg-black/50 z-40"
                onClick={closeMenu}
                style={{ top: "0", height: "100vh" }} // Ensure full height
              />
            )}
          </AnimatePresence>
        </nav>
      </div>
    </>
  );
};

export default NavBarUser;
