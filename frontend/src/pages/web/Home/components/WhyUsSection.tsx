"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { memo } from "react";

interface WhyUsSectionProps {
  imgWhyUs: string;
}

const WhyUsSection = ({ imgWhyUs }: WhyUsSectionProps) => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-full">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
          >
            NUESTRA DIFERENCIA
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            ¿Por Qué Elegirnos?
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1 bg-blue-600 mx-auto mt-6"
          ></motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenedor de la imagen */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full z-0"></div>
              <img
                src={imgWhyUs || "/placeholder.svg"}
                alt="Nuestro equipo"
                width={500}
                height={500}
                className="rounded-lg shadow-xl relative z-10"
                loading="lazy"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  Calidad Garantizada
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Contenedor de los beneficios */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
              <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                Calidad Premium
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Utilizamos los mejores materiales para garantizar la durabilidad
                y comodidad de nuestras prendas.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
              <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                Diseño Único
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nuestros diseñadores crean piezas exclusivas que no encontrarás
                en ningún otro lugar.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
              <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                Sostenibilidad
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprometidos con el medio ambiente, utilizamos procesos de
                producción responsables.
              </p>
            </div>
            <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
              <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                Precios Justos
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Ofrecemos la mejor relación calidad-precio del mercado sin
                intermediarios.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(WhyUsSection);
