"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  AlertCircle,
  Calendar,
  FileText,
  Loader2,
  Save,
  Tag,
  X,
  ChevronDown,
} from "lucide-react";
import { AlertHelper } from "@/utils/alert.util";

enum DocumentTypeInter {
  policy = "POLICIES",
  terms = "TERMS_AND_CONDITIONS",
  boundary = "LEGAL_DISCLAIMER",
}

interface Document {
  id: number;
  title: string;
  content: string;
  effectiveDate: string;
  type: DocumentTypeInter;
  createdAt: string;
  status: "active" | "draft" | "expired";
}

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  addDocument: (
    newDocument: Omit<Document, "id" | "createdAt" | "status">
  ) => void;
  updateDocument?: (updatedDocument: Document) => void;
  documentToEdit?: Document | null;
}

type FormData = {
  title: string;
  content: string;
  effectiveDate: string;
  type: DocumentTypeInter;
};

// Constantes fuera del componente
const DOCUMENT_TYPE_OPTIONS = [
  { value: DocumentTypeInter.policy, label: "Aviso de privacidad" },
  { value: DocumentTypeInter.terms, label: "Términos y Condiciones" },
  { value: DocumentTypeInter.boundary, label: "Deslinde Legal" },
] as const;

const MIN_DATE_OFFSET_DAYS = 6;
const CONTENT_MAX_LENGTH = 5000;
const TITLE_MAX_LENGTH = 100;
const TITLE_MIN_LENGTH = 4;
const CONTENT_MIN_LENGTH = 10;

// Componente de Error Message reutilizable
const ErrorMessage = ({ message }: { message: string }) => (
  <motion.p
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2"
    role="alert"
  >
    <AlertCircle className="h-4 w-4" aria-hidden="true" />
    {message}
  </motion.p>
);

// Componente de Input con icono
const InputWithIcon = ({
  icon: Icon,
  error,
  children,
}: {
  icon: React.ElementType;
  error?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
      <Icon
        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
        aria-hidden="true"
      />
    </div>
    {children}
    {error && (
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
      </div>
    )}
  </div>
);

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
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      effectiveDate: "",
      type: DocumentTypeInter.policy,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  // Watched values for memoization
  const watchedType = watch("type");
  const watchedContent = watch("content") || "";
  const watchedTitle = watch("title") || "";

  // Memoized document type label
  const documentTypeLabel = useMemo(() => {
    const option = DOCUMENT_TYPE_OPTIONS.find(
      (opt) => opt.value === watchedType
    );
    return option?.label || "Seleccione el tipo de documento";
  }, [watchedType]);

  // Efecto para cargar datos de edición
  useEffect(() => {
    if (documentToEdit) {
      setValue("title", documentToEdit.title);
      setValue("content", documentToEdit.content);
      setValue(
        "effectiveDate",
        documentToEdit.effectiveDate
          ? new Date(documentToEdit.effectiveDate).toISOString().split("T")[0]
          : ""
      );
      setValue("type", documentToEdit.type);
    }
  }, [documentToEdit, setValue]);

  // Handlers optimizados con useCallback
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsSelectOpen(false);
    }
  }, []);

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const handleSelectOption = useCallback(
    (type: DocumentTypeInter) => {
      setValue("type", type);
      setIsSelectOpen(false);
    },
    [setValue]
  );

  const resetForm = useCallback(() => {
    reset();
    setIsLoading(false);
  }, [reset]);

  // Validación de fecha memoizada
  const validateEffectiveDate = useCallback((value: string) => {
    if (!value) return "La fecha de vigencia es obligatoria.";

    const currentDate = new Date();
    const selectedDate = new Date(value);
    const diffInDays = Math.floor(
      (selectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return diffInDays > MIN_DATE_OFFSET_DAYS
      ? true
      : "La fecha debe ser al menos 6 días mayor a la actual.";
  }, []);

  // Submit handler optimizado
  const onSubmit: SubmitHandler<FormData> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        // Validación adicional de fecha
        const dateValidation = validateEffectiveDate(data.effectiveDate);
        if (dateValidation !== true) {
          AlertHelper.error({
            title: "Fecha inválida",
            message: dateValidation,
            animation: "fadeIn",
          });
          setIsLoading(false);
          return;
        }

        // Simular procesamiento asíncrono
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (documentToEdit && updateDocument) {
          const updatedDocument: Document = {
            ...documentToEdit,
            ...data,
          };
          updateDocument(updatedDocument);
          AlertHelper.success({
            title: "Documento actualizado",
            message: "El documento se actualizó correctamente.",
            animation: "slideIn",
          });
        } else {
          addDocument(data);
          AlertHelper.success({
            title: "Documento creado",
            message: "El documento se creó correctamente.",
            animation: "slideIn",
          });
        }

        resetForm();
        onClose();
      } catch (error: any) {
        AlertHelper.error({
          title: "Error",
          message:
            error.response.data.message ||
            "Ha ocurrido un error al procesar el documento.",
          animation: "fadeIn",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [
      documentToEdit,
      updateDocument,
      addDocument,
      resetForm,
      onClose,
      validateEffectiveDate,
    ]
  );

  // Efectos optimizados
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscapeKey]);

  // Reset form cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-dialog-title"
    >
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl my-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>

        {/* Header with gradient background */}
        <div className="relative bg-blue-500 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                <FileText className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="document-dialog-title"
                  className="text-xl font-bold text-white"
                >
                  {documentToEdit ? "Editar Documento" : "Nuevo Documento"}
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  {documentToEdit
                    ? "Modifique los detalles del documento."
                    : "Ingrese los detalles del nuevo documento legal."}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
              aria-label="Cerrar diálogo"
              disabled={isLoading}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 sm:p-6"
            noValidate
          >
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Título del documento *
                </label>
                <InputWithIcon icon={FileText} error={!!errors.title}>
                  <input
                    id="title"
                    {...register("title", {
                      required: "El título es obligatorio.",
                      minLength: {
                        value: TITLE_MIN_LENGTH,
                        message: `El título debe tener al menos ${TITLE_MIN_LENGTH} caracteres.`,
                      },
                      maxLength: {
                        value: TITLE_MAX_LENGTH,
                        message: `El título no puede exceder los ${TITLE_MAX_LENGTH} caracteres.`,
                      },
                    })}
                    placeholder="Ej: Política de Privacidad v2.0"
                    className={`pl-10 pr-10 w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.title ? "border-red-500 dark:border-red-400" : ""
                    }`}
                    disabled={isLoading}
                    aria-invalid={errors.title ? "true" : "false"}
                    aria-describedby={errors.title ? "title-error" : undefined}
                  />
                </InputWithIcon>
                {errors.title && (
                  <ErrorMessage message={errors.title.message!} />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Caracteres: {watchedTitle.length}/{TITLE_MAX_LENGTH}
                </p>
              </div>

              {/* Tipo de Documento - Custom Select */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tipo de Documento *
                </label>
                <div className="relative" ref={selectRef}>
                  <InputWithIcon icon={Tag}>
                    <button
                      type="button"
                      id="type"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className="pl-10 pr-10 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-left flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      aria-haspopup="listbox"
                      aria-expanded={isSelectOpen}
                      aria-labelledby="type-label"
                    >
                      <span>{documentTypeLabel}</span>
                      <motion.div
                        animate={{ rotate: isSelectOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </motion.div>
                    </button>
                  </InputWithIcon>

                  {isSelectOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
                      role="listbox"
                      aria-labelledby="type-label"
                    >
                      <ul className="py-1">
                        {DOCUMENT_TYPE_OPTIONS.map((option) => (
                          <li key={option.value}>
                            <button
                              type="button"
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20"
                              onClick={() => handleSelectOption(option.value)}
                              role="option"
                              aria-selected={watchedType === option.value}
                            >
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Fecha de Vigencia */}
              <div>
                <label
                  htmlFor="effectiveDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Fecha de Vigencia *
                </label>
                <InputWithIcon icon={Calendar} error={!!errors.effectiveDate}>
                  <input
                    id="effectiveDate"
                    type="date"
                    {...register("effectiveDate", {
                      required: "La fecha de vigencia es obligatoria.",
                      validate: validateEffectiveDate,
                    })}
                    className={`pl-10 pr-10 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.effectiveDate
                        ? "border-red-500 dark:border-red-400"
                        : ""
                    }`}
                    disabled={isLoading}
                    aria-invalid={errors.effectiveDate ? "true" : "false"}
                    aria-describedby={
                      errors.effectiveDate ? "date-error" : undefined
                    }
                  />
                </InputWithIcon>
                {errors.effectiveDate && (
                  <ErrorMessage message={errors.effectiveDate.message!} />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  La fecha debe ser al menos {MIN_DATE_OFFSET_DAYS} días
                  posterior a la fecha actual
                </p>
              </div>

              {/* Contenido */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Contenido del documento *
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    {...register("content", {
                      required: "El contenido es obligatorio.",
                      minLength: {
                        value: CONTENT_MIN_LENGTH,
                        message: `El contenido debe tener al menos ${CONTENT_MIN_LENGTH} caracteres.`,
                      },
                      maxLength: {
                        value: CONTENT_MAX_LENGTH,
                        message: `El contenido no puede exceder los ${CONTENT_MAX_LENGTH} caracteres.`,
                      },
                    })}
                    rows={6}
                    placeholder="Ingrese el contenido completo del documento legal..."
                    className={`w-full py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.content ? "border-red-500 dark:border-red-400" : ""
                    }`}
                    disabled={isLoading}
                    aria-invalid={errors.content ? "true" : "false"}
                    aria-describedby={
                      errors.content ? "content-error" : undefined
                    }
                  />
                  {errors.content && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <AlertCircle
                        className="h-5 w-5 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </div>
                {errors.content && (
                  <ErrorMessage message={errors.content.message!} />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Caracteres: {watchedContent.length}/{CONTENT_MAX_LENGTH}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-8 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className="animate-spin h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" aria-hidden="true" />
                    <span>
                      {documentToEdit
                        ? "Actualizar Documento"
                        : "Crear Documento"}
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
