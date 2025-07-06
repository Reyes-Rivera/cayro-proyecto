"use client";

import type React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Package2,
  Loader2,
  Edit,
  Trash,
  Eye,
  DollarSign,
} from "lucide-react";
import type {
  Brand,
  Category,
  Gender,
  NeckType,
  Product,
} from "../data/sampleData";
import FilterPanel from "./FilterPanel";
import PriceUpdateModal from "./PriceUpdateModal";
import Swal from "sweetalert2";
import {
  getBrands,
  getCategories,
  getGenders,
  getSleeve,
  updatePricesBulk,
  getProducts,
} from "@/api/products";

type TableFilterKey = "categories" | "brands" | "genders" | "neckTypes";

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
  isTableLoading?: boolean;
}

// ✅ Filtros específicos para la tabla (separados del modal)
interface TableFilters {
  categories: number[];
  brands: number[];
  genders: number[];
  neckTypes: number[];
  active: boolean | null;
}

// ✅ Filtros específicos para el modal de precios (separados de la tabla)
interface PriceModalFilters {
  categoryIds?: number[];
  brandIds?: number[];
  genderIds?: number[];
  colorIds?: number[];
  sizeIds?: number[];
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
  isTableLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const sortPanelRef = useRef<HTMLDivElement>(null);

  // ✅ Filtros específicos para la tabla (independientes del modal)
  const initialTableFilters: TableFilters = {
    categories: [],
    brands: [],
    genders: [],
    neckTypes: [],
    active: null,
  };

  const [tableFilters, setTableFilters] =
    useState<TableFilters>(initialTableFilters);
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // ✅ Estados para datos de la tabla (independientes del modal)
  const [tableBrands, setTableBrands] = useState<Brand[]>();
  const [tableGenders, setTableGenders] = useState<Gender[]>();
  const [tableCategories, setTableCategories] = useState<Category[]>();
  const [tableNeckTypes, setTableNeckTypes] = useState<NeckType[]>();

  // ✅ Funciones helper para la tabla (independientes del modal)
  const getTableBrandName = (brandId: number) =>
    tableBrands?.find((b) => b.id === brandId)?.name || "Desconocido";
  const getTableGenderName = (genderId: number) =>
    tableGenders?.find((g) => g.id === genderId)?.name || "Desconocido";
  const getTableNeckTypeName = (neckTypeId: number | null) =>
    neckTypeId ? tableNeckTypes?.find((n) => n.id === neckTypeId)?.name : "N/A";
  const getTableCategoryName = (categoryId: number) =>
    tableCategories?.find((c) => c.id === categoryId)?.name || "Desconocido";

  // ✅ Función para manejar actualización de precios (recibe filtros del modal)
  const handlePriceUpdate = async (
    priceFilters: PriceModalFilters,
    updateData: any
  ) => {
    try {
      console.log("🎯 Filtros del modal de precios:", priceFilters);
      console.log("📊 Datos de actualización:", updateData);

      await updatePricesBulk(priceFilters, updateData);

      // ✅ Recargar productos usando los filtros de la TABLA (no del modal)
      const currentTableFilters = buildTableFilterParams(
        tableFilters,
        searchTerm,
        currentPage,
        itemsPerPage
      );
      await getProducts(currentTableFilters);

      Swal.fire({
        title: "¡Éxito!",
        text: "Los precios se han actualizado correctamente.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (error) {
      console.error("Error updating prices:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron actualizar los precios. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    }
  };

  // ✅ Función para manejar búsqueda en la tabla
  const handleTableSearch = () => {
    const filterParams = buildTableFilterParams(
      tableFilters,
      searchTerm,
      currentPage,
      itemsPerPage
    );
    onFilterChange(filterParams);
  };

  // ✅ Función para manejar cambios de filtros de la tabla
  const handleTableFilterChange = (type: TableFilterKey, id: number) => {
    setTableFilters((prev) => {
      const currentFilter = prev[type] as number[];
      return {
        ...prev,
        [type]: currentFilter.includes(id)
          ? currentFilter.filter((item) => item !== id)
          : [...currentFilter, id],
      };
    });
  };

  // ✅ Función para manejar cambio de filtro activo en la tabla
  const handleTableActiveFilterChange = (value: boolean | null) => {
    setTableFilters((prev) => ({
      ...prev,
      active: prev.active === value ? null : value,
    }));
  };

  // ✅ Función para limpiar filtros de la tabla
  const clearAllTableFilters = () => {
    setTableFilters(initialTableFilters);
    setSearchTerm("");
    setCurrentPage(1);
    const filterParams = buildTableFilterParams(
      initialTableFilters,
      "",
      1,
      itemsPerPage
    );
    onFilterChange(filterParams);
  };

  // ✅ Función para construir parámetros de filtros de la tabla
  const buildTableFilterParams = (
    filters: TableFilters,
    search: string,
    page: number,
    limit: number
  ) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (search) params.append("search", search);

    if (filters.categories.length > 0)
      params.append("category", filters.categories[0].toString());

    if (filters.genders.length > 0)
      params.append("genders", filters.genders.join(","));

    if (filters.neckTypes.length > 0)
      params.append("sleeves", filters.neckTypes.join(","));

    if (filters.active !== null)
      params.append("active", filters.active.toString());

    if (filters.brands.length > 0)
      params.append("brand", filters.brands[0].toString());

    if (sortBy) {
      params.append("sortBy", sortBy.value);
      params.append("sortDirection", sortBy.direction);
    }

    return params.toString();
  };

  // ✅ Aplicar filtros de la tabla
  const applyTableFilters = () => {
    const filterParams = buildTableFilterParams(
      tableFilters,
      searchTerm,
      currentPage,
      itemsPerPage
    );
    onFilterChange(filterParams);
    setShowFilters(false);
  };

  // ✅ Verificar si hay filtros activos en la tabla
  const hasActiveTableFilters = useMemo(() => {
    return (
      tableFilters.categories.length > 0 ||
      tableFilters.brands.length > 0 ||
      tableFilters.genders.length > 0 ||
      tableFilters.neckTypes.length > 0 ||
      tableFilters.active !== null ||
      searchTerm !== ""
    );
  }, [tableFilters, searchTerm]);

  // Effect to close filter and sort panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle filter panel
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-filter-button="true"]')
      ) {
        setShowFilters(false);
      }

      // Handle sort panel
      if (
        sortPanelRef.current &&
        !sortPanelRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-sort-button="true"]')
      ) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Effect para cargar datos de la tabla
  useEffect(() => {
    const getTableData = async () => {
      setIsLoading(true);
      const brandsData = await getBrands();
      const genderData = await getGenders();
      const categoryData = await getCategories();
      const sleeveData = await getSleeve();

      if (brandsData) setTableBrands(brandsData.data);
      if (genderData) setTableGenders(genderData.data);
      if (categoryData) setTableCategories(categoryData.data);
      if (sleeveData) setTableNeckTypes(sleeveData.data);

      setIsLoading(false);
    };

    getTableData();
  }, []);

  return (
    <div>
      {/* Header section */}
      <div className="bg-blue-500 mb-6 rounded-xl shadow-xl overflow-hidden relative">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <Package2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Listado de Productos
                </h2>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                  {totalProducts}{" "}
                  {totalProducts === 1 ? "producto" : "productos"} en el
                  catálogo
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                onClick={() => setShowPriceModal(true)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Actualizar Precios
              </button>
              <button
                className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
                onClick={onAdd}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
          {/* Search bar with button */}
          <div className="relative flex-grow max-w-full md:max-w-md">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar productos en la tabla..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg  focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleTableSearch();
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setSearchTerm("");
                      const filterParams = buildTableFilterParams(
                        tableFilters,
                        "",
                        currentPage,
                        itemsPerPage
                      );
                      onFilterChange(filterParams);
                    }}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleTableSearch}
                className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                aria-label="Buscar en tabla"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter and sort buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Filter button */}
            <div className="relative">
              <button
                data-filter-button="true"
                className={`w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 border rounded-lg transition-colors ${
                  showFilters || hasActiveTableFilters
                    ? "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span>Filtrar Tabla</span>
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
                {hasActiveTableFilters && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                    {tableFilters.categories.length +
                      tableFilters.brands.length +
                      tableFilters.genders.length +
                      tableFilters.neckTypes.length +
                      (tableFilters.active !== null ? 1 : 0) +
                      (searchTerm ? 1 : 0)}
                  </span>
                )}
              </button>

              {showFilters && (
                <div
                  ref={filterPanelRef}
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      🔍 Filtros de la Tabla
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Estos filtros solo afectan la visualización de la tabla
                    </p>
                  </div>
                  <FilterPanel
                    filters={tableFilters}
                    brands={tableBrands}
                    categories={tableCategories}
                    genders={tableGenders}
                    neckTypes={tableNeckTypes}
                    isLoading={isLoading}
                    onFilterChange={handleTableFilterChange}
                    onActiveFilterChange={handleTableActiveFilterChange}
                    clearAllFilters={clearAllTableFilters}
                    hasActiveFilters={hasActiveTableFilters}
                  />
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        clearAllTableFilters();
                        setShowFilters(false);
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={applyTableFilters}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors"
                    >
                      Aplicar a Tabla
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort button */}
            <div className="relative">
              <button
                data-sort-button="true"
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                <div
                  ref={sortPanelRef}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={`${option.value}-${option.direction}`}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          sortBy.value === option.value &&
                          sortBy.direction === option.direction
                            ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } transition-colors`}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortOptions(false);
                          const filterParams = buildTableFilterParams(
                            tableFilters,
                            searchTerm,
                            currentPage,
                            itemsPerPage
                          );
                          onFilterChange(filterParams);
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

        {/* Active table filters chips */}
        {hasActiveTableFilters && (
          <div className="flex flex-wrap gap-2 items-center mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              🔍 Filtros activos en la tabla:
            </span>

            {searchTerm && (
              <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full px-3 py-1 flex items-center">
                <span>Búsqueda: {searchTerm}</span>
                <button
                  className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
                  onClick={() => {
                    setSearchTerm("");
                    const filterParams = buildTableFilterParams(
                      tableFilters,
                      "",
                      currentPage,
                      itemsPerPage
                    );
                    onFilterChange(filterParams);
                  }}
                  aria-label="Eliminar filtro de búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {tableFilters.active !== null && (
              <div
                className={`text-xs rounded-full px-3 py-1 flex items-center ${
                  tableFilters.active
                    ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                }`}
              >
                <span>
                  Estado: {tableFilters.active ? "Activo" : "Inactivo"}
                </span>
                <button
                  className={`ml-2 ${
                    tableFilters.active
                      ? "text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100"
                      : "text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-100"
                  } transition-colors`}
                  onClick={() => handleTableActiveFilterChange(null)}
                  aria-label="Eliminar filtro de estado"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {tableFilters.categories.map((categoryId) => (
              <div
                key={`cat-${categoryId}`}
                className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Categoría: {getTableCategoryName(categoryId)}</span>
                <button
                  className="ml-2 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 transition-colors"
                  onClick={() =>
                    handleTableFilterChange("categories", categoryId)
                  }
                  aria-label="Eliminar filtro de categoría"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {tableFilters.brands.map((brandId) => (
              <div
                key={`brand-${brandId}`}
                className="bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-200 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Marca: {getTableBrandName(brandId)}</span>
                <button
                  className="ml-2 text-teal-600 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-100 transition-colors"
                  onClick={() => handleTableFilterChange("brands", brandId)}
                  aria-label="Eliminar filtro de marca"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {tableFilters.genders.map((genderId) => (
              <div
                key={`gender-${genderId}`}
                className="bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-200 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Género: {getTableGenderName(genderId)}</span>
                <button
                  className="ml-2 text-pink-600 dark:text-pink-300 hover:text-pink-800 dark:hover:text-pink-100 transition-colors"
                  onClick={() => handleTableFilterChange("genders", genderId)}
                  aria-label="Eliminar filtro de género"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {tableFilters.neckTypes.map((neckTypeId) => (
              <div
                key={`neck-${neckTypeId}`}
                className="bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-full px-3 py-1 flex items-center"
              >
                <span>Cuello: {getTableNeckTypeName(neckTypeId)}</span>
                <button
                  className="ml-2 text-amber-600 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-100 transition-colors"
                  onClick={() =>
                    handleTableFilterChange("neckTypes", neckTypeId)
                  }
                  aria-label="Eliminar filtro de tipo de cuello"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <button
              className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 underline ml-auto transition-colors"
              onClick={clearAllTableFilters}
            >
              Limpiar todos los filtros de tabla
            </button>
          </div>
        )}

        {/* Products table/cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {/* Table header - visible only on tablet and above */}
          <div className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6 hidden sm:block">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 font-medium">ID</div>
              <div className="col-span-3 font-medium">Nombre</div>
              <div className="col-span-2 font-medium">Categoría</div>
              <div className="col-span-2 font-medium">Marca</div>
              <div className="col-span-2 font-medium">Estado</div>
              <div className="col-span-2 text-right font-medium">Acciones</div>
            </div>
          </div>

          {/* Loading state for the table only */}
          {isTableLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Cargando productos...
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  {/* Desktop/Tablet View */}
                  <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                    <div className="col-span-1">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
                        {product.id}
                      </span>
                    </div>

                    <div className="col-span-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h3>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30">
                        {getTableCategoryName(product.categoryId)}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400 border border-teal-200 dark:border-teal-800/30">
                        {getTableBrandName(product.brandId)}
                      </span>
                    </div>

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

                  {/* Mobile View */}
                  <div className="sm:hidden flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs">
                          {product.id}
                        </span>
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {product.name}
                        </h3>
                      </div>
                      {product.active ? (
                        <div className="flex items-center">
                          <span className="relative flex h-2 w-2 mr-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-medium text-xs">
                            Activo
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></span>
                          <span className="text-red-600 dark:text-red-400 font-medium text-xs">
                            Inactivo
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30">
                        {getTableCategoryName(product.categoryId)}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-400 border border-teal-200 dark:border-teal-800/30">
                        {getTableBrandName(product.brandId)}
                      </span>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onView(product.id)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Ver detalles"
                        aria-label="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(product.id)}
                        className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                        title="Editar producto"
                        aria-label="Editar producto"
                      >
                        <Edit size={16} />
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
                          aria-label="Desactivar producto"
                        >
                          <Trash size={16} />
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
                          aria-label="Activar producto"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No se encontraron productos
              </p>
              <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
                {hasActiveTableFilters
                  ? "No hay productos que coincidan con los filtros aplicados"
                  : "Añade productos para comenzar a gestionar tu inventario"}
              </p>
              {hasActiveTableFilters ? (
                <button
                  onClick={clearAllTableFilters}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                  onClick={onAdd}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Producto
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
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
                  const filterParams = buildTableFilterParams(
                    tableFilters,
                    searchTerm,
                    1,
                    newItemsPerPage
                  );
                  onFilterChange(filterParams);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
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
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
                onClick={() => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  const filterParams = buildTableFilterParams(
                    tableFilters,
                    searchTerm,
                    newPage,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                aria-label="Página anterior"
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
                      const filterParams = buildTableFilterParams(
                        tableFilters,
                        searchTerm,
                        page,
                        itemsPerPage
                      );
                      onFilterChange(filterParams);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                  }}
                  aria-label="Número de página"
                />
                <span className="mx-1 text-gray-500 dark:text-gray-400">
                  de
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {totalPages || 1}
                </span>
              </div>

              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => {
                  const newPage = Math.min(currentPage + 1, totalPages);
                  setCurrentPage(newPage);
                  const filterParams = buildTableFilterParams(
                    tableFilters,
                    searchTerm,
                    newPage,
                    itemsPerPage
                  );
                  onFilterChange(filterParams);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Price Update Modal - Completamente separado de los filtros de la tabla */}
      <PriceUpdateModal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        onUpdate={handlePriceUpdate}
      />
    </div>
  );
};

export default ProductList;
