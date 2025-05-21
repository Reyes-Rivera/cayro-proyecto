"use client";

import type React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type {
  Brand,
  Category,
  Color,
  Gender,
  Size,
  Sleeve,
} from "../utils/products";

interface ActiveFiltersProps {
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
  activeBrandId: number | null;
  setActiveBrandId: (id: number | null) => void;
  activeGenderId: number | null;
  setActiveGenderId: (id: number | null) => void;
  activeColorId: number | null;
  setActiveColorId: (id: number | null) => void;
  activeSizeId: number | null;
  setActiveSizeId: (id: number | null) => void;
  activeSleeveId: number | null;
  setActiveSleeveId: (id: number | null) => void;
  activeSort: string;
  setActiveSort: (sort: any) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: { min: number | null; max: number | null };
  setPriceRange: (range: { min: number | null; max: number | null }) => void;
  clearAllFilters: () => void;
  categories: Category[];
  brands: Brand[];
  genders: Gender[];
  colors: Color[];
  sizes: Size[];
  sleeves: Sleeve[];
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  activeCategoryId,
  setActiveCategoryId,
  activeBrandId,
  setActiveBrandId,
  activeGenderId,
  setActiveGenderId,
  activeColorId,
  setActiveColorId,
  activeSizeId,
  setActiveSizeId,
  activeSleeveId,
  setActiveSleeveId,
  priceRange,
  setPriceRange,
  searchTerm,
  setSearchTerm,
  categories,
  brands,
  colors,
  sizes,
  genders,
  sleeves,
  clearAllFilters,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {searchTerm && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            setSearchTerm("");
            // Actualizar URL al eliminar búsqueda
            const url = new URL(window.location.href);
            url.searchParams.delete("search");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Búsqueda: {searchTerm}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeCategoryId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            setActiveCategoryId(null);
            // Actualizar URL al eliminar categoría
            const url = new URL(window.location.href);
            url.searchParams.delete("categoria");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Categoría:{" "}
          {(Array.isArray(categories) &&
            categories.find((c) => c.id === activeCategoryId)?.name) ||
            "Desconocida"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeBrandId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          onClick={() => {
            setActiveBrandId(null);
            // Actualizar URL
            const url = new URL(window.location.href);
            url.searchParams.delete("marca");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Marca:{" "}
          {(Array.isArray(brands) &&
            brands.find((b) => b.id === activeBrandId)?.name) ||
            "Desconocida"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeGenderId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => {
            setActiveGenderId(null);
            // Actualizar URL
            const url = new URL(window.location.href);
            url.searchParams.delete("genero");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Género:{" "}
          {(() => {
            // Buscar el género por ID y mostrar su nombre
            const gender =
              Array.isArray(genders) &&
              genders.find((g) => g.id === activeGenderId);
            return gender ? gender.name : "Desconocido";
          })()}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeColorId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          onClick={() => {
            setActiveColorId(null);
            // Actualizar URL
            const url = new URL(window.location.href);
            url.searchParams.delete("color");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Color:{" "}
          {(Array.isArray(colors) &&
            colors.find((c) => c.id === activeColorId)?.name) ||
            "Desconocido"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeSizeId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          onClick={() => {
            setActiveSizeId(null);
            // Actualizar URL
            const url = new URL(window.location.href);
            url.searchParams.delete("talla");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Talla:{" "}
          {(() => {
            // Buscar la talla por ID y mostrar su nombre
            const size =
              Array.isArray(sizes) && sizes.find((s) => s.id === activeSizeId);
            return size ? size.name : "Desconocida";
          })()}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeSleeveId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          onClick={() => {
            setActiveSleeveId(null);
            // Actualizar URL
            const url = new URL(window.location.href);
            url.searchParams.delete("manga");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tipo de Manga:{" "}
          {(Array.isArray(sleeves) &&
            sleeves.find((s) => s.id === activeSleeveId)?.name) ||
            "Desconocido"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {(priceRange.min !== null || priceRange.max !== null) && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          onClick={() => {
            setPriceRange({ min: null, max: null });
            // Actualizar URL
            const url = new URL(window.location.href);
            url.searchParams.delete("precioMin");
            url.searchParams.delete("precioMax");
            url.searchParams.delete("priceMin");
            url.searchParams.delete("priceMax");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Precio: {priceRange.min !== null ? `$${priceRange.min}` : "$0"} -{" "}
          {priceRange.max !== null ? `$${priceRange.max}` : "Sin límite"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {/* Clear all button */}
      {(activeCategoryId !== null ||
        activeBrandId !== null ||
        activeGenderId !== null ||
        activeColorId !== null ||
        activeSizeId !== null ||
        activeSleeveId !== null ||
        priceRange.min !== null ||
        priceRange.max !== null ||
        searchTerm) && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          onClick={clearAllFilters}
          className="flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-full text-sm hover:bg-red-100 dark:hover:bg-red-900/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Limpiar todos los filtros
          <X className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
};

export default ActiveFilters;
