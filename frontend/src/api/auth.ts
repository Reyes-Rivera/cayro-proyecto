import axios from "./axios";
import type { User, UserLogin } from "@/types/User";


export type AuthLoginResponse = {
  user: User;
  accessToken: string;
};

export type VerifyTokenResponse = {
  user: User;
  accessToken?: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
};

export const verifyToken = (opts?: { signal?: AbortSignal }) => {
  return axios.get<VerifyTokenResponse>("/auth/verifyToken", {
    withCredentials: true,
    signal: opts?.signal,
  });
};

export const loginApi = (data: UserLogin) => {
  return axios.post<AuthLoginResponse>("/auth/login", data, {
    withCredentials: true,
  });
};

export const refreshTokenApi = (opts?: { signal?: AbortSignal }) => {
  return axios.post<RefreshTokenResponse>("/auth/refresh", null, {
    withCredentials: true,
    signal: opts?.signal,
  });
};

export const logOutApi = () => {
  return axios.post("/auth/logout", null, {
    withCredentials: true,
  });
};


export const signUpApi = (data: User) => {
  return axios.post("/users", data, {
    withCredentials: true,
  });
};

export const verifyCodeApi = (email: string, code: string) => {
  return axios.post(
    "/users/verify-code",
    { email, code },
    { withCredentials: true }
  );
};

export const verifyCodeApiAuth = (email: string, code: string) => {
  return axios.post(
    "/auth/verify-code",
    { email, code },
    { withCredentials: true }
  );
};

export const resendCodeApi = (payload: { email: string }) => {
  return axios.post("/users/resend-code", payload, {
    withCredentials: true,
  });
};

export const resendCodeApiAuth = (payload: { email: string }) => {
  return axios.post("/auth/resend-code", payload, {
    withCredentials: true,
  });
};

export const recoverPassword = (payload: { email: string }) => {
  return axios.post("/users/recover-password", payload);
};

export const restorePassword = (
  token: string | undefined,
  payload: { password: string }
) => {
  return axios.post(`/users/reset-password/${token}`, payload);
};


export const getQuestions = () => axios.get("/securityquestion");

export const compareQuestion = (payload: Record<string, unknown>) =>
  axios.post("/users/compare-answer", payload);
