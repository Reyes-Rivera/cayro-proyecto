import type { CheckoutStep } from "@/types/checkout";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

export default function CheckoutProgress({
  currentStep,
}: CheckoutProgressProps) {
  const steps = [
    { id: "shipping", name: "Envío", number: 1 },
    { id: "shipping-details", name: "Detalles", number: 2 },
    { id: "payment", name: "Pago", number: 3 },
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex((step) => step.id === currentStep);
    const stepIndex = steps.findIndex((step) => step.id === stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    getStepStatus(step.id) === "completed" ||
                    getStepStatus(step.id) === "current"
                      ? "bg-blue-600 dark:bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {step.number}
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-4 ${
                    getStepStatus(steps[index + 1].id) === "completed" ||
                    getStepStatus(steps[index + 1].id) === "current"
                      ? "bg-blue-600 dark:bg-blue-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
