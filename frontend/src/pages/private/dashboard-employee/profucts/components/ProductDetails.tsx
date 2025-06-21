"use client";
import {
  getBrands,
  getCategories,
  getColors,
  getGenders,
  getSizes,
  getSleeve,
} from "@/api/products";
import type React from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Info,
  Package,
  ShoppingBag,
  Tag,
  Clock,
  Award,
  Layers,
  Package2,
} from "lucide-react";
import { useEffect, useState } from "react";

import type {
  Size,
  Brand,
  Gender,
  Category,
  NeckType,
  Color,
  Product,
} from "../data/sampleData";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  // Funciones para obtener nombres a partir de IDs
  const [sizes, setSizes] = useState<Size[]>();
  const [brands, setBrands] = useState<Brand[]>();
  const [genders, setGenders] = useState<Gender[]>();
  const [category, setCategory] = useState<Category[]>();
  const [neckType, setNeckType] = useState<NeckType[]>();
  const [colors, setColors] = useState<Color[]>();
  const getBrandName = (brandId: number) =>
    brands?.find((b) => b.id === brandId)?.name || "Desconocido";
  const getGenderName = (genderId: number) =>
    genders?.find((g) => g.id === genderId)?.name || "Desconocido";
  const getNeckTypeName = (neckTypeId: number | null) =>
    neckTypeId ? neckType?.find((n) => n.id === neckTypeId)?.name : "N/A";
  const getCategoryName = (categoryId: number) =>
    category?.find((c) => c.id === categoryId)?.name || "Desconocido";
  const getSizeName = (sizeId: number) =>
    sizes?.find((s) => s.id === sizeId)?.name || "Desconocido";
  const getColorName = (colorId: number) =>
    colors?.find((c) => c.id === colorId)?.name || "Desconocido";

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVariants = product.variants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(product.variants.length / itemsPerPage);

  useEffect(() => {
    const getData = async () => {
      const res = await getSizes();
      const brandsData = await getBrands();
      const genderData = await getGenders();
      const categoryData = await getCategories();
      const sleeveData = await getSleeve();
      const colorsData = await getColors();
      if (brandsData) setBrands(brandsData.data);
      if (genderData) setGenders(genderData.data);
      if (categoryData) setCategory(categoryData.data);
      if (sleeveData) setNeckType(sleeveData.data);
      if (colorsData) setColors(colorsData.data);
      if (res) setSizes(res.data);
    };
    getData();
  }, []);

  // Calcular el stock total
  const totalStock = product.variants.reduce(
    (sum, variant) => sum + variant.stock,
    0
  );

  // Calcular el precio promedio
  const averagePrice =
    product.variants.length > 0
      ? product.variants.reduce((sum, variant) => sum + variant.price, 0) /
        product.variants.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Encabezado de Página */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

        {/* Encabezado */}
        <div className="relative">
          <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <Package2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">
                      {product.name}
                    </h2>
                    <p className="text-sm bg-white/20 px-2 py-1 rounded-full text-white">
                      ID: #{product.id}
                    </p>
                  </div>
                  <p className="mt-1 text-white/80 flex items-center">
                    <Tag className="w-3.5 h-3.5 mr-1.5 inline" />
                    {getBrandName(product.brandId)} •{" "}
                    {getCategoryName(product.categoryId)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onBack}
                className="bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
            </div>
          </div>
          <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
            <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
              {product.active ? (
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Activo
                </span>
              ) : (
                <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
                  <Info className="w-3.5 h-3.5 mr-1" />
                  Inactivo
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-10">
          <div className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {(() => {
              const description = product.description || "";

              // Check if description contains bullet points
              if (description.includes("•")) {
                // Split by bullet points and clean up
                const items = description
                  .split("•")
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0);

                return (
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              // Fallback to regular paragraph if no bullet points
              return <p>{description}</p>;
            })()}
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <ShoppingBag className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-2" />
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {totalStock}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                Stock Total
              </span>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <Layers className="w-6 h-6 text-purple-500 dark:text-purple-400 mb-2" />
              <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {product.variants.length}
              </span>
              <span className="text-sm text-purple-600 dark:text-purple-400">
                Variantes
              </span>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <Award className="w-6 h-6 text-green-500 dark:text-green-400 mb-2" />
              <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                ${averagePrice.toFixed(2)}
              </span>
              <span className="text-sm text-green-600 dark:text-green-400">
                Precio Promedio
              </span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all">
              <Calendar className="w-6 h-6 text-amber-500 dark:text-amber-400 mb-2" />
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {new Date(product.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
              <span className="text-sm text-amber-600 dark:text-amber-400">
                Fecha Creación
              </span>
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center text-gray-900 dark:text-white">
                <Info className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                Información Básica
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Marca
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getBrandName(product.brandId)}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Categoría
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getCategoryName(product.categoryId)}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Género
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getGenderName(product.genderId)}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Tipo de Cuello
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {getNeckTypeName(product.sleeveId)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center text-gray-900 dark:text-white">
                <Clock className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                Información Temporal
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fecha de creación
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(product.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>

                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Última actualización
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(product.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de variantes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

        <div className="relative">
          <div className="bg-blue-500 p-4 text-white flex items-center justify-between rounded-b-[2rem]">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Variantes del Producto</h3>
            </div>
            <span className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full">
              {product.variants.length} variantes
            </span>
          </div>
        </div>

        <div className="p-6 pt-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/20">
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Imagen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Color
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Talla
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-800">
                    Código de barras
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentVariants.map((variant, index) => (
                  <tr
                    key={variant.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-blue-50/30 dark:bg-blue-900/10"
                    } hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={variant.images[0]?.url || "/placeholder.svg"}
                          alt={`${getColorName(variant.colorId)} ${getSizeName(
                            variant.sizeId
                          )}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-3 border border-gray-200 dark:border-gray-700 shadow-sm"
                          style={{
                            backgroundColor:
                              colors?.find((c) => c.id === variant.colorId)
                                ?.hexValue || "#ccc",
                          }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getColorName(variant.colorId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full">
                        {getSizeName(variant.sizeId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${variant.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            variant.stock > 10
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : variant.stock > 0
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                          }`}
                        >
                          {variant.stock > 0 ? variant.stock : "Agotado"}
                        </span>
                        {variant.stock === 0 && (
                          <span className="ml-2 text-xs text-red-500 dark:text-red-400">
                            Sin stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300">
                        {variant.barcode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {product.variants.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No hay variantes disponibles para este producto
              </p>
              <p className="text-sm">
                Añade variantes para comenzar a vender este producto
              </p>
            </div>
          ) : (
            <>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      Mostrando {indexOfFirstItem + 1} a{" "}
                      {Math.min(indexOfLastItem, product.variants.length)} de{" "}
                      {product.variants.length} variantes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Anterior
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 text-sm font-medium rounded-md ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total: {product.variants.length} variantes
                </span>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                  Administrar variantes
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botón de volver flotante para móviles */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="sr-only">Volver</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
