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
  X,
  Menu,
  Sparkles,
  Award,
  ChevronRight,
  Shield,
  UserCircle,
} from "lucide-react";
import img from "./profile/assets/rb_859.png";
import ProfileView from "../dashboard/profile/components/ProfileView";
import SecurityView from "../dashboard/profile/components/SecurityView";
import AddressView from "./profile/components/AddressView";
import OrderHistoryView from "./profile/components/OrderHistoryView";
import PaymentMethodsView from "./profile/components/PaymentMethodsView";
import NotificationsView from "./profile/components/NotificationsView";
import { useAuth } from "@/context/AuthContextType";
import type { JSX } from "react/jsx-runtime";

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
    <div className="min-h-screen bg-white dark:bg-gray-900 md:mt-24">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Desktop Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block md:w-1/4 lg:w-1/5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700"
        >
          <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar p-6">
            {/* User info */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                    <img
                      src={img || "/placeholder.svg?height=64&width=64"}
                      alt="Avatar del usuario"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {user?.name} {user?.surname}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      Premium
                    </span>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Date and time display */}
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fecha actual
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hora
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formattedTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 mb-8">
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4">
                MENÚ PRINCIPAL
              </h4>
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.key}
                    custom={index}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(item.key as TabKey)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.key
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                          className="ml-auto w-2 h-2 rounded-full bg-white"
                        ></motion.div>
                      )}
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Activity info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Miembro desde 2023
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cliente Premium
                  </p>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
        </motion.div>

        {/* Mobile header - fixed */}
        <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-md z-40 md:hidden flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg shadow-md">
              <UserCircle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Mi Cuenta
              </h1>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3 mx-1" />
                <span className="text-blue-600 dark:text-blue-400">
                  {activeTab === "profile" && "Mi Perfil"}
                  {activeTab === "security" && "Seguridad"}
                  {activeTab === "orders" && "Mis Pedidos"}
                  {activeTab === "addresses" && "Mis Direcciones"}
                  {activeTab === "payment" && "Métodos de Pago"}
                  {activeTab === "notifications" && "Notificaciones"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Menu className="w-6 h-6" />
          </button>
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMenuOpen(false)}
              ></motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-2xl w-72 z-50 md:hidden overflow-y-auto rounded-r-2xl"
              >
                {/* User profile */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                          <img
                            src={img || "/placeholder.svg?height=48&width=48"}
                            alt="Imagen del usuario"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-base font-semibold text-gray-900 dark:text-gray-100 block">
                          {user?.name}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                            Premium
                          </span>
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                        </div>
                      </div>
                    </div>
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
                  <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-3 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formattedTime}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 capitalize">
                        {formattedDate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile navigation */}
                <nav className="p-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                    MENÚ PRINCIPAL
                  </h4>
                  <ul className="space-y-1">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                      >
                        <motion.button
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveTab(item.key as TabKey);
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
                            activeTab === item.key
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-md"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span
                            className={
                              activeTab === item.key
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                          {activeTab === item.key && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto w-2 h-2 rounded-full bg-white"
                            ></motion.div>
                          )}
                        </motion.button>
                      </motion.div>
                    ))}
                  </ul>
                </nav>

                {/* Activity info */}
                <div className="mx-4 my-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      Miembro desde 2023
                    </p>
                  </div>
                </div>

                {/* Logout in mobile */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
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
        <AnimatePresence mode="wait">
          {!isExiting ? (
            <motion.main
              className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 pt-20 md:pt-0 px-4 md:px-8 py-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
              key={activeTab}
            >
              <div className="max-w-6xl mx-auto">
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
          ) : (
            <motion.div
              className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100"
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

        {/* Botón flotante para abrir menú en móvil */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Add missing Clock component
const Clock = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

export default UserDashboard;
