import { useState } from "react";

import { PasswordSection } from "./PasswordSection";
import { Key, MapPin, User } from "lucide-react";
import { AddressSection } from "./AddressSection";
import { ProfileSection } from "./ProfileSection";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex flex-col items-center sm:p-8 dark:bg-gray-900 dark:text-gray-100">
      <div className="w-full max-w-7xl">
        {/* Tabs */}
        <div className="flex overflow-x-auto sm:justify-start">
          {[
            {
              id: "profile",
              label: "Perfil",
              icon: <User size={20} />,
            },
            {
              id: "address",
              label: "Dirección",
              icon: <MapPin size={20} />,
            },
            {
              id: "password",
              label: "Cambiar Contraseña",
              icon: <Key size={20} />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-8 py-4 text-sm font-medium transition-all
              ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 border-b-4 border-blue-600 dark:border-blue-300 shadow-md"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content Section */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-7xl rounded-b-2xl rounded-r-2xl shadow-md p-6 sm:p-8 space-y-6">
        {/* Render Section */}
        <div className="min-h-[300px] sm:min-h-[400px]">
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "address" && <AddressSection />}
          {activeTab === "password" && <PasswordSection />}
        </div>
      </div>
    </div>
  );
}
