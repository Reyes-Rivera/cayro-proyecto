import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Percent, ShoppingBag, Truck } from "lucide-react";

export default function OffersSection() {
  return (
    <section className="py-16 bg-blue-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          Ofertas Especiales
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Aprovecha nuestras ofertas exclusivas en uniformes personalizados, escolares y deportivos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Primera Oferta */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-center items-center">
                <Percent className="text-green-500 w-10 h-10" />
              </div>
              <CardTitle className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                20% de Descuento
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300 text-base">
                En pedidos mayores a 20 unidades.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                ¡Aprovecha esta oportunidad para obtener uniformes de calidad a un precio increíble!
              </p>
            </CardContent>
          </Card>

          {/* Segunda Oferta */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-center items-center">
                <ShoppingBag className="text-amber-500 w-10 h-10" />
              </div>
              <CardTitle className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                Compra al por Mayor
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300 text-base">
                Precios especiales para empresas y escuelas.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Ideal para grupos escolares, equipos deportivos y empresas.
              </p>
            </CardContent>
          </Card>

          {/* Tercera Oferta */}
          <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-center items-center">
                <Truck className="text-orange-500 w-10 h-10" />
              </div>
              <CardTitle className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                Envío Gratis
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600 dark:text-gray-300 text-base">
                En pedidos superiores a $5000.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Obtén tus productos sin costo adicional en envíos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
