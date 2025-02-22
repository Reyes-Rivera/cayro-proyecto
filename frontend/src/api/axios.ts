import axios from "axios";
const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
const instance = axios.create({
  baseURL: apiUrl,
  // baseURL:"https://cayro-backend.vercel.app",
  withCredentials: true,
});

export default instance;
