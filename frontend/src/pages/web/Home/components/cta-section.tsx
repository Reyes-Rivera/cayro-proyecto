"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Star,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  text: string;
  color: string;
};

const features: Feature[] = [
  { icon: Check, text: "Envío Gratis", color: "text-green-300" },
  { icon: Star, text: "Calidad Premium", color: "text-yellow-300" },
  { icon: RefreshCw, text: "Devolución Fácil", color: "text-blue-300" },
];

export default function CTASection() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [areButtonsVisible, setAreButtonsVisible] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>(() =>
    new Array(features.length).fill(false)
  );

  const headerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Header visibility
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setIsHeaderVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (headerRef.current) io.observe(headerRef.current);
    return () => io.disconnect();
  }, []);

  // Buttons visibility
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setAreButtonsVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAreButtonsVisible(true), 200);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "30px" }
    );

    if (buttonsRef.current) io.observe(buttonsRef.current);
    return () => io.disconnect();
  }, []);

  // Features visibility (staggered)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setVisibleFeatures(new Array(features.length).fill(true));
      return;
    }

    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          features.forEach((_, index) => {
            const t = setTimeout(() => {
              setVisibleFeatures((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, 400 + index * 100);
            timeouts.push(t);
          });
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "30px" }
    );

    if (featuresRef.current) io.observe(featuresRef.current);

    return () => {
      io.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 max-w-full">
        {/* Header */}
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

        {/* Buttons */}
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
            aria-label="Ver catálogo de productos"
          >
            Ver catálogo
            <ArrowRight className="ml-2 w-5 h-5" />
          </NavLink>

          <NavLink
            to="/contacto"
            className="px-6 md:px-8 py-3 md:py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/10 transition-all border-2 border-white flex items-center justify-center"
            aria-label="Ir a la página de contacto"
          >
            Contáctanos
          </NavLink>
        </div>

        {/* Features */}
        <div ref={featuresRef} className="flex flex-wrap justify-center gap-4">
          {features.map(({ icon: Icon, text, color }, index) => (
            <div
              key={text}
              className={`bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 transition-all duration-500 ease-out ${
                visibleFeatures[index]
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-80"
              }`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
