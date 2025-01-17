import { Award, Brush, UserCheck, Leaf, Truck, DollarSign } from "lucide-react";
export default function BenefitsSection() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 lg:py-28">
      <div className="container mx-auto text-center px-6 lg:px-20">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white">
            Nuestros Beneficios
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Descubre por qué nuestros uniformes son la elección ideal para ti.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {/* Benefit 1 */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full text-white mb-6">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Calidad Superior
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Usamos materiales de alta calidad para garantizar durabilidad y
              comodidad.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-full text-white mb-6">
              <Brush className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Personalización
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Diseños personalizados para satisfacer tus necesidades
              específicas.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full text-white mb-6">
              <UserCheck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Soporte Dedicado
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Un equipo dispuesto a ayudarte en cada paso del proceso.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full text-white mb-6">
              <Leaf className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Ecológicos
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Productos amigables con el medio ambiente, hechos con materiales
              sostenibles.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-full text-white mb-6">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Entrega Rápida
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Procesamos y enviamos tu pedido en el menor tiempo posible.
            </p>
          </div>

          {/* Benefit 6 */}
          <div className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all">
            <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-4 rounded-full text-white mb-6">
              <DollarSign className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Precios Accesibles
            </h3>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Uniformes de calidad a precios competitivos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
