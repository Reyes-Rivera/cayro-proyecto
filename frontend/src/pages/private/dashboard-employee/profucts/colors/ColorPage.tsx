"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Loader2,
  Trash,
  Upload,
  Palette,
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
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { addColor, deleteColor, getColors, updateColor } from "@/api/products";
import { useNavigate } from "react-router-dom";

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

interface ColorSuggestion {
  hex: string;
  percentage: number;
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

const ColorPage = () => {
  const [items, setItems] = useState<DataForm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [colorSuggestions, setColorSuggestions] = useState<ColorSuggestion[]>(
    []
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      if (!data.hexValue) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El valor hexadecimal es obligatorio.",
          confirmButtonColor: "#2563EB",
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
            confirmButtonColor: "#2563EB",
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
          setColorSuggestions([]);
          setShowStatusModal(false);
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
            confirmButtonColor: "#2563EB",
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
          setColorSuggestions([]);
          setShowStatusModal(false);
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
          confirmButtonColor: "#2563EB",
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al procesar la solicitud. Inténtalo de nuevo.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleEdit = (color: DataForm) => {
    setValue("name", color.name);
    setValue("hexValue", color.hexValue);
    setEditId(color.id);
    setPreviewImage(null);
    setColorSuggestions([]);
    setShowStatusModal(true);
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
            confirmButtonColor: "#2563EB",
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

  // Algoritmo mejorado para extraer colores dominantes
  const extractDominantColors = (
    imageFile: File
  ): Promise<ColorSuggestion[]> => {
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

        // Redimensionar imagen para mejor rendimiento
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;
        const colorMap = new Map<string, number>();
        const totalPixels = imageData.length / 4;

        // Analizar cada pixel
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const alpha = imageData[i + 3];

          // Ignorar pixels transparentes
          if (alpha < 128) continue;

          // Ignorar colores muy claros o muy oscuros (probablemente fondo)
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness > 240 || brightness < 15) continue;

          // Agrupar colores similares (reducir precisión)
          const groupedR = Math.round(r / 16) * 16;
          const groupedG = Math.round(g / 16) * 16;
          const groupedB = Math.round(b / 16) * 16;

          const hex = rgbToHex(groupedR, groupedG, groupedB);
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }

        // Obtener los colores más frecuentes
        const sortedColors = Array.from(colorMap.entries())
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6) // Top 6 colores
          .map(([hex, count]) => ({
            hex,
            percentage: Math.round((count / totalPixels) * 100 * 4), // *4 porque cada pixel son 4 valores
            name: getColorName(hex),
          }))
          .filter((color) => color.percentage > 1); // Solo colores que representen más del 1%

        resolve(sortedColors);
      };

      reader.onerror = () => {
        reject(new Error("Error al leer la imagen."));
      };

      reader.readAsDataURL(imageFile);
    });
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  };

  // Función para obtener nombre aproximado del color
  const getColorName = (hex: string): string => {
    const colorNames: { [key: string]: string } = {
      "#FF0000": "Rojo",
      "#00FF00": "Verde",
      "#0000FF": "Azul",
      "#FFFF00": "Amarillo",
      "#FF00FF": "Magenta",
      "#00FFFF": "Cian",
      "#FFA500": "Naranja",
      "#800080": "Púrpura",
      "#FFC0CB": "Rosa",
      "#A52A2A": "Marrón",
      "#808080": "Gris",
      "#000000": "Negro",
      "#FFFFFF": "Blanco",
    };

    // Buscar color más cercano
    let closestColor = "Color personalizado";
    let minDistance = Number.POSITIVE_INFINITY;

    Object.entries(colorNames).forEach(([colorHex, name]) => {
      const distance = getColorDistance(hex, colorHex);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    });

    return minDistance < 50 ? closestColor : "Color personalizado";
  };

  const getColorDistance = (color1: string, color2: string): number => {
    const r1 = Number.parseInt(color1.slice(1, 3), 16);
    const g1 = Number.parseInt(color1.slice(3, 5), 16);
    const b1 = Number.parseInt(color1.slice(5, 7), 16);

    const r2 = Number.parseInt(color2.slice(1, 3), 16);
    const g2 = Number.parseInt(color2.slice(3, 5), 16);
    const b2 = Number.parseInt(color2.slice(5, 7), 16);

    return Math.sqrt(
      Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2)
    );
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

      setIsAnalyzing(true);
      try {
        const suggestions = await extractDominantColors(file);
        setColorSuggestions(suggestions);

        // Auto-seleccionar el color más dominante
        if (suggestions.length > 0) {
          setValue("hexValue", suggestions[0].hex);
          setValue("name", suggestions[0].name);
        }
      } catch (error) {
        console.error("Error al extraer colores:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron extraer los colores de la imagen.",
          confirmButtonColor: "#2563EB",
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const selectSuggestedColor = (suggestion: ColorSuggestion) => {
    setValue("hexValue", suggestion.hex);
    setValue("name", suggestion.name);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getColors();
      setItems(res.data);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600);
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
    setPreviewImage(null);
    setColorSuggestions([]);
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsInitialLoading(true);
      try {
        const res = await getColors();
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
    <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen">
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
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Gestión de Colores
                </h2>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                  {items.length} {items.length === 1 ? "color" : "colores"} en
                  el catálogo
                </p>
              </div>
            </div>
            <button
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              onClick={() => setShowStatusModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Color
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
                  placeholder="Buscar colores..."
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
                className={`w-5 m-auto h-5 ${isRefreshing ? "animate-spin" : ""}`}
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

        {/* Colors table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Cargando colores...
              </p>
            </div>
          ) : (
            <>
              {/* Table header - visible only on tablet and above */}
              <div className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6 hidden sm:block">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 font-medium">Color</div>
                  <div className="col-span-2 font-medium">ID</div>
                  <div className="col-span-4 font-medium">Nombre</div>
                  <div className="col-span-2 font-medium">Hex</div>
                  <div className="col-span-3 text-right font-medium">
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
                        <div className="col-span-1">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                            style={{ backgroundColor: item.hexValue }}
                          ></div>
                        </div>
                        <div className="col-span-2">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
                            {item.id}
                          </span>
                        </div>
                        <div className="col-span-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.name}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border text-gray-600 dark:text-gray-400">
                            {item.hexValue}
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                            title="Editar color"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                            title="Eliminar color"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile View */}
                      <div className="sm:hidden flex flex-col space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                              style={{ backgroundColor: item.hexValue }}
                            ></div>
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                {item.hexValue}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
                            title="Editar color"
                            aria-label="Editar color"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                            title="Eliminar color"
                            aria-label="Eliminar color"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <Palette className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {searchTerm
                        ? "No se encontraron colores"
                        : "No hay colores"}
                    </p>
                    <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "No hay colores que coincidan con la búsqueda"
                        : "Comienza creando un nuevo color"}
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
                          Nuevo Color
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
                    {Math.min(indexOfLastItem, filteredAndSortedItems.length)}{" "}
                    de {filteredAndSortedItems.length} colores
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
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editId !== null ? "Editar Color" : "Nuevo Color"}
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
                  ? "Modifica los datos del color seleccionado"
                  : "Sube una imagen para extraer colores automáticamente o ingresa los datos manualmente"}
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Upload de imagen */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen del producto (opcional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Vista previa"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setColorSuggestions([]);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Subir imagen
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          PNG, JPG, GIF hasta 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Análisis de colores */}
                  {isAnalyzing && (
                    <div className="mt-4 text-center">
                      <div className="inline-flex items-center">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Analizando colores...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Sugerencias de colores */}
                  {colorSuggestions.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Colores detectados (haz clic para seleccionar):
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {colorSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectSuggestedColor(suggestion)}
                            className="flex flex-col items-center p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div
                              className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 mb-1"
                              style={{ backgroundColor: suggestion.hex }}
                            ></div>
                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                              {suggestion.hex}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {suggestion.percentage}%
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Campos del formulario */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="hexValue"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Valor Hexadecimal *
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        {...register("hexValue", {
                          required: "El valor hexadecimal es obligatorio",
                          pattern: {
                            value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                            message:
                              "El valor hexadecimal no es válido (ej: #FF0000)",
                          },
                        })}
                        type="text"
                        placeholder="#FF0000"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        disabled={isLoading}
                      />
                      {watch("hexValue") && (
                        <div
                          className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                          style={{
                            backgroundColor: watch("hexValue") || "#FFFFFF",
                          }}
                        ></div>
                      )}
                    </div>
                    {errors.hexValue && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.hexValue.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Nombre del color *
                    </label>
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
                      type="text"
                      placeholder="Ej: Rojo, Azul marino, Verde lima..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
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
                      "Actualizar Color"
                    ) : (
                      "Crear Color"
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
