"use client";

import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { memo, useMemo } from "react";
import type { CompanyProfile } from "@/types/CompanyInfo";

interface MapSectionProps {
  info?: CompanyProfile;
}

const MapSection = ({ info }: MapSectionProps) => {
  // Fallbacks
  const fallbackAddress =
    "Cayro Uniformes, Calle 16 de Enero #4-4, Col. Centro, Huejutla de Reyes, México";
  const rawPhone = info?.contactInfo?.[0]?.phone ?? "+52 771 178 3587";

  // Sanitiza el teléfono para el enlace tel:
  const telHref = useMemo(() => {
    const clean = rawPhone.replace(/[^+\d]/g, "");
    return `tel:${clean}`;
  }, [rawPhone]);

  // Construye link dinámico a Google Maps (Cómo llegar)
  const destination = info?.contactInfo?.[0]?.address ?? fallbackAddress;
  const directionsUrl = useMemo(() => {
    const encoded = encodeURIComponent(destination);
    return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
  }, [destination]);

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Background decoration - Simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-full">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-300 mb-4"
          >
            UBICACIÓN
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Nuestra <span className="text-blue-600">ubicación</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-1 bg-blue-600 mx-auto mt-6"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl overflow-hidden relative"
        >
          <div className="h-[500px] w-full rounded-xl overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-lg">
            <iframe
              title="Mapa de ubicación de Cayro Uniformes"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2917195571363!2d-98.42331282496527!3d21.140785880536765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d7277686110b85%3A0x96770f44da5dda79!2sCayro%20Uniformes!5e0!3m2!1ses-419!2smx!4v1738528175488!5m2!1ses-419!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              aria-label="Cómo llegar"
            >
              <MapPin className="w-5 h-5" />
              Cómo llegar
            </a>

            <a
              href={telHref}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
              aria-label="Llamar ahora"
            >
              <Phone className="w-5 h-5" />
              Llamar ahora
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(MapSection);
