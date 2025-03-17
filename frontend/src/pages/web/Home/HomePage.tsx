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
  Shield,
  Truck,
  Headphones,
  RefreshCw,
  Check,
  Sparkles,
  TrendingUp,
  ChevronDown,
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

import { NavLink } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

const categories: Category[] = [
  { title: "Polos", image: Polos },
  { title: "Playeras", image: Playeras },
  { title: "Camisas", image: Camisas },
  { title: "Pantalones", image: Pantalones },
  { title: "Deportivos", image: Deportivos },
];

export default function Home(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [scrollY, setScrollY] = useState(0);

  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById("categories-section");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      {/* Hero Section - Redesigned based on ProductHero */}
      <div className="relative overflow-hidden h-screen flex flex-col justify-center">
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${Hero})`,
            transform: `translateY(${scrollY * 0.2}px)`,
            filter: "brightness(0.85)",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-blue-400 rounded-full opacity-70"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [null, "-100%"],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col justify-center flex-grow">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-white space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center rounded-full bg-blue-600/30 backdrop-blur-sm border border-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-100"
              >
                <ShoppingBag className="w-4 h-4 mr-2 text-blue-300" />
                BIENVENIDO A NUESTRA TIENDA
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                <span className="block">Moda y estilo con</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                  {/* Replace TypewriterComponent with custom implementation */}
                  <TypewriterText
                    texts={[
                      "calidad premium",
                      "diseños exclusivos",
                      "tendencias actuales",
                      "comodidad garantizada",
                    ]}
                    delay={80}
                    deleteSpeed={50}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-300 max-w-md"
              >
                Explora nuestra colección de prendas y accesorios. Desde ropa
                casual hasta ropa deportiva, tenemos todo lo que necesitas para
                lucir increíble en cualquier ocasión.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center overflow-hidden relative"
                >
                  <NavLink
                    to="/productos"
                    className="relative z-10 flex items-center"
                  >
                    Ver catálogo
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.span>
                  </NavLink>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 flex items-center justify-center overflow-hidden relative"
                >
                  <NavLink to="/contacto" className="relative z-10">
                    Contáctanos
                  </NavLink>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">Calidad Premium</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Envío Garantizado</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Tendencias 2025</span>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:block relative"
            >
              <div className="relative flex justify-center">
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/10 blur-2xl" />

                {/* Featured product image */}
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  className="relative z-10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src={Playeras || "/placeholder.svg?height=300&width=250"}
                      alt="Producto destacado"
                      className="w-full h-auto rounded-lg object-cover shadow-lg transform transition-all duration-500 hover:scale-105"
                    />
                    <img
                      src={Camisas || "/placeholder.svg?height=300&width=250"}
                      alt="Producto destacado"
                      className="w-full h-auto rounded-lg object-cover shadow-lg transform transition-all duration-500 hover:scale-105"
                    />
                    <img
                      src={Polos || "/placeholder.svg?height=300&width=250"}
                      alt="Producto destacado"
                      className="w-full h-auto rounded-lg object-cover shadow-lg transform transition-all duration-500 hover:scale-105"
                    />
                    <img
                      src={
                        Pantalones || "/placeholder.svg?height=300&width=250"
                      }
                      alt="Producto destacado"
                      className="w-full h-auto rounded-lg object-cover shadow-lg transform transition-all duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    DESTACADOS
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToCategories}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-white/80 text-sm font-medium">Descubre más</p>
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-white/80 to-white/0" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm"
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Benefits Section - Enhanced with hover effects */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full"></div>
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
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
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
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
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

                  {/* Icono con fondo dinámico */}
                  <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/20">
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories - Enhanced with 3D effect */}
      <AnimatedSection
        className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute top-0 left-0 w-full h-full text-blue-500/5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 0 L40 0 L40 40 L0 40 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
            >
              EXPLORA
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Categorías Destacadas
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto mt-6"
            ></motion.div>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <NavLink
              to="/categorias"
              className="group inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Ver todas las categorías
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="ml-1"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.span>
            </NavLink>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Featured Products - Enhanced with hover effects */}
      <AnimatedSection className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              LO MÁS VENDIDO
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Productos Destacados
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto mt-6"
            ></motion.div>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-16"
          >
            <NavLink
              to="/productos"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg inline-flex items-center relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Ver Todos los Productos
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </NavLink>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Why Us Section - Enhanced with interactive elements */}
      <AnimatedSection className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
            >
              NUESTRA DIFERENCIA
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              ¿Por Qué Elegirnos?
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto mt-6"
            ></motion.div>
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
                <motion.div
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.02, 1, 1.02, 1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"
                ></motion.div>
                <motion.div
                  animate={{
                    rotate: [0, -5, 0, 5, 0],
                    scale: [1, 1.02, 1, 1.02, 1],
                  }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full z-0"
                ></motion.div>
                <img
                  src={imgWhyUs || "/placeholder.svg"}
                  alt="Nuestro equipo"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-xl relative z-10 transform transition-transform duration-500 hover:scale-105"
                />

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  animate={{ y: [0, -10, 0] }}
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">
                    Calidad Garantizada
                  </span>
                </motion.div>
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
              <motion.div
                whileHover={{ x: 10 }}
                className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all"
              >
                <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                  Calidad Premium
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Utilizamos los mejores materiales para garantizar la
                  durabilidad y comodidad de nuestras prendas.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ x: 10 }}
                className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all"
              >
                <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                  Diseño Único
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nuestros diseñadores crean piezas exclusivas que no
                  encontrarás en ningún otro lugar.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ x: 10 }}
                className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all"
              >
                <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                  Sostenibilidad
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprometidos con el medio ambiente, utilizamos procesos de
                  producción responsables.
                </p>
              </motion.div>
              <motion.div
                whileHover={{ x: 10 }}
                className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all"
              >
                <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                  Precios Justos
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ofrecemos la mejor relación calidad-precio del mercado sin
                  intermediarios.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Personalize Section - Enhanced with interactive elements */}
      <AnimatedSection className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute top-0 right-0 w-full h-full text-blue-500/5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots-pattern"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 space-y-6"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                PERSONALIZACIÓN
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
              >
                Personaliza Tus Prendas
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              >
                Crea ropa única que refleje tu personalidad. Nuestro servicio de
                personalización te permite diseñar prendas exclusivas.
              </motion.p>
              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-6 mb-10"
              >
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start"
                >
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
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-start"
                >
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
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-start"
                >
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
                </motion.li>
              </motion.ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <NavLink
                  to="/personalizar"
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg inline-flex items-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Personalizar Ahora
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </NavLink>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    x: [0, 4, 0, -4, 0],
                    y: [0, -4, 0, 4, 0],
                    rotate: [0, 1, 0, -1, 0],
                  }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 border-2 border-blue-600 rounded-lg transform translate-x-4 translate-y-4 z-0"
                ></motion.div>
                <img
                  src={imagenCustom || "/placeholder.svg"}
                  alt="Personalización de ropa"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-xl relative z-10 transform transition-all duration-500 hover:translate-x-2 hover:translate-y-2"
                />

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  animate={{ y: [0, -10, 0] }}
                  className="absolute top-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white">
                    ¡Diseño Único!
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section - Enhanced with gradient and animation */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute bottom-0 left-0 w-full h-64 text-white/5"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="currentColor"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              ¿Listo para renovar tu guardarropa?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-100 text-lg max-w-2xl mx-auto mb-10"
            >
              Descubre nuestra colección completa y encuentra las prendas
              perfectas para cada ocasión.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <NavLink
                to="/productos"
                className="group px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Ver catálogo
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </motion.span>
                </span>
                <span className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </NavLink>
              <NavLink
                to="/contacto"
                className="group px-8 py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/10 transition-all border-2 border-white flex items-center justify-center relative overflow-hidden"
              >
                <span className="relative z-10">Contáctanos</span>
                <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </NavLink>
            </motion.div>

            {/* Floating badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                animate={{ y: [0, -10, 0] }}
                className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
              >
                <Check className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">Envío Gratis</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                animate={{ y: [0, -10, 0] }}
                className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
              >
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Calidad Premium</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                animate={{ y: [0, -10, 0] }}
                className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-medium">Devolución Fácil</span>
              </motion.div>
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
      whileHover={{
        scale: 1.05,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="relative h-48 rounded-xl shadow-lg overflow-hidden group cursor-pointer transform transition-all duration-300"
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
      whileHover={{
        y: -10,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="group bg-white dark:bg-gray-800 rounded-xl p-4 transition-all duration-300"
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
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

// Custom TypewriterText Component
function TypewriterText({
  texts,
  delay = 80,
  deleteSpeed = 50,
}: {
  texts: string[];
  delay?: number;
  deleteSpeed?: number;
}): JSX.Element {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Adding characters
          if (currentText.length < text.length) {
            setCurrentText(text.substring(0, currentText.length + 1));
          } else {
            // Start deleting after a pause
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          // Removing characters
          if (currentText.length > 0) {
            setCurrentText(text.substring(0, currentText.length - 1));
          } else {
            // Move to next text
            setIsDeleting(false);
            setCurrentTextIndex((currentTextIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : delay
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts, delay, deleteSpeed]);

  return <span>{currentText || "\u00A0"}</span>;
}
