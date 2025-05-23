"use client";

import { useEffect, useState } from "react";
import {
  Package,
  LogOut,
  BarChart,
  Home,
  Tag,
  Users,
  ChevronDown,
  ChevronRight,
  PieChart,
  ShoppingBag,
  FileText,
  CreditCard,
  Layers,
  Grid,
  Palette,
  Ruler,
  UserRound,
  Shirt,
  Moon,
  Sun,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContextType";
import { getCompanyInfoApi } from "@/api/company";
import { motion } from "framer-motion";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isMobile?: boolean;
  onClose?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
};

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobile = false,
  onClose,
  isDarkMode = false,
  toggleTheme,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const [showProducts, setShowProducts] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [logo, setLogo] = useState<string>("");

  // Get first letter of user name for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Hacer scroll hasta arriba cuando se cambia de pestaña
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Close user settings dropdown when selecting profile, address, or security
    if (tab === "profile" || tab === "address" || tab === "security") {
      setShowUserSettings(false);
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfoApi();
      setLogo(res.data[0].logoUrl);
    };
    getInfo();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col rounded-xl overflow-hidden shadow-md">
      {/* Header with logo */}
      <div className="relative">
        <div className=" px-6 py-5 rounded-b-[2rem]">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center h-16 overflow-hidden w-full">
              <div className="flex-shrink-0 transition-transform duration-300 relative group h-full flex items-center justify-center">
                <div className="relative p-2 rounded-lg flex items-center justify-center bg-white/20">
                  <img
                    src={logo || "/placeholder.svg?height=80&width=120"}
                    alt="Logo"
                    className="h-40 w-auto object-contain transition-all duration-300 relative max-w-full"
                  />
                </div>
              </div>
            </div>

            {isMobile && (
              <button
                onClick={onClose}
                className="ml-2 p-1 rounded-md text-white hover:bg-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
          <div className="bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
            <span className="text-xs font-medium">Panel de Control</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3 scrollbar-hide mt-3">
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-1"
        >
          {/* Dashboard */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleTabChange("panel")}
            className={`w-full flex items-center px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
              activeTab === "panel"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
          >
            <Home
              className={`w-5 h-5 mr-3 ${
                activeTab === "panel"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            Dashboard
          </motion.button>

          {/* Products */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setShowProducts(!showProducts)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
                [
                  "products",
                  "categories",
                  "colors",
                  "sizes",
                  "gender",
                  "sleeves",
                  "brands",
                ].includes(activeTab)
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              <div className="flex items-center">
                <ShoppingBag
                  className={`w-5 h-5 mr-3 ${
                    [
                      "products",
                      "categories",
                      "colors",
                      "sizes",
                      "gender",
                      "sleeves",
                      "brands",
                    ].includes(activeTab)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                Productos
              </div>
              <ChevronDown
                className={`w-4 h-4 ${
                  [
                    "products",
                    "categories",
                    "colors",
                    "sizes",
                    "gender",
                    "sleeves",
                    "brands",
                  ].includes(activeTab)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                } transition-transform duration-200 ${
                  showProducts ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {showProducts && (
              <div className="mt-1 ml-8 space-y-1">
                <button
                  onClick={() => handleTabChange("products")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "products"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Package
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "products"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Todos los productos
                </button>
                <button
                  onClick={() => handleTabChange("categories")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "categories"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Layers
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "categories"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Categorías
                </button>
                <button
                  onClick={() => handleTabChange("colors")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "colors"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Palette
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "colors"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Colores
                </button>
                <button
                  onClick={() => handleTabChange("sizes")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "sizes"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Ruler
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "sizes"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Tallas
                </button>
                <button
                  onClick={() => handleTabChange("gender")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "gender"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <UserRound
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "gender"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Género
                </button>
                <button
                  onClick={() => handleTabChange("sleeves")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "sleeves"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Shirt
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "sleeves"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Mangas
                </button>
                <button
                  onClick={() => handleTabChange("brands")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "brands"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Tag
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "brands"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Marcas
                </button>
              </div>
            )}
          </motion.div>

          {/* Orders */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleTabChange("orders")}
            className={`w-full flex items-center px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
              activeTab === "orders"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
          >
            <Grid
              className={`w-5 h-5 mr-3 ${
                activeTab === "orders"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            Pedidos
          </motion.button>

          <motion.div variants={itemVariants} className="pt-2 pb-1">
            <div className="px-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 py-2 rounded-lg">
              Reportes
            </div>
          </motion.div>

          {/* Reports */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setShowReports(!showReports)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
                ["sales", "analytics", "finances"].includes(activeTab)
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              <div className="flex items-center">
                <FileText
                  className={`w-5 h-5 mr-3 ${
                    ["sales", "analytics", "finances"].includes(activeTab)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                Reportes
              </div>
              <ChevronDown
                className={`w-4 h-4 ${
                  ["sales", "analytics", "finances"].includes(activeTab)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                } transition-transform duration-200 ${
                  showReports ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {showReports && (
              <div className="mt-1 ml-8 space-y-1">
                <button
                  onClick={() => handleTabChange("sales")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "sales"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <BarChart
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "sales"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Ventas
                </button>
                <button
                  onClick={() => handleTabChange("analytics")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "analytics"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <PieChart
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "analytics"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Analíticas
                </button>
                <button
                  onClick={() => handleTabChange("finances")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "finances"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <CreditCard
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "finances"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Finanzas
                </button>
              </div>
            )}
          </motion.div>
        </motion.nav>
      </div>

      {/* User and Theme Toggle */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium shadow-md">
            {getUserInitial()}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "Usuario"}
              </p>
              {/* Theme toggle icon */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Empleado
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setShowUserSettings(!showUserSettings)}
            className="flex items-center justify-center px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Ajustes
          </button>
          <button
            onClick={() => signOut?.()}
            className="flex items-center justify-center px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </button>
        </div>
        {showUserSettings && (
          <div className="mt-3 space-y-1 border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Ajustes de usuario
              </span>
              <button
                onClick={() => setShowUserSettings(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ChevronDown className="w-4 h-4 transform rotate-180" />
              </button>
            </div>
            <button
              onClick={() => handleTabChange("profile")}
              className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <UserRound
                className={`w-4 h-4 mr-3 ${
                  activeTab === "profile"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
              Perfil
            </button>
            <button
              onClick={() => handleTabChange("address")}
              className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                activeTab === "address"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <Home
                className={`w-4 h-4 mr-3 ${
                  activeTab === "address"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
              Dirección
            </button>
            <button
              onClick={() => handleTabChange("security")}
              className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                activeTab === "security"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 mr-3 ${
                  activeTab === "security"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              />
              Seguridad
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
