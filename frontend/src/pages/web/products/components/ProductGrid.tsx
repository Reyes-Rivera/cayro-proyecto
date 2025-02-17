import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { products } from "../utils/products";
import { useSearchParams } from "react-router-dom";

interface ProductGridProps {
  toggleSidebar: () => void;
  filters: {
    categories: string[];
    priceRange: [number, number];
    colors: string[];
    sizes: string[];
  };
  searchQuery: string;
}

export default function ProductGrid({
  toggleSidebar,
  filters,
  searchQuery,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const productsPerPage = 12;
  const [searchParams] = useSearchParams();
  const color = searchParams.get("color");
  const size = searchParams.get("talla");
  const gender = searchParams.get("genero");
  const searchQueryparam = searchParams.get("search") || "";

  // Obtener la categoría seleccionada desde filters
  const selectedCategory =
    filters.categories.length > 0 ? filters.categories[0] : null;

  useEffect(() => {
    const searchTerm =
      searchQuery.toLowerCase().trim() || searchQueryparam.toLowerCase().trim();

    const filtered = products.filter((product) => {
      // Filtros por parámetros de URL
      const matchesColor = !color || product.color === color;
      const matchesSize = !size || product.size === size;
      const matchesGender = !gender || product.sex === gender;
      const matchesSearch =
        !searchTerm || product.name.toLowerCase().includes(searchTerm);

      // Filtros adicionales desde el estado de filtros
      const matchesFilterCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);
      const matchesFilterPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesFilterColor =
        filters.colors.length === 0 || filters.colors.includes(product.color);
      const matchesFilterSize =
        filters.sizes.length === 0 || filters.sizes.includes(product.size);

      // Aplicar todos los filtros simultáneamente con AND lógico
      return (
        matchesColor &&
        matchesSize &&
        matchesGender &&
        matchesSearch &&
        matchesFilterCategory &&
        matchesFilterPrice &&
        matchesFilterColor &&
        matchesFilterSize
      );
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [color, size, gender, searchQuery, searchQueryparam, filters]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">

        {/* Mostrar la categoría seleccionada o "Productos" */}
        <h2 className="text-xl font-bold mt-2">
          {selectedCategory ? selectedCategory : "Productos"}
        </h2>

        <div className="flex items-center gap-2 justify-between md:justify-start">
          <p className="text-sm text-gray-500">
            Mostrando {currentProducts.length} de {filteredProducts.length}{" "}
            productos
          </p>
          <Button
            className="flex md:hidden"
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 pt-28">
          No se encontraron productos
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex flex-col justify-end h-full">
            <div className="flex items-center justify-center gap-2 mt-auto pt-6">
              {/* Botón de página anterior */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  window.scrollTo(0, 0);
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Botones de páginas */}
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index + 1}
                  variant="outline" // Siempre outline, pero cambiamos el estilo manualmente
                  className={`min-w-[40px] ${
                    currentPage === index + 1
                      ? "bg-blue-100 text-blue-600 font-bold hover:bg-blue-500" // Página actual: fondo azul y texto blanco
                      : "bg-white text-gray-700 hover:bg-gray-100" // Otras páginas: fondo blanco y texto gris
                  }`}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setCurrentPage(index + 1);
                  }}
                >
                  {index + 1}
                </Button>
              ))}

              {/* Botón de página siguiente */}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
