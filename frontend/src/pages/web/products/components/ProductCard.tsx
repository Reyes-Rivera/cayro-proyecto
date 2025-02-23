import { Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 overflow-hidden relative shadow-lg">
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="object-cover w-full h-full transition-all duration-300 group-hover:opacity-50 group-hover:scale-105"
        />

        {/* Botón "Ver detalles" en el centro de la imagen */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Inicia fuera de la vista (arriba)
          whileHover={{ opacity: 1, y: 0 }} // Aparece y cae
          transition={{ duration: 0.3 }} // Duración de la animación
          className="absolute inset-0 flex items-center justify-center"
        >
          <button className="flex items-center justify-center px-4 py-2  font-bold">
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </button>
        </motion.div>
      </div>

      {/* Detalles del producto */}
      <div className="p-4 border dark:border-gray-600">
        {/* Nombre del producto */}
        <h3 className="font-bold text-center text-lg mb-1 text-gray-900 dark:text-gray-100">
          {product.name}
        </h3>

        {/* Precio */}
        <div className="flex items-center justify-center">
          <p className="font-semibold text-center dark:text-gray-100">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}