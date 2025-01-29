import { useEffect, useState } from "react";
import { policyApi } from "@/api/policy";
import { DocumentInterface } from "./DocumentInterface";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex py-20 lg:py-28">
      <main className="container mx-auto px-6 lg:px-20">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          {/* Document Header */}
          <div className="bg-gray-100 bg dark:bg-gray-700 p-8 border-b dark:border-gray-600">
            <div className="flex items-center justify-between mb-6">
              <Breadcrumbs/>
            </div>
            <h1 className="text-3xl font-extrabold">Aviso de privacidad</h1>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Última actualización: {new Date().toLocaleDateString()}
          </p> */}
          </div>

          {/* Document Content */}
          <div className="p-8 lg:p-12 space-y-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-md ">
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
                      <div key={index} className="mb-6">
                        {/* Título principal en negritas */}
                        <p className="font-bold text-lg">
                          {match[1]} <span>{match[2]}</span>
                        </p>
                      </div>
                    );
                  }

                  // Resaltamos texto antes de ":" en negritas
                  const colonMatch = section.match(/^(.+?):\s*(.+)$/);
                  if (colonMatch) {
                    return (
                      <p key={index} className="">
                        <span className="font-bold">{colonMatch[1]}:</span>{" "}
                        {colonMatch[2]}
                      </p>
                    );
                  }

                  // Detectamos preguntas
                  const questionMatch = section.match(/(.+\?)\s*(.+)$/);
                  if (questionMatch) {
                    return (
                      <p key={index} className="">
                        <span className="font-bold">{questionMatch[1]}</span>{" "}
                        {questionMatch[2]}
                      </p>
                    );
                  }

                  // Detectamos incisos como "a)", "b)", "1)", etc.
                  const itemMatch = section.match(/^([a-z0-9]+\))\s*(.+)$/i);
                  if (itemMatch) {
                    return (
                      <p key={index} className=" pl-6">
                        <span className="font-bold">{itemMatch[1]}</span>{" "}
                        {itemMatch[2]}
                      </p>
                    );
                  }

                  // Renderizamos texto normal
                  return (
                    <p key={index} className="mb-4">
                      {section}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No hay términos y condiciones disponibles.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
