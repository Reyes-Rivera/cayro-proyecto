import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Playeras from "../assets/playeras.jpg.jpg";
import Camisas from "../assets/camisas.jpg";
import Polos from "../assets/polos.jpg.jpg";
import Pantalones from "../assets/pantalones.jpg.jpg";
import Deportivos from "../assets/deportivos.jpg.jpg";

const categories = [
  {
    name: "Playeras",
    image: Playeras,
  },
  {
    name: "Camisas",
    image: Camisas,
  },
  {
    name: "Polos",
    image: Polos,
  },
  {
    name: "Pantalones",
    image: Pantalones,
  },
  {
    name: "Deportivos",
    image: Deportivos,
  },
];

export default function FeaturedCategories() {
  const [visibleIndex, setVisibleIndex] = useState(0); // Estado para controlar qué categoría se muestra

  // Efecto para cambiar la categoría visible cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prevIndex) => (prevIndex + 1) % categories.length);
    }, 3000); // Ahora cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-20 bg-gray-50 px-4 sm:px-8 lg:px-36">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-6 sm:mb-8"
        >
          Categorías Destacadas
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
              className={`relative h-24 sm:h-32 overflow-hidden bg-white shadow-lg flex items-center justify-center ${
                index !== categories.length - 1
                  ? "border-r border-gray-200"
                  : ""
              }`}
            >
              {/* Texto de la categoría (siempre visible) */}
              <p
                className={`font-bold text-lg sm:text-xl z-20 uppercase transition-colors duration-300 ${
                  index === visibleIndex ? "text-white" : "text-gray-800"
                }`}
              >
                {category.name}
              </p>

              {/* Capa oscura semi-transparente sobre la imagen (solo visible cuando se muestra la imagen) */}
              {index === visibleIndex && (
                <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
              )}

              {/* Imagen de fondo que se desliza de izquierda a derecha */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
                initial={{ x: "-100%" }} // Inicia fuera del contenedor a la izquierda
                animate={{
                  x: index === visibleIndex ? "0%" : "-100%", // Se desliza a la posición original si es la categoría visible
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }} // Animación suave
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
