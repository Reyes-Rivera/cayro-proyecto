import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import escolta from "@/assets/uniformes-escolta-removebg-preview.png";
import polo from "@/assets/polo-3-removebg-preview.png";
import deportivo from "@/assets/conjunto-removebg-preview.png";
import espinilleras from "@/assets/espinilleras-removebg-preview.png";
const products = [
  {
    id: 1,
    name: "Uniforme Escolar Clásico",
    price: 599,
    oldPrice: 799,
    image: escolta,
    category: "Primaria",
  },
  {
    id: 2,
    name: "Conjunto Deportivo Premium de Alta Calidad",
    price: 499,
    oldPrice: 649,
    image: deportivo,
    category: "Deportes",
  },
  {
    id: 3,
    name: "Falda Plisada Elegante",
    price: 299,
    oldPrice: 399,
    image: polo,
    category: "Secundaria",
  },
  {
    id: 4,
    name: "Espinilleras",
    price: 249,
    oldPrice: 299,
    image: espinilleras,
    category: "Accesorios",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
            Productos Destacados
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubre nuestra selección de uniformes de alta calidad, diseñados
            para brindar comodidad y estilo a los estudiantes.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                {/* Product Image */}
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Hover Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium text-lg transition-opacity duration-300"
                    >
                      Ver detalles
                    </motion.div>
                  </div>
                </CardContent>

                {/* Product Details */}
                <CardFooter className="flex flex-col flex-grow p-6 items-start">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight mb-2 text-left">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-bold">
                        ${product.price}
                      </span>
                      
                    </div>
                    <button className="w-10 h-10  dark:bg-blue-700 rounded-full flex items-center justify-center shadow-md hover:bg-blue-200 dark:hover:bg-blue-600 transition">
                      <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
