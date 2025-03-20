"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Loader2,
  Mail,
  ArrowRight,
  CheckCircle,
  Shield,
  KeyRound,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { recoverPassword } from "@/api/auth";
import { motion, AnimatePresence } from "framer-motion";
import backgroundImage from "../web/Home/assets/hero.jpg";

export default function PasswordRecoveryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data: { email: string }) => {
    try {
      setIsSubmitting(true);
      const res = await recoverPassword({ email: data.email });
      if (res) {
        setIsSubmitted(true);
        Swal.fire({
          icon: "success",
          title: "Recuperación de contraseña",
          text: "Se ha enviado un correo con las instrucciones para la recuperación de su contraseña.",
          confirmButtonColor: "#2563EB",
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Algo salió mal",
          text: "Por favor, inténtalo más tarde.",
          confirmButtonColor: "#2563EB",
        });
        return;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error desconocido.";
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
      if (error.response && error.response.status === 400) {
        navigate("/400");
      }
      if (error.response && error.response.status === 500) {
        navigate("/500");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[<>'"]/g, "");
    setValue("email", value);
    clearErrors("email");
  };

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
                  RECUPERACIÓN DE CUENTA
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
              >
                Recupera tu acceso a{" "}
                <span className="text-blue-600">Cayro Uniformes</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              >
                No te preocupes, te ayudaremos a recuperar tu contraseña en unos
                sencillos pasos.
              </motion.p>
            </div>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="recovery-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
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
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3.5 shadow-sm transition-colors focus:outline-none`}
                        {...register("email", {
                          required: "El correo electrónico es obligatorio",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Dirección de correo electrónico inválida",
                          },
                        })}
                        onChange={handleEmailChange}
                      />

                      {errors.email && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}

                      {!errors.email && email && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <CheckCircle className="h-5 w-5 text-green-500" />
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

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 flex items-start">
                    <HelpCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-medium mb-1">Información importante</p>
                      <p>
                        Recibirás un correo con un enlace para crear una nueva
                        contraseña. Por favor, revisa también tu carpeta de
                        spam.
                      </p>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex justify-center items-center gap-2 relative overflow-hidden group"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button background animation */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-blue-500/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>

                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        <span>Enviando instrucciones...</span>
                      </>
                    ) : (
                      <>
                        <span>Enviar instrucciones</span>
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
                          Instrucciones enviadas
                        </AlertTitle>
                        <AlertDescription className="text-gray-700 dark:text-gray-300">
                          Hemos enviado las instrucciones para restablecer tu
                          contraseña a{" "}
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {email}
                          </span>
                          .
                          <p className="mt-2">
                            Por favor, revisa tu bandeja de entrada y sigue los
                            pasos indicados.
                          </p>
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>

                  <div className="flex flex-col items-center gap-4 mt-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      ¿No recibiste el correo? Revisa tu carpeta de spam o
                    </p>
                    <motion.button
                      onClick={() => setIsSubmitted(false)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Mail className="h-4 w-4" />
                      Intentar con otro correo
                    </motion.button>

                    <Link
                      to="/login"
                      className="mt-4 inline-flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors"
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
                  Recupera tu acceso
                </span>
                <h3 className="text-xl font-bold mt-2">Proceso seguro</h3>
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
                  Proceso seguro y encriptado
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Email
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instrucciones por correo electrónico
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
                    Nueva clave
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Crea una contraseña segura
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Soporte
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Asistencia en todo momento
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
                  Proceso sencillo
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
