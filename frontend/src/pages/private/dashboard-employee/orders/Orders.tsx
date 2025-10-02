"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getOrders } from "@/api/sales";
import { changeStatus, sendTrackingEmail } from "@/api/sales";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";
import { AlertHelper } from "@/utils/alert.util";

export interface Order {
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
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    userAddresses: Array<{
      id: number;
      userId: number;
      addressId: number;
      isDefault: boolean;
      address: {
        id: number;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        colony: string;
      };
    }>;
  };
  saleDetails: Array<{
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productVariant: {
      barcode: string;
      price: number;
      product: {
        name: string;
      };
      color: {
        name: string;
      };
      size: {
        name: string;
      };
    };
  }>;
}

export interface StatusUpdateData {
  id: number;
  status: string;
  userId: number;
  trackingNumber?: string;
  shippingCompany?: string;
}

// Memoizar formateador de moneda para mejor performance
const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState("");

  // Memoizar la carga de órdenes
  const loadOrders = useCallback(async (params = "") => {
    setIsLoading(true);
    try {
      const response = await getOrders();
      if (response?.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        setOrders(data);
        setTotalOrders(data.length);
        setTotalPages(Math.ceil(data.length / 10));
        setCurrentFilters(params);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      } else {
        AlertHelper.error({
          title: "Error al cargar los pedidos",
          message: "No se pudieron cargar los pedidos. Inténtalo de nuevo.",
          isModal: true,
          animation: "bounce",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto optimizado para carga inicial
  useEffect(() => {
    loadOrders(currentFilters || "page=1&limit=10");
  }, [loadOrders, currentFilters]);

  // Memoizar manejador de vista de orden
  const handleViewOrder = useCallback(
    async (id: number) => {
      const order = orders.find((o) => o.id === id);
      if (order) {
        setSelectedOrder(order);
        setIsViewing(true);
      }
    },
    [orders]
  );

  // Memoizar manejador de actualización de estado
  const handleUpdateOrderStatus = useCallback(
    async (statusData: StatusUpdateData): Promise<boolean> => {
      setIsLoading(true);
      try {
        // Update order status
        await changeStatus(statusData);

        // Send tracking email if status is SHIPPED
        if (
          statusData.status === "SHIPPED" &&
          statusData.trackingNumber &&
          statusData.shippingCompany
        ) {
          try {
            const order = orders.find((o) => o.id === statusData.id);
            if (order) {
              const defaultAddress = order.user.userAddresses.find(
                (ua) => ua.isDefault
              );

              // Memoizar cálculos de productos
              const productsData = order.saleDetails.map((detail, index) => ({
                id: index + 1,
                name: detail.productVariant.product.name,
                color: detail.productVariant.color.name,
                size: detail.productVariant.size.name,
                barcode: detail.productVariant.barcode,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                totalPrice: detail.totalPrice,
                unitPriceFormatted: currencyFormatter.format(detail.unitPrice),
                totalPriceFormatted: currencyFormatter.format(
                  detail.totalPrice
                ),
              }));

              const subtotalAmount = Number.parseFloat(order.subtotalAmount);
              const shippingCost = Number.parseFloat(order.shippingCost);
              const totalAmount = Number.parseFloat(order.totalAmount);

              const emailData = {
                orderId: order.id,
                saleReference: order.saleReference,
                customerEmail: order.user.email,
                customerName: `${order.user.name} ${order.user.surname}`,
                customerPhone: order.user.phone || "No proporcionado",
                trackingNumber: statusData.trackingNumber,
                shippingCompany: statusData.shippingCompany,
                shippingAddress: defaultAddress
                  ? {
                      street: defaultAddress.address.street,
                      colony: defaultAddress.address.colony,
                      city: defaultAddress.address.city,
                      state: defaultAddress.address.state,
                      country: defaultAddress.address.country,
                      postalCode: defaultAddress.address.postalCode,
                      fullAddress: `${defaultAddress.address.street}, ${defaultAddress.address.colony}, ${defaultAddress.address.city}, ${defaultAddress.address.state}, CP: ${defaultAddress.address.postalCode}, ${defaultAddress.address.country}`,
                    }
                  : null,
                references: order.references || "Sin referencias",
                betweenStreets: {
                  streetOne: order.betweenStreetOne || "",
                  streetTwo: order.betweenStreetTwo || "",
                },
                subtotalAmount,
                shippingCost,
                totalAmount,
                subtotalFormatted: currencyFormatter.format(subtotalAmount),
                shippingCostFormatted: currencyFormatter.format(shippingCost),
                totalAmountFormatted: currencyFormatter.format(totalAmount),
                products: productsData,
                totalItems: order.saleDetails.reduce(
                  (sum, detail) => sum + detail.quantity,
                  0
                ),
                totalProducts: order.saleDetails.length,
                orderDate: dateFormatter.format(new Date(order.createdAt)),
                shippedDate: dateFormatter.format(new Date()),
              };

              await sendTrackingEmail(emailData);
            }
          } catch (emailError: any) {
            AlertHelper.error({
              title: "Error",
              message:
                emailError.response?.data?.message ||
                "No se pudo enviar el correo de rastreo.",
              isModal: true,
              animation: "bounce",
            });
            return false;
          }
        }

        await loadOrders(currentFilters);

        await AlertHelper.success({
          title: "¡Éxito!",
          message:
            statusData.status === "SHIPPED"
              ? "Estado actualizado y correo de rastreo enviado correctamente."
              : "Estado del pedido actualizado correctamente.",
          timer: 3000,
          animation: "slideIn",
        });

        return true;
      } catch (error: any) {
        AlertHelper.error({
          title: "Error",
          message:
            error.response?.data?.message ||
            "No se pudo actualizar el estado del pedido. Inténtalo de nuevo.",
          isModal: true,
          animation: "bounce",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [orders, currentFilters, loadOrders]
  );

  // Memoizar manejador de retroceso
  const handleBack = useCallback(() => {
    setSelectedOrder(null);
    setIsViewing(false);
  }, []);

  // Memoizar manejador de filtros
  const handleFilterChange = useCallback(
    (filterParams: string) => {
      loadOrders(filterParams);
    },
    [loadOrders]
  );

  // Memoizar props para OrderList para evitar re-renders innecesarios
  const orderListProps = useMemo(
    () => ({
      orders,
      totalOrders,
      totalPages,
      onView: handleViewOrder,
      onFilterChange: handleFilterChange,
      isTableLoading: isLoading,
    }),
    [
      orders,
      totalOrders,
      totalPages,
      handleViewOrder,
      handleFilterChange,
      isLoading,
    ]
  );

  // Memoizar props para OrderDetails
  const orderDetailsProps = useMemo(
    () => ({
      order: selectedOrder!,
      onBack: handleBack,
      onUpdateStatus: handleUpdateOrderStatus,
    }),
    [selectedOrder, handleBack, handleUpdateOrderStatus]
  );

  return (
    <div
      className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen"
      role="main"
      aria-label="Gestión de pedidos"
    >
      {isViewing && selectedOrder ? (
        <section aria-labelledby="order-details-heading" role="region">
          <h2 id="order-details-heading" className="sr-only">
            Detalles del pedido
          </h2>
          <OrderDetails {...orderDetailsProps} />
        </section>
      ) : (
        <section aria-labelledby="orders-list-heading" role="region">
          <h2 id="orders-list-heading" className="sr-only">
            Lista de pedidos
          </h2>
          <OrderList {...orderListProps} />
        </section>
      )}
    </div>
  );
};

export default Orders;
