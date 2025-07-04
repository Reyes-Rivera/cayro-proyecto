"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

interface ViewDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id?: string | number;
    title?: string;
    content?: string;
    type?: string;
    effectiveDate?: Date;
    isCurrentVersion?: boolean;
    version?: number;
  } | null;
}

export default function ViewDocumentDialog({
  isOpen,
  onClose,
  document,
}: ViewDocumentDialogProps) {
  const [expanded, setExpanded] = useState(false);

  if (!document || !isOpen) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDocumentTypeLabel = (type?: string) => {
    if (!type) return "Documento";

    switch (type) {
      case "POLICIES":
        return "Aviso de Privacidad";
      case "TERMS_AND_CONDITIONS":
        return "Términos y Condiciones";
      case "LEGAL_DISCLAIMER":
        return "Deslinde Legal";
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-4xl w-full mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>

        {/* Header with gradient background */}
        <div className="relative bg-blue-500 p-4 sm:p-6 rounded-b-[2.5rem]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {document?.title || "Documento"}
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  Visualización del documento legal
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <FileText className="h-3.5 w-3.5 mr-1" />
              {getDocumentTypeLabel(document?.type)}
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Vigencia: {formatDate(document?.effectiveDate)}
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Versión: {document?.version || 1}
            </div>
            {document?.isCurrentVersion ? (
              <div className="flex items-center gap-1 text-sm bg-green-500/30 text-white px-3 py-1.5 rounded-full backdrop-blur-sm border border-green-400/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Activo
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm bg-white/20 text-white px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                <XCircle className="h-3 w-3 mr-1" />
                Inactivo
              </div>
            )}
          </div>
        </div>

        {/* Document content */}
        <div className="p-4 sm:p-6 pt-8">
          <div
            className={`overflow-y-auto transition-all duration-300 ${
              expanded ? "max-h-[60vh]" : "max-h-[30vh]"
            }`}
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {document?.content}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Mostrar más
              </>
            )}
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              Cerrar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
