import { Check } from "lucide-react";
import cbta from "@/assets/cbta-removebg-preview.png";
const benefits = [
  "Telas resistentes y duraderas",
  "Diseños modernos y cómodos",
  "Bordados de alta calidad",
  "Variedad de tallas disponibles",
];

export default function Package() {
  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-800 ">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Texto del paquete */}
          <div>
            <h2  className="text-4xl font-extrabold  text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
              Obtén el mejor paquete para tu institución
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mb-4">
              Ofrecemos soluciones completas de uniformes escolares adaptadas a las necesidades específicas de tu
              institución educativa.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-800 dark:text-gray-100 text-lg leading-snug"
                >
                  <Check className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            
          </div>

          {/* Imagen */}
          <div className="felx justify-center items-center w-full">
            <img
              src={cbta}
              alt="Estudiantes con uniformes"
              className="rounded-lg shadow-xl transition-transform duration-300 hover:scale-105 dark:shadow-gray-700 m-auto"
            />
           
          </div>
        </div>
      </div>
    </section>
  );
}
