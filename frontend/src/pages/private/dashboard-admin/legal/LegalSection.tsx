"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Edit,
  Loader2,
  Trash,
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Shield,
  Lock,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";

// Import API functions
import {
  policiesApi,
  createPolicysApi,
  updatePolicysApi,
  deletePolicysApi,
  activePolicyApi,
} from "@/api/policy";
import {
  termsApi,
  createTermsApi,
  updateTermsApi,
  deleteTermsApi,
  activeTermsApi,
} from "@/api/terms";
import {
  boundaryApi,
  createBoundaryApi,
  updateBoundaryApi,
  deleteBoundaryApi,
  activeBoundaryApi,
} from "@/api/boundary";

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

interface RegulatoryDocument {
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

interface FormData {
  title: string;
  content: string;
  effectiveDate: string;
  type: DocumentTypeInter;
}

// Opciones de ordenación
type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

const sortOptions: SortOption[] = [
  { label: "Más recientes", value: "id", direction: "desc" },
  { label: "Más antiguos", value: "id", direction: "asc" },
  { label: "Título (A-Z)", value: "title", direction: "asc" },
  { label: "Título (Z-A)", value: "title", direction: "desc" },
];

type Tabs = "terms" | "legal" | "policies";

const tabConfig: {
  key: Tabs;
  label: string;
  icon: React.ReactNode;
  type: DocumentTypeInter;
}[] = [
  {
    key: "terms",
    label: "Términos y Condiciones",
    icon: <FileText size={18} />,
    type: DocumentTypeInter.terms,
  },
  {
    key: "legal",
    label: "Deslinde Legal",
    icon: <Shield size={18} />,
    type: DocumentTypeInter.boundary,
  },
  {
    key: "policies",
    label: "Políticas",
    icon: <Lock size={18} />,
    type: DocumentTypeInter.policy,
  },
];

export const LegalSection = () => {
  const [activeTab, setActiveTab] = useState<Tabs>("terms");
  const [policies, setPolicies] = useState<RegulatoryDocument[]>([]);
  const [terms, setTerms] = useState<RegulatoryDocument[]>([]);
  const [boundary, setBoundary] = useState<RegulatoryDocument[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDocument, setViewingDocument] =
    useState<RegulatoryDocument | null>(null);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  // Estado para ordenación
  const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormData>();

  // Obtener datos activos según la pestaña
  const getActiveData = () => {
    switch (activeTab) {
      case "policies":
        return policies;
      case "terms":
        return terms;
      case "legal":
        return boundary;
      default:
        return [];
    }
  };

  // Obtener tipo de documento según la pestaña
  const getDocumentType = () => {
    const config = tabConfig.find((tab) => tab.key === activeTab);
    return config?.type || DocumentTypeInter.terms;
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (editId !== null) {
        setIsLoading(true);
        const documentData = {
          title: data.title,
          content: data.content,
          effectiveDate: new Date(data.effectiveDate).toISOString(),
        };

        let response;
        switch (data.type) {
          case DocumentTypeInter.policy:
            response = await updatePolicysApi(documentData, editId);
            break;
          case DocumentTypeInter.terms:
            response = await updateTermsApi(documentData, editId);
            break;
          case DocumentTypeInter.boundary:
            response = await updateBoundaryApi(documentData, editId);
            break;
        }

        if (response) {
          Swal.fire({
            icon: "success",
            title: "Documento actualizado",
            text: "El documento ha sido actualizado exitosamente.",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          await fetchData();
          setIsLoading(false);
          setEditId(null);
          reset();
          setShowModal(false);
          return;
        }
        setIsLoading(false);
        setEditId(null);
      } else {
        setIsLoading(true);
        const documentData = {
          title: data.title,
          content: data.content,
          effectiveDate: new Date(data.effectiveDate).toISOString(),
        };

        let response;
        switch (data.type) {
          case DocumentTypeInter.policy:
            response = await createPolicysApi(documentData);
            break;
          case DocumentTypeInter.terms:
            response = await createTermsApi(documentData);
            break;
          case DocumentTypeInter.boundary:
            response = await createBoundaryApi(documentData);
            break;
        }

        if (response) {
          Swal.fire({
            icon: "success",
            title: "Documento agregado",
            text: "El documento ha sido agregado exitosamente.",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          await fetchData();
          setIsLoading(false);
          reset();
          setShowModal(false);
          return;
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Ha ocurrido un error",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleEdit = (document: RegulatoryDocument) => {
    setValue("title", document.title || "");
    setValue("content", document.content || "");
    setValue(
      "effectiveDate",
      document.effectiveDate
        ? new Date(document.effectiveDate).toISOString().split("T")[0]
        : ""
    );
    setValue("type", document.type || getDocumentType());
    setEditId(document.id || null);
    setShowModal(true);
  };

  const handleDelete = async (doc: RegulatoryDocument) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás el documento "${doc.title}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        let response;
        switch (doc.type) {
          case DocumentTypeInter.policy:
            response = await deletePolicysApi(Number(doc.id));
            break;
          case DocumentTypeInter.terms:
            response = await deleteTermsApi(Number(doc.id));
            break;
          case DocumentTypeInter.boundary:
            response = await deleteBoundaryApi(Number(doc.id));
            break;
        }

        if (response) {
          await fetchData();
          Swal.fire({
            title: "Eliminado",
            text: "El documento ha sido eliminado.",
            icon: "success",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error("No se pudo eliminar el documento.");
        }
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text:
            error.response?.data?.message ||
            "Ha ocurrido un error al eliminar el documento",
          icon: "error",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  };

  const handleActivate = async (document: RegulatoryDocument) => {
    if (document.isCurrentVersion) return;

    try {
      let response;
      switch (document.type) {
        case DocumentTypeInter.policy:
          response = await activePolicyApi(Number(document.id));
          break;
        case DocumentTypeInter.terms:
          response = await activeTermsApi(Number(document.id));
          break;
        case DocumentTypeInter.boundary:
          response = await activeBoundaryApi(Number(document.id));
          break;
      }

      if (response) {
        Swal.fire({
          icon: "success",
          title: "Activado",
          text: "Documento activado correctamente.",
          confirmButtonColor: "#2563EB",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        await fetchData();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Algo salió mal, por favor intenta más tarde.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleView = (document: RegulatoryDocument) => {
    setViewingDocument(document);
    setShowViewModal(true);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const fetchData = async () => {
    setIsInitialLoading(true);
    try {
      const [policiesRes, termsRes, boundaryRes] = await Promise.all([
        policiesApi(),
        termsApi(),
        boundaryApi(),
      ]);

      setPolicies(policiesRes.data || []);
      setTerms(termsRes.data || []);
      setBoundary(boundaryRes.data || []);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  };

  // Filtrar y ordenar documentos
  const filteredAndSortedItems = getActiveData()
    .filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterActive === null || item.isCurrentVersion === filterActive;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy.value === "title") {
        return sortBy.direction === "asc"
          ? (a.title || "").localeCompare(b.title || "")
          : (b.title || "").localeCompare(a.title || "");
      }
      if (sortBy.value === "id") {
        return sortBy.direction === "asc"
          ? (a.id || 0) - (b.id || 0)
          : (b.id || 0) - (a.id || 0);
      }
      return 0;
    });

  // Cálculo de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Limpiar búsqueda y filtros
  const clearFilters = () => {
    setSearchTerm("");
    setFilterActive(null);
    setCurrentPage(1);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    reset();
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingDocument(null);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDocumentTypeLabel = (type: DocumentTypeInter) => {
    switch (type) {
      case DocumentTypeInter.policy:
        return "Aviso de Privacidad";
      case DocumentTypeInter.terms:
        return "Términos y Condiciones";
      case DocumentTypeInter.boundary:
        return "Deslinde Legal";
      default:
        return "Seleccione el tipo de documento";
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Resetear a la primera página cuando cambia el término de búsqueda o filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterActive, activeTab]);

  // Cerrar el dropdown de ordenación cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSortOptions && !target.closest('[data-sort-dropdown="true"]')) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSortOptions]);

  const handleTabChange = (tab: Tabs) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header section */}
      <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden relative mb-6">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
        </div>

        <div className="p-4 sm:p-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2.5 sm:p-3 rounded-full mr-3 sm:mr-4">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Documentos Legales
                </h2>
                <p className="mt-1 text-white/80 flex items-center text-sm sm:text-base">
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 inline" />
                  {filteredAndSortedItems.length}{" "}
                  {filteredAndSortedItems.length === 1
                    ? "documento"
                    : "documentos"}{" "}
                  disponibles
                </p>
              </div>
            </div>

            <button
              className="w-full sm:w-auto bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              onClick={() => {
                setValue("type", getDocumentType());
                setShowModal(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Documento
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          {/* Search bar with button */}
          <div className="relative flex-grow max-w-full md:max-w-md">
            <div className="flex">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {}} // La búsqueda es en tiempo real
                className="px-4 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter and sort buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Status filter */}
            <div className="relative">
              <select
                className="w-full sm:w-auto px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors appearance-none"
                value={
                  filterActive === null
                    ? ""
                    : filterActive
                    ? "active"
                    : "inactive"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") setFilterActive(null);
                  else if (value === "active") setFilterActive(true);
                  else setFilterActive(false);
                }}
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Sort button */}
            <div className="relative" data-sort-dropdown="true">
              <button
                className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>Ordenar</span>
                {showSortOptions ? (
                  <ChevronUp className="w-4 h-4 ml-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 ml-1" />
                )}
              </button>

              <AnimatePresence>
                {showSortOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-40"
                  >
                    <div className="p-2">
                      {sortOptions.map((option) => (
                        <button
                          key={`${option.value}-${option.direction}`}
                          onClick={() => {
                            setSortBy(option);
                            setShowSortOptions(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            sortBy.value === option.value &&
                            sortBy.direction === option.direction
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={refreshData}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Active filters chips */}
        {(searchTerm || filterActive !== null) && (
          <div className="flex flex-wrap gap-2 items-center p-4 sm:p-6 pt-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Filtros activos:
            </span>

            {searchTerm && (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-3 py-1 flex items-center">
                <span>Búsqueda: {searchTerm}</span>
                <button
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={() => setSearchTerm("")}
                  aria-label="Eliminar filtro de búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {filterActive !== null && (
              <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-3 py-1 flex items-center">
                <span>Estado: {filterActive ? "Activos" : "Inactivos"}</span>
                <button
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  onClick={() => setFilterActive(null)}
                  aria-label="Eliminar filtro de estado"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div
                className={`p-2 rounded-full ${
                  activeTab === tab.key
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

        {/* Documents table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          {isInitialLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900/30 opacity-25"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Cargando documentos legales...
              </p>
            </div>
          ) : (
            <>
              {/* Table header - visible only on tablet and above */}
              <div className="bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-white py-4 px-6 hidden sm:block">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 font-medium">ID</div>
                  <div className="col-span-3 font-medium">Título</div>
                  <div className="col-span-2 font-medium">Tipo</div>
                  <div className="col-span-2 font-medium">Fecha Vigencia</div>
                  <div className="col-span-2 font-medium">Estado</div>
                  <div className="col-span-2 text-right font-medium">
                    Acciones
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 sm:px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Desktop/Tablet View */}
                      <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
                        <div className="col-span-1">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm">
                            {item.id}
                          </span>
                        </div>
                        <div className="col-span-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                            {item.title}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            {getDocumentTypeLabel(item.type!)}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(item.effectiveDate)}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          {item.isCurrentVersion ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactivo
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Ver documento"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleActivate(item)}
                            disabled={item.isCurrentVersion}
                            className={`p-2 rounded-full transition-colors ${
                              item.isCurrentVersion
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                            }`}
                            title={
                              item.isCurrentVersion
                                ? "Ya está activo"
                                : "Activar documento"
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                            title="Editar documento"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            title="Eliminar documento"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile View */}
                      <div className="sm:hidden flex flex-col space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-xs">
                              {item.id}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {getDocumentTypeLabel(item.type!)}
                            </span>
                          </div>
                          {item.isCurrentVersion ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactivo
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(item.effectiveDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                v{item.version || 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(item)}
                            className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Ver documento"
                            aria-label="Ver documento"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleActivate(item)}
                            disabled={item.isCurrentVersion}
                            className={`p-2 rounded-full transition-colors ${
                              item.isCurrentVersion
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                            }`}
                            title={
                              item.isCurrentVersion
                                ? "Ya está activo"
                                : "Activar documento"
                            }
                            aria-label="Activar documento"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                            title="Editar documento"
                            aria-label="Editar documento"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            title="Eliminar documento"
                            aria-label="Eliminar documento"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {searchTerm || filterActive !== null
                        ? "No se encontraron documentos"
                        : "No hay documentos legales"}
                    </p>
                    <p className="text-sm mb-4 text-gray-500 dark:text-gray-400">
                      {searchTerm || filterActive !== null
                        ? "No hay documentos que coincidan con los filtros aplicados"
                        : "Comienza creando un nuevo documento legal"}
                    </p>

                    <div className="mt-6">
                      {searchTerm || filterActive !== null ? (
                        <button
                          onClick={clearFilters}
                          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Limpiar filtros
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setValue("type", getDocumentType());
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" />
                          Nuevo Documento
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Mostrar
                    </span>
                    <select
                      className="border border-gray-300 dark:border-gray-600 rounded-md text-sm p-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
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
                    {Math.min(indexOfLastItem, filteredAndSortedItems.length)}{" "}
                    de {filteredAndSortedItems.length} documentos
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={currentPage === 1}
                      onClick={() => paginate(currentPage - 1)}
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center">
                      <input
                        type="text"
                        className="w-12 px-2 py-1 text-center border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        value={currentPage}
                        onChange={(e) => {
                          const page = Number.parseInt(e.target.value);
                          if (!isNaN(page) && page > 0 && page <= totalPages) {
                            setCurrentPage(page);
                          }
                        }}
                        aria-label="Número de página"
                      />
                      <span className="mx-1 text-gray-500 dark:text-gray-400">
                        de
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {totalPages}
                      </span>
                    </div>

                    <button
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={currentPage === totalPages}
                      onClick={() => paginate(currentPage + 1)}
                      aria-label="Página siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal para crear/editar documento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editId !== null ? "Editar Documento" : "Nuevo Documento"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {editId !== null
                  ? "Modifica los datos del documento legal seleccionado"
                  : "Completa los datos para crear un nuevo documento legal"}
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  {/* Título */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Título *
                    </label>
                    <input
                      {...register("title", {
                        required: "El título es obligatorio",
                        minLength: {
                          value: 4,
                          message: "El título debe tener al menos 4 caracteres",
                        },
                        maxLength: {
                          value: 200,
                          message:
                            "El título no puede exceder los 200 caracteres",
                        },
                      })}
                      type="text"
                      placeholder="Ej: Política de Privacidad v2.0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Tipo de Documento */}
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Tipo de Documento *
                    </label>
                    <select
                      {...register("type", {
                        required: "El tipo de documento es obligatorio",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value={DocumentTypeInter.policy}>
                        Aviso de Privacidad
                      </option>
                      <option value={DocumentTypeInter.terms}>
                        Términos y Condiciones
                      </option>
                      <option value={DocumentTypeInter.boundary}>
                        Deslinde Legal
                      </option>
                    </select>
                    {errors.type && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  {/* Fecha de Vigencia */}
                  <div>
                    <label
                      htmlFor="effectiveDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Fecha de Vigencia *
                    </label>
                    <input
                      {...register("effectiveDate", {
                        required: "La fecha de vigencia es obligatoria",
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
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    />
                    {errors.effectiveDate && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.effectiveDate.message}
                      </p>
                    )}
                  </div>

                  {/* Contenido */}
                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Contenido del documento *
                    </label>
                    <textarea
                      {...register("content", {
                        required: "El contenido es obligatorio",
                        minLength: {
                          value: 10,
                          message:
                            "El contenido debe tener al menos 10 caracteres",
                        },
                      })}
                      rows={6}
                      placeholder="Ingrese el contenido completo del documento legal..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      disabled={isLoading}
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.content.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Caracteres: {watch("content")?.length || 0}/5000
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : editId !== null ? (
                      "Actualizar Documento"
                    ) : (
                      "Crear Documento"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver documento */}
      {showViewModal && viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {viewingDocument.title}
                </h3>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-full">
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  {getDocumentTypeLabel(viewingDocument.type!)}
                </div>
                <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Vigencia: {formatDate(viewingDocument.effectiveDate)}
                </div>
                <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Versión: {viewingDocument.version || 1}
                </div>
                {viewingDocument.isCurrentVersion ? (
                  <div className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activo
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full">
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactivo
                  </div>
                )}
              </div>

              <div className="max-h-[50vh] overflow-y-auto">
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {viewingDocument.content}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeViewModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

