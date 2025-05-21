"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Star,
  ChevronRight,
  Shield,
  Truck,
  Headphones,
  RefreshCw,
  Check,
  Sparkles,
  Shirt,
} from "lucide-react";
import FeaturedProductsCarousel from "./components/featured-products-carousel";

// Importaciones de imágenes
import Playeras from "./assets/playeras.jpg.jpg";
import Camisas from "./assets/camisas.jpg";
import Polos from "./assets/polos.jpg.jpg";
import Pantalones from "./assets/pantalones.jpg.jpg";
import Deportivos from "./assets/deportivos.jpg.jpg";
import HomeHero from "./components/HeroPage";
import { NavLink } from "react-router-dom";
import WhyUs from "./assets/whyus.jpg";
import Custom from "./assets/personalizar.jpg";
import Loader from "@/components/web-components/Loader";
// Types
interface Category {
  title: string;
  image: string;
}

interface CategoryCardProps {
  image: string;
  title: string;
  isActive: boolean;
  index: number;
}


const categories: Category[] = [
  { title: "Polos", image: Polos },
  { title: "Playeras", image: Playeras },
  { title: "Camisas", image: Camisas },
  { title: "Pantalones", image: Pantalones },
  { title: "Deportivos", image: Deportivos },
];

// Category Card Component - Simplified animation
const CategoryCard = ({ image, title, isActive, index }: CategoryCardProps) => {
  return (
    <div
      className={`relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${
        isActive ? "ring-2 ring-blue-500 scale-[1.02]" : ""
      }`}
    >
      <img
        src={image || "/placeholder.svg?height=300&width=300"}
        alt={title}
        className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105 max-w-full"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
        {index + 1}
      </div>
    </div>
  );
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Reduced loading time and simplified loading logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reduced loading time

    return () => clearTimeout(timer);
  }, []);

  // Simplified category rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 4000); // Increased interval time

    return () => clearInterval(interval);
  }, []);

  const benefits = [
    {
      icon: Shield,
      title: "Garantía de Calidad",
      description: "Materiales premium y acabados perfectos en cada prenda.",
    },
    {
      icon: Truck,
      title: "Envío Rápido",
      description:
        "Entrega garantizada en tiempo y forma para inicio de clases.",
    },
    {
      icon: Headphones,
      title: "Soporte 24/7",
      description:
        "Equipo de atención al cliente siempre disponible para ayudarte.",
    },
    {
      icon: RefreshCw,
      title: "Cambios Sencillos",
      description: "Política de cambios flexible para tu tranquilidad.",
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <main className="min-h-screen mt-5 bg-white dark:bg-gray-900 overflow-x-hidden">
        {/* Hero Section */}
        <HomeHero />

        {/* Benefits Section - Simplified */}
        <section
          id="categories-section"
          className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
        >
          <div className="container mx-auto px-6 relative z-10 max-w-full">
            <div className="text-center mb-16">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
                NUESTROS BENEFICIOS
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Por qué comprar con nosotros
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
            </div>

            {/* Lista de beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

                    {/* Icono con fondo dinámico */}
                    <div className="mb-6 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>
                    {/* Título */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                      {benefit.title}
                    </h3>
                    {/* Descripción */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                      {benefit.description}
                    </p>

                    {/* Número decorativo */}
                    <div className="absolute -right-2 -top-2 text-8xl font-bold text-blue-500/5 dark:text-blue-500/10 select-none">
                      {index + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 max-w-full">
            <div className="text-center mb-16">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
                EXPLORA
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Categorías Destacadas
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
            </div>

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

            <div className="mt-12 text-center">
              <NavLink
                to="/productos"
                className="group inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Ver todas las categorías
                <ChevronRight className="w-5 h-5 ml-1" />
              </NavLink>
            </div>
          </div>
        </section>

        {/* Featured Products Carousel */}
        <FeaturedProductsCarousel />

        {/* Why Us Section */}
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 max-w-full">
            <div className="text-center mb-16">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
                NUESTRA DIFERENCIA
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                ¿Por Qué Elegirnos?
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contenedor de la imagen */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"></div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full z-0"></div>
                  <img
                    src={WhyUs}
                    alt="Nuestro equipo"
                    width={500}
                    height={500}
                    className="rounded-lg shadow-xl relative z-10"
                  />

                  {/* Floating badge */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      Calidad Garantizada
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenedor de los beneficios */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
                  <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                    Calidad Premium
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Utilizamos los mejores materiales para garantizar la
                    durabilidad y comodidad de nuestras prendas.
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
                  <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                    Diseño Único
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Nuestros diseñadores crean piezas exclusivas que no
                    encontrarás en ningún otro lugar.
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
                  <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                    Sostenibilidad
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Comprometidos con el medio ambiente, utilizamos procesos de
                    producción responsables.
                  </p>
                </div>
                <div className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all">
                  <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                    Precios Justos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Ofrecemos la mejor relación calidad-precio del mercado sin
                    intermediarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personalize Section */}
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10 max-w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  PERSONALIZACIÓN
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  Personaliza Tus Prendas
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Crea ropa única que refleje tu personalidad. Nuestro servicio
                  de personalización te permite diseñar prendas exclusivas.
                </p>
                <ul className="space-y-6 mb-10">
                  <li className="flex items-start">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow-md">
                      <Shirt className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        Elige tu modelo
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Selecciona entre nuestra amplia variedad de prendas base
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow-md">
                      <Shirt className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        Personaliza el diseño
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Selecciona colores, estampados y acabados a tu gusto
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow-md">
                      <Shirt className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                        Añade tu toque personal
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        Incorpora textos, imágenes o diseños propios a tu prenda
                      </p>
                    </div>
                  </li>
                </ul>
                <div>
                  <NavLink
                    to="/personalizar"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg inline-flex items-center"
                  >
                    Personalizar Ahora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </NavLink>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute inset-0 border-2 border-blue-600 rounded-lg transform translate-x-4 translate-y-4 z-0"></div>
                  <img
                    src={Custom}
                    alt="Personalización de ropa"
                    width={690}
                    height={600}
                    className="rounded-lg shadow-xl relative z-10"
                  />

                  {/* Floating badge */}
                  <div className="absolute top-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      ¡Diseño Único!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10 max-w-full">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                ¿Listo para renovar tu guardarropa?
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
                Descubre nuestra colección completa y encuentra las prendas
                perfectas para cada ocasión.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <NavLink
                  to="/productos"
                  className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center"
                >
                  Ver catálogo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </NavLink>
                <NavLink
                  to="/contacto"
                  className="px-8 py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/10 transition-all border-2 border-white flex items-center justify-center"
                >
                  Contáctanos
                </NavLink>
              </div>

              {/* Floating badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Envío Gratis</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Calidad Premium</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium">Devolución Fácil</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
