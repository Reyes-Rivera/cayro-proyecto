"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Shield,
  Lock,
  PlusCircle,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import ViewDocumentDialog from "./ViewDocumentDialog";

export function LegalSection() {
  const [activeTab, setActiveTab] = useState<"terms" | "legal" | "policies">(
    "terms"
  );
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const legalData = [
    {
      id: 1,
      title: "Términos y condiciones",
      content:
        "Contenido de los términos y condiciones de uso de la plataforma. Este documento establece las reglas y directrices para el uso del servicio.",
      type: "terms",
    },
    {
      id: 2,
      title: "Deslinde legal",
      content:
        "Contenido del deslinde legal que limita la responsabilidad de la empresa ante ciertos eventos o circunstancias.",
      type: "legal",
    },
    {
      id: 3,
      title: "Políticas de privacidad",
      content:
        "Contenido de las políticas de privacidad que explican cómo se recopilan, utilizan y protegen los datos de los usuarios.",
      type: "policies",
    },
  ];

  const filteredData = legalData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      ((activeTab === "terms" && item.type === "terms") ||
        (activeTab === "legal" && item.type === "legal") ||
        (activeTab === "policies" && item.type === "policies"))
  );

  const handleTabChange = (tab: "terms" | "legal" | "policies") =>
    setActiveTab(tab);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (data: { title: string; content: string }) => {
    setFormData(data);
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({ title: "", content: "" });
    setEditing(false);
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar o actualizar los datos
    handleCancel();
  };

  const handleView = (document: any) => {
    setViewingDocument(document);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Documentos Legales
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Administre los documentos legales de su organización
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar documentos..."
                  className="pl-10 w-full sm:w-64 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                onClick={() => {
                  setFormData({ title: "", content: "" });
                  setEditing(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Nuevo
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-md">
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
        </div>

        {/* Tabla */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-b-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Título
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Contenido
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.length > 0 ? (
                  filteredData.map((data) => (
                    <tr
                      key={data.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">
                        {data.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 truncate max-w-xs">
                        {data.content}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleView(data)}
                          >
                            Ver más
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            onClick={() => handleEdit(data)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No se encontraron documentos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulario */}
        {editing && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {formData.title ? "Editar Documento" : "Nuevo Documento"}
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Título
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Escribe el título del documento"
                  className="w-full border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Contenido
                </label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Escribe el contenido del documento"
                  className="w-full h-40 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ViewDocumentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        document={viewingDocument}
      />
    </div>
  );
}
