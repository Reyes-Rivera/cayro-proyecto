import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: Filters) => void;
  onSearch: (query: string) => void;
}

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

export default function Sidebar({
  isOpen,
  onClose,
  onFilterChange,
  onSearch,
}: SidebarProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [search, setSearch] = useState("");

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleColorChange = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSizeChange = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-10 overflow-y-hidden
                  md:static md:transform-none md:w-72 md:h-auto md:overflow-visible ${
                    isOpen
                      ? "translate-x-0"
                      : "translate-x-full md:translate-x-0"
                  }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 md:hidden pt-10">
          <h2 className="text-xl font-bold">Filtros</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <Search className="text-gray-400 h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {/* Categorías */}
          <div className="border-b border-gray-100 pb-6">
            <h3 className="font-semibold mb-4 text-gray-900">Categorías</h3>
            <div className="space-y-3">
              {[
                "Uniformes escolares",
                "Deportivos",
                "Pantalones",
                "Gorras",
                "Polo",
                "Playeras",
                "Calcetas",
                "Shorts",
                "Espinilleras"
              ].map((category) => (
                <label
                  key={category}
                  className="flex items-center group cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Precio */}
          <Accordion
            type="single"
            collapsible
            className="border-b border-gray-100 pb-6"
          >
            <AccordionItem value="precio" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <span className="font-semibold text-gray-900">Precio</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 px-2">
                  <Slider
                    value={filters.priceRange}
                    max={1000}
                    step={10}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: value as [number, number],
                      }))
                    }
                    className="my-6"
                  />
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-50 rounded px-3 py-2">
                      <span className="text-sm text-gray-600">
                        ${filters.priceRange[0]}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded px-3 py-2">
                      <span className="text-sm text-gray-600">
                        ${filters.priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Colores */}
          <Accordion
            type="single"
            collapsible
            className="border-b border-gray-100 pb-6"
          >
            <AccordionItem value="colores" className="border-none">
              <AccordionTrigger className="py-0 hover:no-underline">
                <span className="font-semibold text-gray-900">Colores</span>
              </AccordionTrigger>
              <AccordionContent>
                
                <div className="flex flex-wrap gap-3 pt-4">
                  {[
                    "#FF0000",
                    "#FFFFFF",
                    "#008000",
                    "#FFA500",
                    "#808080",
                    "#FFC0CB",
                    "#000000",
                    "#800080",
                    "#3B82F6",
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ring-2 ring-offset-2 transition-all border ${
                        filters.colors.includes(color)
                          ? "ring-gray-900"
                          : "ring-transparent hover:ring-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Tallas */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Talla</h3>
            <div className="grid grid-cols-3 gap-2">
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  key={size}
                  className={`h-10 rounded border text-sm font-medium transition-colors ${
                    filters.sizes.includes(size)
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-blue-600 hover:text-blue-600"
                  }`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
