"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  RefreshCw,
  CheckCircle,
  Mail,
  ArrowLeft,
  AlertTriangle,
  Shield,
  KeyRound,
  Sparkles,
  ArrowRight,
  Award,
  Truck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContextType";
import { useNavigate, Link } from "react-router-dom";
import { resendCodeApi, resendCodeApiAuth } from "@/api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import backgroundImage from "@/pages/web/Home/assets/hero.jpg";
import Loader from "@/components/web-components/Loader";
import { AlertHelper } from "@/utils/alert.util";

export default function VerificationPage() {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    verifyCode,
    verifyCodeAuth,
    emailToVerify,
    setIsVerificationPending,
  } = useAuth();
  const navigate = useNavigate();

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

  // Initialize countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;

    // If a digit is entered, move to the next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setVerificationCode(newCode);
    setError(null); // Clear any error when user types
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle left arrow key
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle right arrow key
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setVerificationCode(digits);
      // Focus the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!emailToVerify) {
      setError(
        "Correo electrónico no encontrado. Por favor, intente nuevamente."
      );
      return;
    }

    const code = verificationCode.join("");

    // Validate complete code
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError("Por favor ingrese un código de 6 dígitos válido");
      return;
    }

    setIsSubmitting(true);
    try {
      if (location.pathname === "/codigo-verificacion") {
        const response = (await verifyCode(emailToVerify, code)) as {
          status: number;
          message: string;
        };

        if (response.status === 201) {
          setIsVerified(true);
          AlertHelper.success({
            message:
              "Tu código ha sido verificado correctamente. Por favor inicia sesión.",
            title: "¡Verificación Exitosa!",
            timer: 4000,
            animation: "slideIn",
          });

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else if (response.status === 500) {
          AlertHelper.error({
            message: response.message,
            title: "Error al verificar",
            timer: 5000,
            animation: "slideIn",
          });
        }
      } else if (location.pathname === "/codigo-verificacion-auth") {
        const response = (await verifyCodeAuth(emailToVerify, code)) as {
          status: number;
          message: string;
          data?: { role?: string };
        };

        if (response.status === 201) {
          setIsVerified(true);
          AlertHelper.success({
            message:
              "Tu código ha sido verificado correctamente. Serás redirigido en breve.",
            title: "¡Verificación Exitosa!",
            timer: 4000,
            animation: "slideIn",
          });

          setTimeout(() => {
            setIsVerificationPending(false);
            localStorage.removeItem("isVerificationPending");
            localStorage.removeItem("emailToVerify");

            const responseData = response as { data: { role: string } };
            if (responseData.data?.role === "ADMIN") {
              navigate("/perfil-admin");
            } else if (response.data?.role === "USER") {
              navigate("/perfil-usuario");
            } else if (response.data?.role === "EMPLOYEE") {
              navigate("/perfil-empleado");
            }
          }, 2000);
        } else if (response.status === 500) {
          AlertHelper.error({
            message: response.message,
            title: "Error al verificar",
            timer: 5000,
            animation: "slideIn",
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Error inesperado al verificar el código.";

      AlertHelper.error({
        message: errorMessage,
        title: "Error de verificación",
        timer: 5000,
        animation: "slideIn",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      if (location.pathname === "/codigo-verificacion") {
        const res = await resendCodeApi({ email: emailToVerify });
        if (res) {
          AlertHelper.success({
            message:
              "Se ha enviado un nuevo código de verificación a tu correo.",
            title: "Código reenviado",
            timer: 4000,
            animation: "slideIn",
          });
          setCountdown(60); // Start 60 second countdown
        }
      } else if (location.pathname === "/codigo-verificacion-auth") {
        const res = await resendCodeApiAuth({ email: emailToVerify });

        if (res) {
          AlertHelper.success({
            message:
              "Se ha enviado un nuevo código de verificación a tu correo.",
            title: "Código reenviado",
            timer: 4000,
            animation: "slideIn",
          });
          setCountdown(60); // Start 60 second countdown
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "No se pudo reenviar el código, intente más tarde.";

      setError(errorMessage);

      AlertHelper.error({
        message: errorMessage,
        title: "Error al reenviar",
        timer: 5000,
        animation: "slideIn",
      });
    } finally {
      setIsResending(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  // Scroll to form on mobile
  const scrollToForm = () => {
    const formElement = document.getElementById("verification-form");
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
                  VERIFICACIÓN DE CUENTA
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
                Verifica tu acceso a{" "}
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
                Ingresa el código de 6 dígitos que enviamos a tu correo
                electrónico para verificar tu identidad y completar el proceso.
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
                      Verificación
                    </span>
                    <h3 className="text-xl font-bold mt-2">
                      Confirma tu identidad
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
                        Proceso sencillo
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
                    {!isVerified ? "Verificar código" : "Ver confirmación"}
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

          {/* Right column - Verification Form */}
          <motion.div
            id="verification-form"
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
                  {!isVerified ? (
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
                  {!isVerified
                    ? "Verificación de cuenta"
                    : "Verificación exitosa"}
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={animateContent ? { width: "6rem" } : { width: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="h-1 bg-blue-600 mx-auto mt-4"
                ></motion.div>
              </div>

              <AnimatePresence mode="wait">
                {!isVerified ? (
                  <motion.div
                    key="verification-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 relative z-10"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start">
                      <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium mb-1">Código enviado a:</p>
                        <p className="font-bold">
                          {emailToVerify || "tu correo electrónico"}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-3">
                          <KeyRound className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Ingresa el código de verificación
                        </label>
                        <div className="flex justify-between gap-2">
                          {verificationCode.map((digit, index) => (
                            <div key={index} className="w-full relative">
                              <input
                                ref={(el) => (inputRefs.current[index] = el)}
                                id={`code-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                  handleCodeChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-full h-14 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all focus:outline-none rounded-lg"
                                autoFocus={index === 0}
                              />
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 flex items-start"
                        >
                          <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
                          </p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={
                          isSubmitting ||
                          verificationCode.some((digit) => !digit)
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Button background animation */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            <span>Verificando...</span>
                          </>
                        ) : (
                          <>
                            <span>Verificar código</span>
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </form>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col items-center space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ¿No recibiste el código?
                        </p>
                        <motion.button
                          onClick={handleResendCode}
                          className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${
                            countdown > 0 || isResending
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={isResending || countdown > 0}
                          whileHover={
                            countdown > 0 || isResending ? {} : { scale: 1.05 }
                          }
                          whileTap={
                            countdown > 0 || isResending ? {} : { scale: 0.95 }
                          }
                        >
                          {isResending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Reenviando...
                            </>
                          ) : countdown > 0 ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reenviar en {countdown}s
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reenviar código
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={goBack}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                      </Button>
                    </div>
                  </motion.div>
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
                            ¡Verificación Exitosa!
                          </AlertTitle>
                          <AlertDescription className="text-gray-700 dark:text-gray-300">
                            <p>Tu código ha sido verificado correctamente.</p>
                            <p className="mt-2">
                              Serás redirigido automáticamente en unos segundos.
                            </p>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>

                    <div className="flex flex-col items-center gap-4 mt-8">
                      <Link
                        to="/login"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Volver a iniciar sesión
                      </Link>
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
