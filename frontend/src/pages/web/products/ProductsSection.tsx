import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
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
  const [showColorDropdown, setShowColorDropdown] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    setShowColorDropdown(false);
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

  return (
    <div className="min-h-screen bg-white mt-14 md:mt-0">
      {/* Hero Header with Background img */}
      <motion.div
        className="relative md:h-[60vh] w-full overflow-hidden"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <img
          src={img}
          alt="Banner de colección de moda"
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center px-8 md:px-16 bg-black bg-opacity-50">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, staggerChildren: 0.1 }}
          >
            {"Descubre nuestros productos".split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            Calidad y estilo en cada prenda
          </motion.p>
        </div>
      </motion.div>

      <section className="max-w-7xl mx-auto px-4" id="products-grid">
        <div className="flex flex-col flex-wrap justify-between items-center py-4 border-b border-gray-200 mb-8">
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
            className="relative flex items-center w-full py-10 max-w-lg"
          >
            <input
              type="text"
              name="search"
              placeholder="Buscar productos..."
              className="pl-8 pr-4 py-2.5 border border-gray-300 rounded-full text-sm w-full focus:outline-none transition-all"
              defaultValue={searchTerm}
            />
            <button
              type="submit"
              className="absolute right-0 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          {/* Filtros */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Dropdown de Categorías */}
            <div className="relative" ref={categoriesDropdownRef}>
              <button
                className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5"
                onClick={() => {
                  closeDropdowns();
                  document
                    .getElementById("categories-dropdown")
                    ?.classList.toggle("hidden");
                }}
              >
                Categorías
                <ChevronDown className="h-4 w-4" />
              </button>
              <div
                id="categories-dropdown"
                className="hidden absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200"
              >
                <div className="p-2">
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeCategory === "" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveCategory("");
                      closeDropdowns();
                    }}
                  >
                    Todas las Categorías
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeCategory === "shirts"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveCategory("shirts");
                      closeDropdowns();
                    }}
                  >
                    Camisetas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeCategory === "hoodies"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveCategory("hoodies");
                      closeDropdowns();
                    }}
                  >
                    Sudaderas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeCategory === "jackets"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveCategory("jackets");
                      closeDropdowns();
                    }}
                  >
                    Chaquetas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeCategory === "coats"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveCategory("coats");
                      closeDropdowns();
                    }}
                  >
                    Abrigos
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeCategory === "shorts"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveCategory("shorts");
                      closeDropdowns();
                    }}
                  >
                    Pantalones cortos
                  </button>
                </div>
              </div>
            </div>

            {/* Dropdown de Colores */}
            <div className="relative" ref={colorDropdownRef}>
              <button
                className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5"
                onClick={() => {
                  closeDropdowns();
                  setShowColorDropdown(!showColorDropdown);
                }}
              >
                Color
                <ChevronDown className="h-4 w-4" />
              </button>
              {showColorDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                  <div className="p-4">
                    <h3 className="font-medium mb-2">Colores</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        className={`w-6 h-6 rounded-full ${colorMap["blue"]} ${
                          activeColor === "blue"
                            ? "ring-2 ring-offset-2 ring-gray-400"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveColor(activeColor === "blue" ? "" : "blue");
                          closeDropdowns();
                        }}
                        aria-label="Azul"
                      />
                      <button
                        className={`w-6 h-6 rounded-full ${colorMap["gray"]} ${
                          activeColor === "gray"
                            ? "ring-2 ring-offset-2 ring-gray-400"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveColor(activeColor === "gray" ? "" : "gray");
                          closeDropdowns();
                        }}
                        aria-label="Gris"
                      />
                      <button
                        className={`w-6 h-6 rounded-full ${colorMap["red"]} ${
                          activeColor === "red"
                            ? "ring-2 ring-offset-2 ring-gray-400"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveColor(activeColor === "red" ? "" : "red");
                          closeDropdowns();
                        }}
                        aria-label="Rojo"
                      />
                      <button
                        className={`w-6 h-6 rounded-full ${
                          colorMap["yellow"]
                        } ${
                          activeColor === "yellow"
                            ? "ring-2 ring-offset-2 ring-gray-400"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveColor(
                            activeColor === "yellow" ? "" : "yellow"
                          );
                          closeDropdowns();
                        }}
                        aria-label="Amarillo"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown de Tallas */}
            <div className="relative" ref={sizeDropdownRef}>
              <button
                className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5"
                onClick={() => {
                  closeDropdowns();
                  document
                    .getElementById("size-dropdown")
                    ?.classList.toggle("hidden");
                }}
              >
                Talla
                <ChevronDown className="h-4 w-4" />
              </button>
              <div
                id="size-dropdown"
                className="hidden absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200"
              >
                <div className="p-2">
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSize === "" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSize("");
                      closeDropdowns();
                    }}
                  >
                    Todas las Tallas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSize === "XS" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSize("XS");
                      closeDropdowns();
                    }}
                  >
                    XS
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSize === "S" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSize("S");
                      closeDropdowns();
                    }}
                  >
                    S
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSize === "M" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSize("M");
                      closeDropdowns();
                    }}
                  >
                    M
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSize === "L" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSize("L");
                      closeDropdowns();
                    }}
                  >
                    L
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSize === "XL" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSize("XL");
                      closeDropdowns();
                    }}
                  >
                    XL
                  </button>
                </div>
              </div>
            </div>

            {/* Dropdown de Género */}
            <div className="relative" ref={genderDropdownRef}>
              <button
                className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5"
                onClick={() => {
                  closeDropdowns();
                  document
                    .getElementById("gender-dropdown")
                    ?.classList.toggle("hidden");
                }}
              >
                Género
                <ChevronDown className="h-4 w-4" />
              </button>
              <div
                id="gender-dropdown"
                className="hidden absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200"
              >
                <div className="p-2">
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeGender === "" ? "bg-gray-100" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveGender("");
                      closeDropdowns();
                    }}
                  >
                    Todos los Géneros
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeGender === "men"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveGender("men");
                      closeDropdowns();
                    }}
                  >
                    Hombre
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeGender === "women"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveGender("women");
                      closeDropdowns();
                    }}
                  >
                    Mujer
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeGender === "unisex"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveGender("unisex");
                      closeDropdowns();
                    }}
                  >
                    Unisex
                  </button>
                </div>
              </div>
            </div>

            {/* Dropdown de Precio */}
            <div className="relative" ref={priceDropdownRef}>
              <button
                className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5"
                onClick={() => {
                  closeDropdowns();
                  document
                    .getElementById("price-dropdown")
                    ?.classList.toggle("hidden");
                }}
              >
                Precio
                <ChevronDown className="h-4 w-4" />
              </button>
              <div
                id="price-dropdown"
                className="hidden absolute z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200"
              >
                <div className="p-2">
                  <button className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-50">
                    $0 - $50
                  </button>
                  <button className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-50">
                    $50 - $100
                  </button>
                  <button className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-50">
                    $100 - $200
                  </button>
                  <button className="block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-50">
                    $200+
                  </button>
                </div>
              </div>
            </div>

            {/* Dropdown de Ordenar por */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                className="flex items-center gap-1 text-sm border border-gray-300 rounded px-3 py-1.5"
                onClick={() => {
                  closeDropdowns();
                  document
                    .getElementById("sort-dropdown")
                    ?.classList.toggle("hidden");
                }}
              >
                Ordenar por
                <ChevronDown className="h-4 w-4" />
              </button>
              <div
                id="sort-dropdown"
                className="hidden absolute right-0 z-10 mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200"
              >
                <div className="p-2">
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSort === "default"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSort("default");
                      closeDropdowns();
                    }}
                  >
                    Predeterminado
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSort === "price-low"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSort("price-low");
                      closeDropdowns();
                    }}
                  >
                    Precio: Menor a Mayor
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSort === "price-high"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActiveSort("price-high");
                      closeDropdowns();
                    }}
                  >
                    Precio: Mayor a Menor
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded ${
                      activeSort === "newest"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
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
        </div>

        {/* Lista de productos */}
        {currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No se encontraron productos que coincidan con los filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden bg-gray-50">
                  <img
                    src={product.img || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-sm mt-1">${product.price.toFixed(2)}</p>
                  <div className="flex mt-2 gap-1">
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
              </motion.div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <a href="#products-grid" key={page}>
                    <button
                      key={page}
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setCurrentPage(page);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        currentPage === page
                          ? "bg-blue-300 "
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </a>
                )
              )}
              {currentPage < totalPages && (
                <button
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50"
                  aria-label="Siguiente página"
                >
                  <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                </button>
              )}
            </nav>
          </div>
        )}
      </section>
    </div>
  );
}
