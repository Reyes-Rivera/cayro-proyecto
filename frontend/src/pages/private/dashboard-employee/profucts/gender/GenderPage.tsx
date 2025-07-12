"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Loader2,
  Trash,
  Users,
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
} from "lucide-react";
import {
  addGender,
  deleteGender,
  getGenders,
  updateGender,
} from "@/api/products";
import { useNavigate } from "react-router-dom";
import { AlertHelper } from "@/utils/alert.util";

interface Gender {
  id: number;
  name: string;
}

interface FormData {
  name: string;
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
  { label: "Nombre (A-Z)", value: "name", direction: "asc" },
  { label: "Nombre (Z-A)", value: "name", direction: "desc" },
];

const GenderPage = () => {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

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
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (editId !== null) {
        setIsLoading(true);
        const updatedGender = await updateGender(editId, data);
        if (updatedGender) {
          AlertHelper.success({
            title: "Género actualizado",
            message: "El género ha sido actualizado exitosamente.",
            animation: "slideIn",
            timer: 3000,
          });
          setGenders((prev) =>
            prev.map((cat) =>
              cat.id === editId ? { ...cat, name: data.name } : cat
            )
          );
          setIsLoading(false);
          setEditId(null);
          reset();
          setShowStatusModal(false);
          return;
        }
        setIsLoading(false);
        setEditId(null);
      } else {
        setIsLoading(true);
        const newGender = await addGender(data);
        if (newGender) {
          AlertHelper.success({
            title: "Género agregado",
            message: "El género ha sido agregado exitosamente.",
            animation: "slideIn",
            timer: 3000,
          });

          setGenders((prev) => [
            ...prev,
            { id: prev.length + 1, name: data.name },
          ]);
          setIsLoading(false);
          reset();
          setShowStatusModal(false);
          return;
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
        return;
      }
      AlertHelper.error({
        title: "Error al agregar genero",
        message: error.response?.data?.message || "Ha ocurrido un error",
        animation: "slideIn",
        timer: 3000,
      });
    }
  };

  const handleEdit = (gender: Gender) => {
    setValue("name", gender.name);
    setEditId(gender.id);
    setShowStatusModal(true);
  };

  const handleDelete = async (gender: Gender) => {
    const result = await AlertHelper.confirm({
      title: "¿Estás seguro?",
      message: `Eliminarás el género "${gender.name}". Esta acción no se puede deshacer.`,
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "warning",
      animation: "bounce",
    });

    if (result) {
      try {
        const response = await deleteGender(gender.id);
        if (response) {
          setGenders((prev) => prev.filter((cat) => cat.id !== gender.id));

          AlertHelper.success({
            title: "Eliminado",
            message: `El género "${gender.name}" ha sido eliminado.`,
            animation: "slideIn",
          });
        } else {
          throw new Error("No se pudo eliminar el género.");
        }
      } catch (error: any) {
        setIsLoading(false);
        AlertHelper.error({
          title: "Error",
          message: error.response?.data?.message || "Ha ocurrido un error",
          animation: "fadeIn",
        });
      }
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getGenders();
      setGenders(res.data);
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

  // Filtrar y ordenar géneros
  const filteredAndSortedGenders = genders
    .filter((gender) =>
      gender.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy.value as keyof Gender];
      const bValue = b[sortBy.value as keyof Gender];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortBy.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortBy.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // Cálculo de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedGenders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedGenders.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowStatusModal(false);
    setEditId(null);
    reset();
  };

  useEffect(() => {
    const fetchGenders = async () => {
      setIsInitialLoading(true);
      try {
        const res = await getGenders();
        setGenders(res.data);
      } catch (error) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
        }
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchGenders();
  }, [navigate]);

  // Resetear a la primera página cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header section - Siguiendo el estilo de marcas */}
      <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative mb-6">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>

        <div className="p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Gestión de Géneros
                </h2>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                  {genders.length} {genders.length === 1 ? "género" : "géneros"}{" "}
                  en el catálogo
                </p>
              </div>
            </div>
            <button
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              onClick={() => setShowStatusModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Género
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
        {/* Toolbar - Siguiendo el estilo de marcas */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-6">
          {/* Search bar with button */}
          <div className="relative flex-grow max-w-full md:max-w-md">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar géneros..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              <button
                onClick={() => {}} // La búsqueda es en tiempo real
                className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter and sort buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Sort button */}
            <div className="relative" data-sort-dropdown="true">
              <button
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

              <AnimatePresence>
                {showSortOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-40"
                  >
                    <div className="p-2">
                      {sortOptions.map((option) => (
                        <button
                          key={`${option.value}-${option.direction}`}
                          onClick={() => {
                            setSortBy(option);
                            setShowSortOptions(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            sortBy.value === option.value &&
                            sortBy.direction === option.direction
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
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
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-5 m-auto h-5 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
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
                className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={() => setSearchTerm("")}
                aria-label="Eliminar filtro de búsqueda"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Genders table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Cargando géneros...
              </p>
            </div>
          ) : (
            <>
              {/* Table header - visible only on tablet and above */}
              <div className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6 hidden sm:block">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 font-medium">ID</div>
                  <div className="col-span-6 font-medium">Nombre</div>
                  <div className="col-span-4 text-right font-medium">
                    Acciones
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
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
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
                            className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                            title="Editar género"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                            title="Eliminar género"
                          >
                            <Trash className="h-4 w-4" />
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
                            className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                            title="Editar género"
                            aria-label="Editar género"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                            title="Eliminar género"
                            aria-label="Eliminar género"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {searchTerm
                        ? "No se encontraron géneros"
                        : "No hay géneros"}
                    </p>
                    <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "No hay géneros que coincidan con la búsqueda"
                        : "Comienza creando un nuevo género"}
                    </p>
                    <div className="mt-6">
                      {searchTerm ? (
                        <button
                          onClick={clearSearch}
                          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Limpiar búsqueda
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowStatusModal(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" />
                          Nuevo Género
                        </button>
                      )}
                    </div>
                  </div>
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
                      className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
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
                    Mostrando {indexOfFirstItem + 1} a{" "}
                    {Math.min(indexOfLastItem, filteredAndSortedGenders.length)}{" "}
                    de {filteredAndSortedGenders.length} géneros
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
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
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                      aria-label="Página siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal - Siguiendo el estilo del componente de marcas */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editId !== null ? "Editar Género" : "Nuevo Género"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {editId !== null
                  ? "Modifica el nombre del género seleccionado"
                  : "Ingresa el nombre del nuevo género para tu catálogo"}
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Nombre del género *
                  </label>
                  <input
                    {...register("name", {
                      required: "El nombre del género es obligatorio",
                      minLength: {
                        value: 3,
                        message:
                          "El nombre del género debe tener al menos 3 caracteres",
                      },
                      maxLength: {
                        value: 50,
                        message:
                          "El nombre del género no puede exceder los 50 caracteres",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/,
                        message:
                          "El nombre del género solo puede contener letras y números.",
                      },
                    })}
                    type="text"
                    placeholder="Ej: Masculino, Femenino, Unisex..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : editId !== null ? (
                      "Actualizar Género"
                    ) : (
                      "Crear Género"
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

export default GenderPage;
