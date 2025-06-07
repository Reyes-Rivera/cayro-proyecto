"use client";

import type React from "react";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type {
  Brand,
  Category,
  Color,
  Gender,
  Size,
  Sleeve,
} from "../../../../types/products";
import MobileFilters from "./MoobileFilters";
import QuickSearch from "./SearchBar";

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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function ProductFilters({
  categories = [],
  brands = [],
  colors = [],
  sizes = [],
  genders = [],
  sleeves = [],
  activeCategoryId = null,
  setActiveCategoryId = () => {},
  activeBrandId = null,
  setActiveBrandId = () => {},
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
  searchTerm = "",
  setSearchTerm = () => {},
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    color: true,
    gender: true,
    collarType: false,
    size: false,
    priceRange: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Función para hacer scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

    // Update URL
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

    // Scroll to top after applying price filter
    scrollToTop();
  };

  return (
    <>
      {/* Mobile Filters Component */}
      <MobileFilters
        categories={categories}
        brands={brands}
        colors={colors}
        sizes={sizes}
        genders={genders}
        sleeves={sleeves}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
        activeBrandId={activeBrandId}
        setActiveBrandId={setActiveBrandId}
        activeColorId={activeColorId}
        setActiveColorId={setActiveColorId}
        activeSizeId={activeSizeId}
        setActiveSizeId={setActiveSizeId}
        activeGenderId={activeGenderId}
        setActiveGenderId={setActiveGenderId}
        activeSleeveId={activeSleeveId}
        setActiveSleeveId={setActiveSleeveId}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Desktop Filters - Enhanced Card Design */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg p-6 sticky top-6">
          {/* Header with gradient background */}
          <div className="bg-blue-600 -m-6 mb-6 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Filtros</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-blue-100 hover:text-white text-sm font-medium bg-white/20 px-3 py-1 rounded-full transition-colors"
                >
                  Limpiar Todo
                </button>
              )}
            </div>
          </div>

          {/* Búsqueda */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
              Búsqueda
            </h4>
            <QuickSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("category")}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Categoría
              {expandedSections.category ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {expandedSections.category && (
              <div className="space-y-3">
                {Array.isArray(categories) &&
                  categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center group cursor-pointer"
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
                          window.history.pushState({}, "", url.toString());
                          scrollToTop();
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategoryId === null}
                    onChange={() => {
                      setActiveCategoryId(null);
                      const url = new URL(window.location.href);
                      url.searchParams.delete("categoria");
                      window.history.pushState({}, "", url.toString());
                      scrollToTop();
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Todas las Categorías
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Color */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("color")}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Color
              {expandedSections.color ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {expandedSections.color && (
              <div className="grid grid-cols-6 gap-2">
                {Array.isArray(colors) &&
                  colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setActiveColorId(
                          activeColorId === color.id ? null : color.id
                        );
                        const url = new URL(window.location.href);
                        if (activeColorId === color.id) {
                          url.searchParams.delete("color");
                        } else {
                          url.searchParams.set("color", color.id.toString());
                        }
                        window.history.pushState({}, "", url.toString());
                        scrollToTop();
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                        activeColorId === color.id
                          ? "border-blue-600 ring-2 ring-blue-600 ring-offset-2"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hexValue }}
                      title={color.name}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("gender")}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Género
              {expandedSections.gender ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {expandedSections.gender && (
              <div className="space-y-3">
                {Array.isArray(genders) &&
                  genders.map((gender) => (
                    <label
                      key={gender.id}
                      className="flex items-center group cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        checked={activeGenderId === gender.id}
                        onChange={() => {
                          setActiveGenderId(gender.id);
                          const url = new URL(window.location.href);
                          url.searchParams.set("genero", gender.id.toString());
                          window.history.pushState({}, "", url.toString());
                          scrollToTop();
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {gender.name}
                      </span>
                    </label>
                  ))}
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={activeGenderId === null}
                    onChange={() => {
                      setActiveGenderId(null);
                      const url = new URL(window.location.href);
                      url.searchParams.delete("genero");
                      window.history.pushState({}, "", url.toString());
                      scrollToTop();
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Todos los Géneros
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Collar Type */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("collarType")}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Tipo de Cuello
              {expandedSections.collarType ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {expandedSections.collarType && (
              <div className="space-y-3">
                {Array.isArray(sleeves) &&
                  sleeves.map(
                    (sleeve) =>
                      sleeve.id !== 4 && (
                        <label
                          key={sleeve.id}
                          className="flex items-center group cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="sleeve"
                            checked={activeSleeveId === sleeve.id}
                            onChange={() => {
                              setActiveSleeveId(sleeve.id);
                              const url = new URL(window.location.href);
                              url.searchParams.set(
                                "manga",
                                sleeve.id.toString()
                              );
                              window.history.pushState({}, "", url.toString());
                              scrollToTop();
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {sleeve.name}
                          </span>
                        </label>
                      )
                  )}
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="radio"
                    name="sleeve"
                    checked={activeSleeveId === null}
                    onChange={() => {
                      setActiveSleeveId(null);
                      const url = new URL(window.location.href);
                      url.searchParams.delete("manga");
                      window.history.pushState({}, "", url.toString());
                      scrollToTop();
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Todos los Tipos
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Size */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("size")}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Tallas
              {expandedSections.size ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {expandedSections.size && (
              <div className="space-y-3">
                {Array.isArray(sizes) &&
                  sizes.map((size) => (
                    <label
                      key={size.id}
                      className="flex items-center group cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="size"
                        checked={activeSizeId === size.id}
                        onChange={() => {
                          setActiveSizeId(size.id);
                          const url = new URL(window.location.href);
                          url.searchParams.set("talla", size.id.toString());
                          window.history.pushState({}, "", url.toString());
                          scrollToTop();
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {size.name}
                      </span>
                    </label>
                  ))}
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    checked={activeSizeId === null}
                    onChange={() => {
                      setActiveSizeId(null);
                      const url = new URL(window.location.href);
                      url.searchParams.delete("talla");
                      window.history.pushState({}, "", url.toString());
                      scrollToTop();
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Todas las Tallas
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("priceRange")}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Rango de Precio
              {expandedSections.priceRange ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {expandedSections.priceRange && (
              <form onSubmit={handlePriceSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
                      Mín
                    </label>
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="$0"
                      defaultValue={priceRange.min || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
                      Máx
                    </label>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="$1000"
                      defaultValue={priceRange.max || ""}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Aplicar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
