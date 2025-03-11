"use client";

import { currentTerm } from "@/api/terms";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import type { DocumentInterface } from "./DocumentInterface";
import { useEffect, useState } from "react";
import heroImage from "../Home/assets/hero.jpg";
import { motion } from "framer-motion";
import {
  Book,
  Info,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  FileText,
} from "lucide-react";

export default function Terms() {
  const [terms, setTerms] = useState<DocumentInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-14">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "center 30%",
        }}
        className="relative py-20 h-[400px] bg-cover bg-no-repeat bg-fixed"
      >
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative container mx-auto px-6 flex flex-col items-center justify-center h-full text-center"
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm mb-6">
            INFORMACIÓN LEGAL
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-blue-50 max-w-2xl mb-8">
            Información importante sobre el uso de nuestros servicios y
            productos
          </p>
          <div className="text-white [&_*]:!text-white flex justify-center">
            <Breadcrumbs />
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            {/* Document Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
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
            <div className="p-8 lg:p-12 bg-white dark:bg-gray-800">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Cargando documento...
                  </p>
                </div>
              ) : terms?.length > 0 && terms[0]?.content ? (
                <div className="space-y-8">
                  {/* Resumen informativo */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-600 mb-8">
                    <div className="flex items-start">
                      <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4 mt-1 flex-shrink-0" />
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
                  </div>

                  {/* Contenido principal */}
                  <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                    {terms[0].content.split("\n").map((section, index) => {
                      // Detectamos secciones con "Sección N – Título"
                      const match = section.match(/^(Sección \d+\s–)\s*(.+)$/);

                      if (match) {
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 * index }}
                            className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"
                          >
                            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center">
                              <FileText className="w-5 h-5 mr-2" />
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
                            transition={{ duration: 0.5, delay: 0.05 * index }}
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
                            transition={{ duration: 0.5, delay: 0.05 * index }}
                            className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                          >
                            <p className="font-bold text-gray-900 dark:text-white mb-2">
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
                            transition={{ duration: 0.5, delay: 0.05 * index }}
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
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
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
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Última actualización:{" "}
                      {terms[0]?.updatedAt
                        ? formatDate(terms[0].updatedAt)
                        : "No disponible"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
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
            className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-8 rounded-xl border border-blue-100 dark:border-blue-800 text-center"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Tienes preguntas sobre nuestros términos y condiciones?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Si necesitas aclarar algún punto o tienes dudas sobre este
              documento, nuestro equipo está disponible para ayudarte.
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Contáctanos
              <ChevronRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
