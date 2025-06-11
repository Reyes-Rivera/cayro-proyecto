"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "@/api/users";
import { useAuth } from "@/context/AuthContextType";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  X,
  Loader2,
  AlertCircle,
  Shield,
  Edit3,
  Save,
  ChevronRight,
  AtSign,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
}

export default function ProfileView() {
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);

  const {
    user,
    verifyUser,
    signOut,
    setEmailToVerify,
    setIsVerificationPending,
  } = useAuth();

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Activate animations after loading screen disappears
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    clearErrors,
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

  const toggleEditable = () => {
    if (isEditable) {
      // If we're turning off editing, reset the form
      reset();
    }
    setIsEditable(!isEditable);
  };
  const onSubmit = async (data: ProfileFormData) => {
    if (!isEditable) return;

    try {
      setIsSubmitting(true);
      const res = await updateUser(Number(user?.id), data);

      if (
        res.data.message ===
        "Correo actualizado. Se ha enviado un código de verificación."
      ) {
        localStorage.setItem("emailToVerify", data.email);
        setEmailToVerify(data.email);
        setIsVerificationPending(true);

        alert(
          "Perfil actualizado. Confirma que eres tú. Revisa tu correo electrónico."
        );
        await signOut();
        window.scrollTo(0, 0);
        return;
      }

      if (res) {
        alert("Su información personal ha sido actualizada correctamente.");
        await verifyUser();
        setIsEditable(false);
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-blue-600 dark:text-blue-400 mt-4 font-medium">
            Cargando perfil...
          </p>
        </div>
      )}

      {!pageLoading && (
        <div className="p-6 md:p-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5">
                <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  DATOS PERSONALES
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Información{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-400">
                    Personal
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Gestiona tus datos personales y preferencias
              </p>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Datos Personales
                </h2>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={toggleEditable}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${
                    isEditable
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : "bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white"
                  }`}
                >
                  {isEditable ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </>
                  )}
                </motion.button>
              </div>

              {isEditable && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="mb-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-gray-700 dark:text-blue-100 py-3 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-sm">
                      Si cambias tu correo electrónico, necesitarás verificarlo
                      nuevamente a través de un código que enviaremos a tu nueva
                      dirección.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Nombre
                    </label>
                    <div className="relative group">
                      <input
                        id="name"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.name
                            ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                            : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50 dark:bg-gray-700"
                            : "group-hover:border-blue-300"
                        }`}
                        {...register("name", {
                          required: "El nombre es obligatorio",
                        })}
                      />
                      {errors.name && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Surname field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="surname"
                      className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Apellido
                    </label>
                    <div className="relative group">
                      <input
                        id="surname"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.surname
                            ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                            : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50 dark:bg-gray-700"
                            : "group-hover:border-blue-300"
                        }`}
                        {...register("surname", {
                          required: "Los apellidos son obligatorios",
                        })}
                      />
                      {errors.surname && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                    </div>
                    {errors.surname && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.surname.message}
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Correo electrónico
                    </label>
                    <div className="relative group">
                      <input
                        id="email"
                        type="email"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.email
                            ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                            : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50 dark:bg-gray-700"
                            : "group-hover:border-blue-300"
                        }`}
                        {...register("email", {
                          required: "El correo es obligatorio",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Correo electrónico no válido",
                          },
                          onChange: (e) => {
                            let value = e.target.value;
                            value = value.replace(/[<>='"]/g, "");
                            e.target.value = value;

                            const emailRegex =
                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                            if (emailRegex.test(value)) {
                              clearErrors("email");
                            }
                          },
                        })}
                      />
                      {errors.email ? (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                      ) : (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AtSign className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                    >
                      <Phone className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Teléfono
                    </label>
                    <div className="relative group">
                      <input
                        id="phone"
                        type="tel"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.phone
                            ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                            : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50 dark:bg-gray-700"
                            : "group-hover:border-blue-300"
                        }`}
                        {...register("phone", {
                          required: "El teléfono es obligatorio",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "El teléfono debe tener 10 dígitos numéricos",
                          },
                          onChange: (e) => {
                            let value = e.target.value;
                            value = value.replace(/[^0-9]/g, "");
                            e.target.value = value;

                            if (/^[0-9]{10}$/.test(value)) {
                              clearErrors("phone");
                            }
                          },
                        })}
                      />
                      {errors.phone ? (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                      ) : (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Birthdate field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="birthdate"
                      className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Fecha de nacimiento
                    </label>
                    <div className="relative group">
                      <input
                        id="birthdate"
                        type="date"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.birthdate
                            ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                            : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50 dark:bg-gray-700"
                            : "group-hover:border-blue-300"
                        }`}
                        {...register("birthdate", {
                          required: "La fecha de nacimiento es obligatoria",
                        })}
                      />
                      {errors.birthdate && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                    </div>
                    {errors.birthdate && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.birthdate.message}
                      </p>
                    )}
                  </div>

                  {/* Gender field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      Género
                    </label>
                    <div className="relative group">
                      <select
                        id="gender"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border appearance-none ${
                          errors.gender
                            ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                            : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50 dark:bg-gray-700"
                            : "group-hover:border-blue-300"
                        }`}
                        {...register("gender", {
                          required: "El género es obligatorio",
                        })}
                      >
                        <option value="" disabled>
                          Seleccionar
                        </option>
                        <option value="MALE">Masculino</option>
                        <option value="FEMALE">Femenino</option>
                        <option value="UNISEX">Otro</option>
                      </select>
                      {errors.gender && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 rotate-90" />
                      </div>
                    </div>
                    {errors.gender && (
                      <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {isEditable && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Separator className="my-6 dark:bg-gray-700" />
                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          onClick={toggleEditable}
                          variant="outline"
                          className="gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Guardando...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Guardar Cambios</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
