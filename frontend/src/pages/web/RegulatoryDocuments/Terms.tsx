import { Button } from "@/components/ui/button";
import { ChevronLeft, Printer } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center py-20 lg:py-28">
      <main className="container mx-auto px-6 lg:px-20">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          {/* Document Header */}
          <div className="bg-gray-100 dark:bg-gray-700 p-8 border-b dark:border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center dark:text-gray-300"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
            <h1 className="text-3xl font-extrabold">Términos y Condiciones</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Última actualización: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Document Content */}
          <div className="p-8 lg:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introducción</h2>
              <p>
                Bienvenido a UniformPro. Estos términos y condiciones describen
                las reglas y regulaciones para el uso del sitio web de
                UniformPro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                2. Aceptación de los términos
              </h2>
              <p>
                Al acceder a este sitio web, asumimos que aceptas estos términos
                y condiciones en su totalidad. No continúes usando el sitio web
                de UniformPro si no aceptas todos los términos y condiciones
                establecidos en esta página.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                3. Propiedad intelectual
              </h2>
              <p>
                A menos que se indique lo contrario, UniformPro y/o sus
                licenciantes poseen los derechos de propiedad intelectual de
                todo el material en UniformPro. Todos los derechos de propiedad
                intelectual están reservados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Restricciones</h2>
              <p>Está específicamente restringido:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  Publicar cualquier material del sitio web en otro medio.
                </li>
                <li>
                  Vender, sublicenciar y/o comercializar cualquier material del
                  sitio web.
                </li>
                <li>
                  Realizar y/o mostrar públicamente cualquier material del sitio
                  web.
                </li>
                <li>
                  Usar este sitio web de cualquier manera que pueda dañar el
                  sitio web.
                </li>
                <li>
                  Usar este sitio web de cualquier manera que afecte el acceso
                  de los usuarios.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                5. Compras y entregas
              </h2>
              <p>Al realizar una compra en nuestro sitio web, aceptas que:</p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  Eres responsable de leer la lista completa de artículos antes
                  de comprometerte a comprarlos.
                </li>
                <li>
                  Te comprometes a ingresar información de contacto y pago
                  precisa en todas las compras realizadas a través del sitio.
                </li>
                <li>
                  Reconoces que los tiempos de entrega pueden variar según tu
                  ubicación y la disponibilidad del producto.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                6. Política de devoluciones
              </h2>
              <p>
                Aceptamos devoluciones dentro de los 30 días posteriores a la
                compra, siempre que los uniformes no hayan sido usados y
                mantengan sus etiquetas originales. Los gastos de envío para las
                devoluciones corren por cuenta del cliente, a menos que el
                producto recibido sea defectuoso o incorrecto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                7. Modificaciones de los términos
              </h2>
              <p>
                UniformPro se reserva el derecho de revisar estos términos en
                cualquier momento según lo considere oportuno, por lo que debes
                revisarlos periódicamente. Los cambios serán efectivos cuando se
                publiquen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Contacto</h2>
              <p>
                Si tienes alguna pregunta sobre estos términos, contáctanos:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Por email: info@uniformpro.com</li>
                <li>Por teléfono: (555) 123-4567</li>
                <li>Por correo: 123 Calle Uniforme, Ciudad, CP 12345</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
