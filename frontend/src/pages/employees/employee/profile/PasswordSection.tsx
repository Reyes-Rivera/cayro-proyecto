"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Key,
  Eye,
  EyeOff,
  Check,
  Shield,
  Lock,
  AlertCircle,
  Save,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useForm } from "react-hook-form";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordSection() {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
    noInvalidChars: false,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>();

  const newPassword = watch("newPassword", "");

  // Validar la contraseña cuando cambia
  useEffect(() => {
    if (!newPassword) {
      setPasswordChecks({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
        noSequential: false,
        noInvalidChars: false,
      });
      setPasswordStrength(0);
      return;
    }

    const invalidCharsRegex = /[<>'"`]/;

    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?:{}|[\]\\]/.test(newPassword),
      noSequential: !containsSequentialPatterns(newPassword),
      noInvalidChars: !invalidCharsRegex.test(newPassword),
    };

    setPasswordChecks(checks);

    // Calcular la fortaleza (ahora con 7 verificaciones)
    const passedChecks = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(Math.floor((passedChecks / 7) * 100));
  }, [newPassword]);

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
      /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef)/i;
    return (
      commonPatterns.some((pattern) =>
        password.toLowerCase().includes(pattern.toLowerCase())
      ) || sequentialPatternRegex.test(password)
    );
  };

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

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true);

      // Validar que la nueva contraseña no tenga caracteres inválidos
      const invalidCharsRegex = /[<>'"`]/;
      if (invalidCharsRegex.test(data.newPassword)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La contraseña no puede contener caracteres especiales como < > ' \" `",
          confirmButtonColor: "#3B82F6",
        });
        setIsSubmitting(false);
        return;
      }

      // Validar que las contraseñas coincidan
      if (data.newPassword !== data.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Las contraseñas no coinciden.",
          confirmButtonColor: "#3B82F6",
        });
        setIsSubmitting(false);
        return;
      }

      // Validar que cumpla con todos los requisitos de seguridad
      if (!Object.values(passwordChecks).every(Boolean)) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La nueva contraseña no cumple con todos los requisitos de seguridad.",
          confirmButtonColor: "#3B82F6",
        });
        setIsSubmitting(false);
        return;
      }

      // Aquí iría la llamada a la API para actualizar la contraseña
      // await updatePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword
      // });

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Tu contraseña se ha actualizado correctamente.",
        confirmButtonColor: "#3B82F6",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Reiniciar el formulario
      reset();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Hubo un error al actualizar la contraseña.",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Encabezado */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Seguridad de la Cuenta</h1>
              <p className="text-blue-100">
                Actualiza tu contraseña para mantener tu cuenta segura
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tarjeta de información de seguridad */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Consejos de Seguridad
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Protege tu cuenta
              </h3>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                  Contraseña segura
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Utiliza una combinación de letras, números y símbolos. Evita
                  información personal fácil de adivinar.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                  Actualiza regularmente
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Cambia tu contraseña cada 3-6 meses para mantener tu cuenta
                  segura.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                  No compartas
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Nunca compartas tu contraseña con nadie ni la guardes en
                  lugares inseguros.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de cambio de contraseña */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Cambiar Contraseña
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Contraseña actual */}
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Key className="w-4 h-4 text-blue-500" />
                  Contraseña actual
                </Label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("currentPassword", {
                      required: "La contraseña actual es obligatoria",
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.currentPassword && (
                    <p className="text-sm text-red-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Nueva contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-blue-500" />
                  Nueva contraseña
                </Label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: "La nueva contraseña es obligatoria",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres",
                      },
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) ||
                          "Debe contener al menos una letra mayúscula",
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) ||
                          "Debe contener al menos una letra minúscula",
                        hasNumber: (value) =>
                          /[0-9]/.test(value) ||
                          "Debe contener al menos un número",
                        hasSpecial: (value) =>
                          /[!@#$%^&*(),.?:{}|[\]\\]/.test(value) ||
                          "Debe contener al menos un carácter especial",
                        noSequential: (value) =>
                          !containsSequentialPatterns(value) ||
                          "No debe contener secuencias obvias",
                        noInvalidChars: (value) =>
                          !/[<>'"`]/.test(value) ||
                          "No debe contener caracteres como < > ' \" `",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Ingresa tu nueva contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.newPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirmar nueva contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-bkue-500" />
                  Confirmar nueva contraseña
                </Label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      required: "La confirmación de contraseña es obligatoria",
                      validate: (value) =>
                        value === newPassword || "Las contraseñas no coinciden",
                    })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Indicador de fortaleza de contraseña */}
            {newPassword && (
              <div className="space-y-4">
                <div>
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
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full ${getStrengthColor(
                        passwordStrength
                      )}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requisitos de contraseña */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Requisitos de contraseña:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                    <li
                      className={`flex items-center ${
                        passwordChecks.length
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {passwordChecks.length ? (
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      Mínimo 8 caracteres
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordChecks.uppercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {passwordChecks.uppercase ? (
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      Al menos una mayúscula
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordChecks.lowercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {passwordChecks.lowercase ? (
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      Al menos una minúscula
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordChecks.number
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {passwordChecks.number ? (
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      Al menos un número
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordChecks.special
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {passwordChecks.special ? (
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      Al menos un carácter especial
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordChecks.noSequential
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {passwordChecks.noSequential ? (
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      Sin secuencias obvias
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordChecks.noInvalidChars
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {passwordChecks.noInvalidChars ? (
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      Sin caracteres &lt; &gt; ' " `
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Botón de guardar */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Guardar Contraseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
