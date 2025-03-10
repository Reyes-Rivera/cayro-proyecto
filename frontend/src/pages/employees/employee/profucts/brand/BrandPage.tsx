"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { addBrand, deleteBrand, getBrands, updateBrand } from "@/api/products";
import { useNavigate } from "react-router-dom";

interface DataForm {
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

const BrandPage = () => {
  const [items, setItems] = useState<DataForm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const updatedItem = await updateBrand(editId, data);
        if (updatedItem) {
          Swal.fire({
            icon: "success",
            title: "Marca actualizada",
            text: "La marca ha sido actualizada exitosamente.",
            confirmButtonColor: "#3B82F6",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          setItems((prev) =>
            prev.map((cat) =>
              cat.id === editId ? { ...cat, name: data.name } : cat
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
        const newItem = await addBrand(data);
        if (newItem) {
          Swal.fire({
            icon: "success",
            title: "Marca agregada",
            text: "La marca ha sido agregada exitosamente.",
            confirmButtonColor: "#3B82F6",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          setItems((prev) => [
            ...prev,
            { id: prev.length + 1, name: data.name },
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
        confirmButtonColor: "#3B82F6",
      });
    }
  };

  const handleEdit = (brand: DataForm) => {
    setValue("name", brand.name);
    setEditId(brand.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (brand: DataForm) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás la marca "${brand.name}". Esta acción no se puede deshacer.`,
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
        const response = await deleteBrand(brand.id);
        if (response) {
          setItems((prev) => prev.filter((cat) => cat.id !== brand.id));

          Swal.fire({
            title: "Eliminado",
            text: `La marca "${brand.name}" ha sido eliminada.`,
            icon: "success",
            confirmButtonColor: "#3B82F6",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error("No se pudo eliminar la marca.");
        }
      } catch (error:any) {
        setIsLoading(false);
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getBrands();
      setItems(res.data);
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

  // Filtrar y ordenar marcas
  const filteredAndSortedItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy.value as keyof DataForm];
      const bValue = b[sortBy.value as keyof DataForm];

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
  const currentItems = filteredAndSortedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Ir a la primera página


  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Abrir modal para agregar nueva marca
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
      try {
        const res = await getBrands();
        setItems(res.data);
      } catch (error) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
        }
      }
    };
    fetchItems();
  }, [navigate]);

  // Resetear a la primera página cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-6 space-y-8">
      {/* Encabezado de Página */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className=" p-6 ">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Marcas</h1>
              <p className="text-gray-600">
                Administra las marcas de los productos de tu catálogo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Marcas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Encabezado de la tabla con gradiente */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <Tag className="w-6 h-6 mr-2" />
                Listado de Marcas
              </h1>
              <p className="text-blue-100">
                {filteredAndSortedItems.length}{" "}
                {filteredAndSortedItems.length === 1 ? "marca" : "marcas"} en el
                catálogo
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Marca
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar marcas..."
              className="pl-10 pr-10 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Dropdown de ordenación */}
            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
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

            <button
              onClick={refreshData}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="sr-only">Refrescar</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-50 dark:bg-indigo-900/30">
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                  Marca
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-indigo-50/30 dark:bg-indigo-900/10"
                    } hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                        #{item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-100 p-2 rounded-lg text-amber-600 hover:bg-amber-200 transition-colors dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                          title="Editar marca"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="bg-red-100 p-2 rounded-lg text-red-600 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          title="Eliminar marca"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center py-6">
                      <Tag className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {searchTerm
                          ? `No se encontraron resultados para "${searchTerm}"`
                          : "No hay marcas disponibles"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm
                          ? "Intenta con otro término de búsqueda"
                          : "Añade marcas para comenzar a gestionar tu catálogo"}
                      </p>
                      {searchTerm ? (
                        <button
                          onClick={clearSearch}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Limpiar búsqueda
                        </button>
                      ) : (
                        <button
                          onClick={openAddModal}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Añadir Marca
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
        {filteredAndSortedItems.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Mostrar
              </span>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
              <span className="text-sm text-gray-500 dark:text-gray-400">
                por página
              </span>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, filteredAndSortedItems.length)} de{" "}
              {filteredAndSortedItems.length} marcas
            </div>

            <div className="flex items-center space-x-2">
              
              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-md text-sm text-blue-700 dark:text-blue-400 font-medium">
                  {currentPage}
                </span>
                <span className="mx-1 text-gray-500 dark:text-gray-400">
                  de
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {totalPages || 1}
                </span>
              </div>

              <button
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => paginate(currentPage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
             
            </div>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar marca */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto ">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 transition-opacity "
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal */}
            <div className="inline-block  align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Encabezado del modal */}
              <div className="bg-blue-600 p-4 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {editId !== null ? (
                      <>
                        <Edit className="w-5 h-5" />
                        Editar Marca
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Agregar Marca
                      </>
                    )}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenido del modal */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="space-y-4">
                  <label
                    htmlFor="brandName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nombre de la marca
                  </label>
                  <div className="relative">
                    <input
                      {...register("name", {
                        required: "El nombre de la marca es obligatorio",
                        minLength: {
                          value: 1,
                          message:
                            "El nombre de la marca debe tener al menos un caracter",
                        },
                        maxLength: {
                          value: 50,
                          message:
                            "El nombre de la marca no puede exceder los 50 caracteres",
                        },
                        pattern: {
                          value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/,
                          message:
                            "El nombre de la marca solo puede contener letras y números.",
                        },
                      })}
                      id="brandName"
                      type="text"
                      placeholder="Ej: Nike, Adidas, Puma..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none"
                      autoFocus
                    />
                    {errors.name && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>
                          {editId !== null ? "Actualizar" : "Agregar"}
                        </span>
                      </>
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

export default BrandPage;
