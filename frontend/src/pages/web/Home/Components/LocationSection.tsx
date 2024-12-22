import { MapPin, Phone, Clock } from "lucide-react";

export default function LocationSection() {
  return (
    <section className="relative py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center">
          Nuestra Ubicación
        </h2>
        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          Encuentra nuestras oficinas y visítanos para resolver tus dudas o realizar tus pedidos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Mapa */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl shadow-lg overflow-hidden">
            <iframe
              title="Mapa de ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.836290528101!2d-122.41941568467778!3d37.77492977975943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d0b0f163%3A0x2d8dff8a7518e087!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1614803964452!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>

          {/* Información de Ubicación */}
          <div className="flex flex-col items-start justify-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-6 flex items-center space-x-4">
              <MapPin className="text-blue-600 w-10 h-10" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Dirección</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Calle Principal #123, Colonia Centro, Ciudad, País
                </p>
              </div>
            </div>
            <div className="mb-6 flex items-center space-x-4">
              <Phone className="text-green-600 w-10 h-10" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Teléfono</h3>
                <p className="text-gray-600 dark:text-gray-300">+52 123 456 7890</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="text-orange-600 w-10 h-10" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Horario</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Lunes a Viernes: 9:00 AM - 6:00 PM <br />
                  Sábado: 9:00 AM - 2:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
