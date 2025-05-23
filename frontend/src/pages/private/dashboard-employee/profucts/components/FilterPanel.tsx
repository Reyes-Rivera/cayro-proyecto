import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Brand, Category, Gender, NeckType } from "../data/sampleData";

interface FilterSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// A reusable collapsible filter section component
const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-3 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </h4>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100 mb-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-1">{children}</div>
      </div>
    </div>
  );
};

type FilterKey = "categories" | "brands" | "genders" | "neckTypes";

interface FilterPanelProps {
  filters: {
    categories: number[];
    brands: number[];
    genders: number[];
    neckTypes: number[];
    active: boolean | null;
  };
  brands?: Brand[];
  categories?: Category[];
  genders?: Gender[];
  neckTypes?: NeckType[];
  isLoading: boolean;
  onFilterChange: (type: FilterKey, id: number) => void;
  onActiveFilterChange: (value: boolean | null) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  brands,
  categories,
  genders,
  neckTypes,
  isLoading,
  onFilterChange,
  onActiveFilterChange,
  clearAllFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="p-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            onClick={clearAllFilters}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Estado filter section */}
      <FilterSection title="Estado" defaultOpen={filters.active !== null}>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.active === true
                ? "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            }`}
            onClick={() => onActiveFilterChange(true)}
          >
            Activo
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filters.active === false
                ? "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            }`}
            onClick={() => onActiveFilterChange(false)}
          >
            Inactivo
          </button>
        </div>
      </FilterSection>

      {/* Categoría filter section */}
      <FilterSection
        title="Categoría"
        defaultOpen={filters.categories.length > 0}
      >
        {isLoading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cargando categorías...
          </div>
        ) : (
          <div className="space-y-1 grid grid-cols-2 gap-x-2">
            {categories?.map((cat) => (
              <label key={cat.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-purple-600 focus:ring-purple-500 mr-2"
                  checked={filters.categories.includes(cat.id)}
                  onChange={() => onFilterChange("categories", cat.id)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </FilterSection>

      {/* Marca filter section */}
      <FilterSection title="Marca" defaultOpen={filters.brands.length > 0}>
        {isLoading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cargando marcas...
          </div>
        ) : (
          <div className="space-y-1 grid grid-cols-2 gap-x-2">
            {brands?.map((brand) => (
              <label key={brand.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-teal-600 focus:ring-teal-500 mr-2"
                  checked={filters.brands.includes(brand.id)}
                  onChange={() => onFilterChange("brands", brand.id)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </FilterSection>

      {/* Género filter section */}
      <FilterSection title="Género" defaultOpen={filters.genders.length > 0}>
        {isLoading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cargando géneros...
          </div>
        ) : (
          <div className="space-y-1 grid grid-cols-2 gap-x-2">
            {genders?.map((gender) => (
              <label key={gender.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-pink-600 focus:ring-pink-500 mr-2"
                  checked={filters.genders.includes(gender.id)}
                  onChange={() => onFilterChange("genders", gender.id)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {gender.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </FilterSection>

      {/* Tipo de Cuello filter section */}
      <FilterSection
        title="Tipo de Cuello"
        defaultOpen={filters.neckTypes.length > 0}
      >
        {isLoading ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cargando tipos de cuello...
          </div>
        ) : (
          <div className="space-y-1 grid grid-cols-2 gap-x-2">
            {neckTypes?.map((neckType) => (
              <label key={neckType.id} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded text-amber-600 focus:ring-amber-500 mr-2"
                  checked={filters.neckTypes.includes(neckType.id)}
                  onChange={() => onFilterChange("neckTypes", neckType.id)}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {neckType.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </FilterSection>
    </div>
  );
};

export default FilterPanel;
