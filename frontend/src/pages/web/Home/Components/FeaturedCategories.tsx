import { motion } from "framer-motion";
import primaria from "@/assets/primaria-img.png";
import secundaria from "@/assets/secundaria-img.png";
import personalizado from "@/assets/personalizados.png";

const categories = [
  {
    name: "Uniformes de Primaria",
    description: "Diseños cómodos y duraderos",
    image: primaria,
    items: "45 productos",
  },
  {
    name: "Uniformes de Secundaria",
    description: "Elegancia y formalidad",
    image: secundaria,
    items: "38 productos",
  },
  {
    name: "Uniformes Deportivos",
    description: "Rendimiento y comodidad",
    image: personalizado,
    items: "29 productos",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-20  dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Título principal */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-16 tracking-tight"
        >
          Categorías Destacadas
        </motion.h2>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Imagen */}
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-64 object-cover"
              />

              {/* Contenido encima de la imagen */}
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 text-white transition-opacity duration-300 group-hover:bg-black/70">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{category.items}</span>
                 
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
