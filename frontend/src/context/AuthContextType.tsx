import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "@/api/axios";
import {
  loginApi,
  logOutApi,
  signUpApi,
  verifyCodeApi,
  verifyCodeApiAuth,
  verifyToken,
  refreshTokenApi,
} from "@/api/auth";
import { User } from "@/types/User";

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<User | null>;
  verifyUser: () => Promise<User | null>;
  signOut: () => Promise<boolean>;
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
    () => localStorage.getItem("isVerificationPending") === "true"
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await loginApi({ identifier, password });
      if (res?.data?.user && res?.data?.accessToken) {
        setAuth(true);
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
        return res.data.user;
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
      if (res.status === 201 && res.data.accessToken) {
        setEmailToVerify(null);
        setUser({ ...res.data.user, birthdate: res.data.birthday });
        setAuth(true);
        setAccessToken(res.data.accessToken);
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
      setAccessToken(null);
      return true;
    }
    return false;
  };

  const verifyUser = async (): Promise<User | null> => {
    await verifyAuth();
    return user;
  };

  const verifyAuth = async () => {
    setLoading(true);
    try {
      const res = await verifyToken();
      if (res?.data) {
        setUser(res.data.user || res.data);
        setAuth(true);
        if (res.data.accessToken) {
          setAccessToken(res.data.accessToken);
        }
      } else {
        setUser(null);
        setAuth(false);
        setAccessToken(null);
      }
    } catch (error: any) {
      setUser(null);
      setAuth(false);
      setAccessToken(null);
      setError(error.response?.data?.message || "Sesión expirada");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        const isAuthError =
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/auth/login") &&
          !originalRequest.url.includes("/auth/refresh");

        if (!isAuthError) return Promise.reject(error);

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token: unknown) => {
              if (typeof token !== "string") throw new Error("Token inválido");
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await refreshTokenApi();
          const newToken = refreshResponse?.data?.accessToken;
          if (newToken) {
            setAccessToken(newToken);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            return axios(originalRequest);
          } else {
            throw new Error("No accessToken en la respuesta de refresh");
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          setAuth(false);
          setUser(null);
          setAccessToken(null);
          setError("Tu sesión expiró. Por favor inicia sesión nuevamente.");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    verifyAuth();
  }, []);

  const value: AuthContextType = {
    setIsVerificationPending,
    user,
    login,
    signOut,
    isAuthenticated: user !== null,
    auth,
    loading,
    SignUp,
    verifyCode,
    error,
    emailToVerify,
    setEmailToVerify,
    isVerificationPending,
    errorTimer,
    verifyCodeAuth,
    verifyUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
