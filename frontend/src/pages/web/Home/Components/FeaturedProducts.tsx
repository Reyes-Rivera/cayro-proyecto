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
    <section className="bg-white dark:bg-gray-900 py-10">
    <div className="flex flex-col items-center justify-center px-6 sm:px-12 lg:px-32 py-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          Productos <span className="">Destacados</span>
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Descubre nuestros productos más populares y altamente recomendados.
        </p>
      </div>
  
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full">
        {[Prod1, Prod2, Prod3].map((product, index) => (
          <Card
            key={index}
            className="shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <CardHeader className="p-0">
              <img
                src={product}
                alt={`Producto ${index + 1}`}
                className="w-full h-48 object-contain"
              />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                {index === 0
                  ? "Uniforme Escolar"
                  : index === 1
                  ? "Uniforme Deportivo"
                  : "Uniforme Empresarial"}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {index === 0
                  ? "Uniforme completo con diseño personalizado."
                  : index === 1
                  ? "Ideal para equipos y competencias."
                  : "Perfecto para eventos y uso diario en oficinas."}
              </CardDescription>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  $499.00
                </span>
                <button className="flex items-center gap-2 bg-[#2F93D1] hover:bg-blue-700 transition-all rounded-full p-2">
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
