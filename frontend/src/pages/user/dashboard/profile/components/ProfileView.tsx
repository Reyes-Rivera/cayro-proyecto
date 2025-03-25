"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { updateUser } from "@/api/users";
import { useAuth } from "@/context/AuthContextType";

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
  const {
    user,
    verifyUser,
    signOut,
    setEmailToVerify,
    setIsVerificationPending,
  } = useAuth();

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
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative bg-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-900/40 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative">
          <div className="flex items-center justify-between p-6 border-b border-blue-100 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Información Personal
              </h2>
            </div>
            <button
              onClick={toggleEditable}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                isEditable
                  ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {isEditable ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancelar
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Editar Perfil
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar section */}
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                    <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-5xl">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={!isEditable}
                      className={`absolute bottom-0 right-0 p-3 rounded-full shadow-lg ${
                        isEditable
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer hover:scale-110 transition-transform"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {user?.name} {user?.surname}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-md">
                        Premium
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-amber-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      {user?.email}
                    </p>
                  </div>

                  <div className="mt-6 w-full bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                        />
                      </svg>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Información importante
                      </p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Si cambias tu correo electrónico, necesitarás verificarlo
                      nuevamente a través de un código que enviaremos a tu nueva
                      dirección.
                    </p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Campo: Nombre */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Nombre
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="name"
                          disabled={!isEditable}
                          className={`w-full rounded-xl border ${
                            errors.name
                              ? "border-red-500 focus:ring-red-200"
                              : "border-blue-100 dark:border-gray-700 focus:border-blue-500"
                          } ${
                            !isEditable
                              ? "bg-gray-50 text-gray-700"
                              : "bg-white/80 dark:bg-gray-800/50"
                          } backdrop-blur-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white shadow-sm`}
                          {...register("name", {
                            required: "El nombre es obligatorio",
                          })}
                        />
                        {errors.name && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Campo: Apellido */}
                    <div className="space-y-2">
                      <label
                        htmlFor="surname"
                        className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Apellido
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="surname"
                          disabled={!isEditable}
                          className={`w-full rounded-xl border ${
                            errors.surname
                              ? "border-red-500 focus:ring-red-200"
                              : "border-blue-100 dark:border-gray-700 focus:border-blue-500"
                          } ${
                            !isEditable
                              ? "bg-gray-50 text-gray-700"
                              : "bg-white/80 dark:bg-gray-800/50"
                          } backdrop-blur-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white shadow-sm`}
                          {...register("surname", {
                            required: "Los apellidos son obligatorios",
                          })}
                        />
                        {errors.surname && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.surname && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.surname.message}
                        </p>
                      )}
                    </div>

                    {/* Campo: Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          disabled={!isEditable}
                          className={`w-full rounded-xl border ${
                            errors.email
                              ? "border-red-500 focus:ring-red-200"
                              : "border-blue-100 dark:border-gray-700 focus:border-blue-500"
                          } ${
                            !isEditable
                              ? "bg-gray-50 text-gray-700"
                              : "bg-white/80 dark:bg-gray-800/50"
                          } backdrop-blur-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white shadow-sm`}
                          required
                          {...register("email", {
                            required: "El correo es obligatorio",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Correo electrónico no válido",
                            },
                          })}
                        />
                        {errors.email && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Campo: Teléfono */}
                    <div className="space-y-2">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Teléfono
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          disabled={!isEditable}
                          className={`w-full rounded-xl border ${
                            errors.phone
                              ? "border-red-500 focus:ring-red-200"
                              : "border-blue-100 dark:border-gray-700 focus:border-blue-500"
                          } ${
                            !isEditable
                              ? "bg-gray-50 text-gray-700"
                              : "bg-white/80 dark:bg-gray-800/50"
                          } backdrop-blur-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white shadow-sm`}
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Campo: Fecha de nacimiento */}
                    <div className="space-y-2">
                      <label
                        htmlFor="birthdate"
                        className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Fecha de nacimiento
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          id="birthdate"
                          disabled={!isEditable}
                          {...register("birthdate", {
                            required: "La fecha de nacimiento es obligatoria",
                          })}
                          className={`w-full rounded-xl border ${
                            errors.birthdate
                              ? "border-red-500 focus:ring-red-200"
                              : "border-blue-100 dark:border-gray-700 focus:border-blue-500"
                          } ${
                            !isEditable
                              ? "bg-gray-50 text-gray-700"
                              : "bg-white/80 dark:bg-gray-800/50"
                          } backdrop-blur-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white shadow-sm`}
                        />
                        {errors.birthdate && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.birthdate && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.birthdate.message}
                        </p>
                      )}
                    </div>

                    {/* Campo: Género */}
                    <div className="space-y-2">
                      <label
                        htmlFor="gender"
                        className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Género
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          disabled={!isEditable}
                          className={`w-full rounded-xl border ${
                            errors.gender
                              ? "border-red-500 focus:ring-red-200"
                              : "border-blue-100 dark:border-gray-700 focus:border-blue-500"
                          } ${
                            !isEditable
                              ? "bg-gray-50 text-gray-700"
                              : "bg-white/80 dark:bg-gray-800/50"
                          } backdrop-blur-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 text-gray-900 dark:text-white shadow-sm`}
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isEditable && (
              <div className="flex justify-end gap-3 p-6 border-t border-blue-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={toggleEditable}
                  className="px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 mr-2 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
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
