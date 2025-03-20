"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Loader2,
  Instagram,
  Facebook,
  Send,
  MessageSquare,
  User,
  AtSign,
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import type { CompanyProfile } from "@/types/CompanyInfo";
import { getCompanyInfoApi } from "@/api/company";

// Types
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Animated Section Component
const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
}) => {
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
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={mainControls}
      transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    subject: "",
    message: "",
  });

  // Smooth scroll function
  const scrollToContent = () => {
    const contactSection = document.getElementById("contact-cards");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
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
      const res = await getCompanyInfoApi();
      if (res) {
        setInfo(res.data[0]);
      }
    };
    getInfo();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section - Two column layout with content left, images right */}
      <div className="relative min-h-screen bg-white dark:bg-gray-900 flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 py-16 relative z-10 max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  Nos encantaría{" "}
                  <span className="text-blue-600">hablar contigo</span>
                </motion.h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg"
              >
                Estamos listos para convertir tus ideas en prendas excepcionales
                que representen tu visión. Cuéntanos sobre tu proyecto y
                hagámoslo realidad juntos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
                animate={{ opacity: 1, y: 0 }}
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
                  href={`tel:${info?.contactInfo[0]?.phone || "+521234567890"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-full transition-all flex items-center justify-center"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar ahora
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right column - Contact Form Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main featured form */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
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

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70 z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70 z-0"></div>

              {/* Floating badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
          onClick={scrollToContent}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Descubre más
            </p>
            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700"
            >
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Info Cards */}
      <AnimatedSection className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background decoration */}
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
              Estamos aquí para ayudarte
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Teléfono */}
            <motion.div
              variants={itemVariants}
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
              variants={itemVariants}
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
              variants={itemVariants}
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
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Contact Form Section */}
      <AnimatedSection className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg
            className="absolute top-0 left-0 w-full h-full text-blue-500/5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 0 L40 0 L40 40 L0 40 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-full">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
            >
              ENVÍANOS UN MENSAJE
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Cuéntanos sobre tu <span className="text-blue-600">proyecto</span>
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto mt-6"
            ></motion.div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 relative z-10">
              {/* Left Column - Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 p-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <svg
                    className="absolute top-0 right-0 w-full h-full text-white/5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="dots-pattern"
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill="url(#dots-pattern)"
                    />
                  </svg>
                </div>

                <div className="h-full flex flex-col relative z-10">
                  <div className="mb-8">
                    <motion.span
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-flex items-center justify-center rounded-full bg-blue-100/20 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-white"
                    >
                      👋 Trabajemos Juntos
                    </motion.span>
                  </div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl lg:text-4xl font-bold mb-6"
                  >
                    Cuéntanos sobre tu proyecto
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-blue-50 mb-8 lg:pr-6"
                  >
                    Comparte tu visión para tus prendas personalizadas. Ya sea
                    que necesites playeras, polos, camisas, ropa deportiva,
                    pantalones o cualquier otra prenda, estamos aquí para
                    ayudarte a hacerla realidad.
                  </motion.p>

                  <div className="space-y-6 mb-auto">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex items-center group"
                    >
                      <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                        <Phone className="h-5 w-5" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {info?.contactInfo[0]?.phone || "+52 123 456 7890"}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex items-center group"
                    >
                      <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                        <Mail className="h-5 w-5" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {info?.contactInfo[0]?.email || "contacto@empresa.com"}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="flex items-center group"
                    >
                      <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {info?.contactInfo[0]?.address ||
                          "Calle Principal #123, Ciudad"}
                      </span>
                    </motion.div>
                  </div>

                  {/* Redes Sociales */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-10 flex space-x-4 justify-start"
                  >
                    <motion.a
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="p-3 rounded-full bg-white/10 transition-all"
                    >
                      <Facebook className="w-5 h-5" />
                    </motion.a>

                    <motion.a
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      href="#"
                      className="p-3 rounded-full bg-white/10 transition-all"
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Form */}
              <motion.div
                className="lg:col-span-3 p-8 lg:p-12 relative z-10"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center">
                  <MessageSquare className="w-7 h-7 mr-3 text-blue-600" />
                  Envíanos un mensaje
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Gracias por contactarnos. Te responderemos a la brevedad
                      posible.
                    </p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Nombre */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="col-span-1 space-y-2"
                    >
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        Nombre
                      </Label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={(e) => {
                          // Solo permite letras y espacios
                          const value = e.target.value.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          e.target.value = value;
                          handleChange(e);
                        }}
                        required
                        className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                      />
                    </motion.div>

                    {/* Apellido */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="col-span-1 space-y-2"
                    >
                      <Label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        Apellido
                      </Label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Tu apellido"
                        value={formData.lastName}
                        onChange={(e) => {
                          // Solo permite letras y espacios
                          const value = e.target.value.replace(
                            /[^a-zA-Z\s]/g,
                            ""
                          );
                          e.target.value = value;
                          handleChange(e);
                        }}
                        required
                        className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                      />
                    </motion.div>

                    {/* Correo electrónico */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="md:col-span-2 space-y-2"
                    >
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <AtSign className="w-4 h-4 mr-2 text-blue-600" />
                        Correo electrónico
                      </Label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={(e) => {
                          // Validación de correo electrónico
                          const value = e.target.value.replace(/[<>='" ]/g, "");
                          e.target.value = value;
                          handleChange(e);
                        }}
                        required
                        pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                        className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                      />
                    </motion.div>

                    {/* Servicio de interés */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="col-span-1 space-y-2"
                    >
                      <Label
                        htmlFor="service"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                        Servicio de interés
                      </Label>
                      <input
                        id="service"
                        name="service"
                        type="text"
                        placeholder="Ej: Uniformes, Playeras, etc."
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                      />
                    </motion.div>

                    {/* Asunto */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="col-span-1 space-y-2"
                    >
                      <Label
                        htmlFor="subject"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                        Asunto
                      </Label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Asunto de tu mensaje"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                      />
                    </motion.div>

                    {/* Mensaje */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="md:col-span-2 space-y-2"
                    >
                      <Label
                        htmlFor="message"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                        Mensaje
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Cuéntanos sobre tu proyecto o consulta..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all resize-none"
                      />
                    </motion.div>

                    {/* Botón Enviar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="md:col-span-2 mt-4"
                    >
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-70 group relative overflow-hidden"
                      >
                        <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-700 to-blue-800 transition-all duration-300 group-hover:w-full"></span>
                        <span className="relative flex items-center">
                          {isLoading ? (
                            <>
                              <Loader2 className="animate-spin mr-2 h-5 w-5" />
                              <span>Enviando mensaje...</span>
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              <span>Enviar mensaje</span>
                            </>
                          )}
                        </span>
                      </button>
                    </motion.div>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Sección del Mapa */}
      <AnimatedSection className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-full">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
            >
              UBICACIÓN
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
            >
              Nuestra <span className="text-blue-600">ubicación</span>
            </motion.h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "6rem" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="h-1 bg-blue-600 mx-auto mt-6"
            ></motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl overflow-hidden relative"
          >
            <div className="h-[500px] w-full rounded-xl overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2917195571363!2d-98.42331282496527!3d21.140785880536765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d7277686110b85%3A0x96770f44da5dda79!2sCayro%20Uniformes!5e0!3m2!1ses-419!2smx!4v1738528175488!5m2!1ses-419!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="https://goo.gl/maps/YourGoogleMapsLink"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <MapPin className="w-5 h-5" />
                Cómo llegar
              </a>

              <a
                href={`tel:${info?.contactInfo[0]?.phone || "+521234567890"}`}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Llamar ahora
              </a>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
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
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
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
              Permítenos ayudarte a crear las prendas perfectas para tu empresa,
              equipo o evento especial.
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
              </button>
              <a
                href={`tel:${info?.contactInfo[0]?.phone || "+521234567890"}`}
                className="group px-8 py-4 bg-transparent text-white font-bold rounded-full hover:bg-white/10 transition-all border-2 border-white flex items-center justify-center relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <Phone className="mr-2 w-5 h-5" />
                  Llamar ahora
                </span>
                <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
