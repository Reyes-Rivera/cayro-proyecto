import { User, UserLogin } from "@/types/User";
import axios from "./axios";

export const loginApi = (data:UserLogin) => axios.post("/auth/login",data);
export const signUpApi = (data:User) => axios.post("/users",data);