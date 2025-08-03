"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type React from "react";
import {
  AlertTriangle,
  Grid3X3,
  List,
  Search,
  Paintbrush,
  Zap,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

// Interfaces
import type {
  Product,
  Brand,
  Category,
  Gender,
  Size,
  Color,
  Sleeve,
} from "@/types/products";
import ProductFilters from "./components/ProductFilters";
import ActiveFilters from "./components/ActiveFilters";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Footer";
import {
  getProducts,
  getBrands,
  getCategories,
  getGenders,
  getSizes,
  getColors,
  getSleeve,
} from "@/api/products";
import Loader from "@/components/web-components/Loader";
import { useNavigate } from "react-router-dom";
import { AlertHelper } from "@/utils/alert.util";

export type SortOption = "default" | "price-low" | "price-high" | "newest";

export default function ProductsPage() {
  // State for products and filters
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sleeves, setSleeves] = useState<Sleeve[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // State for active filters
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeGenderId, setActiveGenderId] = useState<number | null>(null);
  const [activeColorId, setActiveColorId] = useState<number | null>(null);
  const [activeSizeId, setActiveSizeId] = useState<number | null>(null);
  const [activeSleeveId, setActiveSleeveId] = useState<number | null>(null);
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);
  const [activeSort, setActiveSort] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>(""); // Separate input state
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

  const productsPerPage = 12;
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  // Función para cargar filtros base
  const loadFiltersData = useCallback(async () => {
    try {
      const handleFetch = async (fetchFn: () => Promise<any>, name: string) => {
        try {
          const response = await fetchFn();
          return Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.data)
            ? response.data.data
            : [];
        } catch (err: any) {
          AlertHelper.error({
            title: `Error al cargar ${name}`,
            message:
              err.response?.data?.message ||
              `No se pudo cargar la información de ${name}.`,
            animation: "slideIn",
            timer: 4000,
          });
          return [];
        }
      };

      const [
        brandsData,
        categoriesData,
        gendersData,
        sizesData,
        colorsData,
        sleevesData,
      ] = await Promise.all([
        handleFetch(getBrands, "marcas"),
        handleFetch(getCategories, "categorías"),
        handleFetch(getGenders, "géneros"),
        handleFetch(getSizes, "tallas"),
        handleFetch(getColors, "colores"),
        handleFetch(getSleeve, "tipos de cuello"),
      ]);

      setBrands(brandsData);
      setCategories(categoriesData);
      setGenders(gendersData);
      setSizes(sizesData);
      setColors(colorsData);
      setSleeves(sleevesData);
      setFiltersLoaded(true);
    } catch (err: any) {
      setError(
        "No se pudieron cargar los datos de filtros. Por favor, intente nuevamente."
      );
      AlertHelper.error({
        title: "Error general",
        message:
          err.response?.data?.message ||
          "Error al cargar los datos de filtros.",
        animation: "slideIn",
        timer: 4000,
      });
    }
  }, []);

  // Función para aplicar filtros desde URL
  const applyFiltersFromURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    // Categoría
    const categoryParam = params.get("categoria");
    if (categoryParam && categories.length > 0) {
      const matchedCategory = categories.find(
        (category) =>
          category.name.toLowerCase() === categoryParam.toLowerCase()
      );
      setActiveCategoryId(matchedCategory ? matchedCategory.id : null);
    } else {
      setActiveCategoryId(null);
    }

    // Género
    const genderParam = params.get("genero");
    setActiveGenderId(
      genderParam && !isNaN(Number(genderParam)) ? Number(genderParam) : null
    );

    // Talla
    const sizeParam = params.get("talla");
    setActiveSizeId(
      sizeParam && !isNaN(Number(sizeParam)) ? Number(sizeParam) : null
    );

    // Color
    const colorParam = params.get("color");
    setActiveColorId(
      colorParam && !isNaN(Number(colorParam)) ? Number(colorParam) : null
    );

    // Manga
    const sleeveParam = params.get("manga");
    setActiveSleeveId(
      sleeveParam && !isNaN(Number(sleeveParam)) ? Number(sleeveParam) : null
    );

    // Marca
    const brandParam = params.get("marca");
    setActiveBrandId(
      brandParam && !isNaN(Number(brandParam)) ? Number(brandParam) : null
    );

    // Precio
    const minPriceParam = params.get("precioMin") || params.get("priceMin");
    const maxPriceParam = params.get("precioMax") || params.get("priceMax");
    setPriceRange({
      min: minPriceParam ? Number(minPriceParam) : null,
      max: maxPriceParam ? Number(maxPriceParam) : null,
    });

    // Búsqueda
    const searchParam = params.get("search");
    const searchValue = searchParam || "";
    setSearchTerm(searchValue);
    setSearchInput(searchValue); // Sync input with URL

    // Página
    const pageParam = params.get("page");
    setCurrentPage(
      pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1
    );
  }, [categories]);

  // Función para obtener productos con filtros
  const fetchProductsWithFilters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", productsPerPage.toString());

      if (searchTerm) params.append("search", searchTerm);
      if (activeCategoryId !== null)
        params.append("category", activeCategoryId.toString());
      if (activeColorId !== null)
        params.append("colors", activeColorId.toString());
      if (activeSizeId !== null)
        params.append("sizes", activeSizeId.toString());
      if (activeGenderId !== null)
        params.append("genders", activeGenderId.toString());
      if (activeBrandId !== null)
        params.append("brand", activeBrandId.toString());
      if (activeSleeveId !== null)
        params.append("sleeves", activeSleeveId.toString());
      if (priceRange.min !== null)
        params.append("priceMin", priceRange.min.toString());
      if (priceRange.max !== null)
        params.append("priceMax", priceRange.max.toString());

      if (activeSort === "price-low") {
        params.append("sort", "price");
        params.append("order", "asc");
      } else if (activeSort === "price-high") {
        params.append("sort", "price");
        params.append("order", "desc");
      } else if (activeSort === "newest") {
        params.append("sort", "createdAt");
        params.append("order", "desc");
      }

      const queryString = params.toString();
      console.log("Fetching products with params:", queryString);

      const response = await getProducts(queryString);
      let productsData: Product[] = [];
      let totalPagesCount = 1;

      if (response && response.data) {
        if (Array.isArray(response.data.data)) {
          productsData = response.data.data;
          totalPagesCount =
            response.data.totalPages ||
            Math.ceil(response.data.total / productsPerPage);
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
          totalPagesCount = Math.ceil(productsData.length / productsPerPage);
        }

        setProducts(productsData);
        setTotalPages(totalPagesCount);
        setError(null);

        // Scroll solo si no es la carga inicial
        if (!isInitialMount.current) {
          setTimeout(() => scrollToProducts(), 100);
        }
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      if (err.status === 404) {
        setProducts([]);
        setTotalPages(1);
        return;
      }
      setError(
        "No se pudieron cargar los productos. Por favor, intente nuevamente."
      );
      setProducts([]);
      setTotalPages(1);
      AlertHelper.error({
        title: "Error al cargar productos",
        message:
          err.response?.data?.message ||
          "Ocurrió un error al cargar los productos.",
        timer: 4000,
        animation: "slideIn",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    activeCategoryId,
    activeColorId,
    activeSizeId,
    activeGenderId,
    activeBrandId,
    activeSleeveId,
    priceRange.min,
    priceRange.max,
    activeSort,
  ]);

  // Función para actualizar URL con filtros
  const updateURLWithFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (activeCategoryId !== null) {
      const category = categories.find((c) => c.id === activeCategoryId);
      if (category) params.set("categoria", category.name.toLowerCase());
    }
    if (activeGenderId !== null)
      params.set("genero", activeGenderId.toString());
    if (activeColorId !== null) params.set("color", activeColorId.toString());
    if (activeSizeId !== null) params.set("talla", activeSizeId.toString());
    if (activeSleeveId !== null) params.set("manga", activeSleeveId.toString());
    if (activeBrandId !== null) params.set("marca", activeBrandId.toString());
    if (priceRange.min !== null)
      params.set("precioMin", priceRange.min.toString());
    if (priceRange.max !== null)
      params.set("precioMax", priceRange.max.toString());
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    if (window.location.href !== window.location.origin + newUrl) {
      window.history.pushState({}, "", newUrl);
    }
  }, [
    searchTerm,
    activeCategoryId,
    activeGenderId,
    activeColorId,
    activeSizeId,
    activeSleeveId,
    activeBrandId,
    priceRange.min,
    priceRange.max,
    activeSort,
    currentPage,
    categories,
  ]);

  // Cargar filtros al montar el componente
  useEffect(() => {
    loadFiltersData();
  }, [loadFiltersData]);

  // Aplicar filtros desde URL cuando los filtros estén cargados
  useEffect(() => {
    if (filtersLoaded && categories.length > 0) {
      applyFiltersFromURL();
    }
  }, [filtersLoaded, categories, applyFiltersFromURL]);

  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    if (filtersLoaded) {
      fetchProductsWithFilters();
      // Solo actualizar URL si no es la carga inicial
      if (!isInitialMount.current) {
        updateURLWithFilters();
      }
    }
  }, [
    filtersLoaded,
    activeCategoryId,
    activeGenderId,
    activeColorId,
    activeSizeId,
    activeSleeveId,
    activeBrandId,
    activeSort,
    searchTerm,
    currentPage,
    priceRange.min,
    priceRange.max,
    fetchProductsWithFilters,
    updateURLWithFilters,
  ]);

  // Marcar que ya no es la carga inicial después del primer render
  useEffect(() => {
    if (filtersLoaded && isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [filtersLoaded]);

  // Manejar navegación del historial (botón atrás/adelante)
  useEffect(() => {
    const handlePopState = () => {
      if (filtersLoaded && categories.length > 0) {
        applyFiltersFromURL();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [filtersLoaded, categories, applyFiltersFromURL]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCustomize = () => {
    navigate("/personalizar");
  };

  const clearAllFilters = () => {
    setActiveCategoryId(null);
    setActiveGenderId(null);
    setActiveColorId(null);
    setActiveSizeId(null);
    setActiveSleeveId(null);
    setActiveBrandId(null);
    setActiveSort("default");
    setSearchTerm("");
    setSearchInput("");
    setPriceRange({ min: null, max: null });
    setCurrentPage(1);
    window.history.pushState({}, "", window.location.pathname);
    scrollToTop();
  };

  const hasActiveFilters =
    activeCategoryId !== null ||
    activeGenderId !== null ||
    activeColorId !== null ||
    activeSizeId !== null ||
    activeSleeveId !== null ||
    activeBrandId !== null ||
    priceRange.min !== null ||
    priceRange.max !== null ||
    !!searchTerm ||
    activeSort !== "default" ||
    currentPage > 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
    scrollToProducts();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Responsive Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating circles - responsive sizes */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-48 h-48 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              x: [0, -15, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 -left-16 sm:-left-32 w-40 h-40 sm:w-80 sm:h-80 bg-blue-600/5 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 sm:bottom-20 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-blue-600/8 rounded-full blur-xl"
          />

          {/* Geometric shapes - responsive */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 50,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-blue-600/20 rotate-45"
          />
          <motion.div
            animate={{
              rotate: [0, -360],
            }}
            transition={{
              duration: 40,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-3/4 right-1/3 w-4 h-4 sm:w-6 sm:h-6 bg-blue-600/15 rounded-full"
          />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fillOpacity='0.4'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen">
          <div className="w-full">
            <div className="pt-4 sm:pt-6 pb-4 sm:pb-8">
              <Breadcrumbs />
            </div>

            <div className="text-center">
              {/* Badge - responsive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 backdrop-blur-sm"
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-pulse" />
                CATÁLOGO PREMIUM
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="ml-1.5 sm:ml-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full"
                />
              </motion.div>

              {/* Main Title - highly responsive */}
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-6 sm:mb-8"
              >
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-7xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 leading-none relative px-2">
                  <span className="relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gray-900 animate-pulse">
                      ENCUENTRA
                    </span>
                    {/* Glow effect en negro */}
                    <span className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-black to-black blur-sm opacity-30">
                      ENCUENTRA
                    </span>
                  </span>
                </h1>

                {/* Decorative elements - responsive */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-blue-600/30 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </motion.div>
                  <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="text-2xl sm:text-4xl"
                  >
                    ✨
                  </motion.div>
                  <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-8 h-8 sm:w-12 sm:h-12 border-2 border-blue-600/30 rounded-full flex items-center justify-center"
                  >
                    <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </motion.div>
                </motion.div>

                {/* Description - responsive */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium max-w-4xl mx-auto leading-relaxed px-4"
                >
                  La colección más{" "}
                  <span className="relative inline-block">
                    <span className="text-blue-600 font-bold">exclusiva</span>
                    <motion.div
                      animate={{ scaleX: [0, 1] }}
                      transition={{ duration: 1, delay: 1 }}
                      className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-blue-600/30 rounded-full"
                    />
                  </span>{" "}
                  de productos personalizados
                  <br className="hidden sm:block" />
                  <span className="block sm:inline">
                    {" "}
                    diseñados especialmente para ti
                  </span>
                </motion.p>
              </motion.div>

              {/* Search Bar - responsive */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="max-w-5xl mx-auto mb-8 sm:mb-12 px-4"
              >
                <form onSubmit={handleSearch} className="relative group">
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl">
                    <div className="flex items-center">
                      <div className="pl-4 sm:pl-8 pr-2 sm:pr-4 py-4 sm:py-8">
                        <Search className="w-5 h-5 sm:w-8 sm:h-8 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      <input
                        type="text"
                        placeholder="¿Qué estás buscando hoy?"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="flex-1 py-4 sm:py-8 text-base sm:text-xl bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none"
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mr-2 sm:mr-4 px-4 sm:px-8 py-2 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg sm:rounded-xl transition-all flex items-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden xs:inline">Buscar</span>
                      </motion.button>
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Action Buttons - responsive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8 sm:mb-12 px-4"
              >
                <motion.button
                  onClick={scrollToProducts}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-full hover:border-blue-600 hover:shadow-2xl transition-all font-semibold text-base sm:text-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-blue-600 transition-colors relative z-10" />
                  <span className="relative z-10">Ver Catálogo</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.button>

                <motion.button
                  onClick={handleCustomize}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full transition-all font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                  <span className="relative z-10">Personalizar</span>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 text-lg sm:text-xl"
                  ></motion.div>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Main Products Section */}
      <section
        className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
        id="products-grid"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-600/3 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/2 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 backdrop-blur-sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              CATÁLOGO DE PRODUCTOS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Explora Nuestra Colección
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre productos únicos diseñados especialmente para ti
            </p>
          </motion.div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
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
                activeSleeveId={activeSleeveId}
                setActiveSleeveId={setActiveSleeveId}
                activeSort={activeSort}
                setActiveSort={setActiveSort}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                clearAllFilters={clearAllFilters}
                categories={categories}
                brands={brands}
                colors={colors}
                sizes={sizes}
                genders={genders}
                sleeves={sleeves}
              />
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Enhanced Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-80 flex-shrink-0"
            >
              <ProductFilters
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
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1"
            >
              {/* Enhanced Toolbar */}
              <div className="relative mb-8 group">
                {/* Animated background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/10 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                <div className="relative flex items-center justify-between p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/50 shadow-lg">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {products.length}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2 font-medium">
                          productos encontrados
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Enhanced View Mode Toggle */}
                    <div className="flex items-center bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200/50 dark:border-gray-600/50">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode("grid")}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          viewMode === "grid"
                            ? "bg-white dark:bg-gray-600 text-blue-600 shadow-lg shadow-blue-600/20"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50"
                        }`}
                      >
                        <Grid3X3 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setViewMode("list")}
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          viewMode === "list"
                            ? "bg-white dark:bg-gray-600 text-blue-600 shadow-lg shadow-blue-600/20"
                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50"
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Content */}
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-20"
                >
                  <Loader />
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-12 text-center rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg"
                >
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Error al cargar productos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    {error}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Intentar de nuevo
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <ProductGrid
                      products={products}
                      hoveredProduct={hoveredProduct}
                      setHoveredProduct={setHoveredProduct}
                      noProductsFound={products.length === 0}
                      clearAllFilters={clearAllFilters}
                      viewMode={viewMode}
                    />
                  </motion.div>

                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-12"
                    >
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={handlePageChange}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customize Section - Minimal */}
      {!isLoading && products.length > 0 && (
        <section className="py-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Paintbrush className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ¿Necesitas algo personalizado?
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Crea tu diseño único
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCustomize}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Personalizar
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
