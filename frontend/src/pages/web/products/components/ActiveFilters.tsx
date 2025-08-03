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
} from "../../../../types/products";

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
    <div className="flex flex-wrap gap-2">
      {searchTerm && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setSearchTerm("");
            const url = new URL(window.location.href);
            url.searchParams.delete("search");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
        >
          Búsqueda: {searchTerm}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeCategoryId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setActiveCategoryId(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("categoria");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
        >
          Categoría:{" "}
          {categories.find((c) => c.id === activeCategoryId)?.name ||
            "Desconocida"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeBrandId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setActiveBrandId(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("marca");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
        >
          Marca:{" "}
          {brands.find((b) => b.id === activeBrandId)?.name || "Desconocida"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeGenderId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setActiveGenderId(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("genero");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
        >
          Género:{" "}
          {genders.find((g) => g.id === activeGenderId)?.name || "Desconocido"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeColorId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setActiveColorId(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("color");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
        >
          Color:{" "}
          {colors.find((c) => c.id === activeColorId)?.name || "Desconocido"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeSizeId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setActiveSizeId(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("talla");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
        >
          Talla:{" "}
          {sizes.find((s) => s.id === activeSizeId)?.name || "Desconocida"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {activeSleeveId !== null && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setActiveSleeveId(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("manga");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
        >
          Tipo de Manga:{" "}
          {sleeves.find((s) => s.id === activeSleeveId)?.name || "Desconocido"}
          <X className="h-4 w-4" />
        </motion.button>
      )}

      {(priceRange.min !== null || priceRange.max !== null) && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setPriceRange({ min: null, max: null });
            const url = new URL(window.location.href);
            url.searchParams.delete("precioMin");
            url.searchParams.delete("precioMax");
            url.searchParams.delete("priceMin");
            url.searchParams.delete("priceMax");
            window.history.pushState({}, "", url.toString());
          }}
          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
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
          onClick={clearAllFilters}
          className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-2 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800"
        >
          Limpiar todos
          <X className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  );
};

export default ActiveFilters;
