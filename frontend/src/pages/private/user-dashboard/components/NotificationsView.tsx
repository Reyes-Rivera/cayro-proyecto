"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  Truck,
  Tag,
  Clock,
  Trash,
  Check,
  X,
  Shield,
  Watch,
  Copy,
  Smartphone,
  Loader2,
  Zap,
  Eye,
  EyeOff,
  Package,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateSmartWatchCode,
  getSmartWatchCode,
  getNotifications,
} from "@/api/users";
import { useAuth } from "@/context/AuthContextType";

type NotificationItem = {
  productName: string;
  color: string;
  size: string;
  quantity: number;
};

type ApiNotification = {
  saleId: number;
  createdAt: string;
  totalAmount: string;
  status: "PENDING" | "PROCESSING" | "PACKED" | "SHIPPED";
  message: string;
  items: NotificationItem[];
};

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "order" | "shipping" | "promotion" | "system";
  read: boolean;
  saleId?: number;
  totalAmount?: string;
  items?: NotificationItem[];
  status?: string;
};

export default function NotificationsView() {
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Smartwatch linking states
  const [smartwatchCode, setSmartwatchCode] = useState("");
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Transform API notification to UI notification
  const transformApiNotification = (
    apiNotification: ApiNotification
  ): Notification => {
    const getNotificationType = (status: string) => {
      switch (status) {
        case "PENDING":
        case "PROCESSING":
          return "order";
        case "PACKED":
        case "SHIPPED":
          return "shipping";
        default:
          return "order";
      }
    };

    const getNotificationTitle = (status: string, saleId: number) => {
      switch (status) {
        case "PENDING":
          return `Pedido #${saleId} recibido`;
        case "PROCESSING":
          return `Pedido #${saleId} en revisión`;
        case "PACKED":
          return `Pedido #${saleId} empacado`;
        case "SHIPPED":
          return `Pedido #${saleId} enviado`;
        default:
          return `Pedido #${saleId}`;
      }
    };

    return {
      id: apiNotification.saleId.toString(),
      title: getNotificationTitle(
        apiNotification.status,
        apiNotification.saleId
      ),
      message: apiNotification.message,
      date: apiNotification.createdAt,
      type: getNotificationType(apiNotification.status),
      read: false, // All notifications start as unread
      saleId: apiNotification.saleId,
      totalAmount: apiNotification.totalAmount,
      items: apiNotification.items,
      status: apiNotification.status,
    };
  };

  // Load notifications from API
  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingNotifications(true);
      const response = await getNotifications(Number(user.id));

      if (response.data && Array.isArray(response.data)) {
        const transformedNotifications = response.data.map(
          transformApiNotification
        );
        setNotifications(transformedNotifications);
      } else {
        setNotifications([]);
      }
    } catch (error: any) {
      console.error("Error loading notifications:", error);
      // If no notifications found (404), set empty array
      if (error.response?.status === 404) {
        setNotifications([]);
      } else {
        console.error(
          "Error fetching notifications:",
          error.response?.data?.message || "Error desconocido"
        );
      }
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Check if user already has a smartwatch code
  const checkExistingCode = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingCode(true);
      const response = await getSmartWatchCode(Number(user.id));

      if (response.data && response.data.code) {
        setSmartwatchCode(response.data.code);
        setCodeGenerated(true);
      } else {
        // No code exists, show generate button
        setCodeGenerated(false);
        setSmartwatchCode("");
      }
    } catch (error: any) {
      console.error("Error checking existing code:", error);
      // If error (like 404), assume no code exists
      setCodeGenerated(false);
      setSmartwatchCode("");
    } finally {
      setIsLoadingCode(false);
    }
  };

  // Generate new smartwatch code
  const handleGenerateCode = async () => {
    if (!user?.id) {
      alert("Error: Usuario no encontrado");
      return;
    }

    try {
      setIsGeneratingCode(true);
      const response = await generateSmartWatchCode(Number(user.id));

      if (response.data && response.data.code) {
        setSmartwatchCode(response.data.code);
        setCodeGenerated(true);
        setIsCodeCopied(false);
        setShowCode(true); // Show code automatically when generated
      } else {
        alert("Error al generar el código");
      }
    } catch (error: any) {
      console.error("Error generating code:", error);
      alert(error.response?.data?.message || "Error al generar el código");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Copy code to clipboard
  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(smartwatchCode);
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
      alert("Error al copiar el código");
    }
  };

  // Toggle code visibility
  const toggleCodeVisibility = () => {
    setShowCode(!showCode);
  };

  // Format code for display (hidden or visible)
  const getDisplayCode = () => {
    if (!smartwatchCode) return "";
    return showCode ? smartwatchCode : "••••••••";
  };

  // Load data when component mounts and user is available
  useEffect(() => {
    if (user?.id && !pageLoading) {
      checkExistingCode();
      loadNotifications();
    }
  }, [user?.id, pageLoading]);

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

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

 

  const deleteNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string, status?: string) => {
    if (status) {
      switch (status) {
        case "PENDING":
          return <Clock className="w-5 h-5" />;
        case "PROCESSING":
          return <Package className="w-5 h-5" />;
        case "PACKED":
          return <PackageCheck className="w-5 h-5" />;
        case "SHIPPED":
          return <Truck className="w-5 h-5" />;
        default:
          return <ShoppingBag className="w-5 h-5" />;
      }
    }

    switch (type) {
      case "order":
        return <ShoppingBag className="w-5 h-5" />;
      case "shipping":
        return <Truck className="w-5 h-5" />;
      case "promotion":
        return <Tag className="w-5 h-5" />;
      case "system":
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string, status?: string) => {
    if (status) {
      switch (status) {
        case "PENDING":
          return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
        case "PROCESSING":
          return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
        case "PACKED":
          return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
        case "SHIPPED":
          return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
        default:
          return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      }
    }

    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      case "shipping":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
      case "promotion":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400";
      case "system":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hoy, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays === 1) {
      return `Ayer, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return (
        date.toLocaleDateString() +
        ", " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number.parseFloat(amount));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-blue-600 dark:text-blue-400 mt-4 font-medium">
            Cargando notificaciones...
          </p>
        </div>
      )}

      {!pageLoading && (
        <div className="p-6 md:p-8 space-y-8">
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
                <Bell className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  NOTIFICACIONES
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Centro de{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-400">
                    Mensajes
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
                </span>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {unreadCount} nuevas
                  </span>
                )}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Mantente al día con tus pedidos y ofertas especiales
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={loadNotifications}
                disabled={isLoadingNotifications}
                variant="outline"
                className="gap-2"
              >
                {isLoadingNotifications ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                <span>Actualizar</span>
              </Button>
          
              {notifications.length > 0 && (
                <Button
                  onClick={clearAllNotifications}
                  variant="outline"
                  className="gap-2"
                >
                  <Trash className="w-4 h-4" />
                  <span>Borrar todo</span>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Smartwatch Linking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-l-4 border-blue-500 dark:border-blue-400 border-t border-r border-b overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Watch className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Vincular Smartwatch
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Conecta tu smartwatch para sincronizar datos de salud y
                        fitness
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Smartphone className="w-4 h-4" />
                      <span>Dispositivo</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Instrucciones:
                      </h4>
                      <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>Genera tu código de vinculación único</li>
                        <li>Abre la aplicación de tu smartwatch</li>
                        <li>Ve a configuración {">"} Vincular dispositivo</li>
                        <li>Ingresa el código generado</li>
                        <li>Confirma la conexión en ambos dispositivos</li>
                      </ol>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                      <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                          <Watch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>

                        {isLoadingCode ? (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Verificando código existente...
                            </p>
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-8 border-2 border-dashed border-blue-200 dark:border-blue-700">
                              <div className="flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                          </div>
                        ) : !codeGenerated ? (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Genera tu código único de vinculación
                            </p>
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-8 border-2 border-dashed border-blue-200 dark:border-blue-700">
                              <div className="text-gray-400 dark:text-gray-500 text-center">
                                <Watch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Código no generado</p>
                              </div>
                            </div>
                            <Button
                              onClick={handleGenerateCode}
                              disabled={isGeneratingCode}
                              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                            >
                              {isGeneratingCode ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generando...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4 mr-2" />
                                  Generar Código
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Código de vinculación
                            </p>
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-2 border-dashed border-blue-200 dark:border-blue-700">
                              <div className="flex items-center justify-center gap-2">
                                <div className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider text-center flex-1">
                                  {getDisplayCode()}
                                </div>
                                <button
                                  onClick={toggleCodeVisibility}
                                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  aria-label={
                                    showCode
                                      ? "Ocultar código"
                                      : "Mostrar código"
                                  }
                                >
                                  {showCode ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={copyCodeToClipboard}
                                disabled={!smartwatchCode}
                                variant="outline"
                                className="flex-1 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              >
                                {isCodeCopied ? (
                                  <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copiado
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar
                                  </>
                                )}
                              </Button>
                              <Button
                                onClick={toggleCodeVisibility}
                                variant="outline"
                                size="sm"
                                className="border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                aria-label={
                                  showCode ? "Ocultar código" : "Mostrar código"
                                }
                              >
                                {showCode ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {isLoadingCode
                        ? "Verificando estado..."
                        : codeGenerated
                        ? "Código único generado"
                        : "Listo para generar código de vinculación"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications list */}
          {isLoadingNotifications ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden p-8 text-center"
            >
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">
                  Cargando notificaciones...
                </span>
              </div>
            </motion.div>
          ) : notifications.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    animateContent
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border-l-4 ${
                    notification.read
                      ? "border-gray-200 dark:border-gray-700"
                      : "border-blue-500 dark:border-blue-400"
                  } border-t border-r border-b border-blue-100 dark:border-gray-700`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${getNotificationColor(
                          notification.type,
                          notification.status
                        )}`}
                      >
                        {getNotificationIcon(
                          notification.type,
                          notification.status
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {notification.title}
                              </h3>
                              {notification.totalAmount && (
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium px-2 py-1 rounded-full">
                                  {formatCurrency(notification.totalAmount)}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                              {notification.message}
                            </p>

                            {notification.items &&
                              notification.items.length > 0 && (
                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Productos ({notification.items.length}):
                                  </p>
                                  <div className="space-y-1">
                                    {notification.items
                                      .slice(0, 3)
                                      .map((item, idx) => (
                                        <div
                                          key={idx}
                                          className="text-sm text-gray-600 dark:text-gray-400 flex justify-between"
                                        >
                                          <span>
                                            {item.productName} - {item.color} (
                                            {item.size})
                                          </span>
                                          <span>x{item.quantity}</span>
                                        </div>
                                      ))}
                                    {notification.items.length > 3 && (
                                      <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                                        +{notification.items.length - 3}{" "}
                                        productos más...
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
                                aria-label="Marcar como leído"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              aria-label="Eliminar notificación"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatDate(notification.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
                <Bell className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tienes notificaciones
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Te notificaremos cuando haya actualizaciones sobre tus pedidos o
                promociones especiales.
              </p>
              <div className="mt-6 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800 dark:text-blue-100 flex items-start">
                  <Shield className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span>
                    Las notificaciones te mantendrán informado sobre el estado
                    de tus pedidos, ofertas especiales y actualizaciones
                    importantes.
                  </span>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
