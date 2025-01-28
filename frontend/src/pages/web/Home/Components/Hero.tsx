import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import polos from "@/assets/polos2-removebg-preview.png";
import uniform from "@/assets/uniform-removebg-preview.png";
import playera from "@/assets/playera_batmat-removebg-preview.png";

export default function Hero() {
  return (
    <section className="min-h-screen mt-14 lg:mt-0 bg-white dark:bg-gray-900 relative overflow-hidden flex items-center ">
      <div className="container mx-auto px-4  ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl "
          >
            <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-8">
              Uniformes de <span className="text-blue-600 dark:text-blue-400">Calidad</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
              Explora nuestra nueva colección de uniformes diseñados para el confort y estilo de tus estudiantes.
            </p>
            <div className="flex gap-6">
              <Button
                size="lg"
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 font-bold"
              >
                Ver catálogo
              </Button>
              <Button size="lg" variant="outline" className="font-bold">
                Contactar
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 gap-8">
              <div>
                <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400">15+</h4>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Años de experiencia</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400">50+</h4>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Escuelas confían en nosotros</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400">50k+</h4>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Uniformes entregados</p>
              </div>
            </div>
          </motion.div>

          {/* Right content - Floating images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative h-[700px] w-full"
          >
            {/* Main large image */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute top-[40%] left-1/2 transform -translate-x-1/2 z-10 w-[60%] max-w-[300px]"
            >
              <div className="relative group">
                <img
                  src={polos}
                  alt="Uniforme principal"
                  className="w-full h-auto object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105 dark:shadow-gray-700"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>

            {/* Floating small image 1 */}
            <motion.div
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute top-[5%] right-[10%] z-20 w-[40%] max-w-[180px]"
            >
              <div className="relative group">
                <img
                  src={uniform}
                  alt="Detalle uniforme 1"
                  className="w-full h-auto object-cover rounded-xl shadow-lg border-4 border-white dark:border-gray-800 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>

            {/* Floating small image 2 */}
            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-[5%] left-[10%] z-20 w-[40%] max-w-[180px]"
            >
              <div className="relative group">
                <img
                  src={playera}
                  alt="Detalle uniforme 2"
                  className="w-full h-auto object-cover rounded-xl shadow-lg border-4 border-white dark:border-gray-800 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-[15%] left-[5%] w-40 h-40 bg-blue-100 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30" />
            <div className="absolute bottom-[10%] right-[5%] w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full filter blur-3xl opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
