import { useState, useEffect } from "react";
import {
  Check,
  CheckCircleIcon,
  Eye,
  EyeOff,
  Lock,
  MoveLeft,
  MoveRight,
  Package,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/types/User";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { useAuth } from "@/context/AuthContextType";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Breadcrumbs from "@/components/web-components/Breadcrumbs";

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<User>();

  const navigate = useNavigate();

  useEffect(() => {

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|]/.test(password),
      noSequential: !containsSequentialPatterns(password), // Validar patrones secuenciales
    };
    setPasswordChecks(checks);
    setPasswordStrength(Object.values(checks).filter(Boolean).length * 20);
  }, [password, error]);

  // Detección de patrones secuenciales comunes
  const containsSequentialPatterns = (password: string): boolean => {
    // Patrones comunes a evitar
    const commonPatterns = [
      "1234",
      "abcd",
      "qwerty",
      "password",
      "1111",
      "aaaa",
    ];

    // Verificación básica de números y letras consecutivas
    const sequentialPatternRegex =
      /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef|defg|efgh|fghi)/;

    // Verifica si la contraseña contiene alguno de los patrones comunes
    return (
      commonPatterns.some((pattern) => password.includes(pattern)) ||
      sequentialPatternRegex.test(password)
    );
  };

  // Obtener color del progreso según la fortaleza
  const getStrengthColor = (strength: any) => {
    if (strength <= 20) return "bg-red-500";
    if (strength <= 40) return "bg-orange-500";
    if (strength <= 60) return "bg-yellow-500";
    if (strength <= 80) return "bg-lime-500";
    return "bg-green-500";
  };

  // Obtener descripción de la fortaleza de la contraseña
  const getStrengthName = (strength: any) => {
    if (strength <= 20) return "Muy débil";
    if (strength <= 40) return "Débil";
    if (strength <= 60) return "Moderada";
    if (strength <= 80) return "Fuerte";
    return "Muy fuerte";
  };

  // Manejador para limpiar errores al escribir
  const handleInputChange = (field: keyof User, value: string) => {
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
  const onSubmit = handleSubmit(async (data: User) => {
    if (currentStep === 2) {
      if (Object.values(passwordChecks).every(Boolean)) {
        if (
          !validatePasswordContent(
            password,
            data.name,
            data.surname,
            data.birthday.toString()
          )
        ) {
          Swal.fire({
            icon: "error",
            title: "Error de Contraseña",
            text: "La contraseña no debe contener partes de tu nombre, apellido o fecha de nacimiento.",
            confirmButtonColor: "#2F93D1",
          });
          return;
        }
        try {
          const res = await SignUp(
            data.name,
            data.surname,
            data.email,
            data.phone,
            data.birthday,
            data.password,
            data.gender
          );
          if (
            res !== null &&
            typeof res === "string" &&
            res === "El correo ya esta en uso."
          ) {
            setCurrentStep(2);
            return;
          }
          if (res === "Error desconocido al registrar.") {
            navigate("/500", { state: { fromError: true } });
            return;
          }
          if (res) {
            navigate("/codigo-verificacion");
          }
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Error en el servidor.",
            text: "Algo salió mal, por favor intenta más tarde.",
            confirmButtonColor: "#2F93D1",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de Contraseña",
          text: "La contraseña no cumple con todos los requisitos de seguridad.",
          confirmButtonColor: "#2F93D1",
        });
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  });
  return (
    <div className=" min-h-screen flex-col flex items-center justify-center p-4 pt-14 bg-gray-50 dark:bg-gray-900 ">
      <div className="w-full lg:pl-36">
        <Breadcrumbs />
      </div>
      <div className="w-full justify-center max-w-xl md:max-w-6xl flex bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden md:h-[630px] mt-8 md:mt-0">
        {/* Contenedor izquierdo */}

        <div className="hidden md:flex md:flex-col lg:justify-center bg-blue-600 dark:bg-gray-900 text-white w-full lg:w-1/2 p-10 justify-center">
          <h2 className="text-4xl font-extrabold mb-4">
            Bienvenido a <span className="text-blue-100">Cayro Uniformes</span>
          </h2>
          <p className="text-lg mb-8">
            Regístrate para acceder a ofertas exclusivas, gestionar tus pedidos
            y más.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full shadow-lg">
                <Check size={32} className="text-white" />
              </div>
              <p className="mt-3 text-sm text-white">Pedidos rápidos</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-green-400 to-green-600 rounded-full shadow-lg">
                <Lock size={32} className="text-white" />
              </div>
              <p className="mt-3 text-sm text-white">Seguridad garantizada</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full shadow-lg">
                <Package size={32} className="text-white" />
              </div>
              <p className="mt-3 text-sm text-white">Gestión personalizada</p>
            </div>
          </div>
        </div>

        {/* Contenedor derecho (Formulario de registro) */}
        <div className="md:w-1/2 p-10 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Crea tu cuenta en Cayro
            </h2>
          </div>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nombre
                    </Label>
                    <Input
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
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2"
                      placeholder="Ingresa tu nombre"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="apellidos"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Apellidos
                    </Label>
                    <Input
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
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2"
                      placeholder="Ingresa tus apellidos"
                    />
                    {errors.surname && (
                      <span className="text-xs text-red-500">
                        {errors.surname.message}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="fecha-nacimiento"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Fecha de nacimiento
                  </Label>
                  <Input
                    {...register("birthday", {
                      required: "La fecha de nacimiento es requerida",
                      validate: (value) =>
                        validateAge(value) ||
                        "Debes tener al menos 18 años para registrarte.",
                    })}
                    id="fecha-nacimiento"
                    type="date"
                    className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2"
                  />
                  {errors.birthday && (
                    <span className="text-xs text-red-500">
                      {errors.birthday.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="telefono"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Teléfono
                  </Label>
                  <Input
                    {...register("phone", {
                      required: "El teléfono es requerido",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message:
                          "El número de teléfono debe tener exactamente 10 caracteres",
                      },
                    })}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    id="telefono"
                    type="tel"
                    className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingresa tu teléfono"
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-500">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="sexo"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sexo
                  </Label>
                  <div className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 flex justify-between">
                    {[
                      {
                        id: "MALE",
                        value: "MALE",
                        label: "Masculino",
                      },
                      { id: "FEMALE", value: "FEMALE", label: "Femenino" },
                      { id: "OTHER", value: "OTHER", label: "Otro" },
                    ].map(({ id, value, label }) => (
                      <div className="flex items-center" key={id}>
                        <input
                          type="radio"
                          id={id}
                          value={value}
                          {...register("gender", {
                            required: "El sexo es requerido",
                          })}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Label
                          htmlFor={id}
                          className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.gender && (
                    <span className="text-xs text-red-500">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Correo electrónico
                  </Label>
                  <Input
                    {...register("email", {
                      required: "El correo electrónico es requerido",
                      pattern: {
                        value: /^(?!.*[<>])^\S+@\S+\.\S+$/,
                        message: "El correo electrónico no es válido",
                      },
                    })}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    id="email"
                    type="email"
                    className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ingresa tu correo"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-500">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      {...register("password", {
                        required: "La contraseña es requerida",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|])(?!.*[<>]).{8,}$/,
                          message:
                            'Introduce caracteres especiales como !@#$%^&*(),.?":{}|',
                        },
                      })}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearErrors("password");
                        clearErrors("confirmPassword");
                      }}
                      autoComplete="new-password"
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                      placeholder="contraseña"
                    />
                    <button
                      type="button"
                      className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500">
                      {errors.password.message}
                    </span>
                  )}

                  {!Object.values(passwordChecks).every(Boolean) &&
                    password && (
                      <>
                        <div className="mt-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-600">
                            <div
                              className={`h-full rounded-full ${getStrengthColor(
                                passwordStrength
                              )}`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                          <li
                            className={
                              passwordChecks.length ? "text-green-500" : ""
                            }
                          >
                            {passwordChecks.length ? (
                              <Check size={16} className="inline mr-1" />
                            ) : null}
                            Mínimo 8 caracteres
                          </li>
                          <li
                            className={
                              passwordChecks.uppercase ? "text-green-500" : ""
                            }
                          >
                            {passwordChecks.uppercase ? (
                              <Check size={16} className="inline mr-1" />
                            ) : null}
                            Al menos una mayúscula
                          </li>
                          <li
                            className={
                              passwordChecks.lowercase ? "text-green-500" : ""
                            }
                          >
                            {passwordChecks.lowercase ? (
                              <Check size={16} className="inline mr-1" />
                            ) : null}
                            Al menos una minúscula
                          </li>
                          <li
                            className={
                              passwordChecks.number ? "text-green-500" : ""
                            }
                          >
                            {passwordChecks.number ? (
                              <Check size={16} className="inline mr-1" />
                            ) : null}
                            Al menos un número
                          </li>
                          <li
                            className={
                              passwordChecks.special ? "text-green-500" : ""
                            }
                          >
                            {passwordChecks.special ? (
                              <Check size={16} className="inline mr-1" />
                            ) : null}
                            Al menos un carácter especial como: !@#$%^&*(),.?":
                            {}
                          </li>
                          <li
                            className={
                              passwordChecks.noSequential
                                ? "text-green-500"
                                : ""
                            }
                          >
                            {passwordChecks.noSequential ? (
                              <Check size={16} className="inline mr-1" />
                            ) : null}
                            Sin secuencias obvias como "12345" o "abcd"
                          </li>
                        </ul>
                      </>
                    )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <Label
                    htmlFor="password-confirm"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Input
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
                      className="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirmar contraseña"
                    />
                    <button
                      type="button"
                      className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer"
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
                    <span className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </>
            )}

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <div
              className={`flex ${
                currentStep === 1 ? "justify-end" : "justify-between"
              } ${currentStep === 2 && ""}`}
            >
              {currentStep > 1 && (
                <button
                  type="button"
                  className="px-4 py-2 text-blue-500 font-bold dark:text-gray-100 rounded-md flex items-center"
                  onClick={handleBack}
                >
                  <MoveLeft className="h-4 w-4 mr-2" />
                  Atrás
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 font-bold text-white rounded-md flex items-center"
              >
                <span>{currentStep === 2 ? "Confirmar" : "Siguiente"}</span>
                {currentStep === 2 ? (
                  <CheckCircleIcon className="h-4 w-4 ml-2" />
                ) : (
                  <MoveRight className="h-4 w-4 ml-2" />
                )}
              </button>
            </div>

            {currentStep === 1 && (
              <div className="flex  w-full">
                <div className="text-center w-full ">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    ¿Ya tienes una cuenta?{" "}
                    <NavLink
                      to="/login"
                      className="font-semibold text-blue-500 hover:text-blue-600"
                    >
                      Iniciar sesión
                    </NavLink>
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
