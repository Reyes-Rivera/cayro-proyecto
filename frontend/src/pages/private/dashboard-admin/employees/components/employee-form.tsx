"use client";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import {
  Edit,
  Loader2,
  Save,
  User,
  Plus,
  AlertCircle,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { genderOptions, roleOptions } from "../constants/employee-constants";
import type { EmployeeFormData } from "../types/employee";
import PasswordStrengthIndicator from "./password-strength-indicator";
import { containsSequentialPatterns } from "../utils/password-utils";

interface EmployeeFormProps {
  editId: number | null;
  isLoading: boolean;
  closeForm: () => void;
  setShowPasswordUpdateForm: (show: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
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

const EmployeeForm = ({
  editId,
  isLoading,
  closeForm,
  setShowPasswordUpdateForm,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordStrength,
  passwordChecks,
}: EmployeeFormProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<EmployeeFormData>();

  const newPassword = watch("password", "");

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

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Encabezado del formulario */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
            {editId !== null ? (
              <>
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                Editar Empleado
              </>
            ) : (
              <>
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                Agregar Empleado
              </>
            )}
          </h2>
          <div className="flex items-center gap-2">
            {editId !== null && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPasswordUpdateForm(true)}
                className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Actualizar Contraseña</span>
              </motion.button>
            )}
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
      </div>

      {/* Contenido del formulario */}
      <div className="relative p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nombre
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  {...register("name", {
                    required: "El nombre es obligatorio",
                    minLength: {
                      value: 1,
                      message: "El nombre debe tener al menos un caracter",
                    },
                    maxLength: {
                      value: 50,
                      message: "El nombre no puede exceder los 50 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/,
                      message: "El nombre solo puede contener letras.",
                    },
                  })}
                  id="name"
                  type="text"
                  placeholder="Ej: Juan"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                  autoFocus
                />
                {errors.name && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "El email no es válido",
                    },
                  })}
                  id="email"
                  type="email"
                  placeholder="Ej: juan.perez@example.com"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label
                htmlFor="birthdate"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Fecha de Nacimiento
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  {...register("birthdate", {
                    required: "La fecha de nacimiento es obligatoria",
                  })}
                  id="birthdate"
                  type="date"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                />
                {errors.birthdate && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.birthdate && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.birthdate.message}
                </motion.p>
              )}
            </div>

            {/* Género */}
            <div>
              <label
                htmlFor="gender"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Género
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <select
                  {...register("gender", {
                    required: "El género es obligatorio",
                  })}
                  id="gender"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                >
                  <option value="">Selecciona un género</option>
                  {genderOptions.map((option:any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.gender && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.gender.message}
                </motion.p>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            {/* Apellido */}
            <div>
              <label
                htmlFor="surname"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Apellido
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  {...register("surname", {
                    required: "El apellido es obligatorio",
                    minLength: {
                      value: 1,
                      message: "El apellido debe tener al menos un caracter",
                    },
                    maxLength: {
                      value: 50,
                      message: "El apellido no puede exceder los 50 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/,
                      message: "El apellido solo puede contener letras.",
                    },
                  })}
                  id="surname"
                  type="text"
                  placeholder="Ej: Pérez"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                />
                {errors.surname && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.surname && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.surname.message}
                </motion.p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Teléfono
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  {...register("phone", {
                    required: "El teléfono es obligatorio",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "El teléfono debe tener 10 dígitos",
                    },
                  })}
                  id="phone"
                  type="tel"
                  placeholder="Ej: 1234567890"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                />
                {errors.phone && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.phone.message}
                </motion.p>
              )}
            </div>

            {/* Contraseña - Solo mostrar si es nuevo empleado */}
            {editId === null && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("password", {
                      required:
                        editId === null
                          ? "La contraseña es obligatoria"
                          : false,
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
                          !containsSequentialPatterns(value) ||
                          "No debe contener secuencias obvias",
                        noInvalidChars: (value) =>
                          !value ||
                          !/[<>'"`]/.test(value) ||
                          "No debe contener caracteres como < > ' \" `",
                      },
                    })}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese contraseña"
                    className="pl-12 pr-10 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
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
                  {errors.password && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    </div>
                  )}
                </div>

                <PasswordStrengthIndicator
                  password={newPassword}
                  passwordChecks={passwordChecks}
                  passwordStrength={passwordStrength}
                  errors={errors}
                />
              </div>
            )}

            {/* Confirmar Contraseña - Solo mostrar si es nuevo empleado */}
            {editId === null && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required:
                        editId === null
                          ? "La confirmación de contraseña es obligatoria"
                          : false,
                      validate: (value) =>
                        !newPassword ||
                        value === newPassword ||
                        "Las contraseñas no coinciden",
                    })}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme contraseña"
                    className="pl-12 pr-10 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                  >
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>
            )}

            {/* Rol */}
            <div>
              <label
                htmlFor="role"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Rol
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <select
                  {...register("role", {
                    required: "El rol es obligatorio",
                  })}
                  id="role"
                  className="pl-12 w-full py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus:outline-none shadow-sm text-sm"
                >
                  <option value="">Selecciona un rol</option>
                  {roleOptions.map((option:any) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.role && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  {errors.role.message}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 sm:mt-8 flex justify-end gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={closeForm}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-xs sm:text-sm"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium rounded-lg sm:rounded-xl shadow-md transition-all flex items-center gap-1 sm:gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                <span>{editId !== null ? "Actualizar" : "Agregar"}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeForm;
