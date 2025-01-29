import { useState } from "react";
import { Home, Users, Package, FileText, LogOut, Menu } from "lucide-react";
import { ProfileView } from "./profile/Profile-views";
import LegalDocumentsView from "./legal/LegalDocumentsView";
import { CompanyView } from "./Company-view";
import { useAuth } from "@/context/AuthContextType";

type TabKey = "company" | "users" | "products" | "legal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {signOut} = useAuth();
  const tabs: Record<TabKey, JSX.Element> = {
    company: <CompanyView />,
    users: <ProfileView />,
    products: (
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">
          Product Management
        </h2>
        <p className="text-gray-600 mt-4">
          Add, edit, or remove products from the catalog.
        </p>
      </div>
    ),
    legal: <LegalDocumentsView />,
  };

  const menuOptions = [
    { key: "users", label: "Users", icon: <Users /> },
    { key: "company", label: "Empresa", icon: <Home /> },
    { key: "products", label: "Products", icon: <Package /> },
    { key: "legal", label: "Legal", icon: <FileText /> },
    { key: "logout", label: "Salir", icon: <LogOut /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 mt-14">
      {/* Sidebar para pantallas grandes */}
      <aside
        className={`hidden sm:block bg-white dark:bg-gray-800 shadow-lg ${
          isSidebarExpanded ? "w-64" : "w-16"
        } transition-all duration-300`}
        onMouseEnter={() => setIsSidebarExpanded(true)} // Expande el sidebar al pasar el mouse
        onMouseLeave={() => setIsSidebarExpanded(false)} // Colapsa el sidebar al salir el mouse
      >
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-center">
          <Menu className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            {menuOptions.map((option) => (
              <li key={option.key}>
                <button
                  onClick={() => {
                    setActiveTab(option.key as TabKey);
                    if(option.key === "logout") {
                      signOut();
                    }
                  }}
                  className={`flex items-center gap-4 w-full p-2 rounded ${
                    activeTab === option.key
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                      : "hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                  }`}
                >
                  {option.icon}
                  {isSidebarExpanded && <span>{option.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Botón en forma de semicírculo para pantallas menores a sm */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-15 left-0 h-12 w-12 bg-blue-600 dark:bg-blue-500 text-white rounded-r-full flex items-center justify-center shadow-md z-50 sm:hidden"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Menú flotante con el diseño del sidebar para pantallas pequeñas */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg w-64 z-50 transition-transform duration-300">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-300">
              Menu
            </h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-700 rounded"
            >
              ✕
            </button>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2 p-4">
              {menuOptions.map((option) => (
                <li key={option.key}>
                  <button
                    onClick={() => {
                      if (option.key === "logout") {
                        console.log("Logout clicked");
                      } else {
                        setActiveTab(option.key as TabKey);
                      }
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 w-full p-2 rounded ${
                      activeTab === option.key
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                        : "hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div>{tabs[activeTab]}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
