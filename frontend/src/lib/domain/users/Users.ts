import { z } from 'zod';

export interface Users{
    name: string;
    lastname: string;
    email: string;
    phone: string;
    password:string;
    confirmPassword?:string;
    birthdate: Date;
}

export const userSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres") 
    .max(30, "El nombre no puede tener más de 30 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras"),
  lastname: z
    .string()
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "El apellido solo puede contener letras"),
  email: z
    .string()
    .email("El correo electrónico no es válido")
    .nonempty("El correo electrónico es requerido"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "El número de teléfono debe tener exactamente 10 caracteres y solo contener números")
    .nonempty("El teléfono es requerido"),
  password: z
    .string()
    .min(12, "La contraseña debe tener al menos 12 caracteres")
    .nonempty("La contraseña es requerida"),
  date: z
    .preprocess((arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg), z.date())
});


export const updateUserSchema = userSchema.partial();

export interface UpdateUser extends Partial <Users>{
    
}

