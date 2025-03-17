"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Brand, Category, Color, Gender, Size } from "../utils/products";
import { SortOption } from "../ProductsSection";

interface ActiveFiltersProps {
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
  setActiveSort: (sort: SortOption) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearAllFilters: () => void;
  categories: Category[];
  brands: Brand[];
  colors: Color[];
  sizes: Size[];
  genders: Gender[];
}

export default function ActiveFilters({
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
  activeSort,
  setActiveSort,
  searchTerm,
  setSearchTerm,
  clearAllFilters,
  categories,
  brands,
  colors,
  sizes,
  genders,
}: ActiveFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap gap-2 mb-6"
    >
      {activeCategoryId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setActiveCategoryId(null)}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Categoría: {categories.find((c) => c.id === activeCategoryId)?.name}
          <X className="h-4 w-4" />
        </motion.button>
      )}
      {activeBrandId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => setActiveBrandId(null)}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Marca: {brands.find((b) => b.id === activeBrandId)?.name}
          <X className="h-4 w-4" />
        </motion.button>
      )}
      {activeGenderId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => setActiveGenderId(null)}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Género: {genders.find((g) => g.id === activeGenderId)?.name}
          <X className="h-4 w-4" />
        </motion.button>
      )}
      {activeColorId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => setActiveColorId(null)}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Color: {colors.find((c) => c.id === activeColorId)?.name}
          <X className="h-4 w-4" />
        </motion.button>
      )}
      {activeSizeId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          onClick={() => setActiveSizeId(null)}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Talla: {sizes.find((s) => s.id === activeSizeId)?.name}
          <X className="h-4 w-4" />
        </motion.button>
      )}
      {searchTerm && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          onClick={() => setSearchTerm("")}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Búsqueda: {searchTerm}
          <X className="h-4 w-4" />
        </motion.button>
      )}
      {activeSort !== "default" && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          onClick={() => setActiveSort("default")}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Orden:{" "}
          {activeSort === "price-low"
            ? "Precio menor"
            : activeSort === "price-high"
            ? "Precio mayor"
            : "Más recientes"}
          <X className="h-4 w-4" />
        </motion.button>
      )}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        onClick={clearAllFilters}
        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Limpiar todos
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}
