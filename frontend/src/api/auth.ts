import { User, UserLogin } from "@/types/User";
import axios from "./axios";

export const loginApi = (data:UserLogin) => axios.post("/auth/login",data);
export const signUpApi = (data:User) => axios.post("/users",data);

export const verifyCodeApi  = (email:string,code:string) => axios.post("/users/verify-code",{email,code});

export const resendCodeApi  = (email:any) => axios.post("/users/resend-code",email);