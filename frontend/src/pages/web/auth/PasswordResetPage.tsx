"use client";

import { useEffect, useState } from "react";
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
import backgroundImage from "@/pages/web/Home/assets/hero.jpg";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import type { User } from "@/types/User";
import { useNavigate, useParams, Link } from "react-router-dom";
import { restorePassword } from "@/api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Loader from "@/components/web-components/Loader";
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
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<User>();

  const navigate = useNavigate();
  const { token } = useParams();

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
      // Activate animations after loading screen disappears
      setTimeout(() => {
        setAnimateContent(true);
      }, 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef|defg|efgh|fghi)/;

    return (
      commonPatterns.some((pattern) => password.includes(pattern)) ||
      sequentialPatternRegex.test(password)
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

  const onSubmit = handleSubmit(async (data: User) => {
    if (Object.values(passwordChecks).every(Boolean)) {
      setIsLoading(true);
      try {
        const res = await restorePassword(token, { password: data.password });
        if (res) {
          setIsSubmitted(true);
          AlertHelper.success({
            message: "Tu contraseña ha sido restablecida correctamente.",
            title: "Contraseña actualizada",
            timer: 4000,
            animation: "slideIn",
          });
          return;
        }
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
    } else {
      AlertHelper.error({
        message:
          "La contraseña no cumple con todos los requisitos de seguridad.",
        title: "Error de Contraseña",
        timer: 5000,
        animation: "slideIn",
      });
      return;
    }
  });

  // Scroll to form on mobile
  const scrollToForm = () => {
    const formElement = document.getElementById("reset-form");
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
                <KeyRound className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  NUEVA CONTRASEÑA
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={
                  animateContent ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
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
                initial={{ opacity: 0 }}
                animate={animateContent ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mt-6 max-w-lg mx-auto lg:mx-0"
              >
                Crea una nueva contraseña segura para tu cuenta en Cayro
                Uniformes. Este es el último paso para recuperar el acceso a tu
                cuenta.
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
                      Último paso
                    </span>
                    <h3 className="text-xl font-bold mt-2">
                      Crea tu nueva contraseña
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
                        Último paso
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
                    {!isSubmitted
                      ? "Crear nueva contraseña"
                      : "Ver confirmación"}
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
                    <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Reset Form */}
          <motion.div
            id="reset-form"
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
                  {!isSubmitted ? (
                    <KeyRound className="w-8 h-8" />
                  ) : (
                    <CheckCircle className="w-8 h-8" />
                  )}
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
                  {!isSubmitted
                    ? "Crear nueva contraseña"
                    : "Contraseña actualizada"}
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={animateContent ? { width: "6rem" } : { width: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="h-1 bg-blue-600 mx-auto mt-4"
                ></motion.div>
              </div>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="reset-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative z-10"
                    onSubmit={onSubmit}
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
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
                                "Introduce caracteres especiales como !@#$%^&*(),.?:{}|",
                            },
                          })}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            clearErrors("password");
                            clearErrors("confirmPassword");
                          }}
                          autoComplete="new-password"
                          className={`block w-full rounded-lg border ${
                            errors.password
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                          placeholder="••••••••"
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
                      {errors.password && (
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {errors.password.message}
                          </span>
                        </p>
                      )}

                      {!Object.values(passwordChecks).every(Boolean) &&
                        password && (
                          <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <Shield className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                                Fortaleza de la contraseña:
                              </span>
                              <span
                                className={`text-sm font-medium ${getStrengthColor(
                                  passwordStrength
                                ).replace("bg-", "text-")}`}
                              >
                                {getStrengthName(passwordStrength)}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                              <div
                                className={`h-full rounded-full ${getStrengthColor(
                                  passwordStrength
                                )}`}
                                style={{ width: `${passwordStrength}%` }}
                              ></div>
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
                                          : "text-gray-500 dark:text-gray-400"
                                      }`}
                                    >
                                      <div
                                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                          isValid
                                            ? "bg-green-100 dark:bg-green-900/30"
                                            : "bg-gray-100 dark:bg-gray-700"
                                        }`}
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

                    {/* Confirmar Contraseña */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password-confirm"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Confirmar contraseña
                      </Label>
                      <div className="relative">
                        <input
                          {...register("confirmPassword", {
                            required:
                              "La confirmación de la contraseña es requerida",
                            validate: (value) =>
                              value === password ||
                              "Las contraseñas no coinciden",
                          })}
                          id="password-confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          className={`block w-full rounded-lg border ${
                            errors.confirmPassword
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                          placeholder="••••••••"
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
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {errors.confirmPassword.message}
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
                          Crea una contraseña segura y única que no utilices en
                          otros sitios web.
                        </p>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button background animation */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <span>Restablecer contraseña</span>
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
                  </motion.form>
                ) : (
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
                            Contraseña restablecida con éxito
                          </AlertTitle>
                          <AlertDescription className="text-gray-700 dark:text-gray-300">
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

                    <div className="flex flex-col items-center gap-4 mt-8">
                      <motion.button
                        onClick={() => navigate("/login")}
                        className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 relative overflow-hidden group"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        <span>Ir a iniciar sesión</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
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
