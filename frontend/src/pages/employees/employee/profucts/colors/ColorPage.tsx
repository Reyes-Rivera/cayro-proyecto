"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Edit,
  Loader2,
  Save,
  Trash,
  Upload,
  Palette,
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
import { addColor, deleteColor, getColors, updateColor } from "@/api/products";
import { useNavigate } from "react-router-dom";
import colorsImg from "./assets/paleta-de-color.png";

interface DataForm {
  id: number;
  name: string;
  hexValue: string;
}

interface FormData {
  name: string;
  image?: FileList;
  hexValue: string;
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

const ColorPage = () => {
  const [items, setItems] = useState<DataForm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
    clearErrors,
    watch,
  } = useForm<FormData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (!data.hexValue) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El valor hexadecimal es obligatorio.",
          confirmButtonColor: "#3B82F6",
        });
        return;
      }

      if (editId !== null) {
        setIsLoading(true);
        const updatedItem = await updateColor(editId, {
          name: data.name,
          hexValue: data.hexValue,
        });
        if (updatedItem) {
          Swal.fire({
            icon: "success",
            title: "Color actualizado",
            text: "El color ha sido actualizado exitosamente.",
            confirmButtonColor: "#3B82F6",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          setItems((prev) =>
            prev.map((cat) =>
              cat.id === editId
                ? {
                    ...cat,
                    name: data.name.trim(),
                    hexValue: data.hexValue.trim(),
                  }
                : cat
            )
          );
          setIsLoading(false);
          setEditId(null);
          reset();
          setPreviewImage(null);
          setIsModalOpen(false);
          return;
        }
        setIsLoading(false);
        setEditId(null);
      } else {
        setIsLoading(true);
        const newItem = await addColor({
          name: data.name.trim(),
          hexValue: data.hexValue.trim(),
        });
        if (newItem) {
          Swal.fire({
            icon: "success",
            title: "Color agregado",
            text: "El color ha sido agregado exitosamente.",
            confirmButtonColor: "#3B82F6",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          setItems((prev) => [
            ...prev,
            { id: prev.length + 1, name: data.name, hexValue: data.hexValue },
          ]);
          setIsLoading(false);
          reset();
          setPreviewImage(null);
          setIsModalOpen(false);
          return;
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error?.response?.status === 500) {
        navigate("/500", { state: { fromError: true } });
        return;
      }
      if (error?.response?.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message,
          confirmButtonColor: "#3B82F6",
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al procesar la solicitud. Inténtalo de nuevo.",
        confirmButtonColor: "#3B82F6",
      });
    }
  };

  const handleEdit = (color: DataForm) => {
    setValue("name", color.name);
    setValue("hexValue", color.hexValue);
    setEditId(color.id);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (color: DataForm) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás el color "${color.name}". Esta acción no se puede deshacer.`,
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
        const response = await deleteColor(color.id);
        if (response) {
          setItems((prev) => prev.filter((cat) => cat.id !== color.id));

          Swal.fire({
            title: "Eliminado",
            text: `El color "${color.name}" ha sido eliminado.`,
            icon: "success",
            confirmButtonColor: "#3B82F6",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error("No se pudo eliminar el color.");
        }
      } catch (error: any) {
        setIsLoading(false);
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "Ocurrió un problema al eliminar el color. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const extractDominantColor = (imageFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas."));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
        const colorCounts: { [key: string]: number } = {};

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const hex = rgbToHex(r, g, b);

          if (colorCounts[hex]) {
            colorCounts[hex]++;
          } else {
            colorCounts[hex] = 1;
          }
        }

        const dominantColor = Object.keys(colorCounts).reduce((a, b) =>
          colorCounts[a] > colorCounts[b] ? a : b
        );

        resolve(dominantColor);
      };

      reader.onerror = () => {
        reject(new Error("Error al leer la imagen."));
      };

      reader.readAsDataURL(imageFile);
    });
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const hex = await extractDominantColor(file); // Extraer el color dominante
        setValue("hexValue", hex);
        clearErrors("hexValue");
      } catch (error) {
        console.error("Error al extraer el color dominante:", error);
        setValue("hexValue", ""); // Limpiar el valor hexadecimal en caso de error
      }
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getColors();
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

  // Filtrar y ordenar colores
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

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Abrir modal para agregar nuevo color
  const openAddModal = () => {
    setEditId(null);
    reset();
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    reset();
    setPreviewImage(null);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getColors();
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
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Colores</h1>
              <p className="text-gray-600">
                Administra los colores de los productos de tu catálogo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Colores */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Encabezado de la tabla con gradiente */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <Palette className="w-6 h-6 mr-2" />
                Listado de Colores
              </h1>
              <p className="text-blue-100">
                {filteredAndSortedItems.length}{" "}
                {filteredAndSortedItems.length === 1 ? "color" : "colores"} en
                el catálogo
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Color
            </button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar colores..."
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
                  Color
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                  Código Hex
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
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                          style={{ backgroundColor: item.hexValue }}
                        ></div>
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                        {item.hexValue}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-100 p-2 rounded-lg text-amber-600 hover:bg-amber-200 transition-colors dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                          title="Editar color"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="bg-red-100 p-2 rounded-lg text-red-600 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          title="Eliminar color"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center py-6">
                      <Palette className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {searchTerm
                          ? `No se encontraron resultados para "${searchTerm}"`
                          : "No hay colores disponibles"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {searchTerm
                          ? "Intenta con otro término de búsqueda"
                          : "Añade colores para comenzar a gestionar tu catálogo"}
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
                          Añadir Color
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
              {filteredAndSortedItems.length} colores
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

      {/* Modal para agregar/editar color */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            {/* Modal */}
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Encabezado del modal */}
              <div className="bg-blue-600 p-4 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    {editId !== null ? (
                      <>
                        <Edit className="w-5 h-5" />
                        Editar Color
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Agregar Color
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
                <div className="space-y-6">
                  {/* Imagen del color */}
                  <div className="space-y-2">
                    <label
                      htmlFor="colorImage"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Imagen del color (opcional)
                    </label>

                    <div className="w-32 h-32 relative rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden mx-auto">
                      <img
                        src={previewImage || colorsImg}
                        alt="Vista previa del color"
                        className="w-full h-full object-cover rounded-md p-2"
                      />

                      <label
                        htmlFor="colorImage"
                        className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Upload className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                      </label>

                      <input
                        {...register("image")}
                        id="colorImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {/* Valor Hexadecimal */}
                  <div className="space-y-2">
                    <label
                      htmlFor="hexValue"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Valor Hexadecimal
                    </label>
                    <div className="relative">
                      <input
                        {...register("hexValue", {
                          required: "El valor hexadecimal es obligatorio",
                          pattern: {
                            value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                            message: "El valor hexadecimal no es válido",
                          },
                        })}
                        id="hexValue"
                        type="text"
                        placeholder="#FFFFFF"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none"
                      />
                      {errors.hexValue && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.hexValue && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.hexValue.message}
                      </p>
                    )}
                    {/* Muestra de color */}
                    {!errors.hexValue && (
                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{
                            backgroundColor: errors.hexValue
                              ? "#FFFFFF"
                              : watch("hexValue") || "#FFFFFF",
                          }}
                        ></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Vista previa del color
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Nombre del color */}
                  <div className="space-y-2">
                    <label
                      htmlFor="colorName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nombre del color
                    </label>
                    <div className="relative">
                      <input
                        {...register("name", {
                          required: "El nombre del color es obligatorio",
                          minLength: {
                            value: 1,
                            message:
                              "El nombre del color debe tener al menos un caracter",
                          },
                          maxLength: {
                            value: 50,
                            message:
                              "El nombre del color no puede exceder los 50 caracteres",
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/,
                            message:
                              "El nombre del color solo puede contener letras y números.",
                          },
                        })}
                        id="colorName"
                        type="text"
                        placeholder="Ej: Rojo, Azul, Verde..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none"
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

export default ColorPage;
