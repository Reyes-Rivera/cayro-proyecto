"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Loader2,
  Save,
  Trash,
  Tag,
  Plus,
  AlertCircle,
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
  Check,
  Sparkles,
  Filter,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";
import {
  createFaqs,
  deleteFaqs,
  getCategoriesFaqs,
  getFaqs,
  updateFaqs,
} from "@/api/faqs";

interface Category {
  id: number;
  name: string;
}

interface DataForm {
  id: number;
  categoryId: number;
  question: string;
  answer: string;
  category?: string; // For display purposes
}

interface FormData {
  categoryId: number;
  question: string;
  answer: string;
}

// Opciones de ordenación
type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Más recientes", value: "id", direction: "desc" },
  { label: "Más antiguos", value: "id", direction: "asc" },
  { label: "Pregunta (A-Z)", value: "question", direction: "asc" },
  { label: "Pregunta (Z-A)", value: "question", direction: "desc" },
];

const FaqPage = () => {
  const [items, setItems] = useState<DataForm[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

  // Estado para ordenación
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (editId !== null) {
        setIsLoading(true);
        const updatedItem = await updateFaqs(editId, data);
        if (updatedItem) {
          Swal.fire({
            icon: "success",
            title: "Pregunta actualizada",
            text: "La pregunta ha sido actualizada exitosamente.",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          // Find category name
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
          setIsLoading(false);
          setEditId(null);
          reset();
          setIsModalOpen(false);
          return;
        }
        setIsLoading(false);
        setEditId(null);
      } else {
        setIsLoading(true);
        const newItem = await createFaqs({
          ...data,
          categoryId: +data.categoryId,
        });
        if (newItem) {
          Swal.fire({
            icon: "success",
            title: "Pregunta agregada",
            text: "La pregunta ha sido agregada exitosamente.",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          // Find category name
          const categoryName =
            categories.find((cat) => cat.id === data.categoryId)?.name || "";

          setItems((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              categoryId: data.categoryId,
              question: data.question,
              answer: data.answer,
              category: categoryName,
            },
          ]);
          setIsLoading(false);
          reset();
          setIsModalOpen(false);
          return;
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Ha ocurrido un error",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleEdit = (faq: DataForm) => {
    setValue("categoryId", faq.categoryId);
    setValue("question", faq.question);
    setValue("answer", faq.answer);
    setEditId(faq.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (faq: DataForm) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás la pregunta "${faq.question}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1F2937"
        : "#FFFFFF",
      color: document.documentElement.classList.contains("dark")
        ? "#F3F4F6"
        : "#111827",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteFaqs(faq.id);
        if (response) {
          setItems((prev) => prev.filter((item) => item.id !== faq.id));

          Swal.fire({
            title: "Eliminado",
            text: `La pregunta ha sido eliminada.`,
            icon: "success",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error("No se pudo eliminar la pregunta.");
        }
      } catch (error: any) {
        setIsLoading(false);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "Ha ocurrido un error al eliminar la pregunta",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getFaqs();
      const categoriesRes = await getCategoriesFaqs();

      // Add category name to each FAQ
      const itemsWithCategory = res.data.map((item: DataForm) => {
        const category = categoriesRes.data.find(
          (cat: Category) => cat.id === item.categoryId
        );
        return {
          ...item,
          category: (category as unknown as Category)?.name || "Sin categoría",
        };
      });

      setItems(itemsWithCategory);
      setCategories(categoriesRes.data);

      setTimeout(() => {
        setIsRefreshing(false);
      }, 600); // Pequeña demora para mostrar la animación
    } catch (error) {
      setIsRefreshing(false);
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
      }
    }
  };

  // Filtrar y ordenar preguntas
  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === null || item.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
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

  // Cálculo de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Limpiar búsqueda y filtros
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setCurrentPage(1);
  };

  // Abrir modal para agregar nueva pregunta
  const openAddModal = () => {
    setEditId(null);
    reset();
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    reset();
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsInitialLoading(true);
      try {
        const res = await getFaqs();
        const categoriesRes = await getCategoriesFaqs();

        // Add category name to each FAQ
        const itemsWithCategory = res.data.map((item: DataForm) => {
          const category = categoriesRes.data.find(
            (cat: Category) => cat.id === item.categoryId
          );
          return {
            ...item,
            category:
              (category as Category | undefined)?.name || "Sin categoría",
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

  // Resetear a la primera página cuando cambia el término de búsqueda o filtro de categoría
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  // Cerrar el dropdown de ordenación cuando se hace clic fuera
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
    <motion.div
      className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gray-50 dark:bg-gray-900 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Encabezado de Página */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 opacity-10 dark:opacity-20 rounded-xl sm:rounded-2xl md:rounded-3xl"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-white">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Preguntas Frecuentes
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 max-w-2xl">
                    Administra las preguntas frecuentes para ayudar a tus
                    usuarios a encontrar respuestas rápidamente a sus dudas más
                    comunes.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 w-full md:w-auto"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Nueva Pregunta</span>
              </motion.button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>
        </div>
      </motion.div>

      {/* Tabla de Preguntas Frecuentes */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Barra de búsqueda y filtros */}
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
          <div className="relative flex-grow max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar preguntas..."
              className="pl-10 pr-10 py-2 sm:py-3 w-full border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filtro de categoría */}
            <div className="relative">
              <select
                className="pl-3 pr-8 py-2 sm:py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm text-sm appearance-none"
                value={categoryFilter === null ? "" : categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Dropdown de ordenación */}
            <div className="relative" data-sort-dropdown="true">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm text-sm"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden xs:inline">Ordenar</span>
                {showSortOptions ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </motion.button>

              <AnimatePresence>
                {showSortOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 sm:w-56 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 z-10 overflow-hidden"
                  >
                    <div className="py-2">
                      {sortOptions.map((option) => (
                        <motion.button
                          key={`${option.value}-${option.direction}`}
                          whileHover={{
                            backgroundColor:
                              sortBy.value === option.value &&
                              sortBy.direction === option.direction
                                ? "rgba(37, 99, 235, 0.1)"
                                : "rgba(243, 244, 246, 0.5)",
                          }}
                          onClick={() => {
                            setSortBy(option);
                            setShowSortOptions(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm ${
                            sortBy.value === option.value &&
                            sortBy.direction === option.direction
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          <div className="flex items-center">
                            {sortBy.value === option.value &&
                            sortBy.direction === option.direction ? (
                              <Check className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <div className="w-4 h-4 mr-2" /> // Empty space for alignment
                            )}
                            <span>{option.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span className="sr-only">Refrescar</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sr-only">Filtrar</span>
            </motion.button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-800/50 p-1.5 rounded-lg">
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
              {filteredAndSortedItems.length}{" "}
              {filteredAndSortedItems.length === 1 ? "pregunta" : "preguntas"}{" "}
              en total
            </span>
          </div>

          <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
            {searchTerm || categoryFilter !== null
              ? `Mostrando resultados filtrados`
              : "Mostrando todas las preguntas"}
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="overflow-x-auto">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-4">
                Cargando preguntas frecuentes...
              </p>
            </div>
          ) : (
            <div className="min-h-[300px] sm:min-h-[400px]">
              {currentItems.length > 0 ? (
                <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
                  <AnimatePresence>
                    {currentItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                            <div className="flex items-center gap-2">
                              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-1.5 sm:p-2 rounded-lg shadow-md">
                                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </div>
                              <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                                #{item.id}
                              </span>
                              <span className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                {item.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(item)}
                                className="bg-amber-100 dark:bg-amber-900/30 p-1.5 sm:p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                                title="Editar pregunta"
                              >
                                <Edit
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(item)}
                                className="bg-red-100 dark:bg-red-900/30 p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                title="Eliminar pregunta"
                              >
                                <Trash
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                title="Más opciones"
                              >
                                <MoreHorizontal
                                  size={16}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </motion.button>
                            </div>
                          </div>

                          <div className="mt-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                              {item.question}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6 text-center"
                >
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-full mb-4">
                    <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 dark:text-blue-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {searchTerm || categoryFilter !== null
                      ? `No se encontraron resultados para los filtros aplicados`
                      : "No hay preguntas frecuentes disponibles"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md">
                    {searchTerm || categoryFilter !== null
                      ? "Intenta con otros términos de búsqueda o limpia los filtros para ver todas las preguntas"
                      : "Añade preguntas frecuentes para ayudar a tus usuarios a encontrar respuestas rápidamente"}
                  </p>
                  {searchTerm || categoryFilter !== null ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm flex items-center gap-2 text-sm"
                    >
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Limpiar filtros
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openAddModal}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-md transition-colors flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Añadir Pregunta
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Paginación */}
        {filteredAndSortedItems.length > 0 && (
          <motion.div
            variants={fadeIn}
            className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-gray-500 dark:text-gray-400">Mostrar</span>
              <select
                className="border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm p-1 sm:p-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <span className="text-gray-500 dark:text-gray-400">
                por página
              </span>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, filteredAndSortedItems.length)} de{" "}
              {filteredAndSortedItems.length} preguntas
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>

              <div className="flex items-center text-xs sm:text-sm">
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md sm:rounded-lg text-blue-700 dark:text-blue-400 font-medium">
                  {currentPage}
                </span>
                <span className="mx-1 text-gray-500 dark:text-gray-400">
                  de
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {totalPages || 1}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 dark:border-gray-600 rounded-md sm:rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => paginate(currentPage + 1)}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal para agregar/editar pregunta */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 overflow-hidden backdrop-blur-sm z-30"
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
                onClick={closeModal}
              >
                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
              </motion.div>

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="inline-block w-full max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all relative z-10"
                style={{
                  backgroundColor: document.documentElement.classList.contains(
                    "dark"
                  )
                    ? "#1f2937"
                    : "#ffffff",
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
                <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

                {/* Encabezado del modal */}
                <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6 text-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
                      {editId !== null ? (
                        <>
                          <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          Editar Pregunta Frecuente
                        </>
                      ) : (
                        <>
                          <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          Agregar Pregunta Frecuente
                        </>
                      )}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeModal}
                      className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Contenido del modal */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="relative p-4 sm:p-6"
                >
                  <div className="space-y-4">
                    {/* Categoría */}
                    <div>
                      <label
                        htmlFor="categoryId"
                        className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Categoría
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <select
                          {...register("categoryId", {
                            required: "La categoría es obligatoria",
                          })}
                          id="categoryId"
                          className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm appearance-none"
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        {errors.categoryId && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.categoryId && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                        >
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.categoryId.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Pregunta */}
                    <div>
                      <label
                        htmlFor="question"
                        className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Pregunta
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
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
                          className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                        />
                        {errors.question && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.question && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                        >
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.question.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Respuesta */}
                    <div>
                      <label
                        htmlFor="answer"
                        className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Respuesta
                      </label>
                      <div className="relative">
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
                          className="w-full py-2 sm:py-3 px-4 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                        />
                        {errors.answer && (
                          <div className="absolute top-2 right-2 flex items-center pointer-events-none">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.answer && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                        >
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          {errors.answer.message}
                        </motion.p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Caracteres: {watch("answer")?.length || 0}/1000
                      </p>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="mt-6 sm:mt-8 flex justify-end gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={closeModal}
                      className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-xs sm:text-sm"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-md transition-all flex items-center gap-1 sm:gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-3.5 w-3.5 sm:h-5 sm:w-5" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                          <span>
                            {editId !== null ? "Actualizar" : "Agregar"}
                          </span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FaqPage;
