import type React from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const CartSummary: React.FC = () => {
  const { itemCount, subtotal, shipping, total } = useCart();
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Resumen del carrito
      </h2>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
        <span className="text-gray-900 dark:text-white">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500 dark:text-gray-400">Envío</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </span>
        </div>
        <div className="text-right">
          <span className="text-gray-900 dark:text-white font-medium">
            ${shipping.toFixed(2)}
          </span>
          <p className="text-xs text-gray-400">
            {itemCount <= 5
              ? "1-5 productos"
              : itemCount <= 10
              ? "6-10 productos"
              : itemCount <= 15
              ? "11-15 productos"
              : itemCount <= 20
              ? "16-20 productos"
              : itemCount <= 25
              ? "21-25 productos"
              : `${itemCount} productos`}
          </p>
        </div>
      </div>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      <div className="flex justify-between text-lg font-semibold">
        <span className="text-gray-900 dark:text-white">Total</span>
        <span className="text-gray-900 dark:text-white">
          ${total.toFixed(2)}
        </span>
      </div>

     

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
          <span className="text-gray-500 dark:text-gray-400">
            Envío escalonado según cantidad de productos
          </span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 mr-2"></span>
          <span className="text-gray-500 dark:text-gray-400">
            Costos fijos por rango de cantidad
          </span>
        </div>
      </div>
      <button
      onClick={() => {
        navigate("/checkout");
      }}
      className="w-full mt-6 py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center transition-colors">
        Proceder al pago
      </button>
    </div>
  );
};

export default CartSummary;
