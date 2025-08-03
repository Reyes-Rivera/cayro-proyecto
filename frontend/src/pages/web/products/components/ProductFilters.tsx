"use client";
import type React from "react";
import { useState } from "react";
import {
  ChevronDown,
  Filter,
  Tag,
  Palette,
  Users,
  Ruler,
  DollarSign,
  RotateCcw,
} from "lucide-react";
import type {
  Brand,
  Category,
  Color,
  Gender,
  Size,
  Sleeve,
} from "@/types/products";
import MobileFilters from "./MoobileFilters";

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
}: ProductFiltersProps) {
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
  };

  return (
    <>
      <MobileFilters
        categories={categories}
        brands={[]}
        colors={colors}
        sizes={sizes}
        genders={genders}
        sleeves={[]}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
        activeBrandId={null}
        setActiveBrandId={() => {}}
        activeColorId={activeColorId}
        setActiveColorId={setActiveColorId}
        activeSizeId={activeSizeId}
        setActiveSizeId={setActiveSizeId}
        activeGenderId={activeGenderId}
        setActiveGenderId={setActiveGenderId}
        activeSleeveId={null}
        setActiveSleeveId={() => {}}
        activeSort=""
        setActiveSort={() => {}}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        searchTerm=""
        setSearchTerm={() => {}}
      />

      {/* Desktop Filters */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Filter className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Filtros
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Category Filter */}
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("category")}
                className="flex items-center justify-between w-full group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Categoría
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSections.category ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.category && (
                <div className="space-y-3 pl-11">
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center cursor-pointer group"
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
                            scrollToProducts();
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  <label className="flex items-center cursor-pointer group">
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
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                      Todas las Categorías
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("color")}
                className="flex items-center justify-between w-full group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                    <Palette className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Color
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSections.color ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.color && (
                <div className="grid grid-cols-6 gap-3 pl-11">
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
                          scrollToProducts();
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          activeColorId === color.id
                            ? "border-blue-600 ring-2 ring-blue-600/30 scale-110"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: color.hexValue }}
                        title={color.name}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Gender Filter */}
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("gender")}
                className="flex items-center justify-between w-full group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Género
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSections.gender ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.gender && (
                <div className="space-y-3 pl-11">
                  {Array.isArray(genders) &&
                    genders.map((gender) => (
                      <label
                        key={gender.id}
                        className="flex items-center cursor-pointer group"
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
                            window.history.pushState({}, "", url.toString());
                            scrollToProducts();
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                          {gender.name}
                        </span>
                      </label>
                    ))}
                  <label className="flex items-center cursor-pointer group">
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
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                      Todos los Géneros
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("size")}
                className="flex items-center justify-between w-full group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                    <Ruler className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Tallas
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSections.size ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.size && (
                <div className="grid grid-cols-3 gap-2 pl-11">
                  {Array.isArray(sizes) &&
                    sizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => {
                          setActiveSizeId(
                            activeSizeId === size.id ? null : size.id
                          );
                          const url = new URL(window.location.href);
                          if (activeSizeId === size.id) {
                            url.searchParams.delete("talla");
                          } else {
                            url.searchParams.set("talla", size.id.toString());
                          }
                          window.history.pushState({}, "", url.toString());
                          scrollToProducts();
                        }}
                        className={`py-2 px-3 text-sm font-medium transition-all rounded-lg border-2 hover:scale-105 ${
                          activeSizeId === size.id
                            ? "bg-blue-600 text-white border-blue-600 scale-105"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-600"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div className="space-y-4">
              <button
                onClick={() => toggleSection("priceRange")}
                className="flex items-center justify-between w-full group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Precio
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    expandedSections.priceRange ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedSections.priceRange && (
                <form onSubmit={handlePriceSubmit} className="space-y-4 pl-11">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mínimo
                      </label>
                      <input
                        type="number"
                        name="minPrice"
                        placeholder="$0"
                        defaultValue={priceRange.min || ""}
                        className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Máximo
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        placeholder="$1000"
                        defaultValue={priceRange.max || ""}
                        className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                  >
                    Aplicar Filtro
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
