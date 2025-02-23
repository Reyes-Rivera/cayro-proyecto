import { useEffect, useState } from "react";
import { boundaryApi } from "@/api/policy";
import { DocumentInterface } from "./DocumentInterface";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import { motion } from "framer-motion";
import backgroundImage from "../Home/assets/hero.jpg";
export default function LegalBoundary() {
  const [document, setDocument] = useState<DocumentInterface[]>([]);

  useEffect(() => {
    const getDocument = async () => {
      const res = await boundaryApi();
      setDocument([res.data]);
    };
    getDocument();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-96 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 text-center text-white max-w-5xl px-4"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Deslinde legal
          </h1>
          <div className="text-white [&_*]:!text-white flex justify-center">
            <Breadcrumbs />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Document Header */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-100 font-bold dark:bg-gray-900 p-8 border-b dark:border-gray-600"
          >
            
            Deslinde legal
          </motion.p>

          {/* Document Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-8 lg:p-12 space-y-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-md"
          >
            {document?.length > 0 && document[0]?.content ? (
              <div
                className="whitespace-pre-wrap leading-relaxed text-justify"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
              >
                {document[0].content.split("\n").map((section, index) => {
                  // Identificar líneas con títulos que terminan en ":"
                  const colonMatch = section.match(/^(.+?):$/);

                  if (colonMatch) {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="mb-4"
                      >
                        <p className="font-bold text-lg">{colonMatch[1]}:</p>
                      </motion.div>
                    );
                  }

                  // Renderizar texto normal después de títulos
                  return (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="mb-4"
                    >
                      {section}
                    </motion.p>
                  );
                })}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-gray-500"
              >
                No hay contenido disponible.
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
