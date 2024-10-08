import { supabase } from '../supabase/supabase-configf';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 1. Definir la interfaz para el tipo de usuario
interface User {
  username: string;
  email: string;
}

// 2. Definir la interfaz para el contexto de autenticación
interface AuthContextType {
  user: User | null; // Usuario autenticado o null si no hay usuario
  signIn: (username: string, email: string) => void; 
  signOut: () => void; 
  isAuthenticated: boolean;
  signInWithGoogle:()=>void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// 5. Definir las propiedades del AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// 6. Crear el proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Estado del usuario

  // Función para iniciar sesión
  const signIn = (username: string, email: string) => {
    const newUser = { username, email };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const signInWithGoogle = async() => {
    try {
        const {data,error} = await supabase.auth.signInWithOAuth({
            provider:"google"
        })
        if(error) throw new Error("A ocurrido un error durante la autenticación.");
        localStorage.setItem("user", JSON.stringify(data))
        return data;
    } catch (error) {
        console.log(error)
    }
  }
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("supabase event: ", event);
        if (session == null) {
        } else {
          
          console.log("data del usuario", session?.user.user_metadata);
        }
      }
    );
    return () => {
      authListener.subscription;
    };
  }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = user !== null;

  const value = {
    user,
    signIn,
    signOut,
    isAuthenticated,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
