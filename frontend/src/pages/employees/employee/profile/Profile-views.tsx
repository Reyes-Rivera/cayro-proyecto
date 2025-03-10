"use client";

import { useState } from "react";
import { ProfileSection } from "./ProfileSection";
import { AddressSection } from "./AddressSection";
import { PasswordSection } from "./PasswordSection";
import { Key, MapPin, User, User2Icon } from "lucide-react";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("profile");

  // Definición de las pestañas con sus propiedades
  const tabs = [
    {
      id: "profile",
      label: "Perfil",
      icon: <User size={20} />,
      description: "Información personal",
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600 border-blue-200",
      darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
    {
      id: "address",
      label: "Dirección",
      icon: <MapPin size={20} />,
      description: "Datos de ubicación",
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600 border-blue-200",
      darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
    {
      id: "password",
      label: "Seguridad",
      icon: <Key size={20} />,
      description: "Contraseña y acceso",
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600 border-blue-200",
      darkColor: "dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Contenedor principal */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-8">
        <div className=" p-6 ">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <User2Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestiona tu perfil.</h1>
              <p className="text-gray-600">
                Administra perfil de usuario.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Navegación por pestañas */}
        <div className="flex border-b border-gray-200 dark:border-gray-700  dark:bg-gray-800/50 rounded-t-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                activeTab === tab.id
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white`
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {tab.icon}
              </div>
              <span>{tab.label}</span>

              {/* Indicador de pestaña activa */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="p-6">
          <div className="min-h-[400px]">
            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "address" && <AddressSection />}
            {activeTab === "password" && <PasswordSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
