import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { products } from "../utils/products";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

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

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesCategory =
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesColor =
        filters.colors.length === 0 || filters.colors.includes(product.color);
      const matchesSize =
        filters.sizes.length === 0 || filters.sizes.includes(product.size);
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Aplicar todos los filtros simultáneamente con AND lógico
      return (
        matchesCategory &&
        matchesPrice &&
        matchesColor &&
        matchesSize &&
        matchesSearch
      );
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); 
  }, [filters, searchQuery, products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col  justify-between">
        <Breadcrumbs />

        <div className="flex items-center gap-2 justify-between md:justify-start ">
          <p className="text-sm text-gray-500">
            Mostrando {currentProducts.length} de {filteredProducts.length}{" "}
            productos
          </p>
          <Button className="flex md:hidden" variant="outline" size="icon" onClick={toggleSidebar}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Contenedor de paginación */}
      <div className="flex flex-col justify-end h-full">
        <div className="flex items-center justify-center gap-2 mt-auto pt-6">
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
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index + 1}
              variant={currentPage === index + 1 ? "default" : "outline"}
              className="min-w-[40px]"
              onClick={() => {
                window.scrollTo(0, 0);
                setCurrentPage(index + 1);
              }}
            >
              {index + 1}
            </Button>
          ))}
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
    </div>
  );
}
