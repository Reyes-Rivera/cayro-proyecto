"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  X,
  UserCircle,
  AlertCircle,
  Award,
  Zap,
  Loader2,
  Shield,
  ArrowRight,
} from "lucide-react";
import img from "../assets/rb_859.png";
import { useAuth } from "@/context/AuthContextType";
import { type SubmitHandler, useForm } from "react-hook-form";
import { updateUser } from "@/api/users";
import { useNavigate } from "react-router-dom";

interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
}

const ProfileView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    user,
    verifyUser,
    signOut,
    setEmailToVerify,
    setIsVerificationPending,
  } = useAuth();
  const navigate = useNavigate();
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

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await updateUser(Number(user?.id), data);
      localStorage.setItem("emailToVerify", data.email);
      setEmailToVerify(data.email);
      setIsVerificationPending(true);
      if (
        res.data.message ===
        "Correo actualizado. Se ha enviado un código de verificación."
      ) {
        navigate("/codigo-verificacion");
        Swal.fire({
          icon: "success",
          title: "Perfil actualizado",
          text: "Confirma que eres tú. Revisa tu correo electrónico.",
          confirmButtonColor: "#3B82F6",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        await signOut();
        return;
      }
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
        await verifyUser();
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
      {/* Profile header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-md">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Información Personal
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Administra tu información personal y mantén tus datos
                actualizados
              </p>
            </div>
          </div>

          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
            >
              <Edit className="w-4 h-4" />
              <span>Editar perfil</span>
            </motion.button>
          ) : (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Profile content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Avatar section */}
                  <div className="flex flex-col items-center gap-5 md:w-1/3">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                        <img
                          src={img || "/placeholder.svg?height=160&width=160"}
                          alt="Avatar del usuario"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {user?.name} {user?.surname}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {user?.email}
                      </p>
                    </div>

                    {/* Activity info */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl w-full text-center border border-blue-100 dark:border-blue-800/30 shadow-sm">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          Miembro desde 2023
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        <p className="text-gray-700 dark:text-gray-300">
                          Última actividad: Hoy
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Nombre
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            className={`block w-full rounded-xl border ${
                              errors.name
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                            {...register("name", {
                              required: "El nombre es obligatorio",
                            })}
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

                      <div className="space-y-2">
                        <label
                          htmlFor="surname"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Apellido
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="surname"
                            className={`block w-full rounded-xl border ${
                              errors.surname
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                            {...register("surname", {
                              required: "Los apellidos son obligatorios",
                            })}
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

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Mail className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            className={`block w-full rounded-xl border ${
                              errors.email
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                            required
                            {...register("email", {
                              required: "El correo es obligatorio",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Correo electrónico no válido",
                              },
                            })}
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

                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Phone className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          Teléfono
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="phone"
                            className={`block w-full rounded-xl border ${
                              errors.phone
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                            {...register("phone", {
                              required: "El teléfono es obligatorio",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message:
                                  "El teléfono debe tener 10 dígitos numéricos",
                              },
                            })}
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

                      <div className="space-y-2">
                        <label
                          htmlFor="birthdate"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          Fecha de nacimiento
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            id="birthdate"
                            {...register("birthdate", {
                              required: "La fecha de nacimiento es obligatoria",
                            })}
                            className={`block w-full rounded-xl border ${
                              errors.birthdate
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
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

                      <div className="space-y-2">
                        <label
                          htmlFor="gender"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <UserCircle className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          Género
                        </label>
                        <div className="relative">
                          <select
                            id="gender"
                            className={`block w-full rounded-xl border ${
                              errors.gender
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                            {...register("gender", {
                              required: "El género es obligatorio",
                            })}
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

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start mt-6">
                      <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium mb-1">
                          Información importante
                        </p>
                        <p>
                          Si cambias tu correo electrónico, necesitarás
                          verificarlo nuevamente a través de un código que
                          enviaremos a tu nueva dirección.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
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
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row gap-10">
                {/* Avatar section */}
                <div className="flex flex-col items-center gap-5 md:w-1/3">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                      <img
                        src={img || "/placeholder.svg?height=160&width=160"}
                        alt="Avatar del usuario"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user?.name} {user?.surname}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {user?.email}
                    </p>
                  </div>

                  {/* Activity info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl w-full text-center border border-blue-100 dark:border-blue-800/30 shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Miembro desde 2023
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      <p className="text-gray-700 dark:text-gray-300">
                        Última actividad: Hoy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile info */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos de información personal */}
                    {[
                      {
                        icon: <User className="w-5 h-5" />,
                        label: "Nombre",
                        value: user?.name,
                        color: "text-blue-600 dark:text-blue-400",
                      },
                      {
                        icon: <User className="w-5 h-5" />,
                        label: "Apellido",
                        value: user?.surname,
                        color: "text-blue-600 dark:text-blue-400",
                      },
                      {
                        icon: <Mail className="w-5 h-5" />,
                        label: "Correo electrónico",
                        value: user?.email,
                        color: "text-blue-500 dark:text-blue-400",
                      },
                      {
                        icon: <Phone className="w-5 h-5" />,
                        label: "Teléfono",
                        value: user?.phone,
                        color: "text-blue-500 dark:text-blue-400",
                      },
                      {
                        icon: <Calendar className="w-5 h-5" />,
                        label: "Fecha de nacimiento",
                        value: user?.birthdate
                          ? new Date(user.birthdate).toISOString().split("T")[0]
                          : "",
                        color: "text-blue-500 dark:text-blue-400",
                      },
                      {
                        icon: <UserCircle className="w-5 h-5" />,
                        label: "Género",
                        value:
                          user?.gender === "MALE"
                            ? "Masculino"
                            : user?.gender === "FEMALE"
                            ? "Femenino"
                            : user?.gender === "UNISEX"
                            ? "Otro"
                            : "Prefiero no decir",
                        color: "text-blue-500 dark:text-blue-400",
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-md group"
                        whileHover={{
                          y: -3,
                          boxShadow:
                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 + index * 0.05,
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`${field.color}`}>{field.icon}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {field.label}
                            </p>
                            <p className="text-gray-900 dark:text-white font-semibold mt-1 text-lg">
                              {field.value || "No especificado"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          Mantén tu información actualizada
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Asegúrate de que tu información de contacto esté
                          siempre actualizada para recibir notificaciones
                          importantes sobre tus pedidos y cuenta.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setIsEditing(true)}
                          className="mt-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Actualizar información</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileView;
