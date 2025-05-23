"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Product } from "../../../../types/products";
import { getProducts } from "@/api/products";
import ProductCard from "../../products/components/ProductCard";

export default function FeaturedProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Number of products to display at once based on screen size
  const getItemsToShow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1; // Mobile
      if (window.innerWidth < 1024) return 2; // Tablet
      if (window.innerWidth < 1280) return 3; // Small desktop
      return 4; // Large desktop
    }
    return 4; // Default for SSR
  };

  const [itemsToShow, setItemsToShow] = useState(getItemsToShow());

  // Update items to show on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsToShow());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getProducts();
        if (response.data) {
          // Filter products to only include those with variants
          const validProducts = response.data.filter(
            (product:any) =>
              product.variants && product.variants.length > 0 && product.active
          );
          setProducts(validProducts.slice(0, 8)); // Get first 8 valid products
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos destacados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Navigation functions
  const nextSlide = () => {
    if (products.length <= itemsToShow) return;
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow >= products.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (products.length <= itemsToShow) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, products.length - itemsToShow)
        : prevIndex - 1
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    if (products.length <= itemsToShow) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, products.length, itemsToShow]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              PRODUCTOS DESTACADOS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Nuestra Selección Especial
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // No products with variants
  if (products.length === 0) {
    return null; // Don't render the section if no products are available
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            PRODUCTOS DESTACADOS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Nuestra Selección Especial
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1 bg-blue-600 mx-auto mt-6"
          ></motion.div>
        </div>

        <div className="relative">
          {/* Carousel navigation buttons */}
          {products.length > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 md:-translate-x-0"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 md:translate-x-0"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Carousel container */}
          <div className="overflow-hidden" ref={carouselRef}>
            <motion.div
              className="flex"
              animate={{
                x: `-${currentIndex * (100 / itemsToShow)}%`,
              }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3"
                >
                  <ProductCard
                    product={product}
                    isHovered={hoveredProduct === product.id}
                    onHover={() => setHoveredProduct(product.id)}
                    onLeave={() => setHoveredProduct(null)}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Carousel indicators */}
          {products.length > itemsToShow && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({
                length: Math.ceil((products.length - itemsToShow + 1) / 1),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-blue-600 w-6"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
