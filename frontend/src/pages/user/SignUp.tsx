import { useState, useEffect } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from '@/types/User';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { useAuth } from '@/context/AuthContextType';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage() {
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSequential: false,
  });

  const { SignUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm<User>();

  const navigate = useNavigate();

  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSequential: !containsSequentialPatterns(password), // Validar patrones secuenciales
    };
    setPasswordChecks(checks);
    setPasswordStrength(Object.values(checks).filter(Boolean).length * 20);
  }, [password]);

  // Detección de patrones secuenciales comunes
  const containsSequentialPatterns = (password: string): boolean => {
    // Patrones comunes a evitar
    const commonPatterns = ["1234", "abcd", "qwerty", "password", "1111", "aaaa"];

    // Verificación básica de números y letras consecutivas
    const sequentialPatternRegex = /(01234|12345|23456|34567|45678|56789|67890|abcd|bcde|cdef|defg|efgh|fghi)/;

    // Verifica si la contraseña contiene alguno de los patrones comunes
    return commonPatterns.some(pattern => password.includes(pattern)) ||
           sequentialPatternRegex.test(password);
  };

  // Obtener color del progreso según la fortaleza
  const getStrengthColor = (strength: any) => {
    if (strength <= 20) return 'bg-red-500';
    if (strength <= 40) return 'bg-orange-500';
    if (strength <= 60) return 'bg-yellow-500';
    if (strength <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  // Obtener descripción de la fortaleza de la contraseña
  const getStrengthName = (strength: any) => {
    if (strength <= 20) return 'Muy débil';
    if (strength <= 40) return 'Débil';
    if (strength <= 60) return 'Moderada';
    if (strength <= 80) return 'Fuerte';
    return 'Muy fuerte';
  };

  // Manejador para limpiar errores al escribir
  const handleInputChange = (field: keyof User, value: string) => {
    setValue(field, value); // Actualiza el valor del campo en el formulario
    clearErrors(field); // Limpia los errores del campo si el usuario escribe
  };

  // Validar que la contraseña no contenga partes del nombre o la fecha de nacimiento
  const validatePasswordContent = (password: string, name: string, lastname: string, birthdate: string): boolean => {
    const lowercasePassword = password.toLowerCase();
    return (
      !lowercasePassword.includes(name.toLowerCase()) &&
      !lowercasePassword.includes(lastname.toLowerCase()) &&
      (birthdate ? !lowercasePassword.includes(birthdate.replace(/-/g, '')) : true)
    );
  };

  // Validar que el usuario tenga al menos 18 años
  const validateAge = (birthdate: Date): boolean => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  };

  // Manejador de envío del formulario
  const onSubmit = handleSubmit(async (data: User) => {
    if (!validatePasswordContent(password, data.name, data.surname, data.birthday.toString())) {
      Swal.fire({
        icon: 'error',
        title: 'Error de Contraseña',
        text: 'La contraseña no debe contener partes de tu nombre, apellido o fecha de nacimiento.',
        confirmButtonColor: '#2F93D1',
      });
      return;
    }

    if (Object.values(passwordChecks).every(Boolean)) {
      try {
        const res = await SignUp(data.name, data.surname, data.email, data.phone, data.birthday, data.password);
        if (res) {
          navigate("/verification-code");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de Contraseña',
        text: 'La contraseña no cumple con todos los requisitos de seguridad.',
        confirmButtonColor: '#2F93D1',
      });
    }
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-grow">
        <div className="w-full lg:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Crea tu cuenta en Cayro</h2>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</Label>
                  <Input
                    {...register("name", {
                      required: "El nombre es requerido",
                      minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" },
                      maxLength: { value: 30, message: "El nombre no puede tener más de 30 caracteres" },
                      pattern: { value: /^[a-zA-Z\s]+$/, message: "El nombre solo puede contener letras" },
                    })}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    id="nombre"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] focus:border-[#0099FF] focus:z-10 sm:text-sm mt-1"
                    placeholder="nombre"
                  />
                  {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
                </div>
                <div>
                  <Label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</Label>
                  <Input
                    {...register("surname", {
                      required: "El apellido es requerido",
                      minLength: { value: 3, message: "El apellido debe tener al menos 3 caracteres" },
                      maxLength: { value: 50, message: "El apellido no puede tener más de 50 caracteres" },
                      pattern: { value: /^[a-zA-Z\s]+$/, message: "El apellido solo puede contener letras" },
                    })}
                    onChange={(e) => handleInputChange('surname', e.target.value)}
                    id="apellidos"
                    type="text"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] focus:border-[rgb(0,153,255)] focus:z-10 sm:text-sm mt-1"
                    placeholder="apellidos"
                  />
                  {errors.surname && <span className="text-[10px] text-red-500">{errors.surname.message}</span>}
                </div>
              </div>

              {/* Teléfono y Correo */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</Label>
                  <Input
                    {...register("email", {
                      required: "El correo electrónico es requerido",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "El correo electrónico no es válido" },
                    })}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    id="email"
                    type="email"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] focus:border-[#0099FF] focus:z-10 sm:text-sm mt-1"
                    placeholder="correo"
                  />
                  {errors.email && <span className="text-[10px] text-red-500">{errors.email.message}</span>}
                </div>
                <div>
                  <Label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</Label>
                  <Input
                    {...register("phone", {
                      required: "El teléfono es requerido",
                      pattern: { value: /^[0-9]{10}$/, message: "El número de teléfono debe tener exactamente 10 caracteres" },
                    })}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    id="telefono"
                    type="tel"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] focus:border-[#0099FF] focus:z-10 sm:text-sm mt-1"
                    placeholder="telefono"
                  />
                  {errors.phone && <span className="text-[10px] text-red-500">{errors.phone.message}</span>}
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <Label htmlFor="fecha-nacimiento" className="block text-sm font-medium text-gray-700">Fecha de nacimiento</Label>
                <Input
                  {...register("birthday", {
                    required: "La fecha de nacimiento es requerida",
                    validate: (value) => validateAge(value) || "Debes tener al menos 18 años para registrarte.",
                  })}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  id="fecha-nacimiento"
                  type="date"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] focus:border-[#0099FF] focus:z-10 sm:text-sm mt-1"
                />
                {errors.birthday && <span className="text-[10px] text-red-500">{errors.birthday.message}</span>}
              </div>

              {/* Contraseña */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</Label>
                <div className="relative">
                  <Input
                    {...register("password", { required: "La contraseña es requerida" })}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearErrors("password");
                    }}
                    autoComplete="new-password"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] focus:border-[#0099FF] focus:z-10 sm:text-sm mt-1"
                    placeholder="contraseña"
                  />
                  <button
                    type="button"
                    className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="text-[10px] text-red-500">{errors.password.message}</span>}

                {!Object.values(passwordChecks).every(Boolean) && password && (
                  <>
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Fortaleza de la contraseña:</span>
                        <span className={`text-sm font-medium ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                          {getStrengthName(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${getStrengthColor(passwordStrength)}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-gray-500">
                      <li className={passwordChecks.length ? 'text-green-500' : ''}>
                        {passwordChecks.length ? <Check size={16} className="inline mr-1" /> : null}
                        Mínimo 8 caracteres
                      </li>
                      <li className={passwordChecks.uppercase ? 'text-green-500' : ''}>
                        {passwordChecks.uppercase ? <Check size={16} className="inline mr-1" /> : null}
                        Al menos una mayúscula
                      </li>
                      <li className={passwordChecks.lowercase ? 'text-green-500' : ''}>
                        {passwordChecks.lowercase ? <Check size={16} className="inline mr-1" /> : null}
                        Al menos una minúscula
                      </li>
                      <li className={passwordChecks.number ? 'text-green-500' : ''}>
                        {passwordChecks.number ? <Check size={16} className="inline mr-1" /> : null}
                        Al menos un número
                      </li>
                      <li className={passwordChecks.special ? 'text-green-500' : ''}>
                        {passwordChecks.special ? <Check size={16} className="inline mr-1" /> : null}
                        Al menos un carácter especial como: !@#$%^&*(),.?":{ }|<></>
                      </li>
                      <li className={passwordChecks.noSequential ? 'text-green-500' : ''}>
                        {passwordChecks.noSequential ? <Check size={16} className="inline mr-1" /> : null}
                        Sin secuencias obvias como "12345" o "abcd"
                      </li>
                    </ul>
                  </>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <Label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">Confirmar contraseña</Label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword", {
                      required: "La confirmación de la contraseña es requerida",
                      validate: (value) => value === password || "Las contraseñas no coinciden",
                    })}
                    id="password-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`appearance-none rounded-md relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] focus:z-10 sm:text-sm mt-1`}
                    placeholder="Confirmar contraseña"
                  />
                  <button
                    type="button"
                    className="absolute z-40 inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-red-500 text-[10px]">{errors.confirmPassword.message}</span>}
              </div>

              <Button type="submit" className="w-full bg-[#2F93D1] hover:bg-[#007ACC] focus:ring-[#0099FF] text-white">
                Crear cuenta
              </Button>
            </form>

            {/* Registro con Google */}
            <div className="text-center mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                </div>
              </div>
              <Button variant="outline" className="rounded-full w-32 mt-4">
                <svg className="w-5 h-5" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_13183_10121)">
                    <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8" />
                    <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853" />
                    <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04" />
                    <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335" />
                  </g>
                  <defs>
                    <clipPath id="clip0_13183_10121">
                      <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </div>

            <p className="mt-2 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="font-medium text-[#2F93D1] hover:text-[#007ACC]">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="hidden w-1/2 lg:flex lg:items-center lg:justify-center">
          <div className="relative h-3/4 w-3/4">
            <img src="/placeholder.svg?height=600&width=600" alt="Uniformes ilustración" />
          </div>
        </div>
      </div>
    </div>
  );
}
