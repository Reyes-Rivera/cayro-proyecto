"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";
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
      <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl border-0 dark:border dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white">
              {document?.title || "Documento"}
            </DialogTitle>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <FileText className="h-3.5 w-3.5 mr-1" />
              {getDocumentTypeLabel(document?.type)}
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Vigencia: {formatDate(document?.effectiveDate)}
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Versión: {document?.version || 1}
            </div>

            {document?.isCurrentVersion ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Activo
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-gray-600 dark:text-gray-400"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Inactivo
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div
          className={`overflow-y-auto ${
            expanded ? "max-h-[60vh]" : "max-h-[30vh]"
          } transition-all duration-300`}
        >
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md my-2">
            <div className="prose dark:prose-invert max-w-none">
              <textarea className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {document?.content}
              </textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            {expanded ? "Mostrar menos" : "Mostrar más"}
          </Button>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              onClick={onClose}
            >
              Cerrar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
