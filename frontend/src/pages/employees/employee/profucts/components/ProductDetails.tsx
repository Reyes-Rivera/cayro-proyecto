import type React from "react";
import {
  type Product,
  Size,
  Brand,
  Gender,
  Category,
  NeckType,
  Color,
} from "../data/sampleData";
import { useEffect, useState } from "react";
import { getBrands, getCategories, getColors, getGenders, getSizes, getSleeve } from "@/api/products";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
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
  const getColorName = (colorId: number) => colors?.find((c) => c.id === colorId)?.name || "Desconocido";
  const getSizeName = (sizeId: number) =>
    sizes?.find((s) => s.id === sizeId)?.name || "Desconocido";
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
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Detalles del Producto</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">
              Nombre:
            </strong>
            <p>{product.name}</p>
          </div>
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">
              Descripción:
            </strong>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">
              Marca:
            </strong>
            <p>{getBrandName(product.brandId)}</p>
          </div>
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">
              Género:
            </strong>
            <p>{getGenderName(product.genderId)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">
              Categoría:
            </strong>
            <p>{getCategoryName(product.categoryId)}</p>
          </div>
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Cuello:
            </strong>
            <p>{getNeckTypeName(product.sleeveId)}</p>
          </div>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">
            Activo:
          </strong>
          <p>{product.active ? "Sí" : "No"}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">
            Fecha de creación:
          </strong>
          <p>{new Date(product.createdAt).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">
            Última actualización:
          </strong>
          <p>{new Date(product.updatedAt).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Variantes</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Color</th>
                <th className="px-4 py-2 text-left">Talla</th>
                <th className="px-4 py-2 text-left">Precio</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Código de barras</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant) => (
                <tr key={variant.id}>
                  <td className="border px-4 py-2">{getColorName(variant.colorId)}</td>
                  <td className="border px-4 py-2">
                    {getSizeName(variant.sizeId)}
                  </td>
                  <td className="border px-4 py-2">
                    ${variant.price.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">{variant.stock}</td>
                  <td className="border px-4 py-2">{variant.barcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
