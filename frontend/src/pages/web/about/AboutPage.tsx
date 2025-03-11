"use client";

import {
  Leaf,
  Users,
  Award,
  Target,
  ChevronRight,
  Clock,
  Shield,
} from "lucide-react";
import imgInfo from "../Home/assets/hero.jpg";
import mission from "./assets/mission.jpg";
import vision from "./assets/vision.jpg";
import about from "./assets/about.jpg";
import { useEffect, useState } from "react";
import { getCompanyInfoApi } from "@/api/company";
import type { CompanyProfile } from "@/types/CompanyInfo";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { motion } from "framer-motion";

export default function AboutPage() {
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
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-14">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[500px] flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${imgInfo})` }}
      >
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 text-center text-white max-w-5xl px-6"
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm mb-6">
            CONÓCENOS
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            ¿Quiénes Somos?
          </h1>
          <p className="text-lg text-blue-50 max-w-2xl mx-auto mb-8">
            Descubre nuestra historia, valores y lo que nos hace únicos en la
            industria textil
          </p>
          <div className="text-white [&_*]:!text-white flex justify-center">
            <Breadcrumbs />
          </div>
        </motion.div>
      </motion.div>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center">
              <div className="h-0.5 w-12 bg-blue-600 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
                Nuestra Historia
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
              Creando calidad <br />
              <span className="text-blue-600">desde 1995</span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              Somos una empresa especializada en la fabricación y venta de ropa
              de alta calidad, incluyendo playeras, polos, camisas, pantalones,
              ropa deportiva y uniformes personalizados. Nos destacamos por
              ofrecer prendas con diseños modernos, cómodos y duraderos,
              adaptándonos a las necesidades de cada cliente.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    +25 años
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    de experiencia
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Calidad
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    garantizada
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-600/10 rounded-full z-0"></div>
              <img
                src={about || "/placeholder.svg"}
                alt="Quienes-somos"
                className="rounded-lg shadow-2xl w-full relative z-10 transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Misión */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center order-2 md:order-1"
          >
            <div className="relative">
              <div className="absolute inset-0 border-2 border-blue-600 rounded-lg transform translate-x-4 translate-y-4 z-0"></div>
              <img
                src={mission || "/placeholder.svg"}
                alt="Misión"
                className="rounded-lg shadow-xl w-full relative z-10 transform transition-all duration-500 hover:translate-x-2 hover:translate-y-2"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="order-1 md:order-2"
          >
            <div className="inline-flex items-center">
              <div className="h-0.5 w-12 bg-blue-600 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
                Propósito
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight mt-4">
              Nuestra <span className="text-blue-600">Misión</span>
            </h2>

            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
                "
                {info?.mission ||
                  "Nuestra misión es proporcionar prendas de vestir de la más alta calidad, combinando diseño innovador, materiales premium y técnicas de fabricación avanzadas para satisfacer las necesidades de nuestros clientes."}
                "
              </p>
            </div>

            <div className="mt-8 flex items-center">
              <Target className="w-6 h-6 text-blue-600 mr-3" />
              <p className="text-gray-600 dark:text-gray-400">
                Comprometidos con la excelencia en cada prenda que fabricamos
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Visión */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center">
              <div className="h-0.5 w-12 bg-blue-600 mr-3"></div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm">
                Aspiración
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight mt-4">
              Nuestra <span className="text-blue-600">Visión</span>
            </h2>

            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg italic">
                "
                {info?.vision ||
                  "Ser reconocidos como líderes en la industria textil, destacándonos por la innovación, calidad y servicio excepcional, mientras expandimos nuestra presencia a nivel nacional e internacional."}
                "
              </p>
            </div>

            <div className="mt-8">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Expandir nuestra presencia en el mercado
                  </span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Innovar constantemente en diseños y materiales
                  </span>
                </li>
                <li className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Mantener los más altos estándares de calidad
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 border-2 border-blue-600 rounded-lg transform -translate-x-4 -translate-y-4 z-0"></div>
              <img
                src={vision || "/placeholder.svg"}
                alt="Visión"
                className="rounded-lg shadow-xl w-full relative z-10 transform transition-all duration-500 hover:-translate-x-2 hover:-translate-y-2"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Valores */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-24 bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-0.5 w-12 bg-blue-600"></div>
              <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                Lo que nos define
              </span>
              <div className="h-0.5 w-12 bg-blue-600"></div>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight mb-6">
              Nuestros <span className="text-blue-600">Valores</span>
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Estos principios fundamentales guían nuestras acciones y
              decisiones cada día, definiendo quiénes somos como empresa y cómo
              servimos a nuestros clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Compromiso */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Compromiso
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Estamos comprometidos con nuestros clientes, garantizando
                  productos y servicios que superen sus expectativas.
                </p>
                <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              </div>
            </motion.div>

            {/* Sostenibilidad */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Sostenibilidad
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Incorporamos prácticas responsables para cuidar el medio
                  ambiente y promover la sostenibilidad en cada etapa de
                  producción.
                </p>
                <div className="w-16 h-1 bg-green-600 rounded-full"></div>
              </div>
            </motion.div>

            {/* Integridad */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Integridad
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Actuamos con honestidad, transparencia y ética en todas
                  nuestras relaciones y actividades.
                </p>
                <div className="w-16 h-1 bg-amber-600 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para trabajar con nosotros?
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            Permítenos ayudarte a crear las prendas perfectas para tu empresa,
            equipo o evento especial.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Contáctanos
            <ChevronRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </motion.section>
    </div>
  );
}
