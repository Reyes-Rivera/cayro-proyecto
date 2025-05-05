import type { CheckoutStep } from "@/types/checkout";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

export default function CheckoutProgress({
  currentStep,
}: CheckoutProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ["shipping", "payment", "confirmation"].includes(currentStep)
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              1
            </div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Envío
            </span>
          </div>
          <div
            className={`w-12 h-1 ${
              ["payment", "confirmation"].includes(currentStep)
                ? "bg-blue-600 dark:bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ["payment", "confirmation"].includes(currentStep)
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              2
            </div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Pago
            </span>
          </div>
          <div
            className={`w-12 h-1 ${
              ["confirmation"].includes(currentStep)
                ? "bg-blue-600 dark:bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ["confirmation"].includes(currentStep)
                  ? "bg-blue-600 dark:bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              3
            </div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Confirmación
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
