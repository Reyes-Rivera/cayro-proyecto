import React, { Suspense, useState } from "react";

const ProductGrid = React.lazy(() => import("./components/ProductGrid"));
const Sidebar = React.lazy(() => import("./components/Sidebar"));
import img from "../Home/assets/hero.jpg";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

interface Filters {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
}

const initialFilters: Filters = {
  categories: [],
  priceRange: [0, 1000],
  colors: [],
  sizes: [],
};

export default function ProductsSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div className=" mx-auto  ">
        <div
          className="relative h-64 md:h-80 lg:h-96 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        >
          {/* Capa oscura para mejorar la legibilidad */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          {/* Contenido del encabezado */}
          <div className="relative z-10 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Productos
            </h1>
            <p className="text-lg md:text-xl">
              Explora nuestra colección de productos
            </p>
            <div className="text-white [&_*]:!text-white flex justify-center">
              <Breadcrumbs />
            </div>
          </div>
        </div>
        <div className="flex  flex-col md:flex-row gap-8 p-5">
          <Suspense fallback={<div>Cargando Sidebar...</div>}>
            <Sidebar
              isOpen={isOpen}
              onClose={toggleSidebar}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </Suspense>
          <div className="flex-1">
            <Suspense fallback={<div>Cargando productos...</div>}>
              <ProductGrid
                toggleSidebar={toggleSidebar}
                filters={filters}
                searchQuery={searchQuery}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
