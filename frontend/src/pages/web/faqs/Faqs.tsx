"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Search,
  XCircle,
  MessageSquare,
  Filter,
  Tag,
  Loader2,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoriesFaqs, getFaqs } from "@/api/faqs";
import backgroundImage from "../Home/assets/hero.jpg";

// Tipos basados en los modelos de la base de datos
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: number;
    name: string;
  };
}

export interface FaqCategory {
  id: number;
  name: string;
}

interface FaqProps {
  title?: string;
  description?: string;
  allowSearch?: boolean;
  allowFiltering?: boolean;
  className?: string;
  itemClassName?: string;
  showCategoryBadges?: boolean;
}

const Faq = ({
  title = "Preguntas Frecuentes",
  description = "Encuentra respuestas a las preguntas más comunes sobre nuestros servicios.",
  allowSearch = true,
  allowFiltering = true,
  className,
  itemClassName,
  showCategoryBadges = true,
}: FaqProps) => {
  // Estados
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [items, setItems] = useState<FaqItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [filteredItems, setFilteredItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const faqSection = document.getElementById("faq-content");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Cargar datos de la API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Obtener categorías y FAQs
        const [categoriesResponse, faqsResponse] = await Promise.all([
          getCategoriesFaqs(),
          getFaqs(),
        ]);

        if (categoriesResponse?.data) {
          setCategories(categoriesResponse.data);
        }

        if (faqsResponse?.data) {
          setItems(faqsResponse.data);
          setFilteredItems(faqsResponse.data);
        }
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError(
          "No se pudieron cargar las preguntas frecuentes. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar items cuando cambia el término de búsqueda o la categoría
  useEffect(() => {
    let result = items;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(lowerSearchTerm) ||
          item.answer.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== null) {
      result = result.filter((item) => item.categoryId === selectedCategory);
    }

    setFilteredItems(result);
  }, [items, searchTerm, selectedCategory]);

  // Toggle item expansion
  const toggleItem = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  // Get category name by ID
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "General";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative z-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-screen flex flex-col justify-center">
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
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
        <div className="relative  mx-auto px-4 flex flex-col justify-center flex-grow">
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
                ESTAMOS AQUÍ PARA AYUDARTE
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                <span className="block">{title}</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                  que necesitas saber
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                {description}
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
                    Ver preguntas frecuentes
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
                <ChevronDown className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* FAQ Content */}
      <div
        id="faq-content"
        className={cn("container mx-auto px-6 pt-20 relative z-10", className)}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative p-8 md:p-10 mb-20"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
          </div>

          {/* Search and filters */}
          {(allowSearch || (allowFiltering && categories.length > 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-8 space-y-4 relative z-10"
            >
              {allowSearch && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar preguntas..."
                    className="pl-10 pr-10 py-3 w-full border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={clearSearch}
                    >
                      <XCircle className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}

              {allowFiltering && categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span>Filtrar por:</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full transition-colors",
                      selectedCategory === null
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    Todas
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full transition-colors",
                        selectedCategory === category.id
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                  {(searchTerm || selectedCategory !== null) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-3 py-1.5 text-sm rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors ml-auto flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Limpiar filtros
                    </motion.button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
                <Loader2 className="w-12 h-12 animate-spin" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Cargando preguntas frecuentes...
              </p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Algo salió mal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-colors shadow-md"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* FAQ Items */}
          {!isLoading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 relative z-10"
            >
              <AnimatePresence>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={itemVariants}
                      className={cn(
                        "border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
                        itemClassName
                      )}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 p-3 rounded-full flex-shrink-0 transition-all duration-300",
                              expandedId === item.id
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                : ""
                            )}
                          >
                            <HelpCircle className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                              {item.question}
                            </h3>
                            {showCategoryBadges && (
                              <div className="mt-1 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                  <Tag className="w-3 h-3" />
                                  {getCategoryName(item.categoryId)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {expandedId === item.id ? (
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-full">
                              <ChevronUp className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 p-2 rounded-full">
                              <ChevronDown className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedId === item.id && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={contentVariants}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-0 prose prose-sm dark:prose-invert max-w-none">
                              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-1">
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full mb-6">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No se encontraron resultados
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {searchTerm
                        ? `No hay preguntas que coincidan con "${searchTerm}"`
                        : selectedCategory !== null
                        ? "No hay preguntas disponibles en esta categoría"
                        : "No hay preguntas frecuentes disponibles"}
                    </p>
                    {(searchTerm || selectedCategory !== null) && (
                      <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-colors shadow-md"
                      >
                        Ver todas las preguntas
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-xl mb-20"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
              Nuestro equipo de soporte está listo para ayudarte con cualquier
              pregunta adicional que puedas tener.
            </p>
            <motion.a
              href="/contacto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg"
            >
              Contáctanos ahora
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Faq;
