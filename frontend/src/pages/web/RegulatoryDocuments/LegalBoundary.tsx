"use client";

import type React from "react";

import { useEffect, useState, useRef, memo } from "react";
import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
} from "framer-motion";
import { boundaryApi } from "@/api/policy";
import type { DocumentInterface } from "./DocumentInterface";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
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
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Animated Section Component
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection = memo(
  ({ children, className, id }: AnimatedSectionProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
      if (isInView) {
        mainControls.start("visible");
      }
    }, [isInView, mainControls]);

    return (
      <motion.section
        id={id}
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 50 }, // Reduced distance for smoother animation
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.3, ease: "easeOut" }} // Reduced duration
        className={className}
      >
        {children}
      </motion.section>
    );
  }
);
AnimatedSection.displayName = "AnimatedSection";

export default function LegalBoundary() {
  const [documents, setDocuments] = useState<DocumentInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateHero, setAnimateHero] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulamos la carga de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      // Activamos las animaciones del hero después de que la pantalla de carga desaparezca
      setTimeout(() => {
        setAnimateHero(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll function - Optimized to use requestAnimationFrame
  const scrollToContent = () => {
    const contentSection = document.getElementById("legal-content");
    if (contentSection) {
      const startPosition = window.pageYOffset;
      const targetPosition =
        contentSection.getBoundingClientRect().top + window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 500; // ms
      let startTime: number | null = null;

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = (t: number) =>
          t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

        window.scrollTo(0, startPosition + distance * ease(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  };

  useEffect(() => {
    const getDocument = async () => {
      setIsLoading(true);
      try {
        const res = await boundaryApi();
        setDocuments([res.data]);
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

  // Loading Component - Memoized to prevent unnecessary re-renders
  const LoadingScreen = memo(() => {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
          Cargando...
        </p>
      </div>
    );
  });
  LoadingScreen.displayName = "LoadingScreen";

  return (
    <>
      {isPageLoading && <LoadingScreen />}
      <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center">
          {/* Background decoration - Enhanced with about page style */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/80 to-transparent dark:from-blue-950/20 dark:to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-70 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-60 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 py-16 relative z-10 max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                }
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={
                    animateHero ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      animateHero
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
                  >
                    <Scale className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      INFORMACIÓN LEGAL
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={
                      animateHero
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -20 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  >
                    Deslinde{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-blue-600">Legal</span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                    </span>
                  </motion.h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg"
                >
                  Información importante sobre nuestras responsabilidades y
                  limitaciones legales. Este documento establece los términos y
                  condiciones bajo los cuales ofrecemos nuestros productos y
                  servicios.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    animateHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                    onClick={scrollToContent}
                  >
                    <span className="flex items-center">
                      Leer documento
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </motion.button>

                  <motion.a
                    href="/contacto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Contactar soporte
                  </motion.a>
                </motion.div>
                <Breadcrumbs />
              </motion.div>

              {/* Right column - Document Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                }
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Main featured document preview */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    animateHero ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-20 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-blue-700"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="ml-auto">
                        <Scale className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-white/20 p-3 rounded-full">
                        <Scale className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Deslinde Legal
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white/60 text-sm mb-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="font-medium">Responsabilidades</span>
                        </div>
                        <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white/60 text-sm mb-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="font-medium">Limitaciones</span>
                        </div>
                        <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white/60 text-sm mb-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span className="font-medium">Términos de uso</span>
                        </div>
                        <div className="h-2 w-1/2 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-2 w-3/4 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                      </div>

                      <div className="bg-white text-blue-600 text-center py-2 rounded-lg font-medium flex items-center justify-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Leer documento completo
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative elements - Enhanced with about page style */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>

                {/* Document pages stack effect */}
                <motion.div
                  initial={{ opacity: 0, x: 10, y: 10 }}
                  animate={
                    animateHero
                      ? { opacity: 0.7, x: 15, y: 15 }
                      : { opacity: 0, x: 10, y: 10 }
                  }
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute top-4 -right-4 w-full h-full bg-blue-500/30 dark:bg-blue-700/30 rounded-2xl -z-10"
                ></motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={
                    animateHero
                      ? { opacity: 0.5, x: 30, y: 30 }
                      : { opacity: 0, x: 20, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="absolute top-4 -right-4 w-full h-full bg-blue-500/20 dark:bg-blue-700/20 rounded-2xl -z-20"
                ></motion.div>

                {/* Floating badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={
                    animateHero
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.8, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      Documento Oficial
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator - Enhanced with about page style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
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
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Descubre más
              </p>
              <motion.div
                animate={{
                  y: [0, 5, 0],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700"
              >
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Document Content Section */}
        <AnimatedSection
          id="legal-content"
          className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
        >
          {/* Background decoration - Enhanced with about page style */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full"></div>
            <svg
              className="absolute top-0 left-0 w-full h-full text-blue-500/5 opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="grid-pattern"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 0 L40 0 L40 40 L0 40 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
                DOCUMENTO LEGAL
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Deslinde <span className="text-blue-600">Legal</span>
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "6rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-1 bg-blue-600 mx-auto mt-6"
              ></motion.div>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
              >
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
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
                        {documents[0]?.updatedAt
                          ? formatDate(documents[0].updatedAt)
                          : "No disponible"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-blue-50 max-w-3xl">
                    Este documento establece los límites de nuestra
                    responsabilidad legal y las condiciones bajo las cuales
                    ofrecemos nuestros productos y servicios.
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
                  ) : documents?.length > 0 && documents[0]?.content ? (
                    <div className="space-y-8">
                      {/* Resumen informativo */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
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
                              Este documento contiene información legal
                              relevante sobre nuestras responsabilidades y
                              limitaciones. Te recomendamos leerlo detenidamente
                              antes de utilizar nuestros productos o servicios.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Contenido principal */}
                      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                        <AnimatePresence>
                          {documents[0].content
                            .split("\n")
                            .map((section, index) => {
                              // Identificar líneas con títulos que terminan en ":"
                              const colonMatch = section.match(/^(.+?):$/);

                              if (colonMatch) {
                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
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
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.5,
                                    delay: 0.05 * index,
                                  }}
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
                        En este momento no podemos mostrar el deslinde legal.
                        Por favor, intenta nuevamente más tarde.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer del documento */}
                {documents?.length > 0 && documents[0]?.content && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-t border-gray-200 dark:border-gray-700 relative z-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <div className="bg-gray-200 dark:bg-gray-600 p-1.5 rounded-full mr-2">
                          <Clock className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </div>
                        <span className="text-sm">
                          Última actualización:{" "}
                          {documents[0]?.updatedAt
                            ? formatDate(documents[0].updatedAt)
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
            </div>
          </div>
        </AnimatedSection>

        {/* CTA Section - Enhanced with about page style */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
              className="absolute bottom-0 left-0 w-full h-64 text-white/5"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill="currentColor"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill="currentColor"
              ></path>
            </svg>
          </div>

          <div className="container mx-auto px-6 text-center relative z-10 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold mb-6"
              >
                ¿Necesitas aclarar algún punto sobre nuestro deslinde legal?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-blue-100 text-lg max-w-2xl mx-auto mb-10"
              >
                Si tienes dudas sobre cualquier aspecto de este documento o
                necesitas información adicional, nuestro equipo está disponible
                para ayudarte.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <motion.a
                  href="/contacto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Contáctanos ahora
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.a>
              </motion.div>

              {/* Floating badges - Added from about page style */}
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  animate={{ y: [0, -10, 0] }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Respuesta Rápida</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  animate={{ y: [0, -10, 0] }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium">Asesoría Legal</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  animate={{ y: [0, -10, 0] }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <Scale className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">
                    Transparencia Total
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
