"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  RefreshCw,
  Loader2,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import passwordImg from "../assets/pass.png";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SecurityView = () => {
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      noSequential: !containsSequentialPatterns(newPassword),
    };
    setPasswordChecks(checks);
    setPasswordStrength(Object.values(checks).filter(Boolean).length * 20);
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
      /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef)/;
    return (
      commonPatterns.some((pattern) => password.includes(pattern)) ||
      sequentialPatternRegex.test(password)
    );
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthName = (strength: number) => {
    if (strength <= 20) return "Muy débil";
    if (strength <= 40) return "Débil";
    if (strength <= 60) return "Moderada";
    if (strength <= 80) return "Fuerte";
    return "Muy fuerte";
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword) {
      errors.currentPassword = "La contraseña actual es requerida";
      isValid = false;
    }

    if (!newPassword) {
      errors.newPassword = "La nueva contraseña es requerida";
      isValid = false;
    } else {
      // Verificar que la contraseña tenga al menos un número
      if (!/\d/.test(newPassword)) {
        errors.newPassword = "La contraseña debe contener al menos un número";
        isValid = false;
      } else if (!Object.values(passwordChecks).every(Boolean)) {
        errors.newPassword = "La contraseña no cumple con todos los requisitos";
        isValid = false;
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "La confirmación de contraseña es requerida";
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      setIsSubmitting(true);

      // Simulación de envío
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);

        // Mostrar mensaje de éxito
        Swal.fire({
          icon: "success",
          title: "Contraseña actualizada",
          text: "Tu contraseña ha sido actualizada correctamente.",
          confirmButtonColor: "#3B82F6",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      {/* Security header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Seguridad de la Cuenta
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Administra tu contraseña y configuración de seguridad
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Alert className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 dark:bg-green-800/50 p-3 rounded-full flex-shrink-0">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <AlertTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Contraseña actualizada con éxito
                  </AlertTitle>
                  <AlertDescription className="text-gray-700 dark:text-gray-300">
                    <p>Tu contraseña ha sido actualizada correctamente.</p>
                    <p className="mt-2">
                      Recuerda utilizar esta nueva contraseña la próxima vez que
                      inicies sesión.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsSuccess(false)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Actualizar otra contraseña</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Imagen de contraseña con efectos */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-full lg:h-64 rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={
                        passwordImg || "/placeholder.svg?height=240&width=320"
                      }
                      alt="Imagen de seguridad"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                      <p className="font-semibold text-lg">Protege tu cuenta</p>
                      <p className="text-sm opacity-90">
                        Actualiza tu contraseña regularmente
                      </p>
                    </div>
                  </motion.div>

                  {/* Información de seguridad */}
                  <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl w-full text-center border border-blue-100 dark:border-blue-800/30 shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Última actualización:{" "}
                        <span className="font-semibold">hace 3 meses</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulario de contraseña */}
                <form
                  onSubmit={handlePasswordSubmit}
                  className="col-span-2 space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="currentPassword"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Contraseña actual
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Ingresa tu contraseña actual"
                          className={`block w-full rounded-xl border ${
                            passwordErrors.currentPassword
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        {passwordErrors.currentPassword && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="newPassword"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Ingresa una nueva contraseña"
                          className={`block w-full rounded-xl border ${
                            passwordErrors.newPassword
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Confirmar nueva contraseña
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirma tu nueva contraseña"
                          className={`block w-full rounded-xl border ${
                            passwordErrors.confirmPassword
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Indicadores de fortaleza de contraseña */}
                  {newPassword && passwordStrength < 100 && (
                    <motion.div
                      className="mt-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Fortaleza de la contraseña:
                        </span>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${getStrengthColor(
                            passwordStrength
                          ).replace("bg-", "bg-opacity-20 text-")}`}
                        >
                          {getStrengthName(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${getStrengthColor(
                            passwordStrength
                          )}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength}%` }}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>

                      <ul className="mt-4 space-y-2 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(passwordChecks).map(
                          ([key, isValid]) => {
                            const labels: Record<string, string> = {
                              length: "Mínimo 8 caracteres",
                              uppercase: "Al menos una mayúscula",
                              lowercase: "Al menos una minúscula",
                              number: "Al menos un número (obligatorio)",
                              special:
                                'Al menos un carácter especial (!@#$%^&*(),.?":{}|)',
                              noSequential:
                                'Sin secuencias obvias como "12345" o "abcd"',
                            };

                            return (
                              <motion.li
                                key={key}
                                className={`flex items-start p-2 rounded-lg ${
                                  isValid
                                    ? "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400"
                                    : key === "number"
                                    ? "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-medium"
                                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                <div
                                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                    isValid
                                      ? "bg-green-100 dark:bg-green-900/30"
                                      : key === "number"
                                      ? "bg-red-100 dark:bg-red-900/30"
                                      : "bg-gray-100 dark:bg-gray-700"
                                  }`}
                                >
                                  {isValid ? (
                                    <Check className="w-3 h-3" />
                                  ) : null}
                                </div>
                                {labels[key]}
                              </motion.li>
                            );
                          }
                        )}
                      </ul>
                    </motion.div>
                  )}

                  {newPassword && passwordStrength === 100 && (
                    <motion.div
                      className="mt-4 flex items-center gap-2 bg-green-50 dark:bg-green-900/10 p-4 rounded-xl text-green-600 dark:text-green-400 font-medium border border-green-100 dark:border-green-900/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold">¡Excelente contraseña!</p>
                        <p className="text-sm opacity-90">
                          Tu contraseña es muy segura
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Botón de guardar */}
                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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
                          <span>Actualizando...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span>Actualizar Contraseña</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-xl shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Consejos de seguridad
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-blue-100/50 dark:border-blue-800/30"
              >
                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>
                  Cambia tu contraseña regularmente para mantener tu cuenta
                  segura.
                </span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-blue-100/50 dark:border-blue-800/30"
              >
                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>No compartas tus credenciales con nadie.</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-blue-100/50 dark:border-blue-800/30"
              >
                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>
                  Utiliza contraseñas diferentes para cada servicio que
                  utilices.
                </span>
              </motion.li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityView;
