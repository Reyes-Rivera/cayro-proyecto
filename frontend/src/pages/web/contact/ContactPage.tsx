"use client";

import type React from "react";

import { useEffect, useRef, useState, memo, lazy, Suspense } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
  User,
  AtSign,
  Clock,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { CompanyProfile } from "@/types/CompanyInfo";
import { getCompanyInfoApi } from "@/api/company";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

// Types
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Loading Component - Memoized to prevent unnecessary re-renders
const LoadingScreen = memo(() => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
        Cargando...
      </p>
    </div>
  );
});
LoadingScreen.displayName = "LoadingScreen";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [animateHero, setAnimateHero] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    subject: "",
    message: "",
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    console.log(formData);

    // Simulación de envío
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          service: "",
          subject: "",
          message: "",
        });
      }, 3000);
    }, 1500);
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
      {isPageLoading && <LoadingScreen />}
      <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
        {/* Hero Section - Two column layout with content left, images right */}
        <div className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center">
          {/* Background decoration - Simplified */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
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
                    <span className="text-blue-600">hablar contigo</span>
                  </motion.h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg"
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
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                    onClick={scrollToContent}
                  >
                    <span className="flex items-center">
                      Contáctanos ahora
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </button>

                  <a
                    href={`tel:${
                      info?.contactInfo[0]?.phone || "+521234567890"
                    }`}
                    className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Llamar ahora
                  </a>
                </motion.div>
                <Breadcrumbs />
              </motion.div>

              {/* Right column - Contact Form Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={
                  animateHero ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                }
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Main featured form */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    animateHero ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative z-20 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-blue-700"
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="ml-auto">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4">
                      Envíanos un mensaje
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white/60 text-sm mb-1">
                          <User className="w-4 h-4 mr-2" />
                          <span>Nombre</span>
                        </div>
                        <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white/60 text-sm mb-1">
                          <AtSign className="w-4 h-4 mr-2" />
                          <span>Email</span>
                        </div>
                        <div className="h-2 w-4/5 bg-white/20 rounded-full"></div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center text-white/60 text-sm mb-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          <span>Mensaje</span>
                        </div>
                        <div className="h-2 w-1/2 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-2 w-3/4 bg-white/20 rounded-full mb-2"></div>
                        <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                      </div>

                      <div className="bg-white text-blue-600 text-center py-2 rounded-lg font-medium flex items-center justify-center">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar mensaje
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative elements - Simplified */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 z-0"></div>

                {/* Floating badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={
                    animateHero
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0.8, opacity: 0 }
                  }
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-900 dark:text-white text-sm">
                      Respuesta Rápida
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator - Simplified animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={animateHero ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
            onClick={scrollToContent}
          >
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Descubre más
              </p>
              <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700">
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Info Cards */}
        <AnimatedSection
          className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
        >
          {/* Background decoration - Simplified */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
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
                Estamos aquí para ayudarte
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
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full"></div>

                {/* Icono con fondo dinámico */}
                <div className="mb-6 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
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
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full"></div>

                {/* Icono con fondo dinámico */}
                <div className="mb-6 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
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
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full"></div>

                {/* Icono con fondo dinámico */}
                <div className="mb-6 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
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
          <ContactFormSection
            isLoading={isLoading}
            isSubmitted={isSubmitted}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
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

        {/* CTA Section - Simplified */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
          {/* Background decoration - Simplified */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
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
                <button
                  onClick={scrollToContent}
                  className="px-8 py-4 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center"
                >
                  <span className="flex items-center">
                    Contactar ahora
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </button>
                <a
                  href={`tel:${info?.contactInfo[0]?.phone || "+521234567890"}`}
                  className="px-8 py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/10 transition-all border-2 border-white flex items-center justify-center"
                >
                  <span className="flex items-center">
                    <Phone className="mr-2 w-5 h-5" />
                    Llamar ahora
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
