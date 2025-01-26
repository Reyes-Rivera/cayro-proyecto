"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Ruler, Palette, Users, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Ruler,
    title: "Medidas Personalizadas",
    description: "Ajustamos cada uniforme a las medidas exactas que necesitas",
  },
  {
    icon: Palette,
    title: "Diseño a tu Gusto",
    description: "Elige colores, estilos y detalles que representen tu institución",
  },
  {
    icon: Users,
    title: "Pedidos por Volumen",
    description: "Precios especiales para pedidos grandes",
  },
  {
    icon: CheckCircle2,
    title: "Garantía de Calidad",
    description: "Aseguramos la mejor calidad en cada prenda",
  },
];

export default function CustomOrder() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl font-extrabold  text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                  ¿Necesitas un pedido personalizado?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-4">
                  Creamos uniformes a medida para tu institución educativa. Desde el diseño hasta la entrega,
                  nos aseguramos de que cada detalle cumpla con tus expectativas.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{feature.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Solicitar presupuesto
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/placeholder.svg?height=600&width=500"
                alt="Uniformes personalizados"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute bottom-6 left-6 right-6 bg-white dark:bg-gray-800 backdrop-blur-sm p-6 rounded-xl shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
                      Más de 500 escuelas
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Confían en nosotros para sus uniformes escolares
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
           
          </motion.div>
        </div>
      </div>
    </section>
  );
}
