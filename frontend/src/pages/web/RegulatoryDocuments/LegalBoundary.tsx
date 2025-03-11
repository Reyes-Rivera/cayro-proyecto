import { useEffect, useState } from "react";
import { boundaryApi } from "@/api/policy";
import type { DocumentInterface } from "./DocumentInterface";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { motion } from "framer-motion";
import backgroundImage from "../Home/assets/hero.jpg";
import {
  Scale,
  Info,
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronRight,
  BookOpen,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-14">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
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
            Deslinde Legal
          </h1>
          <p className="text-lg text-blue-50 max-w-2xl mb-8">
            Información importante sobre nuestras responsabilidades y
            limitaciones legales
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
            <div className="p-8 lg:p-12 bg-white dark:bg-gray-800">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">
                    Cargando documento...
                  </p>
                </div>
              ) : document?.length > 0 && document[0]?.content ? (
                <div className="space-y-8">
                  {/* Resumen informativo */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-600 mb-8">
                    <div className="flex items-start">
                      <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4 mt-1 flex-shrink-0" />
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
                  </div>

                  {/* Contenido principal */}
                  <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
                    {document[0].content.split("\n").map((section, index) => {
                      // Identificar líneas con títulos que terminan en ":"
                      const colonMatch = section.match(/^(.+?):$/);

                      if (colonMatch) {
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 * index }}
                            className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-2"
                          >
                            <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 flex items-center">
                              <BookOpen className="w-5 h-5 mr-2" />
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
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
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
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      Última actualización:{" "}
                      {document[0]?.updatedAt
                        ? formatDate(document[0].updatedAt)
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
              ¿Necesitas aclarar algún punto sobre nuestro deslinde legal?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Si tienes dudas sobre cualquier aspecto de este documento o
              necesitas información adicional, nuestro equipo está disponible
              para ayudarte.
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
