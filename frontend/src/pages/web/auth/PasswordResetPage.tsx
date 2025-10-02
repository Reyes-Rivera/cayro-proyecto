"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  ArrowRight,
  KeyRound,
  Sparkles,
  Award,
  Truck,
} from "lucide-react";
import backgroundImage from "@/pages/web/Home/assets/hero.webp";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import type { User } from "@/types/User";
import { useNavigate, useParams, Link } from "react-router-dom";
import { restorePassword } from "@/api/auth";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertHelper } from "@/utils/alert.util";

export default function PasswordResetPage() {
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const animateOrNot = (val: any) => (prefersReducedMotion ? {} : val);
  const [animateContent, setAnimateContent] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion) setAnimateContent(true);
  }, [prefersReducedMotion]);

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<User>();

  const navigate = useNavigate();
  const { token } = useParams();

  // Validaciones de contraseña
  const containsSequentialPatterns = (pwd: string): boolean => {
    const commonPatterns = [
      "1234",
      "abcd",
      "qwerty",
      "password",
      "1111",
      "aaaa",
    ];
    const sequentialPatternRegex =
      /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef|defg|efgh|fghi)/;
    return (
      commonPatterns.some((p) => pwd.includes(p)) ||
      sequentialPatternRegex.test(pwd)
    );
  };

  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|]/.test(password),
      noSequential: !containsSequentialPatterns(password),
    };
    setPasswordChecks(checks);
    setPasswordStrength(Object.values(checks).filter(Boolean).length * 20);
  }, [password]);

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

  const onSubmit = handleSubmit(async (data: User) => {
    const allOk = Object.values(passwordChecks).every(Boolean);
    if (!allOk) {
      AlertHelper.error({
        message:
          "La contraseña no cumple con todos los requisitos de seguridad.",
        title: "Error de Contraseña",
        timer: 5000,
        animation: "slideIn",
      });
      return;
    }

    setIsLoading(true);
    try {
      await restorePassword(token, { password: data.password });
      setIsSubmitted(true);
      AlertHelper.success({
        message: "Tu contraseña ha sido restablecida correctamente.",
        title: "Contraseña actualizada",
        timer: 3500,
        animation: "slideIn",
      });
    } catch (error: any) {
      AlertHelper.error({
        message:
          error?.response?.data?.message ||
          "Ha ocurrido un error al restablecer la contraseña.",
        title: "Error de Contraseña",
        timer: 5000,
        animation: "slideIn",
      });
    } finally {
      setIsLoading(false);
    }
  });

  // Scroll a formulario en móvil
  const scrollToForm = () => {
    const el = document.getElementById("reset-form");
    el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    (document.getElementById("password") as HTMLInputElement | null)?.focus();
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

  // Helpers accesibles para fuerza
  const strengthLabel = getStrengthName(passwordStrength);
  const strengthColor = getStrengthColor(passwordStrength);

  return (
    <>
      {/* Skip link */}
      <a
        href="#reset-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-blue-700 text-white px-3 py-2 rounded-md z-50"
      >
        Saltar al formulario de restablecer contraseña
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
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-600/5 to-transparent" />
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
                  <KeyRound className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    NUEVA CONTRASEÑA
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
                  Restablece tu acceso a{" "}
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
                  Crea una nueva contraseña segura. Es el último paso para
                  recuperar tu cuenta.
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
                      alt="Último paso: crea tu nueva contraseña"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      sizes="(max-width: 1024px) 0px, 600px"
                    />
                    <figcaption className="sr-only">
                      Último paso para recuperar la cuenta.
                    </figcaption>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"
                      aria-hidden="true"
                    />
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-xs md:text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                        Último paso
                      </span>
                      <h3 className="text-lg md:text-xl font-bold mt-2">
                        Crea tu nueva contraseña
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
                          Último paso
                        </span>
                      </div>
                    </motion.div>
                  </figure>
                </motion.div>

                {/* CTA móvil */}
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
                    aria-label={
                      isSubmitted
                        ? "Ver confirmación"
                        : "Crear nueva contraseña"
                    }
                  >
                    <span className="text-sm font-medium">
                      {!isSubmitted
                        ? "Crear nueva contraseña"
                        : "Ver confirmación"}
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700">
                      <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </button>
                </motion.div>
              </header>
            </motion.div>

            {/* Columna derecha - Formulario */}
            <motion.div
              id="reset-form"
              {...animateOrNot({
                initial: variants.right.initial,
                animate: animateContent ? variants.right.animate : {},
                transition: { duration: 0.6, delay: 0.1 },
              })}
              className="w-full lg:w-1/2 max-w-md"
            >
              <section
                className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                aria-label="Formulario para restablecer contraseña"
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
                    {!isSubmitted ? (
                      <KeyRound className="w-7 h-7" />
                    ) : (
                      <CheckCircle className="w-7 h-7" />
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {!isSubmitted
                      ? "Crear nueva contraseña"
                      : "Contraseña actualizada"}
                  </h2>
                  <div
                    className="h-1 bg-blue-600 mx-auto mt-3"
                    style={{ width: "6rem" }}
                    aria-hidden="true"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="reset-form"
                      {...animateOrNot({
                        initial: variants.in.initial,
                        animate: variants.in.animate,
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.25 },
                      })}
                      className="space-y-6 relative z-10"
                      onSubmit={onSubmit}
                      noValidate
                    >
                      {/* Nueva contraseña */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Lock
                            className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          />
                          Nueva contraseña
                        </Label>
                        <div className="relative">
                          <input
                            {...register("password", {
                              required: "La contraseña es requerida",
                              pattern: {
                                value:
                                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?:{}|])(?!.*[<>]).{8,}$/,
                                message:
                                  "Incluye mayúsculas, minúsculas, número y un carácter especial",
                              },
                              onChange: (e) => {
                                const clean = e.target.value; // ya protegida por regex
                                e.target.value = clean;
                                setValue("password", clean, {
                                  shouldValidate: true,
                                });
                                setPassword(clean);
                                if (errors.password) clearErrors("password");
                                if (errors.confirmPassword)
                                  clearErrors("confirmPassword");
                              },
                            })}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            autoComplete="new-password"
                            className={`block w-full rounded-lg border ${
                              errors.password
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors outline-none`}
                            placeholder="••••••••"
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={
                              errors.password
                                ? "password-error"
                                : "password-help"
                            }
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-pressed={showPassword}
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            tabIndex={0}
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                        {errors.password ? (
                          <p
                            id="password-error"
                            className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {errors.password.message}
                          </p>
                        ) : (
                          <p id="password-help" className="sr-only">
                            La contraseña debe tener 8+ caracteres, mayúsculas,
                            minúsculas, número y carácter especial.
                          </p>
                        )}

                        {/* Indicador de fortaleza */}
                        {password && (
                          <div
                            className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                            aria-live="polite"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <Shield
                                  className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                                  aria-hidden="true"
                                />
                                Fortaleza de la contraseña:
                              </span>
                              <span
                                className={`text-sm font-medium ${strengthColor.replace(
                                  "bg-",
                                  "text-"
                                )}`}
                              >
                                {strengthLabel}
                              </span>
                            </div>
                            <div
                              className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700"
                              role="progressbar"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={passwordStrength}
                              aria-valuetext={`Fortaleza ${strengthLabel}`}
                            >
                              <div
                                className={`h-full rounded-full ${strengthColor}`}
                                style={{ width: `${passwordStrength}%` }}
                              />
                            </div>

                            <ul className="mt-3 space-y-2 text-sm">
                              {Object.entries(passwordChecks).map(
                                ([key, isValid]) => {
                                  const labels: Record<string, string> = {
                                    length: "Mínimo 8 caracteres",
                                    uppercase: "Al menos una mayúscula",
                                    lowercase: "Al menos una minúscula",
                                    number: "Al menos un número",
                                    special:
                                      'Al menos un carácter especial (!@#$%^&*(),.?":{}|)',
                                    noSequential:
                                      'Sin secuencias obvias como "12345" o "abcd"',
                                  };
                                  return (
                                    <li
                                      key={key}
                                      className={`flex items-start ${
                                        isValid
                                          ? "text-green-600 dark:text-green-400"
                                          : "text-gray-600 dark:text-gray-400"
                                      }`}
                                    >
                                      <div
                                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                          isValid
                                            ? "bg-green-100 dark:bg-green-900/30"
                                            : "bg-gray-100 dark:bg-gray-700"
                                        }`}
                                        aria-hidden="true"
                                      >
                                        {isValid ? (
                                          <Check className="w-3 h-3" />
                                        ) : null}
                                      </div>
                                      {labels[key]}
                                    </li>
                                  );
                                }
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Confirmar contraseña */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="password-confirm"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Lock
                            className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          />
                          Confirmar contraseña
                        </Label>
                        <div className="relative">
                          <input
                            {...register("confirmPassword" as keyof User, {
                              required:
                                "La confirmación de la contraseña es requerida",
                              validate: (value) =>
                                value === getValues("password") ||
                                "Las contraseñas no coinciden",
                              onChange: (e) => {
                                const clean = e.target.value;
                                e.target.value = clean;
                                setValue(
                                  "confirmPassword" as keyof User,
                                  clean as any,
                                  { shouldValidate: true }
                                );
                                if (errors.confirmPassword)
                                  clearErrors("confirmPassword");
                              },
                            })}
                            id="password-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className={`block w-full rounded-lg border ${
                              errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors outline-none`}
                            placeholder="••••••••"
                            aria-invalid={Boolean(errors.confirmPassword)}
                            aria-describedby={
                              errors.confirmPassword
                                ? "confirm-error"
                                : undefined
                            }
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                            onClick={() => setShowConfirmPassword((s) => !s)}
                            aria-pressed={showConfirmPassword}
                            aria-label={
                              showConfirmPassword
                                ? "Ocultar confirmación"
                                : "Mostrar confirmación"
                            }
                            tabIndex={0}
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p
                            id="confirm-error"
                            className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                            role="alert"
                          >
                            <AlertCircle
                              className="h-3 w-3"
                              aria-hidden="true"
                            />
                            {String(errors.confirmPassword.message)}
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
                            Crea una contraseña segura y única que no utilices
                            en otros sitios web.
                          </p>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                        disabled={isLoading}
                        aria-busy={isLoading}
                        {...animateOrNot({
                          whileHover: { scale: 1.02 },
                          whileTap: { scale: 0.98 },
                        })}
                      >
                        <span
                          className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                          aria-hidden="true"
                        />
                        {isLoading ? (
                          <>
                            <Loader2
                              className="animate-spin mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            <span>Procesando…</span>
                          </>
                        ) : (
                          <>
                            <span>Restablecer contraseña</span>
                            <ArrowRight
                              className="ml-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </motion.button>

                      {/* Enlace a login */}
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
                              Contraseña restablecida con éxito
                            </AlertTitle>
                            <AlertDescription className="text-gray-800 dark:text-gray-200">
                              <p>
                                Tu nueva contraseña ha sido configurada
                                correctamente.
                              </p>
                              <p className="mt-2">
                                Ahora puedes iniciar sesión con tu nueva
                                contraseña.
                              </p>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>

                      <div className="flex flex-col items-center gap-3 mt-6">
                        <motion.button
                          onClick={() => navigate("/login")}
                          className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                          {...animateOrNot({
                            whileHover: { scale: 1.03 },
                            whileTap: { scale: 0.97 },
                          })}
                        >
                          <span
                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                            aria-hidden="true"
                          />
                          <span>Ir a iniciar sesión</span>
                          <ArrowRight
                            className="ml-2 h-5 w-5"
                            aria-hidden="true"
                          />
                        </motion.button>
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
