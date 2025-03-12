"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Send,
  RefreshCw,
  CheckCircle,
  Mail,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContextType";
import { useNavigate } from "react-router-dom";
import { resendCodeApi, resendCodeApiAuth } from "@/api/auth";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { motion } from "framer-motion";

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

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    verifyCode,
    verifyCodeAuth,
    emailToVerify,
    setIsVerificationPending,
  } = useAuth();
  const navigate = useNavigate();

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

    if (location.pathname === "/codigo-verificacion") {
      const response = (await verifyCode(emailToVerify, code)) as {
        status: number;
        message: string;
      };
      if (response.status === 201) {
        setIsVerified(true);
        Swal.fire({
          icon: "success",
          title: "¡Verificación Exitosa!",
          toast: true,
          text: "Tu código ha sido verificado correctamente. Serás redirigido en breve.",
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          animation: true,
          background: "#F0FDF4", // Fondo verde claro
          color: "#166534", // Texto verde oscuro
          iconColor: "#22C55E", // Ícono verde
        });

        // Handle redirect logic for this path
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
      if (response.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Error al verificar.",
          toast: true,
          text: response.message,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          animation: true,
          background: "#FEF2F2",
          color: "#B91C1C",
          iconColor: "#EF4444",
        });
      }
      setIsSubmitting(false);
    } else if (location.pathname === "/codigo-verificacion-auth") {
      const response = (await verifyCodeAuth(emailToVerify, code)) as {
        status: number;
        message: string;
        data?: { role?: string };
      };
      if (response.status === 201) {
        setIsVerified(true);

        Swal.fire({
          icon: "success",
          title: "¡Verificación Exitosa!",
          toast: true,
          text: "Tu código ha sido verificado correctamente. Serás redirigido en breve.",
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          animation: true,
          background: "#F0FDF4", // Fondo verde claro
          color: "#166534", // Texto verde oscuro
          iconColor: "#22C55E", // Ícono verde
        });

        setTimeout(() => {
          setIsVerificationPending(false);
          localStorage.removeItem("isVerificationPending");
          localStorage.removeItem("emailToVerify");

          // Redirect based on user role
          const responseData = response as { data: { role: string } };
          if (responseData.data?.role === "ADMIN") {
            navigate("/perfil-admin");
          } else if (response.data?.role === "USER") {
            navigate("/perfil-usuario");
          } else if (response.data?.role === "EMPLOYEE") {
            navigate("/perfil-empleado");
          }
        }, 2000);
      }
      if (response.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Error al verificar.",
          toast: true,
          text: response.message,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          animation: true,
          background: "#FEF2F2",
          color: "#B91C1C",
          iconColor: "#EF4444",
        });
      }
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
          Swal.fire({
            icon: "success",
            title: "Código reenviado",
            text: "Se ha enviado un nuevo código de verificación a tu correo.",
            confirmButtonColor: "#2563EB",
          });
          setCountdown(60); // Start 60 second countdown
        }
      } else if (location.pathname === "/codigo-verificacion-auth") {
        const res = await resendCodeApiAuth({ email: emailToVerify });
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Código reenviado",
            text: "Se ha enviado un nuevo código de verificación a tu correo.",
            confirmButtonColor: "#2563EB",
          });
          setCountdown(60); // Start 60 second countdown
        }
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "No se pudo reenviar el código, intente más tarde."
      );

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo reenviar el código, intente más tarde.",
        confirmButtonColor: "#2563EB",
      });
    } finally {
      setIsResending(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="flex-grow flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <Button
            variant="ghost"
            className="mb-4 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={goBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>

          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 space-y-4">
              <div className="mx-auto bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Verificación de Código
              </h2>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Ingresa el código de 6 dígitos enviado a:
                <div className="font-medium text-blue-600 dark:text-blue-400 mt-1">
                  {emailToVerify || "tu correo electrónico"}
                </div>
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
              {!isVerified ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2 sm:gap-3">
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
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
                        className="w-full h-14 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all focus:outline-none rounded-md"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 border-l-4 border-red-500"
                    >
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-md transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={
                      isSubmitting || verificationCode.some((digit) => !digit)
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Verificar Código
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="text-green-800 dark:text-green-300 font-medium">
                        ¡Verificación Exitosa!
                      </h3>
                      <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                        Tu código ha sido verificado correctamente. Serás
                        redirigido en breve.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2 flex flex-col space-y-4">
              <div className="text-center w-full">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all px-4 py-2 rounded-md flex items-center justify-center mx-auto ${
                    countdown > 0 || isResending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isResending || countdown > 0}
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
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Si no recibiste el código, revisa tu carpeta de spam o solicita
                un nuevo código.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
