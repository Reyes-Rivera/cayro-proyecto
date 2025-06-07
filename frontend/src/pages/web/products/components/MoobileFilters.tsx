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
} from "../../../../types/products";
import PriceRangeFilter from "./price-range-filter";
import QuickSearch from "./SearchBar";

interface MobileFiltersProps {
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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function MobileFilters({
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
  priceRange = { min: null, max: null },
  setPriceRange = () => {},
  hasActiveFilters = false,
  clearAllFilters = () => {},
  searchTerm = "",
  setSearchTerm = () => {},
}: MobileFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  return (
    <>
      {/* Mobile filter button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setMobileFiltersOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 dark:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2"
      >
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filtros</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            !
          </span>
        )}
      </motion.button>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-50"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-[85%] max-w-md bg-white dark:bg-gray-900 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                    Filtros
                  </h3>
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 dark:text-gray-300" />
                </button>
              </div>

              <div className="p-4 dark:text-gray-200">
                {/* Búsqueda */}
                <div className="mb-8">
                  <h3 className="text-gray-900 mb-4 text-sm uppercase tracking-widest flex items-center font-medium">
                    <span className="w-6 h-0.5 bg-blue-600 mr-2"></span>
                    Búsqueda
                  </h3>
                  <QuickSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>

                {/* Categorías */}
                <div className="mb-8">
                  <h3 className="text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-widest flex items-center font-medium">
                    <span className="w-6 h-0.5 bg-blue-600 dark:bg-blue-500 mr-2"></span>
                    Categorías
                  </h3>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeCategoryId === null
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <button
                          key={category.id}
                          className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                            activeCategoryId === category.id
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                      ))}
                  </div>
                </div>

                {/* Colores */}
                <div className="mb-8">
                  <h3 className="text-gray-900 mb-4 text-sm uppercase tracking-widest flex items-center font-medium">
                    <span className="w-6 h-0.5 bg-blue-600 mr-2"></span>
                    Colores
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    <button
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 ${
                        activeColorId === null
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : ""
                      } transition-all duration-200 flex items-center justify-center shadow-md`}
                      onClick={() => {
                        setActiveColorId(null);
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                      aria-label="Todos los colores"
                    >
                      <X className="h-4 w-4 text-gray-700" />
                    </button>
                    {Array.isArray(colors) &&
                      colors.map((color) => (
                        <button
                          key={color.id}
                          className={`w-10 h-10 rounded-full transition-all duration-200 ${
                            activeColorId === color.id
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : ""
                          } relative group border border-gray-200 shadow-md`}
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
                      ))}
                  </div>
                </div>

                {/* Género */}
                <div className="mb-8">
                  <h3 className="text-gray-900 mb-4 text-sm uppercase tracking-widest flex items-center font-medium">
                    <span className="w-6 h-0.5 bg-blue-600 mr-2"></span>
                    Género
                  </h3>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeGenderId === null
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setActiveGenderId(null);
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeGenderId === null && (
                          <Check className="w-4 h-4 mr-2 text-blue-600" />
                        )}
                        <span
                          className={activeGenderId === null ? "ml-0" : "ml-6"}
                        >
                          Todos los Géneros
                        </span>
                      </div>
                    </button>
                    {Array.isArray(genders) &&
                      genders.map((gender) => (
                        <button
                          key={gender.id}
                          className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                            activeGenderId === gender.id
                              ? "bg-blue-50 text-blue-700 shadow-sm"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setActiveGenderId(gender.id);
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
                              <Check className="w-4 h-4 mr-2 text-blue-600" />
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
                      ))}
                  </div>
                </div>

                {/* Tipo de manga/cuello */}
                <div className="mb-8">
                  <h3 className="text-gray-900 mb-4 text-sm uppercase tracking-widest flex items-center font-medium">
                    <span className="w-6 h-0.5 bg-blue-600 mr-2"></span>
                    Tipo de Cuello
                  </h3>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                        activeSleeveId === null
                          ? "bg-blue-50 text-blue-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setActiveSleeveId(null);
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        {activeSleeveId === null && (
                          <Check className="w-4 h-4 mr-2 text-blue-600" />
                        )}
                        <span
                          className={activeSleeveId === null ? "ml-0" : "ml-6"}
                        >
                          Todos los Tipos
                        </span>
                      </div>
                    </button>
                    {Array.isArray(sleeves) &&
                      sleeves.map((sleeve) => (
                        <button
                          key={sleeve.id}
                          className={`block w-full text-left py-2.5 px-4 text-sm transition-all rounded-lg ${
                            activeSleeveId === sleeve.id
                              ? "bg-blue-50 text-blue-700 shadow-sm"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => {
                            setActiveSleeveId(sleeve.id);
                            scrollToProducts();
                            setMobileFiltersOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {activeSleeveId === sleeve.id && (
                              <Check className="w-4 h-4 mr-2 text-blue-600" />
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
                      ))}
                  </div>
                </div>

                {/* Tallas */}
                <div className="mb-8">
                  <h3 className="text-gray-900 mb-4 text-sm uppercase tracking-widest flex items-center font-medium">
                    <span className="w-6 h-0.5 bg-blue-600 mr-2"></span>
                    Tallas
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      className={`py-3 text-sm transition-all rounded-lg ${
                        activeSizeId === null
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setActiveSizeId(null);
                        const url = new URL(window.location.href);
                        url.searchParams.delete("talla");
                        window.history.pushState({}, "", url.toString());
                        scrollToProducts();
                        setMobileFiltersOpen(false);
                      }}
                    >
                      Todas
                    </button>
                    {Array.isArray(sizes) &&
                      sizes.map((size) => (
                        <button
                          key={size.id}
                          className={`py-3 text-sm transition-all rounded-lg ${
                            activeSizeId === size.id
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                          onClick={() => {
                            setActiveSizeId(size.id);
                            const url = new URL(window.location.href);
                            url.searchParams.set("talla", size.id.toString());
                            window.history.pushState({}, "", url.toString());
                            scrollToProducts();
                            setMobileFiltersOpen(false);
                          }}
                        >
                          {size.name}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Rango de precio */}
                <div className="mb-8">
                  <PriceRangeFilter
                    priceRange={priceRange}
                    setPriceRange={handleMobilePriceChange}
                  />
                </div>

                {/* Clear filters button */}
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      clearAllFilters();
                      scrollToProducts();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full py-3 mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1.5 bg-blue-50 px-3 rounded-lg font-medium"
                  >
                    <X className="w-3.5 h-3.5" />
                    Limpiar Todos los Filtros
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
