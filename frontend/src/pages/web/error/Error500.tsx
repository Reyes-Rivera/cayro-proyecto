import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import img from "@/assets/error500.png";
import { useLocation, Navigate } from "react-router-dom";
const Error500 = () => {
  const location = useLocation();

  if (!location.state || !location.state.fromError) {
    return <Navigate to="/" replace />;
  }
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-12 flex flex-col lg:flex-row items-stretch w-[90%] max-w-6xl lg:gap-16">
        {/* Sección Izquierda: Imagen */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center">
          <div className="w-80 h-80 lg:w-96 lg:h-96 flex items-center">
            <img
              src={img}
              alt="500 Ilustración"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Sección Derecha: Contenido */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-6">
          <h1 className="text-8xl font-extrabold text-red-600">500</h1>
          <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold">
            ¡Algo salió mal!
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Estamos teniendo problemas internos. Por favor, intenta nuevamente
            más tarde.
          </p>

          {/* Botón para ir al inicio */}
          <div className="pt-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-xl hover:underline hover:scale-105 transition-all"
            >
              Ir al Inicio <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error500;
