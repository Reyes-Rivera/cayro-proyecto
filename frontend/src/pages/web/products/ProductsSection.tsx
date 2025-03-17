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
import ProductHero from "./components/ProductHero";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";
import MobileFilters from "./components/MobileFilters";
import ActiveFilters from "./components/ActiveFilters";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Footer";
import { Tag, Loader2, AlertTriangle } from "lucide-react";
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const productsPerPage = 8;

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
          console.log("Productos cargados:", productsResponse.data);
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

  // Function to clear all filters
  const clearAllFilters = () => {
    setActiveCategoryId(null);
    setActiveGenderId(null);
    setActiveColorId(null);
    setActiveSizeId(null);
    setActiveBrandId(null);
    setActiveSort("default");
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if there are active filters
  const hasActiveFilters =
      activeCategoryId !== null ||
      activeGenderId !== null ||
      activeColorId !== null ||
      activeSizeId !== null ||
      activeBrandId !== null ||
      !!searchTerm || // Ensure searchTerm is coerced to a boolean
      activeSort !== "default";

  // Añade un console.log para ver los productos filtrados
  useEffect(() => {
    console.log("Productos filtrados:", filteredProducts);
    console.log("Productos actuales:", currentProducts);
  }, [filteredProducts, currentProducts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14 md:pt-0">
      {/* Hero Section */}
      <ProductHero />

      <section className="max-w-7xl mx-auto px-4 py-12" id="products-grid">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Tag className="w-7 h-7 mr-2 text-blue-600 dark:text-blue-400" />
              Nuestros Productos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto" : "productos"}{" "}
              encontrados
            </p>
          </motion.div>

          {/* Mobile filters button and sort dropdown */}
          <div className="md:hidden flex w-full justify-between">
            <MobileFilters
              setMobileFiltersOpen={setMobileFiltersOpen}
              activeSort={activeSort}
              setActiveSort={setActiveSort}
            />
          </div>

          {/* Search Bar */}
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Mobile Filters Panel */}
        {mobileFiltersOpen && (
          <MobileFilters.Panel
            setMobileFiltersOpen={setMobileFiltersOpen}
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
            hasActiveFilters={hasActiveFilters}
            clearAllFilters={clearAllFilters}
            filteredProductsCount={filteredProducts.length}
          />
        )}

        <div className="flex flex-col md:flex-row gap-8">
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

            {/* Loading State */}
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
                  <Loader2 className="w-12 h-12 animate-spin" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Cargando productos...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Error al cargar productos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    {error}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md"
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
      </section>
    </div>
  );
}
