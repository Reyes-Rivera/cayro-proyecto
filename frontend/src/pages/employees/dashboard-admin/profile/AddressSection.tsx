import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SaveIcon, EditIcon, XIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContextType";
import imgAddress from "./assets/rb_8256.png";
import { getUserAddress, updateProfileEmployee } from "@/api/users"; // Asegúrate de tener estas funciones en tu API
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

interface AddressFormData {
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export function AddressSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState<AddressFormData | any>(null);
  const { user } = useAuth();

  // Configurar react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>();

  // Cargar la dirección del usuario cuando el componente se monte
  useEffect(() => {
    const fetchAddress = async () => {
      if (user?.id) {
        try {
          const addressData = await getUserAddress(Number(user.id));
          setAddress(addressData);
          reset(); 
        } catch (error) {
          console.error("Error al cargar la dirección:", error);
        }
      }
    };

    fetchAddress();
  }, [user, reset]);

  const toggleEditing = () => {
    if (isEditing) {
      reset(address || {}); // Restablecer el formulario si se cancela la edición
    }
    setIsEditing((prev) => !prev);
  };

  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    try {
      if (user?.id) {
        const res = await updateProfileEmployee(Number(user.id), data);
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Dirección actualizada.",
            text: "Su información de dirección ha sido actualizada correctamente.",
            confirmButtonColor: "#2563EB",
          });
          setAddress(data); // Actualizar el estado de la dirección
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error("Error al actualizar la dirección:", error);
      setIsEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 dark:bg-gray-800 dark:text-gray-100">
      {/* Imagen de usuario (opcional) */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full h-64 rounded-md overflow-hidden">
          <img
            src={imgAddress}// Cambia esto por una imagen relacionada con la dirección
            alt="Imagen de dirección"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Información de la dirección */}
      <div className="col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Dirección</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg"
        >
          {/* Calle */}
          <div className="space-y-1 w-full">
            <Label htmlFor="street">Calle</Label>
            <input
              id="street"
              {...register("street", {
                required: "La calle es obligatoria",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.street && (
              <span className="text-sm text-red-500">
                {errors.street.message}
              </span>
            )}
          </div>

          {/* Número Exterior */}
          <div className="space-y-1 w-full">
            <Label htmlFor="exteriorNumber">Número Exterior</Label>
            <input
              id="exteriorNumber"
              {...register("exteriorNumber", {
                required: "El número exterior es obligatorio",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.exteriorNumber && (
              <span className="text-sm text-red-500">
                {errors.exteriorNumber.message}
              </span>
            )}
          </div>

          {/* Número Interior (Opcional) */}
          <div className="space-y-1 w-full">
            <Label htmlFor="interiorNumber">Número Interior (Opcional)</Label>
            <input
              id="interiorNumber"
              {...register("interiorNumber")}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
          </div>

          {/* Colonia */}
          <div className="space-y-1 w-full">
            <Label htmlFor="neighborhood">Colonia</Label>
            <input
              id="neighborhood"
              {...register("neighborhood", {
                required: "La colonia es obligatoria",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.neighborhood && (
              <span className="text-sm text-red-500">
                {errors.neighborhood.message}
              </span>
            )}
          </div>

          {/* Ciudad */}
          <div className="space-y-1 w-full">
            <Label htmlFor="city">Ciudad</Label>
            <input
              id="city"
              {...register("city", {
                required: "La ciudad es obligatoria",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.city && (
              <span className="text-sm text-red-500">
                {errors.city.message}
              </span>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-1 w-full">
            <Label htmlFor="state">Estado</Label>
            <input
              id="state"
              {...register("state", {
                required: "El estado es obligatorio",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.state && (
              <span className="text-sm text-red-500">
                {errors.state.message}
              </span>
            )}
          </div>

          {/* Código Postal */}
          <div className="space-y-1 w-full">
            <Label htmlFor="postalCode">Código Postal</Label>
            <input
              id="postalCode"
              {...register("postalCode", {
                required: "El código postal es obligatorio",
                pattern: {
                  value: /^[0-9]{5}$/,
                  message: "El código postal debe tener 5 dígitos",
                },
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.postalCode && (
              <span className="text-sm text-red-500">
                {errors.postalCode.message}
              </span>
            )}
          </div>

          {/* País */}
          <div className="space-y-1 w-full">
            <Label htmlFor="country">País</Label>
            <select
              id="country"
              {...register("country", { required: "El país es obligatorio" })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            >
              <option value="">Seleccionar</option>
              <option value="MEX">México</option>
              <option value="USA">Estados Unidos</option>
              <option value="CAN">Canadá</option>
              {/* Agrega más países según sea necesario */}
            </select>
            {errors.country && (
              <span className="text-sm text-red-500">
                {errors.country.message}
              </span>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 mt-6 justify-end col-span-1 md:col-span-2">
            <button
              type="button"
              onClick={toggleEditing}
              className={` ${
                isEditing
                  ? "text-blue-600 border-2 font-bold border-gray-400 rounded-md"
                  : "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
              } p-3 rounded-md text-lg flex items-center gap-2`}
            >
              {isEditing ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <EditIcon className="w-5 h-5" />
              )}
              {isEditing ? "Cancelar" : "Editar"}
            </button>
            {isEditing && (
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center p-3"
              >
                <SaveIcon className="w-5 h-5" />
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}