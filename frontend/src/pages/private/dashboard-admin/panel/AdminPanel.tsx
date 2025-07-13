"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Users,
  FileText,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  UserPlus,
  ChevronRight,
  Activity,
  BarChart2,
  Download,
  RefreshCw,
  LayoutDashboard,
  PieChart,
  Settings,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContextType"; // Assuming this path is correct
import type {
  AdminDashboardDataDto,
  AdminStatDto,
  AdminRecentActivityDto,
} from "@/types/admin-dashboard";
import Loader from "@/components/web-components/Loader";

// Map string icon names to Lucide React components
const iconMap: Record<string, React.ElementType> = {
  HelpCircle,
  Users,
  FileText,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  UserPlus,
  ChevronRight,
  Activity,
  BarChart2,
  Download,
  RefreshCw,
  LayoutDashboard,
  PieChart,
  Settings,
  BookOpen,
};

export default function AdminPanel() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("Buenos días");
  const [activeFaqTab, setActiveFaqTab] = useState("categories");
  const { user } = useAuth();

  const [dashboardData, setDashboardData] =
    useState<AdminDashboardDataDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from NestJS backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin-dashboard"); // Adjust URL if your backend is elsewhere
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: AdminDashboardDataDto = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(
          "No se pudieron cargar los datos del panel. Inténtalo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Determinar el saludo según la hora del día
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const hour = new Date().getHours();
      let newGreeting = "Buenos días";
      if (hour >= 5 && hour < 12) {
        newGreeting = "Buenos días";
      } else if (hour >= 12 && hour < 19) {
        newGreeting = "Buenas tardes";
      } else {
        newGreeting = "Buenas noches";
      }
      setGreeting(newGreeting);
    }, 60000);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Buenos días");
    } else if (hour >= 12 && hour < 19) {
      setGreeting("Buenas tardes");
    } else {
      setGreeting("Buenas noches");
    }
    return () => clearInterval(timer);
  }, []);

  // Animación para los elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  // Formatear fecha actual
  const formattedDate = currentTime.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  // Use fetched data, or fallback to empty arrays/objects if null
  const adminStatsData: AdminStatDto[] = dashboardData?.adminStatsData || [];
  const adminRecentActivity: AdminRecentActivityDto[] =
    dashboardData?.adminRecentActivity || [];
  const adminChartData = dashboardData?.adminChartData || {
    employeeStats: {
      total: 0,
      byRole: {
        admin: { count: 0, change: "+0%" },
        employee: { count: 0, change: "+0%" },
      },
    },
    faqStats: { months: [], values: [] },
    employeeGrowth: { months: [], hired: [], active: [] },
    documentStats: {
      policies: { count: 0, change: "+0%" },
      terms: { count: 0, change: "+0%" },
      guides: { count: 0, change: "+0%" },
    },
  };

  return (
    <div className=" space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Encabezado principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>
          {/* Encabezado */}
          <div className="relative">
            <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
              <div className="flex justify-between items-center">
                <div className="flex items-center flex-wrap">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Panel de Administración
                    </h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 inline" />
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 text-center px-4 py-2 rounded-lg text-white">
                  <p className="text-sm font-medium">
                    {greeting}, {user?.name?.split(" ")[0] || "Administrador"}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
              <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
                <Clock className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium">
                  Última actualización: {currentTime.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          {/* Tarjetas de estadísticas administrativas */}
          <div className="p-6 pt-10">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {adminStatsData.map((stat, index) => {
                const IconComponent = iconMap[stat.icon];
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                    className={`${stat.bgCard} rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`${stat.bgIcon} p-2.5 rounded-lg shadow-md`}
                        >
                          {IconComponent && (
                            <IconComponent className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex items-center">
                          {stat.isPositive ? (
                            <span className="text-green-500 text-xs font-medium flex items-center">
                              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                              {stat.change}
                            </span>
                          ) : (
                            <span className="text-red-500 text-xs font-medium flex items-center">
                              <ArrowDownRight className="w-3.5 h-3.5 mr-1" />
                              {stat.change}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3
                        className={`text-sm font-medium ${stat.textSecondary} mb-1`}
                      >
                        {stat.title}
                      </h3>
                      <p className={`text-2xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                      <p className={`text-xs ${stat.textSecondary} mt-1`}>
                        {stat.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
        {/* Sección de gráficos administrativos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estadísticas de Empleados */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative">
              <div className="bg-sky-500 p-4 rounded-b-[2rem]">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <PieChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Distribución de Empleados
                    </h2>
                    <p className="text-xs text-white/80">
                      Por roles y departamentos
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="10"
                      className="dark:stroke-gray-700"
                    />
                    {/* Admin segment */}
                    {adminChartData.employeeStats.total > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset={
                          251.2 -
                          (adminChartData.employeeStats.byRole.admin.count /
                            adminChartData.employeeStats.total) *
                            251.2
                        }
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    )}
                    {/* Employee segment */}
                    {adminChartData.employeeStats.total > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="10"
                        strokeDasharray="251.2"
                        strokeDashoffset={
                          251.2 -
                          (adminChartData.employeeStats.byRole.employee.count /
                            adminChartData.employeeStats.total) *
                            251.2
                        }
                        strokeLinecap="round"
                        transform={`rotate(${
                          (adminChartData.employeeStats.byRole.admin.count /
                            adminChartData.employeeStats.total) *
                            360 -
                          90
                        } 50 50)`}
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {adminChartData.employeeStats.total}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Total Empleados
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(adminChartData.employeeStats.byRole).map(
                  ([role, data], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            index === 0
                              ? "bg-sky-100 dark:bg-sky-900/30"
                              : "bg-green-100 dark:bg-green-900/30"
                          } flex items-center justify-center`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0 ? "bg-sky-600" : "bg-green-600"
                            }`}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {role === "admin" ? "Administradores" : "Empleados"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {data.count}
                        </span>
                        <span
                          className={`text-xs ${
                            data.change.startsWith("+")
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {data.change}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
          {/* Crecimiento de FAQ */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative">
              <div className="bg-teal-500 p-4 rounded-b-[2rem]">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Crecimiento FAQ
                    </h2>
                    <p className="text-xs text-white/80">
                      Preguntas frecuentes por mes
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-8">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setActiveFaqTab("categories")}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                    activeFaqTab === "categories"
                      ? "bg-teal-600 text-white"
                      : "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                  }`}
                >
                  Categorías
                </button>
                <button
                  onClick={() => setActiveFaqTab("questions")}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                    activeFaqTab === "questions"
                      ? "bg-teal-600 text-white"
                      : "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                  }`}
                >
                  Preguntas
                </button>
              </div>
              {/* Chart placeholder */}
              <div className="h-48 w-full">
                <div className="flex h-full items-end gap-2">
                  {adminChartData.faqStats.months.map((month, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="w-full relative group">
                        <div
                          className="w-full bg-teal-100 dark:bg-teal-900/30 rounded-t-lg relative overflow-hidden"
                          style={{
                            height: `${
                              (adminChartData.faqStats.values[index] /
                                Math.max(
                                  ...adminChartData.faqStats.values,
                                  1
                                )) *
                              100
                            }%`,
                          }}
                        >
                          <div className="absolute inset-0 bg-teal-600 opacity-80 rounded-t-lg"></div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2">
                        {month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      FAQ Publicadas
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {adminChartData.faqStats.values.reduce(
                      (sum, val) => sum + val,
                      0
                    )}{" "}
                    Total
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Documentos Legales */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative">
              <div className="bg-violet-500 p-4 rounded-b-[2rem]">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Documentos Legales
                    </h2>
                    <p className="text-xs text-white/80">
                      Políticas y términos
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-8">
              <div className="space-y-4">
                {Object.entries(adminChartData.documentStats).map(
                  ([type, data], index) => {
                    const DocIcon = iconMap.FileText;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${
                              index === 0
                                ? "bg-violet-100 dark:bg-violet-900/30"
                                : index === 1
                                ? "bg-blue-100 dark:bg-blue-900/30"
                                : "bg-orange-100 dark:bg-orange-900/30"
                            } flex items-center justify-center`}
                          >
                            {DocIcon && (
                              <DocIcon
                                className={`w-5 h-5 ${
                                  index === 0
                                    ? "text-violet-600"
                                    : index === 1
                                    ? "text-blue-600"
                                    : "text-orange-600"
                                }`}
                              />
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {type === "policies"
                                ? "Políticas"
                                : type === "terms"
                                ? "Términos"
                                : "Guías"}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {type === "policies"
                                ? "Políticas internas"
                                : type === "terms"
                                ? "Términos y condiciones"
                                : "Guías de usuario"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {data.count}
                          </span>
                          <span
                            className={`text-xs ${
                              data.change.startsWith("+")
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {data.change}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Actividad Administrativa Reciente */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="relative">
            <div className="bg-orange-500 p-4 rounded-b-[2rem]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Actividad Administrativa
                    </h2>
                    <p className="text-xs text-white/80">
                      Últimas acciones del sistema
                    </p>
                  </div>
                </div>
                <button className="text-xs text-white/90 hover:text-white font-medium flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg">
                  <span>Ver todo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminRecentActivity.map((item) => {
                const ActivityIcon = iconMap[item.icon];
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shadow-sm`}
                    >
                      {ActivityIcon && <ActivityIcon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                      <span className="inline-flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
