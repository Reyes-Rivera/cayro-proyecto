"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Percent, AlertCircle, Check, Info } from "lucide-react";
import type { Brand, Category, Gender, Color, Size } from "../data/sampleData";
import {
  getBrands,
  getCategories,
  getGenders,
  getColors,
  getSizes,
} from "@/api/products";
import { AlertHelper } from "@/utils/alert.util";

interface PriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    filters: PriceModalFilters,
    updateData: PriceUpdateData
  ) => Promise<void>;
}

// ✅ Filtros específicos para el modal de precios (completamente separados de la tabla)
interface PriceModalFilters {
  categoryIds?: number[];
  brandIds?: number[];
  genderIds?: number[];
  colorIds?: number[];
  sizeIds?: number[];
}

interface PriceUpdateData {
  updateType: "percentage" | "amount";
  operation: "increase" | "decrease" | "set";
  value: number;
}

const PriceUpdateModal: React.FC<PriceUpdateModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
}) => {
  // ✅ Estado independiente para filtros del modal de precios
  const [priceFilters, setPriceFilters] = useState<PriceModalFilters>({});
  const [updateData, setUpdateData] = useState<PriceUpdateData>({
    updateType: "amount",
    operation: "increase",
    value: 0, // Mantenemos 0 como valor por defecto pero lo manejamos mejor
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Estado para manejar si el campo ha sido tocado
  const [valueInputTouched, setValueInputTouched] = useState(false);

  // ✅ Estados independientes para datos del modal
  const [modalBrands, setModalBrands] = useState<Brand[]>([]);
  const [modalCategories, setModalCategories] = useState<Category[]>([]);
  const [modalGenders, setModalGenders] = useState<Gender[]>([]);
  const [modalColors, setModalColors] = useState<Color[]>([]);
  const [modalSizes, setModalSizes] = useState<Size[]>([]);

  // ✅ Cargar datos independientes para el modal
  useEffect(() => {
    const loadModalData = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const [brandsRes, categoriesRes, gendersRes, colorsRes, sizesRes] =
          await Promise.all([
            getBrands(),
            getCategories(),
            getGenders(),
            getColors(),
            getSizes(),
          ]);

        if (brandsRes?.data) setModalBrands(brandsRes.data);
        if (categoriesRes?.data) setModalCategories(categoriesRes.data);
        if (gendersRes?.data) setModalGenders(gendersRes.data);
        if (colorsRes?.data) setModalColors(colorsRes.data);
        if (sizesRes?.data) setModalSizes(sizesRes.data);
      } catch (error: any) {
        AlertHelper.error({
          title: "Error",
          message:
            error.response?.data?.message ||
            "No se pudieron cargar los datos necesarios.",
          isModal: true,
          animation: "bounce",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadModalData();
  }, [isOpen]);

  // ✅ Limpiar filtros del modal al cerrar
  useEffect(() => {
    if (!isOpen) {
      setPriceFilters({});
      setUpdateData({
        updateType: "amount",
        operation: "increase",
        value: 0,
      });
      setValueInputTouched(false); // Reset touched state
    }
  }, [isOpen]);

  // ✅ Manejar cambios de filtros del modal (independientes)
  const handlePriceFilterChange = (
    type: keyof PriceModalFilters,
    id: number
  ) => {
    setPriceFilters((prev) => {
      const currentFilter = (prev[type] as number[]) || [];
      return {
        ...prev,
        [type]: currentFilter.includes(id)
          ? currentFilter.filter((item) => item !== id)
          : [...currentFilter, id],
      };
    });
  };

  // ✅ Limpiar solo filtros del modal
  const clearPriceFilters = () => {
    setPriceFilters({});
  };

  // ✅ Verificar si hay filtros activos en el modal
  const hasPriceFilters = Object.values(priceFilters).some(
    (filter) => filter && filter.length > 0
  );

  // ✅ Obtener descripción de filtros del modal
  const getPriceFilterDescription = () => {
    const descriptions = [];

    if (priceFilters.categoryIds?.length) {
      const categoryNames = priceFilters.categoryIds
        .map((id) => modalCategories.find((c) => c.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      descriptions.push(`Categorías: ${categoryNames}`);
    }

    if (priceFilters.brandIds?.length) {
      const brandNames = priceFilters.brandIds
        .map((id) => modalBrands.find((b) => b.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      descriptions.push(`Marcas: ${brandNames}`);
    }

    if (priceFilters.genderIds?.length) {
      const genderNames = priceFilters.genderIds
        .map((id) => modalGenders.find((g) => g.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      descriptions.push(`Géneros: ${genderNames}`);
    }

    if (priceFilters.colorIds?.length) {
      const colorNames = priceFilters.colorIds
        .map((id) => modalColors.find((c) => c.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      descriptions.push(`Colores: ${colorNames}`);
    }

    if (priceFilters.sizeIds?.length) {
      const sizeNames = priceFilters.sizeIds
        .map((id) => modalSizes.find((s) => s.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      descriptions.push(`Tallas: ${sizeNames}`);
    }

    return descriptions.length > 0
      ? descriptions.join(" • ")
      : "Ningún filtro seleccionado";
  };

  // ✅ Manejar cambio de valor con mejor UX
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Si el campo está vacío, permitirlo
    if (inputValue === "") {
      setUpdateData((prev) => ({ ...prev, value: 0 }));
      setValueInputTouched(false);
      return;
    }

    // Marcar como tocado cuando el usuario empieza a escribir
    if (!valueInputTouched) {
      setValueInputTouched(true);
    }

    const numericValue = Number.parseFloat(inputValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setUpdateData((prev) => ({ ...prev, value: numericValue }));
    }
  };

  // ✅ Obtener el valor a mostrar en el input
  const getDisplayValue = () => {
    if (!valueInputTouched && updateData.value === 0) {
      return ""; // Mostrar campo vacío si no ha sido tocado y es 0
    }
    return updateData.value.toString();
  };

  const handleSubmit = async () => {
    if (!hasPriceFilters) {
      AlertHelper.warning({
        title: "Filtros requeridos",
        message: "Debe seleccionar al menos un filtro para actualizar precios.",
        isModal: true,
        animation: "bounce",
      });
      return;
    }

    if (updateData.value <= 0) {
      AlertHelper.warning({
        title: "Valor inválido",
        message: "El valor debe ser mayor a 0.",
        isModal: true,
        animation: "bounce",
      });
      return;
    }

    const confirmed = await AlertHelper.confirm({
      title: "¿Confirmar actualización masiva de precios?",
      message: `
      <div class="text-left">
        <p><strong>Filtros aplicados:</strong></p>
        <p class="text-sm text-gray-600 mb-3">${getPriceFilterDescription()}</p>
        <p><strong>Acción:</strong> ${
          updateData.operation === "increase"
            ? "Aumentar"
            : updateData.operation === "decrease"
            ? "Disminuir"
            : "Establecer"
        } los precios ${
        updateData.updateType === "percentage"
          ? `en ${updateData.value}%`
          : updateData.operation === "set"
          ? `a $${updateData.value}`
          : `en $${updateData.value}`
      }</p>
        <p class="text-xs text-red-600 mt-2"><strong>Nota:</strong> Esta acción afectará múltiples productos y no se puede deshacer.</p>
      </div>
    `,
      confirmText: "Sí, actualizar precios",
      cancelText: "Cancelar",
      type: "question",
      animation: "bounce",
    });

    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await onUpdate(priceFilters, updateData);
      onClose();
      setPriceFilters({});
      setUpdateData({
        updateType: "amount",
        operation: "increase",
        value: 0,
      });
      setValueInputTouched(false);
    } catch (error:any) {
      AlertHelper.error({
        title: "Error",
        message: error.response?.data?.message || "Ocurrió un problema al actualizar los precios.",
        isModal: true,
        animation: "bounce",
      });
    } finally {
      setIsSubmitting(false);
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
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Actualización Masiva de Precios
                </h2>
                <p className="text-sm text-white/80">
                  Filtros independientes - no afectan la tabla de productos
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

          {isLoading ? (
            <div className="p-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <span className="text-gray-500 dark:text-gray-400">
                Cargando datos...
              </span>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Filters Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-blue-500" />
                  Filtros para Actualización de Precios
                </h3>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-400">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-2">
                        🎯 Estos filtros son independientes de la tabla de
                        productos
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="font-medium">Ejemplos de uso:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              Solo "Hombre" → todos los productos masculinos
                            </li>
                            <li>Solo "Polos" → todas las polos</li>
                            <li>"Polos" + "Hombre" → solo polos masculinas</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium">
                            Combinaciones flexibles:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Solo marca "Nike" → todos los Nike</li>
                            <li>Solo color "Azul" → todos los azules</li>
                            <li>Solo talla "XL" → todas las XL</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen de filtros seleccionados */}
                {hasPriceFilters && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      Productos que serán actualizados:
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {getPriceFilterDescription()}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      📁 Categorías
                      {priceFilters.categoryIds?.length ? (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {priceFilters.categoryIds.length}
                        </span>
                      ) : null}
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      {modalCategories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              priceFilters.categoryIds?.includes(category.id) ||
                              false
                            }
                            onChange={() =>
                              handlePriceFilterChange(
                                "categoryIds",
                                category.id
                              )
                            }
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      🏷️ Marcas
                      {priceFilters.brandIds?.length ? (
                        <span className="ml-2 text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                          {priceFilters.brandIds.length}
                        </span>
                      ) : null}
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      {modalBrands.map((brand) => (
                        <label
                          key={brand.id}
                          className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              priceFilters.brandIds?.includes(brand.id) || false
                            }
                            onChange={() =>
                              handlePriceFilterChange("brandIds", brand.id)
                            }
                            className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {brand.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Genders */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      👤 Géneros
                      {priceFilters.genderIds?.length ? (
                        <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                          {priceFilters.genderIds.length}
                        </span>
                      ) : null}
                    </h4>
                    <div className="space-y-2 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      {modalGenders.map((gender) => (
                        <label
                          key={gender.id}
                          className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              priceFilters.genderIds?.includes(gender.id) ||
                              false
                            }
                            onChange={() =>
                              handlePriceFilterChange("genderIds", gender.id)
                            }
                            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {gender.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      🎨 Colores
                      {priceFilters.colorIds?.length ? (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {priceFilters.colorIds.length}
                        </span>
                      ) : null}
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      {modalColors.map((color) => (
                        <label
                          key={color.id}
                          className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              priceFilters.colorIds?.includes(color.id) || false
                            }
                            onChange={() =>
                              handlePriceFilterChange("colorIds", color.id)
                            }
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <div className="flex items-center ml-2">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300 mr-2"
                              style={{ backgroundColor: color.hexValue }}
                            ></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {color.name}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                      📏 Tallas
                      {priceFilters.sizeIds?.length ? (
                        <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          {priceFilters.sizeIds.length}
                        </span>
                      ) : null}
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      {modalSizes.map((size) => (
                        <label
                          key={size.id}
                          className="flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              priceFilters.sizeIds?.includes(size.id) || false
                            }
                            onChange={() =>
                              handlePriceFilterChange("sizeIds", size.id)
                            }
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {size.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {hasPriceFilters && (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={clearPriceFilters}
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Limpiar filtros de precios
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Object.values(priceFilters).reduce(
                        (acc, filter) => acc + (filter?.length || 0),
                        0
                      )}{" "}
                      filtros activos
                    </span>
                  </div>
                )}
              </div>

              {/* Price Update Section */}
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Configuración de Actualización
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Update Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tipo de Actualización
                    </label>
                    <select
                      value={updateData.updateType}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          updateType: e.target.value as "percentage" | "amount",
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="amount">Cantidad ($)</option>
                    </select>
                  </div>

                  {/* Operation */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Operación
                    </label>
                    <select
                      value={updateData.operation}
                      onChange={(e) =>
                        setUpdateData((prev) => ({
                          ...prev,
                          operation: e.target.value as
                            | "increase"
                            | "decrease"
                            | "set",
                        }))
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="increase">Aumentar</option>
                      <option value="decrease">Disminuir</option>
                      <option value="set">Establecer</option>
                    </select>
                  </div>

                  {/* Value */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valor{" "}
                      {updateData.updateType === "percentage" ? "(%)" : "($)"}
                    </label>
                    <div className="relative">
                      {updateData.updateType === "percentage" ? (
                        <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      ) : (
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      )}
                      <input
                        type="number"
                        min="0"
                        step={
                          updateData.updateType === "percentage"
                            ? "0.1"
                            : "0.01"
                        }
                        value={getDisplayValue()}
                        onChange={handleValueChange}
                        onFocus={() => setValueInputTouched(true)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={
                          updateData.updateType === "percentage" ? "10" : "5.00"
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {updateData.updateType === "percentage"
                        ? "Ejemplo: 10 para aumentar 10%"
                        : "Ejemplo: 5.00 para aumentar $5.00"}
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {updateData.value > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Vista Previa de la Actualización
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {updateData.operation === "increase" && "Aumentar "}
                      {updateData.operation === "decrease" && "Disminuir "}
                      {updateData.operation === "set" && "Establecer "}
                      precios{" "}
                      {updateData.updateType === "percentage"
                        ? `en ${updateData.value}%`
                        : updateData.operation === "set"
                        ? `a $${updateData.value}`
                        : `en $${updateData.value}`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ejemplo: Precio actual $100 → Nuevo precio $
                      {updateData.operation === "increase"
                        ? updateData.updateType === "percentage"
                          ? (100 + (100 * updateData.value) / 100).toFixed(2)
                          : (100 + updateData.value).toFixed(2)
                        : updateData.operation === "decrease"
                        ? updateData.updateType === "percentage"
                          ? (100 - (100 * updateData.value) / 100).toFixed(2)
                          : (100 - updateData.value).toFixed(2)
                        : updateData.value.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Estos filtros no afectan la tabla de productos
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  isSubmitting || !hasPriceFilters || updateData.value <= 0
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando precios...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Actualizar Precios (
                    {Object.values(priceFilters).reduce(
                      (acc, filter) => acc + (filter?.length || 0),
                      0
                    )}{" "}
                    filtros)
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

export default PriceUpdateModal;
