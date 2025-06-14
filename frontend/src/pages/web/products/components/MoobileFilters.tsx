"use client";

import type React from "react";
import { useState } from "react";
import { X, Filter, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  Brand,
  Category,
  Color,
  Gender,
  Size,
  Sleeve,
} from "@/types/products";
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
  activeCategoryId = null,
  setActiveCategoryId = () => {},
  activeColorId = null,
  setActiveColorId = () => {},
  activeSizeId = null,
  setActiveSizeId = () => {},
  activeGenderId = null,
  setActiveGenderId = () => {},
  priceRange = { min: null, max: null },
  setPriceRange = () => {},
  hasActiveFilters = false,
  clearAllFilters = () => {},
  searchTerm = "",
  setSearchTerm = () => {},
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    color: true,
    gender: true,
    size: false,
    priceRange: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const min = formData.get("minPrice") as string;
    const max = formData.get("maxPrice") as string;

    setPriceRange({
      min: min ? Number(min) : null,
      max: max ? Number(max) : null,
    });

    const url = new URL(window.location.href);
    if (min) {
      url.searchParams.set("priceMin", min);
    } else {
      url.searchParams.delete("priceMin");
    }
    if (max) {
      url.searchParams.set("priceMax", max);
    } else {
      url.searchParams.delete("priceMax");
    }
    window.history.pushState({}, "", url.toString());

    scrollToProducts();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl flex items-center gap-2"
        >
          <Filter className="w-5 h-5" />
          <span className="font-semibold">Filtros</span>
          {hasActiveFilters && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </motion.button>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 z-50 overflow-y-auto"
            >
              {/* Enhanced Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        <Filter className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Filtros</h3>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <p className="text-blue-100 text-sm">
                    Encuentra exactamente lo que buscas
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-16 w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-6 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
              </div>

              <div className="p-6 space-y-8">
                {/* Clear All Button */}
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      clearAllFilters();
                      setIsOpen(false);
                    }}
                    className="w-full text-blue-600 hover:text-blue-700 text-sm font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-xl transition-all"
                  >
                    Limpiar Todos los Filtros
                  </motion.button>
                )}

                {/* Search Section */}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 text-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Búsqueda
                  </h4>
                  <QuickSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <button
                    onClick={() => toggleSection("category")}
                    className="flex items-center justify-between w-full text-left font-bold text-gray-900 dark:text-white mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Categoría
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSections.category ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedSections.category ? "auto" : 0,
                      opacity: expandedSections.category ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4">
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <motion.label
                            key={category.id}
                            className="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            whileHover={{ x: 4 }}
                          >
                            <input
                              type="radio"
                              name="category"
                              checked={activeCategoryId === category.id}
                              onChange={() => {
                                setActiveCategoryId(category.id);
                                const url = new URL(window.location.href);
                                url.searchParams.set(
                                  "categoria",
                                  category.name.toLowerCase()
                                );
                                window.history.pushState(
                                  {},
                                  "",
                                  url.toString()
                                );
                                scrollToProducts();
                                setIsOpen(false);
                              }}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded-full"
                            />
                            <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                              {category.name}
                            </span>
                          </motion.label>
                        ))}
                      <motion.label
                        className="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={activeCategoryId === null}
                          onChange={() => {
                            setActiveCategoryId(null);
                            const url = new URL(window.location.href);
                            url.searchParams.delete("categoria");
                            window.history.pushState({}, "", url.toString());
                            scrollToProducts();
                            setIsOpen(false);
                          }}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded-full"
                        />
                        <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                          Todas las Categorías
                        </span>
                      </motion.label>
                    </div>
                  </motion.div>
                </div>

                {/* Color Filter */}
                <div>
                  <button
                    onClick={() => toggleSection("color")}
                    className="flex items-center justify-between w-full text-left font-bold text-gray-900 dark:text-white mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Color
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSections.color ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedSections.color ? "auto" : 0,
                      opacity: expandedSections.color ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-6 gap-3">
                      {Array.isArray(colors) &&
                        colors.map((color) => (
                          <motion.button
                            key={color.id}
                            onClick={() => {
                              setActiveColorId(
                                activeColorId === color.id ? null : color.id
                              );
                              const url = new URL(window.location.href);
                              if (activeColorId === color.id) {
                                url.searchParams.delete("color");
                              } else {
                                url.searchParams.set(
                                  "color",
                                  color.id.toString()
                                );
                              }
                              window.history.pushState({}, "", url.toString());
                              scrollToProducts();
                              setIsOpen(false);
                            }}
                            className={`w-10 h-10 rounded-full border-3 transition-all duration-300 hover:scale-110 shadow-lg ${
                              activeColorId === color.id
                                ? "border-blue-600 ring-4 ring-blue-600/30 scale-110"
                                : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                            }`}
                            style={{ backgroundColor: color.hexValue }}
                            title={color.name}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          />
                        ))}
                    </div>
                  </motion.div>
                </div>

                {/* Gender Filter */}
                <div>
                  <button
                    onClick={() => toggleSection("gender")}
                    className="flex items-center justify-between w-full text-left font-bold text-gray-900 dark:text-white mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Género
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSections.gender ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedSections.gender ? "auto" : 0,
                      opacity: expandedSections.gender ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4">
                      {Array.isArray(genders) &&
                        genders.map((gender) => (
                          <motion.label
                            key={gender.id}
                            className="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            whileHover={{ x: 4 }}
                          >
                            <input
                              type="radio"
                              name="gender"
                              checked={activeGenderId === gender.id}
                              onChange={() => {
                                setActiveGenderId(gender.id);
                                const url = new URL(window.location.href);
                                url.searchParams.set(
                                  "genero",
                                  gender.id.toString()
                                );
                                window.history.pushState(
                                  {},
                                  "",
                                  url.toString()
                                );
                                scrollToProducts();
                                setIsOpen(false);
                              }}
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded-full"
                            />
                            <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                              {gender.name}
                            </span>
                          </motion.label>
                        ))}
                      <motion.label
                        className="flex items-center group cursor-pointer p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        whileHover={{ x: 4 }}
                      >
                        <input
                          type="radio"
                          name="gender"
                          checked={activeGenderId === null}
                          onChange={() => {
                            setActiveGenderId(null);
                            const url = new URL(window.location.href);
                            url.searchParams.delete("genero");
                            window.history.pushState({}, "", url.toString());
                            scrollToProducts();
                            setIsOpen(false);
                          }}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded-full"
                        />
                        <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                          Todos los Géneros
                        </span>
                      </motion.label>
                    </div>
                  </motion.div>
                </div>

                {/* Size Filter */}
                <div>
                  <button
                    onClick={() => toggleSection("size")}
                    className="flex items-center justify-between w-full text-left font-bold text-gray-900 dark:text-white mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Tallas
                    </span>
                    <motion.div
                      animate={{ rotate: expandedSections.size ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedSections.size ? "auto" : 0,
                      opacity: expandedSections.size ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {Array.isArray(sizes) &&
                        sizes.map((size) => (
                          <motion.button
                            key={size.id}
                            onClick={() => {
                              setActiveSizeId(
                                activeSizeId === size.id ? null : size.id
                              );
                              const url = new URL(window.location.href);
                              if (activeSizeId === size.id) {
                                url.searchParams.delete("talla");
                              } else {
                                url.searchParams.set(
                                  "talla",
                                  size.id.toString()
                                );
                              }
                              window.history.pushState({}, "", url.toString());
                              scrollToProducts();
                              setIsOpen(false);
                            }}
                            className={`py-3 px-4 text-sm font-semibold transition-all rounded-xl border-2 ${
                              activeSizeId === size.id
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                                : "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {size.name}
                          </motion.button>
                        ))}
                    </div>
                  </motion.div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <button
                    onClick={() => toggleSection("priceRange")}
                    className="flex items-center justify-between w-full text-left font-bold text-gray-900 dark:text-white mb-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Rango de Precio
                    </span>
                    <motion.div
                      animate={{
                        rotate: expandedSections.priceRange ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedSections.priceRange ? "auto" : 0,
                      opacity: expandedSections.priceRange ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handlePriceSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Mínimo
                          </label>
                          <input
                            type="number"
                            name="minPrice"
                            placeholder="$0"
                            defaultValue={priceRange.min || ""}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Máximo
                          </label>
                          <input
                            type="number"
                            name="maxPrice"
                            placeholder="$1000"
                            defaultValue={priceRange.max || ""}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                          />
                        </div>
                      </div>
                      <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Aplicar Filtro
                      </motion.button>
                    </form>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
