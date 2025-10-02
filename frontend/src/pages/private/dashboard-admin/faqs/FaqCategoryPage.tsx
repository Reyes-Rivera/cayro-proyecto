"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Loader2,
  Trash,
  Tag,
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  X,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createCategoryFaqs,
  deleteCategoryFaqs,
  getCategoriesFaqs,
  updateCategoryFaqs,
} from "@/api/faqs";
import { AlertHelper } from "@/utils/alert.util";

// Interfaces
interface DataForm {
  id: number;
  name: string;
}

interface FormData {
  name: string;
}

type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

// Constantes fuera del componente para evitar recreación
const SORT_OPTIONS: SortOption[] = [
  { label: "Más recientes", value: "id", direction: "desc" },
  { label: "Más antiguos", value: "id", direction: "asc" },
  { label: "Nombre (A-Z)", value: "name", direction: "asc" },
  { label: "Nombre (Z-A)", value: "name", direction: "desc" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

// Componente de Loading reutilizable
const LoadingSpinner = ({ message = "Cargando..." }: { message?: string }) => (
  <div
    className="flex flex-col items-center justify-center py-20"
    role="status"
    aria-live="polite"
  >
    <div className="w-16 h-16 relative">
      <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 opacity-25"></div>
      <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mt-4">{message}</p>
  </div>
);

// Componente de Empty State
const EmptyState = ({
  searchTerm,
  onClearSearch,
  onCreateNew,
}: {
  searchTerm: string;
  onClearSearch: () => void;
  onCreateNew: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
    <HelpCircle
      className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3"
      aria-hidden="true"
    />
    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
      {searchTerm ? "No se encontraron categorías" : "No hay categorías"}
    </p>
    <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
      {searchTerm
        ? "No hay categorías que coincidan con la búsqueda"
        : "Comienza creando una nueva categoría"}
    </p>
    <div className="mt-6">
      {searchTerm ? (
        <button
          onClick={onClearSearch}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <XCircle className="w-4 h-4 mr-2" aria-hidden="true" />
          Limpiar búsqueda
        </button>
      ) : (
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nueva Categoría
        </button>
      )}
    </div>
  </div>
);

const FaqCategoryPage = () => {
  const [items, setItems] = useState<DataForm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  const nameValue = watch("name");

  // Memoized data processing
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortBy.value as keyof DataForm];
      const bValue = b[sortBy.value as keyof DataForm];

      if (sortBy.value === "name") {
        return sortBy.direction === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortBy.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [items, searchTerm, sortBy]);

  // Pagination calculations
  const { currentItems, totalPages, indexOfFirstItem, indexOfLastItem } =
    useMemo(() => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredAndSortedItems.slice(
        indexOfFirstItem,
        indexOfLastItem
      );
      const totalPages = Math.ceil(
        filteredAndSortedItems.length / itemsPerPage
      );

      return { currentItems, totalPages, indexOfFirstItem, indexOfLastItem };
    }, [filteredAndSortedItems, currentPage, itemsPerPage]);

  // Handlers optimizados con useCallback
  const handleEdit = useCallback(
    (category: DataForm) => {
      setValue("name", category.name);
      setEditId(category.id);
      setShowStatusModal(true);
    },
    [setValue]
  );

  const handleDelete = useCallback(async (category: DataForm) => {
    const confirmed = await AlertHelper.confirm({
      title: "¿Estás seguro?",
      message: `Eliminarás la categoría "${category.name}". Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "warning",
      animation: "bounce",
    });

    if (!confirmed) return;

    try {
      const response = await deleteCategoryFaqs(category.id);
      if (response) {
        setItems((prev) => prev.filter((cat) => cat.id !== category.id));
        AlertHelper.success({
          title: "Eliminado",
          message: `La categoría "${category.name}" ha sido eliminada.`,
          animation: "slideIn",
        });
      } else {
        throw new Error("No se pudo eliminar la categoría.");
      }
    } catch (error: any) {
      AlertHelper.error({
        title: "Error",
        message: "Ha ocurrido un error al eliminar la categoría",
        error,
        animation: "fadeIn",
      });
    }
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await getCategoriesFaqs();
      setItems(res.data);
      // Timeout mínimo para mejor UX
      setTimeout(() => setIsRefreshing(false), 300);
    } catch (error) {
      setIsRefreshing(false);
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
      }
    }
  }, [navigate]);

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (data) => {
      try {
        setIsLoading(true);

        if (editId !== null) {
          const updatedItem = await updateCategoryFaqs(editId, data);
          if (updatedItem) {
            AlertHelper.success({
              title: "Categoría actualizada",
              message: "La categoría ha sido actualizada exitosamente.",
              animation: "slideIn",
            });

            setItems((prev) =>
              prev.map((cat) =>
                cat.id === editId ? { ...cat, name: data.name } : cat
              )
            );
            setEditId(null);
            reset();
            setShowStatusModal(false);
          }
        } else {
          const newItem = await createCategoryFaqs(data);
          if (newItem) {
            AlertHelper.success({
              title: "Categoría agregada",
              message: "La categoría ha sido agregada exitosamente.",
              animation: "slideIn",
            });

            setItems((prev) => [
              ...prev,
              { id: prev.length + 1, name: data.name },
            ]);
            reset();
            setShowStatusModal(false);
          }
        }
      } catch (error: any) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
          return;
        }

        AlertHelper.error({
          title: "Error",
          message: "Ha ocurrido un error",
          error,
          animation: "fadeIn",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [editId, reset, navigate]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const closeModal = useCallback(() => {
    setShowStatusModal(false);
    setEditId(null);
    reset();
  }, [reset]);

  const paginate = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  // Efectos optimizados
  useEffect(() => {
    const fetchItems = async () => {
      setIsInitialLoading(true);
      try {
        const res = await getCategoriesFaqs();
        setItems(res.data);
      } catch (error) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchItems();
  }, [navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSortOptions && !target.closest('[data-sort-dropdown="true"]')) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortOptions]);

  // Renderizado optimizado
  const renderTableRow = useCallback(
    (item: DataForm) => (
      <div
        key={item.id}
        className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        {/* Desktop/Tablet View */}
        <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
          <div className="col-span-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
              {item.id}
            </span>
          </div>

          <div className="col-span-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <HelpCircle
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 flex items-center justify-end space-x-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              title="Editar categoría"
              aria-label={`Editar categoría ${item.name}`}
            >
              <Edit className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Eliminar categoría"
              aria-label={`Eliminar categoría ${item.name}`}
            >
              <Trash className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs">
                {item.id}
              </span>
              <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                {item.name}
              </h3>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              title="Editar categoría"
              aria-label={`Editar categoría ${item.name}`}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Eliminar categoría"
              aria-label={`Eliminar categoría ${item.name}`}
            >
              <Trash size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    ),
    [handleEdit, handleDelete]
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header section */}
      <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative mb-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>

        <div className="p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <HelpCircle
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Categorías FAQ
                </h1>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Tag
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline"
                    aria-hidden="true"
                  />
                  {items.length}{" "}
                  {items.length === 1 ? "categoría" : "categorías"} disponibles
                </p>
              </div>
            </div>

            <button
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
              onClick={() => setShowStatusModal(true)}
              aria-label="Crear nueva categoría"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Nueva Categoría
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <main className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
          {/* Search bar */}
          <div className="relative flex-grow max-w-full md:max-w-md">
            <div className="flex">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Buscar categorías"
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    onClick={() => setSearchTerm("")}
                    aria-label="Limpiar búsqueda"
                  >
                    <XCircle className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
              <button
                className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Filter and sort buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Sort button */}
            <div className="relative" data-sort-dropdown="true">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowSortOptions(!showSortOptions)}
                aria-expanded={showSortOptions}
                aria-haspopup="listbox"
                aria-label="Ordenar categorías"
              >
                <ArrowUpDown className="w-4 h-4" aria-hidden="true" />
                <span>Ordenar</span>
                {showSortOptions ? (
                  <ChevronUp className="w-4 h-4 ml-1" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" aria-hidden="true" />
                )}
              </button>

              <AnimatePresence>
                {showSortOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-40"
                    role="listbox"
                    aria-label="Opciones de ordenación"
                  >
                    <div className="p-2">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={`${option.value}-${option.direction}`}
                          onClick={() => {
                            setSortBy(option);
                            setShowSortOptions(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            sortBy.value === option.value &&
                            sortBy.direction === option.direction
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                          role="option"
                          aria-selected={
                            sortBy.value === option.value &&
                            sortBy.direction === option.direction
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={refreshData}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isRefreshing}
              aria-label="Actualizar datos"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Active filters chips */}
        {searchTerm && (
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Filtros activos:
            </span>
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-3 py-1 flex items-center">
              <span>Búsqueda: {searchTerm}</span>
              <button
                className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                onClick={() => setSearchTerm("")}
                aria-label="Eliminar filtro de búsqueda"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Categories table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {isInitialLoading ? (
            <LoadingSpinner message="Cargando categorías..." />
          ) : (
            <>
              {/* Table header - visible only on tablet and above */}
              <div
                className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6 hidden sm:block"
                role="row"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 font-medium" role="columnheader">
                    ID
                  </div>
                  <div className="col-span-6 font-medium" role="columnheader">
                    Nombre
                  </div>
                  <div
                    className="col-span-4 text-right font-medium"
                    role="columnheader"
                  >
                    Acciones
                  </div>
                </div>
              </div>

              <div
                className="divide-y divide-gray-100 dark:divide-gray-700"
                role="rowgroup"
              >
                {currentItems.length > 0 ? (
                  currentItems.map(renderTableRow)
                ) : (
                  <EmptyState
                    searchTerm={searchTerm}
                    onClearSearch={clearSearch}
                    onCreateNew={() => setShowStatusModal(true)}
                  />
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Mostrar
                    </span>
                    <select
                      className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      aria-label="Elementos por página"
                    >
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      por página
                    </span>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {indexOfFirstItem + 1} a{" "}
                    {Math.min(indexOfLastItem, filteredAndSortedItems.length)}{" "}
                    de {filteredAndSortedItems.length} categorías
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <div className="flex items-center">
                      <input
                        type="text"
                        className="w-12 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={currentPage}
                        onChange={(e) => {
                          const page = Number.parseInt(e.target.value);
                          if (!isNaN(page) && page > 0 && page <= totalPages) {
                            setCurrentPage(page);
                          }
                        }}
                        aria-label="Número de página"
                      />
                      <span className="mx-1 text-gray-500 dark:text-gray-400">
                        de
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {totalPages}
                      </span>
                    </div>

                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                      aria-label="Página siguiente"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal */}
      {showStatusModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {editId !== null ? "Editar Categoría" : "Nueva Categoría"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                  aria-label="Cerrar modal"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {editId !== null
                  ? "Modifica el nombre de la categoría seleccionada"
                  : "Ingresa el nombre de la nueva categoría para organizar las preguntas frecuentes"}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-6">
                  <label
                    htmlFor="category-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nombre de la categoría *
                  </label>
                  <input
                    {...register("name", {
                      required: "El nombre de la categoría es obligatorio",
                      minLength: {
                        value: 1,
                        message:
                          "El nombre de la categoría debe tener al menos un caracter",
                      },
                      maxLength: {
                        value: 50,
                        message:
                          "El nombre de la categoría no puede exceder los 50 caracteres",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/,
                        message:
                          "El nombre de la categoría solo puede contener letras y números.",
                      },
                    })}
                    id="category-name"
                    type="text"
                    placeholder="Ej: Envíos, Pagos, Productos..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400"
                      role="alert"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !nameValue}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2
                          className="h-4 w-4 animate-spin mr-2"
                          aria-hidden="true"
                        />
                        Procesando...
                      </>
                    ) : editId !== null ? (
                      "Actualizar Categoría"
                    ) : (
                      "Crear Categoría"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqCategoryPage;
