"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import Loader from "@/components/web-components/Loader";
import BenefitsSection from "./components/BenefitsSection";
import WhyUsSection from "./components/WhyUsSection";
import PersonalizeSection from "./components/PersonalizeSection";

// Lazy load components
const HomeHero = lazy(() => import("./components/HeroPage"));
const FeaturedProductsCarousel = lazy(
  () => import("./components/featured-products-carousel")
);
const CategoriesSection = lazy(() => import("./components/CategoriesSection"));

// Images
import WhyUs from "./assets/whyus.jpg";
import CTASection from "./components/cta-section";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <main className="min-h-screen mt-5 bg-white dark:bg-gray-900 overflow-x-hidden">
        {/* Hero Section */}
        <Suspense
          fallback={
            <div className="h-screen flex items-center justify-center">
              Cargando...
            </div>
          }
        >
          <HomeHero />
        </Suspense>

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Categories Section */}
        <Suspense
          fallback={
            <div className="py-16 flex items-center justify-center">
              Cargando categorías...
            </div>
          }
        >
          <CategoriesSection />
        </Suspense>

        {/* Featured Products Carousel */}
        <Suspense
          fallback={
            <div className="py-16 flex items-center justify-center">
              Cargando productos...
            </div>
          }
        >
          <FeaturedProductsCarousel />
        </Suspense>

        {/* Why Us Section */}
        <WhyUsSection imgWhyUs={WhyUs} />

        {/* Personalize Section */}
        <PersonalizeSection />

        {/* CTA Section */}
        <CTASection />
      </main>
    </>
  );
}
