import React, { useEffect, useState } from "react";
import {
  FileText,
  Lock,
  ShieldCheck,
  PlusCircle,
  Edit,
  Trash,
} from "lucide-react";
import DocumentDialog from "./DocumentDialog";
import { createPolicysApi, policiesApi } from "@/api/policy";
import { createTermsApi, termsApi } from "@/api/terms";
import { boundaryApi, createBoundaryApi } from "@/api/boundary";

export enum Status {
  current = "CURRENT",
  not_current = "NOT_CURRENT",
  removed = "REMOVED",
}

export enum DocumentTypeInter {
  policy = "POLICIES",
  terms = "TERMS_AND_CONDITIONS",
  boundary = "LEGAL_DISCLAIMER",
}

export class RegulatoryDocument {
  title?: string;
  content?: string;
  version?: number;

  effectiveDate?: Date;
  isDeleted?: boolean;
  isCurrentVersion?: boolean;
  previousVersionId?: string;
  status?: Status;
  type?: DocumentTypeInter;
}

type Tabs =
  | "Política de Privacidad"
  | "Términos y Condiciones"
  | "Deslinde Legal";

const tabConfig: { label: Tabs; icon: React.ReactNode }[] = [
  { label: "Política de Privacidad", icon: <Lock size={18} /> },
  { label: "Términos y Condiciones", icon: <FileText size={18} /> },
  { label: "Deslinde Legal", icon: <ShieldCheck size={18} /> },
];

const LegalDocumentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tabs>("Política de Privacidad");
  const [policies, setPolicies] = useState<RegulatoryDocument[]>([]);
  const [terms, setTerms] = useState<RegulatoryDocument[]>([]);
  const [boundary, setBoundary] = useState<RegulatoryDocument[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const getPolicy = await policiesApi();
        const getTerms = await termsApi();
        const getBoundary = await boundaryApi();
        setPolicies(getPolicy.data);
        setTerms(getTerms.data);
        setBoundary(getBoundary.data);
      } catch (error) {
        console.error("Error al obtener las políticas:", error);
      }
    };

    getInfo();
  }, []);

  const dataMap = {
    "Política de Privacidad": policies,
    "Términos y Condiciones": terms,
    "Deslinde Legal": boundary,
  };

  const setDataMap = {
    "Política de Privacidad": setPolicies,
    "Términos y Condiciones": setTerms,
    "Deslinde Legal": setBoundary,
  };

  const toggleStatus = (index: number) => {
    const currentData = dataMap[activeTab];
    if (currentData) {
      const updatedData = currentData.map((doc, i) => ({
        ...doc,
        isCurrentVersion: i === index,
      }));
      setDataMap[activeTab](updatedData);
    }
  };

  const deleteDocument = (index: number) => {
    const currentData = dataMap[activeTab];
    if (currentData) {
      const updatedData = currentData.filter((_, i) => i !== index);
      setDataMap[activeTab](updatedData);
    }
  };

  const addDocument = async (newDocument: {
    title: string;
    content: string;
    effectiveDate: string;
    type: DocumentTypeInter;
  }) => {
    const document = {
      title: newDocument.title,
      content: newDocument.content,
      effectiveDate: new Date(newDocument.effectiveDate),
      isCurrentVersion: true,
      type: newDocument.type,
    };
    if (newDocument.type === DocumentTypeInter.terms) {
      const res = await createTermsApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: newDocument.effectiveDate,
      });
      if (res) {
        setTerms((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
      }
    }

    if (newDocument.type === DocumentTypeInter.policy) {
      const res = await createPolicysApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: newDocument.effectiveDate,
      });
      if (res) {
        setPolicies((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
      }
    }

    if (newDocument.type === DocumentTypeInter.boundary) {
      const res = await createBoundaryApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: newDocument.effectiveDate,
      });
      if (res) {
        setBoundary((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
      }
    }
  };

  const currentData = dataMap[activeTab];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center sm:p-6 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 w-full max-w-7xl rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-gray-100">
            Documentos Legales
          </h1>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Añadir Nuevo</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl rounded-t-lg shadow-md">
        <div className="flex overflow-x-auto sm:justify-start">
          {tabConfig.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 sm:px-8 py-4 text-sm font-medium transition-all ${
                activeTab === tab.label
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300 border-b-4 border-blue-600 dark:border-blue-300 shadow-md"
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 w-full max-w-7xl rounded-b-lg shadow-md p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Lista de Documentos - {activeTab}
        </h2>
        <div className="overflow-x-auto">
          {currentData && currentData.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                    Contenido
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                    Fecha de Vigencia
                  </th>
                  <th className="px-4 py-3 text-center text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs sm:text-sm"
                  >
                    <td className="px-4 py-4 text-gray-800 dark:text-gray-100">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {item.content}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {item.effectiveDate
                        ? new Date(item.effectiveDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                          item.isCurrentVersion
                            ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                            : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                        }`}
                      >
                        {item.isCurrentVersion ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex space-x-2 sm:space-x-4">
                      <button
                        className="text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400"
                        onClick={() => toggleStatus(index)}
                      >
                        {item.isCurrentVersion ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        className="text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-400"
                        onClick={() =>
                          alert("Editar funcionalidad en desarrollo")
                        }
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400"
                        onClick={() => deleteDocument(index)}
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No hay documentos disponibles.
            </p>
          )}
        </div>
      </div>
      <DocumentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        addDocument={addDocument}
      />
    </div>
  );
};

export default LegalDocumentsView;
