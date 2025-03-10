"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Save,
  Edit,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  AlertCircle,
  Loader2,
  User2,
} from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsSubmitting(true);
      const res = await updateProfileEmployee(Number(user?.id), data);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Perfil actualizado",
          text: "Su información personal ha sido actualizada correctamente.",
          confirmButtonColor: "#3B82F6",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        setIsEditing(false);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la información. Inténtelo de nuevo más tarde.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Encabezado */}
    

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tarjeta de imagen de perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className=" bg-blue-600 p-4 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User2 className="w-5 h-5" />
              Usuario
            </h2>
          </div>

          <div className="p-6 flex flex-col items-center space-y-6">
            <div
              className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-900 shadow-lg"
              
            >
              <img
                src={pictureMen || "/placeholder.svg"}
                alt="Imagen del usuario"
                className="w-full h-full object-cover"
              />
             
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {user?.name} {user?.surname}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              <div className="mt-3">
                <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  Empleado
                </span>
              </div>
            </div>

           
          </div>
        </div>

        {/* Tarjeta de información personal */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </h2>
              <button
                type="button"
                onClick={toggleEditing}
                disabled={isSubmitting}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  isEditing
                    ? "bg-white/20 hover:bg-white/30"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  Nombre
                </Label>
                <div className="relative">
                  <input
                    id="firstName"
                    {...register("name", {
                      required: "El nombre es obligatorio",
                    })}
                    disabled={!isEditing || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } transition-colors`}
                  />
                  {errors.name && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Apellidos */}
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  Apellidos
                </Label>
                <div className="relative">
                  <input
                    id="lastName"
                    {...register("surname", {
                      required: "Los apellidos son obligatorios",
                    })}
                    disabled={!isEditing || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } transition-colors`}
                  />
                  {errors.surname && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.surname && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.surname.message}
                  </p>
                )}
              </div>

              {/* Correo */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-blue-500" />
                  Correo Electrónico
                </Label>
                <div className="relative">
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
                    disabled={!isEditing || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } transition-colors`}
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-blue-500" />
                  Teléfono
                </Label>
                <div className="relative">
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
                    disabled={!isEditing || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } transition-colors`}
                  />
                  {errors.phone && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <Label
                  htmlFor="birthday"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Fecha de Nacimiento
                </Label>
                <div className="relative">
                  <input
                    id="birthday"
                    type="date"
                    {...register("birthdate", {
                      required: "La fecha de nacimiento es obligatoria",
                    })}
                    disabled={!isEditing || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } transition-colors`}
                  />
                  {errors.birthdate && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.birthdate && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.birthdate.message}
                  </p>
                )}
              </div>

              {/* Género */}
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-blue-500" />
                  Género
                </Label>
                <div className="relative">
                  <select
                    id="gender"
                    {...register("gender", {
                      required: "El género es obligatorio",
                    })}
                    disabled={!isEditing || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } transition-colors`}
                  >
                    <option value="">Seleccionar</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                    <option value="UNISEX">Otro</option>
                  </select>
                  {errors.gender && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.gender && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            {isEditing && (
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
