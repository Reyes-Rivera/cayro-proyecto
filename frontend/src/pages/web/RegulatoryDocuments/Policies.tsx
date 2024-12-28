import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { policyApi } from "@/api/policy";
import { DocumentInterface } from "./DocumentInterface";
import { Loader2 } from "lucide-react";

export default function Policies() {
  const [policy, setPolicy] = useState<DocumentInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPolicy = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await policyApi();
      setPolicy(res.data);
    } catch (error) {
      setError("No se pudo cargar la política de privacidad. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPolicy();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16 px-6">
      <Card className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="p-6 text-center bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 text-white overflow-hidden rounded-t-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Política de Privacidad
          </h1>
          <p className="mt-4 text-sm sm:text-lg text-blue-100 dark:text-gray-300">
            Información sobre cómo manejamos tus datos personales.
          </p>
        </CardHeader>

        <Separator className=" border-gray-300 dark:border-gray-600" />

        <CardContent className="p-6">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 w-8 h-8" />
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Cargando información...
              </p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                {error}
              </p>
              <button
                onClick={getPolicy}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105"
              >
                Reintentar
              </button>
            </div>
          ) : policy ? (
            <div className="space-y-4 leading-relaxed text-gray-800 dark:text-gray-200">
              {policy.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No hay contenido disponible por el momento.
            </p>
          )}

          <Separator className="my-6 border-gray-300 dark:border-gray-600" />

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Última actualización:{" "}
            {policy ? new Date(policy.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
