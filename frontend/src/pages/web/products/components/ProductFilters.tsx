"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Check } from "lucide-react";
import type {
  Brand,
  Category,
  Color,
  Gender,
  Size,
  Sleeve,
} from "../utils/products";
import PriceRangeFilter from "./price-range-filter";

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  colors: Color[];
  sizes: Size[];
  genders: Gender[];
  sleeves: Sleeve[];
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  activeBrandId: number | null;
  setActiveBrandId: (id: number | null) => void;
  activeColorId: number | null;
  setActiveColorId: (id: number | null) => void;
  activeSizeId: number | null;
  setActiveSizeId: (id: number | null) => void;
  activeGenderId: number | null;
  setActiveGenderId: (id: number | null) => void;
  activeSleeveId: number | null;
  setActiveSleeveId: (id: number | null) => void;
  activeSort: string;
  setActiveSort: (sort: any) => void;
  priceRange: { min: number | null; max: number | null };
  setPriceRange: (range: { min: number | null; max: number | null }) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export default function ProductFilters({
  categories = [],
  colors = [],
  sizes = [],
  genders = [],
  sleeves = [],
  activeCategoryId = null,
  setActiveCategoryId = () => {},
  activeColorId = null,
  setActiveColorId = () => {},
  activeSizeId = null,
  setActiveSizeId = () => {},
  activeGenderId = null,
  setActiveGenderId = () => {},
  activeSleeveId = null,
  setActiveSleeveId = () => {},
  activeSort = "default",
  setActiveSort = () => {},
  priceRange = { min: null, max: null },
  setPriceRange = () => {},
  hasActiveFilters = false,
  clearAllFilters = () => {},
}: ProductFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Asegúrate de que todos los arrays sean arrays válidos
  const safeCategories = Array.isArray(categories) ? categories : [];




  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Función para manejar el cambio de precio en móvil
  const handleMobilePriceChange = (newRange: {
    min: number | null;
    max: number | null;
  }) => {
    setPriceRange(newRange);
    scrollToProducts();
    setMobileFiltersOpen(false);
  };

  // Mobile filters drawer
  const MobileFilters = () => (
    <>
      {/* Mobile filter button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
      >
        <Filter className="w-5 h-5" />
        <span>Filtros</span>
      </motion.button>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-md bg-white dark:bg-gray-900 overflow-y-auto md:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-serif text-xl text-gray-900 dark:text-white">
                    Filtros
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                {/* Mobile filters content - same as desktop but styled for mobile */}
                {/* Categorías */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest flex items-center">
                    <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Categorías
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeCategoryId === null
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => {
                        setActiveCategoryId(null);
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeCategoryId === null && (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        )}
                        <span
                          className={
                            activeCategoryId === null ? "ml-0" : "ml-6"
                          }
                        >
                          Todas las Categorías
                        </span>
                      </div>
                    </button>
                    {Array.isArray(categories) ? (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                            activeCategoryId === category.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                          onClick={() => {
                            setActiveCategoryId(category.id);
                            scrollToProducts();
                            setMobileFiltersOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {activeCategoryId === category.id && (
                              <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            )}
                            <span
                              className={
                                activeCategoryId === category.id
                                  ? "ml-0"
                                  : "ml-6"
                              }
                            >
                              {category.name}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                        No hay categorías disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Tipo de manga/cuello */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest flex items-center">
                    <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Tipo de Manga
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeSleeveId === null
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => {
                        setActiveSleeveId(null);
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeSleeveId === null && (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        )}
                        <span
                          className={activeSleeveId === null ? "ml-0" : "ml-6"}
                        >
                          Todos los Tipos
                        </span>
                      </div>
                    </button>
                    {Array.isArray(sleeves) ? (
                      sleeves.map((sleeve) => (
                        <button
                          key={sleeve.id}
                          className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                            activeSleeveId === sleeve.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                          onClick={() => {
                            setActiveSleeveId(sleeve.id);
                            scrollToProducts();
                            setMobileFiltersOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {activeSleeveId === sleeve.id && (
                              <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            )}
                            <span
                              className={
                                activeSleeveId === sleeve.id ? "ml-0" : "ml-6"
                              }
                            >
                              {sleeve.name}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                        No hay tipos disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Rango de precio */}
                <div className="mb-8">
                  <PriceRangeFilter
                    priceRange={priceRange}
                    setPriceRange={(newRange) =>
                      handleMobilePriceChange(newRange)
                    }
                  />
                </div>

                {/* Colores */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest flex items-center">
                    <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Colores
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    <button
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 ${
                        activeColorId === null
                          ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-900"
                          : ""
                      } transition-all duration-200 flex items-center justify-center shadow-md`}
                      onClick={() => {
                        setActiveColorId(null);
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                      aria-label="Todos los colores"
                    >
                      <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    </button>
                    {Array.isArray(colors) ? (
                      colors.map((color) => (
                        <button
                          key={color.id}
                          className={`w-10 h-10 rounded-full transition-all duration-200 ${
                            activeColorId === color.id
                              ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-900"
                              : ""
                          } relative group border border-gray-200 dark:border-gray-700 shadow-md`}
                          style={{ backgroundColor: color.hexValue }}
                          onClick={() => {
                            setActiveColorId(color.id);
                            scrollToProducts();
                            setMobileFiltersOpen(false);
                          }}
                          aria-label={`Color: ${color.name}`}
                        >
                          <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                            {color.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                        No hay colores disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Tallas */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest flex items-center">
                    <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Tallas
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      className={`py-3 text-sm font-medium transition-all rounded-lg ${
                        activeSizeId === null
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setActiveSizeId(null);

                        // Actualizar URL directamente
                        const url = new URL(window.location.href);
                        url.searchParams.delete("talla");
                        window.history.pushState({}, "", url.toString());

                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      Todas
                    </button>
                    {Array.isArray(sizes) ? (
                      sizes.map((size) => (
                        <button
                          key={size.id}
                          className={`py-3 text-sm font-medium transition-all rounded-lg ${
                            activeSizeId === size.id
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => {
                            setActiveSizeId(size.id);

                            // Actualizar URL directamente
                            const url = new URL(window.location.href);
                            url.searchParams.set("talla", size.id.toString());
                            window.history.pushState({}, "", url.toString());

                            scrollToProducts();
                            setMobileFiltersOpen(false);
                          }}
                        >
                          {size.name}
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                        No hay tallas disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Género */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest flex items-center">
                    <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Género
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeGenderId === null
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => {
                        setActiveGenderId(null);
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeGenderId === null && (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        )}
                        <span
                          className={activeGenderId === null ? "ml-0" : "ml-6"}
                        >
                          Todos los Géneros
                        </span>
                      </div>
                    </button>
                    {Array.isArray(genders) ? (
                      genders.map((gender) => (
                        <button
                          key={gender.id}
                          className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                            activeGenderId === gender.id
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                          onClick={() => {
                            setActiveGenderId(gender.id);

                            // Actualizar URL directamente
                            const url = new URL(window.location.href);
                            url.searchParams.set(
                              "genero",
                              gender.id.toString()
                            );
                            window.history.pushState({}, "", url.toString());

                            scrollToProducts();
                            setMobileFiltersOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {activeGenderId === gender.id && (
                              <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            )}
                            <span
                              className={
                                activeGenderId === gender.id ? "ml-0" : "ml-6"
                              }
                            >
                              {gender.name}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                        No hay géneros disponibles
                      </div>
                    )}
                  </div>
                </div>

                {/* Ordenar por */}
                <div className="mb-8">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest flex items-center">
                    <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Ordenar por
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeSort === "default"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => {
                        setActiveSort("default");
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeSort === "default" && (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        )}
                        <span
                          className={activeSort === "default" ? "ml-0" : "ml-6"}
                        >
                          Destacados
                        </span>
                      </div>
                    </button>
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeSort === "price-low"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => {
                        setActiveSort("price-low");
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeSort === "price-low" && (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        )}
                        <span
                          className={
                            activeSort === "price-low" ? "ml-0" : "ml-6"
                          }
                        >
                          Precio: Menor a Mayor
                        </span>
                      </div>
                    </button>
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeSort === "price-high"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => {
                        setActiveSort("price-high");
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeSort === "price-high" && (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        )}
                        <span
                          className={
                            activeSort === "price-high" ? "ml-0" : "ml-6"
                          }
                        >
                          Precio: Mayor a Menor
                        </span>
                      </div>
                    </button>
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeSort === "newest"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                      onClick={() => {
                        setActiveSort("newest");
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeSort === "newest" && (
                          <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        )}
                        <span
                          className={activeSort === "newest" ? "ml-0" : "ml-6"}
                        >
                          Más Recientes
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Clear filters button */}
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      clearAllFilters();
                      scrollToProducts();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full py-3 mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                    Limpiar todos los filtros
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {/* Mobile filters */}
      <MobileFilters />

      {/* Desktop filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden md:block w-72 flex-shrink-0"
      >
        {/* Decorative elements */}
        <div className="absolute -z-10 pointer-events-none">
          <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute -bottom-[30%] -left-[20%] w-[60%] h-[60%] bg-blue-50 dark:bg-blue-950/20 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="pr-10 border-r border-gray-200 dark:border-gray-800 sticky top-20">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-serif text-xl text-gray-900 dark:text-white">
                Filtros
              </h3>
            </div>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
                Limpiar
              </motion.button>
            )}
          </div>

          {/* Categorías */}
          <div className="mb-12">
            <h4 className="font-medium text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center">
              <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
              Categorías
            </h4>
            <div className="space-y-3">
              <button
                className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                  activeCategoryId === null
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  setActiveCategoryId(null);
                  scrollToProducts();
                }}
              >
                <div className="flex items-center">
                  {activeCategoryId === null && (
                    <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className={activeCategoryId === null ? "ml-0" : "ml-6"}>
                    Todas las Categorías
                  </span>
                </div>
              </button>
              {safeCategories.length > 0 ? (
                safeCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                      activeCategoryId === category.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => {
                      setActiveCategoryId(category.id);
                      scrollToProducts();
                    }}
                  >
                    <div className="flex items-center">
                      {activeCategoryId === category.id && (
                        <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      )}
                      <span
                        className={
                          activeCategoryId === category.id ? "ml-0" : "ml-6"
                        }
                      >
                        {category.name}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                  No hay categorías disponibles
                </div>
              )}
            </div>
          </div>

          {/* Tipo de manga/cuello */}
          <div className="mb-12">
            <h4 className="font-medium text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center">
              <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
              Tipo de Manga
            </h4>
            <div className="space-y-3">
              <button
                className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                  activeSleeveId === null
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  setActiveSleeveId(null);
                  scrollToProducts();
                }}
              >
                <div className="flex items-center">
                  {activeSleeveId === null && (
                    <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className={activeSleeveId === null ? "ml-0" : "ml-6"}>
                    Todos los Tipos
                  </span>
                </div>
              </button>
              {Array.isArray(sleeves) ? (
                sleeves.map((sleeve) => (
                  <button
                    key={sleeve.id}
                    className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                      activeSleeveId === sleeve.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => {
                      setActiveSleeveId(sleeve.id);
                      scrollToProducts();
                    }}
                  >
                    <div className="flex items-center">
                      {activeSleeveId === sleeve.id && (
                        <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      )}
                      <span
                        className={
                          activeSleeveId === sleeve.id ? "ml-0" : "ml-6"
                        }
                      >
                        {sleeve.name}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                  No hay tipos disponibles
                </div>
              )}
            </div>
          </div>

          {/* Rango de precio */}
          <div className="mb-12">
            <PriceRangeFilter
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Colores */}
          <div className="mb-12">
            <h4 className="font-medium text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center">
              <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
              Colores
            </h4>
            <div className="grid grid-cols-5 gap-3">
              <button
                className={`w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 ${
                  activeColorId === null
                    ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-900"
                    : ""
                } transition-all duration-200 flex items-center justify-center shadow-md`}
                onClick={() => {
                  setActiveColorId(null);
                  scrollToProducts();
                }}
                aria-label="Todos los colores"
              >
                <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </button>
              {Array.isArray(colors) ? (
                colors.map((color) => (
                  <button
                    key={color.id}
                    className={`w-10 h-10 rounded-full transition-all duration-200 ${
                      activeColorId === color.id
                        ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400 dark:ring-offset-gray-900"
                        : ""
                    } relative group border border-gray-200 dark:border-gray-700 shadow-md`}
                    style={{ backgroundColor: color.hexValue }}
                    onClick={() => {
                      setActiveColorId(color.id);
                      scrollToProducts();
                    }}
                    aria-label={`Color: ${color.name}`}
                  >
                    <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                      {color.name}
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                  No hay colores disponibles
                </div>
              )}
            </div>
          </div>

          {/* Tallas */}
          <div className="mb-12">
            <h4 className="font-medium text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center">
              <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
              Tallas
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                className={`py-3 text-sm font-medium transition-all rounded-lg ${
                  activeSizeId === null
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  setActiveSizeId(null);

                  // Actualizar URL directamente
                  const url = new URL(window.location.href);
                  url.searchParams.delete("talla");
                  window.history.pushState({}, "", url.toString());

                  scrollToProducts();
                }}
              >
                Todas
              </button>
              {Array.isArray(sizes) ? (
                sizes.map((size) => (
                  <button
                    key={size.id}
                    className={`py-3 text-sm font-medium transition-all rounded-lg ${
                      activeSizeId === size.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSizeId(size.id);

                      // Actualizar URL directamente
                      const url = new URL(window.location.href);
                      url.searchParams.set("talla", size.id.toString());
                      window.history.pushState({}, "", url.toString());

                      scrollToProducts();
                    }}
                  >
                    {size.name}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                  No hay tallas disponibles
                </div>
              )}
            </div>
          </div>

          {/* Género */}
          <div className="mb-12">
            <h4 className="font-medium text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center">
              <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
              Género
            </h4>
            <div className="space-y-3">
              <button
                className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                  activeGenderId === null
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  setActiveGenderId(null);
                  scrollToProducts();
                }}
              >
                <div className="flex items-center">
                  {activeGenderId === null && (
                    <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className={activeGenderId === null ? "ml-0" : "ml-6"}>
                    Todos los Géneros
                  </span>
                </div>
              </button>
              {Array.isArray(genders) ? (
                genders.map((gender) => (
                  <button
                    key={gender.id}
                    className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                      activeGenderId === gender.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => {
                      setActiveGenderId(gender.id);

                      // Actualizar URL directamente
                      const url = new URL(window.location.href);
                      url.searchParams.set("genero", gender.id.toString());
                      window.history.pushState({}, "", url.toString());

                      scrollToProducts();
                    }}
                  >
                    <div className="flex items-center">
                      {activeGenderId === gender.id && (
                        <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      )}
                      <span
                        className={
                          activeGenderId === gender.id ? "ml-0" : "ml-6"
                        }
                      >
                        {gender.name}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-sm py-2">
                  No hay géneros disponibles
                </div>
              )}
            </div>
          </div>

          {/* Ordenar por */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-widest flex items-center">
              <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-400 mr-2"></span>
              Ordenar por
            </h4>
            <div className="space-y-3">
              <button
                className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                  activeSort === "default"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  setActiveSort("default");
                  scrollToProducts();
                }}
              >
                <div className="flex items-center">
                  {activeSort === "default" && (
                    <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className={activeSort === "default" ? "ml-0" : "ml-6"}>
                    Destacados
                  </span>
                </div>
              </button>
              <button
                className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                  activeSort === "price-low"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  setActiveSort("price-low");
                  scrollToProducts();
                }}
              >
                <div className="flex items-center">
                  {activeSort === "price-low" && (
                    <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span
                    className={activeSort === "price-low" ? "ml-0" : "ml-6"}
                  >
                    Precio: Menor a Mayor
                  </span>
                </div>
              </button>
              <button
                className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                  activeSort === "price-high"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  setActiveSort("price-high");
                  scrollToProducts();
                }}
              >
                <div className="flex items-center">
                  {activeSort === "price-high" && (
                    <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span
                    className={activeSort === "price-high" ? "ml-0" : "ml-6"}
                  >
                    Precio: Mayor a Menor
                  </span>
                </div>
              </button>
              <button
                className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                  activeSort === "newest"
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onClick={() => {
                  setActiveSort("newest");
                  scrollToProducts();
                }}
              >
                <div className="flex items-center">
                  {activeSort === "newest" && (
                    <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className={activeSort === "newest" ? "ml-0" : "ml-6"}>
                    Más Recientes
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
