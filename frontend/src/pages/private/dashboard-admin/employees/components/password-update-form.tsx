"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import {
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  SaveIcon,
  XIcon,
  Loader2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
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

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  if (!employee) return null;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Encabezado del formulario */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Actualizar Contraseña
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeForm}
            className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Volver</span>
          </motion.button>
        </div>
      </div>

      {/* Contenido del formulario - Diseño similar a ProfileSection */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del usuario - Lado izquierdo */}
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
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Correo
                    </Label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.email}
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Teléfono
                    </Label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.phone}
                    </div>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Fecha de Nacimiento
                    </Label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {new Date(employee.birthdate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Género */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Género
                    </Label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.gender === "MALE"
                        ? "Masculino"
                        : employee.gender === "FEMALE"
                        ? "Femenino"
                        : "Otro"}
                    </div>
                  </div>

                  {/* Rol */}
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-500 dark:text-gray-400">
                      Rol
                    </Label>
                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white">
                      {employee.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de contraseña - Lado derecho */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Actualizar Contraseña
            </h2>
            <div className="space-y-6 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              {/* Nueva Contraseña */}
              <div className="space-y-1 w-full">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
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
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese nueva contraseña"
                    className="pl-12 pr-10 w-full py-3 rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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

              {/* Confirmar Nueva Contraseña */}
              <div className="space-y-1 w-full">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required: "La confirmación de contraseña es obligatoria",
                      validate: (value) =>
                        !password ||
                        value === password ||
                        "Las contraseñas no coinciden",
                    })}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme nueva contraseña"
                    className="pl-12 pr-10 w-full py-3 rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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

              {/* Botones de acción */}
              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-md border border-gray-400 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-sm flex items-center gap-2"
                >
                  <XIcon className="w-5 h-5" />
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-5 w-5" />
                      <span>Actualizar Contraseña</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordUpdateForm;
