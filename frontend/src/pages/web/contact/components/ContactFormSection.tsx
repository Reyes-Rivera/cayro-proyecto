"use client";

import type React from "react";

import { motion } from "framer-motion";
import {
  MessageSquare,
  User,
  AtSign,
  Briefcase,
  FileText,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { memo } from "react";
import { Label } from "@/components/ui/label";

interface ContactFormSectionProps {
  isLoading: boolean;
  isSubmitted: boolean;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    service: string;
    subject: string;
    message: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ContactFormSection = ({
  isLoading,
  isSubmitted,
  formData,
  handleChange,
  handleSubmit,
}: ContactFormSectionProps) => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration - Enhanced with about page style */}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative"
        >
          {/* Background decoration - Enhanced with about page style */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
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
              {/* Background decoration - Enhanced with about page style */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
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
                  <div className="flex items-center group">
                    <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span>+52 123 456 7890</span>
                  </div>

                  <div className="flex items-center group">
                    <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span>contacto@empresa.com</span>
                  </div>

                  <div className="flex items-center group">
                    <div className="bg-white/10 p-3 rounded-full mr-4 group-hover:bg-white/20 transition-all duration-300">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span>Calle Principal #123, Ciudad</span>
                  </div>
                </div>

                {/* Redes Sociales */}
                <div className="mt-10 flex space-x-4 justify-start">
                  <a
                    href="#"
                    className="p-3 rounded-full bg-white/10 transition-all hover:bg-white/20"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  <a
                    href="#"
                    className="p-3 rounded-full bg-white/10 transition-all hover:bg-white/20"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
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
                  <div className="col-span-1 space-y-2">
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
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                    />
                  </div>

                  {/* Apellido */}
                  <div className="col-span-1 space-y-2">
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
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                    />
                  </div>

                  {/* Correo electrónico */}
                  <div className="md:col-span-2 space-y-2">
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
                      onChange={handleChange}
                      required
                      pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
                      className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all"
                    />
                  </div>

                  {/* Servicio de interés */}
                  <div className="col-span-1 space-y-2">
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
                  </div>

                  {/* Asunto */}
                  <div className="col-span-1 space-y-2">
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
                  </div>

                  {/* Mensaje */}
                  <div className="md:col-span-2 space-y-2">
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
                  </div>

                  {/* Botón Enviar */}
                  <div className="md:col-span-2 mt-4">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 disabled:opacity-70"
                    >
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
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ContactFormSection);
