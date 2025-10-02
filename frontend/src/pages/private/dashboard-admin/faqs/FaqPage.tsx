"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Loader2,
  Trash,
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
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createFaqs,
  deleteFaqs,
  getCategoriesFaqs,
  getFaqs,
  updateFaqs,
} from "@/api/faqs";
import { AlertHelper } from "@/utils/alert.util";

// Interfaces
interface Category {
  id: number;
  name: string;
}

interface DataForm {
  id: number;
  categoryId: number;
  question: string;
  answer: string;
  category?: string;
}

interface FormData {
  categoryId: number;
  question: string;
  answer: string;
}

type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

// Constantes fuera del componente
const SORT_OPTIONS: SortOption[] = [
  { label: "Más recientes", value: "id", direction: "desc" },
  { label: "Más antiguos", value: "id", direction: "asc" },
  { label: "Pregunta (A-Z)", value: "question", direction: "asc" },
  { label: "Pregunta (Z-A)", value: "question", direction: "desc" },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

// Componentes reutilizables
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

const EmptyState = ({
  searchTerm,
  categoryFilter,
  onClearFilters,
  onCreateNew,
}: {
  searchTerm: string;
  categoryFilter: number | null;
  onClearFilters: () => void;
  onCreateNew: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
    <MessageSquare
      className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3"
      aria-hidden="true"
    />
    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
      {searchTerm || categoryFilter !== null
        ? "No se encontraron preguntas"
        : "No hay preguntas frecuentes"}
    </p>
    <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
      {searchTerm || categoryFilter !== null
        ? "No hay preguntas que coincidan con los filtros aplicados"
        : "Comienza creando una nueva pregunta frecuente"}
    </p>
    <div className="mt-6">
      {searchTerm || categoryFilter !== null ? (
        <button
          onClick={onClearFilters}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <XCircle className="w-4 h-4 mr-2" aria-hidden="true" />
          Limpiar filtros
        </button>
      ) : (
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nueva Pregunta
        </button>
      )}
    </div>
  </div>
);

const FaqPage = () => {
  const [items, setItems] = useState<DataForm[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
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

  const answerValue = watch("answer") || "";

  // Memoized data processing
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === null || item.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy.value === "question") {
        return sortBy.direction === "asc"
          ? a.question.localeCompare(b.question)
          : b.question.localeCompare(a.question);
      }
      if (sortBy.value === "id") {
        return sortBy.direction === "asc" ? a.id - b.id : b.id - a.id;
      }
      return 0;
    });
  }, [items, searchTerm, categoryFilter, sortBy]);

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
  const resetState = useCallback(() => {
    setIsLoading(false);
    setEditId(null);
    reset();
    setShowStatusModal(false);
  }, [reset]);

  const handleEdit = useCallback(
    (faq: DataForm) => {
      setValue("categoryId", faq.categoryId);
      setValue("question", faq.question);
      setValue("answer", faq.answer);
      setEditId(faq.id);
      setShowStatusModal(true);
    },
    [setValue]
  );

  const handleDelete = useCallback(async (faq: DataForm) => {
    const result = await AlertHelper.confirm({
      title: "¿Estás seguro?",
      message: `Eliminarás la pregunta "${faq.question}". Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "warning",
      animation: "bounce",
    });

    if (!result) return;

    try {
      const response = await deleteFaqs(faq.id);
      if (response) {
        setItems((prev) => prev.filter((item) => item.id !== faq.id));
        AlertHelper.success({
          title: "Eliminado",
          message: "La pregunta ha sido eliminada.",
          animation: "slideIn",
        });
      } else {
        throw new Error("No se pudo eliminar la pregunta.");
      }
    } catch (error: any) {
      AlertHelper.error({
        title: "Error",
        error,
        message: "Ha ocurrido un error al eliminar la pregunta.",
        animation: "fadeIn",
      });
    }
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [res, categoriesRes] = await Promise.all([
        getFaqs(),
        getCategoriesFaqs(),
      ]);

      const itemsWithCategory = res.data.map((item: DataForm) => {
        const category = categoriesRes.data.find(
          (cat: Category) => cat.id === item.categoryId
        );
        return {
          ...item,
          category: category?.name || "Sin categoría",
        };
      });

      setItems(itemsWithCategory);
      setCategories(categoriesRes.data);
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
          const updatedItem = await updateFaqs(editId, data);
          if (updatedItem) {
            AlertHelper.success({
              title: "Pregunta actualizada",
              message: "La pregunta ha sido actualizada exitosamente.",
              animation: "slideIn",
            });

            const categoryName =
              categories.find((cat) => cat.id === data.categoryId)?.name || "";

            setItems((prev) =>
              prev.map((item) =>
                item.id === editId
                  ? {
                      ...item,
                      categoryId: data.categoryId,
                      question: data.question,
                      answer: data.answer,
                      category: categoryName,
                    }
                  : item
              )
            );
            resetState();
            return;
          }
        } else {
          const newItem = await createFaqs({
            ...data,
            categoryId: +data.categoryId,
          });
          if (newItem) {
            AlertHelper.success({
              title: "Pregunta agregada",
              message: "La pregunta ha sido agregada exitosamente.",
              animation: "slideIn",
            });
            refreshData();
            resetState();
            return;
          }
        }
      } catch (error: any) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
          return;
        }

        AlertHelper.error({
          title: "Error",
          error,
          message: "Ha ocurrido un error al guardar la pregunta.",
          animation: "fadeIn",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [editId, categories, resetState, refreshData, navigate]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter(null);
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

  // Renderizado optimizado de filas
  const renderTableRow = useCallback(
    (item: DataForm) => (
      <div
        key={item.id}
        className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
      >
        {/* Desktop/Tablet View */}
        <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
          <div className="col-span-1">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
              {item.id}
            </span>
          </div>

          <div className="col-span-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
              {item.category}
            </span>
          </div>

          <div className="col-span-4">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
              {item.question}
            </div>
          </div>

          <div className="col-span-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.answer}
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-end space-x-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              title="Editar pregunta"
              aria-label={`Editar pregunta: ${item.question}`}
            >
              <Edit className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Eliminar pregunta"
              aria-label={`Eliminar pregunta: ${item.question}`}
            >
              <Trash className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs">
                {item.id}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                {item.category}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
              {item.question}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.answer}
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              title="Editar pregunta"
              aria-label={`Editar pregunta: ${item.question}`}
            >
              <Edit size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Eliminar pregunta"
              aria-label={`Eliminar pregunta: ${item.question}`}
            >
              <Trash size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    ),
    [handleEdit, handleDelete]
  );

  // Efectos optimizados
  useEffect(() => {
    const fetchItems = async () => {
      setIsInitialLoading(true);
      try {
        const [res, categoriesRes] = await Promise.all([
          getFaqs(),
          getCategoriesFaqs(),
        ]);

        const itemsWithCategory = res.data.map((item: DataForm) => {
          const category = categoriesRes.data.find(
            (cat: Category) => cat.id === item.categoryId
          );
          return {
            ...item,
            category: category?.name || "Sin categoría",
          };
        });

        setItems(itemsWithCategory);
        setCategories(categoriesRes.data);
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
  }, [searchTerm, categoryFilter]);

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
                <MessageSquare
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Preguntas Frecuentes
                </h1>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <MessageSquare
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline"
                    aria-hidden="true"
                  />
                  {items.length} {items.length === 1 ? "pregunta" : "preguntas"}{" "}
                  disponibles
                </p>
              </div>
            </div>

            <button
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
              onClick={() => setShowStatusModal(true)}
              aria-label="Crear nueva pregunta"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Nueva Pregunta
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
                  placeholder="Buscar preguntas..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Buscar preguntas"
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
            {/* Category filter */}
            <div className="relative">
              <select
                className="w-full sm:w-auto px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={categoryFilter === null ? "" : categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                aria-label="Filtrar por categoría"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Sort button */}
            <div className="relative" data-sort-dropdown="true">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setShowSortOptions(!showSortOptions)}
                aria-expanded={showSortOptions}
                aria-haspopup="listbox"
                aria-label="Ordenar preguntas"
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
        {(searchTerm || categoryFilter !== null) && (
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Filtros activos:
            </span>
            {searchTerm && (
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
            )}
            {categoryFilter !== null && (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-3 py-1 flex items-center">
                <span>
                  Categoría:{" "}
                  {categories.find((cat) => cat.id === categoryFilter)?.name ||
                    "Desconocida"}
                </span>
                <button
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                  onClick={() => setCategoryFilter(null)}
                  aria-label="Eliminar filtro de categoría"
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* FAQ table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {isInitialLoading ? (
            <LoadingSpinner message="Cargando preguntas frecuentes..." />
          ) : (
            <>
              {/* Table header - visible only on tablet and above */}
              <div
                className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6 hidden sm:block"
                role="row"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 font-medium" role="columnheader">
                    ID
                  </div>
                  <div className="col-span-2 font-medium" role="columnheader">
                    Categoría
                  </div>
                  <div className="col-span-4 font-medium" role="columnheader">
                    Pregunta
                  </div>
                  <div className="col-span-3 font-medium" role="columnheader">
                    Respuesta
                  </div>
                  <div
                    className="col-span-2 text-right font-medium"
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
                    categoryFilter={categoryFilter}
                    onClearFilters={clearFilters}
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
                    de {filteredAndSortedItems.length} preguntas
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {editId !== null ? "Editar Pregunta" : "Nueva Pregunta"}
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
                  ? "Modifica los datos de la pregunta frecuente seleccionada"
                  : "Completa los datos para crear una nueva pregunta frecuente"}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="space-y-4">
                  {/* Categoría */}
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Categoría *
                    </label>
                    <select
                      {...register("categoryId", {
                        required: "La categoría es obligatoria",
                      })}
                      id="categoryId"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      aria-invalid={errors.categoryId ? "true" : "false"}
                      aria-describedby={
                        errors.categoryId ? "category-error" : undefined
                      }
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p
                        id="category-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                        role="alert"
                      >
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  {/* Pregunta */}
                  <div>
                    <label
                      htmlFor="question"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Pregunta *
                    </label>
                    <input
                      {...register("question", {
                        required: "La pregunta es obligatoria",
                        minLength: {
                          value: 5,
                          message:
                            "La pregunta debe tener al menos 5 caracteres",
                        },
                        maxLength: {
                          value: 200,
                          message:
                            "La pregunta no puede exceder los 200 caracteres",
                        },
                      })}
                      id="question"
                      type="text"
                      placeholder="Ej: ¿Cómo puedo realizar un pedido?"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      aria-invalid={errors.question ? "true" : "false"}
                      aria-describedby={
                        errors.question ? "question-error" : undefined
                      }
                    />
                    {errors.question && (
                      <p
                        id="question-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                        role="alert"
                      >
                        {errors.question.message}
                      </p>
                    )}
                  </div>

                  {/* Respuesta */}
                  <div>
                    <label
                      htmlFor="answer"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Respuesta *
                    </label>
                    <textarea
                      {...register("answer", {
                        required: "La respuesta es obligatoria",
                        minLength: {
                          value: 10,
                          message:
                            "La respuesta debe tener al menos 10 caracteres",
                        },
                        maxLength: {
                          value: 1000,
                          message:
                            "La respuesta no puede exceder los 1000 caracteres",
                        },
                      })}
                      id="answer"
                      rows={5}
                      placeholder="Escribe aquí la respuesta detallada..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      aria-invalid={errors.answer ? "true" : "false"}
                      aria-describedby={
                        errors.answer ? "answer-error" : undefined
                      }
                    />
                    {errors.answer && (
                      <p
                        id="answer-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400"
                        role="alert"
                      >
                        {errors.answer.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Caracteres: {answerValue.length}/1000
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
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
                    disabled={isLoading}
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
                      "Actualizar Pregunta"
                    ) : (
                      "Crear Pregunta"
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

export default FaqPage;
