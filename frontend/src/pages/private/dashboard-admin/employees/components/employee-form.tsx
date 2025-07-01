"use client";
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
  Mail,
  Phone,
  Calendar,
  UserCircle,
  Shield,
  CheckCircle,
  XCircle,
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
  const isActive = watch("active", true);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-500 p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 sm:gap-3">
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
              <button
                onClick={() => setShowPasswordUpdateForm(true)}
                className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Actualizar Contraseña</span>
              </button>
            )}
            <button
              onClick={closeForm}
              className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                Nombre *
              </label>
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
                type="text"
                placeholder="Ej: Juan"
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                Email *
              </label>
              <input
                {...register("email", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "El email no es válido",
                  },
                })}
                type="email"
                placeholder="Ej: juan.perez@example.com"
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                Fecha de Nacimiento *
              </label>
              <input
                {...register("birthdate", {
                  required: "La fecha de nacimiento es obligatoria",
                })}
                type="date"
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.birthdate
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              />
              {errors.birthdate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.birthdate.message}
                </p>
              )}
            </div>

            {/* Género */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <UserCircle className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                Género *
              </label>
              <select
                {...register("gender", {
                  required: "El género es obligatorio",
                })}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.gender
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              >
                <option value="">Selecciona un género</option>
                {genderOptions.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Estado Activo/Inactivo */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isActive ? (
                  <CheckCircle className="w-4 h-4 inline mr-2 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 inline mr-2 text-red-600 dark:text-red-400" />
                )}
                Estado del Empleado *
              </label>
              <select
                {...register("active", {
                  required: "El estado es obligatorio",
                })}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.active
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              >
                <option value="">Selecciona el estado</option>
                <option value="true">Activo - Trabaja actualmente</option>
                <option value="false">Inactivo - Ya no trabaja aquí</option>
              </select>
              {errors.active && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.active.message}
                </p>
              )}

              {/* Indicador visual del estado */}
              <div className="mt-2 flex items-center gap-2">
                {isActive ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Empleado Activo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-xs">
                    <XCircle className="w-3 h-3" />
                    <span>Empleado Inactivo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Apellido */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                Apellido *
              </label>
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
                type="text"
                placeholder="Ej: Pérez"
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.surname
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              />
              {errors.surname && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.surname.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                Teléfono *
              </label>
              <input
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "El teléfono debe tener 10 dígitos",
                  },
                })}
                type="tel"
                placeholder="Ej: 1234567890"
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Contraseña - Solo mostrar si es nuevo empleado */}
            {editId === null && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Contraseña *
                </label>
                <div className="relative">
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingrese contraseña"
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
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                  Confirmar Contraseña *
                </label>
                <div className="relative">
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
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme contraseña"
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
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {/* Rol */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Shield className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
                Rol *
              </label>
              <select
                {...register("role", {
                  required: "El rol es obligatorio",
                })}
                className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                  errors.role
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              >
                <option value="">Selecciona un rol</option>
                {roleOptions.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={closeForm}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-xs sm:text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all flex items-center gap-1 sm:gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
