"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Loader2,
  Mail,
  Phone,
  Calendar,
  Users,
  Edit2,
  Save,
  User,
  Briefcase,
  MapPin,
  X,
  CheckCircle,
  ArrowLeft,
  Shield,
  ChevronRight,
  Clock,
  CalendarDays,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContextType";
import { updateProfileEmployee } from "@/api/users";
import "sweetalert2/dist/sweetalert2.min.css";
import { motion } from "framer-motion";
import { AlertHelper } from "@/utils/alert.util";

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
      reset();
    }
    setIsEditing((prev) => !prev);
  };

  // Function to handle form submission
  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      // Enviamos la fecha como string en formato ISO, no como objeto Date
      const formattedData = {
        ...data,
        // No convertimos a Date, dejamos el string como está
        birthdate: data.birthdate || undefined,
      };

      const res = await updateProfileEmployee(Number(user?.id), formattedData);
      if (res) {
        AlertHelper.success({
          title: "Perfil actualizado",
          message: "Su información personal ha sido actualizada correctamente.",
          timer: 3000,
          animation: "slideIn",
        });
        setIsEditing(false);
      }
      setIsSubmitting(false);
    } catch (error:any) {
      AlertHelper.error({
        title: "Error",
        message:
          error?.response?.data?.message ||
          "No se pudo actualizar la información. Inténtelo de nuevo más tarde.",
        isModal: true,
        animation: "bounce",
      });
      setIsSubmitting(false);
     
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "No especificado";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get gender display text
  const getGenderText = (gender: string) => {
    switch (gender) {
      case "MALE":
        return "Masculino";
      case "FEMALE":
        return "Femenino";
      case "UNISEX":
        return "Otro";
      default:
        return "No especificado";
    }
  };

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (isEditing) {
    return (
      <div className="px-6 space-y-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

            {/* Encabezado */}
            <div className="relative">
              <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <button
                      onClick={toggleEditing}
                      className="bg-white/20 p-2 rounded-full mr-4 hover:bg-white/30 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Editar Perfil
                      </h2>
                      <p className="mt-1 text-white/80 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5 inline" />
                        Actualiza tu información personal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
                    {getUserInitial()}
                  </div>
                  <span className="text-sm font-medium">
                    {user?.name} {user?.surname}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-10">
              <div className="space-y-8">
                {/* Personal information section */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 shadow-sm">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Datos Personales
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Nombre
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCircle className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="firstName"
                          placeholder="Tu nombre"
                          {...register("name", {
                            required: "El nombre es obligatorio",
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border pl-10 ${
                            errors.name
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.name && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Last name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Apellidos
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCircle className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="lastName"
                          placeholder="Tus apellidos"
                          {...register("surname", {
                            required: "Los apellidos son obligatorios",
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border pl-10 ${
                            errors.surname
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.surname && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.surname && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.surname.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Contact information section */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 shadow-sm">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Información de Contacto
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          {...register("email", {
                            required: "El correo es obligatorio",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Correo electrónico no válido",
                            },
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border pl-10 ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.email && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Teléfono
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="1234567890"
                          {...register("phone", {
                            required: "El teléfono es obligatorio",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message:
                                "El teléfono debe tener 10 dígitos numéricos",
                            },
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border pl-10 ${
                            errors.phone
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.phone && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Additional information section */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 shadow-sm">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Datos Adicionales
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Birthdate */}
                    <div className="space-y-2">
                      <label
                        htmlFor="birthday"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Fecha de Nacimiento
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarDays className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="birthday"
                          type="date"
                          {...register("birthdate", {
                            required: "La fecha de nacimiento es obligatoria",
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border pl-10 ${
                            errors.birthdate
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.birthdate && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.birthdate && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.birthdate.message}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label
                        htmlFor="gender"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        Género
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="gender"
                          {...register("gender", {
                            required: "El género es obligatorio",
                          })}
                          disabled={isSubmitting}
                          className={`block w-full rounded-lg border pl-10 ${
                            errors.gender
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none appearance-none`}
                        >
                          <option value="SELECT">Seleccionar</option>
                          <option value="MALE">Masculino</option>
                          <option value="FEMALE">Femenino</option>
                          <option value="UNISEX">Otro</option>
                        </select>
                        {errors.gender && (
                          <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  variants={itemVariants}
                  className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3"
                >
                  <button
                    type="button"
                    onClick={toggleEditing}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white focus:outline-none transition-colors shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        <span>Guardar cambios</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        {/* Header with background */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>

          {/* Encabezado */}
          <div className="relative">
            <div className="bg-blue-500 p-6 rounded-b-[2.5rem]">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Perfil</h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <UserCircle className="w-3.5 h-3.5 mr-1.5 inline" />
                      Información personal y de contacto
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleEditing}
                  className="bg-white/20 hover:bg-white/30 transition-colors text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </button>
              </div>
            </div>
            <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
              <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
                  {getUserInitial()}
                </div>
                <span className="text-sm font-medium">
                  {user?.name} {user?.surname}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sidebar with user info */}
              <div className="md:col-span-1">
                <div className="bg-blue-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Información Personal
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Email
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Teléfono
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user?.phone || "No disponible"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Fecha de nacimiento
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {user?.birthdate
                            ? formatDate(user.birthdate.toString())
                            : "No especificado"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Género
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {getGenderText(user?.gender || "")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account status */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                        Estado de la Cuenta
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Activo
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 shadow-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Cuenta verificada
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Último acceso: 10 de mayo de 2025
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="md:col-span-2 space-y-6">
                {/* Information cards */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                      Información Laboral
                    </h3>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 shadow-sm">
                            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Cargo
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user?.role === "ADMIN"
                                ? "Administrador"
                                : "Empleado"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3 shadow-sm">
                            <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Ubicación
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Oficina Central
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800/50">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 shadow-sm">
                            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Departamento
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              Administración
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      Dirección
                    </h3>
                    <a
                      href="/direccion"
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
                    >
                      Ver detalles
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
