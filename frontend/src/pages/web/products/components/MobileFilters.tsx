"use client";

import { motion } from "framer-motion";
import {
  Filter,
  ArrowUpDown,
  X,
  Tag,
  Shirt,
  Palette,
  Ruler,
  Users,
} from "lucide-react";
import { useRef, useEffect } from "react";
import type { Brand, Category, Color, Gender, Size } from "../utils/products";
import type { SortOption } from "../ProductsSection";

interface MobileFiltersButtonProps {
  setMobileFiltersOpen: (open: boolean) => void;
  activeSort: SortOption;
  setActiveSort: (sort: SortOption) => void;
}

function MobileFiltersButton({
  setMobileFiltersOpen,
  activeSort,
  setActiveSort,
}: MobileFiltersButtonProps) {
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Effect to detect clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        document.getElementById("sort-dropdown")?.classList.add("hidden");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setMobileFiltersOpen(true)}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <span>Filtros</span>
      </motion.button>

      <div className="relative" ref={sortDropdownRef}>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => {
            document
              .getElementById("sort-dropdown")
              ?.classList.toggle("hidden");
          }}
        >
          <ArrowUpDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span>Ordenar</span>
        </motion.button>
        <div
          id="sort-dropdown"
          className="hidden absolute right-0 z-10 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-2">
            <button
              className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                activeSort === "default"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("default");
                document
                  .getElementById("sort-dropdown")
                  ?.classList.add("hidden");
              }}
            >
              Predeterminado
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                activeSort === "price-low"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("price-low");
                document
                  .getElementById("sort-dropdown")
                  ?.classList.add("hidden");
              }}
            >
              Precio: Menor a Mayor
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                activeSort === "price-high"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("price-high");
                document
                  .getElementById("sort-dropdown")
                  ?.classList.add("hidden");
              }}
            >
              Precio: Mayor a Menor
            </button>
            <button
              className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                activeSort === "newest"
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                setActiveSort("newest");
                document
                  .getElementById("sort-dropdown")
                  ?.classList.add("hidden");
              }}
            >
              Más Recientes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

interface MobileFiltersPanelProps {
  setMobileFiltersOpen: (open: boolean) => void;
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
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  filteredProductsCount: number;
}

function MobileFiltersPanel({
  setMobileFiltersOpen,
  categories,
  brands,
  colors,
  sizes,
  genders,
  activeCategoryId,
  setActiveCategoryId,
  activeBrandId,
  setActiveBrandId,
  activeColorId,
  setActiveColorId,
  activeSizeId,
  setActiveSizeId,
  activeGenderId,
  setActiveGenderId,
  hasActiveFilters,
  clearAllFilters,
  filteredProductsCount,
}: MobileFiltersPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm md:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setMobileFiltersOpen(false);
        }
      }}
    >
      <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-xl p-5 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Filtros
          </h3>
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="w-full mb-6 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            Limpiar todos los filtros
          </button>
        )}

        {/* Categorías */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Shirt className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Categorías
          </h4>
          <div className="space-y-2">
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeCategoryId === null
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveCategoryId(null)}
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
                onClick={() => setActiveCategoryId(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Marcas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Marcas
          </h4>
          <div className="space-y-2">
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeBrandId === null
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveBrandId(null)}
            >
              Todas las Marcas
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                  activeBrandId === brand.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setActiveBrandId(brand.id)}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colores */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Palette className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Colores
          </h4>
          <div className="grid grid-cols-5 gap-3">
            <button
              className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 ${
                activeColorId === null
                  ? "ring-2 ring-offset-2 ring-blue-500"
                  : ""
              } transition-all duration-200 hover:scale-110 flex items-center justify-center`}
              onClick={() => setActiveColorId(null)}
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
                }`}
                style={{ backgroundColor: color.hexValue }}
                onClick={() => setActiveColorId(color.id)}
                aria-label={`Color: ${color.name}`}
              />
            ))}
          </div>
        </div>

        {/* Tallas */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Ruler className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Tallas
          </h4>
          <div className="grid grid-cols-4 gap-2">
            <button
              className={`py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeSizeId === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
              } hover:scale-105`}
              onClick={() => setActiveSizeId(null)}
            >
              Todas
            </button>
            {sizes.map((size) => (
              <button
                key={size.id}
                className={`py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSizeId === size.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                } hover:scale-105`}
                onClick={() => setActiveSizeId(size.id)}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>

        {/* Género */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            Género
          </h4>
          <div className="space-y-2">
            <button
              className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                activeGenderId === null
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveGenderId(null)}
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
                onClick={() => setActiveGenderId(gender.id)}
              >
                {gender.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setMobileFiltersOpen(false)}
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md"
        >
          Ver {filteredProductsCount} productos
        </button>
      </div>
    </motion.div>
  );
}

// Composite component
const MobileFilters = Object.assign(MobileFiltersButton, {
  Panel: MobileFiltersPanel,
});

export default MobileFilters;
