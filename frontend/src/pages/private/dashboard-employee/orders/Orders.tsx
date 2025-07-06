"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getOrders } from "@/api/sales";
import { changeStatus, sendTrackingEmail } from "@/api/sales";
import "sweetalert2/dist/sweetalert2.min.css";
import Swal from "sweetalert2";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";

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

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState("");

  const loadOrders = async (params = "") => {
    setIsLoading(true);
    try {
      const response = await getOrders();
      if (response && response.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        setOrders(data);
        setTotalOrders(data.length);
        setTotalPages(Math.ceil(data.length / 10)); // Assuming 10 items per page
        setCurrentFilters(params);
      }
    } catch (error: any) {
      console.error("Error al cargar pedidos:", error);
      if (error.response?.status === 404) {
        setOrders([]);
        setTotalOrders(0);
        setTotalPages(1);
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los pedidos. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(currentFilters || "page=1&limit=10");
  }, []);

  const handleViewOrder = async (id: number) => {
    setSelectedOrder({ id } as Order); // Just pass the ID
    setIsViewing(true);
  };

  const handleUpdateOrderStatus = async (statusData: StatusUpdateData) => {
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
          // Find the order to get customer details
          const order = orders.find((o) => o.id === statusData.id);
          if (order) {
            // Get default address
            const defaultAddress = order.user.userAddresses.find(
              (ua) => ua.isDefault
            );

            // Prepare complete order data for email
            const emailData = {
              // Basic order info
              orderId: order.id,
              saleReference: order.saleReference,
              customerEmail: order.user.email,
              customerName: `${order.user.name} ${order.user.surname}`,
              customerPhone: order.user.phone || "No proporcionado",

              // Tracking info
              trackingNumber: statusData.trackingNumber,
              shippingCompany: statusData.shippingCompany,

              // Address information
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

              // References and additional info
              references: order.references || "Sin referencias",
              betweenStreets: {
                streetOne: order.betweenStreetOne || "",
                streetTwo: order.betweenStreetTwo || "",
              },

              // Order financial details
              subtotalAmount: Number.parseFloat(order.subtotalAmount),
              shippingCost: Number.parseFloat(order.shippingCost),
              totalAmount: Number.parseFloat(order.totalAmount),

              // Formatted currency amounts
              subtotalFormatted: new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(Number.parseFloat(order.subtotalAmount)),
              shippingCostFormatted: new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(Number.parseFloat(order.shippingCost)),
              totalAmountFormatted: new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
              }).format(Number.parseFloat(order.totalAmount)),

              // Product details
              products: order.saleDetails.map((detail, index) => ({
                id: index + 1,
                name: detail.productVariant.product.name,
                color: detail.productVariant.color.name,
                size: detail.productVariant.size.name,
                barcode: detail.productVariant.barcode,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                totalPrice: detail.totalPrice,
                unitPriceFormatted: new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(detail.unitPrice),
                totalPriceFormatted: new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(detail.totalPrice),
              })),

              // Order summary
              totalItems: order.saleDetails.reduce(
                (sum, detail) => sum + detail.quantity,
                0
              ),
              totalProducts: order.saleDetails.length,

              // Dates
              orderDate: new Date(order.createdAt).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              shippedDate: new Date().toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
            await sendTrackingEmail(emailData);
          }
        } catch (emailError) {
          Swal.fire({
            title: "Error",
            text: "No se pudo enviar el correo de rastreo.",
            icon: "error",
            confirmButtonColor: "#2563eb",
          });
          console.error("Error sending tracking email:", emailError);
          return false;
          // Don't fail the status update if email fails
        }
      }

      await loadOrders(currentFilters);

      Swal.fire({
        title: "¡Éxito!",
        text:
          statusData.status === "SHIPPED"
            ? "Estado actualizado y correo de rastreo enviado correctamente"
            : "Estado del pedido actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el estado del pedido. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedOrder(null);
    setIsViewing(false);
  };

  const handleFilterChange = (filterParams: string) => {
    loadOrders(filterParams);
  };

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isViewing && selectedOrder ? (
        <div>
          <OrderDetails
            order={selectedOrder}
            onBack={handleBack}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        </div>
      ) : (
        <div>
          <OrderList
            orders={orders}
            totalOrders={totalOrders}
            totalPages={totalPages}
            onView={handleViewOrder}
            onFilterChange={handleFilterChange}
            isTableLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
