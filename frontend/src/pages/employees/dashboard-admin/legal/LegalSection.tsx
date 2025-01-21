import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LegalSection() {
  const [activeTab, setActiveTab] = useState<"terms" | "legal" | "policies">(
    "terms"
  );
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  const legalData = [
    { id: 1, title: "Términos y condiciones", content: "Contenido 1" },
    { id: 2, title: "Deslinde legal", content: "Contenido 2" },
    { id: 3, title: "Políticas", content: "Contenido 3" },
  ];

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
    console.log("Guardado:", formData);
    handleCancel();
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        {["terms", "legal", "policies"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab as "terms" | "legal" | "policies")}
            className={`py-2 px-4 rounded-md font-semibold capitalize ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "terms"
              ? "Términos y Condiciones"
              : tab === "legal"
              ? "Deslinde Legal"
              : "Políticas"}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white p-6 mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-4 text-gray-700 font-semibold">
                Título
              </th>
              <th className="border-b p-4 text-gray-700 font-semibold">
                Contenido
              </th>
              <th className="border-b p-4 text-gray-700 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {legalData.map((data) => (
              <tr key={data.id}>
                <td className="border-b p-4">{data.title}</td>
                <td className="border-b p-4 truncate max-w-xs">
                  {data.content}
                </td>
                <td className="border-b p-4">
                  <Button
                    onClick={() => handleEdit(data)}
                    className="mr-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Editar
                  </Button>
                  <Button className="bg-red-600 text-white hover:bg-red-700">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">
          {editing ? "Editar Registro" : "Agregar Nuevo Registro"}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Título
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Escribe el título"
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Contenido
            </label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Escribe el contenido"
              className="w-full h-32"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={handleCancel}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
