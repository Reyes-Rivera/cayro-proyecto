import React, { Suspense, useState } from "react";
import Header from "./components/Header";

const ProductGrid = React.lazy(() => import("./components/ProductGrid"));
const Sidebar = React.lazy(() => import("./components/Sidebar"));

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
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <div className=" mx-auto px-4 py-8 ">
        <div className="flex  flex-col md:flex-row gap-8">
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
              <ProductGrid toggleSidebar={toggleSidebar} filters={filters} searchQuery={searchQuery} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
