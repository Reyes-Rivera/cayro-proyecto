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
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setTimeout(() => {
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
          confirmButtonColor: "#3085d6",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={dialogRef}
        className="relative max-w-2xl w-full mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
        <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6 text-white border-b-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <FileText className="h-5 w-5" />
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
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-5">
            {/* Título */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Título
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
                      message: "El título no puede exceder los 100 caracteres.",
                    },
                  })}
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                />
                {errors.title && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.title.message}
                </motion.p>
              )}
            </div>

            {/* Fecha de Vigencia */}
            <div>
              <label
                htmlFor="effectiveDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Fecha de Vigencia
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
                  className="pl-10 py-2 sm:py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                />
                {errors.effectiveDate && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.effectiveDate && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.effectiveDate.message}
                </motion.p>
              )}
            </div>

            {/* Tipo de Documento - Custom Select */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Tipo de Documento
              </label>
              <div className="relative" ref={selectRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className="pl-10 py-2 sm:py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm text-left flex justify-between items-center"
                >
                  <span>{getDocumentTypeLabel(watch("type"))}</span>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isSelectOpen ? "rotate-180" : ""
                    }`}
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
                </button>

                {isSelectOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      <li>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setValue("type", DocumentTypeInter.boundary);
                            setIsSelectOpen(false);
                          }}
                        >
                          Deslinde Legal
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Contenido
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
                  rows={5}
                  placeholder="Ingrese el contenido del documento"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm appearance-none"
                />
                {errors.content && (
                  <div className="absolute top-2 right-2 flex items-center pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.content && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.content.message}
                </motion.p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Caracteres: {watch("content")?.length || 0}/1000
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6 sm:mt-8 gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-sm"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 sm:h-5 sm:w-5" />
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
    </div>
  );
}
