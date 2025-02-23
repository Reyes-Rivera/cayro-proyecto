import { Handshake, Leaf, Users } from "lucide-react";
import imgInfo from "../Home/assets/hero.jpg";
import mission from "./assets/mission.jpg";
import vision from "./assets/vision.jpg";
import about from "./assets/about.jpg";
import { useEffect, useState } from "react";
import { getCompanyInfoApi } from "@/api/company";
import { CompanyProfile } from "@/types/CompanyInfo";
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
    <div className="bg-gray-50 dark:bg-gray-900">
    {/* Sección "Quiénes Somos" */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-96 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${imgInfo})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 text-center text-white max-w-5xl px-4"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          ¿Quiénes Somos?
        </h1>
        <div className="text-white [&_*]:!text-white flex justify-center">
          <Breadcrumbs />
        </div>
      </motion.div>
    </motion.div>
  
    {/* About */}
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="py-20 bg-white dark:bg-gray-800"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            ¿Quiénes Somos?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-6 text-xl">
            Somos una empresa especializada en la fabricación y venta de ropa de
            alta calidad, incluyendo playeras, polos, camisas, pantalones, ropa
            deportiva y uniformes personalizados. Nos destacamos por ofrecer
            prendas con diseños modernos, cómodos y duraderos, adaptándonos a las
            necesidades de cada cliente.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <img
            src={about}
            alt="Quienes-somos"
            className="rounded-lg shadow-2xl w-full md:w-3/4 lg:w-2/3 transform transition-transform hover:scale-105"
          />
        </motion.div>
      </div>
    </motion.section>
  
    {/* Misión */}
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <img
            src={mission}
            alt="Misión"
            className="rounded-lg shadow-2xl w-full md:w-3/4 lg:w-2/3 transform transition-transform hover:scale-105"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Nuestra Misión
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-6 text-xl">
            {info?.mission}
          </p>
        </motion.div>
      </div>
    </motion.section>
  
    {/* Visión */}
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="py-20 bg-white dark:bg-gray-800"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Nuestra Visión
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-6 text-xl">
            {info?.vision}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <img
            src={vision}
            alt="Visión"
            className="rounded-lg shadow-2xl w-full md:w-3/4 lg:w-2/3 transform transition-transform hover:scale-105"
          />
        </motion.div>
      </div>
    </motion.section>
  
    {/* Valores */}
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
          Nuestros Valores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          {/* Compromiso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
              <Users className="w-10 h-10 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Compromiso
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Estamos comprometidos con nuestros clientes, garantizando productos
              y servicios que superen sus expectativas.
            </p>
          </motion.div>
  
          {/* Sostenibilidad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
              <Leaf className="w-10 h-10 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Sostenibilidad
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Incorporamos prácticas responsables para cuidar el medio ambiente y
              promover la sostenibilidad en cada etapa de producción.
            </p>
          </motion.div>
  
          {/* Integridad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
              <Handshake className="w-10 h-10 text-yellow-600 dark:text-yellow-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Integridad
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Actuamos con honestidad, transparencia y ética en todas nuestras
              relaciones y actividades.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  </div>
  );
}
