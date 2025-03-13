"use client";

import { useState } from "react";
import {
  Package,
  LogOut,
  Menu,
  BarChart,
  List,
  Home,
  Palette,
  Ruler,
  Shirt,
  Tag,
  X,
  Users,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ProfileView } from "../components/Profile-views";
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
  | "panel"
  | "users"
  | "products"
  | "categories"
  | "sizes"
  | "sleeves"
  | "gender"
  | "brands"
  | "colors"
  | "sales"
  | "orders";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("panel");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const { user, signOut } = useAuth();

  // Datos de ejemplo para el panel principal
  const statsData = [
    {
      title: "Productos",
      value: "124",
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Ventas Hoy",
      value: "$1,240",
      icon: <BarChart className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pedidos Pendientes",
      value: "8",
      icon: <List className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Clientes",
      value: "320",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
  ];

  // Componentes para cada pestaña
  const tabs: Record<TabKey, JSX.Element> = {
    panel: (
      <div className="p-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Panel Principal
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Bienvenido al panel de gestión, {user?.name}. Aquí tienes un
              resumen de la actividad reciente.
            </p>
          </div>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className={`bg-gradient-to-r ${stat.color} p-4 text-white`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{stat.title}</h3>
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span
                    className={
                      stat.title === "Pedidos Pendientes"
                        ? "text-amber-500"
                        : "text-green-500"
                    }
                  >
                    {stat.title === "Pedidos Pendientes" ? "↑ 12%" : "↑ 8%"}
                  </span>
                  <span className="ml-2">desde el mes pasado</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actividad reciente */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r bg-blue-500  p-4 text-white">
            <h3 className="font-semibold text-lg">Actividad Reciente</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                    {item % 2 === 0 ? (
                      <Package className="w-5 h-5" />
                    ) : (
                      <Tag className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {item % 2 === 0
                        ? "Nuevo producto agregado"
                        : "Categoría actualizada"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item % 2 === 0
                        ? "Camiseta Deportiva Premium"
                        : "Categoría Pantalones"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Hace {item * 10} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
    sales: (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Reportes de Ventas
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Esta sección está en desarrollo. Próximamente podrás ver estadísticas
          detalladas de ventas.
        </p>
      </div>
    ),
    orders: (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Reportes de Pedidos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Esta sección está en desarrollo. Próximamente podrás gestionar los
          pedidos.
        </p>
      </div>
    ),
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-900 mt-16">
      {/* Sidebar para pantallas grandes */}
      <aside className="hidden sm:block bg-white dark:bg-gray-800 shadow-xl w-64 h-screen overflow-y-auto border-r border-gray-200 dark:border-gray-700 sticky top-0 left-0 mt-10">
        <div className="flex flex-col h-full">

          {/* Perfil del usuario */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("users")}
              className="w-full flex flex-col items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="relative">
                <img
                  src={userImage || "/placeholder.svg?height=80&width=80"}
                  alt="Imagen del usuario"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                />
                <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></span>
              </div>
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {user?.name || "Usuario"}
                </span>
                <span className="bg-gradient-to-r bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full block mt-1">
                  Empleado
                </span>
              </div>
            </button>
          </div>

          {/* Menú de navegación */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {/* Botón de Panel */}
              <li>
                <button
                  onClick={() => setActiveTab("panel")}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
                    activeTab === "panel"
                      ? "bg-gradient-to-r bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Panel</span>
                </button>
              </li>

              {/* Botón de Productos */}
              <li>
                <button
                  onClick={() => setShowProducts(!showProducts)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-lg transition-colors ${
                    [
                      "products",
                      "categories",
                      "colors",
                      "sizes",
                      "gender",
                      "sleeves",
                      "brands",
                    ].includes(activeTab)
                      ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Productos</span>
                  </div>
                  {showProducts ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </li>

              {/* Submenú de productos */}
              {showProducts && (
                <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700 space-y-1 mt-1">
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      activeTab === "products"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span className="font-medium">Productos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("categories")}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      activeTab === "categories"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">Categorías</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("colors")}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      activeTab === "colors"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Palette className="w-4 h-4" />
                    <span className="font-medium">Colores</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("sizes")}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      activeTab === "sizes"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Ruler className="w-4 h-4" />
                    <span className="font-medium">Tallas</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("gender")}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      activeTab === "gender"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="font-medium">Género</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("sleeves")}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      activeTab === "sleeves"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Shirt className="w-4 h-4" />
                    <span className="font-medium">Tipo de Cuello</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("brands")}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                      activeTab === "brands"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">Marcas</span>
                  </button>
                </div>
              )}

              {/* Reportes de Ventas */}
              <li>
                <button
                  onClick={() => setActiveTab("sales")}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
                    activeTab === "sales"
                      ? "bg-gradient-to-r bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <BarChart className="w-5 h-5" />
                  <span className="font-medium">Reportes de Ventas</span>
                </button>
              </li>

              {/* Reportes de Pedidos */}
              <li>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-gradient-to-r bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <List className="w-5 h-5" />
                  <span className="font-medium">Reportes de Pedidos</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full p-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Botón de menú para móviles */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 left-4 h-10 w-10 bg-gradient-to-r bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg z-50 sm:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Menú móvil */}
      {isMenuOpen && (
        <>
          {/* Overlay para cerrar el menú al hacer clic fuera */}
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Menú lateral */}
          <div className="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-2xl w-72 z-50 transition-all duration-300 sm:hidden overflow-y-auto">
            

            {/* Perfil del usuario */}
            <div className="p-4 flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setActiveTab("users");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <img
                  src={userImage || "/placeholder.svg?height=60&width=60"}
                  alt="Imagen del usuario"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-600"
                />
                <div>
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100 block">
                    {user?.name || "Usuario"}
                  </span>
                  <span className="bg-gradient-to-r bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    Empleado
                  </span>
                </div>
              </button>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
            </div>

            {/* Menú de navegación móvil */}
            <nav className="p-4 overflow-y-auto">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("panel");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-medium">Panel</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("products");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Productos</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("categories");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Tag className="w-5 h-5" />
                    <span className="font-medium">Categorías</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("colors");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Palette className="w-5 h-5" />
                    <span className="font-medium">Colores</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("sizes");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Ruler className="w-5 h-5" />
                    <span className="font-medium">Tallas</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("gender");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Género</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("sleeves");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Shirt className="w-5 h-5" />
                    <span className="font-medium">Tipo de Cuello</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("brands");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Tag className="w-5 h-5" />
                    <span className="font-medium">Marcas</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("sales");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <BarChart className="w-5 h-5" />
                    <span className="font-medium">Reportes de Ventas</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("orders");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <List className="w-5 h-5" />
                    <span className="font-medium">Reportes de Pedidos</span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Logout en móvil */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-50   dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="min-h-screen">{tabs[activeTab]}</div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
