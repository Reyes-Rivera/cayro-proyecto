import { Eye, Star } from "lucide-react"; // Importar íconos
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  category: string;
  rating: number; // Nueva propiedad para las estrellas
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 overflow-hidden relative rounded-lg flex flex-col h-full">
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
        {/* Botón del carrito en la esquina superior derecha */}
     

        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="object-cover w-full h-full transition-all duration-300 group-hover:opacity-50 group-hover:scale-105"
        />

        {/* Botón "Ver detalles" en el centro de la imagen */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} // Inicia fuera de la vista (arriba)
          whileHover={{ opacity: 1, y: 0 }} // Aparece y baja suavemente
          transition={{ duration: 0.3 }} // Duración de la animación
          className="absolute inset-0 flex items-center justify-center"
        >
          <button className="flex items-center justify-center px-4 py-2  font-bold rounded-lg  transition-colors">
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </button>
        </motion.div>
      </div>

      {/* Detalles del producto */}
      <div className="p-6 flex flex-col flex-grow dark:border-gray-600 rounded-b-lg">
        {/* Nombre del producto */}
        <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
          {product.name}
        </h2>

        {/* Precio y estrellas en la misma fila */}
        <div className="flex items-center justify-between mt-2">
          {/* Precio */}
          <p className="font-semibold text-lg text-gray-600 dark:text-blue-400">
            ${product.price.toFixed(2)}
          </p>

          {/* Estrellas (rating) */}
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < product.rating
                    ? "text-yellow-400 fill-yellow-400" // Estrellas llenas
                    : "text-gray-300 dark:text-gray-500" // Estrellas vacías
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}