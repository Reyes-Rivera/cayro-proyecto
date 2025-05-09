"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  MapPin,
  ShoppingBag,
  CreditCard,
  Bell,
  Calendar,
  Menu,
  Shield,
  Clock,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContextType";
import type { JSX } from "react/jsx-runtime";

import ProfileView from "./components/ProfileView";
import SecurityView from "./components/SecurityView";
import AddressView from "./components/AddressView";
import OrderHistoryView from "./components/OrderHistoryView";
import PaymentMethodsView from "./components/PaymentMethodsView";
import NotificationsView from "./components/NotificationsView";

type TabKey =
  | "profile"
  | "security"
  | "orders"
  | "addresses"
  | "payment"
  | "notifications";

const CombinedDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExiting, setIsExiting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  const { user, signOut } = useAuth();

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Activate animations after loading screen disappears
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  // Components for each tab
  const tabs: Record<TabKey, JSX.Element> = {
    profile: <ProfileView />,
    security: <SecurityView />,
    orders: <OrderHistoryView />,
    addresses: <AddressView />,
    payment: <PaymentMethodsView />,
    notifications: <NotificationsView />,
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const handleSignOut = () => {
    setIsExiting(true);
    setTimeout(() => {
      signOut();
    }, 300);
  };

  // Navigation items
  const navItems = [
    { key: "profile", icon: <User className="w-5 h-5" />, label: "Mi Perfil" },
    {
      key: "security",
      icon: <Shield className="w-5 h-5" />,
      label: "Seguridad",
    },
    {
      key: "orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      label: "Mis Pedidos",
    },
    {
      key: "addresses",
      icon: <MapPin className="w-5 h-5" />,
      label: "Mis Direcciones",
    },
    {
      key: "payment",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Métodos de Pago",
    },
    {
      key: "notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notificaciones",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-8 px-4 md:px-8 lg:px-12 overflow-x-hidden">
      

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Loading Screen */}
        {pageLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-blue-600 dark:text-blue-400 mt-4 font-medium">
              Cargando dashboard...
            </p>
          </div>
        )}

        {!pageLoading && (
          <>
            {/* Dashboard Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={
                animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }
              }
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mr-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                        <div className="w-full h-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-bold text-3xl">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                      >
                        <div className="bg-green-500 w-4 h-4 rounded-full"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mb-2 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        PANEL DE USUARIO
                      </span>
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight"
                    >
                      Bienvenido,{" "}
                      <span className="relative inline-block">
                        <span className="relative z-10 text-blue-600 dark:text-blue-400">
                          {user?.name || "Usuario"}
                        </span>
                        <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
                      </span>
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-blue-600 dark:text-blue-400 flex items-center mt-2"
                    >
                      <Home className="w-4 h-4 mr-1.5" />
                      <span>Panel de Usuario</span>
                      <ChevronRight className="w-4 h-4 mx-1" />
                      <span className="font-medium">
                        {navItems.find((item) => item.key === activeTab)
                          ?.label || "Mi Perfil"}
                      </span>
                    </motion.p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 px-5 rounded-xl shadow-md border border-blue-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {formattedDate}
                    </span>
                  </div>
                  <span className="text-blue-200 dark:text-blue-800">|</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {formattedTime}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar - Simplified */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={
                  animateContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block w-64 shrink-0"
              >
                <div className="sticky top-24">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-blue-100 dark:border-gray-700">
                    {/* Navigation */}
                    <div className="p-4">
                      <nav className="space-y-1">
                        {navItems.map((item, index) => (
                          <motion.button
                            key={item.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.3 + index * 0.05,
                              duration: 0.4,
                            }}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(item.key as TabKey)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                              activeTab === item.key
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                          >
                            <span
                              className={
                                activeTab === item.key
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }
                            >
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {activeTab === item.key && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                              ></motion.div>
                            )}
                          </motion.button>
                        ))}
                      </nav>
                    </div>

                    {/* Logout button */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                      <motion.button
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar sesión</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

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
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                      onClick={() => setIsMenuOpen(false)}
                    ></motion.div>

                    {/* Sidebar */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                      }}
                      className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg w-72 z-50 lg:hidden overflow-y-auto"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white font-bold text-lg">
                              {user?.name?.charAt(0) || "U"}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {user?.name || "Usuario"}
                            </h3>
                            <p className="text-blue-600 dark:text-blue-400 text-xs">
                              {user?.email || "usuario@ejemplo.com"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsMenuOpen(false)}
                          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Mobile navigation */}
                      <div className="p-4">
                        <nav className="space-y-1">
                          {navItems.map((item, index) => (
                            <motion.button
                              key={item.key}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + index * 0.05 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setActiveTab(item.key as TabKey);
                                setIsMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                activeTab === item.key
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                              }`}
                            >
                              <span
                                className={
                                  activeTab === item.key
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }
                              >
                                {item.icon}
                              </span>
                              <span>{item.label}</span>
                              {activeTab === item.key && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"
                                ></motion.div>
                              )}
                            </motion.button>
                          ))}
                        </nav>
                      </div>

                      {/* Logout in mobile */}
                      <div className="p-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            handleSignOut();
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Cerrar sesión</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Main content */}
              <div className="w-full">
                <AnimatePresence mode="wait">
                  {!isExiting ? (
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-blue-100 dark:border-gray-700 overflow-hidden"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      key={activeTab}
                    >
                      {/* Tab Header */}
                      <div className="border-b border-gray-100 dark:border-gray-700 bg-blue-600 dark:bg-blue-700">
                        <div className="p-6 text-white">
                          <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2.5 rounded-lg">
                              <span className="text-white">
                                {
                                  navItems.find(
                                    (item) => item.key === activeTab
                                  )?.icon
                                }
                              </span>
                            </div>
                            <div>
                              <h2 className="text-xl font-bold">
                                {
                                  navItems.find(
                                    (item) => item.key === activeTab
                                  )?.label
                                }
                              </h2>
                              <p className="text-blue-100 text-sm">
                                Gestiona tu información personal
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

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
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center justify-center h-[80vh]"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: 0.9 }}
                        exit={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl font-medium dark:text-white"
                      >
                        Cerrando sesión...
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="fixed bottom-6 right-6 lg:hidden z-30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(true)}
          className="bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-full shadow-xl flex items-center justify-center"
        >
          <Menu className="w-6 h-6" />
        </motion.button>
      </div>
    </main>
  );
};

export default CombinedDashboard;
