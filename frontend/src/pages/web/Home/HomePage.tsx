"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Shirt,
  ArrowRight,
  Star,
  ChevronRight,
  Shield,
  Truck,
  Headphones,
  RefreshCw,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import type { JSX } from "react/jsx-runtime";
import imgWhyUs from "./assets/whyus.jpg";
import custom from "./assets/personalizar.jpg";
import Playeras from "./assets/playeras.jpg.jpg";
import Camisas from "./assets/camisas.jpg";
import Polos from "./assets/polos.jpg.jpg";
import Pantalones from "./assets/pantalones.jpg.jpg";
import Deportivos from "./assets/deportivos.jpg.jpg";
import FeaturedProductsCarousel from "./components/featured-products-carousel";

// Types
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

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


// Loading Component
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
        Cargando...
      </p>
    </div>
  );
};

const categories: Category[] = [
  { title: "Polos", image: Polos },
  { title: "Playeras", image: Playeras },
  { title: "Camisas", image: Camisas },
  { title: "Pantalones", image: Pantalones },
  { title: "Deportivos", image: Deportivos },
];

// TypewriterText Component
const TypewriterText = ({
  texts,
  delay = 150, // Aumentamos el delay para reducir la frecuencia de actualizaciones
  deleteSpeed = 80, // Aumentamos la velocidad de borrado
}: {
  texts: string[];
  delay?: number;
  deleteSpeed?: number;
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const type = () => {
      const i = currentTextIndex % texts.length;
      const fullText = texts[i];

      if (isDeleting) {
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
      } else {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
      }

      timeout = setTimeout(() => {
        if (!isDeleting && displayedText === fullText) {
          setIsDeleting(true);
          timeout = setTimeout(() => {
            type();
          }, deleteSpeed); // Delay before deleting
        } else if (isDeleting && displayedText === "") {
          setIsDeleting(false);
          setCurrentTextIndex((prevIndex) => prevIndex + 1);
          timeout = setTimeout(type, 500); // Delay before typing next word
        } else {
          type();
        }
      }, delay);
    };

    timeout = setTimeout(type, 500);

    return () => clearTimeout(timeout);
  }, [currentTextIndex, displayedText, isDeleting, texts, delay, deleteSpeed]);

  return <>{displayedText}</>;
};

// Animated Section Component
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <motion.section
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 50 }, // Reducimos la distancia de animación
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.4, ease: "easeOut" }} // Reducimos la duración
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Category Card Component
const CategoryCard: React.FC<CategoryCardProps> = ({
  image,
  title,
  isActive,
  index,
}) => {
  const animationControls = useAnimation();

  useEffect(() => {
    if (isActive) {
      animationControls.start({
        scale: 1.05, // Reducimos el efecto de escala
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)", // Sombra menos intensa
      });
    } else {
      animationControls.start({
        scale: 1,
        boxShadow: "none",
      });
    }
  }, [isActive, animationControls]);

  return (
    <motion.div
      animate={animationControls}
      transition={{ duration: 0.2 }} // Aceleramos la transición
      className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <img
        src={image || "/placeholder.svg?height=300&width=300"}
        alt={title}
        className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110 max-w-full"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="absolute top-2 right-2 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
        {index + 1}
      </div>
    </motion.div>
  );
};



export default function Home(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [animateHero, setAnimateHero] = useState<boolean>(false);
  // useEffect(() => {
  //   throw new Error('Prueba de Error desde React');
  // }, []);
  
  
  // Simulamos la carga de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Activamos las animaciones del hero después de que la pantalla de carga desaparezca
      setTimeout(() => {
        setAnimateHero(true);
      }, 100);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {};

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
    }, 3000);

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
    <>
      {isLoading && <LoadingScreen />}
      <main className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
        {/* Hero Section - Two column layout with content left, images right */}
        <div className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center">
          <div className="container mx-auto px-6 py-16 relative z-10 max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      animateHero
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      NUEVA COLECCIÓN
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={
                      animateHero
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -20 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  >
                    Estilo que <span className="text-blue-600">define</span> tu
                    personalidad
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-6 flex items-center text-lg text-gray-700 dark:text-gray-300"
                  >
                    <span className="mr-2">Descubre</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
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
                  </motion.div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
                  Nuestra nueva colección combina estilo contemporáneo con
                  materiales sostenibles. Cada prenda está diseñada para
                  destacar tu personalidad y brindarte la máxima comodidad.
                </p>

                <div className="flex flex-wrap gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Envío rápido
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Calidad premium
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Devolución fácil
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                  >
                    <NavLink to="/productos" className="flex items-center">
                      Explorar colección
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </NavLink>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full transition-all"
                  >
                    <NavLink to="/contacto">Contactar</NavLink>
                  </motion.button>
                </div>
              </motion.div>

              {/* Right column - Images */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                }
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Main featured image */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    animateHero ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-20 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={Playeras || "/placeholder.svg?height=400&width=600"}
                    alt="Featured collection"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                      Destacado
                    </span>
                    <h3 className="text-xl font-bold mt-2">
                      Categoría destacada
                    </h3>
                  </div>
                </motion.div>

                {/* Grid of category images */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="grid grid-cols-2 gap-4 mt-4"
                >
                  {categories.slice(0, 4).map((category, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-xl group shadow-lg"
                    >
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.title}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-2 left-3 text-white font-medium text-sm">
                        {category.title}
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70 z-0"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70 z-0"></div>

                {/* Floating badge */}
                <div className="absolute top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      Nueva Temporada
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
            onClick={scrollToCategories}
          >
            <motion.div
              animate={animateHero ? { y: [0, 10, 0] } : { y: 0 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Descubre más
              </p>
              <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700">
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Benefits Section - Enhanced with hover effects */}
        <section
          id="categories-section"
          className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-full">
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
        <AnimatedSection className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
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

          <div className="container mx-auto px-6 relative z-10 max-w-full">
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

        {/* Featured Products Carousel */}
        <FeaturedProductsCarousel />

        {/* Why Us Section - Enhanced with interactive elements */}
        <AnimatedSection className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-full">
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
                      rotate: [0, 3, 0, -3, 0], // Reducimos el rango de rotación
                      scale: [1, 1.01, 1, 1.01, 1], // Reducimos el efecto de escala
                    }}
                    transition={{
                      duration: 12, // Aumentamos la duración para que sea más suave
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"
                  ></motion.div>
                  <motion.div
                    animate={{
                      rotate: [0, -5, 0, 5, 0],
                      scale: [1, 1.02, 1, 1.02, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
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

          <div className="container mx-auto px-6 relative z-10 max-w-full">
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
                  Crea ropa única que refleje tu personalidad. Nuestro servicio
                  de personalización te permite diseñar prendas exclusivas.
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
                      x: [0, 4, 0, -4, 1],
                      y: [0, -4, 0, 4, 0],
                      rotate: [0, 1, 0, -1, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute inset-0 border-2 border-blue-600 rounded-lg transform translate-x-4 translate-y-4 z-0"
                  ></motion.div>
                  <img
                    src={custom || "/placeholder.svg"}
                    alt="Personalización de ropa"
                    width={690}
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

          <div className="container mx-auto px-6 text-center relative z-10 max-w-full">
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
    </>
  );
}
