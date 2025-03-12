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
} from "lucide-react";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import type { User } from "@/types/User";
import { useNavigate, useParams } from "react-router-dom";
import { restorePassword } from "@/api/auth";
import { motion } from "framer-motion";

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
          Swal.fire({
            icon: "success",
            title: "Contraseña actualizada.",
            text: "Tu contraseña ha sido restablecida, por favor inicie sesión.",
            confirmButtonColor: "#3B82F6",
            iconColor: "#10B981",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
          });
          navigate("/login");
          setIsSubmitted(true);
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error de Contraseña.",
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
    <div className="min-h-screen flex-col flex items-center justify-center dark:bg-gray-900 pt-20">
      <div className="w-full flex  overflow-hidden">
        {/* Columna izquierda - Imagen de fondo */}
        <div
          className="hidden h-[700px] justify-center items-center md:flex md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>

          {/* Contenido de la columna izquierda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 p-10 text-white max-w-xl"
          >
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Recupera tu acceso a{" "}
              <span className="text-blue-100">Cayro Uniformes</span>
            </h2>
            <p className="text-lg mb-10 text-blue-50">
              No te preocupes, te ayudaremos a recuperar tu contraseña en unos
              sencillos pasos.
            </p>

            {/* Características destacadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full shadow-lg transform transition-transform hover:scale-110">
                  <Check size={32} className="text-white" />
                </div>
                <p className="mt-4 text-sm text-white font-medium">
                  Proceso sencillo
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-green-400 to-green-600 rounded-full shadow-lg transform transition-transform hover:scale-110">
                  <Lock size={32} className="text-white" />
                </div>
                <p className="mt-4 text-sm text-white font-medium">
                  Seguridad garantizada
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full shadow-lg transform transition-transform hover:scale-110">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <p className="mt-4 text-sm text-white font-medium">
                  Acceso inmediato
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Columna derecha - Formulario */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center md:mt-12 w-full md:w-1/2 bg-white dark:bg-gray-900"
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Restablecer contraseña
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Crea una nueva contraseña para tu cuenta
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <Lock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Contraseña
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
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                          value === password || "Las contraseñas no coinciden",
                      })}
                      id="password-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`block w-full rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
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

                <button
                  type="submit"
                  className="w-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <span>Restablecer contraseña</span>
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Contraseña restablecida con éxito
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Tu nueva contraseña ha sido configurada. Ahora puedes iniciar
                  sesión con tu nueva contraseña.
                </p>
                <button
                  className="mt-6 w-full px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center"
                  onClick={() => navigate("/login")}
                >
                  <span>Ir al inicio de sesión</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
