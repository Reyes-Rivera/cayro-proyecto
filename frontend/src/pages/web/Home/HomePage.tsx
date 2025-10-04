"use client";

import type React from "react";
import { lazy, Suspense, memo } from "react";

import BenefitsSection from "./components/BenefitsSection";
import WhyUsSection from "./components/WhyUsSection";
import PersonalizeSection from "./components/PersonalizeSection";
import CTASection from "./components/cta-section";

const HomeHero = lazy(() => import("./components/HeroPage"));

import WhyUs from "./assets/whyus.webp";

const FullscreenFallback: React.FC<{ label: string }> = ({ label }) => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[90vh] w-full flex items-center justify-center text-gray-500 dark:text-gray-400"
  >
    {label}
  </div>
);

const Home: React.FC = () => {
  return (
    <main className="min-h-screen mt-5 bg-white dark:bg-gray-900 overflow-x-hidden">
      <Suspense fallback={<FullscreenFallback label="Cargando..." />}>
        <HomeHero />
      </Suspense>

      <BenefitsSection />
      <WhyUsSection imgWhyUs={WhyUs} />
      <PersonalizeSection />
      <CTASection />
    </main>
  );
};

export default memo(Home);
