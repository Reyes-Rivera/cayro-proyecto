import { Button } from "@/components/ui/button";
import HeroImage from "@/assets/heroimg.png";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 text-white py-16 lg:py-24">
      {/* Forma ondulada aplicada al contenedor principal */}
      <div className="custom-shape-divider-bottom-1734903450 md:block hidden">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 relative z-10">
        {/* Columna de Texto */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white dark:text-white">
            Diseña tu estilo con <br />
            <span className="text-gray-800 dark:text-gray-400">Uniformes Exclusivos</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Ofrecemos uniformes personalizados con materiales de alta calidad, ideales para escolares, deportivos y más.
          </p>
          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
            <Button className="   text-white hover:bg-blue-700 px-6 py-3 text-lg font-semibold shadow-lg transition-transform transform hover:scale-105">
              Ver Productos
            </Button>
            <Button className="bg-gray-200 text-gray-900 hover:bg-gray-300 px-6 py-3 text-lg font-semibold shadow-lg transition-transform transform hover:scale-105 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
              Personalizar
            </Button>
          </div>
        </div>

        {/* Columna de Imagen */}
        <div className="relative w-full lg:w-1/2 mt-12 lg:mt-0 ">
          <img
            src={HeroImage}
            alt="Uniformes"
            className="max-w-xs sm:max-w-md  object-contain mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
