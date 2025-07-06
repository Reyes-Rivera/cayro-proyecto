"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Download,
  Calendar,
  DollarSign,
  Hash,
  Mail,
  User,
  Building,
  MapPin,
  Filter,
  FileSpreadsheet,
  Check,
  Info,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (
    filters: ReportFilters,
    format: "excel" | "pdf"
  ) => Promise<void>;
}

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  employeeId?: number;
  userId?: number;
  minTotal?: number;
  maxTotal?: number;
  reference?: string;
  clientName?: string;
  clientEmail?: string;
  city?: string;
  state?: string;
  status?: string;
}

const statusOptions = [
  { value: "", label: "Todos los estados" },
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  onGenerateReport,
}) => {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"excel" | "pdf">(
    "excel"
  );

  // Limpiar filtros al cerrar
  useEffect(() => {
    if (!isOpen) {
      setFilters({});
      setSelectedFormat("excel");
    }
  }, [isOpen]);

  // Manejar cambios de filtros
  const handleFilterChange = (
    key: keyof ReportFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({});
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== undefined && filter !== ""
  );

  // Obtener descripción de filtros
  const getFilterDescription = () => {
    const descriptions = [];
    if (filters.startDate) descriptions.push(`Desde: ${filters.startDate}`);
    if (filters.endDate) descriptions.push(`Hasta: ${filters.endDate}`);
    if (filters.status) descriptions.push(`Estado: ${filters.status}`);
    if (filters.minTotal) descriptions.push(`Monto mín: $${filters.minTotal}`);
    if (filters.maxTotal) descriptions.push(`Monto máx: $${filters.maxTotal}`);
    if (filters.reference)
      descriptions.push(`Referencia: ${filters.reference}`);
    if (filters.clientName) descriptions.push(`Cliente: ${filters.clientName}`);
    if (filters.clientEmail) descriptions.push(`Email: ${filters.clientEmail}`);
    if (filters.city) descriptions.push(`Ciudad: ${filters.city}`);
    if (filters.state) descriptions.push(`Estado: ${filters.state}`);

    return descriptions.length > 0
      ? descriptions.join(" • ")
      : "Sin filtros aplicados";
  };

  const handleGenerateReport = async () => {
    const result = await Swal.fire({
      title: "¿Generar reporte de ventas?",
      html: `
        <div class="text-left">
          <p><strong>Formato:</strong> ${
            selectedFormat === "excel" ? "Excel (.xlsx)" : "PDF (.pdf)"
          }</p>
          <p><strong>Filtros aplicados:</strong></p>
          <p class="text-sm text-gray-600 mb-3">${getFilterDescription()}</p>
          <p class="text-xs text-blue-600 mt-2"><strong>Nota:</strong> El reporte incluirá datos agregados como ventas por mes y por categoría.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Generar ${selectedFormat.toUpperCase()}`,
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      setIsGenerating(true);
      try {
        await onGenerateReport(filters, selectedFormat);
        onClose();
        clearFilters();
      } catch (error) {
        console.error("Error generating report:", error);
      } finally {
        setIsGenerating(false);
      }
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
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
                  Configura los filtros y formato para tu reporte
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Resumen total de ventas</li>
                        <li>Total de productos vendidos</li>
                        <li>Ventas agrupadas por mes</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ventas agrupadas por categoría</li>
                        <li>Datos filtrados según criterios</li>
                        <li>Formato Excel o PDF</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formato del reporte */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Download className="w-5 h-5 mr-2 text-green-500" />
                Formato del Reporte
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="format"
                    value="excel"
                    checked={selectedFormat === "excel"}
                    onChange={(e) =>
                      setSelectedFormat(e.target.value as "excel" | "pdf")
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFormat === "excel"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Excel (.xlsx)
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ideal para análisis de datos y cálculos
                        </p>
                      </div>
                      {selectedFormat === "excel" && (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 ml-auto" />
                      )}
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={selectedFormat === "pdf"}
                    onChange={(e) =>
                      setSelectedFormat(e.target.value as "excel" | "pdf")
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFormat === "pdf"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-red-600 dark:text-red-400 mr-3" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          PDF (.pdf)
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Perfecto para presentaciones y reportes
                        </p>
                      </div>
                      {selectedFormat === "pdf" && (
                        <Check className="w-5 h-5 text-red-600 dark:text-red-400 ml-auto" />
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Filtros */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-500" />
                Filtros del Reporte
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
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
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
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
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

                {/* Estado */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Estado
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.status || ""}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Montos */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Monto mínimo
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.minTotal || ""}
                    onChange={(e) =>
                      handleFilterChange("minTotal", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Monto máximo
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.maxTotal || ""}
                    onChange={(e) =>
                      handleFilterChange("maxTotal", Number(e.target.value))
                    }
                  />
                </div>

                {/* Referencia */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Hash className="w-4 h-4 mr-1" />
                    Referencia
                  </label>
                  <input
                    type="text"
                    placeholder="Referencia de venta"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.reference || ""}
                    onChange={(e) =>
                      handleFilterChange("reference", e.target.value)
                    }
                  />
                </div>

                {/* Cliente */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Nombre cliente
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.clientName || ""}
                    onChange={(e) =>
                      handleFilterChange("clientName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email cliente
                  </label>
                  <input
                    type="email"
                    placeholder="email@ejemplo.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.clientEmail || ""}
                    onChange={(e) =>
                      handleFilterChange("clientEmail", e.target.value)
                    }
                  />
                </div>

                {/* Ubicación */}
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
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
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Estado
                  </label>
                  <input
                    type="text"
                    placeholder="Estado"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.state || ""}
                    onChange={(e) =>
                      handleFilterChange("state", e.target.value)
                    }
                  />
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
              💡 Los reportes incluyen datos agregados y estadísticas
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isGenerating}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando {selectedFormat.toUpperCase()}...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generar {selectedFormat.toUpperCase()}
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
