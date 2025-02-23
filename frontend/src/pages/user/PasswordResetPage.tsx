import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import backgroundImage from "../web/Home/assets/hero.jpg";
import { CheckCircle, Check, EyeOff, Eye, Loader2 } from "lucide-react"; // Agregar Loader2
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { User } from "@/types/User";
import { useNavigate, useParams } from "react-router-dom";
import { restorePassword } from "@/api/auth";

export default function PasswordResetPage() {
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para el cargando

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<User>();

  const navigate = useNavigate();

  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSequential: !containsSequentialPatterns(password),
    };
    setPasswordChecks(checks);
    setPasswordStrength(Object.values(checks).filter(Boolean).length * 20);
  }, [password]);

  // Detección de patrones secuenciales comunes
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

  const { token } = useParams();
  const onSubmit = handleSubmit(async (data: User) => {
    if (Object.values(passwordChecks).every(Boolean)) {
      setIsLoading(true); 
      try {
        const res = await restorePassword(token, { password: data.password });
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Contraseña actualizada.",
            text: "Tu contraseña ha sido restablecida, por favor inicie sesión.",
            confirmButtonColor: "#2563EB",
          });
          navigate("/login");
          setIsSubmitted(true);
        }
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error de Contraseña.",
          text: error?.response?.data?.message,
          confirmButtonColor: "#2563EB",
        });
        navigate("/recuperar-password");
      } finally {
        setIsLoading(false); 
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error de Contraseña",
        text: "La contraseña no cumple con todos los requisitos de seguridad.",
        confirmButtonColor: "#2563EB",
      });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row items-center justify-center p-4 md:p-0 mt-14">
      <div className="w-full flex flex-col md:flex-row shadow-none border-none">
        {/* Columna Izquierda - Imagen de fondo con overlay oscuro */}
        <div
          className="hidden h-screen justify-center items-center md:flex md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 p-10 text-white">
            <h2 className="text-4xl font-bold mb-4 text-center">
              Recupera tu acceso a <br />
              <span className="text-blue-100">Cayro Uniformes</span>
            </h2>
            <p className="text-lg text-center mb-6 leading-relaxed">
              No te preocupes, te ayudaremos a recuperar tu contraseña en unos
              sencillos pasos.
            </p>
          </div>
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 lg:p-10 bg-white dark:bg-gray-900">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-white">
              Restablecer contraseña
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Crea una nueva contraseña para tu cuenta
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
            <form onSubmit={onSubmit} className="w-full max-w-md space-y-6 mt-6">
              {/* Campos del formulario */}
              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "La contraseña es requerida",
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
                    className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                    placeholder="contraseña"
                  />
                  <button
                    type="button"
                    className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}

                {!Object.values(passwordChecks).every(Boolean) && password && (
                  <>
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Fortaleza de la contraseña:
                        </span>
                        <span
                          className={`text-sm font-medium 
                                              ${getStrengthColor(
                                                passwordStrength
                                              ).replace("bg-", "text-")}`}
                        >
                          {getStrengthName(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${getStrengthColor(
                            passwordStrength
                          )}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-gray-500">
                      <li
                        className={passwordChecks.length ? "text-green-500" : ""}
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
                        className={passwordChecks.number ? "text-green-500" : ""}
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
                        Al menos un carácter especial como: !@#$%^&*(),.?":{}|
                      </li>
                      <li
                        className={
                          passwordChecks.noSequential ? "text-green-500" : ""
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

              <div>
                <Label
                  htmlFor="password-confirm"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <input
                    {...register("confirmPassword", {
                      required: "La confirmación de la contraseña es requerida",
                      validate: (value) =>
                        value === password || "Las contraseñas no coinciden",
                    })}
                    id="password-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-400 dark:border-gray-600 focus:ring-1 focus:ring-blue-600 p-3 active:border-none focus:border-none focus:outline-none"
                    placeholder="Confirmar contraseña"
                  />
                  <button
                    type="button"
                    className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  <span className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex justify-center items-center"
                disabled={isLoading} // Deshabilitar el botón mientras se carga
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Restableciendo...
                  </>
                ) : (
                  "Restablecer contraseña"
                )}
              </button>
            </form>
          ) : (
            <Alert className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 p-4 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <AlertTitle className="text-lg font-bold">
                Contraseña restablecida con éxito
              </AlertTitle>
              <AlertDescription className="mt-2">
                Tu nueva contraseña ha sido configurada. Ahora puedes iniciar sesión
                con tu nueva contraseña.
              </AlertDescription>
              <Button
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/login")}
              >
                Ir al inicio de sesión
              </Button>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}