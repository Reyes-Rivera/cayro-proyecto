"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import type { Employee } from "../types/employee";
import { genderOptions, roleOptions } from "../constants/employee-constants";

interface EmployeeDetailsProps {
  employee: Employee;
  onBack: () => void;
  onEdit: (employee: Employee) => void;
  onPasswordUpdate: () => void;
}

const EmployeeDetails = ({
  employee,
  onBack,
  onEdit,
  onPasswordUpdate,
}: EmployeeDetailsProps) => {
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

  // Helper function to get gender label
  const getGenderLabel = (value: string) => {
    const option = genderOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // Helper function to get role label
  const getRoleLabel = (value: string) => {
    const option = roleOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 p-4 sm:p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Detalles del Empleado
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="text-white hover:text-gray-200 transition-colors bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Volver</span>
          </motion.button>
        </div>
      </div>

      {/* Employee Profile */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left column - Profile summary */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 p-6 flex flex-col items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-4">
              <User className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center">
              {employee.name} {employee.surname}
            </h2>

            <div className="mt-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
              {getRoleLabel(employee.role)}
            </div>

            <div className="w-full mt-6 border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm break-all">
                    {employee.email}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {employee.phone}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {formatDate(employee.birthdate)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <UserCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {getGenderLabel(employee.gender)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {getRoleLabel(employee.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3 w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onEdit(employee)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onPasswordUpdate}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Contraseña</span>
              </motion.button>
            </div>
          </div>

          {/* Right column - Detailed information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Información Personal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nombre
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {employee.name}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Apellido
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {employee.surname}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Correo Electrónico
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium break-all">
                    {employee.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Teléfono
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {employee.phone}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Fecha de Nacimiento
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {formatDate(employee.birthdate)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Género
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {getGenderLabel(employee.gender)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Información Laboral
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ID de Empleado
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    #{employee.id}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Rol
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {getRoleLabel(employee.role)}
                  </p>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nombre Completo
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {employee.name} {employee.surname}
                  </p>
                </div>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetails;
