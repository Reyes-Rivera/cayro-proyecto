"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { Label } from "@/components/ui/label";
import type { CompanyProfile } from "@/types/CompanyInfo";
import { getCompanyInfoApi } from "@/api/company";
import backgroundImage from "../Home/assets/hero.jpg";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    subject: "",
    message: "",
  });

  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Animation references and controls
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const cardsInView = useInView(cardsRef, { once: true, amount: 0.3 });
  const formInView = useInView(formRef, { once: true, amount: 0.3 });
  const mapInView = useInView(mapRef, { once: true, amount: 0.3 });

  const heroControls = useAnimation();
  const cardsControls = useAnimation();
  const formControls = useAnimation();
  const mapControls = useAnimation();

  useEffect(() => {
    if (heroInView) {
      heroControls.start("visible");
    }
    if (cardsInView) {
      cardsControls.start("visible");
    }
    if (formInView) {
      formControls.start("visible");
    }
    if (mapInView) {
      mapControls.start("visible");
    }
  }, [
    heroInView,
    cardsInView,
    formInView,
    mapInView,
    heroControls,
    cardsControls,
    formControls,
    mapControls,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative z-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-screen flex flex-col justify-center">
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            transform: `translateY(${scrollY * 0.2}px)`,
            filter: "brightness(0.85)",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(30,30,30,0.2)_0%,rgba(0,0,0,0)_50%)]" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 md:w-2 md:h-2 bg-blue-400 rounded-full opacity-70"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.3,
              }}
              animate={{
                y: [null, "-100%"],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col justify-center flex-grow">
          <div className="grid md:grid-cols-1 gap-8 items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-white space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center justify-center rounded-full bg-blue-600/30 backdrop-blur-sm border border-blue-500/20 px-4 py-1.5 text-sm font-medium text-blue-100"
              >
                ESTAMOS AQUÍ PARA AYUDARTE
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                <span className="block">Nos encantaría</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                  hablar contigo
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-300 max-w-2xl mx-auto"
              >
                Estamos listos para convertir tus ideas en prendas excepcionales
                que representen tu visión. Cuéntanos sobre tu proyecto y
                hagámoslo realidad juntos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center overflow-hidden relative"
                  onClick={scrollToContent}
                >
                  <span className="relative z-10 flex items-center">
                    Contáctanos ahora
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.button>

                <motion.a
                  href={`tel:${info?.contactInfo[0]?.phone || "+521234567890"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/30 flex items-center justify-center overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Llamar ahora
                  </span>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap gap-4 pt-4 justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <Mail className="w-5 h-5 text-blue-300" />
                  <span className="text-sm">
                    {info?.contactInfo[0]?.email || "contacto@empresa.com"}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span className="text-sm">Visítanos</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
                >
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Lun-Vie: 9am - 6pm</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
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
            <p className="text-white/80 text-sm font-medium">Descubre más</p>
            <div className="flex flex-col items-center gap-1">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-white/80 to-white/0" />
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm"
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Contact Info Cards */}
      <motion.div
        id="contact-cards"
        ref={cardsRef}
        initial="hidden"
        animate={cardsControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="container mx-auto px-6 pt-20 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

            <div className="flex flex-col items-center relative z-10">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4 group-hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-110">
                <Phone className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                Llámanos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
                {info?.contactInfo[0]?.phone || "+52 123 456 7890"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <Clock className="w-4 h-4 mr-1 inline" />
                Lunes a Viernes: 9am - 6pm
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.1 },
              },
            }}
          >
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

            <div className="flex flex-col items-center relative z-10">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4 group-hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-110">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                Escríbenos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
                {info?.contactInfo[0]?.email || "contacto@empresa.com"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 inline" />
                Te respondemos en menos de 24 horas
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
          >
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

            <div className="flex flex-col items-center relative z-10">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4 group-hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-110">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                Visítanos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
                {info?.contactInfo[0]?.address ||
                  "Calle Principal #123, Ciudad"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <Clock className="w-4 h-4 mr-1 inline" />
                Horario: 9am - 6pm (Lun-Vie)
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Form Section */}
      <motion.div
        ref={formRef}
        initial="hidden"
        animate={formControls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="container mx-auto px-6 mb-24"
      >
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
              animate={{ opacity: 1, x: 0 }}
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
                  <rect width="100%" height="100%" fill="url(#dots-pattern)" />
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
                  Comparte tu visión para tus prendas personalizadas. Ya sea que
                  necesites playeras, polos, camisas, ropa deportiva, pantalones
                  o cualquier otra prenda, estamos aquí para ayudarte a hacerla
                  realidad.
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
              animate={{ opacity: 1, x: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
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
                    animate={{ opacity: 1, y: 0 }}
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
      </motion.div>

      {/* Sección del Mapa */}
      <motion.div
        ref={mapRef}
        initial="hidden"
        animate={mapControls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
        className="container mx-auto px-6 mb-20"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl overflow-hidden relative">
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

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"
            >
              <MapPin className="w-6 h-6 mr-2 text-blue-600" />
              Nuestra ubicación
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[500px] w-full rounded-xl overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-lg"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2917195571363!2d-98.42331282496527!3d21.140785880536765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d7277686110b85%3A0x96770f44da5dda79!2sCayro%20Uniformes!5e0!3m2!1ses-419!2smx!4v1738528175488!5m2!1ses-419!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full h-full"
              ></iframe>
            </motion.div>

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
          </div>
        </div>
      </motion.div>
    </div>
  );
}
