"use client";
import { resendCodeApi } from "@/api/auth";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContextType";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  Mail,
  AlertCircle,
  ArrowRight,
  KeyRound,
  HelpCircle,
  X,
  Shield,
  Sparkles,
  Truck,
  Award,
  ChevronDown,
} from "lucide-react";
import backgroundImage from "@/pages/web/Home/assets/hero.jpg";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

// Modificar el tipo FormData para eliminar loginType
type FormData = {
  identifier: string;
  password: string;
};

// Actualizar el componente LoginPage para detectar automáticamente el tipo de identificador
export default function LoginPage() {
  const {
    login,
    error,
    errorTimer,
    setEmailToVerify,
    setIsVerificationPending,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

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
    if (error === "Error desconocido al iniciar sesión.") {
      navigate("/500", { state: { fromError: true } });
    }
    let timer: NodeJS.Timeout;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime, error, navigate]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const onSubmit = async (data: FormData) => {
    if (!captchaToken) {
      AlertHelper.error({
        message: "Por favor, verifica que no eres un robot",
        title: "Verificación requerida",
        isModal: true,
        animation: "bounce",
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await login(data.identifier, data.password);
      if (res?.role === "USER" && res.active === false) {
        AlertHelper.error({
          message:
            "Tu cuenta ha sido desactivada. Por favor, contacta a tu administrador.",
          title: "Cuenta desactivada",
          animation: "slideIn",
          timer: 6000,
        });

        localStorage.setItem("emailToVerify", res.email);
        localStorage.setItem("isVerificationPending", "true");
        await resendCodeApi({ email: res.email });
        setEmailToVerify(res.email);
        setIsVerificationPending(true);
        navigate("/codigo-verificacion");
        return;
      }
      AlertHelper.success({
        message: "¡Bienvenido de vuelta! Redirigiendo...",
        title: "Inicio de sesión exitoso",
        timer: 2000,
        animation: "slideIn",
      });
      setTimeout(() => {
        if (res?.role === "ADMIN") {
          navigate("/perfil-admin");
        } else if (res?.role === "USER") {
          navigate("/perfil-usuario");
        } else if (res?.role === "EMPLOYEE") {
          navigate("/perfil-empleado");
        }
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido al iniciar sesión.";
      if (errorMessage.includes("credenciales")) {
        AlertHelper.error({
          message:
            "Las credenciales proporcionadas no son válidas. Verifica tu correo/teléfono y contraseña.",
          title: "Credenciales incorrectas",
          animation: "slideIn",
          timer: 5000,
        });
      } else if (
        errorMessage.includes("bloqueada") ||
        errorMessage.includes("bloqueado")
      ) {
        AlertHelper.warning({
          message: errorMessage,
          title: "Cuenta temporalmente bloqueada",
          animation: "slideIn",
          timer: 6000,
        });
      } else if (
        errorMessage.includes("verificar") ||
        errorMessage.includes("verificación")
      ) {
        AlertHelper.info({
          message:
            "Tu cuenta necesita ser verificada. Revisa tu correo electrónico.",
          title: "Verificación pendiente",
          animation: "slideIn",
          timer: 5000,
        });
      } else {
        AlertHelper.error({
          message: errorMessage,
          title: "Error al iniciar sesión",
          animation: "slideIn",
          timer: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorTimer.includes("Cuenta bloqueada temporalmente")) {
      const timeMatch = errorTimer.match(/(\d+) minutos? y (\d+) segundos/);
      const timeMatch2 = errorTimer.match(/(\d+) segundos/);
      if (timeMatch) {
        const minutes = Number.parseInt(timeMatch[1], 10);
        const seconds = Number.parseInt(timeMatch[2], 10);
        setLockoutTime(minutes * 60 + seconds);
      } else if (timeMatch2) {
        const seconds = Number.parseInt(timeMatch2[1], 10);
        setLockoutTime(seconds);
      }
    }
  }, [errorTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleRecoveryMethod = async (method: "email" | "question") => {
    setShowRecoveryDialog(false);

    // Mostrar confirmación antes de proceder
    const confirmed = await AlertHelper.confirm({
      title: "Recuperación de contraseña",
      message:
        method === "email"
          ? "Se enviará un enlace de recuperación a tu correo electrónico registrado."
          : "Serás redirigido para responder tu pregunta de seguridad.",
      confirmText: "Continuar",
      cancelText: "Cancelar",
      type: "question",
      animation: "bounce",
    });

    if (confirmed) {
      AlertHelper.info({
        message:
          method === "email"
            ? "Redirigiendo al formulario de recuperación por correo..."
            : "Redirigiendo al formulario de pregunta secreta...",
        timer: 2000,
        animation: "slideIn",
      });

      setTimeout(() => {
        if (method === "email") {
          navigate("/recuperar-password");
        } else {
          navigate("/recuperar-password-pregunta");
        }
      }, 1500);
    }
  };

  // Scroll to form on mobile
  const scrollToForm = () => {
    const formElement = document.getElementById("login-form");
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
                <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  ÁREA DE CLIENTES
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
                Bienvenido a{" "}
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
                Accede a tu cuenta para gestionar tus pedidos, ver tu historial
                de compras y disfrutar de una experiencia personalizada.
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
                    Calidad premium
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    Envío rápido
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
                    alt="Cayro Uniformes"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                      Uniformes de calidad
                    </span>
                    <h3 className="text-xl font-bold mt-2">
                      Colección exclusiva
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
                        Acceso exclusivo
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
                    Iniciar sesión
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

          {/* Right column - Login Form */}
          <motion.div
            id="login-form"
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
                  <User className="w-8 h-8" />
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
                  Iniciar sesión
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={animateContent ? { width: "6rem" } : { width: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="h-1 bg-blue-600 mx-auto mt-4"
                ></motion.div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 relative z-10"
              >
                {/* Campo unificado para correo o teléfono */}
                <div className="space-y-2">
                  <Label
                    htmlFor="identifier"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Correo electrónico o teléfono
                  </Label>
                  <div className="relative">
                    <input
                      id="identifier"
                      type="text"
                      autoComplete="username"
                      placeholder="correo@ejemplo.com o +52 123 456 7890"
                      className={`block w-full rounded-lg border ${
                        errors.identifier
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                      {...register("identifier", {
                        required:
                          "El correo electrónico o teléfono es obligatorio",
                        validate: (value) => {
                          // Validar si es un email o un teléfono
                          const emailRegex =
                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                          const phoneRegex = /^\+?[0-9]{10,15}$/;
                          if (
                            emailRegex.test(value) ||
                            phoneRegex.test(value.replace(/\s/g, ""))
                          ) {
                            return true;
                          }
                          return "Ingrese un correo electrónico o número de teléfono válido";
                        },
                        onChange: (e) => {
                          let value = e.target.value;
                          // Permitir caracteres válidos para email y teléfono
                          // Para email: letras, números, @, ., _, -, +, %
                          // Para teléfono: números, +, espacios
                          value = value.replace(/[<>='"]/g, "");
                          e.target.value = value;
                          // Validar en tiempo real
                          const emailRegex =
                            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                          const phoneRegex = /^\+?[0-9]{10,15}$/;
                          if (
                            emailRegex.test(value) ||
                            phoneRegex.test(value.replace(/\s/g, ""))
                          ) {
                            clearErrors("identifier");
                          }
                        },
                      })}
                    />
                    {errors.identifier ? (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {errors.identifier && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {errors.identifier.message}
                    </motion.p>
                  )}
                </div>

                {/* Campo de contraseña */}
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
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`block w-full rounded-lg border ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                          value: 6,
                          message:
                            "La contraseña debe tener al menos 6 caracteres",
                        },
                        pattern: {
                          value: /^[^<>='" ]+$/,
                          message:
                            "La contraseña no puede contener <, >, =, ', \", o espacios",
                        },
                        onChange: (e) => {
                          const value = e.target.value.replace(/[<>='" ]/g, "");
                          e.target.value = value;
                          if (value.length >= 6 && /^[^<>='" ]+$/.test(value)) {
                            clearErrors("password");
                          }
                        },
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                      {errors.password.message}
                    </motion.p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowRecoveryDialog(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                {/* Mensaje de bloqueo temporal */}
                {lockoutTime > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 p-4 rounded-lg text-sm flex items-start"
                  >
                    <Lock className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        Cuenta bloqueada temporalmente
                      </p>
                      <p>
                        Por seguridad, inténtalo nuevamente en{" "}
                        <span className="font-bold">
                          {formatTime(lockoutTime)}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ReCAPTCHA */}
                <div className="flex justify-center my-6">
                  <ReCAPTCHA
                    sitekey="6Lc_k2MqAAAAAB19xvWE6_otNt4WRJBDfJpeo-EC"
                    onChange={handleCaptchaChange}
                    theme={
                      document.documentElement.classList.contains("dark")
                        ? "dark"
                        : "light"
                    }
                  />
                </div>

                {/* Botón de inicio de sesión */}
                <motion.button
                  type="submit"
                  className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group"
                  disabled={lockoutTime > 0 || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button background animation */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                {/* Enlace de registro */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    ¿No tienes una cuenta?{" "}
                    <NavLink
                      to="/registro"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Regístrate ahora
                    </NavLink>
                  </p>
                </div>

                {/* Security badge */}
                <motion.div
                  className="mt-8 flex justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-600 dark:text-gray-400">
                    <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Tus datos están protegidos</span>
                  </div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Diálogo de selección de método de recuperación */}
      <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Recuperación de contraseña
            </DialogTitle>
            <DialogDescription>
              Selecciona el método que prefieres para recuperar tu contraseña
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <motion.button
              onClick={() => handleRecoveryMethod("email")}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Por correo electrónico
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recibe un enlace para restablecer tu contraseña
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </motion.button>
            <motion.button
              onClick={() => handleRecoveryMethod("question")}
              className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Por pregunta secreta
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Responde tu pregunta de seguridad
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </motion.button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowRecoveryDialog(false)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Cancelar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
