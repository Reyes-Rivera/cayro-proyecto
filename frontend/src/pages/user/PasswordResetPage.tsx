import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Check, EyeOff, Eye, ShieldCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { User } from '@/types/User'
import { useNavigate, useParams } from 'react-router-dom'
import { restorePassword } from '@/api/auth'
export default function PasswordResetPage() {
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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit, clearErrors, formState: { errors } } = useForm<User>();

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


    const { token } = useParams();

    // Manejador de envío del formulario
    const onSubmit = handleSubmit(async (data: User) => {

        if (Object.values(passwordChecks).every(Boolean)) {
            try {
                const res = await restorePassword(token, { password: data.password });
                if (res) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Contraseña actualizada.',
                        text: "Tu contraseña ha sido restablecida, por favor inicie sesión.",
                        confirmButtonColor: '#2F93D1',
                    });
                    navigate("/login");
                    setIsSubmitted(true);
                }

            } catch (error: any) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Contraseña.',
                    text: error?.response?.data?.message,
                    confirmButtonColor: '#2F93D1',
                });
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
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row items-center justify-center p-4 md:p-0">
            <Card className="w-full max-w-md md:max-w-4xl flex flex-col md:flex-row shadow-lg">
                <CardContent className="p-6 md:w-1/2 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-2xl font-bold">Restablecer contraseña</CardTitle>
                        <CardDescription>Crea una nueva contraseña para tu cuenta</CardDescription>
                    </CardHeader>
                    {!isSubmitted ? (
                        <form onSubmit={onSubmit} className="space-y-4">
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
                                        className="appearance-none rounded-md relative block w-full px-3 py-2 border 
                                        border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                        focus:ring-[#0099FF] focus:border-[#0099FF] focus:z-10 sm:text-sm mt-1"
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
                                                <span className="text-sm font-medium text-gray-700">
                                                    Fortaleza de la contraseña:</span>
                                                <span
                                                    className={`text-sm font-medium 
                                                    ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
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
                            <div>
                                <Label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">
                                    Confirmar contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        {...register("confirmPassword", {
                                            required: "La confirmación de la contraseña es requerida",
                                            validate: (value) => value === password || "Las contraseñas no coinciden",
                                        })}
                                        id="password-confirm"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        className={`appearance-none rounded-md relative block w-full px-3 py-2 border
                                             placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#0099FF] 
                                             focus:z-10 sm:text-sm mt-1`
                                        }
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
                                {errors.confirmPassword && <span className="text-red-500 text-[10px]">
                                    {errors.confirmPassword.message}
                                </span>}
                            </div>
                            {/* {
                                error.length > 0 && (
                                    <p className="text-red-500 text-[12px] text-center">{error}</p>
                                )
                            } */}
                            <Button type="submit"
                                className="w-full bg-[#2F93D1] hover:bg-[#007ACC] focus:ring-[#0099FF] text-white">
                                Restablecer contraseña
                            </Button>
                        </form>
                    ) : (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertTitle>Contraseña restablecida con éxito</AlertTitle>
                            <AlertDescription>
                                Tu nueva contraseña ha sido configurada. Ahora puedes iniciar sesión con tu nueva contraseña.
                            </AlertDescription>
                            <Button className="mt-4 w-full" onClick={() => console.log('Redirect to login page')}>
                                Ir al inicio de sesión
                            </Button>
                        </Alert>
                    )}
                </CardContent>
                <div className="md:w-1/2 bg-gray-200 p-6 flex flex-col justify-center items-center text-center">
                    <div className="mb-6">
                        <ShieldCheck className="h-24 w-24 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Crea una contraseña segura</h2>
                    <p className="text-gray-600 mb-4">
                        Tu nueva contraseña debe ser diferente de las contraseñas anteriores
                        y cumplir con los siguientes requisitos:
                    </p>
                    <ul className="text-sm text-gray-500 list-disc list-inside text-left">
                        <li>Al menos 8 caracteres de longitud</li>
                        <li>Incluir al menos una letra mayúscula</li>
                        <li>Incluir al menos un número</li>
                        <li>Incluir al menos un carácter especial</li>
                    </ul>
                </div>
            </Card>
        </div>
    )
}