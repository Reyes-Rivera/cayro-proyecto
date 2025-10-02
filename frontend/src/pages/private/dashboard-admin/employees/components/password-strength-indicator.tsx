"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useCallback } from "react";
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

// Constantes fuera del componente
const PASSWORD_REQUIREMENTS = [
  { key: "length", label: "Mínimo 8 caracteres" },
  { key: "uppercase", label: "Al menos una mayúscula" },
  { key: "lowercase", label: "Al menos una minúscula" },
  { key: "number", label: "Al menos un número" },
  { key: "special", label: "Al menos un carácter especial" },
  { key: "noSequential", label: "Sin secuencias obvias" },
  { key: "noInvalidChars", label: "Sin caracteres < > ' \" `" },
] as const;

const animationVariants = {
  error: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 }
  },
  container: {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 }
  },
  requirement: {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0 }
  },
  progressBar: {
    initial: { width: 0 },
    animate: { width: "100%" }
  }
};

const PasswordStrengthIndicator = ({
  password,
  passwordChecks,
  passwordStrength,
  errors,
}: PasswordStrengthIndicatorProps) => {
  // Memoized computed values
  const indicatorState = useMemo(() => {
    const hasPassword = !!password;
    const allRequirementsMet = Object.values(passwordChecks).every(Boolean);
    const shouldShowIndicator = hasPassword && !allRequirementsMet;
    const strengthColor = getStrengthColor(passwordStrength);
    const strengthName = getStrengthName(passwordStrength);
    const textColor = strengthColor.replace("bg-", "text-");

    return {
      hasPassword,
      allRequirementsMet,
      shouldShowIndicator,
      strengthColor,
      strengthName,
      textColor
    };
  }, [password, passwordChecks, passwordStrength]);

  // Memoized progress bar width
  const progressBarWidth = useMemo(() => 
    `${passwordStrength}%`, [passwordStrength]
  );

  // Componente de requisito de contraseña memoizado
  const PasswordRequirement = useCallback(({ 
    requirement, 
    index 
  }: { 
    requirement: typeof PASSWORD_REQUIREMENTS[number];
    index: number;
  }) => {
    const isMet = passwordChecks[requirement.key as keyof PasswordChecks];
    
    return (
      <motion.div
        key={requirement.key}
        variants={animationVariants.requirement}
        initial="initial"
        animate="animate"
        transition={{ delay: index * 0.05 }}
        className="flex items-center gap-1 text-xs"
        role="listitem"
        aria-label={`${requirement.label}: ${isMet ? 'cumplido' : 'pendiente'}`}
      >
        {isMet ? (
          <Check 
            className="w-3 h-3 text-green-500 dark:text-green-400 flex-shrink-0" 
            aria-hidden="true"
          />
        ) : (
          <div 
            className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0" 
            aria-hidden="true"
          />
        )}
        <span
          className={`text-xs truncate ${
            isMet
              ? "text-green-700 dark:text-green-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {requirement.label}
        </span>
      </motion.div>
    );
  }, [passwordChecks]);

  return (
    <>
      {/* Error Message */}
      {errors?.password && (
        <motion.p
          variants={animationVariants.error}
          initial="initial"
          animate="animate"
          className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center gap-1 mt-1"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
          {errors.password.message}
        </motion.p>
      )}

      {/* Password Strength Indicator */}
      <AnimatePresence>
        {indicatorState.shouldShowIndicator && (
          <motion.div
            variants={animationVariants.container}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="mt-2"
            role="region"
            aria-label="Indicador de fortaleza de contraseña"
          >
            <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              {/* Strength Header */}
              <div className="flex justify-between items-center mb-2">
                <span 
                  className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1"
                  aria-label="Nivel de fortaleza de la contraseña"
                >
                  <Shield className="w-3 h-3 text-blue-500" aria-hidden="true" />
                  Fortaleza:
                </span>
                <span
                  className={`text-xs font-medium ${indicatorState.textColor}`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {indicatorState.strengthName}
                </span>
              </div>

              {/* Progress Bar */}
              <div 
                className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                role="progressbar"
                aria-valuenow={passwordStrength}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Fortaleza de contraseña: ${passwordStrength}%`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: progressBarWidth }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${indicatorState.strengthColor}`}
                />
              </div>

              {/* Password Requirements */}
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2"
                role="list"
                aria-label="Requisitos de la contraseña"
              >
                {PASSWORD_REQUIREMENTS.map((requirement, index) => (
                  <PasswordRequirement
                    key={requirement.key}
                    requirement={requirement}
                    index={index}
                  />
                ))}
              </div>

              {/* Screen reader status update */}
              <div className="sr-only" aria-live="polite" aria-atomic="true">
                {indicatorState.allRequirementsMet 
                  ? "Todos los requisitos de contraseña cumplidos" 
                  : `Fortaleza de contraseña: ${indicatorState.strengthName}`
                }
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success state for screen readers */}
      {indicatorState.hasPassword && indicatorState.allRequirementsMet && (
        <div className="sr-only" role="status" aria-live="polite">
          Contraseña cumple todos los requisitos de seguridad
        </div>
      )}
    </>
  );
};

export default PasswordStrengthIndicator;
