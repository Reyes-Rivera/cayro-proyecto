import img1 from "@/assets/rb_7301.png"
import img2 from "@/assets/rb_2150698482.png"
import img3 from "@/assets/rb_2147681936.png"
export default function BenefitsSection() {

  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Círculos decorativos */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-100 dark:bg-blue-800 opacity-50 rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-orange-100 dark:bg-orange-800 opacity-50 rounded-full"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          ¿Por qué Nosotros?
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Conoce los beneficios de elegir nuestros servicios y productos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          {/* Primera Tarjeta */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <img
                src={img1}
                alt="Calidad Garantizada"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Calidad Garantizada
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-base">
              Nuestros uniformes están hechos con materiales de la más alta calidad.
            </p>
          </div>

          {/* Segunda Tarjeta */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <img
                src={img2}
                alt="Personalización Única"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Personalización Única
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-base">
              Diseña uniformes que reflejen la identidad de tu equipo o empresa.
            </p>
          </div>

          {/* Tercera Tarjeta */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <img
                src={img3}
                alt="Envíos Rápidos"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Envíos Rápidos
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-base">
              Garantizamos entregas a tiempo para cumplir con tus necesidades.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
