"use client";

import { useState, useEffect } from "react";
import {
  getBrands,
  getCategories,
  getColors,
  getGenders,
  getProducts,
  getSizes,
} from "@/api/products";

import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

// Interfaces
import type {
  Product,
  Brand,
  Category,
  Gender,
  Size,
  Color,
} from "./utils/products";
import ProductHero from "./components/ProductHero";
// import MobileFilters from "./components/MobileFilters";
import ProductFilters from "./components/ProductFilters";
import ActiveFilters from "./components/ActiveFilters";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Footer";

export type SortOption = "default" | "price-low" | "price-high" | "newest";

export default function ProductsPage() {
  // State for products and filters
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for active filters
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeGenderId, setActiveGenderId] = useState<number | null>(null);
  const [activeColorId, setActiveColorId] = useState<number | null>(null);
  const [activeSizeId, setActiveSizeId] = useState<number | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);
  const [activeSort, setActiveSort] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const productsPerPage = 12;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          productsResponse,
          brandsResponse,
          categoriesResponse,
          gendersResponse,
          sizesResponse,
          colorsResponse,
        ] = await Promise.all([
          getProducts(),
          getBrands(),
          getCategories(),
          getGenders(),
          getSizes(),
          getColors(),
        ]);

        if (productsResponse.data) {
          setProducts(productsResponse.data);
        } else {
          console.log("No se recibieron productos");
        }
        if (brandsResponse.data) {
          setBrands(brandsResponse.data);
        }
        if (categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        if (gendersResponse.data) {
          setGenders(gendersResponse.data);
        }
        if (sizesResponse.data) {
          setSizes(sizesResponse.data);
        }
        if (colorsResponse.data) {
          setColors(colorsResponse.data);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Filter by active status
      if (!product.active) return false;

      // Filter by category
      if (activeCategoryId !== null && product.categoryId !== activeCategoryId)
        return false;

      // Filter by gender
      if (activeGenderId !== null && product.genderId !== activeGenderId)
        return false;

      // Filter by brand
      if (activeBrandId !== null && product.brandId !== activeBrandId)
        return false;

      // Filter by color
      if (
        activeColorId !== null &&
        !product.variants.some((variant) => variant.colorId === activeColorId)
      )
        return false;

      // Filter by size
      if (
        activeSizeId !== null &&
        !product.variants.some((variant) => variant.sizeId === activeSizeId)
      )
        return false;

      // Filter by search term
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      return true;
    })
    .sort((a, b) => {
      // Get the lowest price variant for each product
      const aLowestPrice = Math.min(...a.variants.map((v) => v.price));
      const bLowestPrice = Math.min(...b.variants.map((v) => v.price));

      switch (activeSort) {
        case "price-low":
          return aLowestPrice - bLowestPrice;
        case "price-high":
          return bLowestPrice - aLowestPrice;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeCategoryId,
    activeGenderId,
    activeColorId,
    activeSizeId,
    activeBrandId,
    activeSort,
    searchTerm,
  ]);

  // Add this useEffect to read URL parameters when the component mounts
  useEffect(() => {
    // Read URL parameters
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("categoria");

    // If a category parameter exists, find the matching category and set it as active
    if (categoryParam && categories.length > 0) {
      const matchedCategory = categories.find(
        (category) =>
          category.name.toLowerCase() === categoryParam.toLowerCase()
      );

      if (matchedCategory) {
        setActiveCategoryId(matchedCategory.id);
        // Scroll to products section
        const productsSection = document.getElementById("products-grid");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [categories]); // Only run when categories are loaded

  // Function to clear all filters
  const clearAllFilters = () => {
    setActiveCategoryId(null);
    setActiveGenderId(null);
    setActiveColorId(null);
    setActiveSizeId(null);
    setActiveBrandId(null);
    setActiveSort("default");
    setSearchTerm("");

    // Limpiar los parámetros de URL
    window.history.pushState({}, "", window.location.pathname);

    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Check if there are active filters
  const hasActiveFilters =
    activeCategoryId !== null ||
    activeGenderId !== null ||
    activeColorId !== null ||
    activeSizeId !== null ||
    activeBrandId !== null ||
    !!searchTerm ||
    activeSort !== "default";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <ProductHero
        setActiveCategoryId={setActiveCategoryId}
        setSearchTerm={setSearchTerm}
        scrollToProducts={() => {
          const productsSection = document.getElementById("products-grid");
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      <section
        className="w-full py-16 md:py-24 bg-white dark:bg-gray-900 relative z-10"
        id="products-grid"
      >
        {/* Top blue bar */}
      
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-4 md:gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Nuestra Colección
              </h2>
              <div className="mt-2 flex items-center">
                <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-blue-400 mr-4 rounded-full"></div>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "producto" : "productos"}
                </p>
              </div>
            </motion.div>
          </div>

        
          {/* Active Filters Chips */}
          {hasActiveFilters && (
            <ActiveFilters
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
              activeSort={activeSort}
              setActiveSort={setActiveSort}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              clearAllFilters={clearAllFilters}
              categories={categories}
              brands={brands}
              colors={colors}
              sizes={sizes}
              genders={genders}
            />
          )}

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-8">
            {/* Desktop Filters */}
            <ProductFilters
              categories={categories}
              brands={brands}
              colors={colors}
              sizes={sizes}
              genders={genders}
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
              activeSort={activeSort}
              setActiveSort={setActiveSort}
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Loading State */}
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 md:py-40"
                >
                  <div className="relative">
                    <div className="h-16 w-16 md:h-24 md:w-24 rounded-full border-t-2 border-b-2 border-blue-600 animate-spin"></div>
                    <div className="absolute top-0 left-0 h-16 w-16 md:h-24 md:w-24 rounded-full border-r-2 border-transparent border-opacity-50 animate-[spin_1.5s_linear_infinite]"></div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-8 font-light tracking-wider uppercase text-sm">
                    Cargando colección
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-gray-800/50 p-8 md:p-16 text-center rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
                >
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle
                      className="h-12 w-12 md:h-16 md:w-16 text-red-500 mb-6 md:mb-8"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Error al cargar productos
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 md:mb-10 max-w-md">
                      {error}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.location.reload()}
                      className="px-8 py-3 md:px-10 md:py-4 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors rounded-lg shadow-lg shadow-blue-600/20"
                    >
                      Intentar de nuevo
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Product Grid */}
                  <ProductGrid
                    products={currentProducts}
                    hoveredProduct={hoveredProduct}
                    setHoveredProduct={setHoveredProduct}
                    noProductsFound={currentProducts.length === 0}
                    clearAllFilters={clearAllFilters}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
