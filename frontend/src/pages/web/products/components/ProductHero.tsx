"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import backgroundImage from "../../Home/assets/hero.jpg";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

export default function ProductHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[500px] flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 text-center text-white max-w-5xl px-6"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center justify-center rounded-full bg-blue-600/30 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-100 mb-6 border border-blue-500/20"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          DESCUBRE NUESTRA COLECCIÓN
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200"
        >
          Calidad y estilo en cada prenda
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg md:text-xl mb-8 text-blue-50 max-w-2xl mx-auto"
        >
          Explora nuestra colección de prendas diseñadas con los mejores
          materiales y acabados de alta calidad
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-white [&_*]:!text-white flex justify-center"
        >
          <Breadcrumbs />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
