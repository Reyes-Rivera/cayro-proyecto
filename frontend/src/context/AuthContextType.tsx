import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  loginApi,
  logOutApi,
  signUpApi,
  verifyCodeApi,
  verifyCodeApiAuth,
  verifyToken,
} from "@/api/auth";
import { User } from "@/types/User";

interface AuthContextType {
  user: User | null; // Usuario autenticado o null si no hay usuario
  login: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<unknown>;
  isAuthenticated: boolean;
  auth: boolean;
  loading: boolean;
  SignUp: (
    name: string,
    surname: string,
    email: string,
    phone: string,
    birthdate: Date,
    password: string,
    gender: string
  ) => Promise<User | unknown>;
  verifyCode: (email: string, code: string) => Promise<unknown>;
  error: string;
  emailToVerify: string | null;
  isVerificationPending: boolean;
  setEmailToVerify: (email: string | null) => void;
  setIsVerificationPending: (pending: boolean) => void;
  errorTimer: string;
  verifyCodeAuth: (email: string, code: string) => Promise<unknown>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorTimer, setErrorTimer] = useState("");
  const [emailToVerify, setEmailToVerify] = useState<string | null>(() => {
    return localStorage.getItem("emailToVerify") || null;
  });
  const [isVerificationPending, setIsVerificationPending] = useState<boolean>(
    () => {
      return localStorage.getItem("isVerificationPending") === "true";
    }
  );

  const login = async (email: string, password: string) => {
    try {
      const res = await loginApi({ email, password });
      if (res) {
        setEmailToVerify(email);
        setIsVerificationPending(true);
        localStorage.setItem("emailToVerify", email);
        localStorage.setItem("isVerificationPending", "true");
        return res.data; // Retorna los datos del usuario si el inicio de sesión es exitoso
      }
    } catch (error: any) {
      if (
        error.response?.data?.message.includes("Cuenta bloqueada temporalmente")
      ) {
        setErrorTimer(error.response?.data?.message);
      } else {
        setError(
          error.response?.data?.message ||
            "Error desconocido al iniciar sesión."
        );
      }
      throw error;
    }
    return null;
  };

  const SignUp = async (
    name: string,
    surname: string,
    email: string,
    phone: string,
    birthdate: Date,
    password: string,
    gender: string
  ) => {
    try {
      const res = await signUpApi({
        name,
        surname,
        email,
        phone,
        birthdate,
        password,
        gender,
      });
      if (res) {
        setEmailToVerify(email);
        setIsVerificationPending(true);
        localStorage.setItem("emailToVerify", email);
        localStorage.setItem("isVerificationPending", "true");
        return { success: true, data: res?.data };
      }
    } catch (error: unknown) {
      let errorMessage = "Error desconocido al registrar.";

      if (error instanceof Error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 2000);
      return { success: false, message: errorMessage };
    }
  };
  const verifyCode = async (email: string, code: string) => {
    try {
      const res = await verifyCodeApi(email, code);

      if (res.status === 201) {
        setIsVerificationPending(false);
        setEmailToVerify(null);
        localStorage.removeItem("emailToVerify");
        localStorage.removeItem("isVerificationPending");
      }

      return { status: res.status, data: res.data };
    } catch (error) {
      let errorMessage = "Error desconocido al verificar el código.";

      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
      return { status: 500, message: errorMessage };
    }
  };

  const verifyCodeAuth = async (email: string, code: string) => {
    try {
      const res = await verifyCodeApiAuth(email, code);

      if (res.status === 201) {
        setEmailToVerify(null);
        setUser({ ...res.data.user, birthdate: res.data.birthday });
        localStorage.setItem("token", res.data.token);
        setAuth(true);
        setUser(res.data);

        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
      }

      return { status: res.status, data: res.data };
    } catch (error) {
      let errorMessage = "Error desconocido al verificar el código.";

      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      setError(errorMessage);
      setTimeout(() => setError(""), 2000);

      return { status: 500, message: errorMessage };
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
      console.log(error);
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
    auth,
    loading,
    SignUp,
    verifyCode,
    error,
    emailToVerify,
    isVerificationPending,
    setEmailToVerify,
    verifyCodeAuth,
    errorTimer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
