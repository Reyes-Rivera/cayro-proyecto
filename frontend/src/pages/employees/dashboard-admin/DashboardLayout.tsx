"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Tag,
  ChevronRight,
  X,
  LogOut,
  Menu,
  Calendar,
  Users,
  FileText,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContextType";
import FaqCategoryPage from "./faqs/FaqCategoryPage";
import FaqPage from "./faqs/FaqPage";
import userImage from "@/assets/rb_859.png";
import { CompanyView } from "./Company-view";
import EmployeePage from "./employees/EmployeePage";
import { LegalSection } from "./legal/LegalSection";
import { ProfileView } from "../components/Profile-views";

type TabKey =
  | "faq"
  | "faqCategories"
  | "users"
  | "company"
  | "legal"
  | "employees";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("faq");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFaqs, setShowFaqs] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { signOut, user } = useAuth();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formattedTime = currentTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Definir las opciones del menú
  const menuOptions = [
    { key: "users", label: "Usuarios", icon: <Users className="w-5 h-5" /> },
    { key: "company", label: "Empresa", icon: <Home className="w-5 h-5" /> },
    { key: "legal", label: "Legal", icon: <FileText className="w-5 h-5" /> },
    {
      key: "employees",
      label: "Empleados",
      icon: <Users className="w-5 h-5" />,
    },
  ];



  const tabs: Record<TabKey, JSX.Element> = {
    faq: <FaqPage />,
    faqCategories: <FaqCategoryPage />,
    company: <CompanyView />,
    users: <ProfileView  />,
    legal: <LegalSection  />,
    employees: <EmployeePage  />,
  };

  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="flex mt-14 flex-col sm:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden sm:block bg-white dark:bg-gray-800 shadow-xl ${
          isSidebarExpanded ? "w-64" : "w-20"
        } h-screen sticky top-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out z-30`}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* User profile */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center ${
                isSidebarExpanded ? "gap-4 justify-start" : "justify-center"
              } p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 shadow-lg">
                  <img
                    src={userImage || "/placeholder.svg?height=80&width=80"}
                    alt="Imagen del usuario"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"></span>
              </div>
              {isSidebarExpanded && (
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {user?.name || "Usuario"}
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                    Admin
                  </span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Date and time display */}
          <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
            <div
              className={`flex items-center ${
                isSidebarExpanded ? "gap-2 justify-start" : "justify-center"
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {isSidebarExpanded && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="font-medium">{formattedTime}</div>
                  <div className="capitalize">{formattedDate}</div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {/* FAQ button with dropdown */}
              <motion.li
                custom={0}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFaqs(!showFaqs)}
                  className={`flex items-center ${
                    isSidebarExpanded ? "justify-between" : "justify-center"
                  } w-full p-3 rounded-lg transition-all duration-200 ${
                    ["faq", "faqCategories"].includes(activeTab)
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5" />
                    {isSidebarExpanded && (
                      <span className="font-medium">Preguntas Frecuentes</span>
                    )}
                  </div>
                  {isSidebarExpanded && (
                    <motion.div
                      animate={{ rotate: showFaqs ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.li>

              {/* FAQ submenu */}
              <AnimatePresence>
                {showFaqs && isSidebarExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-1 mt-1"
                  >
                    {[
                      {
                        key: "faq",
                        icon: <MessageSquare className="w-4 h-4" />,
                        label: "Preguntas",
                      },
                      {
                        key: "faqCategories",
                        icon: <Tag className="w-4 h-4" />,
                        label: "Categorías",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab(item.key as TabKey)}
                          className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200 ${
                            activeTab === item.key
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Other menu items */}
              {menuOptions.map((option, index) => (
                <motion.li
                  key={option.key}
                  custom={index + 1}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(option.key as TabKey)}
                    className={`flex items-center ${
                      isSidebarExpanded
                        ? "gap-3 justify-start"
                        : "justify-center"
                    } w-full p-3 rounded-lg transition-all duration-200 ${
                      activeTab === option.key
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {option.icon}
                    {isSidebarExpanded && (
                      <span className="font-medium">{option.label}</span>
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signOut?.()}
              className={`flex items-center ${
                isSidebarExpanded ? "gap-3 justify-start" : "justify-center"
              } w-full p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200`}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarExpanded && (
                <span className="font-medium">Cerrar sesión</span>
              )}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile header - fixed */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-md z-40 sm:hidden flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Panel de Administración
          </h1>
        </div>
      </div>

      {/* Mobile menu button - fixed to bottom right */}
      <div className="fixed bottom-4 right-4 z-40 sm:hidden">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="h-12 w-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </motion.button>
      </div>

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
              className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-2xl w-72 z-50 sm:hidden overflow-y-auto"
            >
              {/* User profile */}
              <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setActiveTab("users");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="relative">
                    <img
                      src={userImage || "/placeholder.svg?height=60&width=60"}
                      alt="Imagen del usuario"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 shadow-md"
                    />
                    <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800"></span>
                  </div>
                  <div>
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-100 block">
                      {user?.name || "Usuario"}
                    </span>
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                      Admin
                    </span>
                  </div>
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Date and time display for mobile */}
              <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">{formattedTime}</div>
                    <div className="capitalize">{formattedDate}</div>
                  </div>
                </div>
              </div>

              {/* Mobile navigation */}
              <nav className="p-4 overflow-y-auto">
                <ul className="space-y-2">
                  {/* FAQ section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-1 border-l-2 border-blue-200 dark:border-blue-800 pl-2 ml-2"
                  >
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                      Preguntas Frecuentes
                    </h3>

                    {[
                      {
                        key: "faq",
                        icon: <MessageSquare className="w-5 h-5" />,
                        label: "Preguntas",
                      },
                      {
                        key: "faqCategories",
                        icon: <Tag className="w-5 h-5" />,
                        label: "Categorías",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <motion.button
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveTab(item.key as TabKey);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Other menu items */}
                  {menuOptions.map((option, index) => (
                    <motion.li
                      key={option.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveTab(option.key as TabKey);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                      >
                        {option.icon}
                        <span className="font-medium">{option.label}</span>
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Logout in mobile */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    signOut?.();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar sesión</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.main
        className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16 sm:pt-0"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        key={activeTab}
      >
        <div className="min-h-screen p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabs[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
