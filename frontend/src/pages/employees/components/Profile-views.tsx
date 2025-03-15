"use client";

import { useState } from "react";
import { ProfileSection } from "../employee/profile/ProfileSection";
import { AddressSection } from "./AddressSection";
import { PasswordSection } from "./PasswordSection";
import { MapPin, User, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("profile");

  // Definición de las pestañas con sus propiedades
  const tabs = [
    {
      id: "profile",
      label: "Perfil",
      icon: <User size={16} className="sm:w-5 sm:h-5" />,
      description: "Información personal",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 text-blue-600 border-blue-200",
      darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
    {
      id: "address",
      label: "Dirección",
      icon: <MapPin size={16} className="sm:w-5 sm:h-5" />,
      description: "Datos de ubicación",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 text-blue-600 border-blue-200",
      darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
    {
      id: "password",
      label: "Seguridad",
      icon: <Shield size={16} className="sm:w-5 sm:h-5" />,
      description: "Contraseña y acceso",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 text-blue-600 border-blue-200",
      darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
  ];

  // Variantes para animaciones
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Contenedor principal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Navegación por pestañas */}
        <div className="flex flex-wrap sm:flex-nowrap border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 rounded-t-xl overflow-x-auto w-full">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 sm:gap-2 md:gap-3 px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-5 font-medium transition-all relative flex-1 justify-center sm:justify-start ${
                activeTab === tab.id
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div
                className={`p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {tab.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs sm:text-sm md:text-base font-semibold">
                  {tab.label}
                </span>
                <span className="text-[10px] sm:text-xs hidden sm:block text-gray-500 dark:text-gray-400">
                  {tab.description}
                </span>
              </div>

              {/* Indicador de pestaña activa */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Contenido de la pestaña activa */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "address" && <AddressSection />}
            {activeTab === "password" && <PasswordSection />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
