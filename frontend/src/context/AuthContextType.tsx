// src/context/AuthContextType.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";

import api from "@/api/axios"; // <-- tu instancia axios (con baseURL y withCredentials)
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

/* =========================
 * Tipos de respuestas API
 * =======================*/
interface LoginResponse {
  user: User;
  accessToken: string;
}

interface VerifyTokenResponse {
  user: User;
  accessToken?: string; // por si tu backend lo manda también aquí
}

interface RefreshTokenResponse {
  accessToken: string;
  user?: User; // opcional: algunos backends lo incluyen, otros no
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  auth: boolean;
  loading: boolean;
  error: string;
  errorTimer: string;
  emailToVerify: string | null;
  isVerificationPending: boolean;

  login: (identifier: string, password: string) => Promise<User | null>;
  verifyUser: () => Promise<User | null>;
  signOut: () => Promise<boolean>;
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
  verifyCodeAuth: (
    email: string,
    code: string
  ) => Promise<{ status: number; data?: any; message?: string }>;
  setEmailToVerify: (email: string | null) => void;
  setIsVerificationPending: (pending: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

const IS_BROWSER = typeof window !== "undefined";

const getStoredItem = <T,>(key: string, def: T): T => {
  if (!IS_BROWSER) return def;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : def;
  } catch (e) {
    console.warn(`Error leyendo "${key}" de localStorage:`, e);
    return def;
  }
};

const setStoredItem = <T,>(key: string, value: T): void => {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error guardando "${key}" en localStorage:`, e);
  }
};

const removeStoredItem = (key: string): void => {
  if (!IS_BROWSER) return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Error eliminando "${key}" de localStorage:`, e);
  }
};

/* =========================
 * Provider
 * =======================*/
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [errorTimer, setErrorTimer] = useState("");

  const [emailToVerify, setEmailToVerifyState] = useState<string | null>(() =>
    getStoredItem("emailToVerify", null)
  );
  const [isVerificationPending, setIsVerificationPendingState] =
    useState<boolean>(() => getStoredItem("isVerificationPending", false));

  // El token se guarda en ref para que los interceptores siempre vean el último
  const accessTokenRef = useRef<string | null>(null);

  // Control de refresh concurrente
  const isRefreshing = useRef(false);
  const queue = useRef<
    Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }>
  >([]);

  /* -------------------------
   * Request interceptor:
   * añade Authorization si hay token
   * ------------------------*/
  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      if (accessTokenRef.current) {
        // asegura objeto headers
        config.headers = config.headers ?? {};
        // no usamos AxiosHeaders para evitar errores de tipos
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(reqId);
    };
  }, []);

  /* -------------------------
   * Response interceptor:
   * reintenta con refresh en 401
   * ------------------------*/
  useEffect(() => {
    const processQueue = (error: unknown, token?: string) => {
      queue.current.forEach(({ resolve, reject }) => {
        if (error || !token) reject(error);
        else resolve(token);
      });
      queue.current = [];
    };

    const resId = api.interceptors.response.use(
      (r) => r,
      async (err: any) => {
        const original = err?.config ?? {};
        const status = err?.response?.status as number | undefined;

        const isAuthEndpoint =
          typeof original.url === "string" &&
          (original.url.includes("/auth/login") ||
            original.url.includes("/auth/refresh"));

        if (status !== 401 || isAuthEndpoint || original._retry) {
          return Promise.reject(err);
        }

        if (isRefreshing.current) {
          // espera a que termine el refresh en curso
          return new Promise((resolve, reject) => {
            queue.current.push({
              resolve: (token) => {
                original.headers = original.headers ?? {};
                (original.headers as Record<string, string>)[
                  "Authorization"
                ] = `Bearer ${token}`;
                resolve(api(original));
              },
              reject,
            });
          });
        }

        original._retry = true;
        isRefreshing.current = true;

        try {
          const r = await refreshTokenApi();
          const data = r?.data as RefreshTokenResponse | undefined;
          const newToken = data?.accessToken;

          if (!newToken) throw new Error("Sin accessToken en /auth/refresh");

          accessTokenRef.current = newToken;

          // si el backend NO devuelve user aquí, pedimos verifyToken
          if (data?.user) {
            setUser(data.user);
          } else {
            try {
              const v = await verifyToken();
              const vData = v?.data as VerifyTokenResponse | undefined;
              setUser(vData?.user ?? null);
            } catch {
              // si falla verifyToken pero tenemos token, mantenemos sesión
              // y dejaremos que siguientes llamadas vuelvan a validar
            }
          }

          setAuth(true);
          processQueue(null, newToken);

          original.headers = original.headers ?? {};
          (original.headers as Record<string, string>)[
            "Authorization"
          ] = `Bearer ${newToken}`;
          return api(original);
        } catch (e) {
          processQueue(e);
          setAuth(false);
          setUser(null);
          accessTokenRef.current = null;
          setError("Tu sesión expiró. Inicia sesión nuevamente.");
          return Promise.reject(e);
        } finally {
          isRefreshing.current = false;
        }
      }
    );

    return () => {
      api.interceptors.response.eject(resId);
    };
  }, []);

  /* -------------------------
   * Acciones
   * ------------------------*/
  const login = useCallback(
    async (identifier: string, password: string): Promise<User | null> => {
      try {
        const res = await loginApi({ identifier, password });
        const data = res?.data as LoginResponse | undefined;

        if (data?.user && data?.accessToken) {
          accessTokenRef.current = data.accessToken;
          setUser(data.user);
          setAuth(true);
          // libera el hilo antes de quitar loading
          requestAnimationFrame(() => setLoading(false));
          return data.user;
        }

        setError("Respuesta inesperada del servidor.");
        return null;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ?? "Error desconocido al iniciar sesión.";
        if (String(msg).includes("Cuenta bloqueada temporalmente")) {
          setErrorTimer(msg);
        } else {
          setError(msg);
        }
        throw e;
      }
    },
    []
  );

  const SignUp = useCallback(
    async (
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
        setEmailToVerifyState(email);
        setIsVerificationPendingState(true);
        setStoredItem("emailToVerify", email);
        setStoredItem("isVerificationPending", true);
        return { success: true, data: res?.data };
      } catch (e: any) {
        const msg =
          e?.response?.data?.message ?? "Error desconocido al registrar.";
        setError(msg);
        setTimeout(() => setError(""), 2000);
        return { success: false, message: msg };
      }
    },
    []
  );

  const verifyCode = useCallback(async (email: string, code: string) => {
    try {
      const res = await verifyCodeApi(email, code);
      if (res.status === 201) {
        setIsVerificationPendingState(false);
        setEmailToVerifyState(null);
        removeStoredItem("emailToVerify");
        removeStoredItem("isVerificationPending");
      }
      return { status: res.status, data: res.data };
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        "Error desconocido al verificar el código.";
      setError(msg);
      return { status: 500, message: msg };
    }
  }, []);

  const verifyCodeAuth = useCallback(async (email: string, code: string) => {
    try {
      const res = await verifyCodeApiAuth(email, code);
      const data = res?.data as LoginResponse | undefined;

      if (res.status === 201 && data?.accessToken) {
        accessTokenRef.current = data.accessToken;
        setUser({ ...data.user });
        setAuth(true);
        requestAnimationFrame(() => setLoading(false));
      }
      return { status: res.status, data: res.data };
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        "Error desconocido al verificar el código.";
      setError(msg);
      setTimeout(() => setError(""), 2000);
      return { status: 500, message: msg };
    }
  }, []);

  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      await logOutApi();
    } catch (e) {
      console.warn("Error en logout:", e);
    } finally {
      setUser(null);
      setAuth(false);
      accessTokenRef.current = null;
    }
    return true;
  }, []);

  const verifyAuth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await verifyToken();
      const data = res?.data as VerifyTokenResponse | undefined;

      if (data?.user) {
        setUser(data.user);
        setAuth(true);
        if (data.accessToken) {
          accessTokenRef.current = data.accessToken;
        }
      } else {
        setUser(null);
        setAuth(false);
        accessTokenRef.current = null;
      }
    } catch (e: any) {
      setUser(null);
      setAuth(false);
      accessTokenRef.current = null;
      setError(e?.response?.data?.message ?? "Sesión expirada");
    } finally {
      requestAnimationFrame(() => setLoading(false));
    }
  }, []);

  const verifyUser = useCallback(async (): Promise<User | null> => {
    await verifyAuth();
    return user;
  }, [verifyAuth, user]);

  /* -------------------------
   * Montaje: verificar sesión
   * ------------------------*/
  useEffect(() => {
    // Sin ternario de expresión para contentar ESLint
    if (
      typeof (window as any).requestIdleCallback === "function" &&
      typeof (window as any).cancelIdleCallback === "function"
    ) {
      const id = (window as any).requestIdleCallback(
        () => {
          void verifyAuth();
        },
        { timeout: 2000 }
      );
      return () => (window as any).cancelIdleCallback(id);
    } else {
      const t = setTimeout(() => {
        void verifyAuth();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [verifyAuth]);

  /* -------------------------
   * Setters memorizados
   * ------------------------*/
  const setEmailToVerify = useCallback((email: string | null) => {
    setEmailToVerifyState(email);
    if (email === null) removeStoredItem("emailToVerify");
    else setStoredItem("emailToVerify", email);
  }, []);

  const setIsVerificationPending = useCallback((pending: boolean) => {
    setIsVerificationPendingState(pending);
    setStoredItem("isVerificationPending", pending);
  }, []);

  /* -------------------------
   * Context value
   * ------------------------*/
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: user !== null,
      auth,
      loading,
      error,
      errorTimer,
      emailToVerify,
      isVerificationPending,
      login,
      verifyUser,
      signOut,
      SignUp,
      verifyCode,
      verifyCodeAuth,
      setEmailToVerify,
      setIsVerificationPending,
    }),
    [
      user,
      auth,
      loading,
      error,
      errorTimer,
      emailToVerify,
      isVerificationPending,
      login,
      verifyUser,
      signOut,
      SignUp,
      verifyCode,
      verifyCodeAuth,
      setEmailToVerify,
      setIsVerificationPending,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
