import { Instagram, Facebook, Mail } from "lucide-react";
import img2 from "@/assets/uniform-removebg-preview.png";
import img3 from "@/assets/polos2-removebg-preview.png";

export default function Hero() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 lg:py-28">
      {/* Main Container */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6 lg:px-20">
        {/* Left Content */}
        <div className="flex flex-col justify-center animate-fadeInLeft">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Diseña tu estilo con <br />
            <span className="text-blue-600 dark:text-blue-400">
              Uniformes Exclusivos
            </span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
            Confeccionamos uniformes personalizados de alta calidad, ideales
            para escolares, deportes y eventos profesionales.
          </p>
          <div className="mt-10 flex gap-8 items-center">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Instagram className="w-8 h-8" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Facebook className="w-8 h-8" />
            </a>
            <a
              href="mailto:correo@ejemplo.com"
              className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <Mail className="w-8 h-8" />
            </a>
          </div>
          <div className="mt-8 flex gap-6">
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg hover:scale-105 transform">
              Ver Productos
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-lg hover:scale-105 transform">
              Personalizar
            </button>
          </div>
        </div>

        {/* Right Content - Images */}
        <div className="md:flex hidden justify-center items-start gap-8">
          {/* Primera Imagen */}
          <div className="relative overflow-hidden rounded-lg shadow-lg w-96 h-96 bg-gray-100 dark:bg-gray-700 animate-fadeInLeft">
            <img
              src={img2}
              alt="Equipo deportivo"
              className="w-full h-full object-cover hover:scale-110 transform transition-transform duration-500"
              loading="lazy"
            />
          </div>
          {/* Segunda Imagen */}
          <div className="relative overflow-hidden rounded-lg shadow-lg w-96 h-96 mt-8 bg-gray-100 dark:bg-gray-700 animate-fadeInRight">
            <img
              src={img3}
              alt="Uniformes escolares"
              className="w-full h-full object-cover hover:scale-110 transform transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
