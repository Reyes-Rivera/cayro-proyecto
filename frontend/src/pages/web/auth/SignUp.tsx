"use client";

import backgroundImage from "@/pages/web/Home/assets/hero.webp";
import { useEffect, useMemo, useState } from "react";
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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContextType";
import { AlertHelper } from "@/utils/alert.util";

type FormData = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string; // usar string para inputs type="date"
  gender: "MALE" | "FEMALE" | "OTHER" | "";
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const animateOrNot = (val: any) => (prefersReducedMotion ? {} : val);
  const [animateContent, setAnimateContent] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion) setAnimateContent(true);
  }, [prefersReducedMotion]);

  const { SignUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      birthdate: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Reglas de contraseña
  const containsSequentialPatterns = (pwd: string): boolean => {
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
      commonPatterns.some((p) => pwd.includes(p)) ||
      sequentialPatternRegex.test(pwd)
    );
  };

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
  const strengthLabel = getStrengthName(passwordStrength);
  const strengthColor = getStrengthColor(passwordStrength);

  // Helpers
  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const validatePasswordContent = (
    pwd: string,
    name: string,
    lastname: string,
    birthdate: string
  ): boolean => {
    const lower = pwd.toLowerCase();
    const year = birthdate ? new Date(birthdate).getFullYear().toString() : "";
    return (
      !lower.includes(name.toLowerCase()) &&
      !lower.includes(lastname.toLowerCase()) &&
      (year ? !lower.includes(year) : true)
    );
  };

  const validateAge = (birthdate: string): boolean => {
    if (!birthdate) return false;
    const today = new Date();
    const bd = new Date(birthdate);
    let age = today.getFullYear() - bd.getFullYear();
    const m = today.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--;
    return age >= 18;
  };

  // Fecha máxima (18 años)
  const maxBirthdate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split("T")[0];
  }, []);

  // Scroll a formulario en móvil
  const scrollToForm = () => {
    const el = document.getElementById("signup-form");
    el?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const onSubmit = handleSubmit(async (data) => {
    if (currentStep === 1) {
      // Validaciones rápidas step 1
      const okAge = validateAge(data.birthdate);
      if (!okAge) return;

      setCurrentStep(2);
      return;
    }

    // Paso 2
    if (!acceptTerms) {
      AlertHelper.warning({
        message:
          "Debes aceptar los términos y condiciones, aviso de privacidad y deslinde legal para continuar.",
        title: "Términos y condiciones",
        timer: 5000,
        animation: "slideIn",
      });
      return;
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      AlertHelper.warning({
        message:
          "La contraseña no cumple con todos los requisitos de seguridad. Revisa los criterios mostrados.",
        title: "Contraseña insegura",
        timer: 5000,
        animation: "slideIn",
      });
      return;
    }

    if (
      !validatePasswordContent(
        data.password,
        data.name,
        data.surname,
        data.birthdate
      )
    ) {
      AlertHelper.error({
        message:
          "La contraseña no debe contener partes de tu nombre, apellido o fecha de nacimiento.",
        title: "Contraseña inválida",
        timer: 5000,
        animation: "slideIn",
      });
      return;
    }

    try {
      const result = await SignUp(
        data.name.trim(),
        data.surname.trim(),
        data.email.trim(),
        data.phone.trim(),
        new Date(data.birthdate),
        data.password,
        data.gender
      );

      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        (result as any).success
      ) {
        AlertHelper.success({
          message:
            "¡Tu cuenta ha sido creada! Te redirigimos para verificar tu correo.",
          title: "¡Cuenta creada!",
          timer: 3500,
          animation: "slideIn",
        });
        setTimeout(() => navigate("/codigo-verificacion"), 1200);
      } else {
        const msg =
          result && typeof result === "object" && "message" in result
            ? (result as any).message
            : "Error en el registro. Intenta nuevamente.";
        AlertHelper.error({
          message: msg,
          title: "Error en el registro",
          timer: 5000,
          animation: "slideIn",
        });
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Ocurrió un error inesperado.";
      AlertHelper.error({
        message: msg,
        title: "Error inesperado",
        timer: 5000,
        animation: "slideIn",
      });
    }
  });

  // Variants
  const variants = useMemo(
    () => ({
      left: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
      right: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
      in: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
      up: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
      pop: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
      },
    }),
    []
  );

  return (
    <>
      {/* Skip link */}
      <a
        href="#signup-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-blue-700 text-white px-3 py-2 rounded-md z-50"
      >
        Saltar al formulario de registro
      </a>

      <main
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden mt-10"
        role="main"
        aria-labelledby="page-title"
      >
        {/* Fondo decorativo no anunciable */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-blue-600/5 to-transparent" />
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
          <section className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-center min-h-[70vh]">
            {/* Columna izquierda */}
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
                  className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-1.5"
                  aria-hidden="true"
                >
                  <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    CREAR CUENTA
                  </span>
                </motion.div>

                <motion.h1
                  id="page-title"
                  {...animateOrNot({
                    initial: variants.up.initial,
                    animate: animateContent ? variants.up.animate : {},
                    transition: { duration: 0.5, delay: 0.1 },
                  })}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                >
                  Únete a{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-blue-600">
                      Cayro Uniformes
                    </span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/20 -z-10 rounded" />
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
                  Regístrate para acceder a ofertas exclusivas, gestionar tus
                  pedidos y disfrutar de una experiencia personalizada.
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

                {/* Imagen optimizada */}
                <motion.div
                  {...animateOrNot({
                    initial: { opacity: 0, y: 16 },
                    animate: animateContent ? { opacity: 1, y: 0 } : {},
                    transition: { duration: 0.5, delay: 0.35 },
                  })}
                  className="mt-10 hidden lg:block"
                >
                  <figure className="relative">
                    <img
                      src={backgroundImage || "/placeholder.svg"}
                      width={600}
                      height={400}
                      alt="Uniformes de calidad Cayro: colección exclusiva"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      sizes="(max-width: 1024px) 0px, 600px"
                    />
                    <figcaption className="sr-only">
                      Colección exclusiva de uniformes.
                    </figcaption>
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute bottom-4 left-4 text-white"
                      aria-hidden="true"
                    >
                      <span className="text-sm font-medium bg-blue-600 px-3 py-1 rounded-full">
                        Uniformes de calidad
                      </span>
                      <h3 className="text-xl font-bold mt-2">
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
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          Registro sencillo
                        </span>
                      </div>
                    </motion.div>
                  </figure>
                </motion.div>

                {/* CTA móvil */}
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
                    aria-label="Crear cuenta"
                  >
                    <span className="text-sm font-medium">Crear cuenta</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700">
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </button>
                </motion.div>
              </header>
            </motion.div>

            {/* Columna derecha - Formulario */}
            <motion.div
              id="signup-form"
              {...animateOrNot({
                initial: variants.right.initial,
                animate: animateContent ? variants.right.animate : {},
                transition: { duration: 0.6, delay: 0.1 },
              })}
              className="w-full lg:w-1/2 max-w-md"
            >
              <section
                className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden"
                aria-label="Formulario de registro"
              >
                <div
                  className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full"
                  aria-hidden="true"
                />
                <div
                  className="absolute -left-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full"
                  aria-hidden="true"
                />

                <div className="text-center mb-8 relative z-10">
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4"
                    aria-hidden="true"
                  >
                    <User className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Crear cuenta
                  </h2>
                  <div
                    className="h-1 bg-blue-600 mx-auto mt-3"
                    style={{ width: "6rem" }}
                    aria-hidden="true"
                  />
                </div>

                {/* Stepper accesible */}
                <nav
                  className="flex items-center justify-center mb-8"
                  aria-label="Progreso del registro"
                >
                  <ol className="flex items-center gap-2">
                    <li
                      aria-current={currentStep === 1 ? "step" : undefined}
                      className="flex items-center"
                    >
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
                        aria-hidden="true"
                      />
                    </li>
                    <li aria-current={currentStep === 2 ? "step" : undefined}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep >= 2
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        2
                      </div>
                    </li>
                  </ol>
                </nav>

                <form
                  onSubmit={onSubmit}
                  className="space-y-4 relative z-10"
                  noValidate
                >
                  <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                      <motion.div
                        key="step1"
                        {...animateOrNot({
                          initial: { opacity: 0, x: 16 },
                          animate: { opacity: 1, x: 0 },
                          exit: { opacity: 0, x: -16 },
                          transition: { duration: 0.25 },
                        })}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Nombre */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                            >
                              <User
                                className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                                aria-hidden="true"
                              />
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
                                    message:
                                      "No puede superar los 30 caracteres",
                                  },
                                  pattern: {
                                    value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                    message: "Solo puede contener letras",
                                  },
                                  onChange: (e) =>
                                    handleInputChange("name", e.target.value),
                                })}
                                id="name"
                                type="text"
                                inputMode="text"
                                autoComplete="given-name"
                                maxLength={30}
                                className={`block w-full rounded-lg border ${
                                  errors.name
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                                } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm outline-none`}
                                placeholder="Ingresa tu nombre"
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                  errors.name ? "name-error" : undefined
                                }
                              />
                              {errors.name && (
                                <div
                                  className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                                  aria-hidden="true"
                                >
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                </div>
                              )}
                            </div>
                            {errors.name && (
                              <p
                                id="name-error"
                                className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                                role="alert"
                              >
                                <AlertCircle
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />{" "}
                                {errors.name.message as string}
                              </p>
                            )}
                          </div>

                          {/* Apellidos */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="surname"
                              className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                            >
                              <User
                                className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                                aria-hidden="true"
                              />
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
                                    message:
                                      "No puede superar los 50 caracteres",
                                  },
                                  pattern: {
                                    value: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
                                    message: "Solo puede contener letras",
                                  },
                                  onChange: (e) =>
                                    handleInputChange(
                                      "surname",
                                      e.target.value
                                    ),
                                })}
                                id="surname"
                                type="text"
                                inputMode="text"
                                autoComplete="family-name"
                                maxLength={50}
                                className={`block w-full rounded-lg border ${
                                  errors.surname
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                                } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm outline-none`}
                                placeholder="Ingresa tus apellidos"
                                aria-invalid={Boolean(errors.surname)}
                                aria-describedby={
                                  errors.surname ? "surname-error" : undefined
                                }
                              />
                              {errors.surname && (
                                <div
                                  className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                                  aria-hidden="true"
                                >
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                </div>
                              )}
                            </div>
                            {errors.surname && (
                              <p
                                id="surname-error"
                                className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                                role="alert"
                              >
                                <AlertCircle
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />{" "}
                                {errors.surname.message as string}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Fecha */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="birthdate"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                          >
                            <Calendar
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                              aria-hidden="true"
                            />
                            Fecha de nacimiento
                          </Label>
                          <div className="relative">
                            <input
                              {...register("birthdate", {
                                required: "La fecha de nacimiento es requerida",
                                validate: (v) =>
                                  validateAge(v) ||
                                  "Debes tener al menos 18 años para registrarte.",
                                onChange: (e) =>
                                  handleInputChange(
                                    "birthdate",
                                    e.target.value
                                  ),
                              })}
                              id="birthdate"
                              type="date"
                              max={maxBirthdate}
                              className={`block w-full rounded-lg border ${
                                errors.birthdate
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm outline-none`}
                              aria-invalid={Boolean(errors.birthdate)}
                              aria-describedby={
                                errors.birthdate ? "birthdate-error" : undefined
                              }
                            />
                            {errors.birthdate && (
                              <div
                                className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                                aria-hidden="true"
                              >
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {errors.birthdate && (
                            <p
                              id="birthdate-error"
                              className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                              role="alert"
                            >
                              <AlertCircle
                                className="h-3 w-3"
                                aria-hidden="true"
                              />{" "}
                              {errors.birthdate.message as string}
                            </p>
                          )}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                          >
                            <Phone
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                              aria-hidden="true"
                            />
                            Teléfono
                          </Label>
                          <div className="relative">
                            <input
                              {...register("phone", {
                                required: "El teléfono es requerido",
                                pattern: {
                                  value: /^[0-9]{10}$/,
                                  message: "Debe tener exactamente 10 dígitos",
                                },
                                onChange: (e) =>
                                  handleInputChange(
                                    "phone",
                                    e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 10)
                                  ),
                              })}
                              id="phone"
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel"
                              maxLength={10}
                              className={`block w-full rounded-lg border ${
                                errors.phone
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm outline-none`}
                              placeholder="10 dígitos"
                              aria-invalid={Boolean(errors.phone)}
                              aria-describedby={
                                errors.phone ? "phone-error" : undefined
                              }
                            />
                            {errors.phone && (
                              <div
                                className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                                aria-hidden="true"
                              >
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {errors.phone && (
                            <p
                              id="phone-error"
                              className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                              role="alert"
                            >
                              <AlertCircle
                                className="h-3 w-3"
                                aria-hidden="true"
                              />{" "}
                              {errors.phone.message as string}
                            </p>
                          )}
                        </div>

                        {/* Género */}
                        <fieldset className="space-y-2">
                          <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                            <User
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                              aria-hidden="true"
                            />
                            Sexo
                          </legend>
                          <div
                            className="grid grid-cols-3 gap-3"
                            role="radiogroup"
                            aria-labelledby="gender-group"
                          >
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
                                className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                  watch("gender") === value
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
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
                            <p
                              className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                              role="alert"
                            >
                              <AlertCircle
                                className="h-3 w-3"
                                aria-hidden="true"
                              />{" "}
                              {errors.gender.message as string}
                            </p>
                          )}
                        </fieldset>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        {...animateOrNot({
                          initial: { opacity: 0, x: 16 },
                          animate: { opacity: 1, x: 0 },
                          exit: { opacity: 0, x: -16 },
                          transition: { duration: 0.25 },
                        })}
                        className="space-y-4"
                      >
                        {/* Email */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                          >
                            <Mail
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                              aria-hidden="true"
                            />
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
                                onChange: (e) =>
                                  handleInputChange("email", e.target.value),
                              })}
                              id="email"
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              className={`block w-full rounded-lg border ${
                                errors.email
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm outline-none`}
                              placeholder="correo@ejemplo.com"
                              aria-invalid={Boolean(errors.email)}
                              aria-describedby={
                                errors.email ? "email-error" : undefined
                              }
                            />
                            {errors.email && (
                              <div
                                className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                                aria-hidden="true"
                              >
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {errors.email && (
                            <p
                              id="email-error"
                              className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                              role="alert"
                            >
                              <AlertCircle
                                className="h-3 w-3"
                                aria-hidden="true"
                              />{" "}
                              {errors.email.message as string}
                            </p>
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
                              {...register("password", {
                                required: "La contraseña es requerida",
                                pattern: {
                                  value:
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?:{}|])(?!.*[<>]).{8,}$/,
                                  message:
                                    "Incluye mayúsculas, minúsculas, número y un carácter especial",
                                },
                                onChange: (e) => {
                                  const val = e.target.value;
                                  setPassword(val);
                                  setValue("password", val, {
                                    shouldValidate: true,
                                  });
                                  clearErrors("password");
                                  clearErrors("confirmPassword");
                                },
                              })}
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              autoComplete="new-password"
                              className={`block w-full rounded-lg border ${
                                errors.password
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm outline-none`}
                              placeholder="••••••••"
                              aria-invalid={Boolean(errors.password)}
                              aria-describedby={
                                errors.password
                                  ? "password-error"
                                  : "password-help"
                              }
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
                              tabIndex={0}
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                          {errors.password ? (
                            <p
                              id="password-error"
                              className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                              role="alert"
                            >
                              <AlertCircle
                                className="h-3 w-3"
                                aria-hidden="true"
                              />
                              {errors.password.message as string}
                            </p>
                          ) : (
                            <p id="password-help" className="sr-only">
                              Debe tener 8+ caracteres, mayúsculas, minúsculas,
                              número y carácter especial.
                            </p>
                          )}

                          {/* Indicador de fortaleza */}
                          {password && (
                            <div
                              className="mt-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                              aria-live="polite"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <Shield
                                    className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400"
                                    aria-hidden="true"
                                  />
                                  Fortaleza de la contraseña:
                                </span>
                                <span
                                  className={`text-xs font-medium ${strengthColor.replace(
                                    "bg-",
                                    "text-"
                                  )}`}
                                >
                                  {strengthLabel}
                                </span>
                              </div>
                              <div
                                className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={passwordStrength}
                                aria-valuetext={`Fortaleza ${strengthLabel}`}
                              >
                                <div
                                  className={`h-full rounded-full ${strengthColor}`}
                                  style={{ width: `${passwordStrength}%` }}
                                />
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
                                          aria-hidden="true"
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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                          >
                            <Lock
                              className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                              aria-hidden="true"
                            />
                            Confirmar contraseña
                          </Label>
                          <div className="relative">
                            <input
                              {...register("confirmPassword", {
                                required:
                                  "La confirmación de la contraseña es requerida",
                                validate: (value) =>
                                  value === getValues("password") ||
                                  "Las contraseñas no coinciden",
                              })}
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              className={`block w-full rounded-lg border ${
                                errors.confirmPassword
                                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-600 focus:border-blue-600"
                              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 shadow-sm outline-none`}
                              placeholder="••••••••"
                              aria-invalid={Boolean(errors.confirmPassword)}
                              aria-describedby={
                                errors.confirmPassword
                                  ? "confirm-error"
                                  : undefined
                              }
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                              onClick={() => setShowConfirmPassword((s) => !s)}
                              aria-pressed={showConfirmPassword}
                              aria-label={
                                showConfirmPassword
                                  ? "Ocultar confirmación"
                                  : "Mostrar confirmación"
                              }
                              tabIndex={0}
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                          {errors.confirmPassword && (
                            <p
                              id="confirm-error"
                              className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5"
                              role="alert"
                            >
                              <AlertCircle
                                className="h-3 w-3"
                                aria-hidden="true"
                              />{" "}
                              {errors.confirmPassword.message as string}
                            </p>
                          )}
                        </div>

                        {/* Términos */}
                        <div className="space-y-3 mt-6">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 pt-0.5">
                                <input
                                  id="acceptTerms"
                                  type="checkbox"
                                  checked={acceptTerms}
                                  onChange={(e) =>
                                    setAcceptTerms(e.target.checked)
                                  }
                                  className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-600 focus:ring-2"
                                  aria-describedby={
                                    !acceptTerms ? "terms-hint" : undefined
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <label
                                  htmlFor="acceptTerms"
                                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                                >
                                  Acepto los{" "}
                                  <NavLink
                                    to="/terminos"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline underline-offset-2"
                                  >
                                    Términos y Condiciones
                                  </NavLink>
                                  , el{" "}
                                  <NavLink
                                    to="/aviso-privacidad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline underline-offset-2"
                                  >
                                    Aviso de Privacidad
                                  </NavLink>{" "}
                                  y el{" "}
                                  <NavLink
                                    to="/deslinde-legal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline underline-offset-2"
                                  >
                                    Deslinde Legal
                                  </NavLink>
                                  .
                                </label>
                                <p
                                  id="terms-hint"
                                  className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                                >
                                  Es necesario aceptar estos documentos para
                                  crear tu cuenta.
                                </p>
                              </div>
                            </div>
                            {!acceptTerms && (
                              <motion.div
                                {...animateOrNot({
                                  initial: { opacity: 0, height: 0 },
                                  animate: { opacity: 1, height: "auto" },
                                })}
                                className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"
                                role="alert"
                              >
                                <AlertCircle
                                  className="h-3 w-3 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span>
                                  Debes aceptar los términos para continuar
                                </span>
                              </motion.div>
                            )}
                          </div>
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
                        className="px-5 py-2.5 text-blue-700 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        onClick={() => setCurrentStep(1)}
                      >
                        <MoveLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                        Atrás
                      </button>
                    )}
                    <motion.button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                      disabled={
                        currentStep === 2 && (isSubmitting || !acceptTerms)
                      }
                      aria-busy={isSubmitting}
                      {...animateOrNot({
                        whileHover: { scale: 1.02 },
                        whileTap: { scale: 0.98 },
                      })}
                    >
                      {currentStep === 2 ? (
                        isSubmitting ? (
                          <>
                            <Loader2
                              className="animate-spin h-4 w-4 mr-2"
                              aria-hidden="true"
                            />
                            <span>Procesando…</span>
                          </>
                        ) : (
                          <>
                            <span>Crear cuenta</span>
                            <CheckCircle
                              className="h-4 w-4 ml-2"
                              aria-hidden="true"
                            />
                          </>
                        )
                      ) : (
                        <>
                          <span>Siguiente</span>
                          <MoveRight
                            className="h-4 w-4 ml-2"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Enlace de inicio de sesión */}
                  <div className="mt-8 text-center">
                    <p className="text-gray-700 dark:text-gray-300">
                      ¿Ya tienes una cuenta?{" "}
                      <NavLink
                        to="/login"
                        className="text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                      >
                        Iniciar sesión
                      </NavLink>
                    </p>
                  </div>

                  {/* Sello de seguridad */}
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-700 dark:text-gray-300">
                      <Shield
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
                      <span>Tus datos están protegidos</span>
                    </div>
                  </div>
                </form>
              </section>
            </motion.div>
          </section>
        </div>
      </main>
    </>
  );
}
