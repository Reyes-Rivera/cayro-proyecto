import { Percent, ShoppingBag, Truck } from "lucide-react";

export default function OffersSection() {
  return (
    <section className=" dark:bg-gray-800 py-20 lg:py-28">
      <div className="container mx-auto text-center px-6 lg:px-20">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white">
            Ofertas Especiales
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Aprovecha nuestras ofertas exclusivas en uniformes personalizados,
            escolares y deportivos.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {/* First Offer */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full text-white mb-6">
              <Percent className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              20% de Descuento
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              En pedidos mayores a 20 unidades.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              ¡Aprovecha esta oportunidad para obtener uniformes de calidad a un
              precio increíble!
            </p>
          </div>

          {/* Second Offer */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full text-white mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Compra al por Mayor
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Precios especiales para empresas y escuelas.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Ideal para grupos escolares, equipos deportivos y empresas.
            </p>
          </div>

          {/* Third Offer */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full text-white mb-6">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Envío Gratis
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              En pedidos superiores a $5000.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Obtén tus productos sin costo adicional en envíos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
