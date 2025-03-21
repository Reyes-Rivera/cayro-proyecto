"use client";

import { motion } from "framer-motion";
import {
  Filter,
  Shirt,
  Palette,
  Ruler,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Brand, Category, Color, Gender, Size } from "../utils/products";

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  colors: Color[];
  sizes: Size[];
  genders: Gender[];
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
  activeSort: string;
  setActiveSort: (sort: any) => void;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

export default function ProductFilters({
  categories,
  colors,
  sizes,
  genders,
  activeCategoryId,
  setActiveCategoryId,

  activeColorId,
  setActiveColorId,
  activeSizeId,
  setActiveSizeId,
  activeGenderId,
  setActiveGenderId,
  activeSort,
  setActiveSort,
  hasActiveFilters,
  clearAllFilters,
}: ProductFiltersProps) {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden md:block w-64 flex-shrink-0"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Filtros
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Categorías */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Shirt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Categorías
          </h4>
          <div className="space-y-2">
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeCategoryId === null
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveCategoryId(null);
                scrollToProducts();
              }}
            >
              Todas las Categorías
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                  activeCategoryId === category.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  setActiveCategoryId(category.id);
                  scrollToProducts();
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Colores
          </h4>
          <div className="grid grid-cols-4 gap-3">
            <button
              className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 ${
                activeColorId === null
                  ? "ring-2 ring-offset-2 ring-blue-500"
                  : ""
              } transition-all duration-200 hover:scale-110 flex items-center justify-center`}
              onClick={() => {
                setActiveColorId(null);
                scrollToProducts();
              }}
              aria-label="Todos los colores"
            >
              <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>
            {colors.map((color) => (
              <button
                key={color.id}
                className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
                  activeColorId === color.id
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                } relative group border border-gray-300 dark:border-gray-600`}
                style={{ backgroundColor: color.hexValue }}
                onClick={() => {
                  setActiveColorId(color.id);
                  scrollToProducts();
                }}
                aria-label={`Color: ${color.name}`}
              >
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tallas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Tallas
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                activeSizeId === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => {
                setActiveSizeId(null);
                scrollToProducts();
              }}
            >
              Todas
            </button>
            {sizes.map((size) => (
              <button
                key={size.id}
                className={`py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  activeSizeId === size.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => {
                  setActiveSizeId(size.id);
                  scrollToProducts();
                }}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>

        {/* Género */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Género
          </h4>
          <div className="space-y-2">
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeGenderId === null
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveGenderId(null);
                scrollToProducts();
              }}
            >
              Todos los Géneros
            </button>
            {genders.map((gender) => (
              <button
                key={gender.id}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                  activeGenderId === gender.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  setActiveGenderId(gender.id);
                  scrollToProducts();
                }}
              >
                {gender.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ordenar por (en escritorio) */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Ordenar por
          </h4>
          <div className="space-y-2">
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeSort === "default"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("default");
                scrollToProducts();
              }}
            >
              Predeterminado
            </button>
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeSort === "price-low"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("price-low");
                scrollToProducts();
              }}
            >
              Precio: Menor a Mayor
            </button>
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeSort === "price-high"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("price-high");
                scrollToProducts();
              }}
            >
              Precio: Mayor a Menor
            </button>
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeSort === "newest"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("newest");
                scrollToProducts();
              }}
            >
              Más Recientes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
