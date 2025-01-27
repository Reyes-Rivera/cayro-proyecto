import { useEffect, useState } from "react";
import { boundaryApi } from "@/api/policy";
import { DocumentInterface } from "./DocumentInterface";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex py-20 lg:py-28">
      <main className="container mx-auto px-6 lg:px-20">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          {/* Document Header */}
          <div className="bg-gray-100 dark:bg-gray-700 p-8 border-b dark:border-gray-600">
            <div className="flex items-center justify-between mb-6">
            <Breadcrumbs/>
            </div>
            <h1 className="text-3xl font-extrabold">Deslinde legal</h1>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Última actualización: {new Date().toLocaleDateString()}
          </p> */}
          </div>

          {/* Document Content */}
          <div className="p-8 lg:p-12 space-y-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-md">
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
                      <div key={index} className="mb-4">
                        {/* Título en negritas */}
                        <p className="font-bold text-lg">{colonMatch[1]}:</p>
                      </div>
                    );
                  }

                  // Renderizar texto normal después de títulos
                  return (
                    <p key={index} className="mb-4">
                      {section}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No hay contenido disponible.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
