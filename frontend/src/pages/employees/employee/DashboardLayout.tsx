import { useState } from "react";
import { Package, LogOut, Menu, BarChart, List, Home, Palette, Ruler, Shirt, Tag, X, Users } from "lucide-react";
import { ProfileView } from "./profile/Profile-views";
import { useAuth } from "@/context/AuthContextType";
import Products from "./profucts/Products";
import CategoryPage from "./profucts/category/CategoryPage";
import SizePage from "./profucts/size/SizePage";
import SleevePage from "./profucts/sleeve/SleevePage";
import GenderPage from "./profucts/gender/GenderPage";
import BrandPage from "./profucts/brand/BrandPage";
import ColorPage from "./profucts/colors/ColorPage";
import userImage from "@/assets/rb_859.png";

type TabKey =
  | "panel" // Nueva pestaña para el panel principal
  | "users"
  | "products"
  | "categories"
  | "sizes"
  | "sleeves"
  | "gender"
  | "brands"
  | "colors"
  | "sales" // Pestaña para reportes de ventas
  | "orders"; // Pestaña para reportes de pedidos

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("panel");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const { user, signOut } = useAuth();

  const tabs: Record<TabKey, JSX.Element> = {
    panel: (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Panel Principal
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Bienvenido al panel de gestión de empleados. Aquí puedes administrar
          productos, categorías, ventas y más.
        </p>
      </div>
    ),
    users: <ProfileView />,
    products: <Products />,
    categories: <CategoryPage />,
    sizes: <SizePage />,
    sleeves: <SleevePage />,
    gender: <GenderPage />,
    brands: <BrandPage />,
    colors: <ColorPage />,
    sales: <ColorPage />, // Componente para reportes de ventas
    orders: <GenderPage />, // Componente para reportes de pedidos
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 mt-14">
      {/* Sidebar para pantallas grandes */}
      <aside className="hidden sm:block dark:bg-gray-800 shadow-lg w-64 transition-all duration-300 border-gray-200 dark:border-gray-700 border-r">
        <nav className="flex flex-col justify-between h-[calc(100vh-7rem)]">
          <ul className="space-y-2 pr-3">
            {/* Perfil del usuario con etiqueta de "Empleado" */}
            <li>
              <button
                onClick={() => setActiveTab("users")}
                className="w-full flex flex-col items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <img
                  src={userImage}
                  alt="Imagen del usuario"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                />
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name}
                </span>
                <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  Empleado
                </span>
              </button>
            </li>

            {/* Botón de Panel */}
            <li>
              <button
                onClick={() => setActiveTab("panel")}
                className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                  activeTab === "panel" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <Home className="text-gray-900 dark:text-gray-300" />
                <span>Panel</span>
              </button>
            </li>

            {/* Botón de Productos */}
            <li>
              <button
                onClick={() => setShowProducts(!showProducts)}
                className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300`}
              >
                <Package className="text-gray-900 dark:text-gray-300" />
                <span>Productos</span>
                {showProducts && <X className="w-4 h-4 ml-auto" />}
              </button>
            </li>
            {showProducts && (
              <div className="pl-10">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                    activeTab === "products" ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Package className="text-gray-900 dark:text-gray-300" />
                  Productos
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                    activeTab === "categories" ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Tag className="text-gray-900 dark:text-gray-300" />
                  Categorías
                </button>
                <button
                  onClick={() => setActiveTab("colors")}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                    activeTab === "colors" ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Palette className="text-gray-900 dark:text-gray-300" />
                  Colores
                </button>
                <button
                  onClick={() => setActiveTab("sizes")}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                    activeTab === "sizes" ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Ruler className="text-gray-900 dark:text-gray-300" />
                  Tallas
                </button>
                <button
                  onClick={() => setActiveTab("gender")}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                    activeTab === "gender" ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Users  className="text-gray-900 dark:text-gray-300" />
                  
                  Género
                </button>
                <button
                  onClick={() => setActiveTab("sleeves")}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                    activeTab === "sleeves" ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Shirt className="text-gray-900 dark:text-gray-300" />
                  Tipo de Cuello
                </button>
                <button
                  onClick={() => setActiveTab("brands")}
                  className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                    activeTab === "brands" ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  <Tag className="text-gray-900 dark:text-gray-300" />
                  Marcas
                </button>
              </div>
            )}
            {/* Reportes de Ventas */}
            <li>
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                  activeTab === "sales" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <BarChart className="text-gray-900 dark:text-gray-300" />
                <span>Reportes de Ventas</span>
              </button>
            </li>

            {/* Reportes de Pedidos */}
            <li>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-4 w-full p-2 rounded-r-2xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300 ${
                  activeTab === "orders" ? "bg-blue-600 text-white" : ""
                }`}
              >
                <List className="text-gray-900 dark:text-gray-300" />
                <span>Reportes de Pedidos</span>
              </button>
            </li>
          </ul>

          {/* Logout */}
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-4 w-full p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
            >
              <LogOut className="w-6 h-6" />
              <span>Cerrar sesión</span>
            </button>
          </div>
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
          <nav className="flex flex-col justify-between h-[calc(100vh-7rem)]">
            <ul className="space-y-2 p-4">
              {/* Mostrar imagen y nombre del usuario en móvil */}
              <li>
                <button
                  onClick={() => {
                    setActiveTab("users");
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex flex-col items-center gap-4 p-4 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <img
                    src={userImage}
                    alt="Imagen del usuario"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {user?.name}
                  </span>
                  <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Empleado
                  </span>
                </button>
              </li>

              {/* Botón de Panel en móvil */}
              <li>
                <button
                  onClick={() => {
                    setActiveTab("panel");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 w-full p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                >
                  <Home className="text-gray-900 dark:text-gray-300" />
                  <span>Panel</span>
                </button>
              </li>

              {/* Botón de Productos en móvil */}
              <li>
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 w-full p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                >
                  <Package className="text-gray-900 dark:text-gray-300" />
                  <span>Productos</span>
                </button>
              </li>

              {/* Botón de Reportes de Ventas en móvil */}
              <li>
                <button
                  onClick={() => {
                    setActiveTab("sales");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 w-full p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                >
                  <BarChart className="text-gray-900 dark:text-gray-300" />
                  <span>Reportes de Ventas</span>
                </button>
              </li>

              {/* Botón de Reportes de Pedidos en móvil */}
              <li>
                <button
                  onClick={() => {
                    setActiveTab("orders");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 w-full p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                >
                  <List className="text-gray-900 dark:text-gray-300" />
                  <span>Reportes de Pedidos</span>
                </button>
              </li>
            </ul>

            {/* Logout al final */}
            <div className="p-4 border-t dark:border-gray-700">
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-4 w-full p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
              >
                <LogOut className="w-6 h-6" />
                <span>Cerrar sesión</span>
              </button>
            </div>
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

export default EmployeeDashboard;