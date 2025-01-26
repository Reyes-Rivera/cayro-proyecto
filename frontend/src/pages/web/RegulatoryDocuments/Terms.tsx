import { currentTerm } from "@/api/terms";
import { Button } from "@/components/ui/button";
import { RegulatoryDocument } from "@/pages/employees/dashboard-admin/legal/LegalDocumentsView";
import { ChevronLeft, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Terms() {
  const [terms, setTerms] = useState<RegulatoryDocument[]>([]);
  useEffect(() => {
    const getTerms = async () => {
      const res = await currentTerm();
      setTerms([res.data]);
    };
    getTerms();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex py-20 lg:py-28">
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
            {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Última actualización: {new Date().toLocaleDateString()}
            </p> */}
          </div>

          {/* Document Content */}
          <div className="p-8 lg:p-12 space-y-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-md">
            {terms?.length > 0 && terms[0]?.content ? (
              <div
                className="whitespace-pre-wrap leading-relaxed text-justify"
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
              >
                {terms[0].content.split("\n").map((section, index) => {
                  const match = section.match(/^(Sección \d+\s–)\s*(.+)$/);

                  if (match) {
                    return (
                      <div key={index} className="mb-6">
                        {/* Título principal en negritas */}
                        <p className="font-bold text-lg">
                          {match[1]}{" "}
                          <span>{match[2]}</span>
                        </p>
                      </div>
                    );
                  }

                  // Resaltamos el texto antes de ":" en negritas
                  const colonMatch = section.match(/^(.+?):\s*(.+)$/);
                  if (colonMatch) {
                    return (
                      <p key={index} className="mb-4">
                        <span className="font-bold">{colonMatch[1]}:</span>{" "}
                        {colonMatch[2]}
                      </p>
                    );
                  }

                  // Renderizamos el texto normal
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
