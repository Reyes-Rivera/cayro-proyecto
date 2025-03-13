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
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
        console.error("Error al obtener las políticas:", error);
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
          // Desactiva todos los documentos excepto el seleccionado
          const updatedData = currentData.map((doc, i) => ({
            ...doc,
            isCurrentVersion: i === index, // Solo activa el documento en el índice actual
          }));
          setDataMap[activeTab](updatedData);
        }
      };

      if (item.type === DocumentTypeInter.policy && !item.isCurrentVersion) {
        const res = await activePolicyApi(Number(item.id));
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Activado.",
            text: "Documento activado correctamente.",
            confirmButtonColor: "#2F93D1",
          });
          updateDocumentState();
          return;
        }
      }

      if (item.type === DocumentTypeInter.terms && !item.isCurrentVersion) {
        const res = await activeTermsApi(Number(item.id));
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Activado.",
            text: "Documento activado correctamente.",
            confirmButtonColor: "#2F93D1",
          });
          updateDocumentState();
          return;
        }
      }

      if (item.type === DocumentTypeInter.boundary && !item.isCurrentVersion) {
        const res = await activeTermsApi(Number(item.id));
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Activado.",
            text: "Documento activado correctamente.",
            confirmButtonColor: "#2F93D1",
          });
          updateDocumentState();
          return;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error.",
        text: "Algo salió mal, por favor intenta más tarde.",
        confirmButtonColor: "#2F93D1",
      });
    } catch (error) {
      console.log(error);
      navigate("/500", { state: { fromError: true } });
    }
  };

  const deleteDocument = (index: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const currentData = dataMap[activeTab];
        if (currentData) {
          const updatedData = currentData.filter((_, i) => i !== index);
          setDataMap[activeTab](updatedData);

          Swal.fire("Eliminado", "El documento ha sido eliminado.", "success");
        }
      }
    });
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
        effectiveDate: new Date(newDocument.effectiveDate).toISOString(),
      });
      if (res) {
        setTerms((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
        Swal.fire({
          icon: "success",
          title: "Agregado.",
          text: "Documento agregado correctamente.",
          confirmButtonColor: "#2F93D1",
        });
        return;
      }
    }

    if (newDocument.type === DocumentTypeInter.policy) {
      const res = await createPolicysApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: new Date(newDocument.effectiveDate).toISOString(),
      });
      if (res) {
        setPolicies((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
        Swal.fire({
          icon: "success",
          title: "Agregado.",
          text: "Documento agregado correctamente.",
          confirmButtonColor: "#2F93D1",
        });
        return;
      }
    }

    if (newDocument.type === DocumentTypeInter.boundary) {
      const res = await createBoundaryApi({
        title: newDocument.title,
        content: newDocument.content,
        effectiveDate: new Date(newDocument.effectiveDate).toISOString(),
      });
      if (res) {
        setBoundary((prev) =>
          prev
            ? prev
                .map((doc) => ({ ...doc, isCurrentVersion: false }))
                .concat(document)
            : [document]
        );
        Swal.fire({
          icon: "success",
          title: "Agregado.",
          text: "Documento agregado correctamente.",
          confirmButtonColor: "#2F93D1",
        });
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
    try {
      if (newDocument.type === DocumentTypeInter.terms) {
        const res = await updateTermsApi(
          {
            title: newDocument.title,
            content: newDocument.content,
            effectiveDate: new Date(newDocument.effectiveDate).toISOString(),
          },
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
          Swal.fire({
            icon: "success",
            title: "Actualizado.",
            text: "Documento actualizado correctamente.",
            confirmButtonColor: "#2F93D1",
          });
          return;
        }
      }

      if (newDocument.type === DocumentTypeInter.policy) {
        const res = await updatePolicysApi(
          {
            title: newDocument.title,
            content: newDocument.content,
            effectiveDate: new Date(newDocument.effectiveDate).toISOString(),
          },
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
          Swal.fire({
            icon: "success",
            title: "Actualizado.",
            text: "Documento actualizado correctamente.",
            confirmButtonColor: "#2F93D1",
          });
          return;
        }
      }

      if (newDocument.type === DocumentTypeInter.boundary) {
        const res = await updateBoundaryApi(
          {
            title: newDocument.title,
            content: newDocument.content,
            effectiveDate: new Date(newDocument.effectiveDate).toISOString(),
          },
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
          Swal.fire({
            icon: "success",
            title: "Actualizado.",
            text: "Documento actualizado correctamente.",
            confirmButtonColor: "#2F93D1",
          });
          return;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error.",
        text: "Algo salió mal, intenta más tarde.",
        confirmButtonColor: "#2F93D1",
      });
      return;
    } catch (error: any) {
      console.log(error);
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
        <div className="bg-blue-600 text-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6">
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

        {/* Table Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Encabezado de la tabla con gradiente */}
          <div className="bg-white p-6 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2 flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  Listado de Documentos
                </h1>
                <p className="text-blue-700">
                  {filteredData?.length || 0}{" "}
                  {filteredData?.length === 1 ? "documento" : "documentos"} en
                  el sistema
                </p>
              </div>
              <Button
                onClick={() => {
                  setSelectedDocument(null);
                  setIsDialogOpen(true);
                }}
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-md"
              >
                <PlusCircle size={18} className="mr-2" />
                Nuevo Documento
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-200 dark:border-gray-700"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Estado</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterActive(null)}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterActive(true)}>
                    Activos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterActive(false)}>
                    Inactivos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {filterActive !== null && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  {filterActive ? "Activos" : "Inactivos"}
                  <XCircle
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilterActive(null)}
                  />
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-md">
          <div className="flex overflow-x-auto">
            {tabConfig.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-4 sm:px-8 py-4 text-sm font-medium transition-all ${
                  activeTab === tab.label
                    ? `bg-white dark:bg-gray-800 text-${tab.color}-600 dark:text-${tab.color}-400 border-b-4 border-${tab.color}-600 dark:border-${tab.color}-400 shadow-sm`
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    activeTab === tab.label
                      ? `bg-${tab.color}-100 dark:bg-${tab.color}-900/30`
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {tab.icon}
                </div>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            {paginatedData && paginatedData.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-50 dark:bg-indigo-900/30">
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Contenido
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Fecha de Vigencia
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border-b border-indigo-100 dark:border-indigo-800">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData?.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-indigo-50/30 dark:bg-indigo-900/10"
                      } hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors`}
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
                    : "No hay documentos en esta categoría. Crea uno nuevo haciendo clic en el botón 'Añadir Documento'."}
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

          {/* Paginación */}
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
