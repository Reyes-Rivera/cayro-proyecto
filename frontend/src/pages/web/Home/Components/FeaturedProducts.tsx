import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Prod1 from "@/assets/playera_hongo-removebg-preview.png";
import Prod2 from "@/assets/playera_batmat-removebg-preview.png";
import Prod3 from "@/assets/sudadera-removebg-preview.png";
export default function FeaturedProducts() {
  return (
    <section className=" dark:bg-gray-800 py-20 lg:py-28">
      <div className="container mx-auto flex flex-col items-center px-6 sm:px-12 lg:px-32">
        {/* Header */}
        <div className="text-center animate-fadeInUp">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white leading-tight">
            Productos Destacados
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Descubre nuestros productos más populares y altamente recomendados.
          </p>
        </div>

        {/* Product Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full max-w-7xl animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          {[Prod1, Prod2, Prod3].map((product, index) => (
            <Card
              key={index}
              className="shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              <CardHeader className="p-0">
                <img
                  src={product}
                  alt={`Producto ${index + 1}`}
                  className="w-full h-48 object-contain hover:scale-110 transform transition-transform duration-500"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  {index === 0
                    ? "Uniforme Escolar"
                    : index === 1
                    ? "Uniforme Deportivo"
                    : "Uniforme Empresarial"}
                </CardTitle>
                <CardDescription className="mt-3 text-gray-600 dark:text-gray-300">
                  {index === 0
                    ? "Uniforme completo con diseño personalizado."
                    : index === 1
                    ? "Ideal para equipos y competencias."
                    : "Perfecto para eventos y uso diario en oficinas."}
                </CardDescription>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    $499.00
                  </span>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all rounded-full p-2">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
