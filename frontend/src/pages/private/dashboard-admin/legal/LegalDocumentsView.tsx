"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  FileText,
  Lock,
  ShieldCheck,
  PlusCircle,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DocumentDialog from "./DocumentDialog";
import ViewDocumentDialog from "./ViewDocumentDialog";
import {
  activePolicyApi,
  createPolicysApi,
  policiesApi,
  updatePolicysApi,
} from "@/api/policy";
import {
  activeTermsApi,
  createTermsApi,
  termsApi,
  updateTermsApi,
} from "@/api/terms";
import {
  boundaryApi,
  createBoundaryApi,
  updateBoundaryApi,
} from "@/api/boundary";
import { useNavigate } from "react-router-dom";
import { AlertHelper } from "@/utils/alert.util";

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
  id?: number;
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

type Tabs = "Aviso de Privacidad" | "Términos y Condiciones" | "Deslinde Legal";

const tabConfig: { label: Tabs; icon: React.ReactNode; color: string }[] = [
  { label: "Aviso de Privacidad", icon: <Lock size={18} />, color: "blue" },
  {
    label: "Términos y Condiciones",
    icon: <FileText size={18} />,
    color: "green",
  },
  { label: "Deslinde Legal", icon: <ShieldCheck size={18} />, color: "amber" },
];

const LegalDocumentsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tabs>("Aviso de Privacidad");
  const [policies, setPolicies] = useState<RegulatoryDocument[]>([]);
  const [terms, setTerms] = useState<RegulatoryDocument[]>([]);
  const [boundary, setBoundary] = useState<RegulatoryDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewDocument, setViewDocument] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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
        AlertHelper.error({
          title: "Error de carga",
          message:
            "Ocurrió un error al obtener las políticas, términos o límites.",
          error,
          animation: "fadeIn",
        });
      }
    };

    getInfo();
  }, []);

  const dataMap = {
    "Aviso de Privacidad": policies,
    "Términos y Condiciones": terms,
    "Deslinde Legal": boundary,
  };

  const setDataMap = {
    "Aviso de Privacidad": setPolicies,
    "Términos y Condiciones": setTerms,
    "Deslinde Legal": setBoundary,
  };

  const openEditDialog = (document: any) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

  const openViewDialog = (document: any) => {
    setViewDocument(document);
    setIsViewDialogOpen(true);
  };

  const toggleStatus = async (index: number, item: RegulatoryDocument) => {
    try {
      const updateDocumentState = () => {
        const currentData = dataMap[activeTab];
        if (currentData) {
          const updatedData = currentData.map((doc, i) => ({
            ...doc,
            isCurrentVersion: i === index,
          }));
          setDataMap[activeTab](updatedData);
        }
      };

      let res;

      if (item.type === DocumentTypeInter.policy && !item.isCurrentVersion) {
        res = await activePolicyApi(Number(item.id));
      } else if (
        item.type === DocumentTypeInter.terms &&
        !item.isCurrentVersion
      ) {
        res = await activeTermsApi(Number(item.id));
      } else if (
        item.type === DocumentTypeInter.boundary &&
        !item.isCurrentVersion
      ) {
        res = await activeTermsApi(Number(item.id)); // ← ¿debería ser activeBoundaryApi?
      }

      if (res) {
        await AlertHelper.success({
          title: "Activado",
          message: "Documento activado correctamente.",
          animation: "fadeIn",
        });
        updateDocumentState();
      } else {
        await AlertHelper.error({
          title: "Error",
          message: "Algo salió mal, por favor intenta más tarde.",
          animation: "fadeIn",
        });
      }
    } catch (error) {
      AlertHelper.error({
        title: "Error interno",
        message: "Ocurrió un error inesperado al activar el documento.",
        error,
        animation: "fadeIn",
      });
      navigate("/500", { state: { fromError: true } });
    }
  };

  const deleteDocument = async (index: number) => {
    const confirmed = await AlertHelper.confirm({
      title: "¿Estás seguro?",
      message: "Esta acción no se puede revertir",
      confirmText: "Sí, eliminar",
      cancelText: "Cancelar",
      type: "warning",
      animation: "fadeIn",
    });

    if (confirmed) {
      const currentData = dataMap[activeTab];
      if (currentData) {
        const updatedData = currentData.filter((_, i) => i !== index);
        setDataMap[activeTab](updatedData);

        AlertHelper.success({
          title: "Eliminado",
          message: "El documento ha sido eliminado.",
          animation: "fadeIn",
        });
      }
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

    const formattedDate = new Date(newDocument.effectiveDate).toISOString();

    const showSuccessAlert = () =>
      AlertHelper.success({
        title: "Agregado.",
        message: "Documento agregado correctamente.",
        animation: "fadeIn",
      });

    if (newDocument.type === DocumentTypeInter.terms) {
      const res = await createTermsApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: formattedDate,
      });

      if (res) {
        setTerms((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
        showSuccessAlert();
        return;
      }
    }

    if (newDocument.type === DocumentTypeInter.policy) {
      const res = await createPolicysApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: formattedDate,
      });

      if (res) {
        setPolicies((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
        showSuccessAlert();
        return;
      }
    }

    if (newDocument.type === DocumentTypeInter.boundary) {
      const res = await createBoundaryApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: formattedDate,
      });

      if (res) {
        setBoundary((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
        showSuccessAlert();
        return;
      }
    }
  };

  const updateDocument = async (newDocument: {
    title: string;
    content: string;
    effectiveDate: string;
    type: DocumentTypeInter;
    id?: number;
  }) => {
    const document = {
      title: newDocument.title,
      content: newDocument.content,
      effectiveDate: new Date(newDocument.effectiveDate),
      isCurrentVersion: true,
      type: newDocument.type,
    };

    const formattedDate = new Date(newDocument.effectiveDate).toISOString();

    const showSuccessAlert = () =>
      AlertHelper.success({
        title: "Actualizado.",
        message: "Documento actualizado correctamente.",
        animation: "fadeIn",
      });

    try {
      if (newDocument.type === DocumentTypeInter.terms) {
        const res = await updateTermsApi(
          { ...newDocument, effectiveDate: formattedDate },
          Number(newDocument.id)
        );

        if (res) {
          setTerms((prev) =>
            prev
              ? prev
                  .map((doc) => ({ ...doc, isCurrentVersion: false }))
                  .concat(document)
              : [document]
          );
          showSuccessAlert();
          return;
        }
      }

      if (newDocument.type === DocumentTypeInter.policy) {
        const res = await updatePolicysApi(
          { ...newDocument, effectiveDate: formattedDate },
          Number(newDocument.id)
        );

        if (res) {
          setPolicies((prev) =>
            prev
              ? prev
                  .map((doc) => ({ ...doc, isCurrentVersion: false }))
                  .concat(document)
              : [document]
          );
          showSuccessAlert();
          return;
        }
      }

      if (newDocument.type === DocumentTypeInter.boundary) {
        const res = await updateBoundaryApi(
          { ...newDocument, effectiveDate: formattedDate },
          Number(newDocument.id)
        );

        if (res) {
          setBoundary((prev) =>
            prev
              ? prev
                  .map((doc) => ({ ...doc, isCurrentVersion: false }))
                  .concat(document)
              : [document]
          );
          showSuccessAlert();
          return;
        }
      }

      AlertHelper.error({
        title: "Error.",
        message: "Algo salió mal, intenta más tarde.",
        animation: "fadeIn",
      });
    } catch (error: any) {
      AlertHelper.error({
        title: "Error.",
        error,
        message: "Algo salió mal, intenta más tarde.",
        animation: "fadeIn",
      });
      navigate("/500", { state: { fromError: true } });
    }
  };

  const currentData = dataMap[activeTab];

  // Filter data based on search term and active status filter
  const filteredData = currentData?.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterActive === null) {
      return matchesSearch;
    }

    return matchesSearch && item.isCurrentVersion === filterActive;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const paginatedData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-4 sm:p-6 dark:text-gray-100">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="bg-blue-500 text-white rounded-xl shadow-xl overflow-hidden relative">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
          </div>

          <div className="p-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Gestión de Documentos Legales
                </h1>
                <p className="text-gray-100">
                  Administra los documentos legales y regulatorios de tu
                  organización
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center text-gray-900 dark:text-white">
                  <FileText className="w-6 h-6 mr-2" />
                  Listado de Documentos
                </h1>
                <p className="text-blue-700 dark:text-blue-400">
                  {filteredData?.length || 0}{" "}
                  {filteredData?.length === 1 ? "documento" : "documentos"} en
                  el sistema
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedDocument(null);
                  setIsDialogOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-md"
              >
                <PlusCircle size={18} className="mr-2" />
                Nuevo Documento
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100"
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <select
                  value={
                    filterActive === null
                      ? "all"
                      : filterActive
                      ? "active"
                      : "inactive"
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "all") setFilterActive(null);
                    else if (value === "active") setFilterActive(true);
                    else setFilterActive(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              {filterActive !== null && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full text-sm">
                  {filterActive ? "Activos" : "Inactivos"}
                  <button
                    className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                    onClick={() => setFilterActive(null)}
                  >
                    <XCircle className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            {tabConfig.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-4 sm:px-8 py-4 text-sm font-medium transition-all ${
                  activeTab === tab.label
                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    activeTab === tab.label
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {paginatedData && paginatedData.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Contenido
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Fecha de Vigencia
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData?.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          {item.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {item.content}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                          {item.effectiveDate
                            ? new Date(item.effectiveDate).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.isCurrentVersion ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-3">
                          <button
                            onClick={() => openViewDialog(item)}
                            className="bg-blue-100 p-2 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                            title="Ver documento"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className={`${
                              item.isCurrentVersion
                                ? "bg-gray-100 p-2 rounded-lg text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                                : "bg-green-100 p-2 rounded-lg text-green-600 hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            }`}
                            onClick={() =>
                              !item.isCurrentVersion &&
                              toggleStatus(index, item)
                            }
                            disabled={item.isCurrentVersion}
                            title={
                              item.isCurrentVersion
                                ? "Ya está activo"
                                : "Activar documento"
                            }
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => openEditDialog(item)}
                            className="bg-amber-100 p-2 rounded-lg text-amber-600 hover:bg-amber-200 transition-colors dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
                            title="Editar documento"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteDocument(index)}
                            className="bg-red-100 p-2 rounded-lg text-red-600 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                            title="Eliminar documento"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <AlertTriangle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                  No hay documentos disponibles
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                  {searchTerm
                    ? `No se encontraron resultados para "${searchTerm}"`
                    : "No hay documentos en esta categoría. Crea uno nuevo haciendo clic en el botón 'Nuevo Documento'."}
                </p>

                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredData && filteredData.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Mostrar
                </span>
                <select
                  className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={itemsPerPage || 5}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  por página
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {indexOfFirstItem + 1} a{" "}
                {Math.min(indexOfLastItem, filteredData.length)} de{" "}
                {filteredData.length} documentos
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-800 rounded-md text-sm text-blue-700 dark:text-blue-400 font-medium">
                    {currentPage}
                  </span>
                  <span className="mx-1 text-gray-500 dark:text-gray-400">
                    de
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {totalPages || 1}
                  </span>
                </div>

                <button
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DocumentDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedDocument(null);
        }}
        addDocument={addDocument}
        updateDocument={updateDocument}
        documentToEdit={selectedDocument}
      />

      <ViewDocumentDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        document={viewDocument}
      />
    </div>
  );
};

export default LegalDocumentsView;
