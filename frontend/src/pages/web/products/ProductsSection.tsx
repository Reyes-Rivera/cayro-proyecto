"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  Eye,
  Filter,
  X,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  Shirt,
  Star,
  Sparkles,
  Palette,
  Ruler,
  Users,
  SlidersHorizontal,
  Tag,
  ShoppingCart,
} from "lucide-react";
import img from "../Home/assets/hero.jpg"; // Asegúrate de que la ruta sea correcta
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

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
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-14 md:pt-0">
      {/* Hero Header with Background img */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[500px] flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${img})` }}
      >
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-blue-400 rounded-full opacity-70"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [null, "-100%"],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 text-center text-white max-w-5xl px-6"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center justify-center rounded-full bg-blue-600/30 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-100 mb-6 border border-blue-500/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            DESCUBRE NUESTRA COLECCIÓN
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200"
          >
            Calidad y estilo en cada prenda
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl mb-8 text-blue-50 max-w-2xl mx-auto"
          >
            Explora nuestra colección de prendas diseñadas con los mejores
            materiales y acabados de alta calidad
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white [&_*]:!text-white flex justify-center"
          >
            <Breadcrumbs />
          </motion.div>
        </motion.div>
      </motion.div>

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

          {/* Botón de filtros móviles */}
          <div className="md:hidden flex w-full justify-between">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Filtros</span>
            </motion.button>

            <div className="relative" ref={sortDropdownRef}>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 "
                onClick={() => {
                  closeDropdowns();
                  document
                    .getElementById("sort-dropdown")
                    ?.classList.toggle("hidden");
                }}
              >
                <ArrowUpDown className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Ordenar</span>
              </motion.button>
              <div
                id="sort-dropdown"
                className="hidden absolute right-0 z-10 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
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
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
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
              className="pl-10 pr-14 py-2.5 border border-gray-300 dark:border-gray-600 rounded-full text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all"
              defaultValue={searchTerm}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 "
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </motion.form>
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Filtros
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 "
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full mb-6 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 "
                  >
                    Limpiar todos los filtros
                  </button>
                )}

                {/* Categorías */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Shirt className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
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
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Palette className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
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
                        } transition-all duration-200 hover:scale-110`}
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
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Ruler className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Tallas
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        className={`py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                          activeSize === size
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                        } hover:scale-105`}
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
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
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
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800  shadow-md"
                >
                  Ver {filteredProducts.length} productos
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtros de escritorio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block w-64 flex-shrink-0"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
                  <Shirt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Categorías
                </h4>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                      } transition-all duration-200 hover:scale-110`}
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
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Tallas
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      className={`py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
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
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Género
                </h4>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Ordenar por
                </h4>
                <div className="space-y-2">
                  <button
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md  ${
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
          </motion.div>

          {/* Contenido principal */}
          <div className="flex-1">
            {/* Chips de filtros activos */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {activeCategory && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setActiveCategory("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Categoría: {activeCategory}
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
                {activeGender && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={() => setActiveGender("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Género: {activeGender}
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
                {activeColor && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onClick={() => setActiveColor("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Color: {activeColor}
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
                {activeSize && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    onClick={() => setActiveSize("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Talla: {activeSize}
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Búsqueda: {searchTerm}
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
                {activeSort !== "default" && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    onClick={() => setActiveSort("default")}
                    className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Orden: {activeSort}
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Limpiar todos
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}

            {/* Lista de productos */}
            {currentProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center"
              >
                <div className="flex flex-col items-center justify-center">
                  <Shirt className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    No se encontraron productos que coincidan con los filtros
                    seleccionados.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800  shadow-md"
                  >
                    Limpiar filtros
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
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
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "#2563EB",
                              color: "#ffffff",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white rounded-full shadow-lg  transform translate-y-4 group-hover:translate-y-0"
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "#2563EB",
                              color: "#ffffff",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white rounded-full shadow-lg  transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75"
                          >
                            <Heart className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.1,
                              backgroundColor: "#2563EB",
                              color: "#ffffff",
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white rounded-full shadow-lg  transform translate-y-4 group-hover:translate-y-0 transition-transform delay-150"
                          >
                            <Eye className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Badge for category */}
                      <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 ">
                        {product.name}
                      </h3>

                      {/* Rating stars */}
                      <div className="flex items-center mt-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (24)
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="font-bold text-blue-600 dark:text-blue-400">
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="flex gap-1">
                          {product.colorOptions.map((color, index) => (
                            <div
                              key={index}
                              className={`w-4 h-4 rounded-full ${
                                colorMap[color] || "bg-gray-200"
                              } transition-transform duration-200 ${
                                hoveredProduct === product.id ? "scale-125" : ""
                              }`}
                              aria-label={`Color: ${color}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mt-12"
              >
                <nav className="flex items-center gap-2">
                  {currentPage > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700  shadow-sm"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setCurrentPage(page);
                        }}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                            : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } `}
                      >
                        {page}
                      </motion.button>
                    )
                  )}

                  {currentPage < totalPages && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                      }}
                      className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700  shadow-sm"
                      aria-label="Siguiente página"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  )}
                </nav>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
