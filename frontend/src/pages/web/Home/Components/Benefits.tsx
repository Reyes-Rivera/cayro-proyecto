import { motion } from "framer-motion";
import { Shield, Truck, Headphones, RefreshCw } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Garantía de Calidad",
    description: "Materiales premium y acabados perfectos en cada prenda.",
    bgColor: "bg-blue-100 dark:bg-blue-700", // Fondo azul
  },
  {
    icon: Truck,
    title: "Envío Rápido",
    description: "Entrega garantizada en tiempo y forma para inicio de clases.",
    bgColor: "bg-green-100 dark:bg-green-700", // Fondo verde
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description: "Equipo de atención al cliente siempre disponible para ayudarte.",
    bgColor: "bg-yellow-100 dark:bg-yellow-700", // Fondo amarillo
  },
  {
    icon: RefreshCw,
    title: "Cambios Sencillos",
    description: "Política de cambios flexible para tu tranquilidad.",
    bgColor: "bg-red-100 dark:bg-red-700", // Fondo rojo
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
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Título y descripción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            Nuestros Beneficios
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre por qué somos la mejor opción para los uniformes de tu institución.
          </p>
        </motion.div>

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
                className="bg-white dark:bg-gray-700 rounded-xl p-8 transform transition-transform duration-300 hover:-translate-y-2 shadow-lg"
              >
                {/* Icono con fondo dinámico */}
                <div
                  className={`w-12 h-12 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-6`}
                >
                  <Icon className="w-6 h-6 " />
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
