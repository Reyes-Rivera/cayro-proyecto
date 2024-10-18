import axios from "axios";
const instance = axios.create({
    baseURL:"http://localhost:5000",
    // baseURL:"https://backend-rb7885074-gmailcom-reyesrivera21s-projects.vercel.app",
    withCredentials: true,
});

export default instance; 