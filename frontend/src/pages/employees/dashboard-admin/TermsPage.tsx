import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, History, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DocumentTypeInter, Status } from '@/types/Documents';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { activeTermsApi, createTermsApi, deleteTermsApi, termsApi, termsHistoriApi, updateTermsApi } from '@/api/terms';

interface RegulatoryDocument {
  title: string;
  content: string;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
  effectiveDate: Date;
  isDeleted?: boolean;
  isCurrentVersion?: boolean;
  previousVersionId?: string;
  status?: Status;
  type?: DocumentTypeInter;
  _id?: string
}

interface RegulatoryDocumentUpdate {
  title: string;
  content: string;
  effectiveDate: string;
}

export default function TemrsPage() {
  const [editingDocument, setEditingDocument] = useState<RegulatoryDocument | null>(null);
  const [documents, setDocuments] = useState<RegulatoryDocument[]>([]);
  const [lastId, setLasId] = useState<any>();
  const [documentsHistory, setDocumentsHistory] = useState<RegulatoryDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<RegulatoryDocument | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RegulatoryDocumentUpdate>();

  const validateDate = (value: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(value);
    if (selectedDate >= today) {
      return true;
    } else {
      return "La fecha debe ser hoy o en el futuro";
    }
  };

  useEffect(() => {
    const index = documentsHistory.length;
    setLasId(documentsHistory[index]?._id);
  }, [setDocumentsHistory])
  useEffect(() => {
    const getAllTerms = async () => {
      const res = await termsApi();
      const resHistori = await termsHistoriApi();
      setDocumentsHistory(resHistori.data);
      setDocuments(res.data);
    }
    getAllTerms();
  }, []);

  const onSubmit = handleSubmit(async (data: RegulatoryDocumentUpdate) => {
    try {
      if (editingDocument) {
        setIsLoading(true);
        const res = await updateTermsApi({
          title: data.title,
          content: data.content,
          effectiveDate: data.effectiveDate
        }, editingDocument._id);
        if (res) {
          setIsLoading(false);
          Swal.fire({
            icon: 'success',
            title: 'Exito.',
            text: 'Documento editado correctamente.',
            confirmButtonColor: '#2F93D1',
          });
        }
        setIsLoading(false);
      } else {
        setIsLoading(true);
        const res = await createTermsApi({
          title: data.title,
          content: data.content,
          effectiveDate: data.effectiveDate
        });
        if (res) {
          setIsLoading(false);
          Swal.fire({
            icon: 'success',
            title: 'Exito.',
            text: 'Documento agregado correctamente.',
            confirmButtonColor: '#2F93D1',
          });
        }
        setIsLoading(false);
      }
      const updatedDocuments = documents.map(doc =>
        doc.status === Status.current
          ? { ...doc, status: Status.not_current, isCurrentVersion: false, updatedAt: new Date() }
          : doc
      );
      const updatedDocumentsHistory = documentsHistory.map(doc =>
        doc.status === Status.current
          ? { ...doc, status: Status.not_current, isCurrentVersion: false, updatedAt: new Date() }
          : doc
      );
      const newDocument: RegulatoryDocument = {
        ...data,
        version: documents.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        isCurrentVersion: true,
        status: Status.current,
        previousVersionId: lastId,
        effectiveDate: new Date(data.effectiveDate),
        type: DocumentTypeInter.terms
      };
      setDocuments([...updatedDocuments, newDocument]);
      setDocumentsHistory([...updatedDocumentsHistory, newDocument]);
      reset();
      setEditingDocument(null);
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error.',
        text: 'Algo salio mal intentalo mas tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  });

  const editDocument = (doc: RegulatoryDocument) => {
    const formattedDate = new Date(doc.effectiveDate).toISOString().split('T')[0];

    setValue('title', doc.title);
    setValue('content', doc.content);
    setValue('effectiveDate', formattedDate);

    setEditingDocument(doc);
  };


  const deleteDocument = async (id: any) => {
    try {
      setIsLoading(true);
      const res = await deleteTermsApi(id);
      if (res) {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La docuemnto eliminado, aun puedes verla en el historial.',
          confirmButtonColor: '#2F93D1',
        });
      }
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error.',
        text: 'Algo salio mal intentalo mas tarde.',
        confirmButtonColor: '#2F93D1',
      });
      setIsLoading(true);
    }
    setDocuments(documents.map(doc => doc._id === id ? { ...doc, isDeleted: true, status: Status.removed } : doc));
    setDocumentsHistory(documents.map(doc => doc._id === id ? { ...doc, isDeleted: true, status: Status.removed } : doc));
  };

  const openModal = (doc: RegulatoryDocument) => {
    setSelectedDocument(doc);
  };

  const closeModal = () => {
    setSelectedDocument(null);
  };
  const today = new Date();
  // Sumar 5 días a la fecha actual
  const futureDate = new Date(today.setDate(today.getDate() + 5));
  // Ajustar el formato a YYYY-MM-DD
  const minDate = futureDate.toISOString().split('T')[0];

  const activeDocuments = documents
    .filter(doc => !doc.isDeleted)
    .sort((a, b) => {
      // Ordenar por estado (vigente primero) y luego por la versión
      if (a.status === Status.current && b.status !== Status.current) return -1;
      if (a.status !== Status.current && b.status === Status.current) return 1;
      return (b.version ?? 0) - (a.version ?? 0);
    });
  const activateDocument = async (document: RegulatoryDocument) => {
    try {
      setIsLoading(true);
      const res = await activeTermsApi(document._id);
      if (res) {
        setIsLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Docuemnto activado.',
          text: 'Los terminos y condiciones seleccionados fueron avtivados correctamente.',
          confirmButtonColor: '#2F93D1',
        });
        const finalDocuments = documents.map(doc =>
          doc.isCurrentVersion === true
            ? { ...doc, status: Status.not_current, isCurrentVersion: false } : doc
        )
        const finalDocumentsHistory = documentsHistory.map(doc =>
          doc.isCurrentVersion === true
            ? { ...doc, status: Status.not_current, isCurrentVersion: false } : doc
        )

        const updatedDocuments = finalDocuments.map(doc =>
          doc._id === document._id
            ? { ...doc, status: Status.current, isCurrentVersion: true }
            : doc
        );
        const updatedDocumentsHistory = finalDocumentsHistory.map(doc =>
          doc._id === document._id
            ? { ...doc, status: Status.current, isCurrentVersion: true }
            : doc
        );
        setDocuments(updatedDocuments);
        setDocumentsHistory(updatedDocumentsHistory);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo activar el documento. Inténtalo más tarde.',
        confirmButtonColor: '#2F93D1',
      });
    }
  };
  return (
    <>
      <Card>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">{editingDocument ? 'Modificar Documento Regulatorio' : 'Agregar Nuevo Documento Regulatorio'}</h3>
            <form onSubmit={onSubmit} className="space-y-2">
              <div>
                <Label htmlFor="title">Título del Documento</Label>
                <Input
                  id="title"
                  placeholder="Ingrese el título del documento regulatorio"
                  {...register('title', { required: "El título es obligatorio" })}
                />
                {errors.title && <p className="text-red-500 text-[13px]">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="content">Contenido del Documento</Label>
                <Textarea
                  id="content"
                  placeholder="Ingrese el contenido del documento"
                  {...register('content', { required: "El contenido es obligatorio", minLength: { value: 20, message: "El contenido debe tener al menos 20 caracteres" } })}
                />
                {errors.content && <p className="text-red-500 text-[13px]">{errors.content.message}</p>}
              </div>
              <div>
                <Label htmlFor="effectiveDate">Fecha de Vigencia</Label>
                <Input
                  min={minDate}
                  id="effectiveDate"
                  type="date"
                  {...register('effectiveDate', { required: "La fecha de vigencia es obligatoria", validate: validateDate })}
                />
                {errors.effectiveDate && <p className="text-red-500 text-[13px]">{errors.effectiveDate.message}</p>}
              </div>
              <Button type="submit" disabled={isLoading}>
                {
                  isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> {editingDocument ? 'Guardar Cambios' : 'Agregar Documento'}
                    </>
                  )
                }

              </Button>
            </form>
          </div>
          <Separator className="my-4" />

          {/* Sección de documentos activos */}
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {
              activeDocuments.length > 0 ? (
                <>
                  {activeDocuments.map((doc) => (
                    <div key={doc.title} className="mb-4 flex flex-col md:flex-row md:justify-between border p-1">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">{doc.title} (v{doc.version})</h4>
                        <p className="text-gray-600 mt-1 line-clamp-2">{doc.content}</p>
                        {/* Estado del documento: Vigente o No Vigente */}
                        <p className={`mt-2 font-semibold ${doc.status === Status.current ? 'text-green-600' : 'text-red-600'}`}>
                          {doc.status === Status.current ? 'Vigente' : 'No Vigente'}
                        </p>
                      </div>

                      {/* Contenedor de los botones en columna */}
                      <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
                        <Button variant="outline" size="sm" onClick={() => editDocument(doc)}>
                          <Edit className="h-4 w-4" /> Modificar
                        </Button>
                        {doc.status !== Status.current && (
                          <Button variant="outline" size="sm" onClick={() => activateDocument(doc)}>
                            <Edit className="h-4 w-4" /> Activar
                          </Button>
                        )}
                        <Button disabled={isLoading} variant="destructive" size="sm" onClick={() => deleteDocument(doc._id)}>
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openModal(doc)}>
                          <Eye className="h-4 w-4" /> Ver completo
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p>No hay politicas todavia.</p>
                </div>
              )
            }

          </ScrollArea>

          {/* Botón para mostrar el historial completo de todos los documentos */}
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowAllHistory(!showAllHistory)}>
              <History className="h-4 w-4 mr-2" />
              {showAllHistory ? "Ocultar Historial Completo" : "Ver Historial Completo"}
            </Button>
          </div>

          {/* Historial completo de todos los documentos */}
          {showAllHistory && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">Historial Completo de Todos los Documentos</h3>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {documentsHistory.map((version) => (
                  <div key={version.title} className="mb-4 flex flex-col md:flex-row md:justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold">{version.title} - Versión {version.version}</h4>
                      <p className="text-gray-600 mt-1 line-clamp-2">{version.content}</p>
                      <div className="text-sm text-gray-600">
                        Creado el: {new Date(version.createdAt ?? '').toLocaleDateString()} - Estado: {version.status === "NOT_CURRENT" ? "No vigente" : version.status === "CURRENT" ? "Vigente" : "Eliminada"}
                      </div>
                    </div>

                    {/* Contenedor de los botones en columna */}
                    <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
                      <Button variant="ghost" size="sm" onClick={() => openModal(version)}>
                        <Eye className="h-4 w-4" /> Ver completo
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={closeModal}>
          <DialogContent aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>{selectedDocument.title} (v{selectedDocument.version})</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p><strong>Fecha de vigencia:</strong> {new Date(selectedDocument.effectiveDate).toLocaleDateString()}</p>
              <p className="mt-2">{selectedDocument.content}</p>
              <Button variant="ghost" onClick={closeModal} className="mt-4">Cerrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
