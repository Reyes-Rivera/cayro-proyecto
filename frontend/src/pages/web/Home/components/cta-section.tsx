"use client";

import { ArrowRight, Check, Star, RefreshCw } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const features = [
  { icon: Check, text: "Envío Gratis", color: "text-green-300" },
  { icon: Star, text: "Calidad Premium", color: "text-yellow-300" },
  { icon: RefreshCw, text: "Devolución Fácil", color: "text-blue-300" },
];

export default function CTASection() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [areButtonsVisible, setAreButtonsVisible] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>(
    new Array(features.length).fill(false)
  );

  const headerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Header visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Buttons visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAreButtonsVisible(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "30px" }
    );

    if (buttonsRef.current) {
      observer.observe(buttonsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Features visibility with stagger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          features.forEach((_, index) => {
            setTimeout(() => {
              setVisibleFeatures((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, 400 + index * 100);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "30px" }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-full">
        <div
          ref={headerRef}
          className={`transition-all duration-700 ease-out ${
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6">
            ¿Listo para renovar tu guardarropa?
          </h2>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-10">
            Descubre nuestra colección completa y encuentra las prendas
            perfectas para cada ocasión.
          </p>
        </div>

        <div
          ref={buttonsRef}
          className={`flex flex-col sm:flex-row justify-center gap-4 mb-8 md:mb-12 transition-all duration-700 ease-out ${
            areButtonsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <NavLink
            to="/productos"
            className="px-6 md:px-8 py-3 md:py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center"
          >
            Ver catálogo
            <ArrowRight className="ml-2 w-5 h-5" />
          </NavLink>
          <NavLink
            to="/contacto"
            className="px-6 md:px-8 py-3 md:py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/10 transition-all border-2 border-white flex items-center justify-center"
          >
            Contáctanos
          </NavLink>
        </div>

        <div ref={featuresRef} className="flex flex-wrap justify-center gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.text}
                className={`bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 transition-all duration-500 ease-out ${
                  visibleFeatures[index]
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-80"
                }`}
              >
                <Icon className={`w-5 h-5 ${feature.color}`} />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
