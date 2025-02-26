import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { SaveIcon, EditIcon, XIcon } from "lucide-react";
import pictureMen from "@/assets/rb_859.png";
import { useAuth } from "@/context/AuthContextType";
import { updateProfileEmployee } from "@/api/users";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
}

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  // Configurar react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      surname: user?.surname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      birthdate: user?.birthdate
        ? new Date(user.birthdate).toISOString().split("T")[0]
        : "",
      gender: user?.gender || "",
    },
  });

  const toggleEditing = () => {
    if (isEditing) {
      reset(); // Restablecer el formulario si se cancela la edición
    }
    setIsEditing((prev) => !prev);
  };

  // Función para manejar el envío del formulario
  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      const res = await updateProfileEmployee(Number(user?.id), data);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Perfil actualizado.",
          text: "Su información personal ha sido actualizada correctamente.",
          confirmButtonColor: "#2563EB",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
      setIsEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 dark:bg-gray-800 dark:text-gray-100">
      {/* Imagen de usuario */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full h-64 rounded-md overflow-hidden">
          <img
            src={pictureMen}
            alt="Imagen del usuario"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Información del usuario */}
      <div className="col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Perfil del Empleado</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6  p-6 rounded-lg"
        >
          {/* Nombre */}
          <div className="space-y-1 w-full">
            <Label htmlFor="firstName">Nombre</Label>
            <input
              id="firstName"
              {...register("name", {
                required: "El nombre es obligatorio",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Apellidos */}
          <div className="space-y-1 w-full">
            <Label htmlFor="lastName">Apellidos</Label>
            <input
              id="lastName"
              {...register("surname", {
                required: "Los apellidos son obligatorios",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.surname && (
              <span className="text-sm text-red-500">
                {errors.surname.message}
              </span>
            )}
          </div>

          {/* Correo */}
          <div className="space-y-1 w-full">
            <Label htmlFor="email">Correo</Label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico no válido",
                },
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-1 w-full">
            <Label htmlFor="phone">Teléfono</Label>
            <input
              id="phone"
              type="tel"
              {...register("phone", {
                required: "El teléfono es obligatorio",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "El teléfono debe tener 10 dígitos",
                },
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.phone && (
              <span className="text-sm text-red-500">
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="space-y-1 w-full">
            <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
            <input
              id="birthdate"
              type="date"
              {...register("birthdate", {
                required: "La fecha de nacimiento es obligatoria",
              })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            />
            {errors.birthdate && (
              <span className="text-sm text-red-500">
                {errors.birthdate.message}
              </span>
            )}
          </div>

          {/* Género */}
          <div className="space-y-1 w-full">
            <Label htmlFor="gender">Género</Label>
            <select
              id="gender"
              {...register("gender", { required: "El género es obligatorio" })}
              disabled={!isEditing}
              className={`block w-full rounded-md p-3 ${
                isEditing
                  ? "bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  : "bg-gray-100 dark:bg-gray-600 dark:text-white"
              }`}
            >
              <option value="">Seleccionar</option>
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Femenino</option>
              <option value="UNISEX">Otro</option>
            </select>
            {errors.gender && (
              <span className="text-sm text-red-500">
                {errors.gender.message}
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
