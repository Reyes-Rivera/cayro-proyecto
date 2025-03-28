"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  MoveLeft,
  MoveRight,
  Package,
  Loader2,
  User,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Shield,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { Label } from "@/components/ui/label";
import type { User as UserType } from "@/types/User";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { useAuth } from "@/context/AuthContextType";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  const { SignUp, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<UserType>();

  const navigate = useNavigate();

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
  }, [password, error]);

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
  const handleInputChange = (field: keyof UserType, value: string) => {
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

  const onSubmit = handleSubmit(async (data: UserType) => {
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
            title: "Error de Contraseña",
            text: "La contraseña no debe contener partes de tu nombre, apellido o fecha de nacimiento.",
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
        try {
          setIsLoading(true);
          const res: any = await SignUp(
            data.name,
            data.surname,
            data.email,
            data.phone,
            data.birthdate,
            data.password,
            data.gender
          );
          if (
            res.success === false &&
            res.message === "El correo ya esta en uso."
          ) {
            Swal.fire({
              icon: "error",
              title: "Error de Correo",
              text: "El correo electrónico ya está registrado.",
              confirmButtonColor: "#3B82F6",
              iconColor: "#EF4444",
            });
            setCurrentStep(2);
            setIsLoading(false);
            return;
          }
          if (res.message === "Error desconocido al registrar.") {
            navigate("/500", { state: { fromError: true } });
            setIsLoading(false);
            return;
          }
          if (res.success) {
            navigate("/codigo-verificacion");
          }
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Error en el servidor.",
            text:
              error.response?.data?.message ||
              "Algo salió mal, por favor intenta más tarde.",
            confirmButtonColor: "#3B82F6",
            iconColor: "#EF4444",
          });
          setIsLoading(false);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de Contraseña",
          text: "La contraseña no cumple con todos los requisitos de seguridad.",
          confirmButtonColor: "#3B82F6",
          iconColor: "#EF4444",
        });
        setIsLoading(false);
      }
    }

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Columna izquierda - Formulario de registro */}
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
                <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  CREAR CUENTA
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
              >
                Únete a <span className="text-blue-600">Cayro Uniformes</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8"
              >
                Regístrate para acceder a ofertas exclusivas, gestionar tus
                pedidos y más.
              </motion.p>
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

            <form onSubmit={onSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="nombre"
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
                            id="nombre"
                            type="text"
                            className={`block w-full rounded-lg border ${
                              errors.name
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                            placeholder="Ingresa tu nombre"
                          />
                          {errors.name && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.name && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="apellidos"
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
                            id="apellidos"
                            type="text"
                            className={`block w-full rounded-lg border ${
                              errors.surname
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                            placeholder="Ingresa tus apellidos"
                          />
                          {errors.surname && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.surname && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.surname.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="fecha-nacimiento"
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
                          id="fecha-nacimiento"
                          type="date"
                          className={`block w-full rounded-lg border ${
                            errors.birthdate
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                        />
                        {errors.birthdate && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.birthdate && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.birthdate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="telefono"
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
                          id="telefono"
                          type="tel"
                          className={`block w-full rounded-lg border ${
                            errors.phone
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                          placeholder="Ingresa tu teléfono (10 dígitos)"
                        />
                        {errors.phone && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="sexo"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                      >
                        <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Sexo
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "MALE", value: "MALE", label: "Masculino" },
                          { id: "FEMALE", value: "FEMALE", label: "Femenino" },
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
                            <span className="text-sm font-medium">{label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.gender && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.gender.message}
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
                    className="space-y-6"
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
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
                          placeholder="correo@ejemplo.com"
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
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 shadow-sm transition-colors focus:outline-none`}
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
                              value === watch("password") ||
                              "Las contraseñas no coinciden",
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
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={currentStep === 2 && isLoading}
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
                </button>
              </div>

              {currentStep === 1 && (
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ¿Ya tienes una cuenta?{" "}
                    <NavLink
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                    >
                      Iniciar sesión
                    </NavLink>
                  </p>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        {/* Columna derecha - Imágenes y elementos visuales */}
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
                  Únete ahora
                </span>
                <h3 className="text-xl font-bold mt-2">
                  Beneficios exclusivos
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
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Gestión
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Administra tus pedidos fácilmente
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
                  Registro sencillo
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
