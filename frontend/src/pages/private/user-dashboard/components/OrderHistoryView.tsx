"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Search,
  FileText,
  Eye,
  ShoppingBag,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type OrderStatus = "completed" | "processing" | "shipped" | "cancelled";

type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  tracking?: string;
};

export default function OrderHistoryView() {
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");

  const orders: Order[] = [
    {
      id: "ORD-12345",
      date: "2025-03-10",
      total: 1250.0,
      status: "completed",
      items: [
        {
          id: "1",
          name: "Camiseta Premium Azul",
          quantity: 2,
          price: 350.0,
          image: "/placeholder.svg?height=80&width=80",
        },
        {
          id: "2",
          name: "Pantalón Slim Fit Negro",
          quantity: 1,
          price: 550.0,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      tracking: "TRACK123456789",
    },
    {
      id: "ORD-12346",
      date: "2025-03-05",
      total: 780.0,
      status: "shipped",
      items: [
        {
          id: "3",
          name: "Polo Sport Gris",
          quantity: 1,
          price: 420.0,
          image: "/placeholder.svg?height=80&width=80",
        },
        {
          id: "4",
          name: "Shorts Deportivos",
          quantity: 1,
          price: 360.0,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
      tracking: "TRACK987654321",
    },
    {
      id: "ORD-12347",
      date: "2025-02-28",
      total: 1500.0,
      status: "processing",
      items: [
        {
          id: "5",
          name: "Chaqueta de Invierno",
          quantity: 1,
          price: 1500.0,
          image: "/placeholder.svg?height=80&width=80",
        },
      ],
    },
  ];

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Activate animations after loading screen disappears
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "processing":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-amber-100 text-amber-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-blue-600 dark:text-blue-400 mt-4 font-medium">
            Cargando pedidos...
          </p>
        </div>
      )}

      {!pageLoading && (
        <div className="p-6 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-gray-800 px-4 py-1.5">
                <ShoppingBag className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  HISTORIAL DE PEDIDOS
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Mis{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-400">
                    Compras
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Consulta y gestiona tus pedidos recientes
              </p>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por número de pedido o producto..."
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-3.5"
                />
              </div>
            </div>
          </motion.div>

          {/* Orders list */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    animateContent
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* Order header */}
                  <div
                    className="p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-gray-800 p-3 rounded-lg">
                          <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {order.id}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span>
                            {order.status === "completed" && "Completado"}
                            {order.status === "processing" && "En proceso"}
                            {order.status === "shipped" && "Enviado"}
                            {order.status === "cancelled" && "Cancelado"}
                          </span>
                        </div>
                        <button className="ml-auto">
                          {expandedOrders[order.id] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order details */}
                  <AnimatePresence>
                    {expandedOrders[order.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6"
                      >
                        <div className="space-y-6">
                          {/* Order items */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                              <ShoppingBag className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Productos
                            </h4>
                            <div className="space-y-4">
                              {order.items.map((item) => (
                                <motion.div
                                  key={item.id}
                                  whileHover={{
                                    y: -3,
                                    boxShadow:
                                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  }}
                                  className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-gray-700"
                                >
                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                  />
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                      {item.name}
                                    </h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      Cantidad: {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      ${item.price.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      por unidad
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Order tracking */}
                          {order.tracking && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                                <Truck className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                Información de envío
                              </h4>
                              <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-900 dark:text-white font-medium">
                                      Número de seguimiento:
                                    </span>
                                  </div>
                                  <span className="font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-900 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                                    {order.tracking}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          <Separator />

                          {/* Order actions */}
                          <div className="flex justify-end gap-3">
                            <Button variant="outline" className="gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Ver factura</span>
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                              <Eye className="w-4 h-4" />
                              <span>Ver detalles</span>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden p-8 text-center"
              >
                <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Package className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No se encontraron pedidos
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm
                    ? "No hay pedidos que coincidan con tu búsqueda."
                    : "Aún no has realizado ningún pedido."}
                </p>
                <div className="mt-6 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800 dark:text-blue-100 flex items-start">
                    <Shield className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                    <span>
                      Aquí podrás ver el historial de todos tus pedidos y
                      realizar un seguimiento de su estado en tiempo real.
                    </span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
