"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { getCompanyInfoApi } from "@/api/company";
import AdminSidebar from "./components/SideBarAdmin";
import FaqCategoryPage from "./faqs/FaqCategoryPage";
import FaqPage from "./faqs/FaqPage";
import { CompanyView } from "./Company-view";
import EmployeePage from "./employees/EmployeePage";
import { LegalSection } from "./legal/LegalSection";
import type { JSX } from "react";
import { ProfileSection } from "../components/ProfileSection";
import { AddressSection } from "../components/AddressSection";
import { PasswordSection } from "../components/PasswordSection";
import AdminPanel from "./panel/AdminPanel";

type TabKey =
  | "panel"
  | "faq"
  | "faqCategories"
  | "users"
  | "company"
  | "legal"
  | "employees"
  | "address"
  | "security";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logo, setLogo] = useState<string>("");
  const headerRef = useRef<HTMLDivElement>(null);

  // Función para manejar el cambio de pestaña y hacer scroll hasta arriba
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check for dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await getCompanyInfoApi();
        if (res.data && res.data.length > 0) {
          setLogo(res.data[0].logoUrl);
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };
    getInfo();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const newTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setIsDarkMode(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Componentes para cada pestaña
  const tabs: Record<TabKey, JSX.Element> = {
    panel: <AdminPanel />,
    users: <ProfileSection />,
    faq: <FaqPage />,
    faqCategories: <FaqCategoryPage />,
    company: <CompanyView />,
    legal: <LegalSection />,
    employees: <EmployeePage />,
    address: <AddressSection />,
    security: <PasswordSection />,
  };

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
     <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900  p-4">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block w-64 h-[calc(100vh-2rem)] sticky top-4 overflow-hidden z-30 rounded-xl shadow-md flex-shrink-0">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Main content */}
       <div className="flex-1 flex flex-col min-h-[calc(100vh-2rem)] bg-gray-50 dark:bg-gray-900 lg:ml-4 min-w-0 sm:px-5">
        {/* Mobile header - Always visible on mobile */}
        <div
          ref={headerRef}
          className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700"
        >
          {/* Logo on left */}
          <div className="h-10 w-auto flex items-center">
            <img
              src={logo || "/placeholder.svg?height=40&width=40"}
              alt="Logo"
              className="h-28 w-28 object-cover dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            />
          </div>

          {/* Burger menu on right */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Spacer for fixed mobile header */}
        <div className="lg:hidden h-16"></div>

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
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-0 left-0 h-full w-80 z-50 lg:hidden overflow-hidden shadow-lg"
              >
                <AdminSidebar
                  activeTab={activeTab}
                  setActiveTab={handleTabChange}
                  isMobile={true}
                  onClose={() => setIsMenuOpen(false)}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              </motion.div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-800/90 text-white shadow-lg lg:hidden hover:bg-gray-700/90 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* Page content */}
        <motion.main
          className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          key={activeTab}
        >
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
        </motion.main>
      </div>
    </div>
  );
};

export default AdminDashboard;
