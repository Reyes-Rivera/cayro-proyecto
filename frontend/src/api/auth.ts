import { User, UserLogin } from "@/types/User";
import axios from "./axios";

export const verifyToken = async () => {
  const res = await axios.get("/auth/verifyToken", {
    withCredentials: true,
  });
  return res;
};

export const loginApi = async (data: UserLogin) => {
  return axios.post("/auth/login", data, {
    withCredentials: true, // Asegura que las cookies de sesión se envíen
  });
};

export const logOutApi = async () => {
  const res = await axios.post("/auth/logout", {
    withCredentials: true,
  });
  return res;
};

export const signUpApi = async (data: User) => {
  const res = await axios.post("/users", data, {});
  return res;
};

export const verifyCodeApi = async (email: string, code: string) => {
  const res = await axios.post("/users/verify-code", { email, code }, {});
  return res;
};

export const verifyCodeApiAuth = async (email: string, code: string) => {
  const res = await axios.post("/auth/verify-code", { email, code });
  return res;
};

export const resendCodeApi = async (email: object) => {
  const res = await axios.post("/users/resend-code", email);
  return res;
};

export const resendCodeApiAuth = async (email: object) => {
  const res = await axios.post("/auth/resend-code", email);
  return res;
};

export const recoverPassword = async (email: object) => {
  const res = await axios.post("/users/recover-password", email);
  return res;
};

export const restorePassword = async (token: string|undefined, password: object) => {
  const res = await axios.post(`/users/reset-password/${token}`, password);
  return res;
};
