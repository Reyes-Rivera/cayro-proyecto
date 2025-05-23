// Regular expressions for validation
export const REGEX = {
    // Prevents SQL injection characters and HTML tags
    NO_SQL_INJECTION: /^[^<>'";`]*$/,
    
    // Basic email validation
    EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    
    // Only allow letters, spaces, and common name characters
    NAME: /^[A-Za-zÀ-ÖØ-öø-ÿ\s.\-']+$/,
  };
  
  // Error messages
  export const ERROR_MESSAGES = {
    required: 'Este campo es obligatorio',
    email: 'Por favor, introduce un correo electrónico válido',
    minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
    maxLength: (max: number) => `No debe exceder los ${max} caracteres`,
    pattern: 'Contiene caracteres no permitidos',
    sqlInjection: 'No se permiten caracteres especiales como < > \' " ;'
  };
  
  // Validates if a string contains SQL injection characters
  export const hasSqlInjectionChars = (value: string): boolean => {
    return !REGEX.NO_SQL_INJECTION.test(value);
  };
