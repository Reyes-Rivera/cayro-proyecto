"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import heroImage from "../../Home/assets/hero.webp";
import { NavLink } from "react-router-dom";

// Memoizar partículas para evitar recreación en cada render
const ParticleBackground = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 10 + 15,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 md:w-2 md:h-2 bg-blue-400 rounded-full opacity-70"
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: ["0%", "-100%"],
            opacity: [particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function AboutHero() {
  const [scrollY, setScrollY] = useState(0);

  // Throttle scroll handler para mejor performance
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    // Usar passive scroll listener para mejor performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Smooth scroll function
  const scrollToContent = useCallback(() => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Memoizar transform style para evitar recálculos
  const backgroundStyle = useMemo(
    () => ({
      backgroundImage: `url(${heroImage})`,
      transform: `translateY(${scrollY * 0.2}px)`,
      filter: "brightness(0.85)",
    }),
    [scrollY]
  );

  // Animation variants memoizados
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delay,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      className="relative overflow-hidden h-screen flex flex-col justify-center"
      aria-labelledby="about-hero-heading"
    >
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={backgroundStyle}
        aria-hidden="true"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
      </div>

      {/* Animated particles */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 flex flex-col justify-center flex-grow">
        <div className="grid md:grid-cols-1 gap-8 items-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white space-y-6"
          >
            {/* Badge */}
            <motion.div
              custom={0.2}
              variants={itemVariants}
              className="inline-flex items-center justify-center rounded-full bg-blue-600/30 backdrop-blur-sm border border-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-100"
            >
              CONÓCENOS
            </motion.div>

            {/* Heading */}
            <motion.h1
              custom={0.3}
              variants={itemVariants}
              id="about-hero-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="block">¿Quiénes Somos?</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                Nuestra Historia
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={0.4}
              variants={itemVariants}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Descubre nuestra historia, valores y lo que nos hace únicos en la
              industria textil. Conoce a las personas detrás de cada prenda que
              fabricamos.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              custom={0.5}
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center overflow-hidden relative"
              >
                <NavLink
                  to="/contacto"
                  className="relative z-10 flex items-center"
                >
                  Contáctanos
                </NavLink>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                  aria-hidden="true"
                ></span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 flex items-center justify-center overflow-hidden relative"
              >
                <NavLink to="/productos" className="relative z-10">
                  Ver catálogo
                </NavLink>
                <span
                  className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                  aria-hidden="true"
                ></span>
              </motion.button>
            </motion.div>

            {/* Breadcrumbs */}
            <motion.div
              custom={0.7}
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4 justify-center"
            >
              <div className="text-white [&_*]:!text-white flex justify-center">
                <Breadcrumbs />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToContent}
        role="button"
        tabIndex={0}
        aria-label="Desplazarse hacia abajo para ver más contenido"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToContent();
          }
        }}
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
            <div
              className="w-1 h-6 rounded-full bg-gradient-to-b from-white/80 to-white/0"
              aria-hidden="true"
            />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm"
              aria-hidden="true"
            >
              <ChevronDown className="w-4 h-4 text-white" aria-hidden="true" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
