"use client";
import { resendCodeApi } from "@/api/auth";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContextType";
import { useEffect, useMemo, useRef, useState } from "react";
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
import backgroundImage from "@/pages/web/Home/assets/hero.webp";
import { useForm } from "react-hook-form";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertHelper } from "@/utils/alert.util";

type FormData = { identifier: string; password: string };

export default function LoginPage() {
  const {
    login,
    error,
    errorTimer,
    setEmailToVerify,
    setIsVerificationPending,
  } = useAuth();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);

  // Respeta preferencias del usuario (mejora perf + accesibilidad)
  const prefersReducedMotion = useReducedMotion();
  const animateOrNot = (val: any) => (prefersReducedMotion ? {} : val);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm<FormData>({
    defaultValues: { identifier: "", password: "" },
  });

  // Activar animaciones sólo si no hay reduced motion
  const [animateContent, setAnimateContent] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion) setAnimateContent(true);
  }, [prefersReducedMotion]);

  // Manejo de errores globales y temporizador de bloqueo
  useEffect(() => {
    if (error === "Error desconocido al iniciar sesión.") {
      navigate("/500", { state: { fromError: true } });
    }
  }, [error, navigate]);

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

  useEffect(() => {
    if (lockoutTime <= 0) return;
    const t = setInterval(() => setLockoutTime((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [lockoutTime]);

  const handleCaptchaChange = (token: string | null) => setCaptchaToken(token);

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
        timer: 1800,
        animation: "slideIn",
      });

      setTimeout(() => {
        if (res?.role === "ADMIN") navigate("/perfil-admin");
        else if (res?.role === "USER") navigate("/perfil-usuario");
        else if (res?.role === "EMPLOYEE") navigate("/perfil-empleado");
      }, 1200);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Error desconocido al iniciar sesión.";

      if (/credenciales/i.test(errorMessage)) {
        AlertHelper.error({
          message:
            "Las credenciales proporcionadas no son válidas. Verifica tu correo/teléfono y contraseña.",
          title: "Credenciales incorrectas",
          animation: "slideIn",
          timer: 5000,
        });
      } else if (/bloquead[oa]/i.test(errorMessage)) {
        AlertHelper.warning({
          message: errorMessage,
          title: "Cuenta temporalmente bloqueada",
          animation: "slideIn",
          timer: 6000,
        });
      } else if (/verificaci[óo]n|verificar/i.test(errorMessage)) {
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleRecoveryMethod = async (method: "email" | "question") => {
    setShowRecoveryDialog(false);
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

    if (!confirmed) return;

    AlertHelper.info({
      message:
        method === "email"
          ? "Abriendo recuperación por correo…"
          : "Abriendo recuperación por pregunta secreta…",
      timer: 1500,
      animation: "slideIn",
    });

    setTimeout(() => {
      navigate(
        method === "email"
          ? "/recuperar-password"
          : "/recuperar-password-pregunta"
      );
    }, 1000);
  };

  // Scroll a formulario en móvil y foco al primer campo
  const scrollToForm = () => {
    const el = document.getElementById("login-form");
    el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    (document.getElementById("identifier") as HTMLInputElement | null)?.focus();
  };

  // Variants memorizados para no recalcular en cada render
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

  // Tema del captcha sin tocar el render (mejor a11y/perf)
  const [captchaTheme, setCaptchaTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setCaptchaTheme(isDark ? "dark" : "light");
  }, []);

  // Ref para captcha (por si quieres resetearlo luego)
  const captchaRef = useRef<ReCAPTCHA>(null);

  return (
    <>
      {/* Skip link para teclado/lectores */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-blue-700 text-white px-3 py-2 rounded-md z-50"
      >
        Saltar al formulario de inicio de sesión
      </a>

      <main
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden mt-10"
        role="main"
      >
        {/* Decoración de fondo no anunciable */}
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
          <section
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-center min-h-[70vh]"
            aria-labelledby="page-title"
          >
            {/* Columna izquierda (contenido) */}
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
                  <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    ÁREA DE CLIENTES
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
                  Bienvenido a{" "}
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
                  Accede a tu cuenta para gestionar tus pedidos, ver tu
                  historial de compras y disfrutar de una experiencia
                  personalizada.
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
                    { Icon: Award, label: "Calidad premium" },
                    { Icon: Truck, label: "Envío rápido" },
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

                {/* Imagen optimizada en pantallas grandes */}
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
                      alt="Colección de uniformes de Cayro"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      sizes="(max-width: 1024px) 0px, 600px"
                    />
                    <figcaption className="sr-only">
                      Imagen decorativa de la colección de uniformes.
                    </figcaption>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"
                      aria-hidden="true"
                    ></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-xs md:text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                        Uniformes de calidad
                      </span>
                      <h3 className="text-lg md:text-xl font-bold mt-2">
                        Colección exclusiva
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
                          Acceso exclusivo
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
                    transition: { delay: 0.6, duration: 0.5 },
                  })}
                  className="mt-6 md:mt-8 flex justify-center lg:hidden"
                >
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="flex flex-col items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
                    aria-label="Ir al formulario de inicio de sesión"
                  >
                    <span className="text-sm font-medium">Iniciar sesión</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700">
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </button>
                </motion.div>
              </header>
            </motion.div>

            {/* Columna derecha (formulario) */}
            <motion.div
              id="login-form"
              {...animateOrNot({
                initial: variants.right.initial,
                animate: animateContent ? variants.right.animate : {},
                transition: { duration: 0.6, delay: 0.1 },
              })}
              className="w-full lg:w-1/2 max-w-md"
            >
              <section
                className="bg-white dark:bg-gray-800 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                aria-label="Formulario de inicio de sesión"
              >
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
                      initial: variants.up.initial,
                      animate: animateContent ? variants.up.animate : {},
                      transition: { duration: 0.4, delay: 0.1 },
                    })}
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4"
                    aria-hidden="true"
                  >
                    <User className="w-7 h-7" />
                  </motion.div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Iniciar sesión
                  </h2>
                  <div
                    className="h-1 bg-blue-600 mx-auto mt-3"
                    style={{ width: "6rem" }}
                    aria-hidden="true"
                  ></div>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 relative z-10"
                  noValidate
                  aria-describedby="login-help"
                >
                  {/* Correo o teléfono */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="identifier"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <User
                        className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
                      Correo electrónico o teléfono
                    </Label>
                    <div className="relative">
                      <input
                        id="identifier"
                        type="text"
                        inputMode="email"
                        autoComplete="username"
                        placeholder="correo@ejemplo.com o +52 123 456 7890"
                        className={`block w-full rounded-lg border ${
                          errors.identifier
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors outline-none`}
                        aria-invalid={Boolean(errors.identifier)}
                        aria-describedby={
                          errors.identifier ? "identifier-error" : "login-help"
                        }
                        {...register("identifier", {
                          required:
                            "El correo electrónico o teléfono es obligatorio",
                          validate: (value) => {
                            const emailRegex =
                              /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                            const phoneRegex = /^\+?[0-9\s-]{10,17}$/;
                            return emailRegex.test(value) ||
                              phoneRegex.test(value)
                              ? true
                              : "Ingrese un correo electrónico o número de teléfono válido";
                          },
                          onChange: (e) => {
                            const clean = e.target.value.replace(
                              /[<>='"]/g,
                              ""
                            );
                            e.target.value = clean;
                            setValue("identifier", clean, {
                              shouldValidate: true,
                            });
                            if (!errors.identifier) return;
                            clearErrors("identifier");
                          },
                        })}
                        spellCheck={false}
                      />
                      {errors.identifier ? (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle
                            className="h-5 w-5 text-red-500"
                            aria-hidden="true"
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Mail
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                    {errors.identifier && (
                      <motion.p
                        id="identifier-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                        role="alert"
                      >
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        {errors.identifier.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Lock
                        className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
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
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors outline-none`}
                        aria-invalid={Boolean(errors.password)}
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
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
                              "La contraseña no puede contener <, >, =, ', \" o espacios",
                          },
                          onChange: (e) => {
                            const clean = e.target.value.replace(
                              /[<>='" ]/g,
                              ""
                            );
                            e.target.value = clean;
                            setValue("password", clean, {
                              shouldValidate: true,
                            });
                            if (!errors.password) return;
                            clearErrors("password");
                          },
                        })}
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
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p
                        id="password-error"
                        className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                      >
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"
                          aria-hidden="true"
                        ></span>
                        {errors.password.message}
                      </motion.p>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowRecoveryDialog(true)}
                        className="text-sm text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                      >
                        <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  </div>

                  {/* Mensaje de bloqueo temporal */}
                  {lockoutTime > 0 && (
                    <motion.div
                      {...animateOrNot({
                        initial: { opacity: 0, y: 10 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.3 },
                      })}
                      className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 p-4 rounded-lg text-sm flex items-start"
                      role="status"
                      aria-live="polite"
                    >
                      <Lock
                        className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
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

                  {/* reCAPTCHA accesible */}
                  <div
                    className="flex justify-center my-6"
                    aria-label="Verificación reCAPTCHA"
                  >
                    <ReCAPTCHA
                      ref={captchaRef}
                      sitekey={
                        process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
                        "6Lc_k2MqAAAAAB19xvWE6_otNt4WRJBDfJpeo-EC"
                      }
                      onChange={handleCaptchaChange}
                      theme={captchaTheme}
                    />
                  </div>

                  {/* Botón enviar */}
                  <motion.button
                    type="submit"
                    className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                    disabled={lockoutTime > 0 || isLoading}
                    aria-busy={isLoading}
                    aria-live="polite"
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
                        <span>Iniciando sesión…</span>
                      </>
                    ) : (
                      <>
                        <span>Iniciar sesión</span>
                        <ArrowRight
                          className="ml-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </motion.button>

                  {/* Enlace de registro */}
                  <div className="mt-6 text-center">
                    <p className="text-gray-700 dark:text-gray-300">
                      ¿No tienes una cuenta?{" "}
                      <NavLink
                        to="/registro"
                        className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                      >
                        Regístrate ahora
                      </NavLink>
                    </p>
                  </div>

                  {/* Sello de seguridad */}
                  <div className="mt-6 flex justify-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300">
                      <Lock
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
                      <span>Tus datos están protegidos</span>
                    </div>
                  </div>

                  {/* Nota de ayuda para aria-describedby del primer input */}
                  <p id="login-help" className="sr-only">
                    Introduce tu correo o teléfono y tu contraseña para acceder.
                  </p>
                </form>
              </section>
            </motion.div>
          </section>
        </div>

        {/* Diálogo de recuperación */}
        <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
          <DialogContent
            className="sm:max-w-md"
            aria-label="Elegir método de recuperación"
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <KeyRound
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                Recuperación de contraseña
              </DialogTitle>
              <DialogDescription>
                Selecciona el método que prefieres para recuperar tu contraseña.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <motion.button
                onClick={() => handleRecoveryMethod("email")}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                {...animateOrNot({
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                })}
              >
                <div
                  className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full"
                  aria-hidden="true"
                >
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
                <ArrowRight
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </motion.button>

              <motion.button
                onClick={() => handleRecoveryMethod("question")}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                {...animateOrNot({
                  whileHover: { scale: 1.02 },
                  whileTap: { scale: 0.98 },
                })}
              >
                <div
                  className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full"
                  aria-hidden="true"
                >
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
                <ArrowRight
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </motion.button>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowRecoveryDialog(false)}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Cancelar
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
