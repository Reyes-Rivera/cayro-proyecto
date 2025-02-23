import { motion } from "framer-motion";
import { Shield, Truck, Headphones, RefreshCw } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Garantía de Calidad",
    description: "Materiales premium y acabados perfectos en cada prenda.",
  },
  {
    icon: Truck,
    title: "Envío Rápido",
    description: "Entrega garantizada en tiempo y forma para inicio de clases.",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description: "Equipo de atención al cliente siempre disponible para ayudarte.",
  },
  {
    icon: RefreshCw,
    title: "Cambios Sencillos",
    description: "Política de cambios flexible para tu tranquilidad.",
  },
];

export default function Benefits() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Lista de beneficios */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="flex flex-col items-center text-center" // Contenido centrado
              >
                {/* Icono con fondo dinámico */}
                <div
                  className={`w-16 h-16 border-2 border-blue-600 rounded-full flex items-center justify-center mb-6`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                {/* Título */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {benefit.title}
                </h3>
                {/* Descripción */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}