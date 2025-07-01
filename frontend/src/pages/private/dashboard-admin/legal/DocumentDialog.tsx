"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import {
  AlertCircle,
  Calendar,
  FileText,
  Loader2,
  Save,
  Tag,
  X,
} from "lucide-react";

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

  const [isLoading, setIsLoading] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setIsLoading(true);
    const currentDate = new Date();
    const effectiveDate = new Date(data.effectiveDate);
    const diffInDays = Math.floor(
      (effectiveDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 6) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Fecha inválida",
        text: "La fecha de vigencia debe ser al menos 6 días mayor a la fecha actual.",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    setTimeout(() => {
      if (documentToEdit && updateDocument) {
        const updatedDocument: Document = {
          ...documentToEdit,
          ...data,
        };
        updateDocument(updatedDocument);
        Swal.fire({
          icon: "success",
          title: "Documento actualizado",
          text: "El documento se actualizó correctamente.",
          confirmButtonColor: "#2563EB",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        addDocument(data);
        Swal.fire({
          icon: "success",
          title: "Documento creado",
          text: "El documento se creó correctamente.",
          confirmButtonColor: "#2563EB",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
      setIsLoading(false);
      reset();
      onClose();
    }, 600);
  };

  const getDocumentTypeLabel = (type: DocumentTypeInter) => {
    switch (type) {
      case DocumentTypeInter.policy:
        return "Aviso de privacidad";
      case DocumentTypeInter.terms:
        return "Términos y Condiciones";
      case DocumentTypeInter.boundary:
        return "Deslinde Legal";
      default:
        return "Seleccione el tipo de documento";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto">
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
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
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
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Título del documento *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    id="title"
                    {...register("title", {
                      required: "El título es obligatorio.",
                      minLength: {
                        value: 4,
                        message: "El título debe tener al menos 4 caracteres.",
                      },
                      maxLength: {
                        value: 100,
                        message:
                          "El título no puede exceder los 100 caracteres.",
                      },
                    })}
                    placeholder="Ej: Política de Privacidad v2.0"
                    className="pl-10 w-full py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm"
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.title.message}
                  </motion.p>
                )}
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="pl-10 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm text-left flex justify-between items-center"
                    disabled={isLoading}
                  >
                    <span>{getDocumentTypeLabel(watch("type"))}</span>
                    <motion.div
                      animate={{ rotate: isSelectOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  </button>

                  {isSelectOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
                    >
                      <ul className="py-1">
                        <li>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => {
                              setValue("type", DocumentTypeInter.policy);
                              setIsSelectOpen(false);
                            }}
                          >
                            Aviso de privacidad
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => {
                              setValue("type", DocumentTypeInter.terms);
                              setIsSelectOpen(false);
                            }}
                          >
                            Términos y Condiciones
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => {
                              setValue("type", DocumentTypeInter.boundary);
                              setIsSelectOpen(false);
                            }}
                          >
                            Deslinde Legal
                          </button>
                        </li>
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
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
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
                        return (
                          diffInDays > 6 ||
                          "La fecha debe ser al menos 6 días mayor a la actual."
                        );
                      },
                    })}
                    className="pl-10 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    disabled={isLoading}
                  />
                  {errors.effectiveDate && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.effectiveDate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.effectiveDate.message}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  La fecha debe ser al menos 6 días posterior a la fecha actual
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
                        value: 10,
                        message:
                          "El contenido debe tener al menos 10 caracteres.",
                      },
                    })}
                    rows={6}
                    placeholder="Ingrese el contenido completo del documento legal..."
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm resize-none"
                    disabled={isLoading}
                  />
                  {errors.content && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.content && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.content.message}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Caracteres: {watch("content")?.length || 0}/5000
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
                className="px-6 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm disabled:opacity-50"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
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
