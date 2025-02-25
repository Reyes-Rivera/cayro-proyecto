import type React from "react";
import type { Product } from "../data/sampleData";
import { Edit, Trash, Eye } from "lucide-react"; // Importa los iconos necesarios

interface ProductListProps {
  products: Product[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onView }) => {
  return (
    <div className="overflow-x-auto  rounded-lg bg-white dark:bg-gray-800 p-6">
     
      <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              ID
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Activo
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
              >
                <td className="px-4 py-4 text-gray-900 dark:text-gray-100 align-middle">
                  {product.id}
                </td>
                <td className="px-4 py-4 text-gray-900 dark:text-gray-100 align-middle">
                  {product.name}
                </td>
                <td className="px-4 py-4 text-gray-900 dark:text-gray-100 align-middle">
                  {product.active ? "Sí" : "No"}
                </td>
                <td className="px-4 py-4 flex items-center space-x-4">
                  {/* Botón Ver */}
                  <button
                    onClick={() => onView(product.id)}
                    className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    <Eye size={18} />
                  </button>

                  {/* Botón Editar */}
                  <button
                    onClick={() => onEdit(product.id)}
                    className="text-yellow-500 dark:text-yellow-300 hover:text-yellow-700 dark:hover:text-yellow-400"
                  >
                    <Edit size={18} />
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400 transition"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="p-4 text-center text-gray-500 dark:text-gray-400"
              >
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;