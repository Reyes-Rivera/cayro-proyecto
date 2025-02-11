import type React from "react"
import {
  type Product,
  sampleBrands,
  sampleGenders,
  sampleNeckTypes,
  sampleCategories,
  sampleColors,
  sampleSizes,
} from "../data/sampleData"

interface ProductDetailsProps {
  product: Product
  onBack: () => void
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack }) => {
  const getBrandName = (brandId: number) => sampleBrands.find((b) => b.id === brandId)?.name || "Desconocido"
  const getGenderName = (genderId: number) => sampleGenders.find((g) => g.id === genderId)?.name || "Desconocido"
  const getNeckTypeName = (neckTypeId: number | null) =>
    neckTypeId ? sampleNeckTypes.find((n) => n.id === neckTypeId)?.name : "N/A"
  const getCategoryName = (categoryId: number) =>
    sampleCategories.find((c) => c.id === categoryId)?.name || "Desconocido"
  const getColorName = (colorId: number) => sampleColors.find((c) => c.id === colorId)?.name || "Desconocido"
  const getSizeName = (sizeId: number) => sampleSizes.find((s) => s.id === sizeId)?.name || "Desconocido"

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Detalles del Producto</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">Nombre:</strong>
            <p>{product.name}</p>
          </div>
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">Descripción:</strong>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">Marca:</strong>
            <p>{getBrandName(product.brandId)}</p>
          </div>
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">Género:</strong>
            <p>{getGenderName(product.genderId)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">Categoría:</strong>
            <p>{getCategoryName(product.categoryId)}</p>
          </div>
          <div>
            <strong className="block text-gray-700 text-sm font-bold mb-2">Tipo de Cuello:</strong>
            <p>{getNeckTypeName(product.neckTypeId)}</p>
          </div>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Activo:</strong>
          <p>{product.active ? "Sí" : "No"}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Fecha de creación:</strong>
          <p>{new Date(product.createdAt).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Última actualización:</strong>
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
                  <td className="border px-4 py-2">{getSizeName(variant.sizeId)}</td>
                  <td className="border px-4 py-2">${variant.price.toFixed(2)}</td>
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
  )
}

export default ProductDetails

