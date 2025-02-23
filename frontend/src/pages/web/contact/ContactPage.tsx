"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Loader2,
  Instagram,
  Facebook,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { CompanyProfile } from "@/types/CompanyInfo";
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
    alert("Mensaje enviado");
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
    <div className="min-h-screen bg-gray-50  dark:bg-gray-800 mt-14">
      <div className="mx-auto">
        {/* Header Section */}
        <div
          style={{ backgroundImage: `url(${backgroundImage})` }}
          className="relative text-center py-12  h-80 bg-cover bg-center bg-no-repeat"
        >
          {/* Capa de opacidad para mejorar visibilidad */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mt-6"
          >
            <h2 className="text-lg font-semibold text-white tracking-wide uppercase">
              CONTÁCTANOS
            </h2>
            <h1 className="mt-4 text-5xl font-extrabold text-white sm:text-6xl tracking-tight">
              Nos encantaría hablar contigo
            </h1>
            <div className="text-white [&_*]:!text-white flex justify-center">
              <Breadcrumbs />
            </div>
          </motion.div>
        </div>
        <div className="dark:bg-gray-800 py-16 bg-gray-50">
          <div className="flex flex-col items-center text-center mb-10 ">
            <div className="flex items-center gap-4">
              <div className="border-t-2 border-blue-600 w-20 sm:w-72"></div>
              <span className="bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-semibold uppercase">
                Contáctanos
              </span>
              <div className="border-t-2 border-blue-600 w-20 sm:w-72"></div>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-black dark:text-white">
              Ponte en Contacto
            </h2>
          </div>
          <div className="grid grid-cols-1 max-w-7xl m-auto gap-6 mb-14 sm:grid-cols-3">
            <motion.div
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white p-3 rounded-md">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-black dark:text-white mt-4">
                  LLÁMANOS
                </h3>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                {info?.contactInfo[0].phone}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white p-3 rounded-md">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-black dark:text-white mt-4">
                  EMAIL
                </h3>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                {info?.contactInfo[0].email}
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white p-3 rounded-md">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-black dark:text-white mt-4">
                  LOCAL PRINCIPAL
                </h3>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
                {info?.contactInfo[0].address}
              </p>
            </motion.div>
          </div>
        </div>
        {/* Sección de Contacto */}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 px-24 m-auto  overflow-hidden bg-white py-5 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:pr-12 p-10 bg-blue-600 dark:bg-gray-800 text-white rounded-l-lg"
          >
            <div className="mb-8">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-gray-700 px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-300">
                👋 Trabajemos Juntos
              </span>
            </div>
            <h2 className="text-4xl font-extrabold mb-4">
              Cuéntanos sobre tu proyecto
            </h2>
            <p className="text-lg mb-24">
              Comparte tu visión para tus prendas personalizadas. Ya sea que
              necesites playeras, polos, camisas, ropa deportiva, pantalones o
              cualquier otra prenda, estamos aquí para ayudarte a hacerla
              realidad.
            </p>

            {/* Redes Sociales */}
            <div className="mt-8 flex space-x-4 justify-center">
              <a
                href="#"
                className="p-2 rounded-full border border-white/30 hover:bg-white/20 transition"
              >
                <Facebook className="w-6 h-6 text-white" />
              </a>

              <a
                href="#"
                className="p-2 rounded-full border border-white/30 hover:bg-white/20 transition"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            className="p-6 sm:px-6 lg:p-10 w-full max-w-lg md:max-w-none mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl text-center font-bold text-gray-800 dark:text-gray-100 mb-6">
              Contáctanos
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Nombre */}
              <div className="col-span-1 flex flex-col">
                <Label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre
                </Label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Tu nombre"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                />
              </div>

              {/* Apellido */}
              <div className="col-span-1 flex flex-col">
                <Label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Apellido
                </Label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Tu apellido"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                />
              </div>

              {/* Correo electrónico */}
              <div className="md:col-span-2 flex flex-col">
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Correo electrónico
                </Label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                />
              </div>

              {/* Servicio de interés */}
              <div className="col-span-1 flex flex-col">
                <Label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Servicio de interés
                </Label>
                <input
                  id="service"
                  name="service"
                  type="text"
                  placeholder="Servicio"
                  onChange={handleChange}
                  required
                   className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                />
              </div>

              {/* Asunto */}
              <div className="col-span-1 flex flex-col">
                <Label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Asunto
                </Label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="Asunto"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                />
              </div>

              {/* Mensaje */}
              <div className="md:col-span-2 flex flex-col">
                <Label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Mensaje
                </Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Cuéntanos sobre tu proyecto"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                />
              </div>

              {/* Botón Enviar */}
              <div className="md:col-span-2">
                <button className="px-4 w-full text-center justify-center py-2 bg-blue-600 font-bold text-white rounded-md flex items-center dark:bg-blue-600 dark:text-white">
                  {isLoading ? (
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    "Enviar mensaje"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Sección del Mapa */}
        <div className="mt-16 max-w-7xl m-auto ">
          <div className="h-[400px] w-full rounded-xl overflow-hidden">
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
