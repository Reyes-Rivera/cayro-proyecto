"use client";

import { useState, useEffect, useRef } from "react";
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
  Sleeve,
} from "../../../types/products";
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

  // Price range filter
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });

  const productsPerPage = 12;

  // Función para aplicar filtros desde la URL
  const applyFiltersFromURL = () => {
    if (!filtersLoaded) return;

    const params = new URLSearchParams(window.location.search);

    // Género
    const genderParam = params.get("genero");
    if (genderParam && !isNaN(Number(genderParam))) {
      setActiveGenderId(Number(genderParam));
    }

    // Talla
    const sizeParam = params.get("talla");
    if (sizeParam && !isNaN(Number(sizeParam))) {
      setActiveSizeId(Number(sizeParam));
    }

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
    }

    // Color
    const colorParam = params.get("color");
    if (colorParam && !isNaN(Number(colorParam))) {
      setActiveColorId(Number(colorParam));
    }

    // Manga
    const sleeveParam = params.get("manga");
    if (sleeveParam && !isNaN(Number(sleeveParam))) {
      setActiveSleeveId(Number(sleeveParam));
    }

    // Marca
    const brandParam = params.get("marca");
    if (brandParam && !isNaN(Number(brandParam))) {
      setActiveBrandId(Number(brandParam));
    }

    // Precio
    const minPriceParam = params.get("precioMin") || params.get("priceMin");
    const maxPriceParam = params.get("precioMax") || params.get("priceMax");
    if (minPriceParam || maxPriceParam) {
      setPriceRange({
        min: minPriceParam ? Number(minPriceParam) : null,
        max: maxPriceParam ? Number(maxPriceParam) : null,
      });
    }

    // Búsqueda
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }

    // Ordenamiento
    const sortParam = params.get("orden");
    if (
      sortParam &&
      ["price-low", "price-high", "newest"].includes(sortParam)
    ) {
      setActiveSort(sortParam as SortOption);
    }

    // Página
    const pageParam = params.get("page");
    if (pageParam && !isNaN(Number(pageParam))) {
      setCurrentPage(Number(pageParam));
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
          // Nota: getSleeve está en singular en la API
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

        // Marcar que los filtros se han cargado
        setFiltersLoaded(true);

        // No llamamos a fetchProductsWithFilters aquí, ya que se llamará automáticamente
        // después de aplicar los filtros desde la URL
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

  useEffect(() => {
    if (filtersLoaded && initialLoadRef.current) {
      applyFiltersFromURL();
      initialLoadRef.current = false;
    }
    scrollToTop();
  }, [filtersLoaded]);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  // Función para obtener productos con filtros
  const fetchProductsWithFilters = async () => {
    setIsLoading(true);
    setError(null); // Resetear el error al inicio

    try {
      // Build query parameters
      const params = new URLSearchParams();

      // Add pagination
      params.append("page", currentPage.toString());
      params.append("limit", productsPerPage.toString());

      // Add filters
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

      // Add price range filters
      if (priceRange.min !== null)
        params.append("priceMin", priceRange.min.toString());
      if (priceRange.max !== null)
        params.append("priceMax", priceRange.max.toString());

      // Add sorting
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

      // Build the URL with query parameters as a string
      const queryString = params.toString();

      // Obtener productos de la API
      const response = await getProducts(queryString);

      // Verificar si la respuesta tiene el formato esperado
      if (response && response.data) {
        let productsData: Product[] = [];
        let totalPagesCount = 1;

        // Manejar diferentes formatos de respuesta
        if (response.data.data && Array.isArray(response.data.data)) {
          // Formato: { data: Product[], total: number, page: number, ... }
          const apiResponse = response.data as ApiResponse;
          productsData = apiResponse.data;
          totalPagesCount =
            apiResponse.totalPages ||
            Math.ceil(apiResponse.total / productsPerPage);
        } else if (Array.isArray(response.data)) {
          // Formato: Product[]
          productsData = response.data;
          totalPagesCount = Math.ceil(productsData.length / productsPerPage);
        } else if (
          typeof response.data === "object" &&
          Object.keys(response.data).length === 0
        ) {
          // Respuesta vacía pero válida

          productsData = [];
          totalPagesCount = 1;
        } else {
          productsData = [];
          totalPagesCount = 1;
        }
        scrollToTop();
        setProducts(productsData);
        setTotalPages(totalPagesCount);
      } else {
        scrollToTop();
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

  // Obtener productos cuando cambian los filtros
  useEffect(() => {
    // Solo ejecutar si los filtros están cargados
    if (filtersLoaded) {
      fetchProductsWithFilters();

      // Actualizar la URL con los filtros actuales
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

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    // Primero establecemos el estado de carga
    setIsLoading(true);

    // Limpiamos todos los filtros
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

    // Limpiar los parámetros de URL
    window.history.pushState({}, "", window.location.pathname);

    // Hacemos una pausa breve para asegurar que los estados se actualicen
    setTimeout(() => {
      // Llamamos directamente a fetchProductsWithFilters con un nuevo objeto URLSearchParams
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

          // Scroll a la sección de productos
          const productsSection = document.getElementById("products-grid");
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      };

      fetchWithoutFilters();
    }, 100);
  };

  // Función para actualizar la URL cuando cambian los filtros
  const updateURLWithFilters = () => {
    // Evitar actualizar la URL durante la carga inicial
    if (!filtersLoaded || initialLoadRef.current) return;

    const params = new URLSearchParams();

    // Añadir parámetros según los filtros activos
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

    // Actualizar la URL sin recargar la página
    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.pushState({}, "", newUrl);
  };

  // Añadir un efecto para escuchar los cambios en la URL (navegación del historial)
  useEffect(() => {
    // Función para manejar eventos popstate (cuando el usuario navega con los botones del navegador)
    const handlePopState = () => {
      if (!filtersLoaded) return;
      applyFiltersFromURL();
    };

    // Agregar el event listener
    window.addEventListener("popstate", handlePopState);

    // Limpiar el event listener al desmontar
    return () => {
      scrollToTop();
      window.removeEventListener("popstate", handlePopState);
    };
  }, [filtersLoaded, categories, genders, sizes, colors, sleeves, brands]);

  // Verificar si hay filtros activos
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

  return (
    <div className="min-h-screen  dark:bg-gray-900">
      <section
        className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative z-10"
        id="products-grid"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          )}

          <div className="flex flex-col md:flex-row gap-8 md:gap-12 mt-8">
            {/* Desktop Filters */}
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
              {/* Loading State */}
              {isLoading ? (
                <Loader />
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
                    <p className="text-gray-500 dark:text-gray-400 mb-8 md:mb-10 max-w-md mx-auto">
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
                    products={products}
                    hoveredProduct={hoveredProduct}
                    setHoveredProduct={setHoveredProduct}
                    noProductsFound={products.length === 0}
                    clearAllFilters={clearAllFilters}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={(page) => {
                        setCurrentPage(page);
                        // Actualizar URL con la página
                        const url = new URL(window.location.href);
                        url.searchParams.set("page", page.toString());
                        window.history.pushState({}, "", url.toString());
                      }}
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
