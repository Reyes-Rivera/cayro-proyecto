"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "@/api/users";
import { useAuth } from "@/context/AuthContextType";
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
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface ProfileFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: string;
}

export default function UserProfile() {
  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const {
    user,
    verifyUser,
    signOut,
    setEmailToVerify,
    setIsVerificationPending,
  } = useAuth();

  // Simulate page loading
  useState(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  });

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
    <div className="min-h-screen bg-white relative">
      {/* Loading Screen */}
      {pageLoading && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          </div>
        </div>
      )}

      <div className="container mx-auto  relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Form Card with Enhanced Styling */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative ">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

              <div className="relative flex flex-col items-center text-center mb-2">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Información Personal
                </h2>
                <p className="text-blue-100 mt-2 max-w-lg">
                  Mantén actualizada tu información para una mejor experiencia y
                  gestión de tus pedidos
                </p>
                <div className="h-1 w-24 bg-white/30 mt-4 rounded-full"></div>
              </div>
            </div>

            {/* Form Section with Enhanced Styling */}
            <form onSubmit={handleSubmit(onSubmit)} className="relative">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2.5 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 ml-3">
                      Datos de Usuario
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={toggleEditable}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all ${
                      isEditable
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
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
                  </button>
                </div>

                <Alert className="mb-6 bg-blue-50 border border-blue-100 text-blue-800 py-3 rounded-xl">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-sm">
                    Si cambias tu correo electrónico, necesitarás verificarlo
                    nuevamente a través de un código que enviaremos a tu nueva
                    dirección.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="flex items-center text-gray-700 text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Nombre
                    </label>
                    <div className="relative group">
                      <input
                        id="name"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.name
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50/50"
                            : "group-hover:border-blue-400"
                        }`}
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
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Surname field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="surname"
                      className="flex items-center text-gray-700 text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Apellido
                    </label>
                    <div className="relative group">
                      <input
                        id="surname"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.surname
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50/50"
                            : "group-hover:border-blue-400"
                        }`}
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
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.surname.message}
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="flex items-center text-gray-700 text-sm font-medium"
                    >
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      Correo electrónico
                    </label>
                    <div className="relative group">
                      <input
                        id="email"
                        type="email"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50/50"
                            : "group-hover:border-blue-400"
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
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="flex items-center text-gray-700 text-sm font-medium"
                    >
                      <Phone className="w-4 h-4 mr-2 text-blue-600" />
                      Teléfono
                    </label>
                    <div className="relative group">
                      <input
                        id="phone"
                        type="tel"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.phone
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50/50"
                            : "group-hover:border-blue-400"
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
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      ) : (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Birthdate field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="birthdate"
                      className="flex items-center text-gray-700 text-sm font-medium"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Fecha de nacimiento
                    </label>
                    <div className="relative group">
                      <input
                        id="birthdate"
                        type="date"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.birthdate
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50/50"
                            : "group-hover:border-blue-400"
                        }`}
                        {...register("birthdate", {
                          required: "La fecha de nacimiento es obligatoria",
                        })}
                      />
                      {errors.birthdate && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.birthdate && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.birthdate.message}
                      </p>
                    )}
                  </div>

                  {/* Gender field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="gender"
                      className="flex items-center text-gray-700 text-sm font-medium"
                    >
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      Género
                    </label>
                    <div className="relative group">
                      <select
                        id="gender"
                        disabled={!isEditable}
                        className={`block w-full rounded-lg border ${
                          errors.gender
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white text-gray-900 p-3.5 shadow-sm transition-all focus:outline-none ${
                          !isEditable
                            ? "bg-gray-50/50"
                            : "group-hover:border-blue-400"
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
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.gender && (
                      <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isEditable && (
                <>
                  <Separator className="my-2" />
                  <div className="flex justify-end gap-3 p-6 bg-gray-50">
                    <button
                      type="button"
                      onClick={toggleEditable}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium flex items-center"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          <span>Guardar Cambios</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
