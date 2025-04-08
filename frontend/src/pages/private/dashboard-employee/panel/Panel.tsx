"use client";

import { useAuth } from "@/context/AuthContextType";
import {
  BarChart,
  List,
  Package,
  Tag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Star,
  ShoppingBag,
  FileText,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Panel = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Buenos días");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Determinar el saludo según la hora del día
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Buenos días");
    } else if (hour >= 12 && hour < 19) {
      setGreeting("Buenas tardes");
    } else {
      setGreeting("Buenas noches");
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Datos de ejemplo para el panel principal
  const statsData = [
    {
      title: "Productos",
      value: "124",
      change: "+8%",
      isPositive: true,
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      bgLight: "bg-blue-50",
      textLight: "text-blue-600",
    },
    {
      title: "Ventas Hoy",
      value: "$1,240",
      change: "+12%",
      isPositive: true,
      icon: <BarChart className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-600 to-green-700",
      bgLight: "bg-green-50",
      textLight: "text-green-600",
    },
    {
      title: "Pedidos Pendientes",
      value: "8",
      change: "+3%",
      isPositive: false,
      icon: <List className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
      hoverColor: "from-amber-600 to-amber-700",
      bgLight: "bg-amber-50",
      textLight: "text-amber-600",
    },
    {
      title: "Clientes",
      value: "320",
      change: "+5%",
      isPositive: true,
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-600 to-purple-700",
      bgLight: "bg-purple-50",
      textLight: "text-purple-600",
    },
  ];

  // Datos de actividad reciente
  const recentActivity = [
    {
      id: 1,
      title: "Nuevo producto agregado",
      description: "Camiseta Deportiva Premium",
      time: "Hace 10 min",
      icon: <Package className="w-5 h-5" />,
      color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
    },
    {
      id: 2,
      title: "Categoría actualizada",
      description: "Categoría Pantalones",
      time: "Hace 20 min",
      icon: <Tag className="w-5 h-5" />,
      color:
        "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
    },
    {
      id: 3,
      title: "Nuevo pedido recibido",
      description: "Pedido #1234 - $567.89",
      time: "Hace 30 min",
      icon: <Bell className="w-5 h-5" />,
      color:
        "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    },
    {
      id: 4,
      title: "Inventario actualizado",
      description: "Polos - Stock: 45 unidades",
      time: "Hace 40 min",
      icon: <Package className="w-5 h-5" />,
      color: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
    },
    {
      id: 5,
      title: "Reunión programada",
      description: "Presentación de nuevos diseños",
      time: "Hace 50 min",
      icon: <Calendar className="w-5 h-5" />,
      color:
        "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    },
  ];

  // Tareas pendientes
  const pendingTasks = [
    { task: "Actualizar inventario de camisetas", priority: "alta" },
    { task: "Revisar pedidos pendientes", priority: "media" },
    { task: "Contactar a proveedor de telas", priority: "baja" },
    { task: "Preparar informe mensual", priority: "alta" },
  ];

  // Próximos eventos
  const upcomingEvents = [
    { date: "15 Marzo", event: "Lanzamiento nueva colección" },
    { date: "22 Marzo", event: "Reunión con distribuidores" },
    { date: "30 Marzo", event: "Inventario de fin de mes" },
  ];

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

  // Formatear hora actual
  const formattedTime = currentTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-6 space-y-8  dark:bg-gray-900 min-h-screen">
      {/* Header con bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-xl p-8 text-white"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <h2 className="text-3xl font-bold">
                {greeting}, {user?.name || "Usuario"}
              </h2>
            </div>
            <p className="mt-2 text-blue-100 max-w-xl">
              Bienvenido al panel de gestión. Aquí tienes un resumen de la
              actividad reciente y métricas importantes para tu negocio.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-sm font-medium">Todo en orden</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-sm font-medium">
                  Ventas +15% este mes
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl flex items-center gap-3 border border-white/10">
              <Clock className="w-6 h-6 text-blue-100" />
              <div>
                <p className="text-blue-100 text-sm">Fecha actual</p>
                <p className="font-medium capitalize">{formattedDate}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl flex items-center gap-3 border border-white/10">
              <Star className="w-6 h-6 text-yellow-300" />
              <div>
                <p className="text-blue-100 text-sm">Hora actual</p>
                <p className="font-medium">{formattedTime}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de estadísticas */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.2 },
            }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300"
          >
            <div
              className={`bg-gradient-to-r ${stat.color} hover:${stat.hoverColor} p-6 text-white transition-all duration-300`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">{stat.title}</h3>
                <div
                  className={`${stat.bgLight} p-2.5 rounded-lg ${stat.textLight} shadow-md`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-4xl font-bold mt-4">{stat.value}</p>
              <div className="flex items-center mt-3 text-sm">
                {stat.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 mr-1 text-green-200" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1 text-red-200" />
                )}
                <span
                  className={
                    stat.isPositive ? "text-green-200" : "text-red-200"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-2 text-blue-100">desde el mes pasado</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Secciones principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-300" />
                Actividad Reciente
              </h3>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Últimas 24 horas
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-5">
              {recentActivity.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: item.id * 0.1 }}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md"
                >
                  <div
                    className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center shadow-md`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-gray-100 font-medium text-lg">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full flex items-center shadow-sm">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {item.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="px-6 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-medium text-sm transition-all duration-200 rounded-lg flex items-center mx-auto shadow-sm">
                Ver todas las actividades
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sección adicional - Tareas pendientes y eventos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Tareas pendientes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Tareas Pendientes
                </h3>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {pendingTasks.length} tareas
                </span>
              </div>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-sm"
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        task.priority === "alta"
                          ? "border-red-500"
                          : task.priority === "media"
                          ? "border-amber-500"
                          : "border-green-500"
                      } flex-shrink-0`}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {task.task}
                    </span>
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        task.priority === "alta"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : task.priority === "media"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 text-center">
                <button className="px-5 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 font-medium text-sm transition-all duration-200 rounded-lg flex items-center mx-auto shadow-sm">
                  Administrar tareas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Próximos eventos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Próximos Eventos
                </h3>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  Marzo 2025
                </span>
              </div>
            </div>
            <div className="p-5">
              <ul className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex flex-col items-center justify-center text-xs font-medium shadow-md">
                      <Calendar className="w-4 h-4 mb-1" />
                      {event.date.split(" ")[0]}
                      <span>{event.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {event.event}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        10:00 AM - 12:00 PM
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 text-center">
                <button className="px-5 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 font-medium text-sm transition-all duration-200 rounded-lg flex items-center mx-auto shadow-sm">
                  Ver calendario
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Resumen de ventas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Resumen de Ventas
            </h3>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              Últimos 30 días
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border border-green-100 dark:border-green-800/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-green-700 dark:text-green-400 font-medium">
                  Total Ventas
                </h4>
                <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                $24,580
              </p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                <span className="text-green-600 dark:text-green-400">
                  +12.5%
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  vs mes anterior
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-blue-700 dark:text-blue-400 font-medium">
                  Pedidos
                </h4>
                <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                156
              </p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400">+8.2%</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  vs mes anterior
                </span>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-purple-700 dark:text-purple-400 font-medium">
                  Clientes Nuevos
                </h4>
                <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                42
              </p>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-600 dark:text-purple-400">
                  +5.7%
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  vs mes anterior
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="px-6 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 font-medium transition-all duration-200 rounded-lg flex items-center mx-auto shadow-sm">
              Ver reporte completo
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Panel;
