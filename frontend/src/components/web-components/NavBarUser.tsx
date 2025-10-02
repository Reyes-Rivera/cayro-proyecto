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
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContextType";
import { getCompanyInfoApi } from "@/api/company";
import { getCategories } from "@/api/products";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

// Constantes fuera del componente para mejor performance
const CATEGORY_COLORS = [
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
] as const;

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Memoizar datos del usuario para evitar re-renderizados
  const userInitial = useMemo(
    () => (user?.name ? user.name.charAt(0).toUpperCase() : ""),
    [user?.name]
  );

  const userName = useMemo(() => user?.name?.split(" ")[0] || "", [user?.name]);

  const userProfileLink = useMemo(() => {
    if (!user?.role) return "/perfil-usuario";
    return user.role === "ADMIN"
      ? "/perfil-admin"
      : user.role === "EMPLOYEE"
      ? "/perfil-empleado"
      : "/perfil-usuario";
  }, [user?.role]);

  // Fetch optimizado con useCallback
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      if (response?.data && Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.warn("Error fetching categories:", error);
      setCategories([]);
    }
  }, []);

  const fetchCompanyInfo = useCallback(async () => {
    try {
      const res = await getCompanyInfoApi();
      if (res?.data?.[0]?.logoUrl) {
        setLogo(res.data[0].logoUrl);
      }
    } catch (error) {
      console.warn("Error fetching company info:", error);
    }
  }, []);

  // Efectos optimizados
  useEffect(() => {
    fetchCategories();
    fetchCompanyInfo();

    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, [fetchCategories, fetchCompanyInfo]);

  // Scroll handler throttled con requestAnimationFrame
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrolled(currentScrollY > 5);

    if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Optimizar menu height check
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const checkMenuHeight = () => {
        if (menuRef.current) {
          const menuHeight = menuRef.current.scrollHeight;
          const viewportHeight = window.innerHeight;
          setMenuNeedsScroll(menuHeight > viewportHeight);
        }
      };

      const resizeObserver = new ResizeObserver(checkMenuHeight);
      resizeObserver.observe(menuRef.current);

      checkMenuHeight();
      return () => resizeObserver.disconnect();
    }
  }, [isMenuOpen]);

  // Body scroll lock optimizado
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.cssText = `
        position: fixed;
        top: -${scrollY}px;
        width: 100%;
        overflow: hidden;
      `;

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.cssText = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      };
    }
  }, [isMenuOpen]);

  // Focus management para search
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isSearchOpen]);

  // Handlers optimizados con useCallback
  const toggleTheme = useCallback(() => {
    const isDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark");
    setDarkMode(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const getCategoryColor = useCallback((index: number) => {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  }, []);

  const handleSearchSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      if (searchQuery.trim()) {
        window.location.href = `/productos?search=${encodeURIComponent(
          searchQuery.trim()
        )}`;
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery]
  );

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, []);

  // Memoizar elementos de navegación para desktop
  const desktopNavigation = useMemo(
    () => (
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
          onClick={() => localStorage.removeItem("breadcrumbs")}
          className={({ isActive }) =>
            `text-sm font-medium transition-all duration-200 relative group px-3 py-2 rounded-full ${
              isActive
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
            } flex items-center gap-1.5`
          }
        >
          <Home className="w-4 h-4 flex-shrink-0" />
          <span>Inicio</span>
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-1/2"
            aria-hidden="true"
          ></span>
        </NavLink>

        {/* Productos dropdown optimizado */}
        <div className="relative group">
          <button
            className="text-sm font-medium transition-all duration-200 flex items-center gap-1.5 group px-3 py-2 rounded-full text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <ShoppingBag className="w-4 h-4 flex-shrink-0" />
            <span>Productos</span>
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 flex-shrink-0" />
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-1/2"
              aria-hidden="true"
            ></span>
          </button>
          <div className="absolute left-0 mt-2 w-64 origin-top-left z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 opacity-50"
                aria-hidden="true"
              ></div>
              <div className="relative">
                <Link
                  to="/productos"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="font-medium">Todos los productos</span>
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
                      } flex items-center justify-center flex-shrink-0`}
                    >
                      <ShoppingBag
                        className={`w-4 h-4 ${getCategoryColor(index).text}`}
                      />
                    </div>
                    <div>
                      <span className="font-medium">{category.name}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {category.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span>Contacto</span>
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200 group-hover:w-1/2"
            aria-hidden="true"
          ></span>
        </NavLink>
      </motion.div>
    ),
    [categories, getCategoryColor]
  );

  // Search component memoizado
  const searchComponent = useMemo(
    () => (
      <motion.div
        key="search"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        exit={{ opacity: 0, width: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center"
      >
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-64 pl-4 pr-2 py-2 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white"
            onKeyDown={handleSearchKeyDown}
            aria-label="Buscar productos"
          />
          <div className="flex items-center pr-1">
            <button
              type="submit"
              className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
              className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-1 transition-colors"
              aria-label="Cancelar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    ),
    [searchQuery, handleSearchSubmit, handleSearchKeyDown]
  );

  // Mobile search component
  const mobileSearchComponent = useMemo(
    () => (
      <motion.div
        key="search-mobile"
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        exit={{ opacity: 0, width: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center"
      >
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-36 pl-3 pr-1 py-1.5 bg-transparent border-0 focus:outline-none text-gray-900 dark:text-white text-sm"
            onKeyDown={handleSearchKeyDown}
            aria-label="Buscar productos"
          />
          <div className="flex items-center pr-1">
            <button
              type="submit"
              className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
              className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 mr-1 transition-colors"
              aria-label="Cancelar búsqueda"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </motion.div>
    ),
    [searchQuery, handleSearchSubmit, handleSearchKeyDown]
  );

  // Ocultar navbar para admin/employee
  if (auth && (user?.role === "ADMIN" || user?.role === "EMPLOYEE")) {
    return null;
  }

  return (
    <>
      <div className="h-20" aria-hidden="true" />
      <div
        ref={navRef}
        className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white dark:bg-gray-900 shadow-sm ${
          scrolled ? "shadow-lg" : ""
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
        role="banner"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-blue-50/50 dark:from-blue-900/10 dark:via-transparent dark:to-blue-900/10 pointer-events-none" />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-20">
            {/* Logo optimizado */}
            <div className="flex items-center h-16 overflow-hidden">
              <NavLink
                to="/"
                className="flex-shrink-0 transition-transform duration-300 relative group h-full flex items-center"
                onClick={() => localStorage.removeItem("breadcrumbs")}
                aria-label="Ir al inicio"
              >
                <div
                  className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                />
                <img
                  src={logo || "/placeholder.svg?height=80&width=120"}
                  alt="Logo"
                  className="h-32 w-auto object-contain transition-all duration-300 relative"
                  loading="eager"
                  width={120}
                  height={80}
                />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-1 lg:space-x-2">
              <AnimatePresence mode="wait">
                {isSearchOpen ? searchComponent : desktopNavigation}
              </AnimatePresence>
            </div>

            {/* Desktop Icons */}
            <div className="hidden sm:flex items-center gap-1 lg:gap-2">
              {!isSearchOpen && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Buscar productos"
                >
                  <Search className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </button>
              )}

              <Link
                to="/carrito"
                className="relative group"
                aria-label={`Carrito de compras con ${itemCount} items`}
              >
                <div className="p-2 rounded-full transition-colors duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <ShoppingCart className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center group-hover:scale-110 transition-transform px-1">
                    {itemCount}
                  </span>
                )}
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
                  to={userProfileLink}
                  className="flex items-center gap-2 transition-colors duration-200 group ml-1 px-2 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Mi perfil"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-blue-500/20 group-hover:scale-105 transition-all duration-200 flex-shrink-0">
                    {userInitial}
                  </div>
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200 hidden lg:block">
                    {userName}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 transition-colors duration-200 ml-1 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                  aria-label="Iniciar sesión"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">Ingresar</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center sm:hidden gap-2">
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  mobileSearchComponent
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

              <Link
                to="/carrito"
                className="relative"
                aria-label={`Carrito de compras con ${itemCount} items`}
              >
                <div className="p-2 rounded-full transition-colors text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full transition-colors text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="sm:hidden fixed inset-0 bg-black/50 z-40"
                  onClick={closeMenu}
                  style={{ top: "0", height: "100vh" }}
                  aria-hidden="true"
                />
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
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menú de navegación"
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
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
                        aria-label="Iniciar sesión"
                      >
                        <User className="h-5 w-5 flex-shrink-0" />
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
                        <Home className="w-5 h-5 flex-shrink-0" />
                        Inicio
                      </NavLink>

                      <div className="px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                            <span>Productos</span>
                          </div>
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        </div>
                        <div className="mt-2 ml-8 space-y-1">
                          <Link
                            to="/productos"
                            onClick={closeMenu}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            Todos los productos
                          </Link>
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              to={`/productos?categoria=${encodeURIComponent(
                                category.name
                              )}`}
                              onClick={closeMenu}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                        <Phone className="w-5 h-5 flex-shrink-0" />
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
                        <ShoppingCart className="w-5 h-5 flex-shrink-0" />
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
                          aria-label={
                            darkMode
                              ? "Desactivar modo oscuro"
                              : "Activar modo oscuro"
                          }
                          role="switch"
                          aria-checked={darkMode}
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
              </>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </>
  );
};

export default NavBarUser;
