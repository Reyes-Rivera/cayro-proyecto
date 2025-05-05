"use client";

interface ShippingMethodSectionProps {
  shippingMethod: "standard" | "express";
  setShippingMethod: (method: "standard" | "express") => void;
  subtotal: number;
}

export default function ShippingMethodSection({
  shippingMethod,
  setShippingMethod,
  subtotal,
}: ShippingMethodSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
        Método de envío
      </h3>

      <div className="space-y-3">
        <label
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
            shippingMethod === "standard"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-700"
          }`}
        >
          <input
            type="radio"
            name="shippingMethod"
            value="standard"
            checked={shippingMethod === "standard"}
            onChange={() => setShippingMethod("standard")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
          />
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Envío estándar
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {subtotal > 100 ? "Gratis" : "$10.00"}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrega en 3-5 días hábiles
            </p>
          </div>
        </label>

        <label
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
            shippingMethod === "express"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-700"
          }`}
        >
          <input
            type="radio"
            name="shippingMethod"
            value="express"
            checked={shippingMethod === "express"}
            onChange={() => setShippingMethod("express")}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700"
          />
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Envío express
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                $25.00
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entrega en 1-2 días hábiles
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
