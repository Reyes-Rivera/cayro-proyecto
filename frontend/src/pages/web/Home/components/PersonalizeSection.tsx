"use client";

import type React from "react";
import { memo, useId } from "react";
import { Sparkles, Shirt, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import img from "../assets/personalizar.webp";

/**
 * PersonalizeSection (versión optimizada)
 * - Sin IntersectionObserver ni estados de animación.
 * - Imagen en lazy + decoding async.
 * - Transiciones reducidas a hovers (transition-colors únicamente).
 * - Mantiene el SVG decorativo con id único para evitar colisiones.
 */
const PersonalizeSection: React.FC = () => {
  const patternId = useId();

  const steps: Array<{ title: string; description: string }> = [
    {
      title: "Elige tu modelo",
      description: "Selecciona entre nuestra amplia variedad de prendas base",
    },
    {
      title: "Personaliza el diseño",
      description: "Selecciona colores, estampados y acabados a tu gusto",
    },
    {
      title: "Añade tu toque personal",
      description: "Incorpora textos, imágenes o diseños propios a tu prenda",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decoración de fondo (ligera, sin animaciones) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
        aria-hidden="true"
      >
        <svg
          className="absolute top-0 right-0 w-full h-full text-blue-500/5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`dots-${patternId}`}
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#dots-${patternId})`} />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Columna izquierda: contenido */}
          <div className="order-2 lg:order-1 space-y-6">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              <Sparkles className="w-4 h-4 mr-2" />
              PERSONALIZACIÓN
            </span>

            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Personaliza Tus Prendas
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Crea ropa única que refleje tu personalidad. Nuestro servicio de
              personalización te permite diseñar prendas exclusivas.
            </p>

            <ul className="space-y-5">
              {steps.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow">
                    <Shirt className="w-5 h-5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div>
              <NavLink
                to="/personalizar"
                aria-label="Ir al personalizador"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors inline-flex items-center shadow"
              >
                <span className="flex items-center">
                  Personalizar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </NavLink>
            </div>
          </div>

          {/* Columna derecha: imagen */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div
                className="absolute inset-0 border-2 border-blue-600 rounded-lg translate-x-4 translate-y-4 z-0"
                aria-hidden="true"
              />
              <img
                src={img}
                alt="Personalización de ropa"
                width={600}
                height={600}
                loading="lazy"
                decoding="async"
                className="rounded-lg shadow-xl relative z-10"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.svg?height=600&width=600&text=Personalizar";
                }}
              />

              {/* Insignia fija (sin animaciones) */}
              <div className="absolute top-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-gray-900 dark:text-white">
                  ¡Diseño Único!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(PersonalizeSection);
