"use client";

import { useState, useEffect } from "react";
import {
  Key,
  Eye,
  EyeOff,
  Check,
  Shield,
  Lock,
  Save,
  Loader2,
  ShieldCheck,
  AlertCircle,
  X,
  Info,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { updatePasswordEmployee } from "@/api/users";
import { useAuth } from "@/context/AuthContextType";
import { logOutApi } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { AlertHelper } from "@/utils/alert.util";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordSection() {
  const { user } = useAuth();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
    noInvalidChars: false,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>();

  const newPassword = watch("newPassword", "");

  // Validar la contraseña cuando cambia
  useEffect(() => {
    if (!newPassword) {
      setPasswordChecks({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        noSequential: false,
        noInvalidChars: false,
      });
      setPasswordStrength(0);
      return;
    }

    const invalidCharsRegex = /[<>'"`]/;

    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?:{}|[\]\\]/.test(newPassword),
      noSequential: !containsSequentialPatterns(newPassword),
      noInvalidChars: !invalidCharsRegex.test(newPassword),
    };

    setPasswordChecks(checks);

    // Calcular la fortaleza (ahora con 7 verificaciones)
    const passedChecks = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(Math.floor((passedChecks / 7) * 100));
  }, [newPassword]);

  const containsSequentialPatterns = (password: string): boolean => {
    const commonPatterns = [
      "1234",
      "abcd",
      "qwerty",
      "password",
      "1111",
      "aaaa",
    ];
    const sequentialPatternRegex =
      /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef)/i;
    return (
      commonPatterns.some((pattern) =>
        password.toLowerCase().includes(pattern.toLowerCase())
      ) || sequentialPatternRegex.test(password)
    );
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-lime-500";
    return "bg-green-500";
  };

  const getStrengthName = (strength: number) => {
    if (strength <= 20) return "Muy débil";
    if (strength <= 40) return "Débil";
    if (strength <= 60) return "Moderada";
    if (strength <= 80) return "Fuerte";
    return "Muy fuerte";
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true);

      // Validar que la nueva contraseña no tenga caracteres inválidos
      const invalidCharsRegex = /[<>'"`]/;
      if (invalidCharsRegex.test(data.newPassword)) {
        AlertHelper.error({
          title: "Error",
          message:
            "La contraseña no puede contener caracteres especiales como < > ' \" `",
          isModal: true,
          animation: "bounce",
        });
        setIsSubmitting(false);
        return;
      }

      // Validar que las contraseñas coincidan
      if (data.newPassword !== data.confirmPassword) {
        AlertHelper.error({
          title: "Error",
          message: "Las contraseñas no coinciden.",
          isModal: true,
          animation: "bounce",
        });
        setIsSubmitting(false);
        return;
      }

      // Validar que cumpla con todos los requisitos de seguridad
      if (!Object.values(passwordChecks).every(Boolean)) {
        AlertHelper.error({
          title: "Error",
          message:
            "La nueva contraseña no cumple con todos los requisitos de seguridad.",
          isModal: true,
          animation: "bounce",
        });
        setIsSubmitting(false);
        return;
      }
      if (!user?.id) {
        throw new Error("User ID is undefined");
      }
      await updatePasswordEmployee(+user.id, {
        currentPassword: data.currentPassword,
        password: data.newPassword,
      });
      await logOutApi();
      navigate("/login");
      AlertHelper.success({
        title: "Contraseña actualizada",
        message: "Tu contraseña se ha actualizado correctamente.",
        timer: 3000,
        animation: "slideIn",
      });
      reset();
    } catch (error: any) {
      AlertHelper.error({
        title: "Error al actualizar la contraseña",
        message:
          error?.response?.data?.message ||
          "Hubo un error al actualizar la contraseña.",
        timer: 3000,
        animation: "slideIn",
      });
    } finally {
      setIsSubmitting(false);
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
                  <div className="bg-white/20 p-3 rounded-full mr-4">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Contraseña
                    </h2>
                    <p className="mt-1 text-white/80 flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-1.5 inline" />
                      Gestiona tu seguridad
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
              <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-full shadow-md border border-gray-100 dark:border-gray-600 flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500 mr-2" />
                <span className="text-sm font-medium">Protege tu cuenta</span>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 pt-10">
            <motion.div variants={containerVariants}>
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg mb-6 flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Para mayor seguridad, tu contraseña debe tener al menos 8
                  caracteres, incluir mayúsculas, minúsculas, números y
                  caracteres especiales.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Columna izquierda - Indicador de fortaleza (solo visible en pantallas md y superiores) */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-5 border border-blue-100 shadow-sm sticky top-4 overflow-hidden ">
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                          <Shield className="w-5 h-5 text-blue-500 mr-2" />
                          Nivel de Seguridad
                        </h3>
                        <span
                          className={`text-sm text-center font-medium px-2.5 py-1 rounded-full ${
                            passwordStrength <= 20
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : passwordStrength <= 40
                              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                              : passwordStrength <= 60
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : passwordStrength <= 80
                              ? "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {getStrengthName(passwordStrength)}
                        </span>
                      </div>

                      {/* Medidor de fortaleza */}
                      <div className="mb-6">
                        <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full rounded-full ${getStrengthColor(
                              passwordStrength
                            )}`}
                          ></motion.div>
                        </div>
                      </div>

                      {/* Iconos de nivel de fortaleza - MODIFICADO para mostrar solo el nivel actual */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                        <div className="flex justify-center items-center">
                          {(() => {
                            // Determinar el nivel actual basado en la fortaleza
                            const strengthLevel =
                              passwordStrength <= 20
                                ? {
                                    strength: 20,
                                    icon: <AlertCircle className="w-6 h-6" />,
                                    label: "Muy débil",
                                    color: "text-red-500",
                                    bgColor: "bg-red-100 dark:bg-red-900/30",
                                    borderColor:
                                      "border-red-200 dark:border-red-800/30",
                                  }
                                : passwordStrength <= 40
                                ? {
                                    strength: 40,
                                    icon: <AlertCircle className="w-6 h-6" />,
                                    label: "Débil",
                                    color: "text-orange-500",
                                    bgColor:
                                      "bg-orange-100 dark:bg-orange-900/30",
                                    borderColor:
                                      "border-orange-200 dark:border-orange-800/30",
                                  }
                                : passwordStrength <= 60
                                ? {
                                    strength: 60,
                                    icon: <Info className="w-6 h-6" />,
                                    label: "Moderada",
                                    color: "text-yellow-500",
                                    bgColor:
                                      "bg-yellow-100 dark:bg-yellow-900/30",
                                    borderColor:
                                      "border-yellow-200 dark:border-yellow-800/30",
                                  }
                                : passwordStrength <= 80
                                ? {
                                    strength: 80,
                                    icon: <Shield className="w-6 h-6" />,
                                    label: "Fuerte",
                                    color: "text-lime-500",
                                    bgColor: "bg-lime-100 dark:bg-lime-900/30",
                                    borderColor:
                                      "border-lime-200 dark:border-lime-800/30",
                                  }
                                : {
                                    strength: 100,
                                    icon: <ShieldCheck className="w-6 h-6" />,
                                    label: "Muy fuerte",
                                    color: "text-green-500",
                                    bgColor:
                                      "bg-green-100 dark:bg-green-900/30",
                                    borderColor:
                                      "border-green-200 dark:border-green-800/30",
                                  };

                            return (
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${strengthLevel.bgColor} ${strengthLevel.color} border ${strengthLevel.borderColor}`}
                                >
                                  {strengthLevel.icon}
                                </div>
                                <span
                                  className={`text-base font-medium text-center ${strengthLevel.color}`}
                                >
                                  {strengthLevel.label}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {passwordStrength}% de seguridad
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Requisitos de contraseña */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <Key className="w-4 h-4 text-blue-500 mr-2" />
                          Requisitos de seguridad
                        </h4>
                        <div className="space-y-2.5">
                          {[
                            {
                              key: "length",
                              label: "Mínimo 8 caracteres",
                              icon: <Check className="w-4 h-4" />,
                            },
                            {
                              key: "uppercase",
                              label: "Al menos una mayúscula",
                              icon: <Check className="w-4 h-4" />,
                            },
                            {
                              key: "lowercase",
                              label: "Al menos una minúscula",
                              icon: <Check className="w-4 h-4" />,
                            },
                            {
                              key: "number",
                              label: "Al menos un número",
                              icon: <Check className="w-4 h-4" />,
                            },
                            {
                              key: "special",
                              label: "Al menos un carácter especial",
                              icon: <Check className="w-4 h-4" />,
                            },
                            {
                              key: "noSequential",
                              label: "Sin secuencias obvias",
                              icon: <Check className="w-4 h-4" />,
                            },
                            {
                              key: "noInvalidChars",
                              label: "Sin caracteres < > ' \" `",
                              icon: <Check className="w-4 h-4" />,
                            },
                          ].map((item) => {
                            const isChecked =
                              passwordChecks[
                                item.key as keyof typeof passwordChecks
                              ];
                            return (
                              <div
                                key={item.key}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                    isChecked
                                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                      : "bg-gray-200 dark:bg-gray-700"
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3" />}
                                </div>
                                <span
                                  className={
                                    isChecked
                                      ? "text-sm text-gray-900 dark:text-gray-100"
                                      : "text-sm text-gray-500 dark:text-gray-400"
                                  }
                                >
                                  {item.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna derecha - Formulario */}
                <div className="lg:col-span-2 space-y-5">
                  {/* Contraseña actual */}
                  <div className="space-y-2">
                    <label
                      htmlFor="currentPassword"
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium"
                    >
                      <Key className="w-4 h-4 text-blue-500" />
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        {...register("currentPassword", {
                          required: "La contraseña actual es obligatoria",
                        })}
                        className={`block w-full rounded-lg border ${
                          errors.currentPassword
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 pl-10 pr-10 shadow-sm transition-colors focus:outline-none`}
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      {errors.currentPassword && (
                        <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Nueva contraseña */}
                  <div className="space-y-2">
                    <label
                      htmlFor="newPassword"
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium"
                    >
                      <Lock className="w-4 h-4 text-blue-500" />
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...register("newPassword", {
                          required: "La nueva contraseña es obligatoria",
                          minLength: {
                            value: 8,
                            message:
                              "La contraseña debe tener al menos 8 caracteres",
                          },
                          validate: {
                            hasUppercase: (value) =>
                              /[A-Z]/.test(value) ||
                              "Debe contener al menos una letra mayúscula",
                            hasLowercase: (value) =>
                              /[a-z]/.test(value) ||
                              "Debe contener al menos una letra minúscula",
                            hasNumber: (value) =>
                              /[0-9]/.test(value) ||
                              "Debe contener al menos un número",
                            hasSpecial: (value) =>
                              /[!@#$%^&*(),.?:{}|[\]\\]/.test(value) ||
                              "Debe contener al menos un carácter especial",
                            noSequential: (value) =>
                              !containsSequentialPatterns(value) ||
                              "No debe contener secuencias obvias",
                            noInvalidChars: (value) =>
                              !/[<>'"`]/.test(value) ||
                              "No debe contener caracteres como < > ' \" `",
                          },
                        })}
                        className={`block w-full rounded-lg border ${
                          errors.newPassword
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 pl-10 pr-10 shadow-sm transition-colors focus:outline-none`}
                        placeholder="Ingresa tu nueva contraseña"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      {errors.newPassword && (
                        <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.newPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Indicador de fortaleza - Visible en móvil debajo del campo de nueva contraseña */}
                  <div className="lg:hidden">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30 shadow-sm overflow-hidden relative w-full">
                      {/* Elementos decorativos */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full -mr-12 -mt-12 dark:from-blue-400/20 dark:to-indigo-500/20"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-300/10 to-indigo-400/10 rounded-full -ml-8 -mb-8 dark:from-blue-300/20 dark:to-indigo-400/20"></div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                            <Shield className="w-5 h-5 text-blue-500 mr-2" />
                            Nivel de Seguridad
                          </h3>
                          <span
                            className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                              passwordStrength <= 20
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : passwordStrength <= 40
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                : passwordStrength <= 60
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : passwordStrength <= 80
                                ? "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {getStrengthName(passwordStrength)}
                          </span>
                        </div>

                        {/* Medidor de fortaleza */}
                        <div className="mb-6">
                          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden p-0.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              transition={{ duration: 0.5 }}
                              className={`h-full rounded-full ${getStrengthColor(
                                passwordStrength
                              )}`}
                            ></motion.div>
                          </div>
                        </div>

                        {/* Iconos de nivel de fortaleza - MODIFICADO para mostrar solo el nivel actual */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                          <div className="flex justify-center items-center">
                            {(() => {
                              // Determinar el nivel actual basado en la fortaleza
                              const strengthLevel =
                                passwordStrength <= 20
                                  ? {
                                      strength: 20,
                                      icon: <AlertCircle className="w-6 h-6" />,
                                      label: "Muy débil",
                                      color: "text-red-500",
                                      bgColor: "bg-red-100 dark:bg-red-900/30",
                                      borderColor:
                                        "border-red-200 dark:border-red-800/30",
                                    }
                                  : passwordStrength <= 40
                                  ? {
                                      strength: 40,
                                      icon: <AlertCircle className="w-6 h-6" />,
                                      label: "Débil",
                                      color: "text-orange-500",
                                      bgColor:
                                        "bg-orange-100 dark:bg-orange-900/30",
                                      borderColor:
                                        "border-orange-200 dark:border-orange-800/30",
                                    }
                                  : passwordStrength <= 60
                                  ? {
                                      strength: 60,
                                      icon: <Info className="w-6 h-6" />,
                                      label: "Moderada",
                                      color: "text-yellow-500",
                                      bgColor:
                                        "bg-yellow-100 dark:bg-yellow-900/30",
                                      borderColor:
                                        "border-yellow-200 dark:border-yellow-800/30",
                                    }
                                  : passwordStrength <= 80
                                  ? {
                                      strength: 80,
                                      icon: <Shield className="w-6 h-6" />,
                                      label: "Fuerte",
                                      color: "text-lime-500",
                                      bgColor:
                                        "bg-lime-100 dark:bg-lime-900/30",
                                      borderColor:
                                        "border-lime-200 dark:border-lime-800/30",
                                    }
                                  : {
                                      strength: 100,
                                      icon: <ShieldCheck className="w-6 h-6" />,
                                      label: "Muy fuerte",
                                      color: "text-green-500",
                                      bgColor:
                                        "bg-green-100 dark:bg-green-900/30",
                                      borderColor:
                                        "border-green-200 dark:border-green-800/30",
                                    };

                              return (
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${strengthLevel.bgColor} ${strengthLevel.color} border ${strengthLevel.borderColor}`}
                                  >
                                    {strengthLevel.icon}
                                  </div>
                                  <span
                                    className={`text-base font-medium text-center ${strengthLevel.color}`}
                                  >
                                    {strengthLevel.label}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {passwordStrength}% de seguridad
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Requisitos de contraseña */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                            <Key className="w-4 h-4 text-blue-500 mr-2" />
                            Requisitos de seguridad
                          </h4>
                          <div className="space-y-2.5">
                            {[
                              {
                                key: "length",
                                label: "Mínimo 8 caracteres",
                                icon: <Check className="w-4 h-4" />,
                              },
                              {
                                key: "uppercase",
                                label: "Al menos una mayúscula",
                                icon: <Check className="w-4 h-4" />,
                              },
                              {
                                key: "lowercase",
                                label: "Al menos una minúscula",
                                icon: <Check className="w-4 h-4" />,
                              },
                              {
                                key: "number",
                                label: "Al menos un número",
                                icon: <Check className="w-4 h-4" />,
                              },
                              {
                                key: "special",
                                label: "Al menos un carácter especial",
                                icon: <Check className="w-4 h-4" />,
                              },
                              {
                                key: "noSequential",
                                label: "Sin secuencias obvias",
                                icon: <Check className="w-4 h-4" />,
                              },
                              {
                                key: "noInvalidChars",
                                label: "Sin caracteres < > ' \" `",
                                icon: <Check className="w-4 h-4" />,
                              },
                            ].map((item) => {
                              const isChecked =
                                passwordChecks[
                                  item.key as keyof typeof passwordChecks
                                ];
                              return (
                                <div
                                  key={item.key}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                      isChecked
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-700"
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3" />}
                                  </div>
                                  <span
                                    className={
                                      isChecked
                                        ? "text-sm text-gray-900 dark:text-gray-100"
                                        : "text-sm text-gray-500 dark:text-gray-400"
                                    }
                                  >
                                    {item.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmar nueva contraseña */}
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium"
                    >
                      <Lock className="w-4 h-4 text-blue-500" />
                      Confirmar nueva contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required:
                            "La confirmación de contraseña es obligatoria",
                          validate: (value) =>
                            value === newPassword ||
                            "Las contraseñas no coinciden",
                        })}
                        className={`block w-full rounded-lg border ${
                          errors.confirmPassword
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 pl-10 pr-10 shadow-sm transition-colors focus:outline-none`}
                        placeholder="Confirma tu nueva contraseña"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      {errors.confirmPassword && (
                        <div className="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                          <X className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Alerta de seguridad */}
                  {newPassword &&
                    !Object.values(passwordChecks).every(Boolean) && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg mt-4">
                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-700 dark:text-amber-300">
                          <p className="font-medium">
                            Tu contraseña aún no cumple con todos los requisitos
                            de seguridad.
                          </p>
                          <p className="mt-1">
                            Asegúrate de cumplir con todos los criterios para
                            crear una contraseña segura.
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Botón de guardar */}
                  <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          <span>Actualizando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Guardar Contraseña</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
