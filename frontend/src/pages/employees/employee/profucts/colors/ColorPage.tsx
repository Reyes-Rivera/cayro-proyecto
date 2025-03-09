import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Edit, Loader2, Save, Trash, Upload } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { addColor, deleteColor, getColors, updateColor } from "@/api/products";
import { useNavigate } from "react-router-dom";
import colorsImg from "./assets/paleta-de-color.png";

interface DataForm {
  id: number;
  name: string;
  hexValue: string; // Asegúrate de que hexValue sea obligatorio
}

interface FormData {
  name: string;
  image?: FileList;
  hexValue: string; // Asegúrate de que hexValue sea obligatorio
}

const ColorPage = () => {
  const [items, setItems] = useState<DataForm[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
  } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (!data.hexValue) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El valor hexadecimal es obligatorio.",
          confirmButtonColor: "#2563EB",
        });
        return;
      }

      if (editId !== null) {
        setIsLoading(true);
        const updatedItem = await updateColor(editId, {
          name: data.name,
          hexValue: data.hexValue,
        });
        if (updatedItem) {
          Swal.fire({
            icon: "success",
            title: "Tipo de color actualizado",
            text: "El tipo de color ha sido actualizado exitosamente.",
            confirmButtonColor: "#2563EB",
          });
          setItems((prev) =>
            prev.map((cat) =>
              cat.id === editId
                ? {
                    ...cat,
                    name: data.name.trim(),
                    hexValue: data.hexValue.trim(),
                  }
                : cat
            )
          );
          setIsLoading(false);
          setEditId(null);
          reset();
          return;
        }
        setIsLoading(false);
        setEditId(null);
      } else {
        setIsLoading(true);
        const newItem = await addColor({
          name: data.name.trim(),
          hexValue: data.hexValue.trim(),
        });
        if (newItem) {
          Swal.fire({
            icon: "success",
            title: "Tipo de color agregado",
            text: "El tipo de color ha sido agregado exitosamente.",
            confirmButtonColor: "#2563EB",
          });

          setItems((prev) => [
            ...prev,
            { id: prev.length + 1, name: data.name, hexValue: data.hexValue },
          ]);
          setIsLoading(false);
          reset();
          return;
        }
      }

      setPreviewImage(null);
    } catch (error: any) {
      setIsLoading(false);
      if (error?.response?.status === 500) {
        navigate("/500", { state: { fromError: true } });
        return;
      }
      if (error?.response?.status === 409) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message,
          confirmButtonColor: "#2563EB",
        });
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

  const handleEdit = (brand: DataForm) => {
    setValue("name", brand.name);
    setValue("hexValue", brand.hexValue);
    setEditId(brand.id);
  };

  const handleDelete = async (category: DataForm) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Eliminarás el color "${category.name}". Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#2563EB",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteColor(category.id);
        if (response) {
          setItems((prev) => prev.filter((cat) => cat.id !== category.id));

          Swal.fire({
            title: "Eliminado",
            text: `El color "${category.name}" ha sido eliminado.`,
            icon: "success",
            confirmButtonColor: "#2563EB",
          });
        } else {
          throw new Error("No se pudo eliminar el color.");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsLoading(false);
        Swal.fire({
          title: "Error",
          text: "Ocurrió un problema al eliminar el color. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const extractDominantColor = (imageFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas."));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
        const colorCounts: { [key: string]: number } = {};

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const hex = rgbToHex(r, g, b);

          if (colorCounts[hex]) {
            colorCounts[hex]++;
          } else {
            colorCounts[hex] = 1;
          }
        }

        const dominantColor = Object.keys(colorCounts).reduce((a, b) =>
          colorCounts[a] > colorCounts[b] ? a : b
        );

        resolve(dominantColor);
      };

      reader.onerror = () => {
        reject(new Error("Error al leer la imagen."));
      };

      reader.readAsDataURL(imageFile);
    });
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const hex = await extractDominantColor(file); // Extraer el color dominante
        setValue("hexValue", hex);
        clearErrors("hexValue");
      } catch (error) {
        console.error("Error al extraer el color dominante:", error);
        setValue("hexValue", ""); // Limpiar el valor hexadecimal en caso de error
      }
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getColors();
        setItems(res.data);
      } catch (error) {
        if (error === "Error interno en el servidor.") {
          navigate("/500", { state: { fromError: true } });
        }
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col items-center sm:p-6 dark:text-gray-100">
      {/* Encabezado de Página */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-7xl rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Gestión de tipos de color
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Administra el tipo de color de los productos fácilmente.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl">
        {/* Formulario (Izquierda) */}
        <div className="md:w-1/3 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {editId !== null ? "Editar color " : "Agregar color "}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 flex-1"
          >
            <div className="space-y-1">
              <label
                htmlFor="colorImage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Imagen del color
              </label>

              <div className="w-32 h-32 relative rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden m-auto">
                <img
                  src={previewImage || colorsImg}
                  alt="Vista previa del color"
                  className="w-full h-full object-cover rounded-md p-2"
                />

                <label
                  htmlFor="colorImage"
                  className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 rounded-full p-2 cursor-pointer shadow-md"
                >
                  <Upload className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </label>

                <input
                  {...register("image")}
                  id="colorImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label
                htmlFor="hexValue"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Valor Hexadecimal
              </label>
              <input
                {...register("hexValue", {
                  required: "El valor hexadecimal es obligatorio",
                  pattern: {
                    value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                    message: "El valor hexadecimal no es válido",
                  },
                })}
                id="hexValue"
                type="text"
                className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                placeholder="#FFFFFF"
              />
              {errors.hexValue && (
                <span className="text-red-500 text-sm">
                  {errors.hexValue.message}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="colorName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nombre
              </label>
              <input
                {...register("name", {
                  required: "El nombre del color es obligatorio",
                  minLength: {
                    value: 1,
                    message:
                      "El nombre del color debe tener al menos un caracter",
                  },
                  maxLength: {
                    value: 50,
                    message:
                      "El nombre del color no puede exceder los 50 caracteres",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$/,
                    message:
                      "El nombre del color solo puede contener letras y números.",
                  },
                })}
                id="colorName"
                type="text"
                className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
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
            Lista de Tipos de Color
          </h2>
          <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Color
                </th>

                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
                  >
                    <td className="px-4 py-4 text-gray-900 dark:text-gray-100 align-middle">
                      {item.id}
                    </td>
                    <td className="px-4 py-4 text-gray-900 dark:text-gray-100 align-middle">
                      <div className="flex items-center gap-10">
                        <div
                          className={`w-8 h-8 rounded-full`}
                          style={{ backgroundColor: item.hexValue }}
                        ></div>
                        {item.name}
                      </div>
                    </td>

                    <td className="px-4 py-4 flex items-center space-x-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-green-500 dark:text-green-300 hover:text-green-700 dark:hover:text-green-400"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
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
                    colSpan={4}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No hay tipos de color disponibles.
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

export default ColorPage;
