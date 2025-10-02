"use client";
import type React from "react";
import img from "@/assets/404 Page Not Found (1).png";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4 sm:p-6 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div
          className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-[60%] right-10 w-72 h-72 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row items-stretch w-full max-w-6xl lg:gap-16 relative z-10 border border-gray-100 dark:border-gray-700"
        >
          {/* Sección Izquierda: Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center mb-8 lg:mb-0"
          >
            <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center relative">
              {/* Círculo decorativo detrás de la imagen */}
              <div
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-full transform -translate-x-4 -translate-y-4 z-0"
                aria-hidden="true"
              ></div>

              <motion.img
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 5,
                  ease: "easeInOut",
                }}
                src={img}
                alt="404 — Página no encontrada"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Sección Derecha: Contenido */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 mx-auto lg:mx-0"
            >
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                PÁGINA NO ENCONTRADA
              </span>
            </motion.div>

            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 10,
                delay: 0.6,
              }}
              className="text-7xl sm:text-8xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text"
            >
              404
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100 font-semibold"
            >
              Parece que estás perdido.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-400"
            >
              La página que buscas no está disponible o ha sido movida.
            </motion.p>

            {/* Botón para ir al inicio (Link estilizado, sin anidar dentro de button) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="pt-6 flex justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  <span>Ir al Inicio</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Mensaje adicional */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-sm text-gray-500 dark:text-gray-500 mt-8 text-center lg:text-left"
            >
              Si crees que esto es un error, por favor contacta al soporte
              técnico.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default PageNotFound;
