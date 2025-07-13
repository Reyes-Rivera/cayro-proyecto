"use client";
import { useState, useEffect } from "react";
import {
  Package,
  Tag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  DollarSign,
  ShoppingCart,
  ChevronRight,
  Activity,
  BarChart2,
  Download,
  RefreshCw,
  LayoutDashboard,
  PieChart,
  LineChart,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContextType"; // Assuming this context provides user info
import Loader from "@/components/web-components/Loader";
const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
// Define types for the fetched data to ensure type safety
interface StatData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string; // Will be a string name like "DollarSign"
  bgIcon: string;
  bgCard: string;
  textColor: string;
  textSecondary: string;
  subtitle: string;
}

interface RecentActivity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string; // Will be a string name like "Package"
  color: string;
}

interface ChartData {
  revenue: { day: string; value: number }[];
  customers: {
    total: number;
    percentage: number;
    returning: number;
    new: number;
  };
  productStats: {
    category: string;
    count: number;
    change: string;
    colorIndex: number;
  }[];
  customerGrowth: {
    months: string[];
    values: number[];
  };
  customerHabits: {
    months: string[];
    seen: number[];
    sales: number[];
  };
}

interface DashboardResponse {
  statsData: StatData[];
  recentActivity: RecentActivity[];
  chartData: ChartData;
}

// Map icon names to Lucide React components
const LucideIconMap: { [key: string]: React.ElementType } = {
  Package,
  Tag,
  Users,
  DollarSign,
  ShoppingCart,
  Calendar,
  Clock,
  Activity,
  BarChart2,
  LineChart,
  PieChart,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Download,
  RefreshCw,
};

export default function Panel() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("Buenos días");
  const [activeProductTab, setActiveProductTab] = useState("seen");
  const { user } = useAuth(); // Assuming useAuth provides user data
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log(dashboardData);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(apiUrl + "/dashboard"); // Adjust URL if your backend is elsewhere
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardResponse = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Update time every minute and set greeting
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

    // Initial greeting
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );
  }

  // Use dashboardData or fallback to empty arrays/default values if null
  const statsData = dashboardData?.statsData || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const chartData = dashboardData?.chartData || {
    revenue: [],
    customers: { total: 0, percentage: 0, returning: 0, new: 0 },
    productStats: [],
    customerGrowth: { months: [], values: [] },
    customerHabits: { months: [], seen: [], sales: [] },
  };

  return (
    <div className="space-y-6">
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
                    <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 inline" />
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 px-4 text-center py-2 rounded-lg text-white">
                  <p className="text-sm font-medium">
                    {greeting}, {user?.name?.split(" ")[0] || "Usuario"}
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
          {/* Tarjetas de estadísticas */}
          <div className="p-6 pt-10">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {statsData.map((stat, index) => {
                const IconComponent = LucideIconMap[stat.icon];
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
        {/* Sección de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estadísticas de Producto */}
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
                      Estadísticas de Producto
                    </h2>
                    <p className="text-xs text-white/80">
                      Resumen de ventas por categoría
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
                    {/* Blue segment (65%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="87.92"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    {/* Red segment (25%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="188.4"
                      strokeLinecap="round"
                      transform="rotate(153 50 50)"
                    />
                    {/* Yellow segment (10%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="226.08"
                      strokeLinecap="round"
                      transform="rotate(243 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {chartData.customers.total}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Productos Vendidos
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {chartData.productStats.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full ${
                          data.colorIndex === 0
                            ? "bg-sky-100 dark:bg-sky-900/30"
                            : data.colorIndex === 1
                            ? "bg-rose-100 dark:bg-rose-900/30"
                            : "bg-orange-100 dark:bg-orange-900/30"
                        } flex items-center justify-center`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            data.colorIndex === 0
                              ? "bg-sky-600"
                              : data.colorIndex === 1
                              ? "bg-rose-600"
                              : "bg-orange-600"
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {data.category}s
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
                ))}
              </div>
            </div>
          </motion.div>
          {/* Tendencias de Moda */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative">
              <div className="bg-blue-500 p-4 rounded-b-[2rem]">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Tendencias de Moda
                    </h2>
                    <p className="text-xs text-white/80">
                      Análisis de popularidad
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-8">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setActiveProductTab("seen")}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                    activeProductTab === "seen"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  Populares
                </button>
                <button
                  onClick={() => setActiveProductTab("sales")}
                  className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                    activeProductTab === "sales"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  Temporada
                </button>
              </div>
              {/* Chart placeholder */}
              <div className="h-48 w-full">
                <div className="flex h-full items-end gap-2">
                  {chartData.customerHabits.months.map((month, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="w-full relative group">
                        <div
                          className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-lg relative overflow-hidden"
                          style={{
                            height: `${
                              activeProductTab === "seen"
                                ? (chartData.customerHabits.seen[index] / 40) *
                                  100
                                : (chartData.customerHabits.sales[index] / 40) *
                                  100
                            }`,
                          }}
                        >
                          <div className="absolute inset-0 bg-blue-600 opacity-80 rounded-t-lg"></div>
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
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activeProductTab === "seen"
                        ? "Prendas populares"
                        : "Tendencias de temporada"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {chartData.productStats.reduce(
                      (sum, stat) => sum + stat.count,
                      0
                    )}{" "}
                    Productos
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Crecimiento de Clientes */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="relative">
              <div className="bg-teal-500 p-4 rounded-b-[2rem]">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <LineChart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Crecimiento de Clientes
                    </h2>
                    <p className="text-xs text-white/80">Evolución mensual</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 pt-8">
              {/* Line chart for customer growth */}
              <div className="h-48 relative">
                {/* Area under the line */}
                <div className="absolute inset-x-0 bottom-0 h-40">
                  <svg width="100%" height="100%" preserveAspectRatio="none">
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#0d9488"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#0d9488"
                          stopOpacity="0.05"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M0,${
                        40 -
                        (chartData.customerGrowth.values[0] /
                          Math.max(...chartData.customerGrowth.values, 1)) *
                          40
                      } ${chartData.customerGrowth.months
                        .map((_, i) => {
                          const x =
                            (i / (chartData.customerGrowth.months.length - 1)) *
                            100;
                          const y =
                            40 -
                            (chartData.customerGrowth.values[i] /
                              Math.max(...chartData.customerGrowth.values, 1)) *
                              40;
                          return `L${x},${y}`;
                        })
                        .join(" ")} L100,40 L0,40 Z`}
                      fill="url(#gradient)"
                    />
                  </svg>
                </div>
                {/* Line */}
                <div className="absolute inset-x-0 bottom-0 h-40">
                  <svg width="100%" height="100%" preserveAspectRatio="none">
                    <path
                      d={`M0,${
                        40 -
                        (chartData.customerGrowth.values[0] /
                          Math.max(...chartData.customerGrowth.values, 1)) *
                          40
                      } ${chartData.customerGrowth.months
                        .map((_, i) => {
                          const x =
                            (i / (chartData.customerGrowth.months.length - 1)) *
                            100;
                          const y =
                            40 -
                            (chartData.customerGrowth.values[i] /
                              Math.max(...chartData.customerGrowth.values, 1)) *
                              40;
                          return `L${x},${y}`;
                        })
                        .join(" ")}`}
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                {/* Data points */}
                <div className="absolute inset-x-0 bottom-0 h-40 flex justify-between items-end">
                  {chartData.customerGrowth.values.map((value, i) => (
                    <div
                      key={i}
                      className="relative"
                      style={{
                        height: `${
                          (value /
                            Math.max(...chartData.customerGrowth.values, 1)) *
                          40
                        }px`,
                      }}
                    >
                      <div className="absolute bottom-0 -translate-x-1/2 w-2 h-2 bg-white border-2 border-teal-600 rounded-full"></div>
                    </div>
                  ))}
                </div>
                {/* X-axis labels */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between">
                  {chartData.customerGrowth.months.map((month, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-500 dark:text-gray-400 -mb-6"
                    >
                      {month}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex justify-between items-center gap-4 w-full">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-teal-600"></div>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Total Clientes
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {chartData.customers.total} Clientes
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Actividad Reciente */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="relative">
            <div className="bg-violet-500 p-4 rounded-b-[2rem]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Actividad Reciente
                    </h2>
                    <p className="text-xs text-white/80">
                      Últimas actualizaciones del sistema
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
              {recentActivity.map((item) => {
                const IconComponent = LucideIconMap[item.icon];
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-100 dark:border-gray-700 shadow-sm"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shadow-sm`}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
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
