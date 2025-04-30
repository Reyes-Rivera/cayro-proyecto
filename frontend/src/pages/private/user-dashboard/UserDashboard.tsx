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
  Sparkles,
  Award,
  Shield,
  Clock,
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

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExiting, setIsExiting] = useState(false);
  const { user, signOut } = useAuth();

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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 md:px-8 lg:px-12 overflow-x-hidden">
      

      <div className="container">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block w-full lg:w-80 xl:w-96 shrink-0"
          >
            <div className="">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* User profile summary */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user?.name} {user?.surname}
                      </h3>
                    
                    </div>
                  </div>
                </div>

                {/* Date and time */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                  <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="capitalize">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
                    Menú Principal
                  </h4>
                  <nav className="space-y-1.5">
                    {navItems.map((item) => (
                      <motion.button
                        key={item.key}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.key as TabKey)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeTab === item.key
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <span
                          className={`${
                            activeTab === item.key
                              ? "text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {activeTab === item.key && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                          ></motion.div>
                        )}
                      </motion.button>
                    ))}
                  </nav>
                </div>

                {/* Activity info */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Cliente
                      </p>
                    </div>
                  
                  </div>
                </div>

                {/* Logout button */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
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
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                  onClick={() => setIsMenuOpen(false)}
                ></motion.div>

                {/* Sidebar */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-2xl w-72 z-50 lg:hidden overflow-y-auto rounded-r-2xl"
                >
                 
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                            {user?.name?.charAt(0) || "U"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {user?.name} {user?.surname}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">
                            Cliente
                          </span>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date and time display for mobile */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
                    <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="capitalize">{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{formattedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile navigation */}
                  <div className="p-4">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
                      Menú Principal
                    </h4>
                    <nav className="space-y-1">
                      {navItems.map((item, index) => (
                        <motion.button
                          key={item.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveTab(item.key as TabKey);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            activeTab === item.key
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          <span
                            className={`${
                              activeTab === item.key
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                          {activeTab === item.key && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                            ></motion.div>
                          )}
                        </motion.button>
                      ))}
                    </nav>
                  </div>

                

                  {/* Logout in mobile */}
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200"
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
          <div className="w-full top-8">
            <AnimatePresence mode="wait">
              {!isExiting ? (
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  key={activeTab}
                >
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
                    className="text-xl font-medium"
                  >
                    Cerrando sesión...
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="fixed bottom-6 right-6 lg:hidden z-30">
        <div className="flex flex-col items-end">
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;
