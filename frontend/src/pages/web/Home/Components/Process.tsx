import { ClipboardList, PenTool, Ruler, Truck } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Planeación",
    description: "Evaluamos tus necesidades",
  },
  {
    icon: PenTool,
    title: "Diseño",
    description: "Creamos los modelos",
  },
  {
    icon: Ruler,
    title: "Producción",
    description: "Fabricamos con calidad",
  },
  {
    icon: Truck,
    title: "Entrega",
    description: "Enviamos a tiempo",
  },
];

export default function Process() {
  return (
    <section className="py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h2 className="text-4xl font-extrabold  text-gray-900 dark:text-gray-100  tracking-tight text-center mb-12">
          Nuestro Proceso de Trabajo
        </h2>

        {/* Steps */}
        <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto space-y-12 md:space-y-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center relative group"
              >
                {/* Icon */}
                <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center shadow-lg mb-6">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {step.title}
                </h3>
                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {step.description}
                </p>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[120%] w-24 h-0.5 bg-blue-300 dark:bg-blue-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
