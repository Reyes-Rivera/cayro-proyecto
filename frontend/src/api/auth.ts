import { User, UserLogin } from "@/types/User";
import axios from "./axios";

export const verifyToken = () => axios.get("/auth/verifyToken", {
   withCredentials: true,
});

export const loginApi = (data:UserLogin) => axios.post("/auth/login",data,{withCredentials: true});

export const logOutApi = () => axios.post("/auth/logout");

export const signUpApi = (data:User) => axios.post("/users",data);

export const verifyCodeApi  = (email:string,code:string) => axios.post("/users/verify-code",{email,code});

export const verifyCodeApiAuth  = (email:string,code:string) => axios.post("/auth/verify-code",{email,code});

export const resendCodeApi  = (email:any) => axios.post("/users/resend-code",email);

export const resendCodeApiAuth  = (email:any) => axios.post("/auth/resend-code",email);

