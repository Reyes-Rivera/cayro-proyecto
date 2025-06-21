"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Panel from "./panel/Panel";
import Products from "./profucts/Products";
import CategoryPage from "./profucts/category/CategoryPage";
import SizePage from "./profucts/size/SizePage";
import SleevePage from "./profucts/sleeve/SleevePage";
import GenderPage from "./profucts/gender/GenderPage";
import BrandPage from "./profucts/brand/BrandPage";
import ColorPage from "./profucts/colors/ColorPage";
import Sidebar from "./components/sidebar";
import type { JSX } from "react/jsx-runtime";
import { ProfileSection } from "./profile/ProfileSection";
import { AddressSection } from "../components/AddressSection";
import { PasswordSection } from "../components/PasswordSection";
import { getCompanyInfoApi } from "@/api/company";
import { Menu, X, Bell, Search } from "lucide-react";
import Orders from "./orders/Orders";

type TabKey =
  | "panel"
  | "users"
  | "products"
  | "categories"
  | "sizes"
  | "sleeves"
  | "gender"
  | "brands"
  | "colors"
  | "sales"
  | "orders"
  | "analytics"
  | "finances"
  | "help"
  | "profile"
  | "address"
  | "security";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("panel");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logo, setLogo] = useState<string>("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  // Función para manejar el cambio de pestaña y hacer scroll hasta arriba
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check for dark mode preference
  useEffect(() => {
    // Check for dark mode
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await getCompanyInfoApi();
        if (res.data && res.data.length > 0) {
          setLogo(res.data[0].logoUrl);
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };
    getInfo();
  }, []);

  // Handle scroll events for mobile header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        // Always show header at the top of the page
        setShowMobileHeader(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide header
        setShowMobileHeader(false);
      } else {
        // Scrolling up - show header
        setShowMobileHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const newTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setIsDarkMode(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Componentes para cada pestaña
  const tabs: Record<TabKey, JSX.Element> = {
    panel: <Panel />,
    users: <ProfileSection />,
    products: <Products />,
    categories: <CategoryPage />,
    sizes: <SizePage />,
    sleeves: <SleevePage />,
    gender: <GenderPage />,
    brands: <BrandPage />,
    colors: <ColorPage />,
    sales: (
      <div className="px-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          {/* Encabezado */}
          <div className="relative">
            <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Reportes de Ventas
                    </h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <Search className="w-3.5 h-3.5 mr-1.5 inline" />
                      Análisis detallado de ventas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 pt-10">
            <p className="text-gray-600 dark:text-gray-300">
              Esta sección está en desarrollo. Próximamente podrás ver
              estadísticas detalladas de ventas.
            </p>
          </div>
        </div>
      </div>
    ),
    orders: <Orders />,
    analytics: (
      <div className="px-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          {/* Encabezado */}
          <div className="relative">
            <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Analíticas
                    </h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <Search className="w-3.5 h-3.5 mr-1.5 inline" />
                      Análisis de datos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 pt-10">
            <p className="text-gray-600 dark:text-gray-300">
              Esta sección está en desarrollo. Próximamente podrás ver
              analíticas detalladas.
            </p>
          </div>
        </div>
      </div>
    ),
    finances: (
      <div className="px-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          {/* Encabezado */}
          <div className="relative">
            <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Finanzas</h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <Search className="w-3.5 h-3.5 mr-1.5 inline" />
                      Gestión financiera
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 pt-10">
            <p className="text-gray-600 dark:text-gray-300">
              Esta sección está en desarrollo. Próximamente podrás gestionar tus
              finanzas.
            </p>
          </div>
        </div>
      </div>
    ),
    help: (
      <div className="px-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          {/* Encabezado */}
          <div className="relative">
            <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Ayuda</h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <Search className="w-3.5 h-3.5 mr-1.5 inline" />
                      Documentación y soporte
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 pt-10">
            <p className="text-gray-600 dark:text-gray-300">
              Esta sección está en desarrollo. Próximamente podrás ver la
              documentación de ayuda.
            </p>
          </div>
        </div>
      </div>
    ),
    profile: <ProfileSection />,
    address: <AddressSection />,
    security: <PasswordSection />,
  };

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 h-[calc(100vh-2rem)] sticky top-4 overflow-hidden z-30 rounded-xl shadow-md flex-shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-2rem)] bg-gray-50 dark:bg-gray-900 lg:ml-4 min-w-0">
        {/* Mobile header with logo on left and burger menu on right */}
        <motion.div
          ref={headerRef}
          className="sm:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-blue-500 text-white shadow-md"
          initial={{ y: 0 }}
          animate={{
            y: showMobileHeader ? 0 : -100,
            opacity: showMobileHeader ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo on left */}
          <div className="h-10 w-auto flex items-center">
            <img
              src={logo || "/placeholder.svg?height=40&width=40"}
              alt="Logo"
              className="h-8 w-auto object-contain bg-white/20 p-1 rounded-md"
            />
            <span className="ml-2 font-semibold">Dashboard</span>
          </div>

          {/* Burger menu on right */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-md text-white hover:bg-white/20"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </motion.div>

        {/* Spacer for fixed mobile header */}
        <div className="sm:hidden h-[72px] mb-4"></div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              ></motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-4 left-4 h-[calc(100vh-2rem)] w-72 z-50 sm:hidden overflow-hidden rounded-xl shadow-lg"
              >
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  isMobile={true}
                  onClose={() => setIsMenuOpen(false)}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              </motion.div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-6 right-6 z-50 p-2 rounded-full bg-gray-800/80 text-white sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Page content */}
        <motion.main
          className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          key={activeTab}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {tabs[activeTab]}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
