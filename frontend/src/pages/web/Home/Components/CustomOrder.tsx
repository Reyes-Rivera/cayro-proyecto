import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Ruler, Palette, Users, CheckCircle2, ArrowRight } from "lucide-react";
import playeras from "@/assets/personalizar-removebg-preview.png";

const features = [
  {
    icon: Ruler,
    title: "Medidas Personalizadas",
    description: "Ajustamos cada uniforme a las medidas exactas que necesitas.",
    bgColor: "bg-red-100 dark:bg-red-800",
  },
  {
    icon: Palette,
    title: "Diseño a tu Gusto",
    description: "Elige colores, estilos y detalles que representen tu institución.",
    bgColor: "bg-green-100 dark:bg-green-800",
  },
  {
    icon: Users,
    title: "Pedidos por Volumen",
    description: "Precios especiales para pedidos grandes.",
    bgColor: "bg-yellow-100 dark:bg-yellow-800",
  },
  {
    icon: CheckCircle2,
    title: "Garantía de Calidad",
    description: "Aseguramos la mejor calidad en cada prenda.",
    bgColor: "bg-blue-100 dark:bg-blue-800",
  },
];

export default function CustomOrder() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
                  ¿Necesitas un pedido personalizado?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Creamos uniformes a medida para tu institución educativa. Desde el diseño hasta la entrega, nos aseguramos de que cada detalle cumpla con tus expectativas.
                </p>
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow ${feature.bgColor}`}>
                          <Icon className="w-6 h-6 " />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button size="lg" className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 font-bold">
                  Solicitar presupuesto
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={playeras}
                alt="Uniformes personalizados"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />

              {/* Floating Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute bottom-6 left-6 right-6 bg-white dark:bg-gray-800 backdrop-blur-md p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700 flex items-center justify-center">
                    <Users className="w-6 h-6 " />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Más de 500 escuelas
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Confían en nosotros para sus uniformes escolares.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
