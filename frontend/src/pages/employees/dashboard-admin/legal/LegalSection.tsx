"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Shield,
  Lock,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import ViewDocumentDialog from "./ViewDocumentDialog";

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
  documentElement: any;
}

export function LegalSection() {
  const [activeTab, setActiveTab] = useState<"terms" | "legal" | "policies">(
    "terms"
  );
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    id?: number;
    title: string;
    content: string;
    effectiveDate: string;
    type: DocumentTypeInter;
  }>({
    title: "",
    content: "",
    effectiveDate: "",
    type: DocumentTypeInter.terms,
  });
  const [viewingDocument, setViewingDocument] =
    useState<RegulatoryDocument | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    content?: string;
    effectiveDate?: string;
  }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const typeSelectRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Data from database
  const [policies, setPolicies] = useState<RegulatoryDocument[]>([]);
  const [terms, setTerms] = useState<RegulatoryDocument[]>([]);
  const [boundary, setBoundary] = useState<RegulatoryDocument[]>([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        typeSelectRef.current &&
        !typeSelectRef.current.contains(event.target as Node)
      ) {
        setIsTypeSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle escape key for dialog
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFormDialogOpen) {
          setIsFormDialogOpen(false);
        }
      }
    };

    if (isFormDialogOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isFormDialogOpen]);

  // Load data on init
  useEffect(() => {
    fetchData();
  }, []);

  // Function to load data from API
  const fetchData = async () => {
    setIsLoading(true);
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not load documents. Please try again.",
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Function to refresh data
  const refreshData = () => {
    setIsRefreshing(true);
    fetchData();
  };

  // Map data based on active tab
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

  // Get document type based on active tab
  const getDocumentType = () => {
    switch (activeTab) {
      case "policies":
        return DocumentTypeInter.policy;
      case "terms":
        return DocumentTypeInter.terms;
      case "legal":
        return DocumentTypeInter.boundary;
      default:
        return DocumentTypeInter.terms;
    }
  };

  // Filter data
  const filteredData = getActiveData().filter(
    (item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterActive === null || item.isCurrentVersion === filterActive)
  );

  const handleTabChange = (tab: "terms" | "legal" | "policies") => {
    setActiveTab(tab);
    setFormData((prev) => ({
      ...prev,
      type:
        tab === "policies"
          ? DocumentTypeInter.policy
          : tab === "terms"
          ? DocumentTypeInter.terms
          : DocumentTypeInter.boundary,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEdit = (document: RegulatoryDocument) => {
    setFormData({
      id: document.id,
      title: document.title || "",
      content: document.content || "",
      effectiveDate: document.effectiveDate
        ? new Date(document.effectiveDate).toISOString().split("T")[0]
        : "",
      type: document.type || getDocumentType(),
    });
    setIsFormDialogOpen(true);
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      content: "",
      effectiveDate: "",
      type: getDocumentType(),
    });
    setFormErrors({});
    setIsFormDialogOpen(false);
  };

  const validateForm = () => {
    const errors: {
      title?: string;
      content?: string;
      effectiveDate?: string;
    } = {};

    if (!formData.title || formData.title.length < 4) {
      errors.title = "El título debe tener al menos 4 caracteres";
    }

    if (!formData.content || formData.content.length < 4) {
      errors.content = "El contenido debe tener al menos 4 caracteres";
    }

    if (!formData.effectiveDate) {
      errors.effectiveDate = "La fecha de vigencia es obligatoria";
    } else {
      const currentDate = new Date();
      const effectiveDate = new Date(formData.effectiveDate);
      const diffInDays = Math.floor(
        (effectiveDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (diffInDays <= 6) {
        errors.effectiveDate =
          "La fecha debe ser al menos 6 días mayor a la actual";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const documentData = {
        title: formData.title,
        content: formData.content,
        effectiveDate: new Date(formData.effectiveDate).toISOString(),
      };

      if (formData.id) {
        // Update existing document
        let response;

        switch (formData.type) {
          case DocumentTypeInter.policy:
            response = await updatePolicysApi(documentData, formData.id);
            break;
          case DocumentTypeInter.terms:
            response = await updateTermsApi(documentData, formData.id);
            break;
          case DocumentTypeInter.boundary:
            response = await updateBoundaryApi(documentData, formData.id);
            break;
        }

        if (response) {
          Swal.fire({
            icon: "success",
            title: "Actualizado",
            text: "El documento ha sido actualizado correctamente",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          fetchData();
        }
      } else {
        // Create new document
        let response;

        switch (formData.type) {
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
            title: "Creado",
            text: "El documento ha sido creado correctamente",
            confirmButtonColor: "#2563EB",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          fetchData();
        }
      }

      handleCancel();
    } catch (error) {
      console.error("Error saving document:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el documento. Por favor, intente nuevamente.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleDelete = async (document: RegulatoryDocument) => {
    if (!document.id) return;

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: document.documentElement.classList.contains("dark")
        ? "#1F2937"
        : "#FFFFFF",
      color: document.documentElement.classList.contains("dark")
        ? "#F3F4F6"
        : "#111827",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let response;

          switch (document.type) {
            case DocumentTypeInter.policy:
              response = await deletePolicysApi(Number(document.id));
              break;
            case DocumentTypeInter.terms:
              response = await deleteTermsApi(Number(document.id));
              break;
            case DocumentTypeInter.boundary:
              response = await deleteBoundaryApi(Number(document.id));
              break;
          }

          if (response) {
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
            fetchData();
          }
        } catch (error) {
          console.error("Error deleting document:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el documento. Por favor, intente nuevamente.",
            confirmButtonColor: "#2563EB",
          });
        }
      }
    });
  };

  const handleActivate = async (document: RegulatoryDocument) => {
    if (!document.id || document.isCurrentVersion) return;

    try {
      let response;

      switch (document.type) {
        case DocumentTypeInter.policy:
          response = await activePolicyApi(document.id);
          break;
        case DocumentTypeInter.terms:
          response = await activeTermsApi(document.id);
          break;
        case DocumentTypeInter.boundary:
          response = await activeBoundaryApi(document.id);
          break;
      }

      if (response) {
        Swal.fire({
          icon: "success",
          title: "Activado",
          text: "El documento ha sido activado correctamente",
          confirmButtonColor: "#2563EB",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error activating document:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo activar el documento. Por favor, intente nuevamente.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleView = (document: RegulatoryDocument) => {
    setViewingDocument(document);
    setIsDialogOpen(true);
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

  return (
    <motion.div
      className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gray-50 dark:bg-gray-900 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 opacity-10 dark:opacity-20 rounded-xl sm:rounded-2xl md:rounded-3xl"></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg text-white">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Documentos Legales
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2 max-w-2xl">
                    Administre los documentos legales de su organización.
                    Mantenga actualizados los términos, políticas y deslindes.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFormData({
                    title: "",
                    content: "",
                    effectiveDate: "",
                    type: getDocumentType(),
                  });
                  setIsFormDialogOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 w-full md:w-auto"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Nuevo Documento</span>
              </motion.button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>
        </div>
      </motion.div>

      {/* Search bar and filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
          <div className="relative flex-grow max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="pl-10 pr-10 py-2 sm:py-3 w-full border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Sort dropdown */}
            <div className="relative" data-sort-dropdown="true">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm text-sm"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden xs:inline">Ordenar</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </motion.button>
            </div>

            {/* Status filter */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm text-sm"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden xs:inline">Estado</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </motion.button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setFilterActive(null);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Todos
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setFilterActive(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Activos
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setFilterActive(false);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Inactivos
                  </button>
                </div>
              )}
            </div>

            {/* Refresh button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshData}
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-650 transition-colors shadow-sm"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span className="sr-only">Refrescar</span>
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto">
          <button
            onClick={() => handleTabChange("terms")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === "terms"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Términos y Condiciones</span>
          </button>
          <button
            onClick={() => handleTabChange("legal")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === "legal"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Deslinde Legal</span>
          </button>
          <button
            onClick={() => handleTabChange("policies")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === "policies"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Políticas</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
              <AnimatePresence>
                {filteredData.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-1.5 sm:p-2 rounded-lg shadow-md">
                            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 sm:px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400">
                            #{document.id}
                          </span>
                          {document.isCurrentVersion ? (
                            <span className="text-xs sm:text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Activo
                            </span>
                          ) : (
                            <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Inactivo
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(document)}
                            className="bg-blue-100 dark:bg-blue-900/30 p-1.5 sm:p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            title="Ver documento"
                          >
                            <Eye
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleActivate(document)}
                            disabled={document.isCurrentVersion}
                            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                              document.isCurrentVersion
                                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                            }`}
                            title={
                              document.isCurrentVersion
                                ? "Ya está activo"
                                : "Activar documento"
                            }
                          >
                            <CheckCircle
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(document)}
                            className="bg-amber-100 dark:bg-amber-900/30 p-1.5 sm:p-2 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                            title="Editar documento"
                          >
                            <Edit
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(document)}
                            className="bg-red-100 dark:bg-red-900/30 p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            title="Eliminar documento"
                          >
                            <Trash2
                              size={16}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          </motion.button>
                        </div>
                      </div>

                      <div className="mt-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                          {document.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                          {document.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Vigencia: {formatDate(document.effectiveDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Versión: {document.version || 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6 text-center"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-full mb-4">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 dark:text-blue-300" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                {searchTerm
                  ? `No se encontraron resultados para "${searchTerm}"`
                  : "No hay documentos disponibles"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md">
                {searchTerm
                  ? "Intenta con otro término de búsqueda o limpia los filtros para ver todos los documentos"
                  : "Añade documentos legales para comenzar a gestionar la información regulatoria de tu organización"}
              </p>
              {searchTerm ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm("")}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm flex items-center gap-2 text-sm"
                >
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Limpiar búsqueda
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormData({
                      title: "",
                      content: "",
                      effectiveDate: "",
                      type: getDocumentType(),
                    });
                    setIsFormDialogOpen(true);
                  }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-md transition-colors flex items-center gap-2 text-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Añadir Documento
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Form Modal */}
      {isFormDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={dialogRef}
            className="relative max-w-2xl w-full mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-full shadow-sm">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {formData.id ? "Editar Documento" : "Nuevo Documento"}
                  </h2>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 ml-11">
                {formData.id
                  ? "Modifique los detalles del documento legal."
                  : "Ingrese los detalles del nuevo documento legal."}
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid gap-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Título
                </label>
                <div className="relative">
                  <input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Escribe el título del documento"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      formErrors.title
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  />
                  {formErrors.title && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tipo de Documento
                </label>
                <div className="relative" ref={typeSelectRef}>
                  <button
                    type="button"
                    onClick={() => setIsTypeSelectOpen(!isTypeSelectOpen)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-left flex justify-between items-center"
                  >
                    <span>{getDocumentTypeLabel(formData.type)}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        isTypeSelectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isTypeSelectOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                      <ul className="py-1 max-h-60 overflow-auto">
                        <li>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                type: DocumentTypeInter.policy,
                              }));
                              setIsTypeSelectOpen(false);
                            }}
                          >
                            Aviso de Privacidad
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                type: DocumentTypeInter.terms,
                              }));
                              setIsTypeSelectOpen(false);
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
                              setFormData((prev) => ({
                                ...prev,
                                type: DocumentTypeInter.boundary,
                              }));
                              setIsTypeSelectOpen(false);
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

              <div className="grid gap-2">
                <label
                  htmlFor="effectiveDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Fecha de Vigencia
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="effectiveDate"
                    name="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={handleInputChange}
                    className={`pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      formErrors.effectiveDate
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  />
                  {formErrors.effectiveDate && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.effectiveDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.effectiveDate}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Contenido
                </label>
                <div className="relative">
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Escribe el contenido del documento"
                    rows={5}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      formErrors.content
                        ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  />
                  {formErrors.content && (
                    <div className="absolute right-3 top-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.content && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.content}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  {formData.id ? "Actualizar" : "Guardar"}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ViewDocumentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        document={viewingDocument}
      />
    </motion.div>
  );
}
