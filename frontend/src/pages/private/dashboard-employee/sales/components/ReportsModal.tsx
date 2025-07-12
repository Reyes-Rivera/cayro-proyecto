"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Download,
  Calendar,
  Building,
  MapPin,
  Filter,
  Check,
  Info,
  Package,
  Users,
  Tag,
  Eye,
} from "lucide-react";
import { getBrands, getCategories } from "@/api/products";
import { getEmployees } from "@/api/users";
import { generateSalesReportPDF, previewSalesReportPDF } from "@/api/sales";
import { AlertHelper } from "@/utils/alert.util";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Add the missing prop here
  onGenerateReport: (format: "excel" | "pdf") => Promise<void>;
}

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  city?: string;
  state?: string;
  employeeId?: number;
  brandId?: number;
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  surname: string;
}

const mexicanStates = [
  { value: "", label: "Todos los estados" },
  { value: "AGS", label: "Aguascalientes" },
  { value: "BC", label: "Baja California" },
  { value: "BCS", label: "Baja California Sur" },
  { value: "CAMP", label: "Campeche" },
  { value: "CHIS", label: "Chiapas" },
  { value: "CHIH", label: "Chihuahua" },
  { value: "CDMX", label: "Ciudad de México" },
  { value: "COAH", label: "Coahuila" },
  { value: "COL", label: "Colima" },
  { value: "DGO", label: "Durango" },
  { value: "GTO", label: "Guanajuato" },
  { value: "GRO", label: "Guerrero" },
  { value: "HGO", label: "Hidalgo" },
  { value: "JAL", label: "Jalisco" },
  { value: "MEX", label: "Estado de México" },
  { value: "MICH", label: "Michoacán" },
  { value: "MOR", label: "Morelos" },
  { value: "NAY", label: "Nayarit" },
  { value: "NL", label: "Nuevo León" },
  { value: "OAX", label: "Oaxaca" },
  { value: "PUE", label: "Puebla" },
  { value: "QRO", label: "Querétaro" },
  { value: "QROO", label: "Quintana Roo" },
  { value: "SLP", label: "San Luis Potosí" },
  { value: "SIN", label: "Sinaloa" },
  { value: "SON", label: "Sonora" },
  { value: "TAB", label: "Tabasco" },
  { value: "TAMPS", label: "Tamaulipas" },
  { value: "TLAX", label: "Tlaxcala" },
  { value: "VER", label: "Veracruz" },
  { value: "YUC", label: "Yucatán" },
  { value: "ZAC", label: "Zacatecas" },
];

const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  onGenerateReport,
}) => {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDropdownOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFilters({});
    }
  }, [isOpen]);

  const loadDropdownOptions = async () => {
    setLoadingOptions(true);
    try {
      const [categoriesRes, brandsRes, employeesRes] = await Promise.all([
        getCategories(),
        getBrands(),
        getEmployees(),
      ]);

      setCategories(categoriesRes.data);
      setBrands(brandsRes.data);
      setEmployees(employeesRes.data);
    } catch (error: any) {
      AlertHelper.error({
        title: "Error",
        message:
          error.response?.data?.message ||
          "No se pudieron cargar las opciones. Inténtalo de nuevo.",
        isModal: true,
        animation: "bounce",
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleFilterChange = (
    key: keyof ReportFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== undefined && filter !== ""
  );

  const getFilterDescription = () => {
    const descriptions = [];
    if (filters.startDate) descriptions.push(`Desde: ${filters.startDate}`);
    if (filters.endDate) descriptions.push(`Hasta: ${filters.endDate}`);
    if (filters.categoryId) {
      const category = categories.find((c) => c.id === filters.categoryId);
      descriptions.push(`Categoría: ${category?.name || filters.categoryId}`);
    }
    if (filters.brandId) {
      const brand = brands.find((b) => b.id === filters.brandId);
      descriptions.push(`Marca: ${brand?.name || filters.brandId}`);
    }
    if (filters.employeeId) {
      const employee = employees.find((e) => e.id === filters.employeeId);
      descriptions.push(
        `Empleado: ${
          employee ? `${employee.name} ${employee.surname}` : filters.employeeId
        }`
      );
    }
    if (filters.city) descriptions.push(`Ciudad: ${filters.city}`);
    if (filters.state) {
      const state = mexicanStates.find((s) => s.value === filters.state);
      descriptions.push(`Estado: ${state?.label || filters.state}`);
    }
    return descriptions.length > 0
      ? descriptions.join(" • ")
      : "Sin filtros aplicados";
  };

  const generateFileName = (filters: ReportFilters): string => {
    const date = new Date().toISOString().split("T")[0];
    let fileName = `reporte-ventas-${date}`;
    if (filters.startDate && filters.endDate) {
      fileName += `_${filters.startDate}_${filters.endDate}`;
    } else if (filters.startDate) {
      fileName += `_desde-${filters.startDate}`;
    } else if (filters.endDate) {
      fileName += `_hasta-${filters.endDate}`;
    }
    if (filters.categoryId) {
      fileName += `_cat-${filters.categoryId}`;
    }
    if (filters.city) {
      fileName += `_${filters.city.toLowerCase().replace(/\s+/g, "-")}`;
    }
    return `${fileName}.pdf`;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handlePreviewReport = async () => {
    setIsPreviewing(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined)
      );
      const blob = await previewSalesReportPDF(cleanFilters);
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      AlertHelper.error({
        title: "Error",
        message: error.response?.data?.message || 
          "Hubo un problema al generar la vista previa. Inténtalo de nuevo.",
        isModal: true,
        animation: "bounce",
      });
    } finally {
      setIsPreviewing(false);
    }
  };

const handleGenerateReportClick = async () => {
  const confirmed = await AlertHelper.confirm({
    title: "¿Generar reporte de ventas en PDF?",
    message: `
      <div class="text-left">
        <p><strong>Formato:</strong> PDF (.pdf)</p>
        <p><strong>Filtros aplicados:</strong></p>
        <p class="text-sm text-gray-600 mb-3">${getFilterDescription()}</p>
        <p class="text-xs text-blue-600 mt-2"><strong>Nota:</strong> El reporte incluirá datos agregados como ventas por mes, categoría, empleado y marca.</p>
      </div>
    `,
    confirmText: "Generar PDF",
    cancelText: "Cancelar",
    type: "question",
    animation: "bounce",
  });

  if (!confirmed) return;

  setIsGenerating(true);
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== undefined)
    );
    const blob = await generateSalesReportPDF(cleanFilters);
    const filename = generateFileName(cleanFilters);
    downloadBlob(blob, filename);

    await AlertHelper.success({
      title: "¡Reporte generado!",
      message: `El archivo ${filename} se ha descargado correctamente.`,
      timer: 3000,
      animation: "slideIn",
    });

    onClose();
    clearFilters();
    await onGenerateReport("pdf");
  } catch (error: any) {
    AlertHelper.error({
      title: "Error",
      message: error.response?.data?.message || "Hubo un problema al generar el reporte. Inténtalo de nuevo.",
      isModal: true,
      animation: "bounce",
    });
  } finally {
    setIsGenerating(false);
  }
};


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Generar Reporte de Ventas
                </h2>
                <p className="text-sm text-white/80">
                  Configura los filtros para tu reporte
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Información del reporte */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-400">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-2">📊 El reporte incluirá:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Resumen ejecutivo de ventas</li>
                        <li>Ventas por mes</li>
                        <li>Top productos más vendidos</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Análisis por categoría</li>
                        <li>Rendimiento por empleado</li>
                        <li>Ventas por ciudad</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Análisis por marca</li>
                        <li>Top variantes vendidas</li>
                        <li>Detalle de ventas recientes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Filtros */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-500" />
                Filtros del Reporte
                {loadingOptions && (
                  <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                )}
              </h3>
              {/* Resumen de filtros seleccionados */}
              {hasActiveFilters && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Filtros aplicados al reporte:
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {getFilterDescription()}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Fechas */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
                {/* Categoría */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    Categoría
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.categoryId || ""}
                    onChange={(e) =>
                      handleFilterChange("categoryId", Number(e.target.value))
                    }
                    disabled={loadingOptions}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Marca */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Marca
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.brandId || ""}
                    onChange={(e) =>
                      handleFilterChange("brandId", Number(e.target.value))
                    }
                    disabled={loadingOptions}
                  >
                    <option value="">Todas las marcas</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Empleado */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Empleado
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.employeeId || ""}
                    onChange={(e) =>
                      handleFilterChange("employeeId", Number(e.target.value))
                    }
                    disabled={loadingOptions}
                  >
                    <option value="">Todos los empleados</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} {employee.surname}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Ubicación */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Ciudad"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.city || ""}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Estado
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.state || ""}
                    onChange={(e) =>
                      handleFilterChange("state", e.target.value)
                    }
                  >
                    {mexicanStates.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex justify-between items-center">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar filtros
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {
                      Object.values(filters).filter(
                        (f) => f !== undefined && f !== ""
                      ).length
                    }{" "}
                    filtros activos
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 El reporte PDF incluye gráficos y análisis detallado
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isGenerating || isPreviewing}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePreviewReport}
                disabled={isGenerating || isPreviewing || loadingOptions}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isPreviewing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cargando...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Vista Previa
                  </>
                )}
              </button>
              <button
                onClick={handleGenerateReportClick} // Changed to handle internal logic before calling prop
                disabled={isGenerating || isPreviewing || loadingOptions}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generar PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportsModal;
