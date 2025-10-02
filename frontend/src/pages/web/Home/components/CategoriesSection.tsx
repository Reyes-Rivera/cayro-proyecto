"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import Polos from "../assets/polos.webp";
import Playeras from "../assets/playeras.webp";
import Camisas from "../assets/camisas.webp";
import Pantalones from "../assets/pantalones.webp";
import Deportivos from "../assets/deportivos.webp";

interface Category {
  id: number;
  title: string;
  description: string;
  image: string; // los imports .webp resuelven a string
  link: string;
}

export default function CategoriesSection() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<boolean[]>([]);
  const [isCtaVisible, setIsCtaVisible] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  // 👇 Importante: tipamos como HTMLLIElement porque las refs se asignan a <li>
  const categoryRefs = useRef<Array<HTMLLIElement | null>>([]);

  const categories: Category[] = [
    {
      id: 1,
      title: "Polos",
      description: "Elegantes y cómodos para cualquier ocasión",
      image: Polos,
      link: "/productos?categoria=polos",
    },
    {
      id: 2,
      title: "Playeras",
      description: "Básicos esenciales para tu guardarropa",
      image: Playeras,
      link: "/productos?categoria=playeras",
    },
    {
      id: 3,
      title: "Camisas",
      description: "Formales y casuales para el día a día",
      image: Camisas,
      link: "/productos?categoria=camisas",
    },
    {
      id: 4,
      title: "Pantalones",
      description: "Comodidad y estilo en cada paso",
      image: Pantalones,
      link: "/productos?categoria=pantalones",
    },
    {
      id: 5,
      title: "Deportivos",
      description: "Para tu estilo de vida activo",
      image: Deportivos,
      link: "/productos?categoria=deportivos",
    },
  ];

  // Inicializamos el array de visibilidad según la cantidad de categorías
  useEffect(() => {
    setVisibleCategories(new Array(categories.length).fill(false));
    // mantenemos el array de refs alineado en tamaño
    categoryRefs.current = new Array(categories.length).fill(null);
  }, [categories.length]);

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

    if (headerRef.current) observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  // Categories visibility con efecto escalonado
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categoryRefs.current.forEach((el, index) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleCategories((prev) => {
                const next = [...prev];
                next[index] = true;
                return next;
              });
            }, index * 100);
            obs.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: "30px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories.length]);

  // CTA visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsCtaVisible(true), 600);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "30px" }
    );

    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/10 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ease-out ${
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            EXPLORA
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Categorías Destacadas
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Descubre nuestra amplia variedad de prendas diseñadas para cada
            ocasión y estilo de vida
          </p>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <li
              key={category.id}
              ref={(el: HTMLLIElement | null) => {
                categoryRefs.current[index] = el;
              }}
              className={`transition-all duration-700 ease-out will-change-[opacity,transform] ${
                visibleCategories[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <Link to={category.link} className="group block h-full">
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 h-full transform hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-white dark:bg-gray-800">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      loading="eager"
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=300&width=300&text=" +
                          encodeURIComponent(category.title);
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
                      {category.id}
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                        <h3
                          className="text-xl font-bold text-white mb-1 drop-shadow-2xl transform transition-transform duration-300 group-hover:translate-y-[-2px]"
                          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                        >
                          {category.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-300">
                      <span>Explorar</span>
                      <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`mt-12 md:mt-16 text-center transition-all duration-700 ease-out ${
            isCtaVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            to="/productos"
            className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
          >
            Ver todas las categorías
            <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
