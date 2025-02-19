import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Edit, Loader2, Save, Trash } from "lucide-react";
import Swal from "sweetalert2"; // Importamos SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css"; // Estilos de SweetAlert2
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/api/products";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

interface FormData {
  name: string;
}

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (editId !== null) {
        setIsLoading(true);
        const updatedCategory = await updateCategory(editId, data);
        if (updatedCategory) {
          Swal.fire({
            icon: "success",
            title: "Categoría actualizada",
            text: "La categoría ha sido actualizada exitosamente.",
            confirmButtonColor: "#2563EB",
          });
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === editId ? { ...cat, name: data.name } : cat
            )
          );
          setIsLoading(false);
          setEditId(null);
          return;
        }
        setIsLoading(false);
        setEditId(null);
      } else {
        setIsLoading(true);
        const newCategory = await addCategory(data);
        if (newCategory) {
          Swal.fire({
            icon: "success",
            title: "Categoría agregada",
            text: "La categoría ha sido agregada exitosamente.",
            confirmButtonColor: "#2563EB",
          });

          setCategories((prev) => [
            ...prev,
            { id: prev.length + 1, name: data.name },
          ]);
          setIsLoading(false);
          return;
        }
      }

      reset();
    } catch (error) {
      if (error === "Error interno en el servidor.") {
        navigate("/500", { state: { fromError: true } });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al procesar la solicitud. Inténtalo de nuevo.",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  const handleEdit = (category: Category) => {
    setValue("name", category.name);
    setEditId(category.id);
  };

  const handleDelete = async (category: Category) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás la categoría "${category.name}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#2563EB",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteCategory(category.id);
        if (response) {
          setCategories((prev) => prev.filter((cat) => cat.id !== category.id));

          Swal.fire({
            title: "Eliminado",
            text: `La categoría "${category.name}" ha sido eliminada.`,
            icon: "success",
            confirmButtonColor: "#2563EB",
          });
        } else {
          throw new Error("No se pudo eliminar la categoría.");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Ocurrió un problema al eliminar la categoría. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (error) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
          return;
        }
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center sm:p-6 dark:text-gray-100">
      {/* Encabezado de Página */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-7xl rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gestión de Categorías
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Administra las categorías de productos fácilmente.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl">
        {/* Formulario (Izquierda) */}
        <div className="md:w-1/3 h-64 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {editId !== null ? "Editar Categoría" : "Agregar Categoría"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 flex-1"
          >
            <div className="space-y-1">
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nombre
              </label>
              <input
                {...register("name", {
                  required: "El nombre de la categoría es obligatorio",
                  minLength: {
                    value: 3,
                    message:
                      "El nombre de la categoría debe tener al menos 3 caracteres",
                  },
                  maxLength: {
                    value: 50,
                    message:
                      "El nombre de la categoría no puede exceder los 50 caracteres",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/,
                    message:
                      "El nombre de la categoría solo puede contener letras y números.",
                  },
                })}
                id="categoryName"
                type="text"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 dark:text-gray-100"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="mt-auto flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Cargando...
                  </>
                ) : (
                  <>
                    <Save />
                    {editId !== null ? "Actualizar" : "Agregar"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla (Derecha) */}
        <div className="md:w-2/3 overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Lista de Categorías
          </h2>
          <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                  >
                    <td className="px-4 py-4 text-gray-900 dark:text-gray-100 align-middle">
                      {category.id}
                    </td>
                    <td className="px-4 py-4 text-gray-900 dark:text-gray-100 align-middle">
                      {category.name}
                    </td>
                    <td className="px-4 py-4 flex items-center space-x-4">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-400"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400 transition"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No hay categorías disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
