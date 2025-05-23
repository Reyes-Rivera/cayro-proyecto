"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import type { Category } from "../../../../types/products";
import { getCategories } from "@/api/products";

interface ProductHeroProps {
  setActiveCategoryId: (id: number | null) => void;
  setSearchTerm: (term: string) => void;
  scrollToProducts: () => void;
  searchTerm: string; // Añadido para pasar al QuickSearch
}

export default function ProductHero({
  setActiveCategoryId,
  setSearchTerm,
  scrollToProducts,
  searchTerm,
}: ProductHeroProps) {
  const [animateHero, setAnimateHero] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    setAnimateHero(true);
    const fetchData = async () => {
      try {
        const categoriesResponse = await getCategories();
        if (categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  // Actualizar inputValue cuando cambia searchTerm
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const handleSearch = (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Actualizar el término de búsqueda
    setSearchTerm(inputValue);

    // Actualizar la URL con el parámetro de búsqueda
    const url = new URL(window.location.href);
    if (inputValue.trim()) {
      url.searchParams.set("search", inputValue);
    } else {
      url.searchParams.delete("search");
    }

    // Actualizar la URL sin recargar la página
    window.history.pushState({}, "", url.toString());

    if (inputValue.trim()) {
      scrollToProducts();
    }
  };

  return (
    <div className="relative min-h-[90vh] overflow-hidden bg-white dark:bg-gray-900">
      {/* Creative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blue blob */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50/50 dark:from-blue-900/10 to-transparent"></div>

        {/* Diagonal line */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <svg
            className="absolute top-0 right-0 h-full"
            width="400"
            height="100%"
            viewBox="0 0 400 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M400 0L0 800"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Dots pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500/30 rounded-full"></div>
          <div className="absolute top-40 left-40 w-3 h-3 bg-blue-500/20 rounded-full"></div>
          <div className="absolute top-60 left-60 w-2 h-2 bg-blue-500/30 rounded-full"></div>
          <div className="absolute top-80 left-80 w-4 h-4 bg-blue-500/10 rounded-full"></div>
          <div className="absolute top-20 right-40 w-3 h-3 bg-blue-500/20 rounded-full"></div>
          <div className="absolute top-60 right-60 w-2 h-2 bg-blue-500/30 rounded-full"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-36 relative z-10 flex items-center min-h-[90vh]">
        <div className="max-w-6xl mx-auto w-full">
          {/* Asymmetric layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left column - Text content (wider) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={
                animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
              }
              transition={{ duration: 0.6 }}
              className="md:col-span-7"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                DESCUBRE NUESTRA COLECCIÓN
              </div>

              <h1 className="text-4xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                Inspiración <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-500">
                    & Estilo
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="15"
                    viewBox="0 0 140 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12.5C33 1.5 107 1.5 137 12.5"
                      stroke="#3B82F6"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-10 text-xl max-w-xl">
                Productos únicos que combinan diseño innovador con funcionalidad
                excepcional para transformar tu espacio
              </p>

              {/* Categories in horizontal scroll */}
              <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex space-x-3">
                  <button
                    key="all"
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveCategoryId(null);

                      // Actualizar URL al cambiar categoría
                      const url = new URL(window.location.href);
                      url.searchParams.delete("categoria");
                      window.history.pushState({}, "", url.toString());

                      scrollToProducts();
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      activeCategory === null
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setActiveCategoryId(category.id);

                        // Actualizar URL al cambiar categoría
                        const url = new URL(window.location.href);
                        url.searchParams.set(
                          "categoria",
                          category.name.toLowerCase()
                        );
                        window.history.pushState({}, "", url.toString());

                        scrollToProducts();
                      }}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        activeCategory === category.id
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right column - Search (narrower) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={
                animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-5"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  ¿Qué estás buscando?
                </h2>

                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    className="block w-full pl-10 pr-20 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Buscar productos..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="submit"
                      className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
    </div>
  );
}
