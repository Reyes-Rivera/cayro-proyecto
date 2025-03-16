export interface Employee {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string;
  password?: string;
  gender: string;
  role: string;
}

export interface EmployeeFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthdate: string;
  password: string;
  confirmPassword: string;
  gender: string;
  role: string;
}

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export type SortOption = {
  label: string;
  value: string;
  direction: "asc" | "desc";
};

export interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  noSequential: boolean;
  noInvalidChars: boolean;
}
