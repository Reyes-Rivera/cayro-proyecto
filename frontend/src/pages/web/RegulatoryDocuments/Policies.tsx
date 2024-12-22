import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { policyApi } from "@/api/policy";
import { DocumentInterface } from "./DocumentInterface";
import { Loader2, RefreshCw } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-3xl relative">
          
          {/* <button 
            onClick={getPolicy} 
            className="absolute top-4 right-4 flex items-center justify-center p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg">
            <RefreshCw className="w-5 h-5" />
          </button> */}

          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              📜 Política de Privacidad
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300 mt-2">
              Información importante sobre cómo utilizamos y protegemos tus datos.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="privacidad" className="w-full">
              <TabsContent value="privacidad">
                <ScrollArea className="h-[400px] w-full rounded-md border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  {loading ? (
                    <div className="flex flex-col justify-center items-center h-full">
                      <Loader2 className="animate-spin mr-2 h-10 w-10 text-blue-600" />
                      <span className="text-gray-600 dark:text-gray-200 mt-2">Cargando...</span>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col justify-center items-center h-full">
                      <p className="text-center text-red-500 font-semibold">
                        {error}
                      </p>
                      <button 
                        onClick={getPolicy} 
                        className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all">
                        Reintentar
                      </button>
                    </div>
                  ) : policy ? (
                    <div className="space-y-4 leading-relaxed">
                      {policy.content.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 text-lg text-gray-800 dark:text-gray-200">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      Lo sentimos, no contamos con políticas de privacidad en este momento.
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>

            <Separator className="my-6 border-gray-200 dark:border-gray-600" />

            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Última actualización: {policy ? new Date(policy.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
