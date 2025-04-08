"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, AlertCircle } from "lucide-react";
import type { PasswordChecks } from "../types/employee";
import { getStrengthColor, getStrengthName } from "../utils/password-utils";

interface PasswordStrengthIndicatorProps {
  password: string;
  passwordChecks: PasswordChecks;
  passwordStrength: number;
  errors?: {
    password?: {
      message?: string;
    };
  };
}

const PasswordStrengthIndicator = ({
  password,
  passwordChecks,
  passwordStrength,
  errors,
}: PasswordStrengthIndicatorProps) => {
  return (
    <>
      {errors?.password && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
        >
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
          {errors.password.message}
        </motion.p>
      )}

      {/* Password strength indicator - only show if password has content and not all requirements are met */}
      <AnimatePresence>
        {password && !Object.values(passwordChecks).every(Boolean) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-500" />
                  Fortaleza:
                </span>
                <span
                  className={`text-xs font-medium ${getStrengthColor(
                    passwordStrength
                  ).replace("bg-", "text-")}`}
                >
                  {getStrengthName(passwordStrength)}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${getStrengthColor(
                    passwordStrength
                  )}`}
                ></motion.div>
              </div>

              {/* Requisitos de contraseña */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                {[
                  { key: "length", label: "Mínimo 8 caracteres" },
                  {
                    key: "uppercase",
                    label: "Al menos una mayúscula",
                  },
                  {
                    key: "lowercase",
                    label: "Al menos una minúscula",
                  },
                  { key: "number", label: "Al menos un número" },
                  {
                    key: "special",
                    label: "Al menos un carácter especial",
                  },
                  {
                    key: "noSequential",
                    label: "Sin secuencias obvias",
                  },
                  {
                    key: "noInvalidChars",
                    label: "Sin caracteres < > ' \" `",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-1 text-xs"
                  >
                    {passwordChecks[item.key as keyof typeof passwordChecks] ? (
                      <Check className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs truncate ${
                        passwordChecks[item.key as keyof typeof passwordChecks]
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PasswordStrengthIndicator;
