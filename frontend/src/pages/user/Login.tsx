"use client";

import { resendCodeApi } from "@/api/auth";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContextType";
import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
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
  RefreshCw,
  Star,
  Truck,
} from "lucide-react";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      Swal.fire({
        icon: "error",
        title: "Error en el envío",
        text: "Por favor, verifica que no eres un robot",
        confirmButtonColor: "#3B82F6",
        iconColor: "#EF4444",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(data.identifier, data.password);
      console.log(res);
      Swal.fire({
        icon: "success",
        title: "¡Verificación Exitosa!",
        toast: true,
        text: "Credenciales validas. Serás redirigido en breve.",
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        animation: true,
        background: "#F0FDF4",
        color: "#166534",
        iconColor: "#22C55E", // Ícono verde
      });
      if (res?.role === "USER" && res.active === false) {
        setIsLoading(true);
        localStorage.setItem("emailToVerify", res.email);
        localStorage.setItem("isVerificationPending", "true");
        await resendCodeApi({ email: res.email });
        setEmailToVerify(res.email);
        setIsVerificationPending(true);
        navigate("/codigo-verificacion");
        return;
      }
      console.log(res);
      setIsLoading(false);
      if (res?.role === "ADMIN") {
        navigate("/perfil-admin");
      } else if (res?.role === "USER") {
        navigate("/perfil-usuario");
      } else if (res?.role === "EMPLOYEE") {
        navigate("/perfil-empleado");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido al iniciar sesión.";
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
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

  const handleRecoveryMethod = (method: "email" | "question") => {
    setShowRecoveryDialog(false);
    if (method === "email") {
      navigate("/recuperar-password");
    } else {
      navigate("/recuperar-password-pregunta");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Loading Screen */}
      {pageLoading && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Cargando...
          </p>
        </div>
      )}
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Columna izquierda - Contenido */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={
            animateContent ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
          }
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
                <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  ÁREA DE CLIENTES
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
              >
                Bienvenido a{" "}
                <span className="text-blue-600">Cayro Uniformes</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              >
                Accede a tu cuenta para gestionar tus pedidos, ver tu historial
                de compras y mucho más.
              </motion.p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                  {errors.identifier && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.identifier && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.identifier.message}
                  </p>
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
                <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 p-4 rounded-lg text-sm flex items-start">
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
                </div>
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

        {/* Columna derecha - Imágenes */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={
            animateContent ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
          }
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
                  Uniformes de calidad
                </span>
                <h3 className="text-xl font-bold mt-2">Colección exclusiva</h3>
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
                  Tus datos siempre protegidos con nosotros
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Star className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Calidad
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Materiales premium en todos nuestros productos
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Envío rápido
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Entrega garantizada en tiempo y forma
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Devoluciones
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Política de cambios flexible para tu tranquilidad
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
                  Acceso exclusivo
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
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
