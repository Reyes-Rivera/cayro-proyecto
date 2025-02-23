import { useEffect, useState } from "react";
import { policyApi } from "@/api/policy";
import { DocumentInterface } from "./DocumentInterface";
import { motion } from "framer-motion";
import backgroundImage from "../Home/assets/hero.jpg";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

export default function Policies() {
  const [policy, setPolicy] = useState<DocumentInterface[]>([]);

  const getPolicy = async () => {
    const res = await policyApi();
    console.log(res);
    setPolicy([res.data]);
  };

  useEffect(() => {
    getPolicy();
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
            Aviso de privacidad
          </h1>
          <div className="text-white [&_*]:!text-white flex justify-center">
            <Breadcrumbs />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <main  className="container mx-auto px-6 lg:px-20">
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
           
            Aviso de privacidad
          </motion.p>

          {/* Document Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-8 lg:p-12 space-y-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-md"
          >
            {policy?.length > 0 && policy[0]?.content ? (
              <div
                className="whitespace-pre-wrap leading-relaxed text-justify"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
              >
                {policy[0].content.split("\n").map((section, index) => {
                  // Detectamos secciones con "Sección N – Título"
                  const match = section.match(/^(Sección \d+\s–)\s*(.+)$/);

                  if (match) {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="mb-6"
                      >
                        <p className="font-bold text-lg">
                          {match[1]} <span>{match[2]}</span>
                        </p>
                      </motion.div>
                    );
                  }

                  // Resaltamos texto antes de ":" en negritas
                  const colonMatch = section.match(/^(.+?):\s*(.+)$/);
                  if (colonMatch) {
                    return (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="mb-4"
                      >
                        <span className="font-bold">{colonMatch[1]}:</span>{" "}
                        {colonMatch[2]}
                      </motion.p>
                    );
                  }

                  // Detectamos preguntas
                  const questionMatch = section.match(/(.+\?)\s*(.+)$/);
                  if (questionMatch) {
                    return (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="mb-4"
                      >
                        <span className="font-bold">{questionMatch[1]}</span>{" "}
                        {questionMatch[2]}
                      </motion.p>
                    );
                  }

                  // Detectamos incisos como "a)", "b)", "1)", etc.
                  const itemMatch = section.match(/^([a-z0-9]+\))\s*(.+)$/i);
                  if (itemMatch) {
                    return (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="pl-6 mb-4"
                      >
                        <span className="font-bold">{itemMatch[1]}</span>{" "}
                        {itemMatch[2]}
                      </motion.p>
                    );
                  }

                  // Renderizamos texto normal
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
                No hay términos y condiciones disponibles.
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
