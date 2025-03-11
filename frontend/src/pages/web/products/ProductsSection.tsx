"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  Eye,
  Filter,
  X,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  Shirt,
} from "lucide-react";
import img from "../Home/assets/hero.jpg"; // Asegúrate de que la ruta sea correcta

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  gender: string;
  color: string;
  size: string;
  img: string;
  colorOptions: string[];
};

type SortOption = "default" | "price-low" | "price-high" | "newest";

export default function ProductPage() {
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "shirts",
      gender: "unisex",
      color: "brown",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "brown", "red"],
    },
    {
      id: 2,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "hoodies",
      gender: "women",
      color: "pink",
      size: "S",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "pink", "green"],
    },
    {
      id: 3,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "jackets",
      gender: "women",
      color: "black",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["black", "blue", "green"],
    },
    {
      id: 4,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "sweaters",
      gender: "men",
      color: "blue",
      size: "L",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "black", "green"],
    },
    {
      id: 5,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "jackets",
      gender: "unisex",
      color: "multicolor",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "red", "green"],
    },
    {
      id: 6,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "coats",
      gender: "men",
      color: "brown",
      size: "L",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "brown", "green"],
    },
    {
      id: 7,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "shirts",
      gender: "men",
      color: "black",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "black", "green"],
    },
    {
      id: 8,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "coats",
      gender: "women",
      color: "beige",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "beige", "green"],
    },
    {
      id: 9,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "shirts",
      gender: "unisex",
      color: "beige",
      size: "L",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "beige", "red"],
    },
    {
      id: 10,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "shirts",
      gender: "women",
      color: "pink",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "pink", "red"],
    },
    {
      id: 11,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "shorts",
      gender: "men",
      color: "beige",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "beige", "green"],
    },
    {
      id: 12,
      name: "Lace Shirt Cut II",
      price: 16.0,
      category: "jackets",
      gender: "women",
      color: "gray",
      size: "M",
      img: "/placeholder.svg?height=400&width=300",
      colorOptions: ["blue", "gray", "green"],
    },
  ];

  // State for active filters
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeGender, setActiveGender] = useState<string>("");
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [activeSort, setActiveSort] = useState<SortOption>("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const productsPerPage = 8;

  // Referencias para los dropdowns
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const sizeDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Función para cerrar todos los dropdowns
  const closeDropdowns = () => {
    document.getElementById("categories-dropdown")?.classList.add("hidden");
    document.getElementById("size-dropdown")?.classList.add("hidden");
    document.getElementById("gender-dropdown")?.classList.add("hidden");
    document.getElementById("price-dropdown")?.classList.add("hidden");
    document.getElementById("sort-dropdown")?.classList.add("hidden");
  };

  // Efecto para detectar clics fuera de los dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node) &&
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node) &&
        sizeDropdownRef.current &&
        !sizeDropdownRef.current.contains(event.target as Node) &&
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target as Node) &&
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target as Node) &&
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdowns();
      }
    };

    // Agregar el event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll animation with framer-motion
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      if (activeCategory && product.category !== activeCategory) return false;
      if (activeGender && product.gender !== activeGender) return false;
      if (activeColor && product.color !== activeColor) return false;
      if (activeSize && product.size !== activeSize) return false;
      if (
        searchTerm &&
        !product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (activeSort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return b.id - a.id;
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
    activeCategory,
    activeGender,
    activeColor,
    activeSize,
    activeSort,
    searchTerm,
  ]);

  // Color mapping for the color circles
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    black: "bg-black",
    white: "bg-white border border-gray-300",
    gray: "bg-gray-500",
    beige: "bg-amber-100",
    brown: "bg-amber-800",
    pink: "bg-pink-300",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    multicolor: "bg-gradient-to-r from-pink-500 via-yellow-300 to-blue-500",
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setActiveCategory("");
    setActiveGender("");
    setActiveColor("");
    setActiveSize("");
    setActiveSort("default");
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    activeCategory ||
    activeGender ||
    activeColor ||
    activeSize ||
    searchTerm ||
    activeSort !== "default";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14 md:pt-0">
      {/* Hero Header with Background img */}
      <motion.div
        className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <img
          src={img || "/placeholder.svg"}
          alt="Banner de colección de moda"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center px-8 md:px-16 bg-gradient-to-b from-black/60 to-black/40">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Descubre nuestros productos
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white text-center max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Calidad y estilo en cada prenda
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="#products-grid"
              className="bg-white hover:bg-gray-100 text-gray-900 font-medium px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Ver productos
            </a>
          </motion.div>
        </div>
      </motion.div>

      <section className="max-w-7xl mx-auto px-4 py-12" id="products-grid">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Nuestros Productos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto" : "productos"}{" "}
              encontrados
            </p>
          </div>

          {/* Botón de filtros móviles */}
          <div className="md:hidden flex w-full justify-between">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </button>

            <div className="relative" ref={sortDropdownRef}>
              <button
                className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                onClick={() => {
                  closeDropdowns();
                  document
                    .getElementById("sort-dropdown")
                    ?.classList.toggle("hidden");
                }}
              >
                <ArrowUpDown className="h-5 w-5" />
                <span>Ordenar</span>
              </button>
              <div
                id="sort-dropdown"
                className="hidden absolute right-0 z-10 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="p-2">
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                      activeSort === "default"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("default");
                      closeDropdowns();
                    }}
                  >
                    Predeterminado
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                      activeSort === "price-low"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("price-low");
                      closeDropdowns();
                    }}
                  >
                    Precio: Menor a Mayor
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                      activeSort === "price-high"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("price-high");
                      closeDropdowns();
                    }}
                  >
                    Precio: Mayor a Menor
                  </button>
                  <button
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                      activeSort === "newest"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("newest");
                      closeDropdowns();
                    }}
                  >
                    Más Recientes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const searchValue = (
                e.currentTarget.elements.namedItem("search") as HTMLInputElement
              ).value;
              setSearchTerm(searchValue);
              setCurrentPage(1);
            }}
            className="relative flex items-center w-full md:w-auto"
          >
            <input
              type="text"
              name="search"
              placeholder="Buscar productos..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
              defaultValue={searchTerm}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Panel de filtros móvil */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm md:hidden"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setMobileFiltersOpen(false);
                }
              }}
            >
              <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-800 shadow-xl p-5 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Filtros
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full mb-6 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Limpiar todos los filtros
                  </button>
                )}

                {/* Categorías */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Categorías
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeCategory === ""
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveCategory("")}
                    >
                      Todas las Categorías
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeCategory === "shirts"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveCategory("shirts")}
                    >
                      Camisetas
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeCategory === "hoodies"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveCategory("hoodies")}
                    >
                      Sudaderas
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeCategory === "jackets"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveCategory("jackets")}
                    >
                      Chaquetas
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeCategory === "coats"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveCategory("coats")}
                    >
                      Abrigos
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeCategory === "shorts"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveCategory("shorts")}
                    >
                      Pantalones cortos
                    </button>
                  </div>
                </div>

                {/* Colores */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Colores
                  </h4>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(colorMap).map(([color, bgClass]) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${bgClass} ${
                          activeColor === color
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          setActiveColor(activeColor === color ? "" : color)
                        }
                        aria-label={`Color: ${color}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Tallas */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Tallas
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        className={`py-2 rounded-md text-sm font-medium ${
                          activeSize === size
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                        onClick={() =>
                          setActiveSize(activeSize === size ? "" : size)
                        }
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Género */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Género
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeGender === ""
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveGender("")}
                    >
                      Todos los Géneros
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeGender === "men"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveGender("men")}
                    >
                      Hombre
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeGender === "women"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveGender("women")}
                    >
                      Mujer
                    </button>
                    <button
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                        activeGender === "unisex"
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => setActiveGender("unisex")}
                    >
                      Unisex
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver {filteredProducts.length} productos
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros de escritorio */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Shirt className="h-4 w-4" />
                  Categorías
                </h4>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeCategory === ""
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveCategory("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Todas las Categorías
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeCategory === "shirts"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveCategory("shirts");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Camisetas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeCategory === "hoodies"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveCategory("hoodies");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Sudaderas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeCategory === "jackets"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveCategory("jackets");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Chaquetas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeCategory === "coats"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveCategory("coats");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Abrigos
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeCategory === "shorts"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveCategory("shorts");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Pantalones cortos
                  </button>
                </div>
              </div>

              {/* Colores */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Colores
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(colorMap).map(([color, bgClass]) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${bgClass} ${
                        activeColor === color
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => {
                        setActiveColor(activeColor === color ? "" : color);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      aria-label={`Color: ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Tallas */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Tallas
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      className={`py-2 rounded-md text-sm font-medium ${
                        activeSize === size
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setActiveSize(activeSize === size ? "" : size);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Género */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Género
                </h4>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeGender === ""
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveGender("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Todos los Géneros
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeGender === "men"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveGender("men");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Hombre
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeGender === "women"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveGender("women");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Mujer
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeGender === "unisex"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveGender("unisex");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Unisex
                  </button>
                </div>
              </div>

              {/* Ordenar por (en escritorio) */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Ordenar por
                </h4>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeSort === "default"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("default");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Predeterminado
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeSort === "price-low"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("price-low");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Precio: Menor a Mayor
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeSort === "price-high"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("price-high");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Precio: Mayor a Menor
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                      activeSort === "newest"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSort("newest");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Más Recientes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Chips de filtros activos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm"
                  >
                    Categoría: {activeCategory}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {activeGender && (
                  <button
                    onClick={() => setActiveGender("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm"
                  >
                    Género: {activeGender}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {activeColor && (
                  <button
                    onClick={() => setActiveColor("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm"
                  >
                    Color: {activeColor}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {activeSize && (
                  <button
                    onClick={() => setActiveSize("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm"
                  >
                    Talla: {activeSize}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm"
                  >
                    Búsqueda: {searchTerm}
                    <X className="h-4 w-4" />
                  </button>
                )}
                {activeSort !== "default" && (
                  <button
                    onClick={() => setActiveSort("default")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm"
                  >
                    Orden: {activeSort}
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Limpiar todos
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Lista de productos */}
            {currentProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Shirt className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    No se encontraron productos que coincidan con los filtros
                    seleccionados.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="relative overflow-hidden aspect-[3/4]">
                      <img
                        src={product.img || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0">
                            <ShoppingBag className="h-5 w-5" />
                          </button>
                          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                            <Heart className="h-5 w-5" />
                          </button>
                          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-600 hover:text-white  transform translate-y-4 group-hover:translate-y-0 transition-transform delay-150">
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="flex gap-1">
                          {product.colorOptions.map((color, index) => (
                            <div
                              key={index}
                              className={`w-4 h-4 rounded-full ${
                                colorMap[color] || "bg-gray-200"
                              }`}
                              aria-label={`Color: ${color}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-2">
                  {currentPage > 1 && (
                    <button
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setCurrentPage(page);
                        }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } transition-colors`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {currentPage < totalPages && (
                    <button
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                      }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Siguiente página"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
