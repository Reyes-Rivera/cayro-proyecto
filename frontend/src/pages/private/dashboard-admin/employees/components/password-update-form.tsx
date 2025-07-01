"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import {
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Save,
  X,
  Loader2,
} from "lucide-react";
import type { Employee, PasswordFormData } from "../types/employee";
import PasswordStrengthIndicator from "./password-strength-indicator";

interface PasswordUpdateFormProps {
  employee: Employee | null;
  isLoading: boolean;
  closeForm: () => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  passwordStrength: number;
  passwordChecks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    noSequential: boolean;
    noInvalidChars: boolean;
  };
}

const PasswordUpdateForm = ({
  employee,
  isLoading,
  closeForm,
  showPassword,
  showConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  passwordStrength,
  passwordChecks,
}: PasswordUpdateFormProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<PasswordFormData>();

  const password = watch("password", "");

  if (!employee) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Actualizar Contraseña
          </h2>
          <button
            onClick={closeForm}
            className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Info - Left Side */}
          <div className="space-y-6 bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                <Lock className="w-16 h-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                {employee.name} {employee.surname}
              </h3>

              <div className="w-full border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="space-y-4 w-full">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Correo
                    </label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.email}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Teléfono
                    </label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.phone}
                    </div>
                  </div>

                  {/* Birthdate */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Fecha de Nacimiento
                    </label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {new Date(employee.birthdate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Género
                    </label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.gender === "MALE"
                        ? "Masculino"
                        : employee.gender === "FEMALE"
                        ? "Femenino"
                        : "Otro"}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Rol
                    </label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Form - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Actualizar Contraseña
            </h2>

            <div className="space-y-6 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              {/* New Password */}
              <div className="space-y-1 w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "La contraseña es obligatoria",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres",
                      },
                      validate: {
                        hasUppercase: (value) =>
                          !value ||
                          /[A-Z]/.test(value) ||
                          "Debe contener al menos una letra mayúscula",
                        hasLowercase: (value) =>
                          !value ||
                          /[a-z]/.test(value) ||
                          "Debe contener al menos una letra minúscula",
                        hasNumber: (value) =>
                          !value ||
                          /[0-9]/.test(value) ||
                          "Debe contener al menos un número",
                        hasSpecial: (value) =>
                          !value ||
                          /[!@#$%^&*(),.?:{}|[\]\\]/.test(value) ||
                          "Debe contener al menos un carácter especial",
                        noSequential: (value) =>
                          !value ||
                          !/[<>'"`]/.test(value) ||
                          "No debe contener secuencias obvias",
                        noInvalidChars: (value) =>
                          !value ||
                          !/[<>'"`]/.test(value) ||
                          "No debe contener caracteres como < > ' \" `",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese nueva contraseña"
                    className={`w-full px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <PasswordStrengthIndicator
                  password={password}
                  passwordChecks={passwordChecks}
                  passwordStrength={passwordStrength}
                  errors={errors}
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1 w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Confirmar Nueva Contraseña *
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword", {
                      required: "La confirmación de contraseña es obligatoria",
                      validate: (value) =>
                        !password ||
                        value === password ||
                        "Las contraseñas no coinciden",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme nueva contraseña"
                    className={`w-full px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                      errors.confirmPassword
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
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
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-sm flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Actualizar Contraseña</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdateForm;
