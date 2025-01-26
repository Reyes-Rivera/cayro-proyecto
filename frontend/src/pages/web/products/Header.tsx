import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import img from "@/assets/470524508_1114544320459967_8053404278450786658_n-removebg-preview.png";

export default function CustomizationHeader() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-12 border-b border-gray-300 dark:border-gray-700">
      <div className="container mx-auto px-6 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Sección de Texto */}
        <div className="text-center md:text-left max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
            Personaliza tu <span className="text-blue-600 dark:text-blue-400">prenda ideal</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mt-2">
            Crea un diseño único que refleje tu estilo. Escoge colores, logos y detalles personalizados.
          </p>

          {/* Botón de Personalización */}
          <div className="mt-6">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
            >
              <Scissors className="mr-2 h-5 w-5" />
              Personalizar ahora
            </Button>
          </div>
        </div>

        {/* Imagen de Prenda */}
        <div className="w-40 md:w-52">
          <img
            src={img}
            alt="Personaliza tu prenda"
            className="w-full object-contain rounded-xl shadow-lg"
          />
        </div>

      </div>
    </div>
  );
}
