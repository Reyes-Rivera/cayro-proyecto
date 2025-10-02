"use client";

import type React from "react";
import { lazy, Suspense, useEffect, useState, memo } from "react";

import Loader from "@/components/web-components/Loader";
import BenefitsSection from "./components/BenefitsSection";
import WhyUsSection from "./components/WhyUsSection";
import PersonalizeSection from "./components/PersonalizeSection";
import CTASection from "./components/cta-section";

// Lazy load
const HomeHero = lazy(() => import("./components/HeroPage"));
const FeaturedProductsCarousel = lazy(
  () => import("./components/featured-products-carousel")
);
const CategoriesSection = lazy(() => import("./components/CategoriesSection"));

// Assets
import WhyUs from "./assets/whyus.webp";

/* ---------- Fallbacks / Skeletons ---------- */
const FullscreenFallback: React.FC<{ label: string }> = ({ label }) => (
  <div
    role="status"
    aria-live="polite"
    className="h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-gray-500 dark:text-gray-400"
  >
    {label}
  </div>
);

const SectionFallback: React.FC<{ label: string }> = ({ label }) => (
  <div
    role="status"
    aria-live="polite"
    className="py-16 w-full flex items-center justify-center text-gray-500 dark:text-gray-400"
  >
    {label}
  </div>
);

/* ------------------------------------------ */

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pequeño overlay inicial para evitar parpadeos al montar
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {isLoading && <Loader />}

      <main
        className="min-h-screen mt-5 bg-white dark:bg-gray-900 overflow-x-hidden"
        aria-busy={isLoading}
      >
        {/* Hero */}
        <Suspense fallback={<FullscreenFallback label="Cargando..." />}>
          <HomeHero />
        </Suspense>

        {/* Beneficios (no lazy por ser ligero) */}
        <BenefitsSection />

        {/* Categorías */}
        <Suspense fallback={<SectionFallback label="Cargando categorías..." />}>
          <CategoriesSection />
        </Suspense>

        {/* Productos Destacados */}
        <Suspense fallback={<SectionFallback label="Cargando productos..." />}>
          <FeaturedProductsCarousel />
        </Suspense>

        {/* ¿Por qué nosotros? */}
        <WhyUsSection imgWhyUs={WhyUs} />

        {/* Personaliza */}
        <PersonalizeSection />

        {/* CTA final */}
        <CTASection />
      </main>
    </>
  );
};

export default memo(Home);
