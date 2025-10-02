"use client";
import { useMemo, useCallback } from "react";
import {
  User,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  UserCircle,
  Shield,
  Edit,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Employee } from "../types/employee";
import { genderOptions, roleOptions } from "../constants/employee-constants";

interface EmployeeDetailsProps {
  employee: Employee;
  onBack: () => void;
  onEdit: (employee: Employee) => void;
  onPasswordUpdate: () => void;
}

// Constantes fuera del componente para evitar recreación
const DETAILS_SECTIONS = {
  personal: {
    title: "Información Personal",
    icon: User,
    fields: [
      { key: "name", label: "Nombre" },
      { key: "surname", label: "Apellido" },
      { key: "email", label: "Correo Electrónico", breakAll: true },
      { key: "phone", label: "Teléfono" },
      { key: "birthdate", label: "Fecha de Nacimiento", format: true },
      { key: "gender", label: "Género", format: true },
    ],
  },
  work: {
    title: "Información Laboral",
    icon: Shield,
    fields: [
      { key: "id", label: "ID de Empleado", prefix: "#" },
      { key: "role", label: "Rol", format: true },
      { key: "active", label: "Estado", status: true },
      { key: "fullName", label: "Nombre Completo", computed: true },
    ],
  },
} as const;

const EmployeeDetails = ({
  employee,
  onBack,
  onEdit,
  onPasswordUpdate,
}: EmployeeDetailsProps) => {
  // Helper function to get gender label - memoized
  const getGenderLabel = useCallback((value: string) => {
    const option = genderOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  }, []);

  // Helper function to get role label - memoized
  const getRoleLabel = useCallback((value: string) => {
    const option = roleOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  }, []);

  // Format date to a more readable format - memoized
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }, []);

  // Memoized computed values
  const computedValues = useMemo(
    () => ({
      fullName: `${employee.name} ${employee.surname}`,
      formattedBirthdate: formatDate(employee.birthdate),
      genderLabel: getGenderLabel(employee.gender),
      roleLabel: getRoleLabel(employee.role),
    }),
    [employee, formatDate, getGenderLabel, getRoleLabel]
  );

  // Memoized status display
  const statusDisplay = useMemo(
    () =>
      employee.active ? (
        <div
          className="flex items-center gap-2 text-green-600 dark:text-green-400"
          role="status"
          aria-label="Empleado activo"
        >
          <CheckCircle className="w-4 h-4" aria-hidden="true" />
          <span>Activo</span>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 text-red-600 dark:text-red-400"
          role="status"
          aria-label="Empleado inactivo"
        >
          <XCircle className="w-4 h-4" aria-hidden="true" />
          <span>Inactivo</span>
        </div>
      ),
    [employee.active]
  );

  // Get field value with formatting
  const getFieldValue = useCallback(
    (field: any) => {
      if (field.computed && field.key === "fullName") {
        return computedValues.fullName;
      }

      if (field.format) {
        if (field.key === "birthdate") return computedValues.formattedBirthdate;
        if (field.key === "gender") return computedValues.genderLabel;
        if (field.key === "role") return computedValues.roleLabel;
      }

      if (field.status && field.key === "active") {
        return statusDisplay;
      }

      const value = employee[field.key as keyof Employee];
      return field.prefix ? `${field.prefix}${value}` : value;
    },
    [employee, computedValues, statusDisplay]
  );

  // Contact info items memoized
  const contactItems = useMemo(
    () => [
      { icon: Mail, value: employee.email, label: "Correo electrónico" },
      { icon: Phone, value: employee.phone, label: "Teléfono" },
      {
        icon: Calendar,
        value: computedValues.formattedBirthdate,
        label: "Fecha de nacimiento",
      },
      { icon: UserCircle, value: computedValues.genderLabel, label: "Género" },
      { icon: Shield, value: computedValues.roleLabel, label: "Rol" },
    ],
    [employee, computedValues]
  );

  // Componente para ítem de información de contacto
  const ContactItem = useCallback(
    ({
      icon: Icon,
      value,
      label,
    }: {
      icon: React.ComponentType<any>;
      value: string;
      label: string;
    }) => (
      <div className="flex items-center gap-3" aria-label={label}>
        <Icon
          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 flex-shrink-0"
          aria-hidden="true"
        />
        <span className="text-gray-700 dark:text-gray-300 text-sm break-words flex-1">
          {value}
        </span>
      </div>
    ),
    []
  );

  // Componente para sección de detalles
  const DetailsSection = useCallback(
    ({
      section,
    }: {
      section: (typeof DETAILS_SECTIONS)[keyof typeof DETAILS_SECTIONS];
    }) => {
      const Icon = section.icon;

      return (
        <section
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-4 sm:p-6"
          aria-labelledby={`${section.title
            .toLowerCase()
            .replace(/\s+/g, "-")}-title`}
        >
          <h3
            id={`${section.title.toLowerCase().replace(/\s+/g, "-")}-title`}
            className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"
          >
            <Icon
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            {section.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {section.fields.map((field) => (
              <div key={field.key} className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {field.label}
                </p>
                <div
                  className={`text-gray-900 dark:text-white font-medium`}
                >
                  {getFieldValue(field)}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    },
    [getFieldValue]
  );

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      role="main"
      aria-label="Detalles del empleado"
    >
      {/* Header */}
      <div className="bg-blue-500 p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2 sm:gap-3">
            <div
              className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm"
              aria-hidden="true"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Detalles del Empleado
          </h1>
          <button
            onClick={onBack}
            className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
            aria-label="Volver a la lista de empleados"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </div>

      {/* Employee Profile */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left column - Profile summary */}
          <aside
            className="bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col items-center"
            aria-label="Resumen del perfil del empleado"
          >
            <div
              className="bg-blue-100 dark:bg-blue-900/30 p-4 sm:p-6 rounded-full mb-4"
              aria-hidden="true"
            >
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">
              {computedValues.fullName}
            </h2>

            {/* Estado del empleado */}
            <div className="mt-2 flex flex-col items-center gap-2">
              <div
                className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium"
                aria-label={`Rol: ${computedValues.roleLabel}`}
              >
                {computedValues.roleLabel}
              </div>

              {employee.active ? (
                <div
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm font-medium"
                  role="status"
                  aria-label="Empleado activo"
                >
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Empleado Activo</span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-sm font-medium"
                  role="status"
                  aria-label="Empleado inactivo"
                >
                  <XCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Empleado Inactivo</span>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="w-full mt-4 sm:mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="space-y-3">
                {contactItems.map((item, index) => (
                  <ContactItem
                    key={index}
                    icon={item.icon}
                    value={item.value}
                    label={item.label}
                  />
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 w-full">
              <button
                onClick={() => onEdit(employee)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-700"
                aria-label={`Editar información de ${computedValues.fullName}`}
              >
                <Edit className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">Editar</span>
              </button>
              <button
                onClick={onPasswordUpdate}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-700"
                aria-label={`Actualizar contraseña de ${computedValues.fullName}`}
              >
                <Lock className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">Contraseña</span>
              </button>
            </div>
          </aside>

          {/* Right column - Detailed information */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <DetailsSection section={DETAILS_SECTIONS.personal} />
            <DetailsSection section={DETAILS_SECTIONS.work} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
