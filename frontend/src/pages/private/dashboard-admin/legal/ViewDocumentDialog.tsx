"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  if (!document) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 dark:border dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
        <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

        {/* Header with gradient background */}
        <DialogHeader className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6 text-white border-b-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <FileText className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                {document?.title || "Documento"}
              </DialogTitle>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <FileText className="h-3.5 w-3.5 mr-1" />
              {getDocumentTypeLabel(document?.type)}
            </div>

            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Vigencia: {formatDate(document?.effectiveDate)}
            </div>

            <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Versión: {document?.version || 1}
            </div>

            {document?.isCurrentVersion ? (
              <Badge className="bg-green-500/30 text-white border-green-400/30 backdrop-blur-sm">
                <CheckCircle className="h-3 w-3 mr-1" />
                Activo
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-white border-white/30 backdrop-blur-sm"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Inactivo
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Document content */}
        <div className="p-4 sm:p-6">
          <div
            className={`overflow-y-auto transition-all duration-300 ${
              expanded ? "max-h-[60vh]" : "max-h-[30vh]"
            }`}
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl my-2 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {document?.content}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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

          <DialogFooter className="flex gap-2 sm:gap-3 p-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm text-sm"
            >
              Cerrar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 text-sm"
            >
              <Download className="h-4 w-4" />
              Descargar
            </motion.button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
