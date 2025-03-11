"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import imagenCustom from "./assets/personalizar.jpg";
import imgWhyUs from "./assets/whyus.jpg";
import {
  ShoppingBag,
  Shirt,
  ArrowRight,
  Star,
  ChevronRight,
  Heart,
  Eye,
} from "lucide-react";
import type {
  AnimatedSectionProps,
  Category,
  CategoryCardProps,
  ProductCardProps,
} from "./types";
import Hero from "./assets/hero.jpg";
import Playeras from "./assets/playeras.jpg.jpg";
import Camisas from "./assets/camisas.jpg";
import Polos from "./assets/polos.jpg.jpg";
import Pantalones from "./assets/pantalones.jpg.jpg";
import Deportivos from "./assets/deportivos.jpg.jpg";
import { Shield, Truck, Headphones, RefreshCw, Check } from "lucide-react";

import { NavLink } from "react-router-dom";
import TypewriterComponent from "typewriter-effect";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section
        className="min-h-screen mt-14 lg:mt-0 bg-cover bg-center bg-fixed relative flex items-center justify-center text-center px-4"
        style={{ backgroundImage: `url(${Hero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-3xl text-white"
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm mb-6">
            BIENVENIDO A NUESTRA TIENDA
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
            <TypewriterComponent
              options={{
                strings: [
                  "Moda y Estilo con Calidad",
                  "Explora Nuestra Colección",
                  "Ropa Casual y Deportiva",
                  "Comodidad al vestir",
                  "Tendencias Actuales",
                ],
                autoStart: true,
                loop: true,
                delay: 80,
                deleteSpeed: 50,
              }}
            />
          </h1>
          <p className="text-lg md:text-xl mb-10 text-blue-50 max-w-2xl mx-auto">
            Explora nuestra colección de prendas y accesorios. Desde ropa casual
            hasta ropa deportiva, tenemos todo lo que necesitas para lucir
            increíble en cualquier ocasión.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <NavLink
              to={"/productos"}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Ver catálogo
              <ArrowRight className="ml-2 w-5 h-5" />
            </NavLink>
            <NavLink
              to={"/contacto"}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 flex items-center justify-center"
            >
              Contáctanos
            </NavLink>
          </div>

          <div className="mt-16 flex justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Calidad Premium</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm">Envío Garantizado</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
              NUESTROS BENEFICIOS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Por qué comprar con nosotros
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </motion.div>

          {/* Lista de beneficios */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-2 group"
                >
                  {/* Icono con fondo dinámico */}
                  <div className="mb-6 transform group-hover:scale-110 transition-transform">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  {/* Título */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  {/* Descripción */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <AnimatedSection className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
              EXPLORA
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
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
              to="/categorias"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Ver todas las categorías
              <ChevronRight className="ml-1 w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
              LO MÁS VENDIDO
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Productos Destacados
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>

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

          <div className="text-center mt-16">
            <NavLink
              to="/productos"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              Ver Todos los Productos
              <ArrowRight className="ml-2 w-5 h-5" />
            </NavLink>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Us Section */}
      <AnimatedSection className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
              NUESTRA DIFERENCIA
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              ¿Por Qué Elegirnos?
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenedor de la imagen */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full z-0"></div>
                <img
                  src={imgWhyUs || "/placeholder.svg"}
                  alt="Nuestro equipo"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-xl relative z-10 transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Contenedor de los beneficios */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
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
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Personalize Section */}
      <AnimatedSection className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 space-y-6"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
                PERSONALIZACIÓN
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Personaliza Tus Prendas
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Crea ropa única que refleje tu personalidad. Nuestro servicio de
                personalización te permite diseñar prendas exclusivas.
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
              <NavLink
                to="/personalizar"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
              >
                Personalizar Ahora
                <ArrowRight className="ml-2 w-5 h-5" />
              </NavLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute inset-0 border-2 border-blue-600 rounded-lg transform translate-x-4 translate-y-4 z-0"></div>
                <img
                  src={imagenCustom || "/placeholder.svg"}
                  alt="Personalización de ropa"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-xl relative z-10 transform transition-all duration-500 hover:translate-x-2 hover:translate-y-2"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para renovar tu guardarropa?
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
              Descubre nuestra colección completa y encuentra las prendas
              perfectas para cada ocasión.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <NavLink
                to="/productos"
                className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
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
          </motion.div>
        </div>
      </section>
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
      className="relative h-48 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
    >
      <motion.div
        className="absolute inset-0 bg-white dark:bg-gray-800"
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
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </motion.div>
      <div className="relative h-full flex items-end justify-center p-6">
        <h3
          className={`text-xl font-bold text-center py-3 px-6 rounded-lg ${
            isActive ? "text-white" : "text-gray-800 dark:text-white"
          } transition-all duration-300 transform group-hover:scale-110`}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg border border-gray-100 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={500}
          className="w-full h-[350px] object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay con botones de acción */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors">
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {discount && (
          <div className="absolute top-0 left-0 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1 m-3 rounded-full font-medium">
            Oferta
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <div className="flex items-center gap-2">
        <span className="font-bold text-blue-700 dark:text-blue-400 text-lg">
          ${price}
        </span>
        {discount && (
          <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
            ${discount}
          </span>
        )}
      </div>

      {/* Rating stars */}
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          (24 reseñas)
        </span>
      </div>
    </motion.div>
  );
}
