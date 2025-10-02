"use client";

import type React from "react";
import { memo } from "react";
import { Sparkles } from "lucide-react";

interface WhyUsSectionProps {
  imgWhyUs?: string;
  title?: string;
  className?: string;
}

const WhyUsSection: React.FC<WhyUsSectionProps> = ({
  imgWhyUs,
  title = "¿Por Qué Elegirnos?",
  className = "",
}) => {
  const benefits: Array<{ title: string; description: string }> = [
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
    <section
      role="region"
      aria-labelledby="whyus-heading"
      className={`py-24 bg-white dark:bg-gray-900 relative overflow-hidden ${className}`}
    >
      {/* Fondo simple, sin animaciones */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-full">
        {/* Encabezado sin animaciones de entrada */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
            NUESTRA DIFERENCIA
          </span>

          <h2
            id="whyus-heading"
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            {title}
          </h2>

          <div className="h-1 bg-blue-600 mx-auto mt-6 w-24" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Imagen (lazy) */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full z-0"
                aria-hidden="true"
              />

              <img
                src={
                  imgWhyUs ||
                  "/placeholder.svg?height=500&width=500&text=Equipo"
                }
                alt="Nuestro equipo"
                width={500}
                height={500}
                loading="lazy"
                decoding="async"
                className="rounded-lg shadow-xl relative z-10"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.svg?height=500&width=500&text=Equipo";
                }}
              />

              {/* Insignia estática */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg z-20 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  Calidad Garantizada
                </span>
              </div>
            </div>
          </div>

          {/* Beneficios (solo hover suave) */}
          <div className="space-y-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="border-l-4 border-blue-600 pl-6 rounded-r-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
