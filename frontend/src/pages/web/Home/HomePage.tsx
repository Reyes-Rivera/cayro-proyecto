import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import imagenCustom from "./assets/personalizar.jpg";
import imgWhyUs from "./assets/whyus.jpg";
import { ShoppingBag, Shirt } from "lucide-react";
import type {
  AnimatedSectionProps,
  Category,
  CategoryCardProps,
  ProductCardProps,
} from "./types";
import Hero from "./Components/Hero";
import Playeras from "./assets/playeras.jpg.jpg";
import Camisas from "./assets/camisas.jpg";
import Polos from "./assets/polos.jpg.jpg";
import Pantalones from "./assets/pantalones.jpg.jpg";
import Deportivos from "./assets/deportivos.jpg.jpg";
import Benefits from "./Components/Benefits";
const categories: Category[] = [
  { title: "Polos", image: Polos },
  { title: "Playeras", image: Playeras },
  { title: "Camisas", image: Camisas },
  { title: "Pantalones", image: Pantalones },
  { title: "Deportivos", image: Deportivos },
];

export default function Home(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 3000); // Cambiar cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Benefits Section */}
      <Benefits />

      {/* Featured Categories */}
      <AnimatedSection className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Categorías Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.title}
                image={category.image}
                title={category.title}
                isActive={index === activeCategory}
                index={index}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductCard
              image="/placeholder.svg?height=500&width=400"
              title="Camiseta Premium"
              price="29.99"
              discount="39.99"
            />
            <ProductCard
              image="/placeholder.svg?height=500&width=400"
              title="Jeans Slim Fit"
              price="49.99"
            />
            <ProductCard
              image="/placeholder.svg?height=500&width=400"
              title="Chaqueta de Cuero"
              price="89.99"
              discount="119.99"
            />
            <ProductCard
              image="/placeholder.svg?height=500&width=400"
              title="Vestido Elegante"
              price="59.99"
            />
          </div>
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-orange-500 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg">
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Us Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Por Qué Elegirnos?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Contenedor de la imagen */}
            <div className="flex justify-center">
              <img
                src={imgWhyUs}
                alt="Nuestro equipo"
                width={400} // Reducir el tamaño de la imagen
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>

            {/* Contenedor de los beneficios */}
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4 hover:bg-gray-50 hover:shadow-md p-3 rounded-r-lg transition-all">
                <h3 className="text-2xl font-bold mb-2 text-blue-800">
                  Calidad Premium
                </h3>
                <p className="text-gray-600">
                  Utilizamos los mejores materiales para garantizar la
                  durabilidad y comodidad de nuestras prendas.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4 hover:bg-gray-50 hover:shadow-md p-3 rounded-r-lg transition-all">
                <h3 className="text-2xl font-bold mb-2 text-blue-800">
                  Diseño Único
                </h3>
                <p className="text-gray-600">
                  Nuestros diseñadores crean piezas exclusivas que no
                  encontrarás en ningún otro lugar.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4 hover:bg-gray-50 hover:shadow-md p-3 rounded-r-lg transition-all">
                <h3 className="text-2xl font-bold mb-2 text-blue-800">
                  Sostenibilidad
                </h3>
                <p className="text-gray-600">
                  Comprometidos con el medio ambiente, utilizamos procesos de
                  producción responsables.
                </p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4 hover:bg-gray-50 hover:shadow-md p-3 rounded-r-lg transition-all">
                <h3 className="text-2xl font-bold mb-2 text-blue-800">
                  Precios Justos
                </h3>
                <p className="text-gray-600">
                  Ofrecemos la mejor relación calidad-precio del mercado sin
                  intermediarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Personalize Section */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Personaliza Tus Prendas
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Crea ropa única que refleje tu personalidad. Nuestro servicio de
                personalización te permite diseñar prendas exclusivas.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full p-1 mr-3 mt-1">
                    <Shirt className="w-5 h-5" />
                  </span>
                  <span className="text-gray-700">
                    Elige el modelo de prenda que prefieras
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full p-1 mr-3 mt-1">
                    <Shirt className="w-5 h-5" />
                  </span>
                  <span className="text-gray-700">
                    Selecciona colores, estampados y acabados
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full p-1 mr-3 mt-1">
                    <Shirt className="w-5 h-5" />
                  </span>
                  <span className="text-gray-700">
                    Añade textos, imágenes o diseños propios
                  </span>
                </li>
              </ul>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg mt-4">
                Personalizar Ahora
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src={imagenCustom}
                alt="Personalización de ropa"
                width={600}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}

// Animated Section Component
function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Category Card Component
function CategoryCard({
  image,
  title,
  isActive,
  index,
}: CategoryCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative h-32 rounded-lg shadow-lg overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-white"
        initial={false}
        animate={{
          opacity: isActive ? 0 : 1,
        }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>
      <div className="relative h-full flex items-center justify-center p-4">
        <h3
          className={`text-xl lg:text-2xl font-bold text-center py-4 px-6 rounded-lg ${
            isActive ? "text-white  " : "text-gray-800"
          }`}
        >
          {title}
        </h3>
      </div>
    </motion.div>
  );
}

// Product Card Component
function ProductCard({
  image,
  title,
  price,
  discount,
}: ProductCardProps): JSX.Element {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg mb-4 shadow-lg border-2 border-transparent hover:border-orange-400 transition-all">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={500}
          className="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 m-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ShoppingBag className="w-5 h-5" />
        </div>
        {discount && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 m-2 rounded-full">
            Oferta
          </div>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <div className="flex items-center gap-2">
        <span className="font-bold text-blue-700">${price}</span>
        {discount && (
          <span className="text-gray-500 line-through text-sm">
            ${discount}
          </span>
        )}
      </div>
    </div>
  );
}
