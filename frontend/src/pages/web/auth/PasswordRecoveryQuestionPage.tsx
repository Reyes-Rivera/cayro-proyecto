"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Loader2,
  HelpCircle,
  ArrowRight,
  Lock,
  CheckCircle,
  Mail,
  Shield,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Send,
  Award,
  Truck,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "@/pages/web/Home/assets/hero.jpg";
import { compareQuestion, getQuestions } from "@/api/auth";
import { getUserByEmail } from "@/api/users";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

type FormData = {
  email: string;
  securityQuestion: string;
  securityAnswer: string;
};

type QuestionData = {
  id: number;
  question: string;
};

export default function PasswordRecoveryQuestionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      securityQuestion: "",
      securityAnswer: "",
    },
    mode: "onChange",
  });

  const email = watch("email");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const verifyEmail = async () => {
    try {
      const isValid = await getUserByEmail({
        email: email,
      });
      if (isValid) {
        setIsSubmitting(true);
        setValue("securityQuestion", isValid?.data?.securityQuestionId);
        setTimeout(() => {
          setIsSubmitting(false);
          setCurrentStep(2);
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido al verificar.";

      AlertHelper.error({
        message: errorMessage,
        title: "Error al verificar correo",
        timer: 5000,
        animation: "slideIn",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const newData = {
        email: data.email,
        securityQuestionId: +data.securityQuestion,
        securityAnswer: data.securityAnswer,
      };
      await compareQuestion(newData);
      setTimeout(() => {
        setCurrentStep(3);
        AlertHelper.success({
          message: "La respuesta a tu pregunta de seguridad es correcta.",
          title: "Verificación exitosa",
          timer: 4000,
          animation: "slideIn",
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "La respuesta no es correcta. Inténtalo de nuevo.";
      if (errorMessage === "Refresh token inválido o expirado.") {
        AlertHelper.error({
          message: "La respuesta no es correcta. Inténtalo de nuevo.",
          title: "Error de verificación",
          timer: 5000,
          animation: "slideIn",
        });
        return;
      }
      AlertHelper.error({
        message: "La respuesta no es correcta. Inténtalo de nuevo.",
        title: "Error de verificación",
        timer: 5000,
        animation: "slideIn",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getQuestionsApi = async () => {
      try {
        const res = await getQuestions();
        setQuestions(res.data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Error desconocido.";
        AlertHelper.error({
          message: errorMessage,
          title: "Error de carga",
          timer: 5000,
          animation: "slideIn",
        });
      }
    };
    getQuestionsApi();
  }, []);

  // Función para sanitizar la entrada y eliminar caracteres no permitidos
  const sanitizeInput = (value: string) => {
    return value.replace(/[<>'"`]/g, "");
  };

  // Scroll to form on mobile
  const scrollToForm = () => {
    const formElement = document.getElementById("recovery-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden mt-10">
      {/* Loading Screen */}
      {pageLoading && <Loader />}

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-600/5 to-transparent"></div>
        <svg
          className="absolute top-0 left-0 w-full h-full text-blue-600/5 dark:text-blue-400/5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 0 L40 0 L40 40 L0 40 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center justify-center min-h-[80vh]">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={
              animateContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
            }
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 max-w-2xl"
          >
            <div className="text-center lg:text-left mb-8 lg:mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  animateContent
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
              >
                {currentStep === 1 && (
                  <>
                    <Mail className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      VERIFICACIÓN DE CORREO
                    </span>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <HelpCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      PREGUNTA DE SEGURIDAD
                    </span>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <Send className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      CORREO ENVIADO
                    </span>
                  </>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={
                  animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Recupera tu acceso a{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600">
                    Cayro Uniformes
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={animateContent ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mt-6 max-w-lg mx-auto lg:mx-0"
              >
                {currentStep === 1 &&
                  "Ingresa tu correo electrónico para comenzar el proceso de recuperación de contraseña."}
                {currentStep === 2 &&
                  "Responde tu pregunta de seguridad para verificar tu identidad y recuperar el acceso a tu cuenta."}
                {currentStep === 3 &&
                  "Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={animateContent ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-6 mt-8 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Seguridad garantizada
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Proceso sencillo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Acceso rápido
                  </span>
                </div>
              </motion.div>

              {/* Image for large screens */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-12 hidden lg:block"
              >
                <div className="relative">
                  <img
                    src={backgroundImage || "/placeholder.svg"}
                    width={600}
                    height={400}
                    alt="Cayro Uniformes"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                      {currentStep === 1 && "Paso 1: Verificación de correo"}
                      {currentStep === 2 && "Paso 2: Pregunta de seguridad"}
                      {currentStep === 3 && "Paso 3: Correo enviado"}
                    </span>
                    <h3 className="text-xl font-bold mt-2">
                      {currentStep === 1 && "Ingresa tu correo"}
                      {currentStep === 2 && "Verifica tu identidad"}
                      {currentStep === 3 && "Revisa tu bandeja de entrada"}
                    </h3>
                  </div>
                  {/* Floating badges */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        Proceso sencillo
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Mobile scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-8 flex justify-center lg:hidden"
                onClick={scrollToForm}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {currentStep === 1 && "Verificar correo"}
                    {currentStep === 2 && "Responder pregunta"}
                    {currentStep === 3 && "Volver al inicio"}
                  </p>
                  <motion.div
                    animate={{
                      y: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Recovery Form */}
          <motion.div
            id="recovery-form"
            initial={{ opacity: 0, x: 30 }}
            animate={
              animateContent ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
            }
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-1/2 max-w-md"
          >
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full transition-all duration-300 group-hover:scale-150"></div>

              <div className="text-center mb-8 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={
                    animateContent
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -10 }
                  }
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6"
                >
                  {currentStep === 1 && <Mail className="w-8 h-8" />}
                  {currentStep === 2 && <HelpCircle className="w-8 h-8" />}
                  {currentStep === 3 && <CheckCircle className="w-8 h-8" />}
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={
                    animateContent
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -10 }
                  }
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                >
                  {currentStep === 1 && "Verificar correo"}
                  {currentStep === 2 && "Pregunta de seguridad"}
                  {currentStep === 3 && "Recuperación exitosa"}
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={animateContent ? { width: "6rem" } : { width: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="h-1 bg-blue-600 mx-auto mt-4"
                ></motion.div>
              </div>

              {/* Indicador de pasos */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`h-1 w-16 ${
                      currentStep > 1
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= 2
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <div
                    className={`h-1 w-16 ${
                      currentStep > 2
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= 3
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  3
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Email Verification */}
                {currentStep === 1 && (
                  <motion.div
                    key="email-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="correo@ejemplo.com"
                          className={`block w-full rounded-lg border ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                          {...register("email", {
                            required: "El correo electrónico es obligatorio",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message:
                                "Dirección de correo electrónico inválida",
                            },
                            onChange: (e) => {
                              const sanitizedValue = sanitizeInput(
                                e.target.value
                              );
                              e.target.value = sanitizedValue;
                              if (
                                /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                  sanitizedValue
                                )
                              ) {
                                clearErrors("email");
                              }
                            },
                          })}
                        />
                        {errors.email && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                        {!errors.email && email && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {errors.email.message}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start">
                      <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium mb-1">
                          Información importante
                        </p>
                        <p>
                          Ingresa el correo electrónico asociado a tu cuenta
                          para continuar con el proceso de recuperación.
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={verifyEmail}
                      className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group"
                      disabled={isSubmitting || !email || !!errors.email}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button background animation */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          <span>Verificando correo...</span>
                        </>
                      ) : (
                        <>
                          <span>Continuar</span>
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    {/* Enlace de inicio de sesión */}
                    <div className="mt-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        ¿Recordaste tu contraseña?{" "}
                        <Link
                          to="/login"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          Iniciar sesión
                        </Link>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Security Question */}
                {currentStep === 2 && (
                  <motion.form
                    key="security-question-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative z-10"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="securityQuestion"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <HelpCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Pregunta de seguridad
                      </Label>
                      <div className="relative">
                        <select
                          id="securityQuestion"
                          className={`block w-full rounded-lg border ${
                            errors.securityQuestion
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none appearance-none`}
                          {...register("securityQuestion", {
                            required:
                              "Debes seleccionar una pregunta de seguridad",
                          })}
                        >
                          <option value="">Selecciona una pregunta</option>
                          {questions &&
                            questions.map((question) => (
                              <option key={question.id} value={question.id}>
                                {question.question}
                              </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      {errors.securityQuestion && (
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {errors.securityQuestion.message}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="securityAnswer"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Respuesta
                      </Label>
                      <div className="relative">
                        <input
                          id="securityAnswer"
                          type="text"
                          placeholder="Tu respuesta a la pregunta de seguridad"
                          className={`block w-full rounded-lg border ${
                            errors.securityAnswer
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                          {...register("securityAnswer", {
                            required: "La respuesta es obligatoria",
                            minLength: {
                              value: 2,
                              message:
                                "La respuesta debe tener al menos 2 caracteres",
                            },
                            onChange: (e) => {
                              const sanitizedValue = sanitizeInput(
                                e.target.value
                              );
                              e.target.value = sanitizedValue;
                              if (sanitizedValue.length >= 2) {
                                clearErrors("securityAnswer");
                              }
                            },
                          })}
                        />
                        {errors.securityAnswer && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.securityAnswer && (
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {errors.securityAnswer.message}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start">
                      <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium mb-1">
                          Información importante
                        </p>
                        <p>
                          Asegúrate de que la respuesta sea exactamente igual a
                          la que proporcionaste al registrarte.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="sm:w-1/3 p-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        <span>Atrás</span>
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="sm:w-2/3 p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Button background animation */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            <span>Verificando respuesta...</span>
                          </>
                        ) : (
                          <>
                            <span>Verificar respuesta</span>
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Enlace de inicio de sesión */}
                    <div className="mt-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        ¿Recordaste tu contraseña?{" "}
                        <Link
                          to="/login"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          Iniciar sesión
                        </Link>
                      </p>
                    </div>
                  </motion.form>
                )}

                {/* Step 3: Success Message */}
                {currentStep === 3 && (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative z-10"
                  >
                    <Alert className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-800/50 p-3 rounded-full flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <AlertTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Correo enviado
                          </AlertTitle>
                          <AlertDescription className="text-gray-700 dark:text-gray-300">
                            <p>
                              Hemos enviado un correo electrónico a{" "}
                              <strong>{email}</strong> con instrucciones para
                              restablecer tu contraseña.
                            </p>
                            <p className="mt-2">
                              Por favor, revisa tu bandeja de entrada y sigue
                              las instrucciones para completar el proceso.
                            </p>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start">
                      <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium mb-1">
                          ¿No recibiste el correo?
                        </p>
                        <p>
                          Revisa tu carpeta de spam o correo no deseado. Si aún
                          no lo encuentras, puedes solicitar un nuevo correo en
                          unos minutos.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mt-8">
                      <Link
                        to="/login"
                        className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        <span>Volver a iniciar sesión</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Security badge */}
              <motion.div
                className="mt-8 flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Tus datos están protegidos</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
