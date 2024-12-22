import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Prod1 from "@/assets/playera_hongo-removebg-preview.png"
import Prod2 from "@/assets/playera_batmat-removebg-preview.png"
import Prod3 from "@/assets/sudadera-removebg-preview.png"
export default function FeaturedProducts() {


  return (
    <section className="py-5 md:py-0 bg-white dark:bg-gray-900">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          Productos <span className="">Destacados</span>
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Descubre nuestros productos más populares y altamente recomendados.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          
            <Card key={1} className="shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-0">
                <img
                  src={Prod1}
                  alt={Prod1}
                  className="w-full h-48 object-contain rounded-t-md"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                  Uniforme Escolar
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                Uniforme completo con diseño personalizado.
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

            <Card key={2} className="shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-0">
                <img
                  src={Prod2}
                  alt={Prod2}
                  className="w-full h-48 object-contain rounded-t-md"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Uniforme Deportivo
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                Ideal para equipos y competencias.
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

            <Card key={2} className="shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-0 ">
                <img
                  src={Prod3}
                  alt={Prod3}
                  className="w-full h-48 object-contain rounded-t-md"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                Uniforme Empresarial
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                Perfecto para eventos y uso diario en oficinas.
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
        
        </div>
      </div>
    </section>
  );
}
