"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Label } from "@/components/ui/label";
import type { CompanyProfile } from "@/types/CompanyInfo";
import { getCompanyInfoApi } from "@/api/company";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import backgroundImage from "../Home/assets/hero.jpg";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    subject: "",
    message: "",
  });

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
      alert("Mensaje enviado");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-14">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: "center 30%",
        }}
        className="relative py-20 h-[500px] bg-cover bg-no-repeat bg-fixed"
      >
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative container mx-auto px-6 flex flex-col items-center justify-center h-full text-center"
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm mb-6">
            ESTAMOS AQUÍ PARA AYUDARTE
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Nos encantaría hablar contigo
          </h1>
          <p className="text-lg text-blue-50 max-w-2xl mb-8">
            Estamos listos para convertir tus ideas en prendas excepcionales que
            representen tu visión
          </p>
          <div className="text-white [&_*]:!text-white flex justify-center">
            <Breadcrumbs />
          </div>
        </motion.div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-6 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
                <Phone className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                Llámanos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
                {info?.contactInfo[0].phone || "+52 123 456 7890"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Lunes a Viernes: 9am - 6pm
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
                <Mail className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                Escríbenos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
                {info?.contactInfo[0].email || "contacto@empresa.com"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Te respondemos en menos de 24 horas
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-md mb-4">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                Visítanos
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
                {info?.contactInfo[0].address || "Calle Principal #123, Ciudad"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Horario: 9am - 6pm (Lun-Vie)
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto px-6 mb-24">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 p-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white"
            >
              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <span className="inline-flex items-center justify-center rounded-full bg-blue-100/20 backdrop-blur-sm px-3 py-1 text-sm font-semibold text-white">
                    👋 Trabajemos Juntos
                  </span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Cuéntanos sobre tu proyecto
                </h2>

                <p className="text-blue-50 mb-8 lg:pr-6">
                  Comparte tu visión para tus prendas personalizadas. Ya sea que
                  necesites playeras, polos, camisas, ropa deportiva, pantalones
                  o cualquier otra prenda, estamos aquí para ayudarte a hacerla
                  realidad.
                </p>

                <div className="space-y-6 mb-auto">
                  <div className="flex items-center">
                    <div className="bg-white/10 p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span>
                      {info?.contactInfo[0].phone || "+52 123 456 7890"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-white/10 p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span>
                      {info?.contactInfo[0].email || "contacto@empresa.com"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-white/10 p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span>
                      {info?.contactInfo[0].address ||
                        "Calle Principal #123, Ciudad"}
                    </span>
                  </div>
                </div>

                {/* Redes Sociales */}
                <div className="mt-10 flex space-x-4 justify-start">
                  <a
                    href="#"
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>

                  <a
                    href="#"
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              className="lg:col-span-3 p-8 lg:p-12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                Envíanos un mensaje
              </h2>

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
                    onChange={(e) => {
                      // Solo permite letras y espacios
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      e.target.value = value;
                      handleChange(e);
                    }}
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
                    onChange={(e) => {
                      // Solo permite letras y espacios
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      e.target.value = value;
                      handleChange(e);
                    }}
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
                    onChange={(e) => {
                      // Excluye <, >, =, ', ", y espacios
                      const value = e.target.value.replace(/[<>='" ]/g, "");
                      e.target.value = value;
                      handleChange(e);
                    }}
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
                    onChange={(e) => {
                      // Excluye <, >, =, ', ", y espacios
                      const value = e.target.value.replace(/[<>='" ]/g, "");
                      e.target.value = value;
                      handleChange(e);
                    }}
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
                    onChange={(e) => {
                      // Excluye <, >, =, ', ", y espacios
                      const value = e.target.value.replace(/[<>='" ]/g, "");
                      e.target.value = value;
                      handleChange(e);
                    }}
                    required
                    rows={5}
                    className="w-full rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 outline-none transition-all resize-none"
                  />
                </div>

                {/* Botón Enviar */}
                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
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
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sección del Mapa */}
      <div className="container mx-auto px-6 mb-20">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-blue-600" />
            Nuestra ubicación
          </h2>
          <div className="h-[500px] w-full rounded-xl overflow-hidden border-4 border-gray-100 dark:border-gray-700">
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
        </div>
      </div>
    </div>
  );
}
