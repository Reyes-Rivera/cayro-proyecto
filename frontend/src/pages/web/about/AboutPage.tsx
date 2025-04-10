"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Leaf,
  Users,
  Award,
  Target,
  ChevronRight,
  Clock,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getCompanyInfoApi } from "@/api/company";
import type { CompanyProfile } from "@/types/CompanyInfo";

// Import your images
import mission from "./assets/mission.jpg";
import vision from "./assets/vision.jpg";
import about from "./assets/about.jpg";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

// Types
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

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
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function AboutPage() {
  const [info, setInfo] = useState<CompanyProfile>();

  // Smooth scroll function
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfoApi();
      if (res) {
        setInfo(res.data[0]);
      }
    };
    getInfo();
  }, []);

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
    <div className="bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section - Two column layout with content left, images right */}
      <div className="relative min-h-[90vh] bg-white dark:bg-gray-900 flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/80 to-transparent dark:from-blue-950/20 dark:to-transparent"></div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-70 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-60 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10 max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
                >
                  <Users className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    NUESTRA EMPRESA
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  Conoce nuestra{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-blue-600">
                      historia
                    </span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                  </span>{" "}
                  y valores
                </motion.h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg"
              >
                Somos una empresa especializada en la fabricación y venta de
                ropa de alta calidad. Nos destacamos por ofrecer prendas con
                diseños modernos, cómodos y duraderos, adaptándonos a las
                necesidades de cada cliente.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-6 mt-8"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    +25 años de experiencia
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Calidad garantizada
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Compromiso con clientes
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                  onClick={scrollToAbout}
                >
                  <span className="flex items-center">
                    Descubrir más
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full transition-all"
                >
                  <NavLink to="/contacto">Contactar</NavLink>
                </motion.button>
              </motion.div>
              <Breadcrumbs />
            </motion.div>

            {/* Right column - Images */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main featured image */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative z-20 rounded-2xl overflow-hidden shadow-2xl"
              >
                <img
                  src={about || "/placeholder.svg?height=400&width=600"}
                  alt="Nuestra empresa"
                  className="w-full h-auto object-cover max-w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                    Desde 1995
                  </span>
                  <h3 className="text-xl font-bold mt-2">Nuestra historia</h3>
                </div>
              </motion.div>

              {/* Grid of smaller images */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid grid-cols-2 gap-4 mt-4"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative overflow-hidden rounded-xl group shadow-lg"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <img
                    src={mission || "/placeholder.svg?height=150&width=150"}
                    alt="Misión"
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110 max-w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-2 left-3 text-white font-medium text-sm">
                    Misión
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="relative overflow-hidden rounded-xl group shadow-lg"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <img
                    src={vision || "/placeholder.svg?height=150&width=150"}
                    alt="Visión"
                    className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110 max-w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-2 left-3 text-white font-medium text-sm">
                    Visión
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    Calidad Premium
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          onClick={scrollToAbout}
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
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Descubre más
            </p>
            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700"
            >
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* About Section */}
      <AnimatedSection
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
              NUESTRA HISTORIA
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Creando calidad desde 1995
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Somos una empresa especializada en la fabricación y venta de
                ropa de alta calidad, incluyendo playeras, polos, camisas,
                pantalones, ropa deportiva y uniformes personalizados.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                Nos destacamos por ofrecer prendas con diseños modernos, cómodos
                y duraderos, adaptándonos a las necesidades de cada cliente.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      +25 años
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      de experiencia
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Calidad
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      garantizada
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
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
                src={about || "/placeholder.svg?height=600&width=600"}
                alt="Quienes-somos"
                className="rounded-lg shadow-2xl w-full relative z-10 transform transition-transform duration-500 hover:scale-105 max-w-full"
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
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Misión y Visión Section */}
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
              PROPÓSITO
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Nuestra Misión y Visión
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto mt-6"
            ></motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Misión */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

              {/* Icono con fondo dinámico */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/20">
                  <Target className="w-8 h-8" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                Nuestra Misión
              </h3>

              {/* Descripción */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border-l-4 border-blue-600 mb-6 relative z-10">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
                  "
                  {info?.mission ||
                    "Nuestra misión es proporcionar prendas de vestir de la más alta calidad, combinando diseño innovador, materiales premium y técnicas de fabricación avanzadas para satisfacer las necesidades de nuestros clientes."}
                  "
                </p>
              </div>

              <div className="flex items-center relative z-10">
                <ChevronRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Comprometidos con la excelencia en cada prenda
                </span>
              </div>
            </motion.div>

            {/* Visión */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

              {/* Icono con fondo dinámico */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/20">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                Nuestra Visión
              </h3>

              {/* Descripción */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border-l-4 border-blue-600 mb-6 relative z-10">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
                  "
                  {info?.vision ||
                    "Ser reconocidos como líderes en la industria textil, destacándonos por la innovación, calidad y servicio excepcional, mientras expandimos nuestra presencia a nivel nacional e internacional."}
                  "
                </p>
              </div>

              <div className="flex items-center relative z-10">
                <ChevronRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">
                  Innovando constantemente en diseños y materiales
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Valores Section */}
      <AnimatedSection className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
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
              LO QUE NOS DEFINE
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Nuestros <span className="text-blue-600">Valores</span>
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto mt-6"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mt-6"
            >
              Estos principios fundamentales guían nuestras acciones y
              decisiones cada día, definiendo quiénes somos como empresa y cómo
              servimos a nuestros clientes.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Compromiso */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

              {/* Icono con fondo dinámico */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/20">
                  <Users className="w-8 h-8" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                Compromiso
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                Estamos comprometidos con nuestros clientes, garantizando
                productos y servicios que superen sus expectativas.
              </p>

              {/* Número decorativo */}
              <div className="absolute -right-2 -top-2 text-8xl font-bold text-blue-500/5 dark:text-blue-500/10 select-none">
                1
              </div>
            </motion.div>

            {/* Sostenibilidad */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

              {/* Icono con fondo dinámico */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-green-500/20">
                  <Leaf className="w-8 h-8" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                Sostenibilidad
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                Incorporamos prácticas responsables para cuidar el medio
                ambiente y promover la sostenibilidad en cada etapa de
                producción.
              </p>

              {/* Número decorativo */}
              <div className="absolute -right-2 -top-2 text-8xl font-bold text-green-500/5 dark:text-green-500/10 select-none">
                2
              </div>
            </motion.div>

            {/* Integridad */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

              {/* Icono con fondo dinámico */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-amber-500/20">
                  <Shield className="w-8 h-8" />
                </div>
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                Integridad
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                Actuamos con honestidad, transparencia y ética en todas nuestras
                relaciones y actividades.
              </p>

              {/* Número decorativo */}
              <div className="absolute -right-2 -top-2 text-8xl font-bold text-amber-500/5 dark:text-amber-500/10 select-none">
                3
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
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
              ¿Listo para trabajar con nosotros?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-100 text-lg max-w-2xl mx-auto mb-10"
            >
              Permítenos ayudarte a crear las prendas perfectas para tu empresa,
              equipo o evento especial.
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
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Calidad Premium</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                animate={{ y: [0, -10, 0] }}
                className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
              >
                <Users className="w-5 h-5 text-blue-300" />
                <span className="text-sm font-medium">Equipo Profesional</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                animate={{ y: [0, -10, 0] }}
                className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
              >
                <Target className="w-5 h-5 text-green-300" />
                <span className="text-sm font-medium">Compromiso Total</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
