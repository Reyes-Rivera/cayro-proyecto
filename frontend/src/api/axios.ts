import axios from "axios";
const instance = axios.create({
    // baseURL:"http://localhost:5000",
    // baseURL:"https://cayro-proyecto-production.up.railway.app",
    baseURL:"https://cayro-backend.vercel.app",
    withCredentials: true,
});

export default instance; 