import React from "react";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
      <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
