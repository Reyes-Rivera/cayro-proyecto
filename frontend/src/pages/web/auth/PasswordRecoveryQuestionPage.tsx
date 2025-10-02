"use client";
import { useEffect, useMemo, useState } from "react";
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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import backgroundImage from "@/pages/web/Home/assets/hero.webp";
import { compareQuestion, getQuestions } from "@/api/auth";
import { getUserByEmail } from "@/api/users";
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // A11y/perf: respeta reduced motion
  const prefersReducedMotion = useReducedMotion();
  const animateOrNot = (val: any) => (prefersReducedMotion ? {} : val);
  const [animateContent, setAnimateContent] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion) setAnimateContent(true);
  }, [prefersReducedMotion]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    setValue,
  } = useForm<FormData>({
    defaultValues: { email: "", securityQuestion: "", securityAnswer: "" },
    mode: "onChange",
  });

  const email = watch("email");

  // Carga preguntas
  useEffect(() => {
    (async () => {
      try {
        const res = await getQuestions();
        setQuestions(res.data);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Error desconocido.";
        AlertHelper.error({
          message: errorMessage,
          title: "Error de carga",
          timer: 5000,
          animation: "slideIn",
        });
      }
    })();
  }, []);

  // Sanitizador de entrada
  const sanitizeInput = (v: string) => v.replace(/[<>'"`]/g, "");

  // Verificar correo -> step 2
  const verifyEmail = async () => {
    try {
      if (!email) return;
      setIsSubmitting(true);
      const resp = await getUserByEmail({ email });
      if (resp) {
        setValue(
          "securityQuestion",
          resp?.data?.securityQuestionId?.toString?.() || ""
        );
        setCurrentStep(2);
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Error desconocido al verificar.";
      AlertHelper.error({
        message: errorMessage,
        title: "Error al verificar correo",
        timer: 5000,
        animation: "slideIn",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enviar respuesta
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const payload = {
        email: data.email,
        securityQuestionId: Number(data.securityQuestion),
        securityAnswer: data.securityAnswer,
      };
      await compareQuestion(payload);
      setCurrentStep(3);
      AlertHelper.success({
        message: "La respuesta a tu pregunta de seguridad es correcta.",
        title: "Verificación exitosa",
        timer: 3000,
        animation: "slideIn",
      });
    } catch {
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

  // Scroll a formulario (móvil)
  const scrollToForm = () => {
    const formEl = document.getElementById("recovery-form");
    formEl?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    if (currentStep === 1)
      (document.getElementById("email") as HTMLInputElement | null)?.focus();
    if (currentStep === 2)
      (
        document.getElementById("securityAnswer") as HTMLInputElement | null
      )?.focus();
  };

  // Variants memorizados
  const variants = useMemo(
    () => ({
      left: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
      right: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
      up: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
      in: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
      pop: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
      },
    }),
    []
  );

  return (
    <>
      {/* Skip link */}
      <a
        href="#recovery-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-blue-700 text-white px-3 py-2 rounded-md z-50"
      >
        Saltar al formulario de recuperación
      </a>

      <main
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden mt-10"
        role="main"
        aria-labelledby="page-title"
      >
        {/* Fondo decorativo no anunciable */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-600/5 to-transparent"></div>
          <svg
            className="absolute top-0 left-0 w-full h-full text-blue-600/5 dark:text-blue-400/5"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
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

        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 relative z-10">
          <section className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-center min-h-[70vh]">
            {/* Columna izquierda */}
            <motion.div
              {...animateOrNot({
                initial: variants.left.initial,
                animate: animateContent ? variants.left.animate : {},
                transition: { duration: 0.6 },
              })}
              className="w-full lg:w-1/2 max-w-2xl"
            >
              <header className="text-center lg:text-left mb-8 lg:mb-12">
                <motion.div
                  {...animateOrNot({
                    initial: variants.pop.initial,
                    animate: animateContent ? variants.pop.animate : {},
                    transition: { duration: 0.4 },
                  })}
                  className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
                  aria-hidden="true"
                >
                  {currentStep === 1 && (
                    <Mail className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  {currentStep === 2 && (
                    <HelpCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  {currentStep === 3 && (
                    <Send className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {currentStep === 1 && "VERIFICACIÓN DE CORREO"}
                    {currentStep === 2 && "PREGUNTA DE SEGURIDAD"}
                    {currentStep === 3 && "CORREO ENVIADO"}
                  </span>
                </motion.div>

                <motion.h1
                  id="page-title"
                  {...animateOrNot({
                    initial: variants.up.initial,
                    animate: animateContent ? variants.up.animate : {},
                    transition: { duration: 0.5, delay: 0.1 },
                  })}
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  Recupera tu acceso a{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-blue-600">
                      Cayro Uniformes
                    </span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded" />
                  </span>
                </motion.h1>

                <motion.p
                  {...animateOrNot({
                    initial: { opacity: 0 },
                    animate: animateContent ? { opacity: 1 } : {},
                    transition: { duration: 0.5, delay: 0.25 },
                  })}
                  className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mt-4 md:mt-6 max-w-lg mx-auto lg:mx-0"
                  aria-live="polite"
                >
                  {currentStep === 1 &&
                    "Ingresa tu correo electrónico para comenzar el proceso de recuperación de contraseña."}
                  {currentStep === 2 &&
                    "Responde tu pregunta de seguridad para verificar tu identidad y recuperar el acceso a tu cuenta."}
                  {currentStep === 3 &&
                    "Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña."}
                </motion.p>

                <motion.div
                  {...animateOrNot({
                    initial: { opacity: 0 },
                    animate: animateContent ? { opacity: 1 } : {},
                    transition: { duration: 0.5, delay: 0.3 },
                  })}
                  className="flex flex-wrap gap-4 md:gap-6 mt-6 md:mt-8 justify-center lg:justify-start"
                  aria-label="Beneficios"
                >
                  {[
                    { Icon: Shield, label: "Seguridad garantizada" },
                    { Icon: Award, label: "Proceso sencillo" },
                    { Icon: Truck, label: "Acceso rápido" },
                  ].map(({ Icon, label }) => (
                    <div className="flex items-center gap-2" key={label}>
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Icon
                          className="w-5 h-5 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-gray-800 dark:text-gray-300 text-sm md:text-base">
                        {label}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* Imagen optimizada */}
                <motion.div
                  {...animateOrNot({
                    initial: { opacity: 0, y: 16 },
                    animate: animateContent ? { opacity: 1, y: 0 } : {},
                    transition: { duration: 0.5, delay: 0.35 },
                  })}
                  className="mt-8 md:mt-10 hidden lg:block"
                >
                  <figure className="relative">
                    <img
                      src={backgroundImage || "/placeholder.svg"}
                      width={600}
                      height={400}
                      alt="Proceso de recuperación en Cayro Uniformes"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      sizes="(max-width: 1024px) 0px, 600px"
                    />
                    <figcaption className="sr-only">
                      Pasos para recuperar el acceso a la cuenta.
                    </figcaption>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-xs md:text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                        {currentStep === 1 && "Paso 1: Verificación de correo"}
                        {currentStep === 2 && "Paso 2: Pregunta de seguridad"}
                        {currentStep === 3 && "Paso 3: Correo enviado"}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold mt-2">
                        {currentStep === 1 && "Ingresa tu correo"}
                        {currentStep === 2 && "Verifica tu identidad"}
                        {currentStep === 3 && "Revisa tu bandeja de entrada"}
                      </h3>
                    </div>
                    <motion.div
                      {...animateOrNot({
                        initial: { scale: 0.9, opacity: 0 },
                        animate: { scale: 1, opacity: 1 },
                        transition: { duration: 0.4, delay: 0.6 },
                      })}
                      className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30"
                      aria-hidden="true"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles
                          className="w-4 h-4 text-yellow-500"
                          aria-hidden="true"
                        />
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          Proceso sencillo
                        </span>
                      </div>
                    </motion.div>
                  </figure>
                </motion.div>

                {/* CTA móvil para ir al formulario */}
                <motion.div
                  {...animateOrNot({
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.6, duration: 0.5 },
                  })}
                  className="mt-6 md:mt-8 flex justify-center lg:hidden"
                >
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="flex flex-col items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
                    aria-label="Ir al formulario de recuperación"
                  >
                    <span className="text-sm font-medium">
                      {currentStep === 1 && "Verificar correo"}
                      {currentStep === 2 && "Responder pregunta"}
                      {currentStep === 3 && "Volver al inicio"}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700">
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </button>
                </motion.div>
              </header>
            </motion.div>

            {/* Columna derecha - Formulario */}
            <motion.div
              id="recovery-form"
              {...animateOrNot({
                initial: variants.right.initial,
                animate: animateContent ? variants.right.animate : {},
                transition: { duration: 0.6, delay: 0.1 },
              })}
              className="w-full lg:w-1/2 max-w-md"
            >
              <section
                className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                aria-label="Formulario de recuperación por pregunta de seguridad"
              >
                <div
                  className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full"
                  aria-hidden="true"
                />
                <div
                  className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full"
                  aria-hidden="true"
                />

                <div className="text-center mb-6 sm:mb-8 relative z-10">
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4"
                    aria-hidden="true"
                  >
                    {currentStep === 1 && <Mail className="w-7 h-7" />}
                    {currentStep === 2 && <HelpCircle className="w-7 h-7" />}
                    {currentStep === 3 && <CheckCircle className="w-7 h-7" />}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {currentStep === 1 && "Verificar correo"}
                    {currentStep === 2 && "Pregunta de seguridad"}
                    {currentStep === 3 && "Recuperación exitosa"}
                  </h2>
                  <div
                    className="h-1 bg-blue-600 mx-auto mt-3"
                    style={{ width: "6rem" }}
                    aria-hidden="true"
                  />
                </div>

                {/* Stepper accesible */}
                <ol
                  className="flex items-center justify-center mb-8 gap-4"
                  aria-label="Progreso"
                  aria-live="polite"
                >
                  {[1, 2, 3].map((step) => (
                    <li key={step} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= step
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                        aria-current={currentStep === step ? "step" : undefined}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`h-1 w-14 ${
                            currentStep > step
                              ? "bg-blue-600"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  ))}
                </ol>

                <AnimatePresence mode="wait">
                  {/* STEP 1 */}
                  {currentStep === 1 && (
                    <motion.div
                      key="email-form"
                      {...animateOrNot({
                        initial: variants.in.initial,
                        animate: variants.in.animate,
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.25 },
                      })}
                      className="space-y-6 relative z-10"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Mail
                            className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          />
                          Correo electrónico
                        </Label>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="correo@ejemplo.com"
                            className={`block w-full rounded-lg border ${
                              errors.email
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors outline-none`}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={
                              errors.email ? "email-error" : "email-help"
                            }
                            {...register("email", {
                              required: "El correo electrónico es obligatorio",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message:
                                  "Dirección de correo electrónico inválida",
                              },
                              onChange: (e) => {
                                const v = sanitizeInput(e.target.value);
                                e.target.value = v;
                                setValue("email", v, { shouldValidate: true });
                                if (errors.email) clearErrors("email");
                              },
                            })}
                            spellCheck={false}
                          />
                          {errors.email ? (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          ) : email ? (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <CheckCircle
                                className="h-5 w-5 text-green-600"
                                aria-hidden="true"
                              />
                            </div>
                          ) : null}
                        </div>
                        {errors.email ? (
                          <p
                            id="email-error"
                            className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {errors.email.message}
                          </p>
                        ) : (
                          <p id="email-help" className="sr-only">
                            Introduce el correo asociado a tu cuenta.
                          </p>
                        )}
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200 flex items-start">
                        <Shield
                          className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
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
                        className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                        disabled={isSubmitting || !email || !!errors.email}
                        aria-busy={isSubmitting}
                        {...animateOrNot({
                          whileHover: { scale: 1.02 },
                          whileTap: { scale: 0.98 },
                        })}
                      >
                        <span
                          className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                          aria-hidden="true"
                        />
                        {isSubmitting ? (
                          <>
                            <Loader2
                              className="animate-spin mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            <span>Verificando correo…</span>
                          </>
                        ) : (
                          <>
                            <span>Continuar</span>
                            <ArrowRight
                              className="ml-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </motion.button>

                      <div className="mt-6 text-center">
                        <p className="text-gray-700 dark:text-gray-300">
                          ¿Recordaste tu contraseña?{" "}
                          <Link
                            to="/login"
                            className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                          >
                            Iniciar sesión
                          </Link>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2 */}
                  {currentStep === 2 && (
                    <motion.form
                      key="security-question-form"
                      {...animateOrNot({
                        initial: variants.in.initial,
                        animate: variants.in.animate,
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.25 },
                      })}
                      className="space-y-6 relative z-10"
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="securityQuestion"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <HelpCircle
                            className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          />
                          Pregunta de seguridad
                        </Label>
                        <div className="relative">
                          <select
                            id="securityQuestion"
                            className={`block w-full rounded-lg border ${
                              errors.securityQuestion
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors outline-none appearance-none`}
                            aria-invalid={Boolean(errors.securityQuestion)}
                            aria-describedby={
                              errors.securityQuestion
                                ? "question-error"
                                : undefined
                            }
                            {...register("securityQuestion", {
                              required:
                                "Debes seleccionar una pregunta de seguridad",
                            })}
                            defaultValue={watch("securityQuestion")}
                          >
                            <option value="">Selecciona una pregunta</option>
                            {questions.map((q) => (
                              <option key={q.id} value={q.id}>
                                {q.question}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <ChevronDown
                              className="h-5 w-5 text-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                        {errors.securityQuestion && (
                          <p
                            id="question-error"
                            className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {errors.securityQuestion.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="securityAnswer"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Lock
                            className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          />
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
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors outline-none`}
                            aria-invalid={Boolean(errors.securityAnswer)}
                            aria-describedby={
                              errors.securityAnswer ? "answer-error" : undefined
                            }
                            {...register("securityAnswer", {
                              required: "La respuesta es obligatoria",
                              minLength: {
                                value: 2,
                                message:
                                  "La respuesta debe tener al menos 2 caracteres",
                              },
                              onChange: (e) => {
                                const v = sanitizeInput(e.target.value);
                                e.target.value = v;
                                setValue("securityAnswer", v, {
                                  shouldValidate: true,
                                });
                                if (errors.securityAnswer)
                                  clearErrors("securityAnswer");
                              },
                            })}
                          />
                          {errors.securityAnswer && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>
                        {errors.securityAnswer && (
                          <p
                            id="answer-error"
                            className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {errors.securityAnswer.message}
                          </p>
                        )}
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200 flex items-start">
                        <Shield
                          className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-medium mb-1">
                            Información importante
                          </p>
                          <p>
                            Asegúrate de que la respuesta sea exactamente igual
                            a la que proporcionaste al registrarte.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="sm:w-1/3 p-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          {...animateOrNot({
                            whileHover: { scale: 1.02 },
                            whileTap: { scale: 0.98 },
                          })}
                        >
                          <ArrowLeft
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          <span>Atrás</span>
                        </motion.button>

                        <motion.button
                          type="submit"
                          className="sm:w-2/3 p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                          disabled={isSubmitting}
                          aria-busy={isSubmitting}
                          {...animateOrNot({
                            whileHover: { scale: 1.02 },
                            whileTap: { scale: 0.98 },
                          })}
                        >
                          <span
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            aria-hidden="true"
                          />
                          {isSubmitting ? (
                            <>
                              <Loader2
                                className="animate-spin mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                              <span>Verificando respuesta…</span>
                            </>
                          ) : (
                            <>
                              <span>Verificar respuesta</span>
                              <ArrowRight
                                className="ml-2 h-5 w-5"
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </motion.button>
                      </div>

                      <div className="mt-6 text-center">
                        <p className="text-gray-700 dark:text-gray-300">
                          ¿Recordaste tu contraseña?{" "}
                          <Link
                            to="/login"
                            className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                          >
                            Iniciar sesión
                          </Link>
                        </p>
                      </div>
                    </motion.form>
                  )}

                  {/* STEP 3 */}
                  {currentStep === 3 && (
                    <motion.div
                      key="success-message"
                      {...animateOrNot({
                        initial: variants.in.initial,
                        animate: variants.in.animate,
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.25 },
                      })}
                      className="space-y-6 relative z-10"
                      aria-live="polite"
                    >
                      <Alert className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div
                            className="bg-green-100 dark:bg-green-800/50 p-3 rounded-full flex-shrink-0"
                            aria-hidden="true"
                          >
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <AlertTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
                              Correo enviado
                            </AlertTitle>
                            <AlertDescription className="text-gray-800 dark:text-gray-200">
                              <p>
                                Hemos enviado un correo electrónico a{" "}
                                <strong className="break-all">{email}</strong>{" "}
                                con instrucciones para restablecer tu
                                contraseña.
                              </p>
                              <p className="mt-2">
                                Revisa tu bandeja de entrada (y spam) y sigue
                                las instrucciones para completar el proceso.
                              </p>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200 flex items-start">
                        <Shield
                          className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-medium mb-1">
                            ¿No recibiste el correo?
                          </p>
                          <p>
                            Espera unos minutos y revisa spam. Si no llega,
                            solicita un nuevo correo desde la pantalla de inicio
                            de sesión.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-3 mt-6">
                        <Link
                          to="/login"
                          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                        >
                          <span
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            aria-hidden="true"
                          />
                          <span>Volver a iniciar sesión</span>
                          <ArrowRight
                            className="ml-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sello seguridad */}
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300">
                    <Shield
                      className="h-4 w-4 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <span>Tus datos están protegidos</span>
                  </div>
                </div>
              </section>
            </motion.div>
          </section>
        </div>
      </main>
    </>
  );
}
