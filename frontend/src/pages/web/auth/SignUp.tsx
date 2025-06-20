"use client";
import backgroundImage from "@/pages/web/Home/assets/hero.jpg";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Shield,
  Sparkles,
  Truck,
  Award,
  Lock,
  MoveLeft,
  MoveRight,
  ChevronDown,
  Check,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import Loader from "@/components/web-components/Loader";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContextType";

type FormData = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: Date;
  gender: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
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

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [animateContent, setAnimateContent] = useState(false);

  const { SignUp, error } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<FormData>();

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
  const navigate = useNavigate();
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

  // Obtener descripción de la fortaleza de la contraseña
  const getStrengthName = (strength: number) => {
    if (strength <= 20) return "Muy débil";
    if (strength <= 40) return "Débil";
    if (strength <= 60) return "Moderada";
    if (strength <= 80) return "Fuerte";
    return "Muy fuerte";
  };

  // Manejador para limpiar errores al escribir
  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field, value);
    clearErrors(field);
  };

  const validatePasswordContent = (
    password: string,
    name: string,
    lastname: string,
    birthdate: string
  ): boolean => {
    const lowercasePassword = password.toLowerCase();
    const birthYear = birthdate
      ? new Date(birthdate).getFullYear().toString()
      : "";
    return (
      !lowercasePassword.includes(name.toLowerCase()) &&
      !lowercasePassword.includes(lastname.toLowerCase()) &&
      (birthYear ? !lowercasePassword.includes(birthYear) : true)
    );
  };

  const validateAge = (birthdate: Date): boolean => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Scroll to form on mobile
  const scrollToForm = () => {
    const formElement = document.getElementById("signup-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onSubmit = handleSubmit(async (data: FormData) => {
    if (currentStep === 2) {
      if (Object.values(passwordChecks).every(Boolean)) {
        if (
          !validatePasswordContent(
            password,
            data.name,
            data.surname,
            data.birthdate.toString()
          )
        ) {
          Swal.fire({
            icon: "error",
            title: "Contraseña inválida",
            toast: true,
            text: "La contraseña no debe contener partes de tu nombre, apellido o fecha de nacimiento.",
            position: "top-end",
            timer: 4000,
            showConfirmButton: false,
            animation: true,
            background: "#FEF2F2",
            color: "#DC2626",
            iconColor: "#EF4444",
          });
          return;
        }
        try {
          setIsLoading(true);

          const result = await SignUp(
            data.name,
            data.surname,
            data.email,
            data.phone,
            data.birthdate,
            data.password,
            data.gender
          );

          if (
            result &&
            typeof result === "object" &&
            "success" in result &&
            result.success
          ) {
            Swal.fire({
              icon: "success",
              title: "¡Cuenta creada!",
              toast: true,
              text: "Serás redirigido en breve.",
              position: "top-end",
              timer: 3000,
              showConfirmButton: false,
              animation: true,
              background: "#F0FDF4",
              color: "#166534",
              iconColor: "#22C55E",
            });

            // Optional: Redirect to verification page after success
            setTimeout(() => {
              navigate('/codigo-verificacion'); // Uncomment if using react-router
            }, 3000);
          } else {
            // Handle signup failure
            const errorMessage =
              result && typeof result === "object" && "message" in result
                ? (result.message as string)
                : "Error en el registro. Por favor intenta nuevamente.";

            Swal.fire({
              icon: "error",
              title: "Error en el registro",
              toast: true,
              text: errorMessage,
              position: "top-end",
              timer: 4000,
              showConfirmButton: false,
              animation: true,
              background: "#FEF2F2",
              color: "#DC2626",
              iconColor: "#EF4444",
            });
          }
        } catch (error: any) {
          console.error("Error during registration:", error);

          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            toast: true,
            text: "Ocurrió un error inesperado. Por favor intenta nuevamente.",
            position: "top-end",
            timer: 4000,
            showConfirmButton: false,
            animation: true,
            background: "#FEF2F2",
            color: "#DC2626",
            iconColor: "#EF4444",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Contraseña insegura",
          toast: true,
          text: "La contraseña no cumple con todos los requisitos de seguridad.",
          position: "top-end",
          timer: 4000,
          showConfirmButton: false,
          animation: true,
          background: "#FFFBEB",
          color: "#D97706",
          iconColor: "#F59E0B",
        });
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  });

  // Handle auth context errors
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        toast: true,
        text: error,
        position: "top-end",
        timer: 4000,
        showConfirmButton: false,
        animation: true,
        background: "#FEF2F2",
        color: "#DC2626",
        iconColor: "#EF4444",
      });
    }
  }, [error]);

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
                  CREAR CUENTA
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
                Únete a{" "}
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
                Regístrate para acceder a ofertas exclusivas, gestionar tus
                pedidos y disfrutar de una experiencia personalizada.
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
                    width={600}
                    height={400}
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
                        Registro sencillo
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
                    Crear cuenta
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

          {/* Right column - Signup Form */}
          <motion.div
            id="signup-form"
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
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-3"
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
                  Crear cuenta
                </motion.h2>
                <motion.div
                  initial={{ width: 0 }}
                  animate={animateContent ? { width: "6rem" } : { width: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="h-1 bg-blue-600 mx-auto mt-4"
                ></motion.div>
              </div>

              {/* Indicador de pasos */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    1
                  </div>
                  <div
                    className={`h-1 w-16 ${
                      currentStep > 1
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  ></div>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  2
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-4 relative z-10">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                          >
                            <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Nombre
                          </Label>
                          <div className="relative">
                            <input
                              {...register("name", {
                                required: "El nombre es requerido",
                                minLength: {
                                  value: 3,
                                  message: "Debe tener al menos 3 caracteres",
                                },
                                maxLength: {
                                  value: 30,
                                  message: "No puede superar los 30 caracteres",
                                },
                                pattern: {
                                  value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                  message: "Solo puede contener letras",
                                },
                              })}
                              id="name"
                              type="text"
                              className={`block w-full rounded-lg border ${
                                errors.name
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm transition-colors focus:outline-none`}
                              placeholder="Ingresa tu nombre"
                            />
                            {errors.name && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {errors.name && (
                            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {errors.name.message}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="surname"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                          >
                            <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Apellidos
                          </Label>
                          <div className="relative">
                            <input
                              {...register("surname", {
                                required: "El apellido es requerido",
                                minLength: {
                                  value: 3,
                                  message: "Debe tener al menos 3 caracteres",
                                },
                                maxLength: {
                                  value: 50,
                                  message: "No puede superar los 50 caracteres",
                                },
                                pattern: {
                                  value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                  message: "Solo puede contener letras",
                                },
                              })}
                              id="surname"
                              type="text"
                              className={`block w-full rounded-lg border ${
                                errors.surname
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm transition-colors focus:outline-none`}
                              placeholder="Ingresa tus apellidos"
                            />
                            {errors.surname && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {errors.surname && (
                            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {errors.surname.message}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="birthdate"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Fecha de nacimiento
                        </Label>
                        <div className="relative">
                          <input
                            {...register("birthdate", {
                              required: "La fecha de nacimiento es requerida",
                              validate: (value) =>
                                validateAge(value) ||
                                "Debes tener al menos 18 años para registrarte.",
                            })}
                            id="birthdate"
                            type="date"
                            className={`block w-full rounded-lg border ${
                              errors.birthdate
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm transition-colors focus:outline-none`}
                          />
                          {errors.birthdate && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.birthdate && (
                          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {errors.birthdate.message}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <Phone className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Teléfono
                        </Label>
                        <div className="relative">
                          <input
                            {...register("phone", {
                              required: "El teléfono es requerido",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message:
                                  "El número de teléfono debe tener exactamente 10 números",
                              },
                            })}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            id="phone"
                            type="tel"
                            className={`block w-full rounded-lg border ${
                              errors.phone
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm transition-colors focus:outline-none`}
                            placeholder="Ingresa tu teléfono (10 dígitos)"
                          />
                          {errors.phone && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {errors.phone.message}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="gender"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                          Sexo
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "MALE", value: "MALE", label: "Masculino" },
                            {
                              id: "FEMALE",
                              value: "FEMALE",
                              label: "Femenino",
                            },
                            { id: "OTHER", value: "OTHER", label: "Otro" },
                          ].map(({ id, value, label }) => (
                            <label
                              key={id}
                              className={`flex items-center justify-center p-3 rounded-lg border ${
                                watch("gender") === value
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                  : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                              } cursor-pointer transition-colors`}
                            >
                              <input
                                type="radio"
                                id={id}
                                value={value}
                                {...register("gender", {
                                  required: "El sexo es requerido",
                                })}
                                className="sr-only"
                              />
                              <span className="text-sm font-medium">
                                {label}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.gender && (
                          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {errors.gender.message}
                            </span>
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
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
                            {...register("email", {
                              required: "El correo electrónico es requerido",
                              pattern: {
                                value: /^(?!.*[<>])^\S+@\S+\.\S+$/,
                                message: "El correo electrónico no es válido",
                              },
                            })}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            id="email"
                            type="email"
                            className={`block w-full rounded-lg border ${
                              errors.email
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm transition-colors focus:outline-none`}
                            placeholder="correo@ejemplo.com"
                          />
                          {errors.email && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.email && (
                          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {errors.email.message}
                            </span>
                          </p>
                        )}
                      </div>

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
                              setValue("password", e.target.value);
                              clearErrors("password");
                              clearErrors("confirmPassword");
                            }}
                            autoComplete="new-password"
                            className={`block w-full rounded-lg border ${
                              errors.password
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm transition-colors focus:outline-none`}
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
                            <div className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <Shield className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
                                  Fortaleza de la contraseña:
                                </span>
                                <span
                                  className={`text-xs font-medium ${getStrengthColor(
                                    passwordStrength
                                  ).replace("bg-", "text-")}`}
                                >
                                  {getStrengthName(passwordStrength)}
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className={`h-full rounded-full ${getStrengthColor(
                                    passwordStrength
                                  )}`}
                                  style={{ width: `${passwordStrength}%` }}
                                ></div>
                              </div>

                              <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                                {Object.entries(passwordChecks).map(
                                  ([key, isValid]) => {
                                    const labels: Record<string, string> = {
                                      length: "Mínimo 8 caracteres",
                                      uppercase: "Al menos una mayúscula",
                                      lowercase: "Al menos una minúscula",
                                      number: "Al menos un número",
                                      special: "Al menos un carácter especial",
                                      noSequential: "Sin secuencias obvias",
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
                                          className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mr-1 ${
                                            isValid
                                              ? "bg-green-100 dark:bg-green-900/30"
                                              : "bg-gray-100 dark:bg-gray-700"
                                          }`}
                                        >
                                          {isValid ? (
                                            <Check className="w-2.5 h-2.5" />
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
                          htmlFor="confirmPassword"
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
                                value === watch("password") ||
                                "Las contraseñas no coinciden",
                            })}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className={`block w-full rounded-lg border ${
                              errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm transition-colors focus:outline-none`}
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botones de navegación */}
                <div
                  className={`flex ${
                    currentStep === 1 ? "justify-end" : "justify-between"
                  } mt-8`}
                >
                  {currentStep > 1 && (
                    <button
                      type="button"
                      className="px-5 py-2.5 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center"
                      onClick={handleBack}
                    >
                      <MoveLeft className="h-4 w-4 mr-2" />
                      Atrás
                    </button>
                  )}
                  <motion.button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={currentStep === 2 && isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentStep === 2 ? (
                      isLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <span>Crear cuenta</span>
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </>
                      )
                    ) : (
                      <>
                        <span>Siguiente</span>
                        <MoveRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Enlace de inicio de sesión */}
                <div className="mt-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    ¿Ya tienes una cuenta?{" "}
                    <NavLink
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Iniciar sesión
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
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Tus datos están protegidos</span>
                  </div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
