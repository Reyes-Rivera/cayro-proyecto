"use client";
import { useFormContext } from "react-hook-form";
import { useMemo, useCallback } from "react";
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

// Definir tipos para los campos del formulario
interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface FormFieldConfig {
  label: string;
  icon: React.ComponentType<any>;
  type: "text" | "email" | "tel" | "date" | "select";
  placeholder?: string;
  options?: readonly SelectOption[];
  validation: any;
}

// Constantes fuera del componente para evitar recreación
const FORM_FIELDS: Record<string, FormFieldConfig> = {
  name: {
    label: "Nombre",
    icon: User,
    type: "text",
    placeholder: "Ej: Juan",
    validation: {
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
    },
  },
  surname: {
    label: "Apellido",
    icon: User,
    type: "text",
    placeholder: "Ej: Pérez",
    validation: {
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
    },
  },
  email: {
    label: "Email",
    icon: Mail,
    type: "email",
    placeholder: "Ej: juan.perez@example.com",
    validation: {
      required: "El email es obligatorio",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "El email no es válido",
      },
    },
  },
  phone: {
    label: "Teléfono",
    icon: Phone,
    type: "tel",
    placeholder: "Ej: 1234567890",
    validation: {
      required: "El teléfono es obligatorio",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "El teléfono debe tener 10 dígitos",
      },
    },
  },
  birthdate: {
    label: "Fecha de Nacimiento",
    icon: Calendar,
    type: "date",
    validation: {
      required: "La fecha de nacimiento es obligatoria",
    },
  },
  gender: {
    label: "Género",
    icon: UserCircle,
    type: "select",
    options: genderOptions,
    validation: {
      required: "El género es obligatorio",
    },
  },
  role: {
    label: "Rol",
    icon: Shield,
    type: "select",
    options: roleOptions,
    validation: {
      required: "El rol es obligatorio",
    },
  },
  active: {
    label: "Estado del Empleado",
    icon: CheckCircle,
    type: "select",
    options: [
      { value: "true", label: "Activo - Trabaja actualmente" },
      { value: "false", label: "Inactivo - Ya no trabaja aquí" },
    ] as const,
    validation: {
      required: "El estado es obligatorio",
    },
  },
};

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

  // Memoized form title and icon
  const formConfig = useMemo(
    () => ({
      isEditing: editId !== null,
      title: editId !== null ? "Editar Empleado" : "Agregar Empleado",
      icon: editId !== null ? Edit : Plus,
      submitText: editId !== null ? "Actualizar" : "Agregar",
    }),
    [editId]
  );

  // Memoized password validation
  const passwordValidation = useMemo(
    () => ({
      required: editId === null ? "La contraseña es obligatoria" : false,
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
          !containsSequentialPatterns(value) ||
          "No debe contener secuencias obvias",
        noInvalidChars: (value: string) =>
          !value ||
          !/[<>'"`]/.test(value) ||
          "No debe contener caracteres como < > ' \" `",
      },
    }),
    [editId]
  );

  // Componente de campo de formulario reutilizable
  const FormField = useCallback(
    ({
      fieldKey,
      fieldConfig,
    }: {
      fieldKey: keyof EmployeeFormData;
      fieldConfig: FormFieldConfig;
    }) => {
      const Icon = fieldConfig.icon;
      const error = errors[fieldKey];

      const baseClasses = `w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
        error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
          : "border-gray-300 dark:border-gray-600"
      }`;

      return (
        <div>
          <label
            htmlFor={fieldKey}
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            <Icon
              className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            {fieldConfig.label} *
          </label>

          {fieldConfig.type === "select" ? (
            <select
              id={fieldKey}
              {...register(fieldKey, fieldConfig.validation)}
              className={baseClasses}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${fieldKey}-error` : undefined}
            >
              <option value="">
                Selecciona {fieldConfig.label.toLowerCase()}
              </option>
              {fieldConfig.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={fieldKey}
              {...register(fieldKey, fieldConfig.validation)}
              type={fieldConfig.type}
              placeholder={fieldConfig.placeholder}
              className={baseClasses}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `${fieldKey}-error` : undefined}
              autoFocus={fieldKey === "name"}
            />
          )}

          {error && (
            <p
              id={`${fieldKey}-error`}
              className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              {error.message as string}
            </p>
          )}
        </div>
      );
    },
    [register, errors]
  );

  // Componente de campo de contraseña
  const PasswordField = useCallback(
    ({
      fieldKey,
      label,
      showPassword: show,
      onToggleVisibility,
      validation,
    }: {
      fieldKey: "password" | "confirmPassword";
      label: string;
      showPassword: boolean;
      onToggleVisibility: () => void;
      validation: any;
    }) => {
      const error = errors[fieldKey];

      return (
        <div>
          <label
            htmlFor={fieldKey}
            className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
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
              placeholder={
                fieldKey === "password"
                  ? "Ingrese contraseña"
                  : "Confirme contraseña"
              }
              className={`w-full px-3 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
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
            <p
              id={`${fieldKey}-error`}
              className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              {error.message}
            </p>
          )}
        </div>
      );
    },
    [register, errors]
  );

  // Estado visual memoizado
  const statusDisplay = useMemo(
    () =>
      isActive ? (
        <div
          className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-xs"
          role="status"
          aria-label="Empleado activo"
        >
          <CheckCircle className="w-3 h-3" aria-hidden="true" />
          <span>Empleado Activo</span>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-xs"
          role="status"
          aria-label="Empleado inactivo"
        >
          <XCircle className="w-3 h-3" aria-hidden="true" />
          <span>Empleado Inactivo</span>
        </div>
      ),
    [isActive]
  );

  const FormIcon = formConfig.icon;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      role="form"
      aria-label={`Formulario para ${formConfig.title.toLowerCase()}`}
    >
      {/* Header */}
      <div className="bg-blue-500 p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 sm:gap-3">
            <div
              className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm"
              aria-hidden="true"
            >
              <FormIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {formConfig.title}
          </h1>

          <div className="flex items-center gap-2">
            {formConfig.isEditing && (
              <button
                onClick={() => setShowPasswordUpdateForm(true)}
                className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
                aria-label="Actualizar contraseña del empleado"
              >
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="hidden sm:inline">Actualizar Contraseña</span>
              </button>
            )}
            <button
              onClick={closeForm}
              className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
              aria-label="Volver a la lista de empleados"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
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
            <FormField fieldKey="name" fieldConfig={FORM_FIELDS.name} />
            <FormField fieldKey="email" fieldConfig={FORM_FIELDS.email} />
            <FormField
              fieldKey="birthdate"
              fieldConfig={FORM_FIELDS.birthdate}
            />
            <FormField fieldKey="gender" fieldConfig={FORM_FIELDS.gender} />

            {/* Estado - Mostrar solo cuando corresponda */}
            {(editId === null || editId) && (
              <div>
                <FormField fieldKey="active" fieldConfig={FORM_FIELDS.active} />
                {/* Indicador visual del estado */}
                <div className="mt-2 flex items-center gap-2">
                  {statusDisplay}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <FormField fieldKey="surname" fieldConfig={FORM_FIELDS.surname} />
            <FormField fieldKey="phone" fieldConfig={FORM_FIELDS.phone} />

            {/* Contraseña - Solo mostrar si es nuevo empleado */}
            {editId === null && (
              <>
                <PasswordField
                  fieldKey="password"
                  label="Contraseña"
                  showPassword={showPassword}
                  onToggleVisibility={() => setShowPassword(!showPassword)}
                  validation={passwordValidation}
                />
                <PasswordStrengthIndicator
                  password={newPassword}
                  passwordChecks={passwordChecks}
                  passwordStrength={passwordStrength}
                  errors={errors}
                />

                <PasswordField
                  fieldKey="confirmPassword"
                  label="Confirmar Contraseña"
                  showPassword={showConfirmPassword}
                  onToggleVisibility={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  validation={{
                    required: "La confirmación de contraseña es obligatoria",
                    validate: (value: string) =>
                      !newPassword ||
                      value === newPassword ||
                      "Las contraseñas no coinciden",
                  }}
                />
              </>
            )}

            <FormField fieldKey="role" fieldConfig={FORM_FIELDS.role} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={closeForm}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 sm:px-5 py-2 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 order-1 sm:order-2"
            aria-label={
              isLoading ? "Procesando formulario" : formConfig.submitText
            }
          >
            {isLoading ? (
              <>
                <Loader2
                  className="animate-spin h-3.5 w-3.5 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Save
                  className="h-3.5 w-3.5 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
                <span>{formConfig.submitText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
