"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Palette,
  Grid3X3,
  List,
  SortAsc,
  Sparkles,
  Shirt,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import img from "./assets/products.jpg";
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

// Tipo para la respuesta de la API
interface ApiResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
  const initialLoadRef = useRef(true);

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
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // UI State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Price range filter
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

  // Refs for animations

  const productsPerPage = 12;

  // Función para aplicar filtros desde la URL - Fix the reset logic
  const applyFiltersFromURL = () => {
    if (!filtersLoaded) return;

    const params = new URLSearchParams(window.location.search);
    const hasAnyParams = params.toString().length > 0;

    // Only reset filters if there are no URL parameters at all
    // Otherwise, apply the filters from URL or keep existing ones

    // Categoría
    const categoryParam = params.get("categoria");
    if (categoryParam && categories.length > 0) {
      const matchedCategory = categories.find(
        (category) =>
          category.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matchedCategory) {
        setActiveCategoryId(matchedCategory.id);
      }
    } else if (!hasAnyParams) {
      // Only reset if no params at all
      setActiveCategoryId(null);
    }

    // Género
    const genderParam = params.get("genero");
    if (genderParam && !isNaN(Number(genderParam))) {
      setActiveGenderId(Number(genderParam));
    } else if (!hasAnyParams) {
      setActiveGenderId(null);
    }

    // Talla
    const sizeParam = params.get("talla");
    if (sizeParam && !isNaN(Number(sizeParam))) {
      setActiveSizeId(Number(sizeParam));
    } else if (!hasAnyParams) {
      setActiveSizeId(null);
    }

    // Color
    const colorParam = params.get("color");
    if (colorParam && !isNaN(Number(colorParam))) {
      setActiveColorId(Number(colorParam));
    } else if (!hasAnyParams) {
      setActiveColorId(null);
    }

    // Manga
    const sleeveParam = params.get("manga");
    if (sleeveParam && !isNaN(Number(sleeveParam))) {
      setActiveSleeveId(Number(sleeveParam));
    } else if (!hasAnyParams) {
      setActiveSleeveId(null);
    }

    // Marca
    const brandParam = params.get("marca");
    if (brandParam && !isNaN(Number(brandParam))) {
      setActiveBrandId(Number(brandParam));
    } else if (!hasAnyParams) {
      setActiveBrandId(null);
    }

    // Precio
    const minPriceParam = params.get("precioMin") || params.get("priceMin");
    const maxPriceParam = params.get("precioMax") || params.get("priceMax");
    if (minPriceParam || maxPriceParam) {
      setPriceRange({
        min: minPriceParam ? Number(minPriceParam) : null,
        max: maxPriceParam ? Number(maxPriceParam) : null,
      });
    } else if (!hasAnyParams) {
      setPriceRange({ min: null, max: null });
    }

    // Búsqueda
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    } else if (!hasAnyParams) {
      setSearchTerm("");
    }

    // Ordenamiento
    const sortParam = params.get("orden");
    if (
      sortParam &&
      ["price-low", "price-high", "newest"].includes(sortParam)
    ) {
      setActiveSort(sortParam as SortOption);
    } else if (!hasAnyParams) {
      setActiveSort("default");
    }

    // Página
    const pageParam = params.get("page");
    if (pageParam && !isNaN(Number(pageParam))) {
      setCurrentPage(Number(pageParam));
    } else if (!hasAnyParams) {
      setCurrentPage(1);
    }
  };

  // Fetch data from API with filters
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Cargar datos de filtros
        let brandsData: Brand[] = [];
        let categoriesData: Category[] = [];
        let gendersData: Gender[] = [];
        let sizesData: Size[] = [];
        let colorsData: Color[] = [];
        let sleevesData: Sleeve[] = [];

        try {
          const brandsResponse = await getBrands();
          brandsData = Array.isArray(brandsResponse.data)
            ? brandsResponse.data
            : Array.isArray(brandsResponse.data?.data)
            ? brandsResponse.data.data
            : [];
        } catch (err) {
          console.error("Error fetching brands:", err);
        }
        setBrands(brandsData);

        try {
          const categoriesResponse = await getCategories();
          categoriesData = Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : Array.isArray(categoriesResponse.data?.data)
            ? categoriesResponse.data.data
            : [];
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
        setCategories(categoriesData);

        try {
          const gendersResponse = await getGenders();
          gendersData = Array.isArray(gendersResponse.data)
            ? gendersResponse.data
            : Array.isArray(gendersResponse.data?.data)
            ? gendersResponse.data.data
            : [];
        } catch (err) {
          console.error("Error fetching genders:", err);
        }
        setGenders(gendersData);

        try {
          const sizesResponse = await getSizes();
          sizesData = Array.isArray(sizesResponse.data)
            ? sizesResponse.data
            : Array.isArray(sizesResponse.data?.data)
            ? sizesResponse.data.data
            : [];
        } catch (err) {
          console.error("Error fetching sizes:", err);
        }
        setSizes(sizesData);

        try {
          const colorsResponse = await getColors();
          colorsData = Array.isArray(colorsResponse.data)
            ? colorsResponse.data
            : Array.isArray(colorsResponse.data?.data)
            ? colorsResponse.data.data
            : [];
        } catch (err) {
          console.error("Error fetching colors:", err);
        }
        setColors(colorsData);

        try {
          const sleevesResponse = await getSleeve();
          sleevesData = Array.isArray(sleevesResponse.data)
            ? sleevesResponse.data
            : Array.isArray(sleevesResponse.data?.data)
            ? sleevesResponse.data.data
            : [];
        } catch (err) {
          console.error("Error fetching sleeves:", err);
        }
        setSleeves(sleevesData);

        setFiltersLoaded(true);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          "No se pudieron cargar los datos de filtros. Por favor, intente nuevamente."
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reemplaza el useEffect que maneja la carga inicial y aplicación de filtros desde URL
  useEffect(() => {
    if (filtersLoaded && initialLoadRef.current && categories.length > 0) {
      // Aplicar filtros desde URL si existen
      applyFiltersFromURL();
      initialLoadRef.current = false;
    }
  }, [filtersLoaded, categories]);

  // Handle URL changes when navigating back from other pages
  useEffect(() => {
    const handleURLChange = () => {
      if (filtersLoaded && !initialLoadRef.current) {
        applyFiltersFromURL();
      }
    };

    // Check if URL has changed on component mount (when coming back from another page)
    if (filtersLoaded && !initialLoadRef.current) {
      handleURLChange();
    }
  }, [filtersLoaded]);

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para obtener productos con filtros
  const fetchProductsWithFilters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      params.append("page", currentPage.toString());
      params.append("limit", productsPerPage.toString());

      if (searchTerm) params.append("search", searchTerm);
      if (activeCategoryId !== null) {
        params.append("category", activeCategoryId.toString());
        console.log("Filtering by category ID:", activeCategoryId); // Debug log
      }
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
      console.log("API Query:", queryString); // Debug log

      const response = await getProducts(queryString);

      if (response && response.data) {
        let productsData: Product[] = [];
        let totalPagesCount = 1;

        if (response.data.data && Array.isArray(response.data.data)) {
          const apiResponse = response.data as ApiResponse;
          productsData = apiResponse.data;
          totalPagesCount =
            apiResponse.totalPages ||
            Math.ceil(apiResponse.total / productsPerPage);
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
          totalPagesCount = Math.ceil(productsData.length / productsPerPage);
        } else if (
          typeof response.data === "object" &&
          Object.keys(response.data).length === 0
        ) {
          productsData = [];
          totalPagesCount = 1;
        } else {
          productsData = [];
          totalPagesCount = 1;
        }

        // Solo hacer scroll si hay filtros activos (query parameters en la URL) y no es la carga inicial
        const urlParams = new URLSearchParams(window.location.search);
        const hasQueryParams = urlParams.toString().length > 0;

        if (!initialLoadRef.current && hasQueryParams) {
          setTimeout(() => scrollToProducts(), 100);
        }

        setProducts(productsData);
        setTotalPages(totalPagesCount);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const hasQueryParams = urlParams.toString().length > 0;

        if (!initialLoadRef.current && hasQueryParams) {
          setTimeout(() => scrollToProducts(), 100);
        }
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err: any) {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (!filtersLoaded) return;

      // Apply filters from URL when user navigates back/forward
      applyFiltersFromURL();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [filtersLoaded, categories, genders, sizes, colors, sleeves, brands]);

  // Modifica el useEffect principal para manejar mejor la carga inicial con filtros
  useEffect(() => {
    if (filtersLoaded && !initialLoadRef.current) {
      fetchProductsWithFilters();
      updateURLWithFilters();
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
  ]);

  const clearAllFilters = () => {
    setIsLoading(true);

    setActiveCategoryId(null);
    setActiveGenderId(null);
    setActiveColorId(null);
    setActiveSizeId(null);
    setActiveSleeveId(null);
    setActiveBrandId(null);
    setActiveSort("default");
    setSearchTerm("");
    setPriceRange({ min: null, max: null });
    setCurrentPage(1);

    window.history.pushState({}, "", window.location.pathname);

    setTimeout(() => {
      const fetchWithoutFilters = async () => {
        try {
          const params = new URLSearchParams();
          params.append("page", "1");
          params.append("limit", productsPerPage.toString());

          const response = await getProducts(params.toString());

          if (response.data) {
            let productsData: Product[] = [];
            let totalPagesCount = 1;

            if (response.data.data && Array.isArray(response.data.data)) {
              const apiResponse = response.data as ApiResponse;
              productsData = apiResponse.data;
              totalPagesCount =
                apiResponse.totalPages ||
                Math.ceil(apiResponse.total / productsPerPage);
            } else if (Array.isArray(response.data)) {
              productsData = response.data;
              totalPagesCount = Math.ceil(
                productsData.length / productsPerPage
              );
            }

            setProducts(productsData);
            setTotalPages(totalPagesCount);
            setCurrentPage(1);
            setError(null);
            // Scroll to top when all filters are cleared
            scrollToTop();
          } else {
            console.error(
              "La API no devolvió datos válidos al limpiar filtros:",
              response
            );
            setError(
              "No se pudieron cargar los productos. Por favor, intente nuevamente."
            );
          }
        } catch (err) {
          console.error("Error al limpiar filtros:", err);
          setError(
            "No se pudieron cargar los productos. Por favor, intente nuevamente."
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchWithoutFilters();
    }, 100);
  };

  const updateURLWithFilters = () => {
    if (!filtersLoaded || initialLoadRef.current) return;

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
    if (activeSort !== "default") params.set("orden", activeSort);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.pushState({}, "", newUrl);
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

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "price-low":
        return "Precio: Menor a Mayor";
      case "price-high":
        return "Precio: Mayor a Menor";
      case "newest":
        return "Más Recientes";
      default:
        return "Ordenar por";
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => scrollToProducts(), 100);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section - Simplified design */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] bg-white dark:bg-gray-900 flex items-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50/50 dark:from-blue-900/10 to-transparent"></div>

          {/* Dots pattern */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500/30 rounded-full"></div>
            <div className="absolute top-40 left-40 w-3 h-3 bg-blue-500/20 rounded-full"></div>
            <div className="absolute top-60 left-60 w-2 h-2 bg-blue-500/30 rounded-full"></div>
            <div className="absolute top-20 right-40 w-3 h-3 bg-blue-500/20 rounded-full"></div>
            <div className="absolute top-60 right-60 w-2 h-2 bg-blue-500/30 rounded-full"></div>
          </div>
        </div>

        <div className="container mx-auto px-0 py-12 md:py-16 lg:py-24 relative z-10">
          <div className="px-4  mx-auto transition-all duration-700 ease-out">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                {/* Badge Component */}
                <div className="flex items-center justify-center lg:justify-start mb-6 md:mb-8">
                  <div className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5">
                    <Shirt className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      DESCUBRE NUESTRO CATÁLOGO
                    </span>
                  </div>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
                  Encuentra tu{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-blue-600 dark:text-blue-400">
                      estilo
                    </span>
                    <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
                  </span>{" "}
                  perfecto
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8">
                  Explora nuestra colección completa de ropa premium diseñada
                  para cada ocasión y personalidad.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      200+ Productos
                    </span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <Palette className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      15+ Categorías
                    </span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Calidad Premium
                    </span>
                  </div>
                </div>

                {/* Breadcrumbs at bottom */}
                <div className="mt-8">
                  <Breadcrumbs />
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={img || "/placeholder.svg"}
                    alt="Catálogo de productos"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Products Section */}
      <section
        className="w-full py-6 md:py-8 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10"
        id="products-grid"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mb-4 md:mb-6">
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
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12">
            {/* Enhanced Filters Sidebar */}
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

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 md:mb-8 p-3 md:p-4 bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {products.length} productos encontrados
                  </span>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 md:p-2 rounded-md transition-all ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <Grid3X3 className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 md:p-2 rounded-md transition-all ${
                        viewMode === "list"
                          ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      <List className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      <SortAsc className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-medium hidden sm:inline">
                        {getSortLabel(activeSort)}
                      </span>
                      <span className="text-xs md:text-sm font-medium sm:hidden">
                        Ordenar
                      </span>
                    </button>

                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-48 md:w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50"
                        >
                          <div className="p-2">
                            {[
                              { value: "default", label: "Relevancia" },
                              {
                                value: "price-low",
                                label: "Precio: Menor a Mayor",
                              },
                              {
                                value: "price-high",
                                label: "Precio: Mayor a Menor",
                              },
                              { value: "newest", label: "Más Recientes" },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setActiveSort(option.value as SortOption);
                                  setShowSortDropdown(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-sm transition-all ${
                                  activeSort === option.value
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <Loader />
              ) : error ? (
                <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 lg:p-16 text-center rounded-xl md:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg backdrop-blur-sm mx-2 md:mx-0">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 md:mb-6">
                      <AlertTriangle
                        className="h-8 w-8 md:h-10 md:w-10 text-red-500"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 px-4">
                      Error al cargar productos
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8 lg:mb-10 max-w-md mx-auto text-sm md:text-base px-4">
                      {error}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-2.5 md:px-8 md:py-3 lg:px-10 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all rounded-full shadow-lg text-sm md:text-base"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ProductGrid
                    products={products}
                    hoveredProduct={hoveredProduct}
                    setHoveredProduct={setHoveredProduct}
                    noProductsFound={products.length === 0}
                    clearAllFilters={clearAllFilters}
                    viewMode={viewMode}
                  />

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={handlePageChange}
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
