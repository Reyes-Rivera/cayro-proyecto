"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, Shield, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProfileSection } from "../dashboard-employee/profile/ProfileSection";
import { AddressSection } from "./AddressSection";
import { PasswordSection } from "./PasswordSection";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("profile");

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configuración de Cuenta
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra tu perfil y preferencias de cuenta
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar navigation */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col">
                {[
                  {
                    id: "profile",
                    label: "Información Personal",
                    icon: User,
                  },
                  {
                    id: "address",
                    label: "Dirección",
                    icon: MapPin,
                  },
                  {
                    id: "password",
                    label: "Seguridad",
                    icon: Shield,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3.5 text-left transition-colors",
                      activeTab === item.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    )}
                  >
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center mr-3",
                          activeTab === item.id
                            ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5",
                        activeTab === item.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-600"
                      )}
                    />
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Card className="border-gray-200 dark:border-gray-700 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {activeTab === "profile" && <ProfileSection />}
                  {activeTab === "address" && <AddressSection />}
                  {activeTab === "password" && <PasswordSection />}
                </motion.div>
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
