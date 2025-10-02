"use client";

import { memo, useEffect, useRef, useState } from "react";
import {
  Shield,
  Truck,
  Headphones,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const benefits: ReadonlyArray<Benefit> = [
  {
    icon: Shield,
    title: "Garantía de Calidad",
    description: "Materiales premium y acabados perfectos en cada prenda.",
  },
  {
    icon: Truck,
    title: "Envío Rápido",
    description: "Entrega garantizada en tiempo y forma para inicio de clases.",
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description:
      "Equipo de atención al cliente siempre disponible para ayudarte.",
  },
  {
    icon: RefreshCw,
    title: "Cambios Sencillos",
    description: "Política de cambios flexible para tu tranquilidad.",
  },
] as const;

const BenefitsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respeta usuarios con reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    // Guard para entornos sin IntersectionObserver
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      {/* Decoración de fondo (solo visual) */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30"
        aria-hidden="true"
      >
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full" />
      </div>

      <div
        className="container mx-auto px-6 relative z-10 max-w-full"
        ref={sectionRef}
      >
        <div
          className={`text-center mb-16 transition-all duration-700 will-change-[transform,opacity] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
            NUESTROS BENEFICIOS
          </span>
          <h2
            id="benefits-heading"
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Por qué comprar con nosotros
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6" />
        </div>

        {/* Lista de beneficios */}
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          role="list"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <li
                key={benefit.title}
                className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-500 group relative overflow-hidden will-change-[transform,opacity] ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Decoración */}
                <div
                  className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full"
                  aria-hidden="true"
                />

                {/* Icono */}
                <div className="mb-6 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Icon className="w-8 h-8" aria-hidden="true" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                  {benefit.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10">
                  {benefit.description}
                </p>

                {/* Número decorativo */}
                <span
                  className="absolute -right-2 -top-2 text-8xl font-bold text-blue-500/5 dark:text-blue-500/10 select-none"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default memo(BenefitsSection);
