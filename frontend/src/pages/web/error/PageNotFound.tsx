import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import img from "@/assets/404 Error with a cute animal-amico.png";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-6 lg:p-20">
      <div className="container mx-auto flex flex-col gap-12 items-center">
        <div className="w-full flex justify-center">
          <div className="relative w-96 animate-fadeIn transform hover:scale-105 transition-transform duration-300">
            <img
              src={img}
              alt="404 Illustration"
              className="w-full object-contain"
            />
          </div>
        </div>

        <div className="text-center space-y-6 animate-fadeIn">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              ¡Oops! Parece que estás perdido
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              La página que buscas no está disponible o ha sido movida.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all text-lg inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>

            {/* Home Button */}
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all text-lg inline-flex items-center gap-2"
            >
              Ir al Inicio
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
