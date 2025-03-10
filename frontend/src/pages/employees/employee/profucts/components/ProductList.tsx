"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";

interface ProductListProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onAdd: () => void;
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
  onEdit,
  onDelete,
  onView,
  onAdd,
}) => {
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para filtros
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as number[],
    brands: [] as number[],
    genders: [] as number[],
    neckTypes: [] as number[],
    active: null as boolean | null,
  });

  // Estado para ordenación
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Estado para carga de datos
  const [isLoading, setIsLoading] = useState(true);

  // Tipos de claves de filtro
  type FilterKey = keyof typeof filters;

  // Función para manejar cambios en los filtros
  const handleFilterChange = (type: FilterKey, id: number) => {
    setFilters((prev) => {
      const currentFilter = prev[type] as number[];
      return {
        ...prev,
        [type]: currentFilter.includes(id)
          ? currentFilter.filter((item) => item !== id)
          : [...currentFilter, id],
      };
    });
    setCurrentPage(1);
  };

  // Función para manejar cambio en el filtro de activo
  const handleActiveFilterChange = (value: boolean | null) => {
    setFilters((prev) => ({
      ...prev,
      active: prev.active === value ? null : value,
    }));
    setCurrentPage(1);
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      genders: [],
      neckTypes: [],
      active: null,
    });
    setSearchTerm("");
    setCurrentPage(1);
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

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

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
    <div className="container mx-auto ">
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100 mb-8">
        <div className=" bg-white border-b  p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <Package className="w-6 h-6 mr-2" />
                Listado de Productos
              </h1>
              <p className="text-blue-700">
                {filteredAndSortedProducts.length}{" "}
                {filteredAndSortedProducts.length === 1
                  ? "producto"
                  : "productos"}{" "}
                en el catálogo
              </p>
            </div>
            <button
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-md"
              onClick={() => onAdd()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white  p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                className={`flex items-center gap-1 px-3 py-2 border rounded-lg transition-colors ${
                  showFilters ||
                  Object.values(filters).some((f) =>
                    Array.isArray(f) ? f.length > 0 : f !== null
                  )
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span>Filtrar</span>
                {(filters.categories.length > 0 ||
                  filters.brands.length > 0 ||
                  filters.genders.length > 0 ||
                  filters.neckTypes.length > 0 ||
                  filters.active !== null) && (
                  <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {filters.categories.length +
                      filters.brands.length +
                      filters.genders.length +
                      filters.neckTypes.length +
                      (filters.active !== null ? 1 : 0)}
                  </span>
                )}
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              {/* Panel de filtros */}
              {showFilters && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700 flex items-center">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filtros
                      </h3>
                      {hasActiveFilters && (
                        <button
                          className="text-xs text-blue-600 hover:text-blue-800"
                          onClick={clearAllFilters}
                        >
                          Limpiar filtros
                        </button>
                      )}
                    </div>

                    {/* Filtro por estado */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </h4>
                      <div className="flex gap-2">
                        <button
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            filters.active === true
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                          }`}
                          onClick={() => handleActiveFilterChange(true)}
                        >
                          Activo
                        </button>
                        <button
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            filters.active === false
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                          }`}
                          onClick={() => handleActiveFilterChange(false)}
                        >
                          Inactivo
                        </button>
                      </div>
                    </div>

                    {/* Filtro por categoría */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Categoría
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500">
                          Cargando categorías...
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {category?.map((category) => (
                            <label
                              key={category.id}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                checked={filters.categories.includes(
                                  category.id
                                )}
                                onChange={() =>
                                  handleFilterChange("categories", category.id)
                                }
                              />
                              <span className="text-sm">{category.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Filtro por marca */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Marca
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500">
                          Cargando marcas...
                        </div>
                      ) : (
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {brands?.map((brand) => (
                            <label key={brand.id} className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                checked={filters.brands.includes(brand.id)}
                                onChange={() =>
                                  handleFilterChange("brands", brand.id)
                                }
                              />
                              <span className="text-sm">{brand.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Filtro por género */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Género
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500">
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
                                className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                checked={filters.genders.includes(gender.id)}
                                onChange={() =>
                                  handleFilterChange("genders", gender.id)
                                }
                              />
                              <span className="text-sm">{gender.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Filtro por tipo de cuello */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Tipo de Cuello
                      </h4>
                      {isLoading ? (
                        <div className="text-sm text-gray-500">
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
                                className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                                checked={filters.neckTypes.includes(
                                  neckType.id
                                )}
                                onChange={() =>
                                  handleFilterChange("neckTypes", neckType.id)
                                }
                              />
                              <span className="text-sm">{neckType.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown de ordenación */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={`${option.value}-${option.direction}`}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortBy.value === option.value &&
                          sortBy.direction === option.direction
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-100"
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
          <div className="bg-white p-3 border-b border-gray-200 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Filtros activos:</span>

            {searchTerm && (
              <div className="bg-blue-50 text-blue-700 text-xs rounded-full px-3 py-1 flex items-center">
                <span>Búsqueda: {searchTerm}</span>
                <button
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {filters.active !== null && (
              <div
                className={`text-xs rounded-full px-3 py-1 flex items-center ${
                  filters.active
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <span>Estado: {filters.active ? "Activo" : "Inactivo"}</span>
                <button
                  className={`ml-2 ${
                    filters.active
                      ? "text-green-500 hover:text-green-700"
                      : "text-red-500 hover:text-red-700"
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
                className="bg-purple-50 text-purple-700 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Categoría: {getCategoryName(categoryId)}</span>
                <button
                  className="ml-2 text-purple-500 hover:text-purple-700"
                  onClick={() => handleFilterChange("categories", categoryId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.brands.map((brandId) => (
              <div
                key={`brand-${brandId}`}
                className="bg-indigo-50 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Marca: {getBrandName(brandId)}</span>
                <button
                  className="ml-2 text-indigo-500 hover:text-indigo-700"
                  onClick={() => handleFilterChange("brands", brandId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.genders.map((genderId) => (
              <div
                key={`gender-${genderId}`}
                className="bg-pink-50 text-pink-700 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Género: {getGenderName(genderId)}</span>
                <button
                  className="ml-2 text-pink-500 hover:text-pink-700"
                  onClick={() => handleFilterChange("genders", genderId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.neckTypes.map((neckTypeId) => (
              <div
                key={`neck-${neckTypeId}`}
                className="bg-amber-50 text-amber-700 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Cuello: {getNeckTypeName(neckTypeId)}</span>
                <button
                  className="ml-2 text-amber-500 hover:text-amber-700"
                  onClick={() => handleFilterChange("neckTypes", neckTypeId)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <button
              className="text-xs text-gray-500 hover:text-gray-700 underline ml-auto"
              onClick={clearAllFilters}
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Tabla de productos */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-h-[300px]">
            <thead>
              <tr className="bg-indigo-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                  Categoría
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                  Marca
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50/30"
                    } hover:bg-indigo-50 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        #{product.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">
                        {getCategoryName(product.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full">
                        {getBrandName(product.brandId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.active ? (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center w-fit">
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Activo
                        </span>
                      ) : (
                        <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center w-fit">
                          <X className="w-3.5 h-3.5 mr-1" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        {/* Botón Ver */}
                        <button
                          onClick={() => onView(product.id)}
                          className="bg-blue-100 p-2 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors group relative"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Ver detalles
                          </span>
                        </button>

                        {/* Botón Editar */}
                        <button
                          onClick={() => onEdit(product.id)}
                          className="bg-amber-100 p-2 rounded-lg text-amber-600 hover:bg-amber-200 transition-colors group relative"
                          title="Editar producto"
                        >
                          <Edit size={18} />
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Editar producto
                          </span>
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => onDelete(product.id)}
                          className="bg-red-100 p-2 rounded-lg text-red-600 hover:bg-red-200 transition-colors group relative"
                          title="Eliminar producto"
                        >
                          <Trash size={18} />
                          <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Eliminar producto
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Package className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium">
                        No hay productos disponibles
                      </p>
                      <p className="text-sm mb-4">
                        {hasActiveFilters
                          ? "No se encontraron productos con los filtros seleccionados"
                          : "Añade productos para comenzar a gestionar tu inventario"}
                      </p>
                      {hasActiveFilters ? (
                        <button
                          onClick={clearAllFilters}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Limpiar filtros
                        </button>
                      ) : (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors">
                          <Plus className="w-4 h-4 mr-2" />
                          Añadir Producto
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Mostrar</span>
              <select
                className="border border-gray-300 rounded-md text-sm p-1"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-500">por página</span>
            </div>

            <div className="text-sm text-gray-500">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedProducts.length
              )}{" "}
              de {filteredAndSortedProducts.length} productos
            </div>

            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center">
                <span className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-md text-sm text-blue-700 font-medium">
                  {currentPage}
                </span>
                <span className="mx-1 text-gray-500">de</span>
                <span className="text-gray-700">{totalPages || 1}</span>
              </div>

              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
