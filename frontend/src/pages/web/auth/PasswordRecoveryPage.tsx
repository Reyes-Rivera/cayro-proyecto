"use client";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle,
  Shield,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Truck,
  Award,
  KeyRound,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { recoverPassword } from "@/api/auth";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import backgroundImage from "@/pages/web/Home/assets/hero.webp";
import { AlertHelper } from "@/utils/alert.util";

export default function PasswordRecoveryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Respeta preferencias del usuario (mejora perf + a11y)
  const prefersReducedMotion = useReducedMotion();
  const animateOrNot = (val: any) => (prefersReducedMotion ? {} : val);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<{ email: string }>({ defaultValues: { email: "" } });

  const email = watch("email");

  // Evita setTimeouts artificiales que empeoran LCP/TBT
  const [animateContent, setAnimateContent] = useState(false);
  useEffect(() => {
    // activamos animaciones inmediatamente (o no, según prefersReducedMotion)
    if (!prefersReducedMotion) setAnimateContent(true);
  }, [prefersReducedMotion]);

  const onSubmit = async (data: { email: string }) => {
    try {
      setIsSubmitting(true);
      const res = await recoverPassword({ email: data.email });

      if (res) {
        setIsSubmitted(true);
        AlertHelper.success({
          message: "Se ha enviado un correo con las instrucciones.",
          title: "Recuperación de contraseña",
          timer: 4000,
          animation: "slideIn",
        });
      } else {
        AlertHelper.error({
          message: "Por favor, inténtalo más tarde.",
          title: "Algo salió mal",
          timer: 5000,
          animation: "slideIn",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Error desconocido.";

      AlertHelper.error({
        message: errorMessage,
        title: "Error en la recuperación",
        timer: 5000,
        animation: "slideIn",
      });

      // Redirecciones de error
      const status = error?.response?.status;
      if (status === 400) setTimeout(() => navigate("/400"), 1200);
      if (status === 500) setTimeout(() => navigate("/500"), 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Saneamos entrada básica
    const value = e.target.value.replace(/[<>'"]/g, "");
    setValue("email", value, { shouldValidate: true });
    if (errors.email) clearErrors("email");
  };

  // Mejor scroll en móvil hacia el formulario
  const scrollToForm = () => {
    const el = document.getElementById("recovery-form");
    el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    (document.getElementById("email") as HTMLInputElement | null)?.focus();
  };

  // Variants memorizados para evitar recalcular en cada render
  const variants = useMemo(
    () => ({
      fadeInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
      },
      fadeInRight: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
      },
      pop: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
      },
      up: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
      upSmall: {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
      },
      in: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    }),
    []
  );

  return (
    <>
      {/* Skip link para lectores de pantalla/teclado */}
      <a
        href="#recovery-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-blue-700 text-white px-3 py-2 rounded-md z-50"
      >
        Saltar al formulario de recuperación
      </a>

      <main
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden mt-10"
        role="main"
      >
        {/* Decoraciones de fondo: no interactivas ni anunciables */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-600/5 to-transparent"></div>

          {/* Mantén el patrón pero no lo anuncies */}
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
          <section
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-center min-h-[70vh]"
            aria-labelledby="page-title"
          >
            {/* Columna izquierda */}
            <motion.div
              {...animateOrNot({
                initial: variants.fadeInLeft.initial,
                animate: animateContent ? variants.fadeInLeft.animate : {},
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
                  <KeyRound className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    RECUPERACIÓN DE CUENTA
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
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded"></span>
                  </span>
                </motion.h1>

                <motion.p
                  {...animateOrNot({
                    initial: { opacity: 0 },
                    animate: animateContent ? { opacity: 1 } : {},
                    transition: { duration: 0.5, delay: 0.25 },
                  })}
                  className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mt-4 md:mt-6 max-w-lg mx-auto lg:mx-0"
                >
                  No te preocupes, te ayudaremos a recuperar tu contraseña en
                  unos sencillos pasos.
                </motion.p>

                <motion.div
                  {...animateOrNot({
                    initial: { opacity: 0 },
                    animate: animateContent ? { opacity: 1 } : {},
                    transition: { duration: 0.5, delay: 0.3 },
                  })}
                  className="flex flex-wrap gap-4 md:gap-6 mt-6 md:mt-8 justify-center lg:justify-start"
                  aria-label="Beneficios del proceso"
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

                {/* Imagen solo en pantallas grandes: lazy y con sizes correctos */}
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
                      alt="Proceso seguro de recuperación de cuenta en Cayro Uniformes"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      sizes="(max-width: 1024px) 0px, 600px"
                    />
                    <figcaption className="sr-only">
                      Pantalla animada representando el proceso de recuperación.
                    </figcaption>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"
                      aria-hidden="true"
                    ></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-xs md:text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                        Recupera tu acceso
                      </span>
                      <h3 className="text-lg md:text-xl font-bold mt-2">
                        Proceso seguro
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

                {/* Indicador móvil para ir al formulario */}
                <motion.div
                  {...animateOrNot({
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.8, duration: 0.6 },
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
                      Recuperar contraseña
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
                initial: variants.fadeInRight.initial,
                animate: animateContent ? variants.fadeInRight.animate : {},
                transition: { duration: 0.6, delay: 0.1 },
              })}
              className="w-full lg:w-1/2 max-w-md"
            >
              <section
                className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                aria-label="Formulario de recuperación de contraseña"
              >
                {/* Decoración de fondo no interactiva */}
                <div
                  className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full"
                  aria-hidden="true"
                ></div>
                <div
                  className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full"
                  aria-hidden="true"
                ></div>

                <div className="text-center mb-6 sm:mb-8 relative z-10">
                  <motion.div
                    {...animateOrNot({
                      initial: variants.upSmall.initial,
                      animate: animateContent ? variants.upSmall.animate : {},
                      transition: { duration: 0.4, delay: 0.1 },
                    })}
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4"
                    aria-hidden="true"
                  >
                    <KeyRound className="w-7 h-7" />
                  </motion.div>
                  <motion.h2
                    {...animateOrNot({
                      initial: variants.upSmall.initial,
                      animate: animateContent ? variants.upSmall.animate : {},
                      transition: { duration: 0.4, delay: 0.15 },
                    })}
                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    Recuperar contraseña
                  </motion.h2>
                  <div
                    className="h-1 bg-blue-600 mx-auto mt-3"
                    style={{ width: "6rem" }}
                    aria-hidden="true"
                  ></div>
                </div>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="recovery-form"
                      {...animateOrNot({
                        initial: variants.in.initial,
                        animate: variants.in.animate,
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.25 },
                      })}
                      className="space-y-5 sm:space-y-6 relative z-10"
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                      aria-describedby="recovery-help"
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
                              errors.email ? "email-error" : "recovery-help"
                            }
                            {...register("email", {
                              required: "El correo electrónico es obligatorio",
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message:
                                  "Dirección de correo electrónico inválida",
                              },
                            })}
                            onChange={handleEmailChange}
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

                        {errors.email && (
                          <p
                            id="email-error"
                            className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle
                              className="h-3 w-3 flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="line-clamp-1">
                              {errors.email.message}
                            </span>
                          </p>
                        )}
                      </div>

                      <div
                        id="recovery-help"
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-900 dark:text-blue-200 flex items-start"
                        role="note"
                      >
                        <HelpCircle
                          className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-medium mb-1">
                            Información importante
                          </p>
                          <p>
                            Recibirás un correo con un enlace para crear una
                            nueva contraseña. Revisa también tu carpeta de spam.
                          </p>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        aria-live="polite"
                        {...animateOrNot({
                          whileHover: { scale: 1.02 },
                          whileTap: { scale: 0.98 },
                        })}
                      >
                        <span
                          className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                          aria-hidden="true"
                        ></span>
                        {isSubmitting ? (
                          <>
                            <Loader2
                              className="animate-spin mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            <span>Enviando instrucciones…</span>
                          </>
                        ) : (
                          <>
                            <span>Enviar instrucciones</span>
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
                            className="text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                          >
                            Inicia sesión
                          </Link>
                        </p>
                      </div>
                    </motion.form>
                  ) : (
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
                              Instrucciones enviadas
                            </AlertTitle>
                            <AlertDescription className="text-gray-800 dark:text-gray-200">
                              Hemos enviado las instrucciones para restablecer
                              tu contraseña a{" "}
                              <strong className="text-blue-700 dark:text-blue-300 break-all">
                                {email}
                              </strong>
                              .
                              <p className="mt-2">
                                Revisa tu bandeja de entrada y sigue los pasos
                                indicados.
                              </p>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>

                      <div className="flex flex-col items-center gap-3 mt-6">
                        <p className="text-gray-700 dark:text-gray-300">
                          ¿No recibiste el correo? Revisa tu carpeta de spam o
                        </p>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          {...animateOrNot({
                            whileHover: { scale: 1.02 },
                            whileTap: { scale: 0.98 },
                          })}
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          Intentar con otro correo
                        </button>
                        <Link
                          to="/login"
                          className="mt-2 inline-flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                        >
                          <ArrowLeft
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          Volver a iniciar sesión
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sello de seguridad */}
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
