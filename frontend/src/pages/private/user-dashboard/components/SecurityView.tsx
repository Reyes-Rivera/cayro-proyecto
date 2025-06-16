"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateAnswer, updatePasswordUser } from "@/api/users";
import { useAuth } from "@/context/AuthContextType";
import { motion } from "framer-motion";
import {
  Lock,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  Loader2,
  HelpCircle,
  ShieldQuestion,
  ArrowLeft,
  Info,
  Save,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getQuestions } from "@/api/auth";
import Loader from "@/components/web-components/Loader";

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

export default function SecurityView() {
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
  const [isSuccess] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  const [activeTab, setActiveTab] = useState("password");

  const { user, signOut } = useAuth();

  // React Hook Form para cambio de contraseña
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
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

  // Simular carga de página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Activar animaciones después de que desaparezca la pantalla de carga
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      alert(
        "¡Contraseña actualizada exitosamente! Por favor, inicia sesión nuevamente con tu nueva contraseña."
      );
      setIsSubmitting(false);
      await signOut();
      return;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
      alert(errorMessage);
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
      alert(errorMessage);
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
    <div className="relative">
      {/* Loading Screen */}
      {pageLoading && <Loader />}

      {!pageLoading && (
        <div className="p-6 md:p-8">
          {/* Security Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
            }
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div>
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-gray-900 px-4 py-1.5">
                <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  SEGURIDAD
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                Seguridad de la{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600 dark:text-blue-400">
                    Cuenta
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/20 dark:bg-blue-400/20 -z-10 rounded"></span>
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Gestiona tu contraseña y opciones de recuperación
              </p>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <Tabs
                defaultValue="password"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  <TabsTrigger
                    value="password"
                    className="text-sm md:text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all dark:text-gray-300"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Cambiar Contraseña
                  </TabsTrigger>
                  <TabsTrigger
                    value="recovery"
                    className="text-sm md:text-base data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-md transition-all dark:text-gray-300"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Recuperar Contraseña
                  </TabsTrigger>
                </TabsList>

                {/* Password Change Tab */}
                <TabsContent value="password">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Cambio de Contraseña
                    </h2>
                  </div>

                  {isSuccess ? (
                    <Alert className="mb-6 bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-800 text-gray-700 dark:text-green-100 py-3 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 dark:text-green-300" />
                      <AlertDescription className="text-sm">
                        Tu contraseña ha sido actualizada correctamente.
                        Recuerda utilizar esta nueva contraseña la próxima vez
                        que inicies sesión.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form
                      onSubmit={handleSubmitPassword(onPasswordSubmit)}
                      className="relative"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Current Password field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="currentPassword"
                            className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Contraseña actual
                          </label>
                          <div className="relative group">
                            <input
                              id="currentPassword"
                              type="password"
                              className={`block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300 ${
                                passwordErrors.currentPassword
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                              }`}
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
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>
                          {passwordErrors.currentPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        {/* New Password field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="newPassword"
                            className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Nueva contraseña
                          </label>
                          <div className="relative group">
                            <input
                              id="newPassword"
                              type={showPassword ? "text" : "password"}
                              className={`block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300 ${
                                passwordErrors.newPassword
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                              }`}
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
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
                              onClick={() => setShowPassword(!showPassword)}
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                            {passwordErrors.newPassword && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>
                          {passwordErrors.newPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.newPassword.message}
                            </p>
                          )}
                        </div>

                        {/* Confirm Password field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="confirmPassword"
                            className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Confirmar contraseña
                          </label>
                          <div className="relative group">
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              className={`block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300 ${
                                passwordErrors.confirmPassword
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                              }`}
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
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400"
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
                            {passwordErrors.confirmPassword && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>
                          {passwordErrors.confirmPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {passwordErrors.confirmPassword.message}
                            </p>
                          )}
                        </div>

                        {/* Password Strength */}
                        {newPassword && (
                          <div className="space-y-2">
                            <label className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                              <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Fortaleza de contraseña
                            </label>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {getStrengthName(passwordStrength)}
                                </span>
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStrengthColor(
                                    passwordStrength
                                  ).replace("bg-", "bg-opacity-20 text-")}`}
                                >
                                  {passwordStrength}%
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${getStrengthColor(
                                    passwordStrength
                                  )}`}
                                  style={{ width: `${passwordStrength}%` }}
                                ></div>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-1.5">
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
                                      <div
                                        key={key}
                                        className={`flex items-center text-xs ${
                                          isValid
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-gray-500 dark:text-gray-400"
                                        }`}
                                      >
                                        <div
                                          className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center mr-1.5 ${
                                            isValid
                                              ? "bg-green-100 dark:bg-green-900"
                                              : "bg-gray-100 dark:bg-gray-600"
                                          }`}
                                        >
                                          {isValid && (
                                            <Check className="w-2 h-2" />
                                          )}
                                        </div>
                                        {labels[key]}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Separator className="my-6 dark:bg-gray-700" />
                      <div className="flex justify-end gap-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Actualizando...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Actualizar Contraseña</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </TabsContent>

                {/* Recovery Tab */}
                <TabsContent value="recovery">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <ShieldQuestion className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Pregunta de Seguridad
                    </h2>
                  </div>

                  {recoverySuccess ? (
                    <Alert className="mb-6 bg-green-50 dark:bg-green-900 border border-green-100 dark:border-green-800 text-gray-700 dark:text-green-100 py-3 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 dark:text-green-300" />
                      <AlertDescription className="text-sm">
                        El cambio se realizó de forma correcta. La próxima vez
                        que desees recuperar tu contraseña puedes seleccionar
                        recuperar contraseña por pregunta secreta.
                        <div className="mt-4">
                          <Button
                            onClick={resetRecoveryForm}
                            variant="outline"
                            className="gap-2 dark:border-gray-600 dark:text-gray-300"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Regresar</span>
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form
                      onSubmit={handleSubmitRecovery(onRecoverySubmit)}
                      className="relative"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Security Question field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="securityQuestion"
                            className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                          >
                            <HelpCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Pregunta de seguridad
                          </label>
                          <div className="relative group">
                            <select
                              id="securityQuestion"
                              className={`block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300 appearance-none ${
                                recoveryErrors.securityQuestion
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                              }`}
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
                              {questions?.map((question) => (
                                <option
                                  key={question.id}
                                  value={String(question.id)}
                                >
                                  {question.question}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 rotate-90" />
                            </div>
                            {recoveryErrors.securityQuestion && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>
                          {recoveryErrors.securityQuestion && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {recoveryErrors.securityQuestion.message}
                            </p>
                          )}
                        </div>

                        {/* Security Answer field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="securityAnswer"
                            className="flex items-center text-gray-600 dark:text-gray-300 text-sm font-medium"
                          >
                            <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Respuesta
                          </label>
                          <div className="relative group">
                            <input
                              id="securityAnswer"
                              type="text"
                              className={`block w-full rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-3.5 shadow-sm transition-all focus:outline-none group-hover:border-blue-300 ${
                                recoveryErrors.securityAnswer
                                  ? "border-red-300 focus:ring-red-300 focus:border-red-300"
                                  : "border-blue-200 dark:border-gray-700 focus:ring-blue-300 dark:focus:border-blue-400 focus:border-blue-300"
                              }`}
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
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              </div>
                            )}
                          </div>
                          {recoveryErrors.securityAnswer && (
                            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              {recoveryErrors.securityAnswer.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Security Info */}
                      <div className="mt-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-800 dark:text-blue-100 text-sm">
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

                      {/* Submit Button */}
                      <Separator className="my-6 dark:bg-gray-700" />
                      <div className="flex justify-end gap-3">
                        <Button
                          type="submit"
                          disabled={isRecoverySubmitting}
                          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white gap-2"
                        >
                          {isRecoverySubmitting ? (
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
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>

          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Consejos de seguridad
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                  <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Cambia tu contraseña regularmente
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                  <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    No compartas tus credenciales
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                  <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Usa contraseñas diferentes para cada servicio
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                  <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Configura preguntas de seguridad únicas
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
