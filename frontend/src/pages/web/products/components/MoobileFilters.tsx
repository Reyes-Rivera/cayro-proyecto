"use client";
import type React from "react";
import { useState } from "react";
import {
  X,
  Filter,
  ChevronDown,
  Search,
  Palette,
  Users,
  Ruler,
  DollarSign,
  Tag,
} from "lucide-react";
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
      {/* Enhanced Mobile Filter Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative"
        >
          {/* Animated glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full blur-lg opacity-60 animate-pulse"></div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-white/20"
          >
            <motion.div
              animate={{ rotate: hasActiveFilters ? [0, 10, -10, 0] : 0 }}
              transition={{
                duration: 0.5,
                repeat: hasActiveFilters ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 2,
              }}
            >
              <Filter className="w-5 h-5" />
            </motion.div>
            <span className="font-bold text-sm">Filtros</span>
            {hasActiveFilters && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                className="w-3 h-3 bg-white rounded-full shadow-lg"
              />
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm z-50"
            />

            {/* Enhanced Modal - Fixed positioning with navbar offset */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 right-0 w-[90vw] max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-50 overflow-y-auto border-l border-white/20 dark:border-gray-700/50 shadow-2xl"
            >
              {/* Spectacular Header */}
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 p-4 sm:p-6  overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0"
                      >
                        <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl sm:text-2xl font-black text-white truncate">
                          Filtros
                        </h3>
                        <p className="text-blue-100 text-xs sm:text-sm font-medium">
                          Personaliza tu búsqueda
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats or active filters count */}
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <span className="text-white text-xs font-bold">
                        {hasActiveFilters ? "Filtros activos" : "Sin filtros"}
                      </span>
                    </div>
                    {hasActiveFilters && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Enhanced Clear All Button */}
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-all duration-300"></div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        clearAllFilters();
                        setIsOpen(false);
                      }}
                      className="relative w-full text-red-600 hover:text-white font-bold bg-red-50 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 px-6 py-4 rounded-xl transition-all duration-300 border border-red-200 hover:border-transparent shadow-lg"
                    >
                      ✨ Limpiar Todos los Filtros
                    </motion.button>
                  </motion.div>
                )}

                {/* Enhanced Search Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-lg">
                        Búsqueda Rápida
                      </h4>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-red-600" />
                    </motion.button>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-all duration-300"></div>
                    <div className="relative">
                      <QuickSearch
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced Category Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => toggleSection("category")}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all flex-shrink-0">
                        <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="font-black text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-blue-600 transition-colors">
                        Categoría
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.category ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors"
                    >
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedSections.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-3 pl-11 sm:pl-14"
                      >
                        {Array.isArray(categories) &&
                          categories.map((category, index) => (
                            <motion.label
                              key={category.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center group cursor-pointer p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                              whileHover={{ x: 6, scale: 1.02 }}
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
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 dark:border-gray-600 rounded-full"
                              />
                              <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-semibold">
                                {category.name}
                              </span>
                            </motion.label>
                          ))}
                        <motion.label
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: categories.length * 0.05 }}
                          className="flex items-center group cursor-pointer p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                          whileHover={{ x: 6, scale: 1.02 }}
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
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 dark:border-gray-600 rounded-full"
                          />
                          <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-semibold">
                            Todas las Categorías
                          </span>
                        </motion.label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Enhanced Color Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => toggleSection("color")}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all flex-shrink-0">
                        <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="font-black text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-purple-600 transition-colors">
                        Color
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.color ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors"
                    >
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedSections.color && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-11 sm:pl-14"
                      >
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                          {Array.isArray(colors) &&
                            colors.map((color, index) => (
                              <motion.button
                                key={color.id}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  delay: index * 0.05,
                                  type: "spring",
                                  stiffness: 200,
                                }}
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
                                  window.history.pushState(
                                    {},
                                    "",
                                    url.toString()
                                  );
                                  scrollToProducts();
                                  setIsOpen(false);
                                }}
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden ${
                                  activeColorId === color.id
                                    ? "border-blue-600 ring-4 ring-blue-600/30 scale-110"
                                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:scale-105"
                                }`}
                                style={{ backgroundColor: color.hexValue }}
                                title={color.name}
                                whileHover={{ scale: 1.15, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {activeColorId === color.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                  >
                                    <div className="w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    </div>
                                  </motion.div>
                                )}
                              </motion.button>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Enhanced Gender Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => toggleSection("gender")}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all flex-shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="font-black text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-orange-600 transition-colors">
                        Género
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.gender ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors"
                    >
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-orange-600" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedSections.gender && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-3 pl-11 sm:pl-14"
                      >
                        {Array.isArray(genders) &&
                          genders.map((gender, index) => (
                            <motion.label
                              key={gender.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center group cursor-pointer p-4 rounded-2xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 transition-all duration-300 border border-transparent hover:border-orange-200 dark:hover:border-orange-800"
                              whileHover={{ x: 6, scale: 1.02 }}
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
                                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-2 border-gray-300 dark:border-gray-600 rounded-full"
                              />
                              <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors font-semibold">
                                {gender.name}
                              </span>
                            </motion.label>
                          ))}
                        <motion.label
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: genders.length * 0.05 }}
                          className="flex items-center group cursor-pointer p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                          whileHover={{ x: 6, scale: 1.02 }}
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
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 dark:border-gray-600 rounded-full"
                          />
                          <span className="ml-4 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors font-semibold">
                            Todos los Géneros
                          </span>
                        </motion.label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Enhanced Size Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => toggleSection("size")}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all flex-shrink-0">
                        <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="font-black text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-teal-600 transition-colors">
                        Tallas
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.size ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-teal-100 dark:group-hover:bg-teal-900/30 transition-colors"
                    >
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-teal-600" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedSections.size && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-11 sm:pl-14"
                      >
                        <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                          {Array.isArray(sizes) &&
                            sizes.map((size, index) => (
                              <motion.button
                                key={size.id}
                                initial={{ scale: 0, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{
                                  delay: index * 0.05,
                                  type: "spring",
                                  stiffness: 200,
                                }}
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
                                  window.history.pushState(
                                    {},
                                    "",
                                    url.toString()
                                  );
                                  scrollToProducts();
                                  setIsOpen(false);
                                }}
                                className={`py-3 px-4 text-sm font-bold transition-all rounded-2xl border-2 shadow-lg hover:shadow-xl relative overflow-hidden ${
                                  activeSizeId === size.id
                                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-600 shadow-teal-600/25 scale-105"
                                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 hover:scale-105"
                                }`}
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {size.name}
                                {activeSizeId === size.id && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"
                                  />
                                )}
                              </motion.button>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Enhanced Price Range Filter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => toggleSection("priceRange")}
                    className="flex items-center justify-between w-full text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all flex-shrink-0">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="font-black text-gray-900 dark:text-white text-base sm:text-lg group-hover:text-emerald-600 transition-colors">
                        Rango de Precio
                      </span>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedSections.priceRange ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors"
                    >
                      <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-emerald-600" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedSections.priceRange && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden pl-11 sm:pl-14"
                      >
                        <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                          <form
                            onSubmit={handlePriceSubmit}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">
                                  💰 Mínimo
                                </label>
                                <input
                                  type="number"
                                  name="minPrice"
                                  placeholder="$0"
                                  defaultValue={priceRange.min || ""}
                                  className="w-full px-4 py-3 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all shadow-sm hover:shadow-md"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">
                                  💎 Máximo
                                </label>
                                <input
                                  type="number"
                                  name="maxPrice"
                                  placeholder="$1000"
                                  defaultValue={priceRange.max || ""}
                                  className="w-full px-4 py-3 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all shadow-sm hover:shadow-md"
                                />
                              </div>
                            </div>
                            <motion.button
                              type="submit"
                              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl border border-emerald-500"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              ✨ Aplicar Filtro de Precio
                            </motion.button>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
