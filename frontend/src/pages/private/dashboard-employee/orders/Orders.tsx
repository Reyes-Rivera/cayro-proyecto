"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getOrders } from "@/api/sales";
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

  const handleUpdateOrderStatus = async (id: number, newStatus: string) => {
    setIsLoading(true);
    try {
      // Here you would call an API to update the order status
      // await updateOrderStatus(id, newStatus);
      await loadOrders(currentFilters);

      Swal.fire({
        title: "¡Éxito!",
        text: "Estado del pedido actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el estado del pedido. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
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
    <div className="px-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {isViewing && selectedOrder ? (
        <div>
          <OrderDetails order={selectedOrder} onBack={handleBack} />
        </div>
      ) : (
        <div>
          <OrderList
            orders={orders}
            totalOrders={totalOrders}
            totalPages={totalPages}
            onView={handleViewOrder}
            onUpdateStatus={handleUpdateOrderStatus}
            onFilterChange={handleFilterChange}
            isTableLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
