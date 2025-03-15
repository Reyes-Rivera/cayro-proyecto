"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Key,
  Eye,
  EyeOff,
  Check,
  Shield,
  Lock,
  AlertCircle,
  Save,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordSection() {
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La contraseña no puede contener caracteres especiales como < > ' \" `",
          confirmButtonColor: "#3B82F6",
        });
        setIsSubmitting(false);
        return;
      }

      // Validar que las contraseñas coincidan
      if (data.newPassword !== data.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las contraseñas no coinciden.",
          confirmButtonColor: "#3B82F6",
        });
        setIsSubmitting(false);
        return;
      }

      // Validar que cumpla con todos los requisitos de seguridad
      if (!Object.values(passwordChecks).every(Boolean)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La nueva contraseña no cumple con todos los requisitos de seguridad.",
          confirmButtonColor: "#3B82F6",
        });
        setIsSubmitting(false);
        return;
      }

      // Aquí iría la llamada a la API para actualizar la contraseña
      // await updatePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword
      // });

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Tu contraseña se ha actualizado correctamente.",
        confirmButtonColor: "#3B82F6",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Reiniciar el formulario
      reset();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Hubo un error al actualizar la contraseña.",
        confirmButtonColor: "#3B82F6",
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
      {/* Encabezado de Página */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
        {/* Tarjeta de información de seguridad */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1 sm:gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              Consejos de Seguridad
            </h2>
          </div>

          <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 shadow-md">
                <Lock className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Protege tu cuenta
              </h3>
            </div>

            <div className="space-y-4">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 shadow-sm"
              >
                <h4 className="text-sm md:text-base font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  Contraseña segura
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Utiliza una combinación de letras, números y símbolos. Evita
                  información personal fácil de adivinar.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 shadow-sm"
              >
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Actualiza regularmente
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Cambia tu contraseña cada 3-6 meses para mantener tu cuenta
                  segura.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 shadow-sm"
              >
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  No compartas
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Nunca compartas tu contraseña con nadie ni la guardes en
                  lugares inseguros.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="mt-6 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Fingerprint className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    Autenticación de dos factores
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Añade una capa extra de seguridad a tu cuenta
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Formulario de cambio de contraseña */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-full -mr-16 -mt-16 dark:from-blue-500/20 dark:to-blue-700/20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full -ml-12 -mb-12 dark:from-blue-400/20 dark:to-blue-600/20"></div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1 sm:gap-2">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                Cambiar Contraseña
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 sm:space-y-4 md:space-y-6"
          >
            <div className="space-y-5">
              {/* Contraseña actual */}
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm md:text-base text-gray-700 dark:text-gray-300 flex items-center gap-1 sm:gap-2 font-medium"
                >
                  <Key className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  Contraseña actual
                </Label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("currentPassword", {
                      required: "La contraseña actual es obligatoria",
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 shadow-sm"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Nueva contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium"
                >
                  <Lock className="w-4 h-4 text-blue-500" />
                  Nueva contraseña
                </Label>
                <div className="relative">
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
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 shadow-sm"
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
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirmar nueva contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2 font-medium"
                >
                  <Lock className="w-4 h-4 text-blue-500" />
                  Confirmar nueva contraseña
                </Label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "La confirmación de contraseña es obligatoria",
                      validate: (value) =>
                        value === newPassword || "Las contraseñas no coinciden",
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 shadow-sm"
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Indicador de fortaleza de contraseña */}
            <AnimatePresence>
              {newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 mt-6"
                >
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        Fortaleza de la contraseña:
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${getStrengthColor(
                            passwordStrength
                          ).replace("bg-", "text-")}`}
                        >
                          {getStrengthName(passwordStrength)}
                        </span>
                        {passwordStrength >= 80 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
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

                  {/* Requisitos de contraseña */}
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-xl border border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Requisitos de contraseña:
                    </h4>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4">
                      {[
                        { key: "length", label: "Mínimo 8 caracteres" },
                        { key: "uppercase", label: "Al menos una mayúscula" },
                        { key: "lowercase", label: "Al menos una minúscula" },
                        { key: "number", label: "Al menos un número" },
                        {
                          key: "special",
                          label: "Al menos un carácter especial",
                        },
                        { key: "noSequential", label: "Sin secuencias obvias" },
                        {
                          key: "noInvalidChars",
                          label: "Sin caracteres < > ' \" `",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm ${
                            passwordChecks[
                              item.key as keyof typeof passwordChecks
                            ]
                              ? "bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30"
                              : "bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {passwordChecks[
                            item.key as keyof typeof passwordChecks
                          ] ? (
                            <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                          )}
                          <span
                            className={`text-sm ${
                              passwordChecks[
                                item.key as keyof typeof passwordChecks
                              ]
                                ? "text-green-700 dark:text-green-400 font-medium"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {item.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de guardar */}
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
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span className="text-sm md:text-base">
                      Guardar Contraseña
                    </span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
