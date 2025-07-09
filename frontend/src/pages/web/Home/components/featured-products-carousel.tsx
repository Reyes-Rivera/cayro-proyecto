"use client";

import { useState, useEffect, useRef, memo } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Product } from "@/types/products";
import { getProducts } from "@/api/products";
import ProductCard from "../../products/components/ProductCard";

const FeaturedProductsCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  



  // Number of products to display at once based on screen size
  const getItemsToShow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2; // Mobile - 2 products
      if (window.innerWidth < 1024) return 3; // Tablet - 3 products
      if (window.innerWidth < 1280) return 4; // Small desktop - 4 products
      return 4; // Large desktop - 4 products
    }
    return 4; // Default for SSR
  };

  const [itemsToShow, setItemsToShow] = useState(getItemsToShow());

  // Update items to show on window resize - with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setItemsToShow(getItemsToShow());
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "12");

        const response = await getProducts(params.toString());

        if (response && response.data) {
          let productsData: Product[] = [];

          // Handle different API response formats
          if (response.data.data && Array.isArray(response.data.data)) {
            // Paginated response format
            productsData = response.data.data;
          } else if (Array.isArray(response.data)) {
            // Direct array format
            productsData = response.data;
          } else {
            productsData = [];
          }

          // Filter products to only include those with variants and images
          const validProducts = productsData.filter((product: Product) => {
            return (
              product.variants &&
              product.variants.length > 0 &&
              product.variants.some(
                (variant) =>
                  variant.images &&
                  variant.images.length > 0 &&
                  variant.stock > 0
              )
            );
          });

          setProducts(validProducts.slice(0, 8)); // Get first 8 valid products
        } else {
          setProducts([]);
        }
      } catch (err: any) {
        
        setError(err.response?.data?.message || "No se pudieron cargar los productos destacados.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Navigation functions
  const nextSlide = () => {
    if (products.length <= itemsToShow) return;
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, products.length - itemsToShow);
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  const prevSlide = () => {
    if (products.length <= itemsToShow) return;
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, products.length - itemsToShow);
      return prevIndex === 0 ? maxIndex : prevIndex - 1;
    });
  };

  // Auto-advance carousel - with pause on hover
  useEffect(() => {
    if (products.length <= itemsToShow) return;
    if (hoveredProduct !== null) return; // Pause when hovering over a product

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, products.length, itemsToShow, hoveredProduct]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              PRODUCTOS DESTACADOS
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Nuestra Selección Especial
            </h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 md:mt-6"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-3 md:p-4">
                    <div className="h-4 md:h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 md:h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
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
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <p className="text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
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
    <section
      ref={sectionRef}
      className="py-12 md:py-16 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 md:mb-12 opacity-100 translate-y-0">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            PRODUCTOS DESTACADOS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Nuestra Selección Especial
          </h2>
          <div className="h-1 bg-blue-600 mx-auto mt-4 md:mt-6 w-24"></div>
        </div>

        <div className="relative">
          {/* Carousel navigation buttons */}
          {products.length > itemsToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Carousel container */}
          <div className="overflow-hidden" ref={carouselRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  (currentIndex * 100) / itemsToShow
                }%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex-none px-2 md:px-3 ${
                    itemsToShow === 2
                      ? "w-1/2"
                      : itemsToShow === 3
                      ? "w-1/3"
                      : "w-1/4"
                  }`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <ProductCard
                    product={product}
                    isHovered={hoveredProduct === product.id}
                    onHover={() => setHoveredProduct(product.id)}
                    onLeave={() => setHoveredProduct(null)}
                    viewMode="grid"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel indicators */}
          {products.length > itemsToShow && (
            <div className="flex justify-center mt-6 md:mt-8 gap-2">
              {Array.from({
                length: Math.max(1, products.length - itemsToShow + 1),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-blue-600 w-4 md:w-6"
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
};

export default memo(FeaturedProductsCarousel);
