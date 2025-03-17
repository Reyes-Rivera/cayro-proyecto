"use client";

import { useEffect, useState } from "react";
import { boundaryApi } from "@/api/policy";
import type { DocumentInterface } from "./DocumentInterface";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "../Home/assets/hero.jpg";
import {
  Scale,
  Info,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Loader2,
  Shield,
} from "lucide-react";

export default function LegalBoundary() {
  const [document, setDocument] = useState<DocumentInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDocument = async () => {
      setIsLoading(true);
      try {
        const res = await boundaryApi();
        setDocument([res.data]);
      } catch (error) {
        console.error("Error fetching legal boundary:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getDocument();
  }, []);

  // Función para formatear la fecha de última actualización
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen  dark:bg-gray-900  pt-14">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate={{ opacity: 1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.8 } },
        }}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center 30%",
        }}
        className="relative py-20 h-[500px] bg-cover bg-no-repeat bg-fixed"
      >
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-blue-400 rounded-full opacity-70"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [null, "-100%"],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative container mx-auto px-6 flex flex-col items-center justify-center h-full text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center rounded-full bg-blue-600/30 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-100 mb-6 border border-blue-500/20"
          >
            INFORMACIÓN LEGAL
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl"
          >
            Deslinde Legal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg text-blue-50 max-w-2xl mb-8"
          >
            Información importante sobre nuestras responsabilidades y
            limitaciones legales
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-white [&_*]:!text-white flex justify-center"
          >
            <Breadcrumbs />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
            </div>

            {/* Document Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 duration-300">
                  <Scale className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Deslinde Legal</h2>
                  <p className="text-blue-100">
                    Última actualización:{" "}
                    {document[0]?.updatedAt
                      ? formatDate(document[0].updatedAt)
                      : "No disponible"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-blue-50 max-w-3xl">
                Este documento establece los límites de nuestra responsabilidad
                legal y las condiciones bajo las cuales ofrecemos nuestros
                productos y servicios.
              </p>
            </div>

            {/* Document Content */}
            <div className="p-8 lg:p-12 bg-white dark:bg-gray-800 relative z-10">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
                    <Loader2 className="w-12 h-12 animate-spin" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Cargando documento...
                  </p>
                </div>
              ) : document?.length > 0 && document[0]?.content ? (
                <div className="space-y-8">
                  {/* Resumen informativo */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-600 mb-8 shadow-md"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-800/50 p-2 rounded-full mr-4 mt-1 flex-shrink-0">
                        <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                          Información importante
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          Este documento contiene información legal relevante
                          sobre nuestras responsabilidades y limitaciones. Te
                          recomendamos leerlo detenidamente antes de utilizar
                          nuestros productos o servicios.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Contenido principal */}
                  <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                    <AnimatePresence>
                      {document[0].content.split("\n").map((section, index) => {
                        // Identificar líneas con títulos que terminan en ":"
                        const colonMatch = section.match(/^(.+?):$/);

                        if (colonMatch) {
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.05 * index,
                              }}
                              className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2"
                            >
                              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                {colonMatch[1]}:
                              </h2>
                            </motion.div>
                          );
                        }

                        // Renderizar texto normal después de títulos
                        return section.trim() ? (
                          <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 * index }}
                            className="mb-4 text-gray-700 dark:text-gray-300"
                          >
                            {section}
                          </motion.p>
                        ) : (
                          <div key={index} className="my-4"></div>
                        ); // Espacio para líneas vacías
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full mb-4">
                    <AlertTriangle className="w-12 h-12 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No hay información disponible
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    En este momento no podemos mostrar el deslinde legal. Por
                    favor, intenta nuevamente más tarde.
                  </p>
                </div>
              )}
            </div>

            {/* Footer del documento */}
            {document?.length > 0 && document[0]?.content && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-t border-gray-200 dark:border-gray-700 relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="bg-gray-200 dark:bg-gray-600 p-1.5 rounded-full mr-2">
                      <Clock className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </div>
                    <span className="text-sm">
                      Última actualización:{" "}
                      {document[0]?.updatedAt
                        ? formatDate(document[0].updatedAt)
                        : "No disponible"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full mr-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Este documento es de carácter legal y establece los
                      términos de uso de nuestros servicios.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Sección de contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 mb-20 bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-full shadow-md mb-6">
                <Shield className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Necesitas aclarar algún punto sobre nuestro deslinde legal?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Si tienes dudas sobre cualquier aspecto de este documento o
                necesitas información adicional, nuestro equipo está disponible
                para ayudarte.
              </p>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="/contacto"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-colors shadow-md"
              >
                Contáctanos
                <ChevronRight className="ml-2 w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
