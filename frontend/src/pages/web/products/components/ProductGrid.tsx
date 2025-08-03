"use client";
import type { Product } from "@/types/products";
import { AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  hoveredProduct: number | null;
  setHoveredProduct: (id: number | null) => void;
  noProductsFound: boolean;
  clearAllFilters: () => void;
  viewMode?: "grid" | "list";
}

export default function ProductGrid({
  products,
  hoveredProduct,
  setHoveredProduct,
  noProductsFound,
  clearAllFilters,
  viewMode = "grid",
}: ProductGridProps) {
  const validProducts = products.filter(
    (product) => product.variants && product.variants.length > 0
  );

  if (products.length > 0 && validProducts.length === 0) {
    return (
      <div className="py-12 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Los productos no tienen variantes disponibles. Contacte al
          administrador.
        </p>
      </div>
    );
  }

  if (noProductsFound) {
    return (
      <div className="py-16 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          No se encontraron productos
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          No se encontraron productos que coincidan con los filtros
          seleccionados.
        </p>
        <button
          onClick={clearAllFilters}
          className="px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors rounded-lg flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Limpiar filtros
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${
        viewMode === "grid"
          ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
          : "flex flex-col gap-4"
      }`}
    >
      {validProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isHovered={hoveredProduct === product.id}
          onHover={() => setHoveredProduct(product.id)}
          onLeave={() => setHoveredProduct(null)}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
