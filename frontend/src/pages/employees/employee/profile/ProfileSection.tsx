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
  Camera,
  CheckCircle,
  Shield,
} from "lucide-react";
import pictureMen from "@/assets/rb_859.png";
import { useAuth } from "@/context/AuthContextType";
import { updateProfileEmployee } from "@/api/users";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { motion } from "framer-motion";

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

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
        {/* Tarjeta de imagen de perfil */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-5 text-white">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1 sm:gap-2">
              <User2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Información de Usuario</span>
            </h2>
          </div>

          <div className="p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center space-y-3 sm:space-y-4 md:space-y-6 relative z-10">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 shadow-lg transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-700">
                <img
                  src={pictureMen || "/placeholder.svg"}
                  alt="Imagen del usuario"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-blue-600/80 text-white p-2 rounded-full">
                  <Camera className="w-6 h-6" />
                </div>
              </div>

              <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 shadow-md"></div>
            </div>

            <div className="text-center">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.name} {user?.surname}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {user?.email}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                  Empleado
                </span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1 rounded-full flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Cuenta verificada
                </span>
              </div>
            </div>

            <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {user?.phone || "No disponible"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Último acceso: Hoy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta de información personal */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-5 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1 sm:gap-2">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">Información Personal</span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={toggleEditing}
                disabled={isSubmitting}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-all ${
                  isEditing
                    ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    : "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancelar</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-3 sm:p-4 md:p-6 lg:p-8 relative z-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
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
                    } transition-all duration-200 shadow-sm`}
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
                  className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
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
                    } transition-all duration-200 shadow-sm`}
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
                  className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
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
                    } transition-all duration-200 shadow-sm`}
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
                  className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
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
                        message: "El teléfono debe tener 10 dígitos numéricos",
                      },
                    })}
                    disabled={!isEditing || isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } transition-all duration-200 shadow-sm`}
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
                  className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
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
                    } transition-all duration-200 shadow-sm`}
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
                  className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
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
                    } transition-all duration-200 shadow-sm`}
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-end mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span className="text-sm md:text-base">
                        Guardar Cambios
                      </span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
