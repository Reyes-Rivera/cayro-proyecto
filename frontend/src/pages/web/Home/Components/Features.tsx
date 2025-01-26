import { motion } from "framer-motion";
import { Shield, Users, Clock, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Materiales Premium",
    description:
      "Utilizamos telas de la más alta calidad para garantizar durabilidad y comodidad.",
  },
  {
    icon: Users,
    title: "Diseño Personalizado",
    description:
      "Adaptamos los uniformes según los requisitos específicos de tu institución.",
  },
  {
    icon: Clock,
    title: "Entrega Puntual",
    description:
      "Garantizamos la entrega a tiempo para el inicio del ciclo escolar.",
  },
  {
    icon: HeartHandshake,
    title: "Soporte Dedicado",
    description:
      "Equipo de atención al cliente disponible para resolver tus dudas.",
  },
];

export default function Features() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-16 tracking-tight"
        >
          ¿Por qué elegirnos?
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-4 bg-blue-100 dark:bg-blue-600 rounded-full mb-6">
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-200 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
