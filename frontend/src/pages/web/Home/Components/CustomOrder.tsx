import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import imagen from "../assets/personalizar.jpg";

export default function CustomOrder() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 px-10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Single Image (Smaller) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={imagen}
              alt="Imagen"
              className="w-full h-[400px] object-cover" // Altura reducida a 400px
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />
          </motion.div>

          {/* Right Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                  Personaliza tus Prendas
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Diseña prendas únicas y a tu medida. Ya sea para tu negocio,
                  evento especial o uso personal, nos encargamos de cada detalle
                  para que el resultado supere tus expectativas.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <button
                  className=" p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center"
                >
                  Solicitar presupuesto
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
