import { User, UserLogin } from "@/types/User";
import axios from "./axios";

export const verifyToken = async () => {
  return axios.get("/auth/verifyToken", {
    withCredentials: true,
  });
};

export const loginApi = async (data: UserLogin) => {
  return axios.post("/auth/login", data, {
    withCredentials: true,
  });
};

export const refreshTokenApi = () =>
  axios.post("/auth/refresh", {
    withCredentials: true,
  });


export const logOutApi = async () => {
  return axios.post("/auth/logout", null, {
    withCredentials: true,
  });
};

export const signUpApi = async (data: User) => {
  return axios.post("/users", data, {
    withCredentials: true,
  });
};

export const verifyCodeApi = async (email: string, code: string) => {
  return axios.post(
    "/users/verify-code",
    { email, code },
    { withCredentials: true }
  );
};

export const verifyCodeApiAuth = async (email: string, code: string) => {
  return axios.post(
    "/auth/verify-code",
    { email, code },
    { withCredentials: true }
  );
};

export const resendCodeApi = async (email: object) => {
  return axios.post("/users/resend-code", email, {
    withCredentials: true,
  });
};

export const resendCodeApiAuth = async (email: object) => {
  return axios.post("/auth/resend-code", email, {
    withCredentials: true,
  });
};

export const recoverPassword = async (email: object) => {
  return axios.post("/users/recover-password", email);
};

export const restorePassword = async (
  token: string | undefined,
  password: object
) => {
  return axios.post(`/users/reset-password/${token}`, password);
};

export const getQuestions = () => axios.get("/securityquestion");

export const compareQuestion = async (data: object) =>
  axios.post("/users/compare-answer", data);
