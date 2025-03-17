"use client";

import { currentTerm } from "@/api/terms";
import type { DocumentInterface } from "./DocumentInterface";
import { useEffect, useState } from "react";
import heroImage from "../Home/assets/hero.jpg";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Info,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  FileText,
  Loader2,
  ScrollText,
  MessageSquare,
} from "lucide-react";

export default function Terms() {
  const [terms, setTerms] = useState<DocumentInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToContent = () => {
    const termsSection = document.getElementById("terms-content");
    if (termsSection) {
      termsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const getTerms = async () => {
      setIsLoading(true);
      try {
        const res = await currentTerm();
        setTerms([res.data]);
      } catch (error) {
        console.error("Error fetching terms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getTerms();
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative z-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-screen flex flex-col justify-center">
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
            transform: `translateY(${scrollY * 0.2}px)`,
            filter: "brightness(0.85)",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
        </div>

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

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col justify-center flex-grow">
          <div className="grid md:grid-cols-1 gap-8 items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-white space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center rounded-full bg-blue-600/30 backdrop-blur-sm border border-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-100"
              >
                INFORMACIÓN LEGAL
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                <span className="block">Términos y</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                  Condiciones
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                Información importante sobre el uso de nuestros servicios y
                productos
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center overflow-hidden relative"
                  onClick={scrollToContent}
                >
                  <span className="relative z-10 flex items-center">
                    Ver términos completos
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.button>

                <motion.a
                  href="/contacto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 flex items-center justify-center overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Contactar soporte
                  </span>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToContent}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-white/80 text-sm font-medium">Descubre más</p>
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-white/80 to-white/0" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div
        id="terms-content"
        className="container mx-auto px-6 pt-20 relative z-10"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 relative mb-20"
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
                  <Book className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
                  <p className="text-blue-100">
                    Última actualización:{" "}
                    {terms[0]?.updatedAt
                      ? formatDate(terms[0].updatedAt)
                      : "No disponible"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-blue-50 max-w-3xl">
                Este documento establece los términos y condiciones bajo los
                cuales puedes utilizar nuestros servicios y productos. Al
                acceder o utilizar nuestro sitio web, aceptas estos términos en
                su totalidad.
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
              ) : terms?.length > 0 && terms[0]?.content ? (
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
                          Resumen del documento
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          Este documento establece los términos y condiciones
                          que rigen el uso de nuestros productos y servicios. Te
                          recomendamos leerlo detenidamente antes de utilizar
                          nuestro sitio web o realizar cualquier compra.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Contenido principal */}
                  <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                    <AnimatePresence>
                      {terms[0].content.split("\n").map((section, index) => {
                        // Detectamos secciones con "Sección N – Título"
                        const match = section.match(
                          /^(Sección \d+\s–)\s*(.+)$/
                        );

                        if (match) {
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.05 * index,
                              }}
                              className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"
                            >
                              <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                {match[1]}{" "}
                                <span className="ml-2">{match[2]}</span>
                              </h2>
                            </motion.div>
                          );
                        }

                        // Resaltamos texto antes de ":" en negritas
                        const colonMatch = section.match(/^(.+?):\s*(.+)$/);
                        if (colonMatch) {
                          return (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.05 * index,
                              }}
                              className="mb-4"
                            >
                              <span className="font-bold text-gray-900 dark:text-white">
                                {colonMatch[1]}:
                              </span>{" "}
                              {colonMatch[2]}
                            </motion.p>
                          );
                        }

                        // Detectamos preguntas
                        const questionMatch = section.match(/(.+\?)\s*(.+)$/);
                        if (questionMatch) {
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.05 * index,
                              }}
                              className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-sm"
                            >
                              <p className="font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full mr-2">
                                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                {questionMatch[1]}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                {questionMatch[2]}
                              </p>
                            </motion.div>
                          );
                        }

                        // Detectamos incisos como "a)", "b)", "1)", etc.
                        const itemMatch = section.match(
                          /^([a-z0-9]+\))\s*(.+)$/i
                        );
                        if (itemMatch) {
                          return (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.05 * index,
                              }}
                              className="pl-6 mb-4 flex"
                            >
                              <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">
                                {itemMatch[1]}
                              </span>
                              <span>{itemMatch[2]}</span>
                            </motion.p>
                          );
                        }

                        // Renderizamos texto normal
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
                    En este momento no podemos mostrar los términos y
                    condiciones. Por favor, intenta nuevamente más tarde.
                  </p>
                </div>
              )}
            </div>

            {/* Footer del documento */}
            {terms?.length > 0 && terms[0]?.content && (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-t border-gray-200 dark:border-gray-700 relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="bg-gray-200 dark:bg-gray-600 p-1.5 rounded-full mr-2">
                      <Clock className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </div>
                    <span className="text-sm">
                      Última actualización:{" "}
                      {terms[0]?.updatedAt
                        ? formatDate(terms[0].updatedAt)
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
                <ScrollText className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Tienes preguntas sobre nuestros términos y condiciones?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Si necesitas aclarar algún punto o tienes dudas sobre este
                documento, nuestro equipo está disponible para ayudarte.
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
