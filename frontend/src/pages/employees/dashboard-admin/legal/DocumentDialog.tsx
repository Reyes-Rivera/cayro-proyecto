import  { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { DocumentTypeInter } from "./LegalDocumentsView";

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  addDocument: (newDocument: {
    title: string;
    content: string;
    effectiveDate: string;
    type: DocumentTypeInter;
  }) => void;
  updateDocument?: (updatedDocument: {
    id: number;
    title: string;
    content: string;
    effectiveDate: string;
    type: DocumentTypeInter;
  }) => void;
  documentToEdit?: {
    id: number;
    title: string;
    content: string;
    effectiveDate: string;
    type: DocumentTypeInter;
  } | null;
}

type FormData = {
  title: string;
  content: string;
  effectiveDate: string;
  type: DocumentTypeInter;
};

export default function DocumentDialog({
  isOpen,
  onClose,
  addDocument,
  updateDocument,
  documentToEdit,
}: DocumentDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
      effectiveDate: "",
      type: DocumentTypeInter.policy,
    },
  });
  useEffect(() => {
    if (documentToEdit) {
      setValue("title", documentToEdit.title);
      setValue("content", documentToEdit.content);
      setValue(
        "effectiveDate",
        documentToEdit.effectiveDate
          ? new Date(documentToEdit.effectiveDate).toISOString().split("T")[0]
          : "" // Asegura que el campo quede vacío si no hay fecha
      );
      setValue("type", documentToEdit.type);
    }
  }, [documentToEdit, setValue]);
  

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const currentDate = new Date();
    const effectiveDate = new Date(data.effectiveDate);
    const diffInDays = Math.floor(
      (effectiveDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 6) {
      Swal.fire({
        icon: "error",
        title: "Fecha inválida",
        text: "La fecha de vigencia debe ser al menos 6 días mayor a la fecha actual.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (documentToEdit) {
      updateDocument?.({
        id: documentToEdit.id,
        ...data,
      });
      Swal.fire({
        icon: "success",
        title: "Documento actualizado",
        text: "El documento se actualizó correctamente.",
        confirmButtonColor: "#3085d6",
      });
    } else {
      addDocument(data);
      Swal.fire({
        icon: "success",
        title: "Documento creado",
        text: "El documento se creó correctamente.",
        confirmButtonColor: "#3085d6",
      });
    }

    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {documentToEdit ? "Editar Documento" : "Nuevo Documento"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            {documentToEdit
              ? "Modifique los detalles del documento."
              : "Ingrese los detalles del nuevo documento legal."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="font-medium text-gray-700 dark:text-gray-200">
              Título
            </Label>
            <Input
              id="title"
              {...register("title", {
                required: "El título es obligatorio.",
                minLength: {
                  value: 4,
                  message: "El título debe tener al menos 4 caracteres.",
                },
                maxLength: {
                  value: 100,
                  message: "El título no puede exceder los 100 caracteres.",
                },
              })}
              placeholder="Ingrese el título del documento"
              className="border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            />
            {errors.title && (
              <span className="text-sm text-red-500">{errors.title.message}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="effectiveDate" className="font-medium text-gray-700 dark:text-gray-200">
              Fecha de Vigencia
            </Label>
            <Input
              id="effectiveDate"
              type="date"
              {...register("effectiveDate", {
                required: "La fecha de vigencia es obligatoria.",
                validate: (value) => {
                  const currentDate = new Date();
                  const selectedDate = new Date(value);
                  const diffInDays = Math.floor(
                    (selectedDate.getTime() - currentDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return diffInDays > 6 || "La fecha debe ser al menos 6 días mayor a la actual.";
                },
              })}
              className="border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            />
            {errors.effectiveDate && (
              <span className="text-sm text-red-500">{errors.effectiveDate.message}</span>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type" className="font-medium text-gray-700 dark:text-gray-200">
              Tipo de Documento
            </Label>
            <Select
              onValueChange={(value) => setValue("type", value as DocumentTypeInter)}
              value={watch("type")}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400">
                <SelectValue placeholder="Seleccione el tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DocumentTypeInter.policy}>Aviso de privacidad</SelectItem>
                <SelectItem value={DocumentTypeInter.terms}>
                  Términos y Condiciones
                </SelectItem>
                <SelectItem value={DocumentTypeInter.boundary}>Deslinde Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content" className="font-medium text-gray-700 dark:text-gray-200">
              Contenido
            </Label>
            <Textarea
              id="content"
              {...register("content", {
                required: "El contenido es obligatorio.",
              })}
              rows={5}
              placeholder="Ingrese el contenido del documento"
              className="border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            />
            {errors.content && (
              <span className="text-sm text-red-500">{errors.content.message}</span>
            )}
          </div>
          <DialogFooter className="flex justify-end mt-4">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 focus:ring focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400"
            >
              {documentToEdit ? "Actualizar Documento" : "Crear Documento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
