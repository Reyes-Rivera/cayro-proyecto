"use client";

import type React from "react";
import { useEffect, useRef, useState, memo, lazy, Suspense } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { CompanyProfile } from "@/types/CompanyInfo";
import { getCompanyInfoApi } from "@/api/company";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import Loader from "@/components/web-components/Loader";
import img from "./assets/contact.png";
// Types
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Animated Section Component - Optimized with reduced animation complexity
const AnimatedSection = memo(
  ({ children, className }: AnimatedSectionProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
      if (isInView) {
        mainControls.start("visible");
      }
    }, [isInView, mainControls]);

    return (
      <motion.section
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 50 }, // Reduced distance
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.3, ease: "easeOut" }} // Reduced duration
        className={className}
      >
        {children}
      </motion.section>
    );
  }
);
AnimatedSection.displayName = "AnimatedSection";

// Lazy load contact form section to reduce initial load
const ContactFormSection = lazy(
  () => import("./components/ContactFormSection")
);
// Lazy load map section to reduce initial load
const MapSection = lazy(() => import("./components/MapSection"));

export default function ContactPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [animateHero, setAnimateHero] = useState(false);
  // Simulamos la carga de la página - Reduced timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
      // Activamos las animaciones del hero después de que la pantalla de carga desaparezca
      setTimeout(() => {
        setAnimateHero(true);
      }, 100);
    }, 1000); // Reduced from 1500ms to 1000ms

    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll function - Optimized to use requestAnimationFrame
  const scrollToContent = () => {
    const contactSection = document.getElementById("contact-cards");
    if (contactSection) {
      const startPosition = window.pageYOffset;
      const targetPosition =
        contactSection.getBoundingClientRect().top + window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 500; // ms
      let startTime: number | null = null;

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = (t: number) =>
          t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad

        window.scrollTo(0, startPosition + distance * ease(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  };

  const [info, setInfo] = useState<CompanyProfile>();
  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await getCompanyInfoApi();
        if (res) {
          setInfo(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };
    getInfo();
  }, []);

  return (
    <>
      {isPageLoading && <Loader />}
      <div className="min-h-screen mt-5 bg-white dark:bg-gray-900 overflow-x-hidden">
        {/* Hero Section - Two column layout with content left, image right */}
        <div className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center">
          {/* Background decoration - Enhanced with about page style */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50/80 to-transparent dark:from-blue-950/20 dark:to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-70 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-60 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 py-16 relative z-10 max-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                }
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={
                    animateHero ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                  }
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={
                      animateHero
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.9 }
                    }
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
                  >
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      ESTAMOS AQUÍ PARA AYUDARTE
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={
                      animateHero
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: -20 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  >
                    Nos encantaría{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10 text-blue-600">
                        hablar contigo
                      </span>
                      <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                    </span>
                  </motion.h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-lg"
                >
                  Estamos listos para convertir tus ideas en prendas
                  excepcionales que representen tu visión. Cuéntanos sobre tu
                  proyecto y hagámoslo realidad juntos.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-wrap gap-6 mt-8"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {info?.contactInfo[0]?.phone || "+52 123 456 7890"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {info?.contactInfo[0]?.email || "contacto@empresa.com"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {info?.contactInfo[0]?.address ||
                        "Calle Principal #123, Ciudad"}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    animateHero ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                    onClick={scrollToContent}
                  >
                    <span className="flex items-center">
                      Contáctanos ahora
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </motion.button>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`tel:${
                      info?.contactInfo[0]?.phone || "+521234567890"
                    }`}
                    className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Llamar ahora
                  </motion.a>
                </motion.div>
                <Breadcrumbs />
              </motion.div>

              {/* Right column - Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                }
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    animateHero ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-20 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={img}
                    alt="Contacto y atención al cliente"
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>

              
              </motion.div>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <AnimatedSection className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          {/* Background decoration - Enhanced with about page style */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full"></div>
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4">
                CONTACTO
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Estamos aquí para{" "}
                <span className="text-blue-600">ayudarte</span>
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Teléfono */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

                {/* Icono con fondo dinámico */}
                <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/20">
                    <Phone className="w-8 h-8" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                  Llámanos
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10 font-medium">
                  {info?.contactInfo[0]?.phone || "+52 123 456 7890"}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center relative z-10">
                  <Clock className="w-4 h-4 mr-1 inline" />
                  Lunes a Viernes: 9am - 6pm
                </p>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

                {/* Icono con fondo dinámico */}
                <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/20">
                    <Mail className="w-8 h-8" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                  Escríbenos
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10 font-medium">
                  {info?.contactInfo[0]?.email || "contacto@empresa.com"}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center relative z-10">
                  <CheckCircle className="w-4 h-4 mr-1 inline" />
                  Te respondemos en menos de 24 horas
                </p>
              </motion.div>

              {/* Ubicación */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

                {/* Icono con fondo dinámico */}
                <div className="mb-6 transform group-hover:scale-110 transition-transform relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/20">
                    <MapPin className="w-8 h-8" />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                  Visítanos
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed relative z-10 font-medium">
                  {info?.contactInfo[0]?.address ||
                    "Calle Principal #123, Ciudad"}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center relative z-10">
                  <Clock className="w-4 h-4 mr-1 inline" />
                  Horario: 9am - 6pm (Lun-Vie)
                </p>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Form Section - Lazy loaded */}
        <Suspense
          fallback={
            <div className="py-24 bg-white dark:bg-gray-900 h-96 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          }
        >
          <ContactFormSection />
        </Suspense>

        {/* Map Section - Lazy loaded */}
        <Suspense
          fallback={
            <div className="py-24 bg-gray-50 dark:bg-gray-800 h-96 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          }
        >
          <MapSection info={info} />
        </Suspense>

        {/* CTA Section - Enhanced with about page style */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
              className="absolute bottom-0 left-0 w-full h-64 text-white/5"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill="currentColor"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill="currentColor"
              ></path>
            </svg>
          </div>

          <div className="container mx-auto px-6 text-center relative z-10 max-w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold mb-6"
              >
                ¿Listo para comenzar tu proyecto?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-blue-100 text-lg max-w-2xl mx-auto mb-10"
              >
                Permítenos ayudarte a crear las prendas perfectas para tu
                empresa, equipo o evento especial.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToContent}
                  className="group px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Contactar ahora
                    <motion.span
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </motion.span>
                  </span>
                  <span className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`tel:${info?.contactInfo[0]?.phone || "+521234567890"}`}
                  className="group px-8 py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/10 transition-all border-2 border-white flex items-center justify-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Phone className="mr-2 w-5 h-5" />
                    Llamar ahora
                  </span>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.a>
              </motion.div>

              {/* Floating badges - Added from about page style */}
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  animate={{ y: [0, -10, 0] }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Respuesta Rápida</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  animate={{ y: [0, -10, 0] }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium">
                    Diseños Personalizados
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  animate={{ y: [0, -10, 0] }}
                  className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
                >
                  <Clock className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-medium">Entrega Puntual</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
