"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useMemo, useCallback } from "react";
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

// Constantes fuera del componente
const EMPLOYEE_INFO_FIELDS = [
  { key: "email", label: "Correo" },
  { key: "phone", label: "Teléfono" },
  { key: "birthdate", label: "Fecha de Nacimiento" },
  { key: "gender", label: "Género" },
  { key: "role", label: "Rol" },
] as const;

const animationVariants = {
  error: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
  },
};

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

  // Memoized employee data
  const employeeData = useMemo(() => {
    if (!employee) return null;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("es-ES");
    };

    const getGenderLabel = (gender: string) => {
      switch (gender) {
        case "MALE":
          return "Masculino";
        case "FEMALE":
          return "Femenino";
        default:
          return "Otro";
      }
    };

    return {
      name: `${employee.name} ${employee.surname}`,
      fields: {
        email: employee.email,
        phone: employee.phone,
        birthdate: formatDate(employee.birthdate),
        gender: getGenderLabel(employee.gender),
        role: employee.role,
      },
    };
  }, [employee]);

  // Memoized password validation
  const passwordValidation = useMemo(
    () => ({
      required: "La contraseña es obligatoria",
      minLength: {
        value: 8,
        message: "La contraseña debe tener al menos 8 caracteres",
      },
      validate: {
        hasUppercase: (value: string) =>
          !value ||
          /[A-Z]/.test(value) ||
          "Debe contener al menos una letra mayúscula",
        hasLowercase: (value: string) =>
          !value ||
          /[a-z]/.test(value) ||
          "Debe contener al menos una letra minúscula",
        hasNumber: (value: string) =>
          !value || /[0-9]/.test(value) || "Debe contener al menos un número",
        hasSpecial: (value: string) =>
          !value ||
          /[!@#$%^&*(),.?:{}|[\]\\]/.test(value) ||
          "Debe contener al menos un carácter especial",
        noSequential: (value: string) =>
          !value ||
          !/[<>'"`]/.test(value) ||
          "No debe contener secuencias obvias",
        noInvalidChars: (value: string) =>
          !value ||
          !/[<>'"`]/.test(value) ||
          "No debe contener caracteres como < > ' \" `",
      },
    }),
    []
  );

  // Memoized handlers
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword, setShowPassword]);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword, setShowConfirmPassword]);

  // Componente de campo de información del empleado
  const EmployeeInfoField = useCallback(
    ({
      fieldKey,
      label,
      value,
    }: {
      fieldKey: string;
      label: string;
      value: string;
    }) => (
      <div className="space-y-1">
        <label
          className="text-xs text-gray-500 dark:text-gray-400"
          htmlFor={`employee-${fieldKey}`}
        >
          {label}
        </label>
        <div
          id={`employee-${fieldKey}`}
          className="bg-gray-100 dark:bg-gray-600 p-3 rounded-md text-gray-900 dark:text-white"
          aria-label={`${label}: ${value}`}
        >
          {value}
        </div>
      </div>
    ),
    []
  );

  // Componente de campo de contraseña
  const PasswordField = useCallback(
    ({
      fieldKey,
      label,
      showPassword: show,
      onToggleVisibility,
      validation,
      placeholder,
      error,
    }: {
      fieldKey: "password" | "confirmPassword";
      label: string;
      showPassword: boolean;
      onToggleVisibility: () => void;
      validation: any;
      placeholder: string;
      error?: any;
    }) => {
      const baseClasses = `w-full px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 dark:border-gray-600"
      }`;

      return (
        <div className="space-y-1 w-full">
          <label
            htmlFor={fieldKey}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <Lock
              className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            {label} *
          </label>
          <div className="relative">
            <input
              id={fieldKey}
              {...register(fieldKey, validation)}
              type={show ? "text" : "password"}
              placeholder={placeholder}
              className={baseClasses}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${fieldKey}-error` : undefined}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              onClick={onToggleVisibility}
              aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={show}
            >
              {show ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {error && (
            <motion.p
              variants={animationVariants.error}
              initial="initial"
              animate="animate"
              id={`${fieldKey}-error`}
              className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
              role="alert"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {error.message}
            </motion.p>
          )}
        </div>
      );
    },
    [register]
  );

  if (!employee || !employeeData) return null;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      role="dialog"
      aria-label="Formulario de actualización de contraseña"
      aria-modal="true"
    >
      {/* Header */}
      <div className="bg-blue-500 p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 sm:gap-3">
            <div
              className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm"
              aria-hidden="true"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Actualizar Contraseña
          </h1>
          <button
            onClick={closeForm}
            className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
            aria-label="Volver al formulario principal"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Employee Info - Left Side */}
          <aside
            className="space-y-6 bg-gray-50 dark:bg-gray-700/30 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-600"
            aria-label="Información del empleado"
          >
            <div className="flex flex-col items-center space-y-4">
              <div
                className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full"
                aria-hidden="true"
              >
                <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white text-center">
                {employeeData.name}
              </h2>

              <div className="w-full border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="space-y-3 sm:space-y-4 w-full">
                  {EMPLOYEE_INFO_FIELDS.map((field) => (
                    <EmployeeInfoField
                      key={field.key}
                      fieldKey={field.key}
                      label={field.label}
                      value={employeeData.fields[field.key]}
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Password Form - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Actualizar Contraseña
            </h2>

            <div className="space-y-6 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-600">
              {/* New Password */}
              <PasswordField
                fieldKey="password"
                label="Nueva Contraseña"
                showPassword={showPassword}
                onToggleVisibility={togglePasswordVisibility}
                validation={passwordValidation}
                placeholder="Ingrese nueva contraseña"
                error={errors.password}
              />

              <PasswordStrengthIndicator
                password={password}
                passwordChecks={passwordChecks}
                passwordStrength={passwordStrength}
                errors={errors}
              />

              {/* Confirm New Password */}
              <PasswordField
                fieldKey="confirmPassword"
                label="Confirmar Nueva Contraseña"
                showPassword={showConfirmPassword}
                onToggleVisibility={toggleConfirmPasswordVisibility}
                validation={{
                  required: "La confirmación de contraseña es obligatoria",
                  validate: (value: string) =>
                    !password ||
                    value === password ||
                    "Las contraseñas no coinciden",
                }}
                placeholder="Confirme nueva contraseña"
                error={errors.confirmPassword}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-sm flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 order-2 sm:order-1"
                  aria-label="Cancelar actualización de contraseña"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 order-1 sm:order-2"
                  disabled={isLoading}
                  aria-label={
                    isLoading
                      ? "Actualizando contraseña..."
                      : "Actualizar contraseña"
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="animate-spin h-4 sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <Save
                        className="h-4  sm:w-5 sm:h-5"
                        aria-hidden="true"
                      />
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
