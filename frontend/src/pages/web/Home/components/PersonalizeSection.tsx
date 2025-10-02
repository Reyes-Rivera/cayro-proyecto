"use client";

import type React from "react";
import { memo, useEffect, useRef, useState, useId } from "react";
import { Sparkles, Shirt, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import img from "../assets/personalizar.webp";

const PersonalizeSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const patternId = useId(); // evita colisiones en múltiples renders de esta sección

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } as IntersectionObserverInit
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const steps: Array<{ title: string; description: string; delay: string }> = [
    {
      title: "Elige tu modelo",
      description: "Selecciona entre nuestra amplia variedad de prendas base",
      delay: "500ms",
    },
    {
      title: "Personaliza el diseño",
      description: "Selecciona colores, estampados y acabados a tu gusto",
      delay: "600ms",
    },
    {
      title: "Añade tu toque personal",
      description: "Incorpora textos, imágenes o diseños propios a tu prenda",
      delay: "700ms",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg
          className="absolute top-0 right-0 w-full h-full text-blue-500/5"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
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

      <div
        className="container mx-auto px-6 relative z-10 max-w-full"
        ref={sectionRef}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Columna izquierda */}
          <div
            className={`order-2 lg:order-1 space-y-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span
              className={`inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4 transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              PERSONALIZACIÓN
            </span>

            <h2
              className={`text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Personaliza Tus Prendas
            </h2>

            <p
              className={`text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              Crea ropa única que refleje tu personalidad. Nuestro servicio de
              personalización te permite diseñar prendas exclusivas.
            </p>

            <ul
              className={`space-y-6 mb-10 transition-all duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              {steps.map((item, index) => (
                <li
                  key={index}
                  className={`flex items-start transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-5"
                  }`}
                  style={{ transitionDelay: item.delay }}
                >
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full p-2 mr-4 mt-1 shadow-md">
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

            <div
              className={`transition-all duration-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <NavLink
                to="/personalizar"
                aria-label="Ir al personalizador"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg inline-flex items-center"
              >
                <span className="flex items-center">
                  Personalizar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </NavLink>
            </div>
          </div>

          {/* Columna derecha */}
          <div
            className={`order-1 lg:order-2 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative">
              <div className="absolute inset-0 border-2 border-blue-600 rounded-lg translate-x-4 translate-y-4 z-0" />
              <img
                src={img}
                alt="Personalización de ropa"
                width={600}
                height={600}
                className="rounded-lg shadow-xl relative z-10 will-change-transform"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.svg?height=600&width=600&text=Personalizar";
                }}
              />

              {/* Insignia flotante */}
              <div
                className={`absolute top-4 -right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-2 transition-all duration-700 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
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
