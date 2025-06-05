"use client";

import { Sparkles } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

interface WhyUsSectionProps {
  imgWhyUs: string;
}

const WhyUsSection = ({ imgWhyUs }: WhyUsSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      title: "Calidad Premium",
      description:
        "Utilizamos los mejores materiales para garantizar la durabilidad y comodidad de nuestras prendas.",
    },
    {
      title: "Diseño Único",
      description:
        "Nuestros diseñadores crean piezas exclusivas que no encontrarás en ningún otro lugar.",
    },
    {
      title: "Sostenibilidad",
      description:
        "Comprometidos con el medio ambiente, utilizamos procesos de producción responsables.",
    },
    {
      title: "Precios Justos",
      description:
        "Ofrecemos la mejor relación calidad-precio del mercado sin intermediarios.",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
      </div>

      <div
        className="container mx-auto px-6 relative z-10 max-w-full"
        ref={sectionRef}
      >
        <div className="text-center mb-16">
          <span
            className={`inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4 transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5"
            }`}
          >
            NUESTRA DIFERENCIA
          </span>
          <h2
            className={`text-3xl md:text-5xl font-bold text-gray-900 dark:text-white transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-5"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            ¿Por Qué Elegirnos?
          </h2>
          <div
            className={`h-1 bg-blue-600 mx-auto mt-6 transition-all duration-700 ${
              isVisible ? "w-24" : "w-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          ></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenedor de la imagen */}
          <div
            className={`flex justify-center transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full z-0"></div>
              <img
                src={imgWhyUs || "/placeholder.svg"}
                alt="Nuestro equipo"
                width={500}
                height={500}
                className="rounded-lg shadow-xl relative z-10"
                loading="lazy"
              />

              {/* Floating badge */}
              <div
                className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  Calidad Garantizada
                </span>
              </div>
            </div>
          </div>

          {/* Contenedor de los beneficios */}
          <div
            className={`space-y-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="border-l-4 border-blue-600 pl-6 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md p-4 rounded-r-lg transition-all"
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <h3 className="text-2xl font-bold mb-3 text-blue-700 dark:text-blue-400">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(WhyUsSection);
