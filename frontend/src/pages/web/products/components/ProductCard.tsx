import { ShoppingCart, Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-2">
      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg hover:cursor-pointer">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="object-cover transition-all duration-300 group-hover:opacity-75 group-hover:scale-105"
        />
        <div className="absolute inset-0 font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50/20">
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </div>
      </div>
      <div>
        <h3 className="font-bold text-sm mb-1 text-gray-900">{product.name}</h3>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-600">
            ${product.price.toFixed(2)}
          </p>
          <button className="w-10 h-10  dark:bg-blue-700 rounded-full flex items-center justify-center shadow-md hover:bg-blue-200 dark:hover:bg-blue-600 transition">
            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
