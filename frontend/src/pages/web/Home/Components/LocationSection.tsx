import { MapPin, Phone, Clock } from "lucide-react";

export default function LocationSection() {
  return (
    <section className="relative py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white text-center">
          Nuestra Ubicación
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-center">
          Encuentra nuestras oficinas y visítanos para resolver tus dudas o
          realizar tus pedidos.
        </p>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Map Section */}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl shadow-lg overflow-hidden">
            <iframe
              title="Mapa de ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.29171906833!2d-98.42073789999999!3d21.1407859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d7277686110b85%3A0x96770f44da5dda79!2sCayro%20Uniformes!5e0!3m2!1ses-419!2smx!4v1737160696375!5m2!1ses-419!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              className="rounded-xl"
            ></iframe>
          </div>

          {/* Location Information */}
          <div className="flex flex-col items-start justify-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700">
            {/* Address */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-600 p-3 rounded-full">
                <MapPin className="text-blue-600 dark:text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Dirección
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Calle, 16 de Enero # 4-4, Centro, 43000 Huejutla de Reyes,
                  Hgo.
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="bg-green-100 dark:bg-green-600 p-3 rounded-full">
                <Phone className="text-green-600 dark:text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Teléfono
                </h3>
                <p className="text-gray-600 dark:text-gray-300">771 178 3587</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 dark:bg-orange-600 p-3 rounded-full">
                <Clock className="text-orange-600 dark:text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Horario
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Lunes a Sábado: 8:30 AM - 6:30 PM <br />
                  Domingo: 9:00 AM - 3:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
