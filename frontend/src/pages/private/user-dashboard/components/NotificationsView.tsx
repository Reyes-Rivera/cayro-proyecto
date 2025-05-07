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
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "order" | "shipping" | "promotion" | "system";
  read: boolean;
};

export default function NotificationsView() {
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Tu pedido ha sido enviado",
      message:
        "El pedido #ORD-12345 ha sido enviado y llegará en 3-5 días hábiles.",
      date: "2025-03-15T10:30:00",
      type: "shipping",
      read: false,
    },
    {
      id: "2",
      title: "Oferta especial",
      message:
        "¡20% de descuento en toda nuestra colección de verano! Válido hasta el 31 de marzo.",
      date: "2025-03-14T15:45:00",
      type: "promotion",
      read: false,
    },
    {
      id: "3",
      title: "Pedido confirmado",
      message:
        "Tu pedido #ORD-12346 ha sido confirmado y está siendo procesado.",
      date: "2025-03-12T09:15:00",
      type: "order",
      read: true,
    },
    {
      id: "4",
      title: "Actualización de sistema",
      message:
        "Hemos actualizado nuestra política de privacidad. Por favor revisa los cambios.",
      date: "2025-03-10T14:20:00",
      type: "system",
      read: true,
    },
  ]);

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

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
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

  const getNotificationIcon = (type: string) => {
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-600";
      case "shipping":
        return "bg-green-100 text-green-600";
      case "promotion":
        return "bg-purple-100 text-purple-600";
      case "system":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <Bell className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-blue-500 mt-4 font-medium">
            Cargando notificaciones...
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
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-blue-100 px-4 py-1.5">
                <Bell className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  NOTIFICACIONES
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Centro de{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600">Mensajes</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                </span>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {unreadCount} nuevas
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">
                Mantente al día con tus pedidos y ofertas especiales
              </p>
            </div>

            <div className="flex gap-3">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Marcar todo como leído</span>
                </Button>
              )}
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

          {/* Notifications list */}
          {notifications.length > 0 ? (
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
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden border-l-4 ${
                    notification.read ? "border-gray-200" : "border-blue-500"
                  } border-t border-r border-b border-blue-100`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                aria-label="Marcar como leído"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="p-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                              aria-label="Eliminar notificación"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center mt-3 text-sm text-gray-500">
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
              className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden p-8 text-center"
            >
              <div className="bg-blue-50 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Bell className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes notificaciones
              </h3>
              <p className="text-gray-600 mb-4">
                Te notificaremos cuando haya actualizaciones sobre tus pedidos o
                promociones especiales.
              </p>
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800 flex items-start">
                  <Shield className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600" />
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
