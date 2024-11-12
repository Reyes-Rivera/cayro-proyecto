import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { termApi } from "@/api/policy";
import { DocumentInterface } from "./DocumentInterface";
import { Loader2 } from "lucide-react";


export default function Terms() {
  const [document, setDocument] = useState<DocumentInterface | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getDocument = async () => {
      try {
        setLoading(true);
        const res = await termApi();
        setDocument(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }

    };
    getDocument();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Términos y Condiciones</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Información importante sobre nuestros términos y condiciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="privacidad" className="w-full">
              <TabsContent value="privacidad">
                <ScrollArea className="h-[400px] w-full rounded-md border border-gray-300 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="animate-spin mr-2 h-10 w-10 text-gray-700 dark:text-gray-300" />
                    </div>
                  ) : (
                    <>
                      {document ? (
                        <div className="space-y-4 leading-relaxed">
                          {document.content.split("\n").map((paragraph, index) => (
                            <p key={index} className="mb-4">{paragraph}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-600 dark:text-gray-400">
                          Lo sentimos, no contamos con términos y condiciones en este momento.
                        </p>
                      )}
                    </>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
            <Separator className="my-4 border-gray-300 dark:border-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Última actualización: {document ? new Date(document.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );

}
