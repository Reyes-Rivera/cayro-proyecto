"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import { AlertHelper } from "@/utils/alert.util";

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isMobile?: boolean;
  onClose?: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
};

// Animation variants fuera del componente para evitar recreación
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

const dropdownVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.15 },
  },
};

// Nav items como constante para mejor performance
const NAV_ITEMS = [
  { id: "panel", label: "Dashboard", icon: Home },
  { id: "company", label: "Empresa", icon: Building },
  { id: "legal", label: "Legal", icon: FileText },
  { id: "employees", label: "Empleados", icon: UserCheck },
] as const;

const FAQ_SUB_ITEMS = [
  { id: "faq", label: "Preguntas Frecuentes", icon: HelpCircle },
  { id: "faqCategories", label: "Categorías FAQ", icon: Layers },
] as const;

const USER_SETTINGS_ITEMS = [
  { id: "users", label: "Perfil", icon: UserRound },
  { id: "address", label: "Dirección", icon: Home },
  { id: "security", label: "Seguridad", icon: ShieldCheck },
] as const;

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

  // Memoizar la inicial del usuario
  const userInitial = useMemo(() => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "A";
  }, [user?.name]);

  // Memoizar el nombre del usuario
  const userName = useMemo(() => {
    return user?.name || "Administrador";
  }, [user?.name]);

  // Manejo de cambio de pestaña optimizado
  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);

      // Hacer scroll hasta arriba cuando se cambia de pestaña
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Cerrar dropdowns cuando se seleccionan ciertas pestañas
      if (["users", "address", "security"].includes(tab)) {
        setShowUserSettings(false);
      }

      if (isMobile && onClose) {
        onClose();
      }
    },
    [setActiveTab, isMobile, onClose]
  );

  // Toggle FAQ dropdown
  const toggleFaq = useCallback(() => {
    setShowFaq((prev) => !prev);
  }, []);

  // Toggle User Settings dropdown
  const toggleUserSettings = useCallback(() => {
    setShowUserSettings((prev) => !prev);
  }, []);

  // Cerrar User Settings
  const closeUserSettings = useCallback(() => {
    setShowUserSettings(false);
  }, []);

  // Handle sign out con useCallback
  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);

    try {
      // Pequeño delay para mostrar la animación
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Ejecutar signOut para limpiar el estado de autenticación
      if (signOut) {
        await signOut();
      }

      // Redirigir al login
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
      setIsSigningOut(false);
    }
  }, [signOut, navigate]);

  // Cargar información de la compañía
  useEffect(() => {
    const getCompanyInfo = async () => {
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

    getCompanyInfo();
  }, []);

  // Componente de ítem de navegación reutilizable
  const NavItem = useCallback(
    ({
      label,
      icon: Icon,
      onClick,
      isActive = false,
      isSubItem = false,
      hasDropdown = false,
      isDropdownOpen = false,
      onDropdownToggle,
    }: {
      id: string;
      label: string;
      icon: React.ComponentType<any>;
      onClick?: () => void;
      isActive?: boolean;
      isSubItem?: boolean;
      hasDropdown?: boolean;
      isDropdownOpen?: boolean;
      onDropdownToggle?: () => void;
    }) => {
      const baseClasses = `w-full flex items-center ${
        isSubItem ? "px-3 py-2 text-sm" : "px-3 py-2.5 text-sm"
      } relative rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800`;

      const activeClasses = isActive
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50";

      const iconClasses = isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-500 dark:text-gray-400";

      return (
        <motion.button
          variants={itemVariants}
          onClick={hasDropdown ? onDropdownToggle : onClick}
          className={`${baseClasses} ${activeClasses}`}
          aria-current={isActive ? "page" : undefined}
          aria-expanded={hasDropdown ? isDropdownOpen : undefined}
          aria-haspopup={hasDropdown ? "true" : undefined}
        >
          <Icon
            className={`${
              isSubItem ? "w-4 h-4" : "w-5 h-5"
            } mr-3 ${iconClasses}`}
            aria-hidden="true"
          />
          <span className="flex-1 text-left">{label}</span>
          {hasDropdown && (
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? "transform rotate-180" : ""
              } ${iconClasses}`}
              aria-hidden="true"
            />
          )}
        </motion.button>
      );
    },
    []
  );

  return (
    <div
      className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col rounded-xl overflow-hidden shadow-md"
      role="navigation"
      aria-label="Panel de administración"
    >
      {/* Header with logo */}
      <div className="relative">
        <div className="px-4 sm:px-6 py-4 sm:py-5 rounded-b-[2rem] bg-gradient-to-br from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center h-12 sm:h-16 overflow-hidden w-full">
              <div className="flex-shrink-0 transition-transform duration-300 relative group h-full flex items-center justify-center">
                <div className="relative p-1 sm:p-2 rounded-lg flex items-center justify-center">
                  <img
                    src={logo || "/placeholder.svg?height=80&width=120"}
                    alt="Logo de la empresa"
                    className="h-24 w-24 sm:h-36 sm:w-36 object-cover transition-all duration-300 relative max-w-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-3 left-0 right-0 flex justify-center">
          <div
            className="bg-white dark:bg-gray-700 px-3 py-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center"
            aria-label="Tipo de panel"
          >
            <LayoutDashboard
              className="w-3.5 h-3.5 text-blue-500 mr-1.5"
              aria-hidden="true"
            />
            <span className="text-xs font-medium">Panel de Administración</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 sm:py-5 px-3 scrollbar-hide mt-2">
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-1"
          aria-label="Navegación principal"
        >
          {/* Dashboard */}
          <NavItem
            id="panel"
            label="Dashboard"
            icon={Home}
            onClick={() => handleTabChange("panel")}
            isActive={activeTab === "panel"}
          />

          {/* FAQ Management */}
          <motion.div variants={itemVariants}>
            <NavItem
              id="faq-section"
              label="FAQ"
              icon={HelpCircle}
              isActive={["faq", "faqCategories"].includes(activeTab)}
              hasDropdown={true}
              isDropdownOpen={showFaq}
              onDropdownToggle={toggleFaq}
            />

            <AnimatePresence>
              {showFaq && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-1 ml-6 sm:ml-8 space-y-1"
                  role="region"
                  aria-label="Submenú FAQ"
                >
                  {FAQ_SUB_ITEMS.map((item) => (
                    <NavItem
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      icon={item.icon}
                      onClick={() => handleTabChange(item.id)}
                      isActive={activeTab === item.id}
                      isSubItem={true}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation Items restantes */}
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              onClick={() => handleTabChange(item.id)}
              isActive={activeTab === item.id}
            />
          ))}
        </motion.nav>
      </div>

      {/* User and Theme Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50">
        {/* User Info and Theme Toggle */}
        <div className="flex items-center mb-3">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium shadow-md"
            aria-label={`Avatar de ${userName}`}
            role="img"
          >
            {userInitial}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p
                className="text-sm font-medium text-gray-900 dark:text-white truncate"
                title={userName}
              >
                {userName}
              </p>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex-shrink-0 p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800"
                aria-label={
                  isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
                }
              >
                {isDarkMode ? (
                  <Sun
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    aria-hidden="true"
                  />
                ) : (
                  <Moon
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Administrador
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={toggleUserSettings}
            className="flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800"
            aria-expanded={showUserSettings}
            aria-haspopup="true"
          >
            <Users
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
              aria-hidden="true"
            />
            <span className="truncate">Ajustes</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 ${
              isSigningOut
                ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            }`}
            aria-label={isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
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
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
                >
                  <LogOut
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    aria-hidden="true"
                  />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-medium truncate"
                >
                  Saliendo...
                </motion.span>
              </>
            ) : (
              <>
                <LogOut
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
                  aria-hidden="true"
                />
                <span className="truncate">Salir</span>
              </>
            )}
          </button>
        </div>

        {/* User Settings Dropdown */}
        <AnimatePresence>
          {showUserSettings && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-3 space-y-1 border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 shadow-sm"
              role="menu"
              aria-label="Ajustes de usuario"
            >
              <div className="flex justify-between items-center mb-2 px-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Ajustes de usuario
                </span>
                <button
                  onClick={closeUserSettings}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  aria-label="Cerrar ajustes de usuario"
                >
                  <ChevronDown
                    className="w-3.5 h-3.5 transform rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </div>

              {USER_SETTINGS_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  onClick={() => handleTabChange(item.id)}
                  isActive={activeTab === item.id}
                  isSubItem={true}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
