"use client";

import type React from "react";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Imágenes
import Playeras from "../assets/playeras.webp";
import Camisas from "../assets/camisas.webp";
import Polos from "../assets/polos.webp";
import Pantalones from "../assets/pantalones.webp";
import Deportivos from "../assets/deportivos.webp";

interface Category {
  title: string;
  image: string;
}

/* =========================
 * TypewriterText
 * =======================*/
const TypewriterText = memo(({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const text = texts[currentTextIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(text.substring(0, currentText.length + 1));
        if (currentText.length === text.length) {
          setTypingSpeed(2000);
          setIsDeleting(true);
        } else {
          setTypingSpeed(100 - Math.random() * 50);
        }
      } else {
        setCurrentText(text.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentTextIndex((currentTextIndex + 1) % texts.length);
          setTypingSpeed(500);
        } else {
          setTypingSpeed(50);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentTextIndex, isDeleting, texts, typingSpeed]);

  return <span>{currentText}</span>;
});
TypewriterText.displayName = "TypewriterText";

/* =========================
 * CategoryCarousel
 * =======================*/
const CategoryCarousel = memo(({ categories }: { categories: Category[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Timers seguros para navegador
  const autoRotateTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const userInteractionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearAuto = useCallback(() => {
    if (autoRotateTimerRef.current) {
      clearInterval(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
  }, []);

  const startAutoRotation = useCallback(() => {
    clearAuto();
    autoRotateTimerRef.current = setInterval(() => {
      if (!isPaused && !userInteracted) {
        setCurrentIndex((prev) =>
          prev === categories.length - 1 ? 0 : prev + 1
        );
      }
    }, 6000);
  }, [categories.length, clearAuto, isPaused, userInteracted]);

  useEffect(() => {
    startAutoRotation();
    return clearAuto;
  }, [startAutoRotation, clearAuto]);

  // Restablecer “interacción de usuario” tras un tiempo
  const resetUserInteraction = useCallback(() => {
    if (userInteractionTimerRef.current) {
      clearTimeout(userInteractionTimerRef.current);
    }
    setUserInteracted(true);
    userInteractionTimerRef.current = setTimeout(() => {
      setUserInteracted(false);
    }, 10000);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
    resetUserInteraction();
  }, [categories.length, resetUserInteraction]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
    resetUserInteraction();
  }, [categories.length, resetUserInteraction]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    resetUserInteraction();
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) handleNext();
    if (touchStart - touchEnd < -50) handlePrev();
  };

  const togglePause = () => {
    setIsPaused((p) => !p);
    resetUserInteraction();
  };

  return (
    <div className="relative w-full mt-4">
      {/* Current slide */}
      <div
        className="overflow-hidden rounded-xl shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative aspect-[16/9] w-full">
          <div
            key={currentIndex}
            className="absolute inset-0 transition-opacity duration-500"
          >
            <img
              src={
                categories[currentIndex].image ||
                "/placeholder.svg?height=500&width=800"
              }
              alt={categories[currentIndex].title}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/placeholder.svg?height=500&width=800";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-bold drop-shadow-md">
                {categories[currentIndex].title}
              </h3>
              <NavLink
                to={`/productos?categoria=${categories[
                  currentIndex
                ].title.toLowerCase()}`}
                className="mt-4 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all"
              >
                Ver colección <ArrowRight className="ml-2 w-4 h-4" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-3 shadow-lg z-20 hover:bg-white hover:scale-110 transition-all"
        aria-label="Previous category"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 rounded-full p-3 shadow-lg z-20 hover:bg-white hover:scale-110 transition-all"
        aria-label="Next category"
      >
        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Play/Pause */}
      <button
        onClick={togglePause}
        className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow-lg z-20 hover:bg-white transition-all"
        aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
      >
        {isPaused ? (
          <Play className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        ) : (
          <Pause className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              resetUserInteraction();
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-blue-600 w-6"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
            aria-label={`Go to category ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});
CategoryCarousel.displayName = "CategoryCarousel";

/* =========================
 * HomeHero
 * =======================*/
const HomeHero = () => {
  const [animateHero, setAnimateHero] = useState(false);

  const categories: Category[] = [
    { title: "Playeras", image: Playeras },
    { title: "Camisas", image: Camisas },
    { title: "Polos", image: Polos },
    { title: "Pantalones", image: Pantalones },
    { title: "Deportivos", image: Deportivos },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimateHero(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[90vh] bg-white dark:bg-gray-900 flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50/50 dark:from-blue-900/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500/30 rounded-full" />
          <div className="absolute top-40 left-40 w-3 h-3 bg-blue-500/20 rounded-full" />
          <div className="absolute top-60 left-60 w-2 h-2 bg-blue-500/30 rounded-full" />
          <div className="absolute top-20 right-40 w-3 h-3 bg-blue-500/20 rounded-full" />
          <div className="absolute top-60 right-60 w-2 h-2 bg-blue-500/30 rounded-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: text */}
          <div
            className={`md:col-span-5 transition-all duration-700 ${
              animateHero
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              NUEVA COLECCIÓN
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Estilo que{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600 dark:text-blue-400">
                  define
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
              </span>{" "}
              tu personalidad
            </h1>

            <div className="mt-6 flex items-center text-lg text-gray-700 dark:text-gray-300">
              <span className="mr-2">Descubre</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                <TypewriterText
                  texts={[
                    "calidad premium",
                    "diseños exclusivos",
                    "tendencias actuales",
                    "comodidad garantizada",
                  ]}
                />
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mt-6 text-lg max-w-xl">
              Nuestra nueva colección combina estilo contemporáneo con
              materiales sostenibles. Cada prenda está diseñada para destacar tu
              personalidad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <NavLink
                to="/productos"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-600/20 transform hover:scale-105 duration-300"
              >
                <span className="flex items-center">
                  Explorar colección
                  <ArrowRight className="ml-2 w-4 h-4" />
                </span>
              </NavLink>

              <NavLink
                to="/contacto"
                className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105 duration-300 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              >
                Contactar
              </NavLink>
            </div>
          </div>

          {/* Right: carousel */}
          <div
            className={`md:col-span-7 transition-all duration-700 ${
              animateHero
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
              <CategoryCarousel categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeHero);
