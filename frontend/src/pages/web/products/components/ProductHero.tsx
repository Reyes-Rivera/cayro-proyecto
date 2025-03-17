"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronDown } from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import backgroundImage from "../../Home/assets/hero.jpg";
import { getProducts } from "@/api/products";
import type { Product } from "../utils/products";

export default function ProductHero() {
  const [scrollY, setScrollY] = useState(0);
  const [product, setProduct] = useState<Product>();

  // Handle parallax effect on scroll
  useEffect(() => {
    const getProduct = async () => {
      const res = await getProducts();
      setProduct(res.data[0]);
    };
    getProduct();
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-grid");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden h-screen flex flex-col justify-center">
      {/* Background with parallax effect - increased brightness */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: `translateY(${scrollY * 0.2}px)`,
          filter: "brightness(0.85)", // Increased from 0.7 to 0.85
        }}
      />
      {/* Gradient overlay - reduced opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />{" "}
      {/* Reduced opacity values */}
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
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
              CATÁLOGO DE PRODUCTOS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            >
              <span className="block">Descubre nuestra</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                colección exclusiva
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-300 max-w-md"
            >
              Explora nuestra selección de prendas diseñadas con los mejores
              materiales y acabados de alta calidad para todos los estilos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-4"
            >
              <motion.button
                onClick={scrollToProducts}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200"
              >
                Ver productos
                <ChevronDown className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden md:block relative"
          >
            <div className="relative flex justify-center">
              {" "}
              {/* Added flex and justify-center */}
              {/* Decorative circle */}
              <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/10 to-blue-600/10 blur-2xl" />
              {/* Featured product image - made smaller */}
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="relative z-10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-2xl max-w-[280px]" // Added max-width and reduced padding
              >
                <img
                  src={
                    product?.variants[0]?.imageUrl ||
                    "/placeholder.svg?height=400&width=300"
                  }
                  alt="Producto destacado"
                  className="w-full h-auto rounded-lg object-cover"
                  style={{ maxHeight: "350px" }} // Added max-height
                />

                <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  {" "}
                  {/* Made badge smaller */}
                  DESTACADO
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-white [&_*]:!text-white/80 hover:[&_*]:!text-white"
        >
          <Breadcrumbs />
        </motion.div>
      </div>
      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToProducts}
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
