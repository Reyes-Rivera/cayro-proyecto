import { useState } from "react";
import { Home, Users, FileText, LogOut, Menu } from "lucide-react";
import { ProfileView } from "./profile/Profile-views";
import LegalDocumentsView from "./legal/LegalDocumentsView";
import { CompanyView } from "./Company-view";
import { useAuth } from "@/context/AuthContextType";
import userImage from "@/assets/rb_859.png";

type TabKey = "company" | "users" | "legal" | "employees";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut, user } = useAuth(); 
  const tabs: Record<TabKey, JSX.Element> = {
    company: <CompanyView />,
    users: <ProfileView />,
    legal: <LegalDocumentsView />,
    employees: (
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Empleados</h2>
        <p className="text-gray-600 mt-4">
          Gestiona la información de los empleados de la empresa.
        </p>
      </div>
    ),
  };

  // Definir las opciones del menú
  const menuOptions = [
    { key: "users", label: "Users", icon: <Users /> },
    { key: "company", label: "Empresa", icon: <Home /> },
    { key: "legal", label: "Legal", icon: <FileText /> },
    { key: "employees", label: "Empleados", icon: <Users /> }, // Nueva opción de Empleados
    { key: "logout", label: "Salir", icon: <LogOut /> },
  ];

  return (
    <div className="flex min-h-screen dark:bg-gray-900 mt-14">
      {/* Sidebar para pantallas grandes */}
      <aside className="hidden sm:block dark:bg-gray-800 shadow-lg w-64 transition-all duration-300 border-gray-200 dark:border-gray-700 border-r">
        {/* Perfil del usuario con etiqueta de "Admin" */}
        <div className="p-4 border-b dark:border-gray-700">
          <button
            onClick={() => setActiveTab("users")}
            className="w-full flex flex-col items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <img
              src={userImage} // Imagen del usuario
              alt="Imagen del usuario"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {user?.name || "Nombre del usuario"}
            </span>
            <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Admin
            </span>
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            {menuOptions.map((option) => (
              <li key={option.key}>
                <button
                  onClick={() => {
                    setActiveTab(option.key as TabKey);
                    if (option.key === "logout") {
                      signOut();
                    }
                  }}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl ${
                    activeTab === option.key
                      ? "bg-blue-600 text-white"
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
        <div className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg w-64 z-50 transition-transform duration-300 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-300">
              Menú
            </h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-700 rounded"
            >
              ✕
            </button>
          </div>
          {/* Perfil del usuario en móvil */}
          <div className="p-4 border-b dark:border-gray-700">
            <button
              onClick={() => {
                setActiveTab("users");
                setIsMenuOpen(false);
              }}
              className="w-full flex flex-col items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <img
                src={userImage} // Imagen del usuario
                alt="Imagen del usuario"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
              />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {user?.name || "Nombre del usuario"}
              </span>
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Admin
              </span>
            </button>
          </div>
          <nav className="flex-1">
            <ul className="space-y-2 p-4">
              {menuOptions.map((option) => (
                <li key={option.key}>
                  <button
                    onClick={() => {
                      if (option.key === "logout") {
                        signOut();
                      } else {
                        setActiveTab(option.key as TabKey);
                      }
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-4 w-full p-2 rounded-r-2xl ${
                      activeTab === option.key
                        ? "bg-blue-600 text-white"
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