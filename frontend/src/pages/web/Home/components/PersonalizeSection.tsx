"use client";

import { motion } from "framer-motion";
import { Sparkles, Shirt, ArrowRight } from "lucide-react";
import { memo } from "react";
import { NavLink } from "react-router-dom";

const PersonalizeSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg
          className="absolute top-0 right-0 w-full h-full text-blue-500/5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots-pattern"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 space-y-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              PERSONALIZACIÓN
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
            >
              Personaliza Tus Prendas
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              Crea ropa única que refleje tu personalidad. Nuestro servicio de
              personalización te permite diseñar prendas exclusivas.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6 mb-10"
            >
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start"
              >
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow-md">
                  <Shirt className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    Elige tu modelo
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Selecciona entre nuestra amplia variedad de prendas base
                  </p>
                </div>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-start"
              >
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow-md">
                  <Shirt className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    Personaliza el diseño
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Selecciona colores, estampados y acabados a tu gusto
                  </p>
                </div>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-start"
              >
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow-md">
                  <Shirt className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                    Añade tu toque personal
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Incorpora textos, imágenes o diseños propios a tu prenda
                  </p>
                </div>
              </motion.li>
            </motion.ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <NavLink
                to="/personalizar"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg inline-flex items-center"
              >
                <span className="flex items-center">
                  Personalizar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </NavLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute inset-0 border-2 border-blue-600 rounded-lg transform translate-x-4 translate-y-4 z-0"></div>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Q49vZR0UMyJ1pUOf2YISmDj6wcaP2f.png"
                alt="Personalización de ropa"
                width={600}
                height={600}
                className="rounded-lg shadow-xl relative z-10"
                loading="lazy"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute top-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  ¡Diseño Único!
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(PersonalizeSection);
