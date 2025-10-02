import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  ) => Promise<{ success: boolean; data?: any; message?: string }>;
  verifyCode: (
    email: string,
    code: string
  ) => Promise<{ status: number; data?: any; message?: string }>;
  error: string;
  emailToVerify: string | null;
  isVerificationPending: boolean;
  setEmailToVerify: (email: string | null) => void;
  setIsVerificationPending: (pending: boolean) => void;
  errorTimer: string;
  verifyCodeAuth: (
    email: string,
    code: string
  ) => Promise<{ status: number; data?: any; message?: string }>;
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

// Helper functions for localStorage with error handling
const getStoredItem = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStoredItem = <T,>(key: string, value: T): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting ${key} in localStorage:`, error);
  }
};

const removeStoredItem = (key: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing ${key} from localStorage:`, error);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorTimer, setErrorTimer] = useState("");
  const [emailToVerify, setEmailToVerify] = useState<string | null>(() =>
    getStoredItem("emailToVerify", null)
  );
  const [isVerificationPending, setIsVerificationPending] = useState<boolean>(
    () => getStoredItem("isVerificationPending", false)
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isRefreshing = useRef(false);
  const failedQueue = useRef<
    Array<{ resolve: (value: any) => void; reject: (error: any) => void }>
  >([]);

  // Optimized effect for setting axios headers
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  // Memoized login function
  const login = useCallback(
    async (identifier: string, password: string): Promise<User | null> => {
      try {
        const res = await loginApi({ identifier, password });
        if (res?.data?.user && res?.data?.accessToken) {
          setAuth(true);
          setUser(res.data.user);
          setAccessToken(res.data.accessToken);
          setLoading(true);

          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            setLoading(false);
          });

          return res.data.user;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          "Error desconocido al iniciar sesión.";

        if (errorMessage.includes("Cuenta bloqueada temporalmente")) {
          setErrorTimer(errorMessage);
        } else {
          setError(errorMessage);
        }
        throw error;
      }
      return null;
    },
    []
  );

  // Memoized signup function
  const SignUp = useCallback(
    async (
      name: string,
      surname: string,
      email: string,
      phone: string,
      birthdate: Date,
      password: string,
      gender: string
    ): Promise<{ success: boolean; data?: any; message?: string }> => {
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
          setStoredItem("emailToVerify", email);
          setStoredItem("isVerificationPending", true);
          return { success: true, data: res?.data };
        }
        return { success: false, message: "No response from server" };
      } catch (error: unknown) {
        let errorMessage = "Error desconocido al registrar.";

        if (error instanceof Error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          errorMessage = axiosError.response?.data?.message || errorMessage;
        }

        setError(errorMessage);
        // Use setTimeout with clear timeout for better memory management
        setTimeout(() => {
          setError("");
        }, 2000);

        return { success: false, message: errorMessage };
      }
    },
    []
  );

  // Memoized verifyCode function
  const verifyCode = useCallback(
    async (
      email: string,
      code: string
    ): Promise<{ status: number; data?: any; message?: string }> => {
      try {
        const res = await verifyCodeApi(email, code);
        if (res.status === 201) {
          setIsVerificationPending(false);
          setEmailToVerify(null);
          removeStoredItem("emailToVerify");
          removeStoredItem("isVerificationPending");
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
    },
    []
  );

  // Memoized verifyCodeAuth function
  const verifyCodeAuth = useCallback(
    async (
      email: string,
      code: string
    ): Promise<{ status: number; data?: any; message?: string }> => {
      try {
        const res = await verifyCodeApiAuth(email, code);
        if (res.status === 201 && res.data.accessToken) {
          setEmailToVerify(null);
          setUser({ ...res.data.user, birthdate: res.data.birthday });
          setAuth(true);
          setAccessToken(res.data.accessToken);
          setLoading(true);

          requestAnimationFrame(() => {
            setLoading(false);
          });
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
    },
    []
  );

  // Memoized signOut function
  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      const res = await logOutApi();
      if (res) {
        setUser(null);
        setAuth(false);
        setAccessToken(null);
        return true;
      }
      return false;
    } catch (error) {
      console.warn("Error during sign out:", error);
      // Clear state even if API call fails
      setUser(null);
      setAuth(false);
      setAccessToken(null);
      return true;
    }
  }, []);

  // Memoized verifyUser function
  const verifyUser = useCallback(async (): Promise<User | null> => {
    await verifyAuth();
    return user;
  }, [user]);

  // Optimized verifyAuth function
  const verifyAuth = useCallback(async () => {
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
      requestAnimationFrame(() => {
        setLoading(false);
      });
    }
  }, []);

  // Optimized token refresh interceptor
  useEffect(() => {
    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.current.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue.current = [];
    };

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        const isAuthError =
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/login") &&
          !originalRequest.url?.includes("/auth/refresh");

        if (!isAuthError) return Promise.reject(error);

        if (isRefreshing.current) {
          return new Promise((resolve, reject) => {
            failedQueue.current.push({ resolve, reject });
          })
            .then((token: unknown) => {
              if (typeof token !== "string") throw new Error("Token inválido");
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return axios(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing.current = true;

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
          isRefreshing.current = false;
        }
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initial auth verification
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // Memoized setters for better performance
  const setEmailToVerifyMemoized = useCallback((email: string | null) => {
    setEmailToVerify(email);
    if (email === null) {
      removeStoredItem("emailToVerify");
    } else {
      setStoredItem("emailToVerify", email);
    }
  }, []);

  const setIsVerificationPendingMemoized = useCallback((pending: boolean) => {
    setIsVerificationPending(pending);
    setStoredItem("isVerificationPending", pending);
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    (): AuthContextType => ({
      user,
      login,
      signOut,
      verifyUser,
      isAuthenticated: user !== null,
      auth,
      loading,
      SignUp,
      verifyCode,
      error,
      emailToVerify,
      setEmailToVerify: setEmailToVerifyMemoized,
      isVerificationPending,
      setIsVerificationPending: setIsVerificationPendingMemoized,
      errorTimer,
      verifyCodeAuth,
    }),
    [
      user,
      login,
      signOut,
      verifyUser,
      auth,
      loading,
      SignUp,
      verifyCode,
      error,
      emailToVerify,
      setEmailToVerifyMemoized,
      isVerificationPending,
      setIsVerificationPendingMemoized,
      errorTimer,
      verifyCodeAuth,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
