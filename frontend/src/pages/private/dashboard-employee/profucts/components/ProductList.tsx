"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import type {
  Product,
  Brand,
  Gender,
  Category,
  NeckType,
} from "../data/sampleData";
import {
  getBrands,
  getCategories,
  getGenders,
  getSleeve,
} from "@/api/products";
import {
  Edit,
  Trash,
  Eye,
  Package,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  XCircle,
  Package2,
} from "lucide-react";
import Swal from "sweetalert2";

// Modificar la interfaz ProductListProps para incluir onFilterChange
interface ProductListProps {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
  onAdd: () => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  onFilterChange: (filterParams: string) => void;
}

// Opciones de ordenación
type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Más recientes", value: "createdAt", direction: "desc" },
  { label: "Más antiguos", value: "createdAt", direction: "asc" },
  { label: "Nombre (A-Z)", value: "name", direction: "asc" },
  { label: "Nombre (Z-A)", value: "name", direction: "desc" },
  { label: "ID (ascendente)", value: "id", direction: "asc" },
  { label: "ID (descendente)", value: "id", direction: "desc" },
];

const ProductList: React.FC<ProductListProps> = ({
  products,
  totalProducts,
  totalPages,
  onEdit,
  onView,
  onAdd,
  onActivate,
  onDeactivate,
  onFilterChange,
}) => {
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para filtros
  const [showFilters, setShowFilters] = useState(false);
  const initialFilters = {
    categories: [] as number[],
    brands: [] as number[],
    genders: [] as number[],
    neckTypes: [] as number[],
    active: null as boolean | null,
  };
  const [filters, setFilters] = useState(initialFilters);

  // Estado para ordenación
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Estado para carga de datos
  const [isLoading, setIsLoading] = useState(true);

  // Añadir esta variable de estado al inicio del componente, justo después de las otras declaraciones de estado
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Tipos de claves de filtro
  type FilterKey = keyof typeof filters;

  // Modificar la función handleFilterChange para construir y enviar los parámetros de filtro a la API
  const handleFilterChange = (type: FilterKey, id: number) => {
    setFilters((prev) => {
      const currentFilter = prev[type] as number[];
      const newFilters = {
        ...prev,
        [type]: currentFilter.includes(id)
          ? currentFilter.filter((item) => item !== id)
          : [...currentFilter, id],
      };

      // Construir y enviar los parámetros de filtro
      const filterParams = buildFilterParams(
        newFilters,
        searchTerm,
        currentPage,
        itemsPerPage
      );
      onFilterChange(filterParams);

      return newFilters;
    });
    setCurrentPage(1);
  };

  // Modificar handleActiveFilterChange para enviar los parámetros de filtro
  const handleActiveFilterChange = (value: boolean | null) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        active: prev.active === value ? null : value,
      };

      // Construir y enviar los parámetros de filtro
      const filterParams = buildFilterParams(
        newFilters,
        searchTerm,
        currentPage,
        itemsPerPage
      );
      onFilterChange(filterParams);

      return newFilters;
    });
    setCurrentPage(1);
  };

  // Modificar clearAllFilters para enviar los parámetros de filtro vacíos
  const clearAllFilters = () => {
    const emptyFilters = {
      categories: [],
      brands: [],
      genders: [],
      neckTypes: [],
      active: null,
    };
    setFilters(emptyFilters);
    setSearchTerm("");
    setCurrentPage(1);

    // Enviar parámetros de filtro vacíos
    const filterParams = buildFilterParams(
      emptyFilters,
      "",
      currentPage,
      itemsPerPage
    );
    onFilterChange(filterParams);
  };

  // Modificar la función buildFilterParams para manejar correctamente el término de búsqueda
  const buildFilterParams = (
    filters: typeof initialFilters,
    search: string,
    page: number,
    limit: number
  ) => {
    const params = new URLSearchParams();

    // Añadir parámetros de paginación
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    // Añadir término de búsqueda
    if (search) {
      params.append("search", search);
    }

    // Añadir categorías
    if (filters.categories.length > 0) {
      params.append("category", filters.categories[0].toString());
    }

    // Añadir géneros
    if (filters.genders.length > 0) {
      params.append("genders", filters.genders.join(","));
    }

    // Añadir tipos de manga/cuello
    if (filters.neckTypes.length > 0) {
      params.append("sleeves", filters.neckTypes.join(","));
    }

    // Añadir estado activo/inactivo
    if (filters.active !== null) {
      params.append("active", filters.active.toString());
    }

    // Añadir marcas
    if (filters.brands.length > 0) {
      params.append("brand", filters.brands[0].toString());
    }

    return params.toString();
  };

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    // Primero filtramos por término de búsqueda
    let result = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Luego aplicamos los filtros
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.categoryId)
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter((product) =>
        filters.brands.includes(product.brandId)
      );
    }

    if (filters.genders.length > 0) {
      result = result.filter((product) =>
        filters.genders.includes(product.genderId)
      );
    }

    if (filters.neckTypes.length > 0) {
      result = result.filter(
        (product) =>
          product.sleeveId !== null &&
          filters.neckTypes.includes(product.sleeveId)
      );
    }

    if (filters.active !== null) {
      result = result.filter((product) => product.active === filters.active);
    }

    // Finalmente ordenamos
    return result.sort((a, b) => {
      const aValue = a[sortBy.value as keyof Product];
      const bValue = b[sortBy.value as keyof Product];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortBy.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortBy.direction === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Para fechas en formato string
      if (sortBy.value === "createdAt" || sortBy.value === "updatedAt") {
        const dateA = new Date(a[sortBy.value as keyof Product] as string);
        const dateB = new Date(b[sortBy.value as keyof Product] as string);
        return sortBy.direction === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Para valores numéricos
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortBy.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [products, searchTerm, filters, sortBy]);

  // Calcular productos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.brands.length > 0 ||
      filters.genders.length > 0 ||
      filters.neckTypes.length > 0 ||
      filters.active !== null ||
      searchTerm !== ""
    );
  }, [filters, searchTerm]);

  const [brands, setBrands] = useState<Brand[]>();
  const [genders, setGenders] = useState<Gender[]>();
  const [category, setCategory] = useState<Category[]>();
  const [neckType, setNeckType] = useState<NeckType[]>();

  const getBrandName = (brandId: number) =>
    brands?.find((b) => b.id === brandId)?.name || "Desconocido";
  const getGenderName = (genderId: number) =>
    genders?.find((g) => g.id === genderId)?.name || "Desconocido";
  const getNeckTypeName = (neckTypeId: number | null) =>
    neckTypeId ? neckType?.find((n) => n.id === neckTypeId)?.name : "N/A";
  const getCategoryName = (categoryId: number) =>
    category?.find((c) => c.id === categoryId)?.name || "Desconocido";

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const brandsData = await getBrands();
      const genderData = await getGenders();
      const categoryData = await getCategories();
      const sleeveData = await getSleeve();
      if (brandsData) setBrands(brandsData.data);
      if (genderData) setGenders(genderData.data);
      if (categoryData) setCategory(categoryData.data);
      if (sleeveData) setNeckType(sleeveData.data);
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Encabezado de Página - Rediseñado para parecerse a la imagen */}
      <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <Package2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Listado de Productos
                </h2>
                <p className="mt-1 text-white/80 flex items-center">
                  <Package className="w-3.5 h-3.5 mr-1.5 inline" />
                  {filteredAndSortedProducts.length}{" "}
                  {filteredAndSortedProducts.length === 1
                    ? "producto"
                    : "productos"}{" "}
                  en el catálogo
                </p>
              </div>
            </div>
            <button
              className="bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              onClick={() => onAdd()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros - Rediseñado para parecerse a la imagen */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          {/* Barra de búsqueda */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => {
                const newSearchTerm = e.target.value;
                setSearchTerm(newSearchTerm);

                // Usar un temporizador para evitar demasiadas solicitudes mientras el usuario escribe
                if (searchTimeout.current) {
                  clearTimeout(searchTimeout.current);
                }

                searchTimeout.current = setTimeout(() => {
                  setCurrentPage(1);
                  // Construir y enviar los parámetros de filtro
                  const filterParams = buildFilterParams(
                    filters,
                    newSearchTerm,
                    1,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                }, 500); // Esperar 500ms después de que el usuario deje de escribir
              }}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setSearchTerm("");
                  const filterParams = buildFilterParams(
                    filters,
                    "",
                    1,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                }}
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Botones de filtro y ordenación */}
          <div className="flex items-center gap-2">
            {/* Botón de filtro */}
            <div className="relative">
              <button
                className={`flex items-center gap-1 px-4 py-3 border rounded-lg transition-colors ${
                  showFilters ||
                  Object.values(filters).some((f) =>
                    Array.isArray(f) ? f.length > 0 : f !== null
                  )
                    ? "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span>Filtrar</span>
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {/* Panel de filtros - Rediseñado para parecerse a la imagen */}
              {showFilters && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filtros
                      </h3>
                      {hasActiveFilters && (
                        <button
                          className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                          onClick={clearAllFilters}
                        >
                          Limpiar filtros
                        </button>
                      )}
                    </div>

                    {/* Filtro por estado */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estado
                      </h4>
                      <div className="flex gap-2">
                        <button
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            filters.active === true
                              ? "bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                              : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
                          onClick={() => handleActiveFilterChange(true)}
                        >
                          Activo
                        </button>
                        <button
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            filters.active === false
                              ? "bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                              : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                          }`}
                          onClick={() => handleActiveFilterChange(false)}
                        >
                          Inactivo
                        </button>
                      </div>
                    </div>

                    {/* Filtro por categoría */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoría
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Cargando categorías...
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {category?.map((cat) => (
                            <label key={cat.id} className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded text-purple-600 focus:ring-purple-500 mr-2"
                                checked={filters.categories.includes(cat.id)}
                                onChange={() =>
                                  handleFilterChange("categories", cat.id)
                                }
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {cat.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Filtro por marca */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Marca
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Cargando marcas...
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {brands?.map((brand) => (
                            <label key={brand.id} className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded text-teal-600 focus:ring-teal-500 mr-2"
                                checked={filters.brands.includes(brand.id)}
                                onChange={() =>
                                  handleFilterChange("brands", brand.id)
                                }
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {brand.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Filtro por género */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Género
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Cargando géneros...
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {genders?.map((gender) => (
                            <label
                              key={gender.id}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                className="rounded text-pink-600 focus:ring-pink-500 mr-2"
                                checked={filters.genders.includes(gender.id)}
                                onChange={() =>
                                  handleFilterChange("genders", gender.id)
                                }
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {gender.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Filtro por tipo de cuello */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Cuello
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Cargando tipos de cuello...
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {neckType?.map((neckType) => (
                            <label
                              key={neckType.id}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                className="rounded text-amber-600 focus:ring-amber-500 mr-2"
                                checked={filters.neckTypes.includes(
                                  neckType.id
                                )}
                                onChange={() =>
                                  handleFilterChange("neckTypes", neckType.id)
                                }
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {neckType.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de ordenación */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Ordenar</span>
                {showSortOptions ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {showSortOptions && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={`${option.value}-${option.direction}`}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortBy.value === option.value &&
                          sortBy.direction === option.direction
                            ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortOptions(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chips de filtros activos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Filtros activos:
            </span>

            {searchTerm && (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-3 py-1 flex items-center">
                <span>Búsqueda: {searchTerm}</span>
                <button
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => {
                    setSearchTerm("");
                    const filterParams = buildFilterParams(
                      filters,
                      "",
                      currentPage,
                      itemsPerPage
                    );
                    onFilterChange(filterParams);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.active !== null && (
              <div
                className={`text-xs rounded-full px-3 py-1 flex items-center ${
                  filters.active
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                }`}
              >
                <span>Estado: {filters.active ? "Activo" : "Inactivo"}</span>
                <button
                  className={`ml-2 ${
                    filters.active
                      ? "text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      : "text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  }`}
                  onClick={() => handleActiveFilterChange(null)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.categories.map((categoryId) => (
              <div
                key={`cat-${categoryId}`}
                className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Categoría: {getCategoryName(categoryId)}</span>
                <button
                  className="ml-2 text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  onClick={() => handleFilterChange("categories", categoryId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.brands.map((brandId) => (
              <div
                key={`brand-${brandId}`}
                className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Marca: {getBrandName(brandId)}</span>
                <button
                  className="ml-2 text-teal-500 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                  onClick={() => handleFilterChange("brands", brandId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.genders.map((genderId) => (
              <div
                key={`gender-${genderId}`}
                className="bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Género: {getGenderName(genderId)}</span>
                <button
                  className="ml-2 text-pink-500 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300"
                  onClick={() => handleFilterChange("genders", genderId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.neckTypes.map((neckTypeId) => (
              <div
                key={`neck-${neckTypeId}`}
                className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Cuello: {getNeckTypeName(neckTypeId)}</span>
                <button
                  className="ml-2 text-amber-500 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                  onClick={() => handleFilterChange("neckTypes", neckTypeId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <button
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline ml-auto"
              onClick={clearAllFilters}
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Tabla de productos - Rediseñada para parecerse a la imagen */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {/* Encabezado de tabla */}
          <div className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 font-medium">ID</div>
              <div className="col-span-3 font-medium">Nombre</div>
              <div className="col-span-2 font-medium">Categoría</div>
              <div className="col-span-2 font-medium">Marca</div>
              <div className="col-span-2 font-medium">Estado</div>
              <div className="col-span-2 text-right font-medium">Acciones</div>
            </div>
          </div>

          {/* Filas de productos */}
          {paginatedProducts.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* ID */}
                    <div className="col-span-1">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
                        {product.id}
                      </span>
                    </div>

                    {/* Nombre */}
                    <div className="col-span-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                    </div>

                    {/* Categoría */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </div>

                    {/* Marca */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400 border border-teal-200 dark:border-teal-800/30">
                        {getBrandName(product.brandId)}
                      </span>
                    </div>

                    {/* Estado */}
                    <div className="col-span-2">
                      {product.active ? (
                        <div className="flex items-center">
                          <span className="relative flex h-2.5 w-2.5 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                            Activo
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></span>
                          <span className="text-red-600 dark:text-red-400 font-medium text-sm">
                            Inactivo
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="col-span-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(product.id)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => onEdit(product.id)}
                        className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                        title="Editar producto"
                      >
                        <Edit size={18} />
                      </button>

                      {product.active ? (
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "¿Desactivar producto?",
                              text: `¿Estás seguro de que deseas desactivar "${product.name}"?`,
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#6b7280",
                              confirmButtonText: "Sí, desactivar",
                              cancelButtonText: "Cancelar",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                onDeactivate(product.id);
                              }
                            });
                          }}
                          className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                          title="Desactivar producto"
                        >
                          <Trash size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "¿Activar producto?",
                              text: `¿Estás seguro de que deseas activar "${product.name}"?`,
                              icon: "question",
                              showCancelButton: true,
                              confirmButtonColor: "#2563eb",
                              cancelButtonColor: "#6b7280",
                              confirmButtonText: "Sí, activar",
                              cancelButtonText: "Cancelar",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                onActivate(product.id);
                              }
                            });
                          }}
                          className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                          title="Activar producto"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No hay productos disponibles
              </p>
              <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
                {hasActiveFilters
                  ? "No se encontraron productos con los filtros seleccionados"
                  : "Añade productos para comenzar a gestionar tu inventario"}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearAllFilters}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </button>
              ) : (
                <button
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                  onClick={() => onAdd()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Producto
                </button>
              )}
            </div>
          )}

          {/* Paginación */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Mostrar
              </span>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                value={itemsPerPage}
                onChange={(e) => {
                  const newItemsPerPage = Number(e.target.value);
                  setItemsPerPage(newItemsPerPage);
                  setCurrentPage(1);

                  // Construir y enviar los parámetros de filtro
                  const filterParams = buildFilterParams(
                    filters,
                    searchTerm,
                    1,
                    newItemsPerPage
                  );
                  onFilterChange(filterParams);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                por página
              </span>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando{" "}
              {totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{" "}
              {Math.min(currentPage * itemsPerPage, totalProducts)} de{" "}
              {totalProducts} productos
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);

                  // Construir y enviar los parámetros de filtro
                  const filterParams = buildFilterParams(
                    filters,
                    searchTerm,
                    newPage,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center">
                <input
                  type="text"
                  className="w-12 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  value={currentPage}
                  onChange={(e) => {
                    const page = Number.parseInt(e.target.value);
                    if (!isNaN(page) && page > 0 && page <= totalPages) {
                      setCurrentPage(page);
                      const filterParams = buildFilterParams(
                        filters,
                        searchTerm,
                        page,
                        itemsPerPage
                      );
                      onFilterChange(filterParams);
                    }
                  }}
                />
                <span className="mx-1 text-gray-500 dark:text-gray-400">
                  de
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {totalPages || 1}
                </span>
              </div>

              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => {
                  const newPage = Math.min(currentPage + 1, totalPages);
                  setCurrentPage(newPage);

                  // Construir y enviar los parámetros de filtro
                  const filterParams = buildFilterParams(
                    filters,
                    searchTerm,
                    newPage,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
