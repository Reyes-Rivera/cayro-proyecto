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
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Size,
  Brand,
  Gender,
  Category,
  NeckType,
  Color,
} from "../data/sampleData";

interface ProductVariant {
  id: number;
  colorId: number;
  sizeId: number;
  price: number;
  stock: number;
  barcode: string;
  imageUrl:string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brandId: number;
  genderId: number;
  categoryId: number;
  sleeveId: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

// Datos estáticos

// Producto estático de ejemplo

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
    <div className="container mx-auto ">
      {/* Header con navegación */}

      <div className="grid gap-8">
        {/* Tarjeta principal de información */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className=" bg-white p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              {/* Título y ID del producto */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-sm bg-white/10 px-2 py-1 rounded-full">
                  ID: #{product.id}
                </p>
              </div>

              {/* Botón de volver */}
              <button
                type="button"
                onClick={onBack}
                className="bg-black/20 hover:bg-black/30  px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </button>
            </div>

            {/* Estado, marca y categoría */}
            <div className="flex flex-wrap items-center gap-3 text-blue-700">
              {/* Estado del producto */}
              <div className="flex items-center">
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

              {/* Marca del producto */}
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1.5" />
                <span>{getBrandName(product.brandId)}</span>
              </div>

              {/* Categoría del producto */}
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-1.5" />
                <span>{getCategoryName(product.categoryId)}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-blue-700">
                  {totalStock}
                </span>
                <span className="text-sm text-blue-600">Stock Total</span>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <Layers className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-2xl font-bold text-purple-700">
                  {product.variants.length}
                </span>
                <span className="text-sm text-purple-600">Variantes</span>
              </div>

              <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <Award className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold text-green-700">
                  ${averagePrice.toFixed(2)}
                </span>
                <span className="text-sm text-green-600">Precio Promedio</span>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <Calendar className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-2xl font-bold text-amber-700">
                  {new Date(product.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="text-sm text-amber-600">Fecha Creación</span>
              </div>
            </div>

            {/* Detalles del producto */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  Información Básica
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Marca</p>
                    <p className="font-medium">
                      {getBrandName(product.brandId)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Categoría</p>
                    <p className="font-medium">
                      {getCategoryName(product.categoryId)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Género</p>
                    <p className="font-medium">
                      {getGenderName(product.genderId)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Tipo de Cuello</p>
                    <p className="font-medium">
                      {getNeckTypeName(product.sleeveId)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-500" />
                  Información Temporal
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Fecha de creación</p>
                      <p className="font-medium">
                        {new Date(product.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">
                        Última actualización
                      </p>
                      <p className="font-medium">
                        {new Date(product.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de variantes */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className=" bg-blue-600  p-4 text-white flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Variantes del Producto
            </h3>
            <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-3 py-1 rounded-full">
              {product.variants.length} variantes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                    Imagen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                    Color
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                    Talla
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider border-b border-indigo-100">
                    Código de barras
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant, index) => (
                  <tr
                    key={variant.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50/30"
                    } hover:bg-indigo-50 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={
                            variant.imageUrl ||
                            "/placeholder.svg?height=64&width=64"
                          }
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
                          className="w-6 h-6 rounded-full mr-3 border border-gray-200 shadow-sm"
                          style={{
                            backgroundColor:
                              colors?.find((c) => c.id === variant.colorId)
                                ?.hexValue || "#ccc",
                          }}
                        ></div>
                        <span className="font-medium">
                          {getColorName(variant.colorId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {getSizeName(variant.sizeId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-gray-900">
                        ${variant.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            variant.stock > 10
                              ? "bg-green-100 text-green-800"
                              : variant.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {variant.stock > 0 ? variant.stock : "Agotado"}
                        </span>
                        {variant.stock === 0 && (
                          <span className="ml-2 text-xs text-red-500">
                            Sin stock
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        {variant.barcode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {product.variants.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium">
                No hay variantes disponibles para este producto
              </p>
              <p className="text-sm">
                Añade variantes para comenzar a vender este producto
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Mostrando {product.variants.length} variantes
            </span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Administrar variantes
            </button>
          </div>
        </div>
      </div>

      {/* Botón de volver flotante para móviles */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button
          onClick={onBack}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="sr-only">Volver</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
