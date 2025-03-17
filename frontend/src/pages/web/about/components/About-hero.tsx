"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import heroImage from "../../Home/assets/hero.jpg";
import { NavLink } from "react-router-dom";

export default function AboutHero() {
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
  const scrollToContent = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden h-screen flex flex-col justify-center">
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
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
        <div className="grid md:grid-cols-1 gap-8 items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-white space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center rounded-full bg-blue-600/30 backdrop-blur-sm border border-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-100"
            >
              CONÓCENOS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="block">¿Quiénes Somos?</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                Nuestra Historia
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Descubre nuestra historia, valores y lo que nos hace únicos en la
              industria textil. Conoce a las personas detrás de cada prenda que
              fabricamos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 flex items-center justify-center overflow-hidden relative"
              >
                <NavLink to="/productos" className="relative z-10">
                  Ver catálogo
                </NavLink>
                <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
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
  );
}
