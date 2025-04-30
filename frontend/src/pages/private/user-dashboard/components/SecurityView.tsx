"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  Loader2,
  KeyRound,
  ArrowRight,
  HelpCircle,
  ShieldQuestion,
  ArrowLeft,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getQuestions } from "@/api/auth";
import { updateAnswer, updatePasswordUser } from "@/api/users";
import { useAuth } from "@/context/AuthContextType";

// Tipos para los formularios
type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type RecoveryFormValues = {
  securityQuestion: string;
  securityAnswer: string;
};

type QuestionData = {
  id: number;
  question: string;
};

const SecurityView = () => {
  // Estados generales
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoverySubmitting, setIsRecoverySubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const { user, signOut } = useAuth();

  // React Hook Form para cambio de contraseña
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // React Hook Form para recuperación por pregunta secreta
  const {
    register: registerRecovery,
    handleSubmit: handleSubmitRecovery,
    formState: { errors: recoveryErrors },
    setValue: setRecoveryValue,
    reset: resetRecovery,
  } = useForm<RecoveryFormValues>({
    defaultValues: {
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  // Observar la nueva contraseña para calcular su fortaleza
  const newPassword = watchPassword("newPassword");

  // Función para sanitizar la entrada
  const sanitizeInput = (value: string): string => {
    return value.replace(/[<>'"`]/g, "");
  };

  useEffect(() => {
    const getQuestionsApi = async () => {
      const res = await getQuestions();
      setQuestions(res.data);
    };
    getQuestionsApi();
    if (newPassword) {
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
    } else {
      setPasswordStrength(0);
    }
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

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);

    try {
      const newData = {
        currentPassword: data.currentPassword,
        password: data.newPassword,
      };
      await updatePasswordUser(Number(user?.id), newData);
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada exitosamente!",
        toast: true,
        text: "Por favor, inicia sesión nuevamente con tu nueva contraseña.",
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        animation: true,
        background: "#F0FDF4",
        color: "#166534",
        iconColor: "#22C55E",
      });
      setIsSubmitting(false);
      await signOut();
      return;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      Swal.fire({
        icon: "error",
        title: "Error al actualizar.",
        toast: true,
        text: errorMessage,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        animation: true,
        background: "#FEF2F2",
        color: "#B91C1C",
        iconColor: "#EF4444",
      });
      setIsSubmitting(false);
      return;
    }
  };

  const onRecoverySubmit = async (data: RecoveryFormValues) => {
    setIsRecoverySubmitting(true);
    try {
      const newData = {
        securityAnswer: data.securityAnswer,
        securityQuestionId: +data.securityQuestion,
      };
      await updateAnswer(Number(user?.id), newData);
      setIsRecoverySubmitting(false);
      setRecoverySuccess(true);
      // Scroll to top after success
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        toast: true,
        text: errorMessage,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        animation: true,
        background: "#FEF2F2",
        color: "#B91C1C",
        iconColor: "#EF4444",
      });
      setIsRecoverySubmitting(false);
      return;
    }
  };

  const handleSecurityQuestionChange = (value: string) => {
    setRecoveryValue("securityQuestion", value);
  };

  const resetRecoveryForm = () => {
    resetRecovery();
    setRecoverySuccess(false);
    // Scroll to top when resetting form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 md:p-8">
      {/* Security header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-md mr-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 rounded-full w-8 h-8 -top-4 -left-4 blur-md"></div>
              <Lock className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Seguridad de la Cuenta
              </h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>Mi Cuenta</span>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  Seguridad
                </span>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 shadow-sm"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
            <Shield className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <span>
              Mantén tu cuenta segura actualizando regularmente tu contraseña y
              configurando opciones de recuperación.
            </span>
          </p>
        </motion.div>
      </motion.div>

      {/* Tabs for different security options */}
      <Tabs defaultValue="password" className="mb-8">
        <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="password"
            className="text-sm md:text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all"
          >
            <Lock className="w-4 h-4 mr-2" />
            Cambiar Contraseña
          </TabsTrigger>
          <TabsTrigger
            value="recovery"
            className="text-sm md:text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Recuperar Contraseña
          </TabsTrigger>
        </TabsList>

        {/* Password Change Tab */}
        <TabsContent value="password">
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
                          Recuerda utilizar esta nueva contraseña la próxima vez
                          que inicies sesión.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setIsSuccess(false);
                            resetPassword();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* Encabezado de cambio de contraseña */}
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Cambio de contraseña
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Última actualización: hace 3 meses
                        </p>
                      </div>
                    </div>

                    {/* Formulario de contraseña */}
                    <form
                      onSubmit={handleSubmitPassword(onPasswordSubmit)}
                      className="space-y-5"
                    >
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1.5"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Contraseña actual
                          </label>
                          <div className="relative group">
                            <input
                              id="currentPassword"
                              type="password"
                              placeholder="Ingresa tu contraseña actual"
                              className={cn(
                                "block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400",
                                passwordErrors.currentPassword
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              )}
                              {...registerPassword("currentPassword", {
                                required: "La contraseña actual es requerida",
                                onChange: (e) => {
                                  e.target.value = sanitizeInput(
                                    e.target.value
                                  );
                                },
                              })}
                            />
                            {passwordErrors.currentPassword && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="newPassword"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1.5"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Nueva contraseña
                          </label>
                          <div className="relative group">
                            <input
                              id="newPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="Ingresa una nueva contraseña"
                              className={cn(
                                "block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400",
                                passwordErrors.newPassword
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              )}
                              {...registerPassword("newPassword", {
                                required: "La nueva contraseña es requerida",
                                validate: {
                                  hasNumber: (value) =>
                                    /\d/.test(value) ||
                                    "La contraseña debe contener al menos un número",
                                  meetsRequirements: (value) => {
                                    const checks = {
                                      length: value.length >= 8,
                                      uppercase: /[A-Z]/.test(value),
                                      lowercase: /[a-z]/.test(value),
                                      number: /[0-9]/.test(value),
                                      special: /[!@#$%^&*(),.?":{}|<>]/.test(
                                        value
                                      ),
                                      noSequential:
                                        !containsSequentialPatterns(value),
                                    };
                                    return (
                                      Object.values(checks).every(Boolean) ||
                                      "La contraseña no cumple con todos los requisitos"
                                    );
                                  },
                                },
                                onChange: (e) => {
                                  e.target.value = sanitizeInput(
                                    e.target.value
                                  );
                                },
                              })}
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
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1.5"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Confirmar nueva contraseña
                          </label>
                          <div className="relative group">
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirma tu nueva contraseña"
                              className={cn(
                                "block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400",
                                passwordErrors.confirmPassword
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              )}
                              {...registerPassword("confirmPassword", {
                                required:
                                  "La confirmación de contraseña es requerida",
                                validate: (value) =>
                                  value === watchPassword("newPassword") ||
                                  "Las contraseñas no coinciden",
                                onChange: (e) => {
                                  e.target.value = sanitizeInput(
                                    e.target.value
                                  );
                                },
                              })}
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
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Indicadores de fortaleza de contraseña */}
                      {newPassword && passwordStrength < 100 && (
                        <motion.div
                          className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 shadow-sm"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                              <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Fortaleza:
                            </span>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStrengthColor(
                                passwordStrength
                              ).replace("bg-", "bg-opacity-20 text-")}`}
                            >
                              {getStrengthName(passwordStrength)}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${getStrengthColor(
                                passwordStrength
                              )}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              transition={{ duration: 0.5 }}
                            ></motion.div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {Object.entries(passwordChecks).map(
                              ([key, isValid]) => {
                                const labels: Record<string, string> = {
                                  length: "Mínimo 8 caracteres",
                                  uppercase: "Una mayúscula",
                                  lowercase: "Una minúscula",
                                  number: "Un número",
                                  special: "Un carácter especial",
                                  noSequential: "Sin secuencias obvias",
                                };

                                return (
                                  <motion.div
                                    key={key}
                                    className={`flex items-center text-xs p-1 rounded ${
                                      isValid
                                        ? "text-green-600 dark:text-green-400"
                                        : key === "number"
                                        ? "text-red-600 dark:text-red-400 font-medium"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div
                                      className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center mr-1.5 ${
                                        isValid
                                          ? "bg-green-100 dark:bg-green-900/30"
                                          : key === "number"
                                          ? "bg-red-100 dark:bg-red-900/30"
                                          : "bg-gray-100 dark:bg-gray-700"
                                      }`}
                                    >
                                      {isValid && <Check className="w-2 h-2" />}
                                    </div>
                                    {labels[key]}
                                  </motion.div>
                                );
                              }
                            )}
                          </div>
                        </motion.div>
                      )}

                      {newPassword && passwordStrength === 100 && (
                        <motion.div
                          className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg text-green-600 dark:text-green-400 font-medium border border-green-100 dark:border-green-900/30"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                            <Check className="w-4 h-4" />
                          </div>
                          <span className="text-sm">
                            ¡Excelente contraseña!
                          </span>
                        </motion.div>
                      )}

                      {/* Botón de guardar */}
                      <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4" />
                              <span>Actualizando...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
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
        </TabsContent>

        {/* Password Recovery Tab */}
        <TabsContent value="recovery">
          <AnimatePresence mode="wait">
            {recoverySuccess ? (
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
                        Cambio de pregunta secreta realizado con éxito.
                      </AlertTitle>
                      <AlertDescription className="text-gray-700 dark:text-gray-300">
                        <p>
                          El cambio se realizó de forma correcta, la próxima vez
                          que desees recuperar tu contraseña puedes seleccionar,
                          recuperar contraseña por pregunta secreta.
                        </p>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setRecoverySuccess(false);
                            resetRecoveryForm();
                          }}
                          className="mt-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Regresar</span>
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* Encabezado de recuperación */}
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <ShieldQuestion className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Recuperación por pregunta secreta
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Responde correctamente para recuperar el acceso
                        </p>
                      </div>
                    </div>

                    {/* Formulario de recuperación por pregunta secreta */}
                    <form
                      onSubmit={handleSubmitRecovery(onRecoverySubmit)}
                      className="space-y-5"
                    >
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="securityQuestion"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1.5"
                          >
                            <HelpCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Pregunta de seguridad
                          </label>
                          <div className="relative group">
                            <select
                              id="securityQuestion"
                              className={cn(
                                "block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400 appearance-none",
                                recoveryErrors.securityQuestion
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              )}
                              {...registerRecovery("securityQuestion", {
                                required:
                                  "Selecciona una pregunta de seguridad",
                              })}
                              onChange={(e) =>
                                handleSecurityQuestionChange(e.target.value)
                              }
                            >
                              <option value="">
                                Selecciona una pregunta de seguridad
                              </option>
                              {questions?.map((question, index) => (
                                <option key={index} value={String(question.id)}>
                                  {question.question}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                              <ChevronRight className="h-5 w-5 rotate-90" />
                            </div>
                            {recoveryErrors.securityQuestion && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {recoveryErrors.securityQuestion && (
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {recoveryErrors.securityQuestion.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="securityAnswer"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-1.5"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Respuesta
                          </label>
                          <div className="relative group">
                            <input
                              id="securityAnswer"
                              type="text"
                              placeholder="Ingresa tu respuesta"
                              className={cn(
                                "block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-400",
                                recoveryErrors.securityAnswer
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              )}
                              {...registerRecovery("securityAnswer", {
                                required: "La respuesta es requerida",
                                minLength: {
                                  value: 3,
                                  message:
                                    "La respuesta debe tener al menos 3 caracteres",
                                },
                                onChange: (e) => {
                                  e.target.value = sanitizeInput(
                                    e.target.value
                                  );
                                },
                              })}
                            />
                            {recoveryErrors.securityAnswer && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {recoveryErrors.securityAnswer && (
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {recoveryErrors.securityAnswer.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Información de seguridad */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 text-blue-800 dark:text-blue-300 text-sm">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              Información importante
                            </p>
                            <p className="mt-0.5">
                              Si has olvidado la respuesta a tu pregunta de
                              seguridad, contacta con soporte técnico.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Botón de enviar */}
                      <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isRecoverySubmitting}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                          {isRecoverySubmitting ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4" />
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <KeyRound className="w-4 h-4" />
                              <span>Guardar</span>
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
        </TabsContent>
      </Tabs>

      {/* Security tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-md"
      >
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Consejos de seguridad
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
              <motion.li
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Cambia tu contraseña regularmente</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>No compartas tus credenciales</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Usa contraseñas diferentes para cada servicio</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700"
              >
                <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Configura preguntas de seguridad únicas</span>
              </motion.li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityView;
