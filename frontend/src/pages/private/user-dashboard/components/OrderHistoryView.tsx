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
  ShoppingBag,
  AlertCircle,
  Shield,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Loader from "@/components/web-components/Loader";
import { useAuth } from "@/context/AuthContextType";
import { getSaleByUser } from "@/api/sales";

// Tipos basados en la respuesta de la API
type SaleStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type Image = {
  id: number;
  url: string;
  angle: string;
  productVariantId: number;
};

type ProductVariant = {
  barcode: string;
  price: number;
  product: {
    name: string;
  };
  images: Image[];
  color: {
    name: string;
  };
  size: {
    name: string;
  };
};

type SaleDetail = {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariant: ProductVariant;
};

type Address = {
  id: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  colony: string;
};

type UserAddress = {
  id: number;
  userId: number;
  addressId: number;
  isDefault: boolean;
  address: Address;
};

type SaleUser = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  userAddresses: UserAddress[];
};

type Sale = {
  id: number;
  userId: number;
  addressId: number;
  employeeId: number;
  subtotalAmount: string;
  shippingCost: string;
  totalAmount: string;
  saleReference: string;
  references: string;
  betweenStreetOne: string;
  betweenStreetTwo: string;
  status: SaleStatus;
  createdAt: string;
  updatedAt: string;
  user: SaleUser;
  saleDetails: SaleDetail[];
};

export default function OrderHistoryView() {
  const { user, isAuthenticated } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [animateContent, setAnimateContent] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de ventas
  useEffect(() => {
    const fetchSales = async () => {
      if (!user?.id || !isAuthenticated) return;

      try {
        setDataLoading(true);
        setError(null);
        const response = await getSaleByUser(+user.id);
        setSales(response.data || []);
      } catch (err) {
        console.error("Error fetching sales:", err);
        setError("Error al cargar el historial de pedidos");
      } finally {
        setDataLoading(false);
      }
    };

    fetchSales();
  }, [user?.id, isAuthenticated]);

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

  const getStatusColor = (status: SaleStatus) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "SHIPPED":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "PENDING":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
      case "CANCELLED":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: SaleStatus) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4" />;
      case "CONFIRMED":
        return <Clock className="w-4 h-4" />;
      case "SHIPPED":
        return <Truck className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: SaleStatus) => {
    switch (status) {
      case "DELIVERED":
        return "Entregado";
      case "CONFIRMED":
        return "Confirmado";
      case "SHIPPED":
        return "Enviado";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const getMainImage = (images: Image[]) => {
    const frontImage = images.find((img) => img.angle === "front");
    return (
      frontImage?.url || images[0]?.url || "/placeholder.svg?height=80&width=80"
    );
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount =
      typeof amount === "string" ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.saleReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.saleDetails.some((detail) =>
        detail.productVariant.product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
  );

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Acceso requerido
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Debes iniciar sesión para ver tu historial de pedidos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && <Loader />}

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

          {/* Loading state */}
          {dataLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">
                Cargando pedidos...
              </span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Orders list */}
          <div className="space-y-6">
            {!dataLoading && !error && filteredSales.length > 0 ? (
              filteredSales.map((sale, index) => (
                <motion.div
                  key={sale.id}
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
                    onClick={() => toggleOrderExpand(sale.id.toString())}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-gray-800 p-3 rounded-lg">
                          <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {sale.saleReference}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(sale.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(sale.totalAmount)}
                          </span>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            sale.status
                          )}`}
                        >
                          {getStatusIcon(sale.status)}
                          <span>{getStatusText(sale.status)}</span>
                        </div>
                        <button className="ml-auto">
                          {expandedOrders[sale.id.toString()] ? (
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
                    {expandedOrders[sale.id.toString()] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-6"
                      >
                        <div className="space-y-6">
                          {/* Shipping Address */}
                          {sale.user.userAddresses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                Dirección de envío
                              </h4>
                              <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-700">
                                {sale.user.userAddresses
                                  .filter(
                                    (ua) => ua.addressId === sale.addressId
                                  )
                                  .map((userAddress) => (
                                    <div
                                      key={userAddress.id}
                                      className="space-y-2"
                                    >
                                      <p className="text-gray-900 dark:text-white font-medium">
                                        {userAddress.address.street},{" "}
                                        {userAddress.address.colony}
                                      </p>
                                      <p className="text-gray-600 dark:text-gray-300">
                                        {userAddress.address.city},{" "}
                                        {userAddress.address.state},{" "}
                                        {userAddress.address.country} -{" "}
                                        {userAddress.address.postalCode}
                                      </p>
                                      {sale.references && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          <strong>Referencias:</strong>{" "}
                                          {sale.references}
                                        </p>
                                      )}
                                      {(sale.betweenStreetOne ||
                                        sale.betweenStreetTwo) && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                          <strong>Entre calles:</strong>{" "}
                                          {sale.betweenStreetOne}
                                          {sale.betweenStreetTwo &&
                                            ` y ${sale.betweenStreetTwo}`}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Order items */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                              <ShoppingBag className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Productos ({sale.saleDetails.length})
                            </h4>
                            <div className="space-y-4">
                              {sale.saleDetails.map((detail, detailIndex) => (
                                <motion.div
                                  key={`${sale.id}-${detailIndex}`}
                                  whileHover={{
                                    y: -3,
                                    boxShadow:
                                      "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  }}
                                  className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-gray-700"
                                >
                                  <img
                                    src={
                                      getMainImage(
                                        detail.productVariant.images
                                      ) || "/placeholder.svg"
                                    }
                                    alt={detail.productVariant.product.name}
                                    className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                  />
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                      {detail.productVariant.product.name}
                                    </h5>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      <span>
                                        Color:{" "}
                                        {detail.productVariant.color.name}
                                      </span>
                                      <span>
                                        Talla: {detail.productVariant.size.name}
                                      </span>
                                      <span>Cantidad: {detail.quantity}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                      SKU: {detail.productVariant.barcode}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {formatCurrency(detail.totalPrice)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {formatCurrency(detail.unitPrice)} c/u
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Order summary */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Resumen del pedido
                            </h4>
                            <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-700">
                              <div className="space-y-2">
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                  <span>Subtotal:</span>
                                  <span>
                                    {formatCurrency(sale.subtotalAmount)}
                                  </span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                  <span>Envío:</span>
                                  <span>
                                    {formatCurrency(sale.shippingCost)}
                                  </span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                                  <span>Total:</span>
                                  <span>
                                    {formatCurrency(sale.totalAmount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : !dataLoading && !error ? (
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
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
