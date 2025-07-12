"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  LogOut,
  Home,
  ChevronDown,
  HelpCircle,
  FileText,
  Building,
  UserCheck,
  UserRound,
  Moon,
  Sun,
  ShieldCheck,
  LayoutDashboard,
  Layers,
} from "lucide-react";
import { useAuth } from "@/context/AuthContextType";
import { getCompanyInfoApi } from "@/api/company";
import { motion } from "framer-motion";
import { AlertHelper } from "@/utils/alert.util";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isMobile?: boolean;
  onClose?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
};

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isMobile = false,
  onClose,
  isDarkMode = false,
  toggleTheme,
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showFaq, setShowFaq] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [logo, setLogo] = useState<string>("");
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Get first letter of user name for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "A";
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Hacer scroll hasta arriba cuando se cambia de pestaña
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Close user settings dropdown when selecting profile, address, or security
    if (tab === "users" || tab === "address" || tab === "security") {
      setShowUserSettings(false);
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Handle sign out with animation and redirect to login
  const handleSignOut = async () => {
    setIsSigningOut(true);
    // Pequeño delay para mostrar la animación
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Ejecutar signOut para limpiar el estado de autenticación
    if (signOut) {
      await signOut();
    }
    // Redirigir al login
    navigate("/login");
  };

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await getCompanyInfoApi();
        if (res.data && res.data.length > 0) {
          setLogo(res.data[0].logoUrl);
        }
      } catch (error) {
        AlertHelper.error({
          title: "Error",
          error,
          message: "No se pudo obtener la información de la empresa.",
          animation: "fadeIn",
        });
      }
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
      {/* Header with logo and close button for mobile */}
      <div className="relative">
        <div className="px-6 py-5 rounded-b-[2rem] bg-gradient-to-br from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center h-16 overflow-hidden w-full">
              <div className="flex-shrink-0 transition-transform duration-300 relative group h-full flex items-center justify-center">
                <div className="relative p-2 rounded-lg flex items-center justify-center">
                  <img
                    src={logo || "/placeholder.svg?height=80&width=120"}
                    alt="Logo"
                    className="h-36 w-36 object-cover transition-all duration-300 relative max-w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
          <div className="bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
            <span className="text-xs font-medium">Panel de Administración</span>
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

          {/* FAQ Management */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setShowFaq(!showFaq)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
                ["faq", "faqCategories"].includes(activeTab)
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
            >
              <div className="flex items-center">
                <HelpCircle
                  className={`w-5 h-5 mr-3 ${
                    ["faq", "faqCategories"].includes(activeTab)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                FAQ
              </div>
              <ChevronDown
                className={`w-4 h-4 ${
                  ["faq", "faqCategories"].includes(activeTab)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                } transition-transform duration-200 ${
                  showFaq ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {showFaq && (
              <div className="mt-1 ml-8 space-y-1">
                <button
                  onClick={() => handleTabChange("faq")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "faq"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <HelpCircle
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "faq"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Preguntas Frecuentes
                </button>
                <button
                  onClick={() => handleTabChange("faqCategories")}
                  className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                    activeTab === "faqCategories"
                      ? "bg-blue-50/80 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Layers
                    className={`w-4 h-4 mr-3 ${
                      activeTab === "faqCategories"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Categorías FAQ
                </button>
              </div>
            )}
          </motion.div>

          {/* Company */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleTabChange("company")}
            className={`w-full flex items-center px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
              activeTab === "company"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
          >
            <Building
              className={`w-5 h-5 mr-3 ${
                activeTab === "company"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            Empresa
          </motion.button>

          {/* Legal */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleTabChange("legal")}
            className={`w-full flex items-center px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
              activeTab === "legal"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
          >
            <FileText
              className={`w-5 h-5 mr-3 ${
                activeTab === "legal"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            Legal
          </motion.button>

          {/* Employees */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleTabChange("employees")}
            className={`w-full flex items-center px-3 py-2.5 text-sm relative rounded-lg transition-colors ${
              activeTab === "employees"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            }`}
          >
            <UserCheck
              className={`w-5 h-5 mr-3 ${
                activeTab === "employees"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            Empleados
          </motion.button>
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
                {user?.name || "Administrador"}
              </p>
              {/* Theme toggle icon */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 transition-colors duration-300"
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
              Administrador
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setShowUserSettings(!showUserSettings)}
            className="flex items-center justify-center px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-300"
          >
            <Users className="w-4 h-4 mr-2" />
            Ajustes
          </button>
          {/* Botón de Salir con animación y redirección al login */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg border transition-all duration-300 ${
              isSigningOut
                ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            }`}
          >
            {isSigningOut ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-4 h-4 mr-2"
                >
                  <LogOut className="w-4 h-4" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-medium"
                >
                  Saliendo...
                </motion.span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </>
            )}
          </button>
        </div>
        {showUserSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 space-y-1 border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Ajustes de usuario
              </span>
              <button
                onClick={() => setShowUserSettings(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <ChevronDown className="w-4 h-4 transform rotate-180" />
              </button>
            </div>
            <button
              onClick={() => handleTabChange("users")}
              className={`w-full flex items-center px-3 py-2 text-sm relative rounded-lg transition-colors ${
                activeTab === "users"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <UserRound
                className={`w-4 h-4 mr-3 ${
                  activeTab === "users"
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
