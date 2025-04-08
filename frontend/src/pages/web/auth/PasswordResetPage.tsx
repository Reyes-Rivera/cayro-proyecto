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
} from "lucide-react";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import type { User } from "@/types/User";
import { useNavigate, useParams, Link } from "react-router-dom";
import { restorePassword } from "@/api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<User>();

  const navigate = useNavigate();
  const { token } = useParams();

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
          Swal.fire({
            icon: "success",
            title: "Contraseña actualizada",
            text: "Tu contraseña ha sido restablecida correctamente.",
            confirmButtonColor: "#3B82F6",
            iconColor: "#10B981",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error de Contraseña",
          text:
            error?.response?.data?.message ||
            "Ha ocurrido un error al restablecer la contraseña.",
          confirmButtonColor: "#3B82F6",
          iconColor: "#EF4444",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        navigate("/recuperar-password");
      } finally {
        setIsLoading(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error de Contraseña",
        text: "La contraseña no cumple con todos los requisitos de seguridad.",
        confirmButtonColor: "#3B82F6",
        iconColor: "#EF4444",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
    }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Columna izquierda - Contenido */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24"
        >
          <div className="max-w-xl w-full">
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
              >
                <KeyRound className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  NUEVA CONTRASEÑA
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
              >
                Restablece tu <span className="text-blue-600">contraseña</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              >
                Crea una nueva contraseña segura para tu cuenta en Cayro
                Uniformes.
              </motion.p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
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
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.password.message}
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
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start">
                    <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium mb-1">Información importante</p>
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
                  className="space-y-6"
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
                            Ahora puedes iniciar sesión con tu nueva contraseña.
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

        {/* Columna derecha - Imágenes */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full md:w-1/2 bg-blue-50 dark:bg-blue-900/10 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70 z-0"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-70 z-0"></div>

          {/* Main content container */}
          <div className="relative h-full flex flex-col justify-center items-center p-8 z-10">
            {/* Main featured image */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative z-20 rounded-2xl overflow-hidden shadow-2xl max-w-md w-full mb-8"
            >
              <img
                src={backgroundImage || "/placeholder.svg?height=400&width=600"}
                alt="Cayro Uniformes"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                  Último paso
                </span>
                <h3 className="text-xl font-bold mt-2">
                  Crea tu nueva contraseña
                </h3>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 gap-4 max-w-md w-full"
            >
              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Seguridad
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contraseña cifrada y segura
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Sencillo
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Proceso rápido y fácil
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Acceso
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recupera tu cuenta al instante
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Verificado
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Identidad confirmada
                </p>
              </motion.div>
            </motion.div>

            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute top-8 right-8 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-2 z-30"
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
      </div>
    </div>
  );
}
