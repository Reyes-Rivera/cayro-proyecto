import { supabase } from '../supabase/supabase-configf';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginApi, signUpApi } from "@/api/auth";
import { User } from '@/types/User';
// 2. Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null; // Usuario autenticado o null si no hay usuario
  login: (email: string, password: string) => Promise<User | null>;
  signOut: () => void;
  isAuthenticated: boolean;
  signInWithGoogle: () => void;
  auth: Boolean,
  loading: Boolean,
  SignUp: (name: string, surname: string, email: string, phone: string, birthday: Date, password: string) => Promise<User | null>;
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

// 6. Crear el proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Estado del usuario
  const [token, setToken] = useState("");
  const [auth, setAuth] = useState<Boolean>(false);
  const [loading, setLoading] = useState(true);
  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi({ email, password });
      if (res) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setAuth(true);
        return res.data.user;
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  };
  const SignUp = async (name: string, surname: string, email: string, phone: string, birthday: Date, password: string) => {
    try {
      const res = await signUpApi({name, surname, email, phone, birthday, password});
      console.log(res)
      return res.data;
    } catch (error) {
      console.log(error)
    }

  }
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google"
      })
      if (error) throw new Error("A ocurrido un error durante la autenticación.");
      localStorage.setItem("user", JSON.stringify(data))
      return data;
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {
  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     async (event, session) => {
  //       console.log("supabase event: ", event);
  //       if (session == null) {
  //       } else {

  //         console.log("data del usuario", session?.user.user_metadata);
  //       }
  //     }
  //   );
  //   return () => {
  //     authListener.subscription;
  //   };
  // }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = user !== null;

  const value = {
    user,
    login,
    signOut,
    isAuthenticated,
    signInWithGoogle,
    auth,
    loading,
    SignUp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
