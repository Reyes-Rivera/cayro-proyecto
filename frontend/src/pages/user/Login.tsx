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
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
  Mail,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { login, error, errorTimer } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [lockoutTime, setLockoutTime] = useState(0);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
      const res = await login(data.email, data.password);
      if (res) {
        if (res?.role === "USER" && res.active === false) {
          setIsLoading(true);
          await resendCodeApi({ email: res.email });
          navigate("/codigo-verificacion");
        } else {
          navigate("/codigo-verificacion-auth");
        }
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 pt-14">
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Columna izquierda - Imagen de fondo */}
        <div
          className="hidden h-screen justify-center items-center md:flex md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Overlay oscuro con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>

          {/* Contenido de la columna izquierda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 p-10 text-white max-w-xl"
          >
            <div className="text-white [&_*]:!text-white flex justify-center mb-8">
              <Breadcrumbs />
            </div>
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Bienvenido a{" "}
              <span className="text-blue-100">Cayro Uniformes</span>
            </h2>
            <p className="text-lg mb-10 text-blue-50">
              Accede a tu cuenta para gestionar tus pedidos, ver tu historial de
              compras y mucho más.
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
                  Pedidos rápidos
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
                  <User size={32} className="text-white" />
                </div>
                <p className="mt-4 text-sm text-white font-medium">
                  Gestión personalizada
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Columna derecha - Formulario de login */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 lg:p-16 bg-white dark:bg-gray-900"
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Iniciar sesión
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo de correo electrónico */}
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
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                    {...register("email", {
                      required: "El correo electrónico es obligatorio",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Dirección de correo electrónico inválida",
                      },
                    })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[<>='" ]/g, "");
                      e.target.value = value;
                    }}
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
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
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
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
                    })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[<>='" ]/g, "");
                      e.target.value = value;
                    }}
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
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </p>
                )}
                <div className="flex justify-end">
                  <NavLink
                    to="/recuperar-password"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </NavLink>
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
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={lockoutTime > 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar sesión</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>

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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
