import { supabase } from '../supabase/supabase-configf';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginApi, logOutApi, signUpApi, verifyCodeApi, verifyCodeApiAuth, verifyToken } from "@/api/auth"; // Asegúrate de tener la función `verifyCodeApi`
import { User } from '@/types/User';

interface AuthContextType {
  user: User | null; // Usuario autenticado o null si no hay usuario
  login: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<any>;
  isAuthenticated: boolean;
  signInWithGoogle: () => void;
  auth: Boolean;
  loading: Boolean;
  SignUp: (name: string, surname: string, email: string, phone: string, birthday: Date, password: string) => Promise<User | null>;
  verifyCode: (email: string, code: string) => Promise<any>;
  error: string;
  emailToVerify: string | null; // Nuevo estado para almacenar el correo que está siendo verificado
  isVerificationPending: boolean; // Estado para saber si se requiere la verificación del código
  setEmailToVerify: (email: string | null) => void;
  setIsVerificationPending: (pending: boolean) => void;
  errorTimer: string;
  verifyCodeAuth: (email: string, code: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Estado del usuario
  const [auth, setAuth] = useState<Boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorTimer, setErrorTimer] = useState("");
  const [emailToVerify, setEmailToVerify] = useState<string | null>(() => {
    return localStorage.getItem('emailToVerify') || null; // Recupera el email desde localStorage si existe
  });
  const [isVerificationPending, setIsVerificationPending] = useState<boolean>(() => {
    return localStorage.getItem('isVerificationPending') === 'true'; // Recupera el estado de verificación desde localStorage
  });

  console.log(user)

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi({ email, password });
      if (res) {
        setEmailToVerify(email); // Establecer el correo que será verificado
        setIsVerificationPending(true); // Indicar que el usuario necesita verificar su correo
        localStorage.setItem('emailToVerify', email); // Guardar en localStorage para persistencia
        localStorage.setItem('isVerificationPending', 'true');
        return res.data;
      }
    } catch (error: any) {
      if (error.response?.data?.message.includes('Cuenta bloqueada temporalmente')) {
        setErrorTimer(error.response?.data?.message);
      } else {
        setError(error.response?.data?.message || "Error desconocido al iniciar sesión.");
        setTimeout(() => {
          setError("");
        }, 2000);
      }

    }
  };

  const SignUp = async (name: string, surname: string, email: string, phone: string, birthday: Date, password: string) => {
    try {
      const res = await signUpApi({ name, surname, email, phone, birthday, password });
      if (res) {
        setEmailToVerify(email); // Establecer el correo que será verificado
        setIsVerificationPending(true); // Indicar que el usuario necesita verificar su correo
        localStorage.setItem('emailToVerify', email); // Guardar en localStorage para persistencia
        localStorage.setItem('isVerificationPending', 'true');
      }
      return res?.data;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error desconocido al registrar.";
      setError(errorMsg);
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };
  const verifyCode = async (email: string, code: string) => {
    try {
      const res = await verifyCodeApi(email, code);
      if (res.status === 201) {
        setIsVerificationPending(false); // Marcar como verificado
        setEmailToVerify(null); // Limpiar el correo verificado
        localStorage.removeItem('emailToVerify'); // Eliminar del localStorage
        localStorage.removeItem('isVerificationPending'); // Eliminar del localStorage
      }
      return res;
    } catch (error: any) {
      setError(error.response?.data?.message || "Error desconocido al verificar el código.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return error;
    }
  };

  const verifyCodeAuth = async (email: string, code: string) => {
    try {
      const res = await verifyCodeApiAuth(email, code);
      if (res.status === 201) {
        setEmailToVerify(null);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        setLoading(true);
        setAuth(true);
        setUser(res.data);
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      }
      return res;
    } catch (error: any) {
      setError(error.response?.data?.message || "Error desconocido al verificar el código.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return error;
    }
  };
  const signOut = async () => {
    const res = await logOutApi();
    if (res) {
      setUser(null);
      setAuth(false);
      return true;
    }
    return false;
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google"
      });
      if (error) throw new Error("Ha ocurrido un error durante la autenticación.");
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
    }
  };
  const verifyAuth = async () => {
    setLoading(true);
    try {
      const res = await verifyToken();
      if (res) {
        setUser(res.data);
        setAuth(true);
        setLoading(false);
      } else {
        setLoading(false);
        setAuth(false);
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      setAuth(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    verifyAuth();
  }, []);


  const isAuthenticated = user !== null;

  const value = {
    setIsVerificationPending,
    user,
    login,
    signOut,
    isAuthenticated,
    signInWithGoogle,
    auth,
    loading,
    SignUp,
    verifyCode, // Añadir la función de verificación al contexto
    error,
    emailToVerify,
    isVerificationPending,
    setEmailToVerify,
    verifyCodeAuth,
    errorTimer// Setter para actualizar `emailToVerify`
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
